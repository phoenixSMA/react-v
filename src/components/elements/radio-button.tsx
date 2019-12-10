import React from "react";

interface IRadioButtonElement {
	name: string;
	value: string;
	label: string;
}

interface IRadioButtomProps {
	buttons: IRadioButtonElement[];
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	checked?: string;
	classes?: string;
}

const RadioButton: React.FunctionComponent<IRadioButtomProps> = props => {
	const {buttons, checked, onChange, classes} = props;
	const radioButtons = buttons.map((b, index) => {
		const {name, value, label} = b;
		return (
			<label key={value}>
				<input
					type="radio"
					name={name}
					value={value}
					defaultChecked={checked === undefined ? index === 0 : checked === value}
					onChange={onChange}
				/>
				{label}
			</label>
		)
	});
	return (
		<div className={classes}>
			{radioButtons}
		</div>
	)
};

export default RadioButton;