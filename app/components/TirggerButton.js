import React, { Component } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
// import MaterIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import * as theme from '../config/theme.conf';
import { px } from '../utils/ScreenUtil';

/**
 * 状态切换按钮
 */
export default class TirggerButton extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selected: props.selected,  /* 选中状态 */
		}
	}

	componentWillReceiveProps(nextProps) {
		const { selected } = nextProps;
		if(selected !== this.props.selected) {
			this.setState({
				selected: selected,
			});
		}
	}

	/**
	 * 切换状态
	 * @return {void}
	 */
	tirgger = () => {
		const { onChange } = this.props;
		const { selected } = this.state;
		if(onChange(!selected)) {
			this.setState({
				selected: !selected
			});
		}
	}

	/**
	 * 渲染选中图标
	 * @return {ReactComponent}  选中图标组件
	 */
	renderIcon = () => {
		const { selected } = this.state;
		if(!selected) return undefined;
        {/*<MaterIcons*/}
        {/*name="check"*/}
        {/*size={px(26)}*/}
        {/*color={theme.BASE_COLOR}*/}
        {/*style={{*/}
        {/*width: px(26),*/}
        {/*height: px(26),*/}
        {/*marginRight: 3,*/}
        {/*}}*/}
        {/*/>*/}
		return (
			<View/>
		);
	}

	render() {
		const { label } = this.props;
		const { selected } = this.state;
		const color = selected ? theme.BASE_COLOR : '#ccc';
		const textColor = selected ? theme.BASE_COLOR : '#555';
		const activeStyle = selected ? styles.tirggerButtonActive : {};

		return (
			<TouchableOpacity
				onPress={this.tirgger}
				activeOpacity={0.7}
				style={[styles.tirggerButton, {borderColor: color}, activeStyle]}
			>
				{this.renderIcon()}
				<Text style={[styles.tirggerButtonText, {color: textColor}]}>
					{label}
				</Text>
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	tirggerButton: {
		flexDirection: 'row',
		borderRadius: px(12),
		padding: px(10),
		paddingLeft: px(30),
		paddingRight: px(30),
		borderWidth: 1,
		margin: px(10),
	},
	tirggerButtonActive: {
		paddingLeft: px(15),
		paddingRight: px(15),
	},
	tirggerButtonText: {
		fontSize: px(26),
	}
})