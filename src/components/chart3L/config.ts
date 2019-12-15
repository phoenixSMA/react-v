import { ChartData } from "react-chartjs-2";
import { ChartOptions } from "chart.js";
import { TradeSides } from "../../store/types";

export const data: ChartData<any> = {
	datasets: [
		{
			type: `line`,
			label: `Last Price`,
			data: [],
			borderColor: `cyan`,
			backgroundColor: `cyan`,
			fill: false,
			lineTension: 0,
			borderJoinStyle: 'round',
			borderWidth: 1,
			// borderDash: [2, 2],
			pointRadius: 0,
			pointHoverRadius: 5,
			yAxisID: 'Yaxis2',
		},
		{
			type: `line`,
			label: ``,
			data: [],
			borderColor: `yellow`,
			backgroundColor: `yellow`,
			fill: false,
			lineTension: 0,
			borderJoinStyle: 'round',
			borderWidth: 2,
			pointRadius: 0,
			pointHoverRadius: 5,
			yAxisID: 'Yaxis2',
		},
		{
			type: `line`,
			label: ``,
			data: [],
			borderColor: `red`,
			backgroundColor: `red`,
			fill: false,
			lineTension: 0,
			borderJoinStyle: 'round',
			borderWidth: 1,
			pointRadius: 0,
			pointHoverRadius: 5,
			yAxisID: 'Yaxis1'
		},
		{
			type: `line`,
			label: ``,
			data: [],
			borderColor: `green`,
			backgroundColor: `green`,
			fill: false,
			lineTension: 0,
			borderJoinStyle: 'round',
			borderWidth: 1,
			pointRadius: 0,
			pointHoverRadius: 5,
			yAxisID: 'Yaxis1'
		}
	],
};

export const options: ChartOptions = {
	responsive: true,
	maintainAspectRatio: false,
	animation: {
		duration: 0,
	},
	title: {
		display: false,
		text: ``,
	},
	legend: {
		display: true,
		labels: {
			boxWidth: 10,
			fontSize: 10
		},
	},
	scales: {
		xAxes: [{
			type: 'time',
			gridLines: {
				drawOnChartArea: true,
				color: 'grey',
				lineWidth: 0.5,
				borderDash: [1, 5],
				zeroLineWidth: 0.5,
				zeroLineColor: `grey`,
				zeroLineBorderDash: [1, 5],
			},
			time: {
				unit: 'day',
				displayFormats: {
					day: `DD MMM`
				}
			},
			display: true,
			scaleLabel: {
				display: true
			}
		}],
		yAxes: [{
			gridLines: {
				drawOnChartArea: false,
				color: 'grey',
				zeroLineColor: 'grey',
				lineWidth: 0.5,
				borderDash: [1, 1]
			},
			type: 'linear',
			display: true,
			position: "left",
			id: "Yaxis1",
			scaleLabel: {
				display: true,
				labelString: 'Contracts'
			}
		}, {
			gridLines: {
				drawOnChartArea: true,
				color: 'grey',
				zeroLineColor: 'grey',
				zeroLineWidth: 2,
				lineWidth: 0.5,
				borderDash: [1, 5],
			},
			type: 'linear',
			display: true,
			position: "right",
			id: "Yaxis2",
			scaleLabel: {
				display: true,
				labelString: `Spread`,
			}
		},
		]
	}
};

export const levelDataSet = (side: TradeSides) => {
	const color = side === TradeSides.Buy ? `darkgreen` : `darkred`;
	return {
		type: `line`,
		label: ``,
		data: [],
		borderColor: color,
		backgroundColor: color,
		fill: false,
		lineTension: 0,
		borderJoinStyle: 'round',
		borderWidth: 1,
		pointRadius: 0,
		pointHoverRadius: 5,
		yAxisID: 'Yaxis1'
	}
};