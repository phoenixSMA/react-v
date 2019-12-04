import React from "react";

export interface IButtonProps {
	text: string;
	classes?: string;
	styles?: {}
	onClick?: (e: React.MouseEvent) => void;
	disabled?: boolean;
}

const Button: React.FC<IButtonProps> = (props: IButtonProps) => {
	const {text, classes, styles, onClick, disabled} = props;
	return (
		<button
			className={ classes }
			style={ styles }
			onClick={ onClick }
			disabled={!!disabled}
		>{ text }</button>
	);
};

export default Button;