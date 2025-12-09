from random import choice
from password import hash_password

FILE_NAME = "./server/initialize_data.sql"

TENANTS = 2
USERS = 6
USER_ROLES = ['Admin', 'Manager', 'Contributor']
PROJECTS = 4
PROJECT_STATUS = ['Active', 'On Hold', 'Completed']
TASKS = 40
TASK_STATUS = ['To Do', 'In Progress', 'Blocked', 'Done']
TASK_PRIORITY = ['High', 'Low']
DISCUSSIONS = 10
DISCUSSION_STATUS = ['Open', 'Responded', 'Resolved', 'Archived']

TENANTS_USERS = {}
TENANTS_PROJECTS = {}
TENANTS_TASKS = {}

# Insert Tenants
all_tenants = [f"({t}, 'tenant_name_{t}')" for t in range(TENANTS)]
insert_tenants = f"INSERT INTO tenant (id, tenant_name) \nVALUES \n\t" + ", \n\t".join(all_tenants) + ";\n\n"


# Insert Users
all_users = []
for u in range(USERS):
    t = u // (USERS // TENANTS)
    r = USER_ROLES[u % len(USER_ROLES)]
    password = hash_password(f"user_{u}@example.com")
    command = f"({u}, {t}, 'user_{u}', 'user_{u}@example.com', '{password}', '{r}')"
    all_users.append(command)

    if t not in TENANTS_USERS:
        TENANTS_USERS[t] = []
    TENANTS_USERS[t].append(u)

insert_users = f"INSERT INTO user (id, tenant_id, user_name, email, user_password, user_role) \nVALUES \n\t" + ", \n\t".join(all_users) + ";\n\n"


# Insert Projects
all_projects = []
for p in range(PROJECTS):
    t = p // (PROJECTS // TENANTS)
    proj_stat = choice(PROJECT_STATUS)
    command = f"({p}, {t}, 'proj_name_{p}', '{proj_stat}', DATE('now'), DATE('now'))"
    all_projects.append(command)

    if t not in TENANTS_PROJECTS:
        TENANTS_PROJECTS[t] = []
    TENANTS_PROJECTS[t].append(p)

insert_projects = f"INSERT INTO project (id, tenant_id, project_name, project_status, created_date, target_date) \nVALUES \n\t" + ", \n\t".join(all_projects) + ";\n\n"

# Insert Tasks
all_tasks = []
for ta in range(TASKS):
    t = ta // (TASKS // TENANTS)
    p = choice(TENANTS_PROJECTS[t])
    task_stat = choice(TASK_STATUS)
    task_prior = choice(TASK_PRIORITY)
    u = choice(TENANTS_USERS[t])
    command = f"({ta}, {t}, {p}, 'title_{ta}', 'task_description_{ta}', '{task_stat}', '{task_prior}', '{u}', DATE('now'), DATE('now'))"
    all_tasks.append(command)

    if t not in TENANTS_TASKS:
        TENANTS_TASKS[t] = []
    TENANTS_TASKS[t].append(ta)

insert_tasks = f"INSERT INTO task (id, tenant_id, project_id, title, task_description, task_status, task_priority, assignee, due_date, task_timestamps) \nVALUES \n\t" + ", \n\t".join(all_tasks) + ";\n\n"



all_discussions = []
for d in range(DISCUSSIONS):
    t = d // (DISCUSSIONS // TENANTS)
    ta = choice(TENANTS_TASKS[t])
    ds = choice(DISCUSSION_STATUS)
    u = choice(TENANTS_USERS[t])
    command = f"({d}, {t}, {ta}, 'title_{d}', 'body_{d}', '{ds}', {u}, DATETIME('now'))"
    all_discussions.append(command)

insert_discussions = f"INSERT INTO discussion (id, tenant_id, task_id, title, body, discussion_status, created_by, created_at) \nVALUES \n\t" + ", \n\t".join(all_discussions) + ";"



with open(FILE_NAME,'w') as f:
    f.write(insert_tenants)
    f.write(insert_users)
    f.write(insert_projects)
    f.write(insert_tasks)
    f.write(insert_discussions)