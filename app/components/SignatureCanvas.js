import React, { Component } from 'react';
import { View, StyleSheet, ART, takeSnapshot, findNodeHandle } from 'react-native';

import { px } from '../utils/ScreenUtil';

const { Surface, Shape, Path } = ART;

/**
 * 签名画布组件类
 */
export default class SignatureCanvas extends Component {
	state = {
		strokePath: undefined,
	}

	/**
	 * 笔画数组
	 * @type {Array}
	 */
	strokeArray = [[]]

	/**
	 * 是否采集坐标（用于限制坐标采集频率，优化性能）
	 * @type {Boolean}
	 */
	strokeAllow = true

	/**
	 * 绘制图案
	 * @return {void}
	 */
	strokeCanvas = () => {
		this.strokeAstrict(() => {
			const path = Path();

			this.strokeArray.map(sign => {
				sign.map(({ x, y }, i) => {
					if(i === 0) {
						path.moveTo(x, y);
					} else {
						path.lineTo(x, y);
					}
				});
			});

			this.setState({
				strokePath: path
			});
		});
	}

	/**
	 * 限制坐标采集频率
	 * @param  {Function} strokeMethod 绘图函数
	 * @return {void}
	 */
	strokeAstrict = strokeMethod => {
		if(this.strokeAllow) {
			this.strokeAllow = false;
			const timer = setTimeout(() => {
				this.strokeAllow = true;
				clearTimeout(timer);
			}, 50);

			strokeMethod()
		}
	}

	/**
	 * 手指滑动事件
	 * @param  {Object} event 事件对象
	 * @return {void}
	 */
	touchMove = event => {
		const { locationX, locationY } = event.nativeEvent;

		this.strokeArray[this.strokeArray.length - 1].push({
			x: locationX,
			y: locationY,
		});

		this.strokeCanvas();
	}

	/**
	 * 手指离开事件
	 * @return {void}
	 */
	touchEnd = (event) => {
		this.strokeArray.push([]);
	}

	/**
	 * 生成图片
	 * @return {void}
	 */
	toImage = () => {
		return takeSnapshot(findNodeHandle(this.viewRef));
	}

	/**
	 * 获取笔画数
	 * @return {Number} 笔画数
	 */
	getLength = () => {
		return this.strokeArray.length - 1;
	}

	/**
	 * 清除画布
	 * @return {void}
	 */
	clear = () => {
		this.setState({
			strokePath: undefined,
		});

		this.strokeArray = [[]];
	}

	render() {
		const { strokePath } = this.state;
		const { width = px(750), height = px(400) } = this.props;

		return (
			<View style={[styles.box, {width, height}]} ref={ref => this.viewRef = ref}>
				<View
					onStartShouldSetResponder={() => true}
					onResponderMove={this.touchMove}
					onResponderRelease={this.touchEnd}
				>
					<Surface width={width} height={height}>
						<Shape d={strokePath} stroke="#000000" strokeWidth={2}/>
					</Surface>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	box: {
		backgroundColor: '#fff',
	}
})