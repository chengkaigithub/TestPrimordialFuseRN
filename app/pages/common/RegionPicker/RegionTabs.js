import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
// import Ionicons from 'react-native-vector-icons/Ionicons';

import { RegionPicker } from './RegionPicker';

/**
 * 地区选择tab组件类
 */
export default class RegionTabs extends Component {
	static propTypes = {
		onClose: PropTypes.func,         /* 关闭时调用的方法 */
		onSelectEnd: PropTypes.func,     /* 选择完成时的回调函数 */
	}

	/**
	 * 选择结束
	 * @return {void}
	 */
	onSelectEnd = () => {
		const { onSelectEnd, onClose } = this.props;
		onSelectEnd();
		onClose();
		setTimeout(() => {
			this._tabRef.goToPage(0);
		}, 200);
	}

	/**
	 * 渲染返回按钮
	 * @return {ReactComponent}
	 */
	renderBackView = index => {
		return (
			<View style={styles.backView}>
				<TouchableOpacity onPress={() => this.back(index)}>
					{/*<Ionicons name="ios-arrow-back" size={30}/>*/}
				</TouchableOpacity>
			</View>
		);
	}

	/**
	 * 返回地区或关闭页面
	 * @param  {Number} index tab页需要
	 * @return {void}
	 */
	back = index => {
		if(index < 0) {
			this.props.onClose();
		} else {
			this._tabRef.goToPage(index);
		}
	}

	/**
	 * 跳转到城市列表Tab页
	 * @return {void}
	 */
	goToCityTab = () => {
		if(this.props.level === 1) {
			this.onSelectEnd();
		} else {
			this._tabRef.goToPage(1);
		}
	}

	/**
	 * 跳转到地区列表Tab页
	 * @return {void}
	 */
	goToAreaTab = () => {
		if(this.props.level === 2) {
			this.onSelectEnd();
		} else {
			this._tabRef.goToPage(2);
		}
	}

	render() {
		const { level = 3 } = this.props;

		return (
			<ScrollableTabView
				renderTabBar={() => <View></View>}
				locked={true}
				ref={ref => this._tabRef = ref}
			>
				<ScrollView>
					{this.renderBackView(-1)}
					<RegionPicker type="province" onSelect={province => {this._tabRef.goToPage(1)}}/>
				</ScrollView>
				{
					level > 1 ?
					<ScrollView>
						{this.renderBackView(0)}
						<RegionPicker type="city" onSelect={city => {this._tabRef.goToPage(2)}}/>
					</ScrollView> : null
				}
				{
					level > 2 ?
					<ScrollView>
						{this.renderBackView(1)}
						<RegionPicker type="area" onSelect={this.onSelectEnd}/>
					</ScrollView> : null
				}
			</ScrollableTabView>
		);
	}
}

const styles = StyleSheet.create({
	backView: {
		flexDirection: 'row',
	}
});