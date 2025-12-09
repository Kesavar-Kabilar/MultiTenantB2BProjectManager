// DashboardPage.jsx
import React, { useState, useEffect } from "react";
import DataTable from "./DataTable";
import CreationModal from "./CreationModal";

const DashboardPage = ({ userData }) => {
	const [data, setData] = useState({
		projects: [],
		tasks: [],
		discussions: []
	});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [modalType, setModalType] = useState(null);

	// New state variables for all three search bars
	const [projectSearchTerm, setProjectSearchTerm] = useState("");
	const [taskSearchTerm, setTaskSearchTerm] = useState("");
	const [discussionSearchTerm, setDiscussionSearchTerm] = useState("");

	const [refreshIndex, setRefreshIndex] = useState(0);

	const projectColumns = [
		"Project_Name",
		"Project_Status",
		"Created_Date",
		"Target_Date"
	];
	const taskColumns = [
		"Project_ID",
		"Title",
		"Task_Priority",
		"Task_Status",
		"Task_Description",
		"Assignee",
		"Task_Timestamps",
		"Due_Date"
	];
	const discussionColumns = [
		"Title",
		"Body",
		"Task_ID",
		"Discussion_Status",
		"Created_By",
		"Created_At"
	];

	const closeModal = () => {
		setModalType(null);
	};

	const handleCreate = async (type, formData) => {
		// 1. Determine the correct backend endpoint based on the type
		let endpoint;
		if (type === "project") {
			endpoint = "http://127.0.0.1:5000/api/insert_projects";
		} else if (type === "task") {
			endpoint = "http://127.0.0.1:5000/api/insert_tasks";
		} else if (type === "discussion") {
			endpoint = "http://127.0.0.1:5000/api/insert_discussions";
		} else {
			console.error("Invalid creation type:", type);
			return;
		}

		try {
			// 2. Add necessary user context (like the tenant ID) to the data before sending
			const dataToSend = {
				...formData,
				tenant_id: userData.tenant_id, // Assuming you need tenant context for insertion
				created_by_user_id: userData.id,
				user_role: userData.user_role
			};

			console.log(dataToSend);

			// 3. Send the POST request to the backend
			const response = await fetch(endpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(dataToSend)
			});

			if (!response.ok) {
				throw new Error(
					`Failed to create ${type}. Status: ${response.status}`
				);
			}

			const result = await response.json();
			console.log(`${type} created successfully:`, result);

			// 4. Close the modal after successful creation
			closeModal();
			setRefreshIndex((prevIndex) => prevIndex + 1);
		} catch (error) {
			console.error("Error during creation:", error.message);
			// Optional: Display an error message to the user
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch("http://127.0.0.1:5000/api/data", {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						id: userData.id,
						tenant_id: userData.tenant_id,
						user_role: userData.user_role
					})
				});

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				const result = await response.json();
				setData(result);
			} catch (e) {
				setError(e.message);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [userData, refreshIndex]);

	// --- Filtering Logic ---

	const normalize = (text) => (text ?? "").toLowerCase();

	// 1. Project Filtering (by Project_Name)
	const filteredProjects = data.projects.filter((project) =>
		normalize(project.Project_Name).includes(normalize(projectSearchTerm))
	);

	// 2. Task Filtering (by Title OR Description)
	const filteredTasks = data.tasks.filter((task) => {
		const titleMatch = normalize(task.Title).includes(
			normalize(taskSearchTerm)
		);
		const descriptionMatch = normalize(task.Description).includes(
			normalize(taskSearchTerm)
		);
		return titleMatch || descriptionMatch;
	});

	// 3. Discussion Filtering (by Title OR Body)
	const filteredDiscussions = data.discussions.filter((discussion) => {
		const titleMatch = normalize(discussion.Title).includes(
			normalize(discussionSearchTerm)
		);
		const bodyMatch = normalize(discussion.Body).includes(
			normalize(discussionSearchTerm)
		);
		return titleMatch || bodyMatch;
	});

	const exportToCSV = (data, filename) => {
		if (!data || data.length === 0) {
			console.warn(`No data to export for ${filename}. Skipping.`);
			return;
		}

		const headers = Object.keys(data[0]);
		const csvHeader = headers.join(",") + "\n";

		const csvRows = data
			.map((row) => {
				return headers
					.map((fieldName) => {
						let value =
							row[fieldName] === null ||
							row[fieldName] === undefined
								? ""
								: String(row[fieldName]);
						value = value.replace(/"/g, '""');
						return `"${value}"`;
					})
					.join(",");
			})
			.join("\n");

		const csvString = csvHeader + csvRows;

		const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
		const link = document.createElement("a");
		const url = URL.createObjectURL(blob);

		link.setAttribute("href", url);
		link.setAttribute("download", filename);

		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const exportAllData = () => {
		exportToCSV(filteredProjects, "projects.csv");
		exportToCSV(filteredTasks, "tasks.csv");
		exportToCSV(filteredDiscussions, "discussions.csv");

		alert("Data export initiated for Projects, Tasks, and Discussions.");
	};

	// --- Render Logic ---

	const refreshDashboardData = () => {
		setRefreshIndex((prevIndex) => prevIndex + 1);
	};

	if (loading) return <div>Loading dashboard data...</div>;
	if (error) return <div>Error loading data: {error}</div>;

	return (
		<div>
			<center>
				<h1>Welcome, {userData.user_name}!</h1>
				<p>Logged In As {userData.user_role}</p>
			</center>
			<button
				onClick={exportAllData}
				style={{
					padding: "10px 15px",
					backgroundColor: "#ffc107",
					color: "black",
					border: "none",
					borderRadius: "4px",
					cursor: "pointer"
				}}
			>
				Export to CSV
			</button>

			{/* Container for search bars and tables */}
			<div
				style={{
					display: "block",
					justifyContent: "space-around",
					gap: "20px",
					flexWrap: "wrap"
				}}
			>
				{/* Project Search and Table */}
				<h2>{`Projects (${filteredProjects.length})`}</h2>

				<div style={{ flex: "1 1 300px" }}>
					<input
						type="text"
						placeholder="Search projects by name..."
						value={projectSearchTerm}
						onChange={(e) => setProjectSearchTerm(e.target.value)}
						style={{
							padding: "8px",
							width: "20%",
							marginBottom: "10px",
							borderRadius: "4px",
							border: "1px solid #ccc"
						}}
					/>
					{userData.user_role !== "Contributor" && (
						<button
							onClick={() => setModalType("project")}
							style={{
								padding: "10px 15px",
								backgroundColor: "#ffc107",
								color: "black",
								border: "none",
								borderRadius: "4px",
								cursor: "pointer"
							}}
						>
							➕ Create New Project
						</button>
					)}
					<DataTable
						data={filteredProjects}
						columnOrder={projectColumns}
						type="project"
						userData={userData}
						onUpdateSuccess={refreshDashboardData}
					/>
				</div>

				{/* Task Search and Table */}
				<h2>{`Tasks (${filteredTasks.length})`}</h2>
				<div style={{ flex: "1 1 300px" }}>
					<input
						type="text"
						placeholder="Search tasks by title or description..."
						value={taskSearchTerm}
						onChange={(e) => setTaskSearchTerm(e.target.value)}
						style={{
							padding: "8px",
							width: "20%",
							marginBottom: "10px",
							borderRadius: "4px",
							border: "1px solid #ccc"
						}}
					/>
					{userData.user_role !== "Contributor" && (
						<button
							onClick={() => setModalType("task")}
							style={{
								padding: "10px 15px",
								backgroundColor: "#ffc107",
								color: "black",
								border: "none",
								borderRadius: "4px",
								cursor: "pointer"
							}}
						>
							➕ Create New Task
						</button>
					)}
					<DataTable
						data={filteredTasks}
						columnOrder={taskColumns}
						type="task"
						userData={userData}
						onUpdateSuccess={refreshDashboardData}
					/>
				</div>

				{/* Discussion Search and Table */}
				<h2>{`Discussions (${filteredDiscussions.length})`}</h2>
				<div style={{ flex: "1 1 300px" }}>
					<input
						type="text"
						placeholder="Search discussions by title or body..."
						value={discussionSearchTerm}
						onChange={(e) =>
							setDiscussionSearchTerm(e.target.value)
						}
						style={{
							padding: "8px",
							width: "20%",
							marginBottom: "10px",
							borderRadius: "4px",
							border: "1px solid #ccc"
						}}
					/>
					{userData.user_role !== "Contributor" && (
						<button
							onClick={() => setModalType("discussion")}
							style={{
								padding: "10px 15px",
								backgroundColor: "#ffc107",
								color: "black",
								border: "none",
								borderRadius: "4px",
								cursor: "pointer"
							}}
						>
							➕ Start Discussion
						</button>
					)}
					<DataTable
						data={filteredDiscussions}
						columnOrder={discussionColumns}
						type="discussion"
						userData={userData}
						onUpdateSuccess={refreshDashboardData}
					/>
				</div>

				{/* Conditional Rendering of Modal */}
				{modalType && (
					<CreationModal
						type={modalType}
						onClose={closeModal}
						onSubmit={handleCreate}
					/>
				)}
			</div>
		</div>
	);
};

export default DashboardPage;
