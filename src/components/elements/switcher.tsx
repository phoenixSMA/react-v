import React from "react";

interface ISwitherProps {
	items: { text: string, value: string }[];
	selected?: string;
	defaultSelected?: string;
	classes?: string[];
}

export default class Switcher extends React.Component<ISwitherProps, 0> {
	private readonly base: React.RefObject<HTMLDivElement>;

	public constructor(props: ISwitherProps) {
		super(props);
		this.base = React.createRef();
	}

	public render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
		const {items, classes} = this.props;
		const colors = [this.base.current!.style.backgroundColor, this.base.current!.style.color];
		return (
			<div className={classes?.join(` `)} style={{display: `inline-block`}} ref={this.base}>
				{items.map((item, idx) => {
					const {text, value} = item;
					const css = {
							color: this.state === idx ? colors[0] : colors[1],
							backgroundColor: this.state === idx ? colors[1] : colors[0],
						}
					;
					return (
						<span key={value} >{text}</span>
					)
				})}
			</div>
		);
	}
}