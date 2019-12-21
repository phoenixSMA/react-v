import React from "react";
import { ILogMessage, IState } from "../../../store/types";
import { connect } from "react-redux";
import { getLogMessageClassByType } from "./helpers";

interface ILogContainerBodyProps {
	log: ILogMessage[];
}

const LogContainerBody: React.FC<ILogContainerBodyProps> = (props) => {
	const {log} = props;
	const messageList = log.map((item) => {
		const {time, type, message} = item;
		const itemClass = getLogMessageClassByType(type);
		return (
			<div key={time} className="log-row">
				<div className="log-row-item time">
					{new Date(time).toLocaleString()}
				</div>
				<div className={`log-row-item ${itemClass}`}>
					{`[ ${itemClass.toUpperCase()} ] ${message}`}
				</div>
			</div>
		);
	});
	return (
		<React.Fragment>
			<div className="separator">.</div>
			<div className="log-body">
				{messageList}
			</div>
			<div className="separator">.</div>
		</React.Fragment>
	)
};

const mapStateToProps = (state: IState) => {
	const {log} = state;
	return {
		log,
	}
};

export default connect(mapStateToProps)(LogContainerBody);