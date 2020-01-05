import React from "react";
import "./center-container-table.scss";

interface ICenterContainerTableGrid {
	grid: {
		asks: (number | string | null)[][];
		center: (number | string | null) [];
		bids: (number | string | null) [][];
	};
}

export const CenterContainerTable: React.FC<ICenterContainerTableGrid> = props => {
	const { asks, center, bids } = props.grid;
	let rows = asks.map((row, idx) => createRow(row, `asks-${idx}`)).reverse();
	rows = [...rows, createRow(center, `center`)];
	rows = [...rows, ...bids.map((row, idx) => createRow(row, `bids-${idx}`))];
	return (
		<table className="center-container-table">
			<tbody>
			{rows}
			</tbody>
		</table>
	);
};

const createRow = (data: (number | string | null)[], prefix: string) => {
	const row = data.map((cell, idx) => {
		if (cell === `\u00A0`) {
			return (
				<td key={`${prefix}-${idx}`}>{cell}</td>
			)
		} else {
			const cl = prefix.split(`-`)[0];
			return (
				<td className={cl} key={`${prefix}-${idx}`}>{cell}</td>
			)
		}

	});
	return (
		<tr key={prefix}>
			{row}
		</tr>
	)
};
