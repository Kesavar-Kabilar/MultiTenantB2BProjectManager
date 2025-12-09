CREATE TABLE IF NOT EXISTS tenant (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    tenant_name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    tenant_id INTEGER NOT NULL, 
    user_name TEXT NOT NULL, 
    email TEXT NOT NULL UNIQUE, 
    user_password TEXT NOT NULL, 
    user_role TEXT NOT NULL DEFAULT 'Contributor' CHECK (user_role IN ('Admin', 'Manager', 'Contributor')), 
    FOREIGN KEY (tenant_id) REFERENCES tenant(id)
);

CREATE TABLE IF NOT EXISTS project (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    tenant_id INTEGER NOT NULL, 
    project_name TEXT NOT NULL, 
    project_status TEXT NOT NULL DEFAULT 'Active' CHECK (project_status IN ('Active', 'On Hold', 'Completed')), 
    created_date DATE NOT NULL, 
    target_date DATE,
    FOREIGN KEY (tenant_id) REFERENCES tenant(id), 
    UNIQUE (tenant_id, project_name)
);

CREATE TABLE IF NOT EXISTS task (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    tenant_id INTEGER NOT NULL, 
    project_id INTEGER NOT NULL, 
    title TEXT NOT NULL, 
    task_description TEXT NOT NULL, 
    task_status TEXT NOT NULL DEFAULT 'To Do' CHECK (task_status IN ('To Do', 'In Progress', 'Blocked', 'Done')), 
    task_priority TEXT NOT NULL DEFAULT 'Low' CHECK (task_priority IN ('High', 'Low')), 
    assignee INTEGER NOT NULL, 
    due_date DATE, 
    task_timestamps DATE, 
    FOREIGN KEY (tenant_id) REFERENCES tenant(id), 
    FOREIGN KEY (project_id) REFERENCES project(id), 
    FOREIGN KEY (assignee) REFERENCES user(id)
);

CREATE TABLE IF NOT EXISTS discussion (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    tenant_id INTEGER NOT NULL, 
    task_id INTEGER NOT NULL, 
    title TEXT NOT NULL, 
    body TEXT NOT NULL, 
    discussion_status TEXT NOT NULL DEFAULT 'Open' CHECK (discussion_status IN ('Open', 'Responded', 'Resolved', 'Archived')), 
    created_by INTEGER NOT NULL, 
    created_at DATETIME, 
    FOREIGN KEY (tenant_id) REFERENCES tenant(id), 
    FOREIGN KEY (task_id) REFERENCES task(id), 
    FOREIGN KEY (created_by) REFERENCES user(id)
);

