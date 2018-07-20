import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { px } from '../utils/ScreenUtil';
import * as theme from "../config/theme.conf";

const checkboxImg = {
	'square': {
		true: require('../assets/images/common/checked.png'),
		false: require('../assets/images/common/no-check.png'),
	},
	'circle': {
		true: require('../assets/images/common/arrow-selected.png'),
		false: require('../assets/images/common/arrow-NoSelected.png'),
	}
}

export default class Checkbox extends Component {
	
	render() {
		const {
			checked = false,
			size = 34,
			onChange = () => {},
			type = 'square',
			selectTintColor = theme.BASE_COLOR,
			unSelectTintColor = theme.BASE_COLOR,
			...otherProps
		} = this.props;

		return (
			<TouchableOpacity onPress={() => onChange(!checked)} {...otherProps}>
				<Image
					source={checkboxImg[type][checked]}
					style={{
						width: px(size),
						height: px(size),
                        tintColor: checked ? selectTintColor : unSelectTintColor,
					}}
				/>
			</TouchableOpacity>
		);
	}
}