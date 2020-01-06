import { ConnectionStatus } from "../../../store/types";
import { TraderStatus } from "../../../common/trader-status";

export const getColorByStatus = (status: ConnectionStatus | TraderStatus): string => {
    switch (status) {
        case ConnectionStatus.Connected :
        case TraderStatus.Trading:
            return `darkgreen`;
        case ConnectionStatus.Disconnected:
        case TraderStatus.Idle:
            return `darkgray`;
        case ConnectionStatus.Connecting:
            return `darkgoldenrod`;
        case ConnectionStatus.Error:
            return `firebrick`;
        default:
            return `#333333`;
    }
};
