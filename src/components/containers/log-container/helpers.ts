import { LogTypes } from "../../../store/types";

export const getLogMessageClassByType = (type: LogTypes): string => {
	switch (type) {
		case LogTypes.Error:
			return `error`;
		case LogTypes.Success:
			return `success`;
		case LogTypes.Info:
			return `info`;
		case LogTypes.Message:
			return `message`;
		case LogTypes.Warning:
			return `warning`;
	}
};