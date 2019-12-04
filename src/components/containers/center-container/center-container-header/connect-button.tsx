import React from "react";
import { connect } from "react-redux";
import Button from "../../../elements/button";
import { ConnectionStatus, IState } from "../../../../store/types";
import { getColorByStatus } from "../utils";
import { changeConnectionStatus } from "../../../../store/actions/actions";

interface IConnectButtonProps {
	connectionStatus: ConnectionStatus,
	changeConnectionStatus: typeof changeConnectionStatus,
}

const ConnectButton: React.FunctionComponent<IConnectButtonProps> = (props) => {
	const {connectionStatus, changeConnectionStatus} = props;
	let text = `Connect`;
	switch (connectionStatus) {
		case ConnectionStatus.Connecting:
			text = `Wait...`;
			break;
		case ConnectionStatus.Connected:
			text = `Disconnect`;
			break;
		case ConnectionStatus.Error:
			text = `Reset`;
			break;
	}
	return (
		<Button
			text={text}
			styles={{backgroundColor: getColorByStatus(connectionStatus)}}
			onClick={() => changeConnectionStatus()}
			disabled={connectionStatus === ConnectionStatus.Connecting}
		/>
	)
};

const mapStateToProps = (state: IState) => {
	const {connectionStatus} = state;
	return {
		connectionStatus,
	}
};

const mapDispatchToProps = {
	changeConnectionStatus
};

export default connect(mapStateToProps, mapDispatchToProps)(ConnectButton)