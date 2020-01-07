import React from "react";
import { connect } from "react-redux";
import Button from "../../../elements/button";
import { ConnectionStatus } from "../../../../store/types";
import { getColorByStatus } from "../utils";
import { changeConnectionStatus, changeTraderStatus } from "../../../../store/actions/actions";
import { TraderStatus } from "../../../../common/trader-status";

interface IControlButtonProps {
    status: ConnectionStatus | TraderStatus,
    changeConnectionStatus: typeof changeConnectionStatus,
    changeTraderStatus: typeof changeTraderStatus,
}

const ControlButton: React.FunctionComponent<IControlButtonProps> = (props) => {
    const { status, changeConnectionStatus, changeTraderStatus } = props;
    let clickAction: typeof changeConnectionStatus | typeof changeTraderStatus = changeConnectionStatus;
    let text = 'Connect';
    switch (status) {
        case ConnectionStatus.Connecting:
            text = 'Wait...';
            break;
        case ConnectionStatus.Connected:
            text = 'Disconnect';
            break;
        case ConnectionStatus.Error:
            text = 'Reset';
            break;
        case TraderStatus.Idle:
            text = 'Start';
            clickAction = changeTraderStatus;
            break;
        case TraderStatus.Trading:
            text = 'Stop';
            clickAction = changeTraderStatus;
            break;
    }
    return (
        <Button
            text={text}
            styles={{ backgroundColor: getColorByStatus(status) }}
            onClick={() => {
                clickAction();
            }}
            disabled={status === ConnectionStatus.Connecting}
        />
    )
};

const mapDispatchToProps = {
    changeConnectionStatus,
    changeTraderStatus,
};

export default connect(null, mapDispatchToProps)(ControlButton)
