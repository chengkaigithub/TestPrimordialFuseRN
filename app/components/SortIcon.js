import React, { Component } from 'react';
import { ImageBackground } from 'react-native';
import { px } from '../utils/ScreenUtil';

const sortIconMap = {
	'no': require('../assets/images/common/up-down.png'),
	'up': require('../assets/images/common/up.png'),
	'down': require('../assets/images/common/down.png'),
}

export default class SortIcon extends Component {
	render() {
		const {
			type = 'no',
			style = {},
			...otherProps
		} = this.props;
		return (
			<ImageBackground
				source={sortIconMap[type]}
				style={[
					{
						width: px(16),
						height: px(24),
					},
					style
				]}
				{...otherProps}
			/>
		);
	}
}