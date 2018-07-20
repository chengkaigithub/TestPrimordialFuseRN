/**
 * 字体组件类
 */

import React, { Component } from 'react';
import { Text, StyleSheet, Platform } from 'react-native';

import * as theme from '../config/theme.conf';
import { px } from '../utils/ScreenUtil';

const typeMap = {
	'default': {
		color: theme.BASE_FONT_COLOR,
	},
	'gray': {
		color: theme.GRAY_FONT_COLOR,
	}
}

export default props => {
	const {
		style,
		children,
		size = theme.BASE_FONT_SIZE,
		color,
		lineHeight = theme.BASE_FONT_SIZE * 1.6,
		align = 'left',
		type = 'default',
		...otherProps
	} = props;

	const textStyles = {
		fontSize: px(size),
		textAlign: align,
		lineHeight: px(lineHeight),
	};

	if(color) {
		textStyles.color = color;
	}

	return (
		<Text
			{...otherProps}
			style={[
				typeMap[type],
				textStyles,
				style,
			]}
		>
			{children}
		</Text>
	);
};
