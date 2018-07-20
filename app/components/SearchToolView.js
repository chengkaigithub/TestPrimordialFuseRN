import React, { Component, cloneElement } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import MaterIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { deviceWidth, deviceHeight, px } from '../utils/ScreenUtil';
import * as theme from '../config/theme.conf';
import { Text as _Text } from '../components';

/**
 * 搜索工具视图组件类
 *  - children 一般为搜索结果组件，搜索工具栏在children上方。
 */
export default class SearchToolView extends Component {
	static propTypes = {
		/* 搜索工具栏组件对其方式（默认为 'center'） */
		justifyContent: PropTypes.string,
	}

	state = {
		showModal: false,  /* 打开搜索工具窗口 */
		modalTop: 0,       /* 搜索工具窗口top值 */
	}

	componentWillMount() {
		this.returnRef();
	}

	/**
	 * 返回组件实例方法
	 * @return {void}
	 */
	returnRef = () => {
		this.props.returnRef({
			close: this.closeModal
		});
	}

	/**
	 * 渲染搜搜工具栏组件
	 * @return {ReactComponent} 搜索工具组件数组
	 */
	renderContent = () => {
		const { showModal } = this.state;

		return this.props.content.map((item, i) => {
			return cloneElement(item, {
				key: i,
				toolKey: i,
				openModal: this.openModal,
				closeModal: this.closeModal,
				showModal,
				openModalKey: this._openModalKey,
			});
		});
	}

	/**
	 * 获取工具窗口组件
	 * @return {ReactComponent}
	 */
	getChildrenComps = () => undefined;

	/**
	 * 当前打开窗口对应按钮的key
	 * @type {Nunber}
	 */
	_openModalKey = -1;

	/**
	 * 打开搜索工具窗口
	 * @return {void}
	 */
	openModal = (toolKey, resultComps) => {
		this.getChildrenComps = resultComps;
		this._openModalKey = toolKey,
		this._viewRef.measure((...arg) => {
			this.setState({
				showModal: true,
				modalTop: arg[3],
			});
		});
	}

	/**
	 * 关闭搜索工具窗口
	 * @return {void}
	 */
	closeModal = () => {
		this._openModalKey = undefined,
		this.setState({
			showModal: false,
		});
	}

	/**
	 * 渲染工具弹出窗口组件
	 * @return {ReactComponent}
	 */
	renderSearchModal = () => {
		const { showModal, modalTop } = this.state;
		if(showModal) {
			return (
				<TouchableOpacity
					style={[styles.toolBackground, {top: modalTop}]}
					onPress={this.closeModal}
					activeOpacity={1}
				>
					<View>{this.getChildrenComps()}</View>
				</TouchableOpacity>
			);
		}
	}

	render() {
		const {
			justifyContent = 'center',
			children,
			style = {},
			backgroundColor = '#fff',
		} = this.props;

		return (
			<View style={{flex: 1}}>
				<View
					ref={ref => this._viewRef = ref}
					style={[styles.filterBar, {justifyContent, backgroundColor}]}
				>
					{this.renderContent()}
				</View>
				{children}
				{this.renderSearchModal()}
			</View>
		);
	}
}

SearchToolView.Item = class Item extends Component {
	static propTypes = {
		title: PropTypes.string, /* 筛选项标题 */
		icon: PropTypes.node,    /* icon元素 */
		onPress: PropTypes.func,  /* 点击事件方法 */
	}

	render() {
		const {title, icon, style = {}} = this.props;

		return (
			<TouchableOpacity
				style={[styles.filterItem, style]}
				onPress={this.props.onPress}
			>
				<_Text numberOfLines={1} style={{color: theme.BASE_FONT_COLOR}}>
					{title}
					{ icon || null }
				</_Text>
			</TouchableOpacity>
		);
	}
}

