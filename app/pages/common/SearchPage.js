import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { WhiteSpace, List } from 'antd-mobile';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { px } from '../../utils/ScreenUtil';
import { Text as _Text, SearchHeader } from '../../components';
import storage from '../../utils/storage';
import { LogoutHandlePush } from '../../utils/LoginUtil';
import {
    HISTORY_SEARCH,
    CLEAN_SEARCH_HISTORY,
} from '../../config/string.conf';

/**
 * 退出登录时需要执行的操作
 * @return {void}
 */
LogoutHandlePush(() => {
	storage.save({
		key: 'SearchHistory',
		data: {},
	});
});

/**
 * 搜索页面公用组件类
 *  - 以搜索栏作为header
 *  - 提交搜索跳转到指定的搜索结果页
 *  - 为每个搜索结果页独立保存搜索历史
 */
export default class SearchPage extends Component {
	static navigationOptions = {
		header: null,
	}

	state = {
		historyList: [],   /* 搜索历史列表 */
	}

	componentDidMount() {
		this.getHistory();
	}

	/**
	 * 根据key获取不同页面的搜索历史
	 * @return {void}
	 */
	getHistory = () => {
		const { historyKey } = this.props.navigation.state.params;

		storage.load({
			key: 'SearchHistory',
		}).then((data = {}) => {
			this.setState({
				historyList: data[historyKey] || []
			});
		}).catch(err => {
			storage.save({
				key: 'SearchHistory',
				data: {}
			});
		});
	}

	/**
	 * 保存搜索记录
	 * @return {void}
	 */
	setHistory = keyword => {
		const { historyKey } = this.props.navigation.state.params;
		const { historyList } = this.state;

		/* 如果搜索历史已包含当前关键字，则不保存 */
		if(!!keyword && !historyList.includes(keyword)) {
			storage.load({
				key: 'SearchHistory',
			}).then((data = {}) => {
				storage.save({
					key: 'SearchHistory',
					data: {
						...data,
						[historyKey]: [keyword, ...historyList]
					}
				});
			});
		}
	}

	/**
	 * 清除搜索历史
	 * @return {void}
	 */
	clearHistory = () => {
		const { historyKey } = this.props.navigation.state.params;

		this.setState({ historyList: [] });

		storage.load({
			key: 'SearchHistory',
		}).then((data = {}) => {
			storage.save({
				key: 'SearchHistory',
				data: {
					...data,
					[historyKey]: []
				}
			});
		});
	}

	/**
	 * 提交搜索
	 * @param  {String} keyword 关键字
	 * @return {void}
	 */
	handleSubmitClick = keyword => {
		const { state, goBack } = this.props.navigation;

		this.setHistory(keyword);
		state.params.callback(keyword);
		goBack();
	}

	/**
	 * 返回页面
	 * @return {void}
	 */
	onCancel = () => {
		this.props.navigation.goBack();
	}

	/**
	 * 渲染搜素历史列表组件
	 * @param  {String} history 搜索历史字符串
	 * @param  {Number} i   下标
	 * @return {ReactComponent}
	 */
	renderHistoryItem = (history, i) => (
		<List.Item key={i} onClick={() => this.handleSubmitClick(history)}>
			<_Text color="#666">{history}</_Text>
		</List.Item>
	)

	autoGetList = value => {
	}

	render() {
		const { keyword = "" } = this.props.navigation.state.params;
		const { historyList } = this.state;

		return (
			<View style={{flex: 1}}>
				<SearchHeader
					defaultValue={keyword}
					onCancel={this.onCancel}
					onSubmit={this.handleSubmitClick}
					showCancelButton={true}
					onChange={this.autoGetList}
				/>
				<WhiteSpace size="lg"/>
				<ScrollView>
					{
						historyList.length > 0 ?
						<View>
							<List
								renderHeader={
									() => <Text style={styles.historyHeader}>{HISTORY_SEARCH}</Text>
								}
							>
								{ historyList.map(this.renderHistoryItem) }
							</List>
							<WhiteSpace/>
							<View style={styles.clearBox}>
								<TouchableOpacity
									style={styles.clearBtn}
									onPress={this.clearHistory}
								>
									<Text style={styles.clearText}>
										{/*<FontAwesome name="trash-o"*/}
											{/*size={px(30)}*/}
											{/*style={styles.clearIcon}*/}
										{/*/>*/}
										<Text> {CLEAN_SEARCH_HISTORY}</Text>
									</Text>
								</TouchableOpacity>
							</View>
						</View> : undefined
					}
				</ScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	clearBox: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	clearBtn: {
		borderColor: '#aaa',
		borderWidth: 1,
		borderRadius: px(10),
		padding: px(12),
		paddingLeft: px(30),
		paddingRight: px(30),
		width: px(300),
	},
	clearText: {
		textAlign: 'center',
		color: '#777',
		alignItems: 'center',
		fontSize: px(26),
	},
	clearIcon: {
		marginRight: px(20),
	},
	historyHeader: {
		backgroundColor: '#fff',
		padding: 10
	}
})
