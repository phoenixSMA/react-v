import React from "react";
import "./center-container-header.scss"
import ControlButton from "./control-button";
import { ConnectionStatus, IState } from "../../../../store/types";
import { TraderStatus } from "../../../../common/trader-status";
import StatusField from "./status-field";
import { connect } from "react-redux";

interface ICenterContainerHeaderProps {
    connectionStatus: ConnectionStatus;
    traderStatus: TraderStatus;
}

const CenterContainerHeader: React.FunctionComponent<ICenterContainerHeaderProps> = (props) => {
    const { connectionStatus, traderStatus } = props;
    return (
        <tbody className="center-container-header">
        <tr>
            <td rowSpan={2} style={{ textAlign: "left" }}>
                <ControlButton status={connectionStatus} />
            </td>
            <td>
                Data Status
            </td>
            <td rowSpan={2} style={{ textAlign: "left" }}>
                <ControlButton status={traderStatus} />
            </td>
            <td>
                Trader Status
            </td>
        </tr>
        <tr className="bordered">
            <StatusField status={connectionStatus} />
            <StatusField status={traderStatus} />
        </tr>
        </tbody>
    )
};

const mapStateToProps = (state: IState) => {
    const { connectionStatus, trading: { traderStatus } } = state;
    return {
        connectionStatus,
        traderStatus,
    }
};

export default connect(mapStateToProps)(CenterContainerHeader);