SearchToolView.Select = class Select extends Component {
	static propTypes = {
		icon: PropTypes.node,            /* icon元素 */
		openModal: PropTypes.func,       /* 打开窗口的方法 */
		showModal: PropTypes.bool,       /* 窗口打开状态 */
		onSelect: PropTypes.func,        /* 选择时的回调函数 */
		showLabel: PropTypes.bool,       /* 显示文字（默认显示） */
		isPress: PropTypes.bool,         /* 是否可点击 */
		onPress: PropTypes.func,         /* 点击事件 */
		isTiggerLabel: PropTypes.bool,   /* 是否切换按钮文字 */
		defaultIndex: PropTypes.number,  /* 默认选中的选项下标 */
	}

	state = {
		selectedIndex: 0,  /* 选中的选项下标 */
	}

	componentWillMount() {
		const { defaultIndex = 0 } = this.props;

		this.setState({
			selectedIndex: defaultIndex,
		});
	}

	/**
	 * 选中后执行的函数
	 * @param  {Object} item 选中的选项
	 * @param  {Number} i    序号
	 * @return {void}
	 */
	onSelect = (item, i) => {
		const { onSelect = () => {} } = this.props;
		onSelect(item);

		this.setState({ selectedIndex: i });
		this.props.closeModal();
	}

	/**
	 * 渲染按钮文字
	 * @return {Node}
	 */
	renderLabel = () => {
		const {
			title = '',
			openModalKey,
			toolKey,
			isSelect = true,
			isTiggerLabel = true,
			options = [],
		} = this.props;
		const { selectedIndex } = this.state;

		let label = title;

		if(isSelect && isTiggerLabel && options.length > 0) {
			label = options[selectedIndex].label;
		}

		const titleColor = openModalKey === toolKey ? theme.BASE_COLOR : theme.BASE_FONT_COLOR;

		if(React.isValidElement(title)) {
			return title;
		} else {
			return (
				<Text style={[styles.itemLabel, {color: titleColor}]} numberOfLines={1}>
					{ label }
				</Text>
			);
		}
	}

	/**
	 * 按钮点击事件
	 * @return {void}
	 */
	onPress = () => {
		const {
			openModal,
			closeModal,
			options = [],
			showModal,
			toolKey,
			openModalKey,
			isSelect = true,
			onPress = () => {},
		} = this.props;
		const { selectedIndex } = this.state;

		if(!isSelect) {
			onPress();
			return;
		}


		if(showModal && openModalKey === toolKey) {
			closeModal();
		} else {
			openModal(toolKey, () => <SelectTool
				list={options}
				onSelect={this.onSelect}
				selectedIndex={selectedIndex}
			/>);
		}
	}

	render() {
		const {
			icon,
			openModalKey,
			toolKey,
			style,
			showLabel = true,
			isSelect = true,
		} = this.props;

		/* 设置选中时的图标 */
		let titleColor = openModalKey === toolKey ? theme.BASE_COLOR : theme.BASE_FONT_COLOR;
		let iconName = openModalKey === toolKey ? 'md-arrow-dropup' : 'md-arrow-dropdown';

		return (
			<TouchableOpacity style={[styles.filterItem, style]} onPress={this.onPress}>
				{
					showLabel ? this.renderLabel() : undefined
				}
				{
					icon || <View/>
				}
                {/*<Ionicons*/}
                    {/*name={iconName}*/}
                    {/*size={16}*/}
                    {/*color={titleColor}*/}
                    {/*style={styles.filterIcon}*/}
                {/*/>*/}
			</TouchableOpacity>
		);
	}
}

/**
 * 搜索工具栏选择器窗口
 * @param  {Object} props props
 * @return {ReactComponent}
 */
const SelectTool = props =>  {
    {/*<MaterIcons*/}
        {/*name="check"*/}
        {/*size={px(34)}*/}
        {/*style={{height: px(34)}}*/}
        {/*color={theme.BASE_COLOR}*/}
    {/*/>*/}
	const icon = (
		<View/>
	);

	const renderItem = (item, i) => {
		const textColor = props.selectedIndex === i ? theme.BASE_COLOR : '#555';
		return (
			<TouchableOpacity
				key={i}
				style={styles.selectItem}
				onPress={() => props.onSelect(item, i)}
				onStartShouldSetResponder={() => true}
				onMoveShouldSetResponder={() => true}
			>
				<_Text color={textColor} numberOfLines={1}>{item.label}</_Text>
				{props.selectedIndex === i ? icon : undefined}
			</TouchableOpacity>
		);
	}

	return (
		<View style={styles.filterModel}>
			{ props.list.map(renderItem) }
		</View>
	);
}

const styles = StyleSheet.create({
	filterBar: {
		flexDirection: 'row',
		alignItems: 'center',
		borderColor: '#eee',
		borderBottomWidth: 1,
		paddingLeft: px(10),
		paddingRight: px(10),
	},
	filterItem: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		paddingLeft: px(10),
		paddingRight: px(10),
		paddingTop: 8,
		paddingBottom: 8,
	},
	filterIcon: {
		marginLeft: 4,
	},
	toolBackground: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: deviceWidth,
		height: deviceHeight,
		backgroundColor: 'rgba(0, 0, 0, 0.4)',
	},
	filterModel: {
		backgroundColor: '#fff',
		padding: px(10),
	},
	selectItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingTop: px(10),
		paddingBottom: px(10),
		paddingLeft: px(16),
		paddingRight: px(16),
	},
	itemLabel: {
		fontSize: px(28),
	}
});