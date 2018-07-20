import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import fetch from 'sx-fetch/src';

import { px } from '../../utils/ScreenUtil';
import * as theme from '../../config/theme.conf';
import { SearchBar, FlexView as Flex } from '../../components';
import PagingView, { ItemSeparator } from './PagingView';
import PageView from './PageView';

const URL = {
	/* 商户列表url */
    SUB_LIST: '/users/getNextLeverUserAll',
};

/**
 * 暂未使用
 * @constructor
 */

@fetch.inject()
export default class SubagentSearch extends Component {
    state = {
        keyword: '',
    }
    searchParams = {};
    static navigationOptions = navigation => ({
        title: '选择下级',
    })

    handleSearchPageClick = () => {
		this.props.navigation.navigate('SearchPage', {
			historyKey: 'SubagentSearch',
			keyword: this._search.props.value,
			callback: keyword => {
				this.setState({keyword: keyword});
				this.runSearch({userName: keyword});
			}
		});
    }
    
    /**
	 * 修改搜索条件并执行搜索
	 * @param  {Object} params 要修改的搜索条件
	 * @return {void}
	 */
	runSearch = (params = {}) => {
		this.searchParams = {...this.searchParams, ...params};
		this._pagingRef.refresh({
			params: this.searchParams
		});
    }

    formatData = ({data = {}}) => {
		return {
			list: data.records,
			count: data.total
		}
    }

    callBack = (item) => {
        this.props.navigation.state.params.callback(item);
        this.props.navigation.goBack();
    }
    
    renderItem = ({item}) => {
		return  (
                <TouchableOpacity onPress={() => this.callBack(item)}>
                    <View style={styles.background}>
                        <Flex style={styles.all}>
                            <View style={styles.icon}>
                                <Flex style={styles.left}>
                                    <View style={styles.round}>
                                        <Text style={styles.portrait}>{item.userName[0]}</Text>
                                    </View>
                                    <Text style={styles.name}>{item.userName}</Text>
                                </Flex>
                            </View>
                        </Flex>
                    </View>
                </TouchableOpacity>
        )
	}
    render() {
        const { keyword } = this.state;
        let { hasOneSelf = false } = this.props.navigation.state.params;
        return (
            <PageView style={styles.flex} scroll={false}>
                <SearchBar 
                    backgroundColor = '#F5F5F9'
                    inputBackgroundColor = '#FFF'
                    placeholder="搜索 姓名/手机号"
                    ref={ref => this._search = ref}
                    value={keyword}
                    onFocus={this.handleSearchPageClick}
                />
                <PagingView
                    renderItem={this.renderItem}
                    ItemSeparatorComponent={ItemSeparator}
                    keyExtractor={item => item.id}
                    listUrl={`${URL.SUB_LIST}/${hasOneSelf}`}
                    fetchParams={this.searchParams}
                    _ref={ref => this._pagingRef = ref}
                    formatData={this.formatData}
                />
            </PageView>
        )
    }
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    background: {
        backgroundColor: '#FFFFFF',
    },
    all: {
        height: px(80),
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    icon: {
       marginLeft: px(33), 
       justifyContent: 'space-between',
    },
    portrait: {
        textAlign: 'center',
        color: '#FFF',
        fontWeight: 'bold',
        backgroundColor: 'transparent',
    },
    name: {
        color: theme.BASE_FONT_COLOR,
        marginLeft: px(40),
    },
    group: {
        marginRight: px(33),
        color: theme.BASE_FONT_COLOR,
    },
    left: {
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    round: {
        width: px(70),
        height: px(70),
        borderRadius: px(35),
        backgroundColor: 'lightgray',
        justifyContent: 'center',
    }
})