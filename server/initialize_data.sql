INSERT INTO tenant (id, tenant_name) 
VALUES 
	(0, 'tenant_name_0'), 
	(1, 'tenant_name_1');

INSERT INTO user (id, tenant_id, user_name, email, user_password, user_role) 
VALUES 
	(0, 0, 'user_0', 'user_0@example.com', '$2b$12$TEy.XsUUl.DRryzkEj/Bh.yZH9eQ8eeojViUYKdqd4zgPN3ZeYN76', 'Admin'), 
	(1, 0, 'user_1', 'user_1@example.com', '$2b$12$aCCRfCz7FcKgQsLIaiPQbegEl0f2VWBV8hy1JMC4CqrPWHhrdx5vO', 'Manager'), 
	(2, 0, 'user_2', 'user_2@example.com', '$2b$12$sPXOSUJdmv1pPL0A4LhNXeSxLxV1FOgWN7bz6fYzmmOyhBlVwpiHe', 'Contributor'), 
	(3, 1, 'user_3', 'user_3@example.com', '$2b$12$vE2Z7rq2mxgPsr0lmwIp6.QeRbVT5AFwHeutXWJM/M8eGIk7kp1xy', 'Admin'), 
	(4, 1, 'user_4', 'user_4@example.com', '$2b$12$KN2IWNo.c..Q.rZg/AyEl.s9KTC1kV0YKJOAGT1Q4bPoMsdHXgyNe', 'Manager'), 
	(5, 1, 'user_5', 'user_5@example.com', '$2b$12$8CPemyC1PqqybwtAJi61DO2xFlaivnI.EAb71QYrrONgHKBVGq7o.', 'Contributor');

INSERT INTO project (id, tenant_id, project_name, project_status, created_date, target_date) 
VALUES 
	(0, 0, 'proj_name_0', 'Active', DATE('now'), DATE('now')), 
	(1, 0, 'proj_name_1', 'Completed', DATE('now'), DATE('now')), 
	(2, 1, 'proj_name_2', 'Active', DATE('now'), DATE('now')), 
	(3, 1, 'proj_name_3', 'Active', DATE('now'), DATE('now'));

