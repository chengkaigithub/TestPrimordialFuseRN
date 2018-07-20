import React from 'react';
import { View, StyleSheet, StatusBar, Platform } from 'react-native';
import {IS_IOS_OS} from "../utils/PlatformUtil";

/**
 * 状态栏组件
 */
export default props => {
	const {backgroundColor = '#fff', barStyle = 'default'} = props;
	let style = {};

	if(IS_IOS_OS) {
		style = styles.status;
	}

	return (
		<View style={[style, {backgroundColor: backgroundColor}]}>
			<StatusBar
				barStyle={barStyle}
				backgroundColor={backgroundColor}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	status: {
		height: 20,
	}
});