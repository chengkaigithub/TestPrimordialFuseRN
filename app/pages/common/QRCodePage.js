import React, { Component } from 'react';
import { View, Text, StyleSheet, PermissionsAndroid, Platform } from 'react-native';
import Camera from 'react-native-camera'; // TODO 组件未导入

import { px, deviceHeight } from '../../utils/ScreenUtil';
import {IS_IOS_OS} from "../../utils/PlatformUtil";

const { BarCodeType, Aspect } = Camera.constants;
/**
 * 暂未使用
 * @param callback
 * @constructor
 */
const PermissionsAndroidCheck = callback => {
	if(IS_IOS_OS) {
		callback();
		return;
	}

	PermissionsAndroid.request(
		PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
		{
			title: '提示',
			message: '是否允许访问摄像头？'
		}
	).then(res => {
		PermissionsAndroid.request(
			PermissionsAndroid.PERMISSIONS.CAMERA,
			{
				title: '提示',
				message: '是否允许访问摄像头？'
			}
		).then(res => {
			callback();
		});
	});

}

export default class QRCodePage extends Component {
	static navigationOptions = {
		title: '扫描条码'
	}

	state = {
		isShow: false,
	}

	isReaded = false

	componentWillMount() {
		PermissionsAndroidCheck(() => {
			this.setState({
				isShow: true
			});
		});
	}

    onBarCodeRead = data => {
    	if(!this.isReaded) {
    		this.isReaded = true;
			const { state, goBack } = this.props.navigation;
			state.params.resCode(data.data.length > 16 ? data.data.substr(data.data.length-16) : data.data);
			goBack();
		}
    }

	render() {
		const { isShow } = this.state;
		return (
			<View style={{flex: 1}}>
				{
					isShow ?
					<Camera
						style={styles.camera}
						barCodeTypes={[
							BarCodeType.code128
						]}
						aspect={Aspect.fill}
						onBarCodeRead={this.onBarCodeRead}
					>
						<View style={styles.codeBox}>
							<View style={styles.codeBar}>
								<View style={[styles.barAngle, styles.angleTopLeft]}></View>
								<View style={[styles.barAngle, styles.angleTopRight]}></View>
								<View style={[styles.barAngle, styles.angleBottomLeft]}></View>
								<View style={[styles.barAngle, styles.angleBottomRight]}></View>
							</View>
						</View>
					</Camera> : null
				}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	camera: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#fff',
		overflow: 'hidden',
	},
	codeBox: {
		width: deviceHeight,
		height: deviceHeight,
		borderColor: 'rgba(0, 0, 0, 0.5)',
		borderWidth: px(420),
	},
	codeBar: {
		flex: 1,
		position: 'relative',
		borderWidth: 1,
		borderColor: 'rgba(255, 255, 255, 0.5)',
	},
	barAngle: {
		position: 'absolute',
		width: px(40),
		height: px(40),
		borderColor: 'chartreuse',
		borderWidth: 2,
	},
	angleTopLeft: {
		borderRightWidth: 0,
		borderBottomWidth: 0,
		top: -1,
		left: -1,
	},
	angleTopRight: {
		borderLeftWidth: 0,
		borderBottomWidth: 0,
		top: -1,
		right: -1,
	},
	angleBottomLeft: {
		borderTopWidth: 0,
		borderRightWidth: 0,
		bottom: -1,
		left: -1,
	},
	angleBottomRight: {
		borderTopWidth: 0,
		borderLeftWidth: 0,
		bottom: -1,
		right: -1,
	},
});