// CreationModal.jsx
import React, { useState } from "react";

const modalStyles = {
	overlay: {
		position: "fixed",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "rgba(0, 0, 0, 0.7)",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		zIndex: 1000
	},
	content: {
		backgroundColor: "white",
		padding: "20px",
		borderRadius: "8px",
		width: "90%",
		maxWidth: "500px",
		boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
		position: "relative"
	},
	closeButton: {
		position: "absolute",
		top: "10px",
		right: "10px",
		background: "none",
		border: "none",
		fontSize: "20px",
		cursor: "pointer"
	}
};

const getFormFields = (type) => {
	switch (type) {
		case "project":
			return [
				{ name: "Project_Name", label: "Project Name", type: "text" },
				{
					name: "Status",
					label: "Status",
					type: "select",
					options: ["Active", "On Hold", "Completed"]
				},
				{ name: "Created_Date", label: "Created_Date", type: "date" },
				{ name: "Target_Date", label: "Target Date", type: "date" }
			];
		case "task":
			return [
				{ name: "Project_ID", label: "Project ID", type: "text" },
				{ name: "Title", label: "Task Title", type: "text" },
				{
					name: "Priority",
					label: "Priority",
					type: "select",
					options: ["High", "Low"]
				},
				{
					name: "Status",
					label: "Status",
					type: "select",
					options: ["To Do", "In Progress", "Blocked", "Done"]
				},
				{ name: "Description", label: "Description", type: "textarea" },
				{ name: "Assignee", label: "Assignee", type: "text" },
				{
					name: "Task_Timestamps",
					label: "Task Timestamps",
					type: "date"
				},
				{ name: "DueDate", label: "Due Date", type: "date" }
			];
		case "discussion":
			return [
				{ name: "Title", label: "Discussion Title", type: "text" },
				{ name: "Body", label: "Body", type: "textarea" },
				{ name: "Task_ID", label: "Task ID", type: "text" },
				{
					name: "Status",
					label: "Status",
					type: "select",
					options: ["Open", "Responded", "Resolved", "Archived"]
				},
				{ name: "Created_By", label: "Created By", type: "text" }
			];
		default:
			return [];
	}
};

const CreationModal = ({ type, onClose, onSubmit }) => {
	const fields = getFormFields(type);
	const [formData, setFormData] = useState({});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmit(type, formData);
	};

	return (
		<div style={modalStyles.overlay}>
			<div style={modalStyles.content}>
				<button onClick={onClose} style={modalStyles.closeButton}>
					&times;
				</button>
				<h2>
					Create New {type.charAt(0).toUpperCase() + type.slice(1)}
				</h2>
				<form onSubmit={handleSubmit}>
					{fields.map((field) => (
						<div key={field.name} style={{ marginBottom: "15px" }}>
							<label
								htmlFor={field.name}
								style={{
									display: "block",
									fontWeight: "bold",
									marginBottom: "5px"
								}}
							>
								{field.label}:
							</label>
							{field.type === "textarea" ? (
								<textarea
									id={field.name}
									name={field.name}
									onChange={handleChange}
									style={{
										width: "100%",
										padding: "8px",
										border: "1px solid #ccc",
										borderRadius: "4px"
									}}
									rows="4"
									required
								/>
							) : field.type === "select" ? (
								<select
									id={field.name}
									name={field.name}
									onChange={handleChange}
									style={{
										width: "100%",
										padding: "8px",
										border: "1px solid #ccc",
										borderRadius: "4px"
									}}
									required
								>
									<option value="">Select...</option>
									{field.options.map((option) => (
										<option key={option} value={option}>
											{option}
										</option>
									))}
								</select>
							) : (
								<input
									type={field.type}
									id={field.name}
									name={field.name}
									onChange={handleChange}
									style={{
										width: "100%",
										padding: "8px",
										border: "1px solid #ccc",
										borderRadius: "4px"
									}}
									required
								/>
							)}
						</div>
					))}
					<button
						type="submit"
						style={{
							padding: "10px 15px",
							backgroundColor: "#007bff",
							color: "white",
							border: "none",
							borderRadius: "4px",
							cursor: "pointer",
							marginTop: "10px"
						}}
					>
						Create {type.charAt(0).toUpperCase() + type.slice(1)}
					</button>
				</form>
			</div>
		</div>
	);
};

export default CreationModal;
