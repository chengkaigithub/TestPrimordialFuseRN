import React, { Component } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const filterValue = value => {
	if(value === null || value === undefined) {
		return '';
	}
	return value;
}

export default class Input extends Component {
	render() {
		const {
			value = '',
			defaultValue = '',
			style = {},
			inputStyle = {},
			onChange = () => {},
			...otherProps
		} = this.props;

		let valueProps;
		if ('value' in this.props) {
			valueProps = { value: `${filterValue(value)}` };
		} else {
			valueProps = { defaultValue: `${filterValue(defaultValue)}` };
		}

		return (
			<TextInput
				{...valueProps}
				{...otherProps}
				style={[styles.input, style]}
				onChangeText={onChange}
				underlineColorAndroid="transparent"
			/>
		);
	}
}

const styles = StyleSheet.create({
	input: {
		padding: 0,
	}
})