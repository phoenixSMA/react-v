import React from "react";

export interface ISelectOption {
	text: string;
	name: string;
}

export interface ISelectProps {
	options: ISelectOption[];
	classes?: string;
	styles?: {};
	onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
	disabled?: boolean;
	selectedValue?: string;
}

const Select: React.FC<ISelectProps> = (props: ISelectProps) => {
	const {options, classes, styles, onChange, disabled, selectedValue} = props;
	const selectOptions = options.map(({text, name}) => {
		return (
			<option
				key={name}
				value={name}
			>
				{text}
			</option>
		)
	});
	return (
		<select
			className={classes}
			style={styles}
			onChange={onChange}
			disabled={disabled}
			value={selectedValue}
		>
			{selectOptions}
		</select>
	)
};

export default Select;
