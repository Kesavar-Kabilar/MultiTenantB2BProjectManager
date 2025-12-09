import React, { useState, useCallback } from "react";

// Renamed 'data' prop to 'initialData' to show we're making a local copy
const DataTable = ({ data: initialData, columnOrder, type, userData, onUpdateSuccess }) => {
	// 1. STATE TRACKING: Local copy of data for immediate updates,
	// and state for the cell being edited.
	const [data, setData] = useState(initialData);
	const [editingCell, setEditingCell] = useState(null); // { rowIndex, headerKey }
	const [inputValue, setInputValue] = useState("");

	if (!data || data.length === 0) {
		return (
			<div style={{ flex: 1, padding: "10px" }}>
				<p>No data found.</p>
			</div>
		);
	}

	// Keep the prop data in sync if it changes externally (e.g., from search/filter)
	// NOTE: This is a simple fix. For complex tables, consider `useEffect`.
	if (data !== initialData) {
		setData(initialData);
	}

	const headers = columnOrder;

	const headerColor = "#007bff";
	const evenRowColor = "#e3f2fd";
	const oddRowColor = "#ffffff";

	// 2. EVENT HANDLERS: Function to start the edit
	const handleEdit = useCallback((rowIndex, headerKey, initialValue) => {
		setEditingCell({ rowIndex, headerKey });
		setInputValue(initialValue);
	}, []);

	const handleChange = useCallback((e) => {
		setInputValue(e.target.value);
	}, []);

	// Function to simulate a save (updates local state only for now)
	const handleSave = useCallback(
		async (rowIndex, headerKey) => {
			const rowToUpdate = data[rowIndex];

			const dataToSend = { 
				type: type,
				headerKey: headerKey,
				inputValue: inputValue,
				id: rowToUpdate.id,
				user_role: userData.user_role
			};

			let endpoint = "http://127.0.0.1:5000/api/update_data";

			console.log(dataToSend);

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
			
			setEditingCell(null);
			onUpdateSuccess();
			return;
		},
		[data, inputValue]
	);

	const handleKeyDown = useCallback(
		(e, rowIndex, headerKey) => {
			if (e.key === "Enter") {
				handleSave(rowIndex, headerKey);
			}
			if (e.key === "Escape") {
				setEditingCell(null);
			}
		},
		[handleSave]
	);

	return (
		<div style={{ flex: 1, padding: "10px" }}>
			<table
				style={{
					borderCollapse: "collapse",
					width: "100%",
					borderRadius: "4px",
					overflow: "hidden"
				}}
			>
				<thead>
					<tr
						style={{ backgroundColor: headerColor, color: "white" }}
					>
						{headers.map((header) => (
							<th
								key={header}
								style={{
									border: "none",
									padding: "12px 8px",
									textAlign: "left",
									fontWeight: "bold"
								}}
							>
								{header.replace(/_/g, " ")}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{data.map((row, rowIndex) => {
						const rowBackgroundColor =
							rowIndex % 2 === 0 ? evenRowColor : oddRowColor;

						return (
							<tr
								key={rowIndex}
								style={{
									backgroundColor: rowBackgroundColor,
									borderBottom: `1px solid ${evenRowColor}`
								}}
							>
								{headers.map((header) => {
									// Determine if the current cell is the one being edited
									const isEditing =
										editingCell &&
										editingCell.rowIndex === rowIndex &&
										editingCell.headerKey === header;

									// Only editable if user is admin or manager
									const isEditable =
										userData.user_role == "Admin" ||
										userData.user_role == "Manager";

									return (
										<td
											key={header}
											// 3. EVENT LISTENER: Double-click starts the edit
											onDoubleClick={() =>
												isEditable &&
												handleEdit(
													rowIndex,
													header,
													row[header]
												)
											}
											style={{
												border: "none",
												padding: "8px",
												textAlign: "left",
												cursor: isEditable
													? "pointer"
													: "default"
											}}
										>
											{isEditing ? (
												<input
													value={inputValue}
													onChange={handleChange}
													// Save on blur (click outside)
													onBlur={() =>
														handleSave(
															rowIndex,
															header
														)
													}
													// Save on 'Enter' key press
													onKeyDown={(e) =>
														handleKeyDown(
															e,
															rowIndex,
															header
														)
													}
													autoFocus
													style={{
														width: "100%",
														padding: "0px",
														margin: "0px",
														border: "1px solid #007bff"
													}}
												/>
											) : (
												row[header]
											)}
										</td>
									);
								})}
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
};

export default DataTable;
