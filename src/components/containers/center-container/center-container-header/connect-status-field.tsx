import React from "react";
import { ConnectionStatus, IState } from "../../../../store/types";
import { getColorByStatus } from "../utils";
import { connect } from "react-redux";

interface IConnectStatusFieldProps {
	connectionStatus: ConnectionStatus,
}

const ConnnectStatusField: React.FunctionComponent<IConnectStatusFieldProps> = (props) => {
	const {connectionStatus} = props;
	let text = `Disconnected`;
	switch (connectionStatus) {
		case ConnectionStatus.Connected:
			text = `Connected`;
			break;
		case ConnectionStatus.Connecting:
			text = `Connecting`;
			break;
		case ConnectionStatus.Error:
			text = `Error`;
			break;
	}
	return (
		<td className="status-field" style={{color: getColorByStatus(connectionStatus)}}>
			{text}
		</td>
	)
};

const mapStateToProps = (state: IState) => {
	const {connectionStatus} = state;
	return {
		connectionStatus,
	}
};

export default connect(mapStateToProps)(ConnnectStatusField)