import React, { Component, PureComponent } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
import {showToast} from '../../../utils/ToastUtil';

import PageView from '../PageView';
import { SearchBar, Text as SxText, FlexView, Button, Checkbox } from '../../../components';
import PagingView, { ItemSeparator } from '../PagingView';
import { px } from '../../../utils/ScreenUtil';
import * as theme from '../../../config/theme.conf';
import storage from '../../../utils/storage';
import {
    CHOOSE_SUBORDINATE_AGENT,
    PLEASE_CHOOSE_AGENT,
    SUBORDINATE,
    NAME_AND_PHONE_NUMBER,
    CONFIRM,
} from '../../../config/string.conf';

const FlexItem = FlexView.Item;

const URL = {
	/* 商户列表url */
	SUB_LIST: '/users/getNextLeverUserAll',
};
/**
 * todo 暂未使用
 */
export default class AgentSelect extends Component {
	static navigationOptions = ({navigation, navigation: {state}}) => ({
		title: CHOOSE_SUBORDINATE_AGENT,
		headerLeft: (
			<TouchableOpacity onPress={state.params && state.params.backLevel}>
				{/*<Ionicons name="ios-arrow-back" size={30} color="#fff" style={styles.backLevelBtn}/>*/}
			</TouchableOpacity>
		),
		headerRight: (
			<TouchableOpacity onPress={() => navigation.goBack()}>
				{/*<Ionicons name="md-close" size={26} color="#fff" style={styles.closeBtn}/>*/}
			</TouchableOpacity>
		)
	})

	state = {
		keyword: '',
		checkedAgent: {},
		agentParentName: '',
	}

	componentWillMount() {
		storage.load({
			key: 'loginData'
		}).then(data => {
			this.currentUserId = data.userId;
			this.runSearch();
		});
        const {isSaleBusiness} = this.props.navigation.state.params
		this.setBackLevelBtn();
	}

	/**
	 * 当前用户ID
	 * @type {String}
	 */
	currentUserId = ''

	/**
	 * 查询条件
	 * @type {Object}
	 */
	searchParams = {
		parentUserId: '',
		param: ''
	}

	/**
	 * 上级代理ID数组
	 * @type {Array}
	 */
	superiorHistoryArray = []

	/**
	 * 修改搜索条件并执行搜索
	 * @param  {Object} params 要修改的搜索条件
	 * @return {void}
	 */
	runSearch = (params = {}) => {
		this.searchParams = {...this.searchParams, ...params};

		let url = this.searchParams.parentUserId ? 'false' : 'true';
		this._pagingRef.refresh({
			params: this.searchParams,
			url: `${URL.SUB_LIST}/${url}`,
		});
	}

	/**
	 * 显示返回上级按钮
	 * @return {void}
	 */
	setBackLevelBtn = () => {
		const { navigation: {setParams} } = this.props;

		setParams({
			backLevel: this.backLevel,
		});
	}

	/**
	 * 返回上级
	 * @return {void}
	 */
	backLevel = () => {
		let parent = {};

		if(this.superiorHistoryArray.length === 0) {
			this.props.navigation.goBack();
			return;
		}

		if(this.superiorHistoryArray.length > 1) {
			this.superiorHistoryArray.pop();
			parent = this.superiorHistoryArray[this.superiorHistoryArray.length - 1];
		} else {
			this.superiorHistoryArray = [];
		}

		this.runSearch({
			parentUserId: parent.id,
			param: '',
		});

		this.setState({
			keyword: '',
			checkedAgent: {},
			agentParentName: parent.name,
		});
	}

	/**
	 * 渲染代理列表项
	 * @param  {Object} options.item 代理信息
	 * @return {Node}
	 */
	renderAgentItem = ({item}) => {
		const { checkedAgent } = this.state;
        const {isSaleBusiness} = this.props.navigation.state.params
        return (
			<AgentItem
				item={item}
				isSaleBusiness={isSaleBusiness}
				isRoot={this.isRoot}
				queryAgent={this.queryAgent}
				onChecked={this.onChecked}
				checkedAgent={checkedAgent}
			/>
		);
	}

	/**
	 * 选择代理
	 * @param  {Boolean} checked 是否选中
	 * @param  {Object} item     代理信息
	 * @return {void}
	 */
	onChecked = (checked, item) => {
		if(checked) {
			this.setState({
				checkedAgent: item,
			});
		}
	}

	/**
	 * 判断是否是自己
	 * @param  {Object} agent 代理信息
	 * @return {Boolean}
	 */
	isRoot = agent => {
		return agent.id === this.currentUserId;
	}

