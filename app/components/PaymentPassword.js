/**
** 支付密码组件
**/

import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Modal } from 'react-native';
// import { Modal } from 'antd-mobile';
// import Ionicons from 'react-native-vector-icons/Ionicons';

import { px } from '../utils/ScreenUtil';
import * as theme from '../config/theme.conf';
import { Button } from '../components';

export default class PaymentPassword extends Component {

	state = {
		passwordInput: ['', '', '', '', '', ''],  // 密码
		number: [1, 2, 3, 4, 5, 6, 7, 8, 9],      // 1-9数字密码
	}

	savePassword = '';
	saveDoc = ['', '', '', '', '', ''];

	componentDidMount () {
		const { _ref = () => {} } = this.props;
		_ref({
			clearPassword: this.clearPassword,
			getState: () => this.state,
		});
	}

	/**
	** 密码键盘输入
	**/
	keyboardChange = (val) => {
		this.savePassword += val;
		this.saveDoc[this.savePassword.length - 1] = '·';
		this.setState({
			passwordInput: this.saveDoc,
		});
		if (this.savePassword.length === 6) {

			this.props.successInput(this.savePassword);
			setTimeout(() => {
				this.setState({
					passwordInput: ['', '', '', '', '', ''],
				});
				this.savePassword = '';
				this.saveDoc = ['', '', '', '', '', ''];
				this.props.inputOver();
			}, 30);
			return;
		}
	}

	/**
	** 清楚密码
	**/
	clearPassword = () => {
		this.setState({
			passwordInput: ['', '', '', '', '', ''],
		});
		this.savePassword = '';
		this.saveDoc = ['', '', '', '', '', ''];
	}

	/**
	** 删除操作
	**/
	closeInput = () => {
		if (!this.savePassword) return;
		this.saveDoc[this.savePassword.length - 1] = '';
		this.setState({
			passwordInput: this.saveDoc,
		});
		this.savePassword = this.savePassword.substring(0, this.savePassword.length - 1);
	}

	render () {
		const {
			title = '',
			message = '',
			visible = false,
			closePayment = () => {},
			forgetPassword = false,
			forgetRouter,
		} = this.props;
		const {passwordInput, number} = this.state;
		return (
			<Modal
	          	popup
	          	visible={visible}
	          	maskClosable={true}
	          	onClose={closePayment}
	          	animationType="slide-up"
                onRequestClose={() => {/* android强制调用,必须重写 */}}
	          	style={{
	          		backgroundColor: '#f8f8f8',
	          	}}
	        >
	        	<View style={styles.topBar}>
		        	<TouchableOpacity
		        		style={styles.closeButton}
		        		onPress={closePayment}
		        	>
		        		{/*<Ionicons*/}
			        		{/*name="md-close"*/}
			        		{/*size={22}*/}
			        		{/*color={theme.BASE_FONT_COLOR}*/}
			        	{/*/>*/}
		        	</TouchableOpacity>
		        	<Text style={styles.topTitle}>{title}</Text>
	        	</View>
	        	<View style={styles.inputBox}>
	        		{
	        			passwordInput.map((item, index) => {
	        				let borderLeft = null;
	        				if (index === 0) {
	        					borderLeft = {borderLeftWidth: 0};
	        				}
	        				return (
	        					<View key={index} style={[styles.input, borderLeft]}>
	        						<Text style={styles.inputText}>{item}</Text>
	        					</View>
	        				);
	        			})
	        		}
	        	</View>
	        	{
	        		forgetPassword ?
	        		<View style={styles.forgetPassword}>
		        		<Button
		        			style={{
		        				backgroundColor: 'transparent',
		        			}}
		        			onClick={forgetRouter}
		        		>
		        			<Text style={{
								fontSize: px(28),
								color: '#fa5e59',
							}}>忘记密码？</Text>
						</Button>
		        	</View> : null
	        	}
	        	{
	        		message ? 
	        		<Text style={{
	        			paddingTop: px(26),
	        			paddingBottom: px(100),
	        			fontSize: px(24),
	        			color: '#9c9c9c',
	        			textAlign: 'center',
	        		}}>{message}</Text> : null
	        	}
	        	<View>
	        		<View style={styles.keyboardModal}>
	        			{
	        				number.map((item, index) => {
	        					let leftBorder = {
	        						width: px(250),
    								height: px(126),
    								paddingTop: px(20),
    								borderLeftWidth: 1,
    								borderBottomWidth: 1,
    								borderColor: '#d0d0d0',
    								borderRadius: 0,
    								backgroundColor: '#fff',
	        					};
	        					if (index === 0 || index === 3 || index === 6) {
	        						leftBorder = {
	        							width: px(250),
	    								height: px(126),
	    								paddingTop: px(20),
	    								borderLeftWidth: 0,
	    								borderBottomWidth: 1,
	    								borderColor: '#d0d0d0',
	    								borderRadius: 0,
	    								backgroundColor: '#fff',
	        						}
	        					}
	        					return (
	        						<Button
	        							key={index}
	        							style={leftBorder}
	        							onClick={() => this.keyboardChange(item)}
	        						>
	        							<Text style={{color: '#1c1c1c', fontSize: px(54)}}>{item}</Text>
	        						</Button>
	        					);
	        				})
	        			}
	        		</View>
	        		<View style={styles.keyboardBottom}>
	        			<Button
							style={{
								width: px(252),
								height: px(126),
								paddingTop: px(20),
								borderLeftWidth: 1,
								borderRightWidth: 1,
								borderColor: '#d0d0d0',
								borderRadius: 0,
								backgroundColor: '#fff',
							}}
							onClick={() => this.keyboardChange(0)}
						>
							<Text style={{color: '#1c1c1c', fontSize: px(54)}}>0</Text>
						</Button>
						<Button
							style={{
								width: px(249),
								height: px(126),
								paddingTop: px(20),
								borderRadius: 0,
								backgroundColor: 'transparent',
							}}
							onClick={this.closeInput}
						>
							{/*<Ionicons*/}
								{/*name="ios-backspace-outline"*/}
								{/*size={34}*/}
								{/*color="#000"*/}
							{/*/>*/}
						</Button>
	        		</View>
	        	</View>
	        </Modal>
		);
	}
}

const styles = StyleSheet.create({
	topBar: {
		position: 'relative',
	},
	closeButton: {
		position: 'absolute',
		top: px(40),
		left: px(36),
	},
	topTitle: {
		marginLeft: 42,
		marginRight: 42,
		marginTop: px(40),
		fontSize: px(34),
		color: theme.BASE_FONT_COLOR,
		textAlign: 'center',
	},
	inputBox: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: px(46),
		marginLeft: px(34),
		marginRight: px(34),
		borderWidth: 1,
		borderColor: '#d0d0d0',
		borderRadius: px(10),
		overflow: 'hidden',
	},
	input: {
		width: px(114),
		height: px(108),
		borderLeftWidth: 1,
		borderColor: '#d0d0d0',
	},
	inputText: {
		lineHeight: px(108),
		textAlign: 'center',
		fontSize: px(108),
		color: '#000',
	},
	forgetPassword: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		marginRight: px(18),
	},
	keyboardModal: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		borderTopWidth: 1,
		borderColor: '#d0d0d0',
	},
	keyboardBottom: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
	}
});