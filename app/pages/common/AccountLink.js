import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';

/**
 * 用户信息页面链接
 * @param  {Object} props props
 * @return {ReactComponent}    链接组件
 */
export default props => {
	const { navigate } = props.navigation;

	/**
	 * 打开用户信息页面
	 * @return {void}
	 */
	const handleAccountPageClick = () => {
		navigate('AccountPage');
	};

	return (
		<TouchableOpacity onPress={handleAccountPageClick}>
			{/*<Ionicons*/}
				{/*name="ios-contact"*/}
				{/*color="#fff"*/}
				{/*size={28}*/}
				{/*style={{marginLeft: 12}}*/}
			{/*/>*/}
		</TouchableOpacity>
	);
};
