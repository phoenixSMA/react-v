import React from "react";
import "./center-container-header.scss"
import ConnectButton from "./connect-button";
import ConnnectStatusField from "./connect-status-field";

const CenterContainerHeader: React.FunctionComponent = (props) => {
	return (
		<tbody className="center-container-header">
		<tr>
			<td rowSpan={2} style={{textAlign: "left"}}>
				<ConnectButton />
			</td>
			<td>
				Status
			</td>
		</tr>
		<tr>
			<ConnnectStatusField />
		</tr>
		</tbody>
	)
};

export default CenterContainerHeader;