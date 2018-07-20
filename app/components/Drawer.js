import React, { Component, cloneElement } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Drawer from 'react-native-drawer';

import { px } from '../utils/ScreenUtil';

export default class MyDrawer extends Component {
	close = () => {
		this.drawerRef.close();
	}

	render() {
		const {
			children,
			content,
			openDrawerOffset = 0.2,
			type = "overlay",
		} = this.props;

		return (
			<Drawer
				{...this.props}
				ref={ref => this.drawerRef = ref}
				tapToClose={true}
				acceptPan={true}
				acceptTap={true}
				negotiatePan={true}
				type={type}
				tweenHandler={(ratio) => ({
					mainOverlay: {
						opacity: ratio,
						backgroundColor: `rgba(0, 0, 0, 0.6)`
					}
				})}
				content={
					<View style={styles.drawerContent}>
						<TouchableOpacity
							style={styles.closeView}
							onPress={this.close}
						/>
						<View style={styles.drawerBody}>
							{content}
						</View>
					</View>
				}
			/>
		);
	}
}

const styles = StyleSheet.create({
	drawerContent: {
		flex: 1,
		flexDirection: 'row',
	},
	closeView: {
		width: px(150),
	},
	drawerBody: {
		flex: 1,
		backgroundColor: '#fff',
	}
});