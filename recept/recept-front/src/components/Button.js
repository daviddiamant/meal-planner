import React from 'react';

const Button = (props) => {

	const style = {
		background: props.bg != null ? props.bg : 'initial'
	}

	return (
		<div
			className={
				`btn
				${props.ownClass != null ? props.ownClass : ''}
				${props.tone != null ? props.tone : ''}`
			}
			style={style}
			>
			<span className="btn_inner" onClick={props.onClick}>
				{props.children}
			</span>
		</div>
	);
}

export default Button;