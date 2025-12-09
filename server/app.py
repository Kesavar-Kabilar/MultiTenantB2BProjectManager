import sqlite3
from flask import Flask, request, g, jsonify
from flask_cors import CORS
import os
from datetime import datetime
from password import check_password

ROOT = "./"
SERVER = "./server"
DATABASE = 'database.db'
if os.path.exists(DATABASE):
    os.remove(DATABASE)

app = Flask(__name__, root_path=ROOT)
CORS(app)

# Database Functions

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        db.row_factory = sqlite3.Row
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

def init_db():
    with app.app_context():
        db = get_db()
        with open(f"{SERVER}/schema.sql", 'r') as f:
            sql_script = f.read()
        
        db.executescript(sql_script)
        
        with open(f"{SERVER}/initialize_data.sql", 'r') as f:
            sql_data = f.read()

        db.executescript(sql_data)
        db.commit()

# Server Endpoints

@app.route('/api/login', methods=['POST'])
def login():
    """
    Login API
    Check whether the user entered password matches the hashed password in the database.
    """
    db = get_db()

    data = request.get_json(silent=True)

    if data is None:
        return jsonify({'error': 'Missing or invalid JSON data'}), 400

    email = data.get('email')
    user_password = data.get('password')

    user_row = db.execute(
        'SELECT * FROM user WHERE email = ?',
        (email,) # Pass the variables as a tuple
    ).fetchone()

    match = check_password(user_password, dict(user_row)['user_password'])
    
    if match:
        return jsonify({'message': 'Login successful', 'user': dict(user_row)}), 200
    else:
        return jsonify({'error': 'Invalid credentials'}), 401
    
@app.route('/api/data', methods=['POST'])
def data():
    """
    Data API
    Get the projects, tasks, and discussions database for the specific associated tenant.
    """
    db = get_db()

    data = request.get_json(silent=True)

    if data is None:
        return jsonify({'error': 'Missing or invalid JSON data'}), 400

    tenant_id = data.get('tenant_id')

    projects_rows = db.execute('SELECT id, project_name AS Project_Name, project_status AS Project_Status, created_date AS Created_Date, target_date AS Target_Date FROM project WHERE tenant_id = ?', (tenant_id,)).fetchall()
    projects = [dict(row) for row in projects_rows]

    tasks_rows = db.execute('SELECT id, project_id AS Project_ID, title AS Title, task_description AS Task_Description, task_priority AS Task_Priority, task_status AS Task_Status, task_timestamps AS Task_Timestamps, assignee AS Assignee, due_date AS Due_Date FROM task WHERE tenant_id = ?', (tenant_id,)).fetchall()
    tasks = [dict(row) for row in tasks_rows]
    
    discussions_rows = db.execute('SELECT id, title AS Title, body AS Body, task_id AS Task_ID, discussion_status AS Discussion_Status, created_by AS Created_By, created_at AS Created_At FROM discussion WHERE tenant_id = ?', (tenant_id,)).fetchall()
    discussions = [dict(row) for row in discussions_rows]
    
    return jsonify({
        'projects': projects,
        'tasks': tasks,
        'discussions': discussions
    })

@app.route('/api/insert_projects', methods=['POST'])
def insert_projects():
    """
    Insert Projects API
    Insert a newly created project into the database
    """
    data = request.get_json()
    if 'user_role' not in data or data['user_role'] == 'Contributor':
        return jsonify({"error": "Invalid Permissions"}), 400

    required = ['tenant_id', 'Project_Name', 'Created_Date']

    if not all(k in data for k in required): 
        return jsonify({"error": "Missing fields"}), 400
    
    tenant_id = data['tenant_id']
    project_name = data['Project_Name']
    project_status = data.get('Status', 'Active')
    created_date = data['Created_Date']
    target_date = data.get('Target_Date')

    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO project (tenant_id, project_name, project_status, created_date, target_date) VALUES (?, ?, ?, ?, ?)", 
                       (tenant_id, project_name, project_status, created_date, target_date))
        conn.commit()
        return jsonify({"message": "Project created", "id": cursor.lastrowid}), 201
    except sqlite3.IntegrityError: return jsonify({"error": "Project name already exists for this tenant"}), 409
    except Exception as e: return jsonify({"error": str(e)}), 500

@app.route('/api/insert_tasks', methods=['POST'])
def insert_task():
    """
    Insert Tasks API
    Insert a newly created task into the database
    """
    data = request.get_json()
    if 'user_role' not in data or data['user_role'] == 'Contributor':
        return jsonify({"error": "Invalid Permissions"}), 400
    
    required = ['tenant_id', 'Project_ID', 'Title', 'Description', 'Assignee']

    if not all(k in data for k in required): 
        return jsonify({"error": "Missing fields"}), 400

    keys = ['tenant_id', 'Project_ID', 'Title', 'Description', 'Assignee']
    values = [data[k] for k in keys]
    values += [data.get('task_status', 'To Do'), data.get('Priority', 'Low'), data.get('DueDate'), data.get('Task_Timestamps')]

    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO task (tenant_id, project_id, title, task_description, assignee, task_status, task_priority, due_date, task_timestamps) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", 
                       values)
        conn.commit()
        return jsonify({"message": "Task created", "id": cursor.lastrowid}), 201
    except sqlite3.IntegrityError: return jsonify({"error": "Invalid Project ID or Assignee ID"}), 400
    except Exception as e: return jsonify({"error": str(e)}), 500

@app.route('/api/insert_discussions', methods=['POST'])
def insert_discussion():
    """
    Insert Discussions API
    Insert a newly created discussions into the database
    """
    data = request.get_json()

    if 'user_role' not in data or data['user_role'] == 'Contributor':
        return jsonify({"error": "Invalid Permissions"}), 400
    
    required = ['tenant_id', 'Task_ID', 'Title', 'Body', 'Created_By']

    if not all(k in data for k in required): 
        return jsonify({"error": "Missing fields"}), 400
    
    keys = ['tenant_id', 'Task_ID', 'Title', 'Body', 'Created_By']
    values = [data[k] for k in keys]
    values += [data.get('Status', 'Open'), datetime.now().strftime('%Y-%m-%d %H:%M:%S')]

    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO discussion (tenant_id, task_id, title, body, created_by, discussion_status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)", 
                       values)
        conn.commit()
        return jsonify({"message": "Discussion started", "id": cursor.lastrowid}), 201
    except sqlite3.IntegrityError: return jsonify({"error": "Invalid Task ID or User ID for created_by"}), 400
    except Exception as e: return jsonify({"error": str(e)}), 500

@app.route('/api/update_data', methods=['POST'])
def update_data():
    """
    Update Data API
    Update any row in the projects, tasks, or discussions table when updated through the inline edits.
    """
    data = request.get_json()
    if 'user_role' not in data or data['user_role'] == 'Contributor':
        return jsonify({"error": "Invalid Permissions"}), 400
    
    required = ['type', 'headerKey', 'inputValue', 'id']

    if not all(k in data for k in required): 
        return jsonify({"error": "Missing fields"}), 400

    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(f"UPDATE {data['type']} SET {data['headerKey'].lower()} = ? WHERE id = ?", 
                       (data['inputValue'], data['id']))
        conn.commit()
        return jsonify({"message": "Updated Data Successfully", "id": data['id']}), 201
    except sqlite3.IntegrityError: return jsonify({"error": "Invalid Values"}), 400
    except Exception as e: return jsonify({"error": str(e)}), 500

# Run the Application

if __name__ == '__main__':
    # Initialize the database (run this once)
    init_db()
    # Run the Flask development server
    app.run(debug=True)