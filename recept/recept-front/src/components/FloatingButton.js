import React from 'react';

const FloatingButton = (props) => {

	const style = {
		background: props.bg
	}

	return (
		<div
			className={
				`floating-button ${props.ownClass} ${props.tone} ${(props.opened ? " open": "")}`
			}
			style={style}
			>
			<div className="floating-button_hidden">
				{props.hiddenContent}
			</div>
			<div className="floating-button_inner" onClick={props.onClick}>
				{(props.opened ? props.openIcon : props.closedIcon)}
			</div>
		</div>
	);
}

export default FloatingButton;