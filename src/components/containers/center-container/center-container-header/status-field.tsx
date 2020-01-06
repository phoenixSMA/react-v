import React from "react";
import { ConnectionStatus } from "../../../../store/types";
import { TraderStatus } from "../../../../common/trader-status";
import { getColorByStatus } from "../utils";

interface IStatusField {
    status: ConnectionStatus | TraderStatus;
}

const StatusField: React.FC<IStatusField> = props => {
    const { status } = props;
    return (
        <td className="status-field" style={{ color: getColorByStatus(status) }}>
            {status}
        </td>
    )
};

export default StatusField;
