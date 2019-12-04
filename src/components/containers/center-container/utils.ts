import { ConnectionStatus } from "../../../store/types";

export const getColorByStatus = (status: ConnectionStatus): string => {
	switch (status) {
		case ConnectionStatus.Connected:
			return `darkgreen`;
		case ConnectionStatus.Disconnected:
			return `darkgray`;
		case ConnectionStatus.Connecting:
			return `darkgoldenrod`;
		case ConnectionStatus.Error:
			return `firebrick`;
		default:
			return `#333333`;
	}
};