INSERT INTO task (id, tenant_id, project_id, title, task_description, task_status, task_priority, assignee, due_date, task_timestamps) 
VALUES 
	(0, 0, 0, 'title_0', 'task_description_0', 'To Do', 'Low', '1', DATE('now'), DATE('now')), 
	(1, 0, 1, 'title_1', 'task_description_1', 'Done', 'Low', '0', DATE('now'), DATE('now')), 
	(2, 0, 0, 'title_2', 'task_description_2', 'In Progress', 'High', '2', DATE('now'), DATE('now')), 
	(3, 0, 1, 'title_3', 'task_description_3', 'Blocked', 'Low', '2', DATE('now'), DATE('now')), 
	(4, 0, 1, 'title_4', 'task_description_4', 'To Do', 'Low', '2', DATE('now'), DATE('now')), 
	(5, 0, 1, 'title_5', 'task_description_5', 'To Do', 'Low', '2', DATE('now'), DATE('now')), 
	(6, 0, 0, 'title_6', 'task_description_6', 'To Do', 'High', '1', DATE('now'), DATE('now')), 
	(7, 0, 1, 'title_7', 'task_description_7', 'Blocked', 'High', '0', DATE('now'), DATE('now')), 
	(8, 0, 1, 'title_8', 'task_description_8', 'In Progress', 'High', '0', DATE('now'), DATE('now')), 
	(9, 0, 1, 'title_9', 'task_description_9', 'To Do', 'High', '2', DATE('now'), DATE('now')), 
	(10, 0, 1, 'title_10', 'task_description_10', 'In Progress', 'High', '1', DATE('now'), DATE('now')), 
	(11, 0, 0, 'title_11', 'task_description_11', 'Done', 'High', '2', DATE('now'), DATE('now')), 
	(12, 0, 0, 'title_12', 'task_description_12', 'To Do', 'Low', '1', DATE('now'), DATE('now')), 
	(13, 0, 0, 'title_13', 'task_description_13', 'To Do', 'High', '2', DATE('now'), DATE('now')), 
	(14, 0, 0, 'title_14', 'task_description_14', 'In Progress', 'Low', '1', DATE('now'), DATE('now')), 
	(15, 0, 0, 'title_15', 'task_description_15', 'Blocked', 'Low', '1', DATE('now'), DATE('now')), 
	(16, 0, 1, 'title_16', 'task_description_16', 'In Progress', 'Low', '2', DATE('now'), DATE('now')), 
	(17, 0, 0, 'title_17', 'task_description_17', 'To Do', 'Low', '2', DATE('now'), DATE('now')), 
	(18, 0, 1, 'title_18', 'task_description_18', 'To Do', 'High', '0', DATE('now'), DATE('now')), 
	(19, 0, 0, 'title_19', 'task_description_19', 'To Do', 'High', '1', DATE('now'), DATE('now')), 
	(20, 1, 3, 'title_20', 'task_description_20', 'Done', 'High', '4', DATE('now'), DATE('now')), 
	(21, 1, 3, 'title_21', 'task_description_21', 'To Do', 'High', '5', DATE('now'), DATE('now')), 
	(22, 1, 3, 'title_22', 'task_description_22', 'In Progress', 'Low', '5', DATE('now'), DATE('now')), 
	(23, 1, 3, 'title_23', 'task_description_23', 'To Do', 'High', '5', DATE('now'), DATE('now')), 
	(24, 1, 2, 'title_24', 'task_description_24', 'Blocked', 'Low', '3', DATE('now'), DATE('now')), 
	(25, 1, 2, 'title_25', 'task_description_25', 'To Do', 'Low', '4', DATE('now'), DATE('now')), 
	(26, 1, 3, 'title_26', 'task_description_26', 'Done', 'Low', '4', DATE('now'), DATE('now')), 
	(27, 1, 2, 'title_27', 'task_description_27', 'In Progress', 'Low', '5', DATE('now'), DATE('now')), 
	(28, 1, 3, 'title_28', 'task_description_28', 'Blocked', 'Low', '3', DATE('now'), DATE('now')), 
	(29, 1, 2, 'title_29', 'task_description_29', 'Done', 'Low', '3', DATE('now'), DATE('now')), 
	(30, 1, 3, 'title_30', 'task_description_30', 'To Do', 'High', '3', DATE('now'), DATE('now')), 
	(31, 1, 3, 'title_31', 'task_description_31', 'To Do', 'High', '4', DATE('now'), DATE('now')), 
	(32, 1, 2, 'title_32', 'task_description_32', 'Done', 'Low', '4', DATE('now'), DATE('now')), 
	(33, 1, 2, 'title_33', 'task_description_33', 'To Do', 'High', '5', DATE('now'), DATE('now')), 
	(34, 1, 3, 'title_34', 'task_description_34', 'In Progress', 'Low', '4', DATE('now'), DATE('now')), 
	(35, 1, 2, 'title_35', 'task_description_35', 'To Do', 'Low', '3', DATE('now'), DATE('now')), 
	(36, 1, 3, 'title_36', 'task_description_36', 'To Do', 'Low', '3', DATE('now'), DATE('now')), 
	(37, 1, 2, 'title_37', 'task_description_37', 'Done', 'Low', '4', DATE('now'), DATE('now')), 
	(38, 1, 2, 'title_38', 'task_description_38', 'In Progress', 'High', '3', DATE('now'), DATE('now')), 
	(39, 1, 3, 'title_39', 'task_description_39', 'Done', 'High', '4', DATE('now'), DATE('now'));

INSERT INTO discussion (id, tenant_id, task_id, title, body, discussion_status, created_by, created_at) 
VALUES 
	(0, 0, 11, 'title_0', 'body_0', 'Resolved', 2, DATETIME('now')), 
	(1, 0, 1, 'title_1', 'body_1', 'Responded', 1, DATETIME('now')), 
	(2, 0, 17, 'title_2', 'body_2', 'Open', 0, DATETIME('now')), 
	(3, 0, 14, 'title_3', 'body_3', 'Archived', 2, DATETIME('now')), 
	(4, 0, 19, 'title_4', 'body_4', 'Open', 0, DATETIME('now')), 
	(5, 1, 25, 'title_5', 'body_5', 'Resolved', 5, DATETIME('now')), 
	(6, 1, 29, 'title_6', 'body_6', 'Archived', 5, DATETIME('now')), 
	(7, 1, 37, 'title_7', 'body_7', 'Archived', 3, DATETIME('now')), 
	(8, 1, 32, 'title_8', 'body_8', 'Resolved', 5, DATETIME('now')), 
	(9, 1, 21, 'title_9', 'body_9', 'Responded', 5, DATETIME('now'));