	/**
	 * 选择代理并返回页面
	 * @param  {Object} agent 选中的代理
	 * @return {void}
	 */
	resultAgent = () => {
		const { state, goBack } = this.props.navigation;
		const { checkedAgent } = this.state;
        const {selectItemData,isSaleBusiness} = this.props.navigation.state.params;
        if(Object.keys(checkedAgent).length === 0) {
			showToast(PLEASE_CHOOSE_AGENT);
			return;
		} else {
			if(isSaleBusiness){
                // console.log('=======>selectItemData',selectItemData)
                // console.log('=======>checkedAgent',checkedAgent)
                this.props.navigation.navigate('TransferConfirm', {
                    selectItemData:selectItemData,
                    checkedAgent: checkedAgent
                });
			}else{
                state.params.callback(checkedAgent);
                goBack();
			}

		}
	}

	/**
	 * 查询代理下级
	 * @param  {Object} agent 代理信息
	 * @return {void}
	 */
	queryAgent = agent => {
		this.setState({
			checkedAgent: {},
			agentParentName: agent.name
		});
		this.runSearch({
			parentUserId: agent.id,
		});
		this.superiorHistoryArray.push(agent);
	}

	/**
	 * 打开搜索页面
	 * @return {void}
	 */
	handleSearchPageClick = () => {
		this.props.navigation.navigate('SearchPage', {
			historyKey: 'AgentSelect',
			keyword: this._search.props.value,
			callback: keyword => {
				this.setState({
					keyword: keyword,
					checkedAgent: {},
					agentParentName: '',
				});
				this.runSearch({
					param: keyword,
					parentUserId: ''
				});
			}
		});
	}

	/**
	 * 下级代理标题
	 * @return {Node}
	 */
	agentListHeader = () => {
		const { agentParentName } = this.state;

		if(agentParentName) {
			return (
				<View style={styles.agentRootFooter}>
					<SxText size={26}>{agentParentName}{SUBORDINATE}</SxText>
				</View>
			);
		} else {
			return null;
		}
	}

	render() {
		const { keyword, checkedAgent } = this.state;

		return (
			<PageView scroll={false}>
				<SearchBar
					placesholder={NAME_AND_PHONE_NUMBER}
					onFocus={this.handleSearchPageClick}
					ref={ref => this._search = ref}
					value={keyword}
					backgroundColor={theme.PAGE_BG_COLOR}
					inputBackgroundColor="#fff"
				/>
				<PagingView
					renderItem={this.renderAgentItem}
					keyExtractor={(...args) => args[1]}
					listUrl={`${URL.SUB_LIST}/true`}
					ItemSeparatorComponent={ItemSeparator}
					ListHeaderComponent={this.agentListHeader}
					_ref={ref => this._pagingRef = ref}
					fetchParams={this.searchParams}
					auto={false}
					extraData={checkedAgent}
				/>
				<Button
					type="primary"
					onClick={this.resultAgent}
					radius={false}
				>
					{CONFIRM}
				</Button>
			</PageView>
		);
	}
}

class AgentItem extends PureComponent {
	render() {
		const {
			item,
			isRoot,
			queryAgent,
			checkedAgent,
			onChecked,
            isSaleBusiness
		} = this.props;

		const _isRoot = isRoot(item);

		const agent = {
			id: item.id,
			name: _isRoot ? item.userName : item.nickName,
            identityId: item.identityId
    }
		return (
			<View>
				<FlexView style={styles.agentItem}>
					<Checkbox
						type="circle"
						checked={checkedAgent.id === agent.id}
						onChange={checked => onChecked(checked, agent)}
						style={styles.agentCheckbox}
						size={42}
					/>
					<FlexItem>
						<TouchableOpacity
							onPress={_isRoot ? () => {} : isSaleBusiness ? ()=>{} : () => queryAgent(agent)}
						>
							<FlexView>
								<FlexItem>
									<SxText style={{marginBottom:px(11)}}>{agent.name}</SxText>
								</FlexItem>
								{
									_isRoot ?
									null :
                                        isSaleBusiness ?
									null
										 :
									<View/>
								}
                                {/*<Ionicons name="ios-arrow-forward" size={18} color="#ccc" style={styles.closeBtn}/>*/}

							</FlexView>
						</TouchableOpacity>
					</FlexItem>
				</FlexView>
				{
					_isRoot ?
					<View style={styles.agentRootFooter}>
						<SxText size={26}>{agent.name}{SUBORDINATE}</SxText>
					</View> : null
				}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	agentItem: {
		paddingLeft: px(40),
		paddingTop: px(20),
		paddingBottom: px(20),
		backgroundColor: '#fff',
	},
	agentRootFooter: {
		paddingLeft: px(40),
		paddingTop: px(10),
		backgroundColor: theme.PAGE_BG_COLOR
	},
	backLevelBtn: {
		marginLeft: 10,
		marginRight: 6,
		color: '#fff',
	},
	closeBtn: {
		marginLeft: 12,
		marginRight: 12,
	},
	agentCheckbox: {
		marginRight: px(20),
	}
});