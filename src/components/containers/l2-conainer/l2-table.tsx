import React from "react";

export interface IL2TableProps {
	left: boolean;
	asks?: number[][];
	bids?: number[][];
	formatter?: number;
}

const L2Table = (props: IL2TableProps) => {
	const {left, asks, bids, formatter} = props;
	let spread: number | string = asks![0][0] - bids![0][0];
	spread = spread ? spread.toFixed(formatter) : `-`;
	const tbodyAsks = asks!.map((row, i) => {
		const price = row[0] ? row[0].toFixed(formatter) : `-`;
		const amount = row[1] ? row[1] : `-`;
		return (<tr key={i}>
			<td className={`ask`}>{left ? amount : price}</td>
			<td className={`ask`}>{left ? price : amount}</td>
		</tr>)
	}).reverse();
	const tbodyBids = bids!.map((row, i) => {
		const price = row[0] ? row[0].toFixed(formatter) : `-`;
		const amount = row[1] ? row[1] : `-`;
		return (<tr key={i}>
			<td className={`bid`}>{left ? amount : price}</td>
			<td className={`bid`}>{left ? price : amount}</td>
		</tr>)
	});
	return (
		<table>
			<thead>
			<tr>
				<th>{left ? `Amount` : `Price`}</th>
				<th>{left ? `Price` : `Amount`}</th>
			</tr>
			</thead>
			<tbody>
			{tbodyAsks}
			<tr>
				<td className="spread">{left ? `Spread` : spread}</td>
				<td className="spread">{left ? spread : `Spread`}</td>
			</tr>
			{tbodyBids}
			</tbody>
		</table>
	)
};

export default L2Table;