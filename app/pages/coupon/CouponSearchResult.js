import React, { Component } from 'react';
import {StyleSheet, View, Text, DeviceEventEmitter, TouchableOpacity, Image} from 'react-native';
// import fetch from 'sx-fetch/src';
import {px} from '../../utils/ScreenUtil';
import {Header, SearchBar} from "../../components";
import * as theme from '../../config/theme.conf';
import PagingView, {ItemSeparator} from "../common/PagingView";
import CouponItem from '../common/CouponItem';
import {deviceWidth} from '../../utils/ScreenUtil';
import {
    INPUT_MERCHANT_NAME_MCC,
    COUPON, HISTORY_RECORD_HINT,
    NETWORK_UNSTABLE_PLEASE_TRY_AGAIN, NO_COUPON_HISTORY_HINT, RECEIVE_SUCCESS,
} from '../../config/string.conf';
import PageView from "../common/PageView";
import {QUERY_COUPON_LIST, QUERY_HISTORY_COUPON, USE_NOW_COUPON} from "../../config/url.conf";
import {handleError, handleSimpleData} from "../../utils/ResponseDataProcessUtils";
import {hideToast, showLoading, showToast} from "../../utils/ToastUtil";
import {urlEncode} from "../../utils/StringUtil";

// @fetch.inject()
export default class CouponSearchResult extends Component {

    static navigationOptions = navigation => ({
        header: Header({
            title: `${navigation.navigation.state.params && navigation.navigation.state.params.name ? navigation.navigation.state.params.name : ''}${COUPON}`,
            backButtonColor: theme.COLOR_WHITE,
            headerTintColor: theme.COLOR_WHITE,
            headerStyle: {
                backgroundColor: theme.BASE_COLOR,
                barStyle: "light-content",
            }
        }),
    });

    state = {
        renderState: 'HISTORY', // [ 'HISTORY', 'SEARCH' ]
        historyCouponList: [],
        type: '', // 行业大类 类别
        isShowGoTop: false, // 是否展示返回到顶部的布局
    };

    alreadyChosenItem = -1; // 当前已选则的优惠券

    searchParams = {
        ideName: '',
        categoryId: '',
    };

    /**
     * 改变传递得参数
     * @param value
     */
    setSearchParams = (value) => {
        this.searchParams.ideName = urlEncode(value);
    };

    /**
     * 点击立即使用
     * @param item
     */
    useNowCoupon = (dataItem, type = '', index) => {
        if (dataItem.selected) return;
        showLoading();
        let requestData = {
            ideName: urlEncode(dataItem.ideName),
            ideNo: dataItem.ideNo,
            mcc: dataItem.mcc,
            avgAmt: dataItem.avgAmt,
            createTime: dataItem.createTime,
        };
        // this.props.$fetch.post(USE_NOW_COUPON, requestData).then(data => {
        //     handleSimpleData(data, () => {
        //         showToast(RECEIVE_SUCCESS, 1, () => {
        //             DeviceEventEmitter.emit('RefreshHistoryCoupon', '刷新历史优惠券');
        //         });
        //         try {
        //             setTimeout(() => {
        //                 this.props.navigation.state.params.refreshData();
        //             }, 500);
        //         } catch (e) {
        //         }
        //         if (type === 'HISTORY') {
        //             setTimeout(() => {
        //                 this.queryHistoryCoupon();
        //             }, 500);
        //         } else {
        //             // this._pagingRef.refresh();
        //             this.resetListData(dataItem, index);
        //         }
        //     }, (errMsg) => {
        //         showToast(errMsg);
        //     });
        // }).catch(err => {
        //     showToast(handleError(err));
        // });
    };

    /**
     * 重置列表数据
     * @param dataItem
     */
    resetListData = (dataItem, index) => {
        let currentSelectItem = index;
        let list = this._pagingRef.getState().list;
        if (this.alreadyChosenItem !== -1) {
            list[this.alreadyChosenItem].selected = false;
        }
        if (currentSelectItem !== -1) {
            list[currentSelectItem].selected = true;
        }
        this._pagingRef.setStateList(list);
        this.alreadyChosenItem = currentSelectItem;
    };

    /**
     * 渲染优惠券列表
     * @param item
     * @returns {*}
     */
    renderItem = ({item, index}) => {
        if (item.selected) {
            this.alreadyChosenItem = index
        }
        return <CouponItem tag={index} couponData={item} btnType='USE' onClick={() => this.useNowCoupon(item, '', index)}/>;
    };

    /**
     * 搜索调用方法
     */
    searchCoupon = () => {
        this.setState({renderState: 'SEARCH'}, () => {
            this._pagingRef.refresh();
        })
    };

    /**
     * 设置搜索框的值
     */
    setSearchText = (value) => {
        this.setSearchParams(value);
    };

    /**
     * 设置搜索行业大类类别
     */
    setSearchCategoryId = (value) => {
        this.searchParams.categoryId = value;
    };

    componentDidMount() {
        let params = this.props.navigation.state.params;
        this.setSearchCategoryId(!!params ? !!params.id ? params.id : '' : '');
        if (params && params.type === 'default') {
            this.setState({
                type: params && params.type ? params.type : ''
            });
            this.queryHistoryCoupon()
        }
        this.subscription = DeviceEventEmitter.addListener('RefreshHistoryCoupon', this.queryHistoryCoupon);
    }

    componentWillUnmount() {
        this.subscription.remove();
    }

    /**
     * 查询历史优惠券
     */
    queryHistoryCoupon = () => {
        showLoading();
        // this.props.$fetch.post(QUERY_HISTORY_COUPON)
        //     .then((data) => {
        //         hideToast();
        //         handleSimpleData(data, (successData, dataIsNull) => {
        //             this.setState({historyCouponList: successData})
        //         }, (err) => {
        //             showToast(err);
        //         })
        //     }).catch((err) => {
        //     showToast(handleError(err));
        // })
    };

    /**
     * 取消点击事件
     */
    cancelSearch = () => {
        this._search.defaultCancel();
        if (!!this.searchParams.categoryId) {
            this._pagingRef.refresh();
        } else {
            this.setState({
                renderState: 'HISTORY'
            });
        }
    };

    /**
     * 渲染历史优惠券
     */
    renderHistoryCoupon = () => {
        let historyCouponList = this.state.historyCouponList;
        if (historyCouponList.length === 0) {
            return <Text style={styles.noCouponHistoryTextStyle}>{NO_COUPON_HISTORY_HINT}</Text>
        }
        let views = historyCouponList.map((item, position) => {
            return (
                <CouponItem key={position} couponData={item} couponStatus='HISTORY' btnType='USE' onClick={() => this.useNowCoupon(item, 'HISTORY')}/>
            )
        });
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.firstTextStyle}>{HISTORY_RECORD_HINT}</Text>
                {views}
            </View>
        )
    };

    onPageListRefreshStart = () => {
        this.alreadyChosenItem = -1;
    }

    /**
     * 列表滑动状态改变
     * @param status
     */
    onScrollStatusChange = (status) => {
        switch(status) {
            case 'GO_BOTTOM':
            case 'AT_TOP':
                this.setState({isShowGoTop: false})
                break;
            case 'GO_TOP':
                this.setState({isShowGoTop: true})
                break;
        }
    }

    /**
     * 回到界面顶端
     */
    goToPageTop = () => {
        this._pagingRef.goListTop();
    }

    /**
     * 渲染返回顶端布局
     */
    renderGoTopView = () => {
        return (
            this.state.isShowGoTop ?
                <TouchableOpacity activeOpacity={1} onPress={this.goToPageTop} style={styles.goTopImgContainerStyle}>
                    <Image
                        source={require('../../assets/images/coupon/go_top.png')}
                        style={styles.goTopImgStyle}
                    />
                </TouchableOpacity> : <View/>
        )
    }

    /**
     * 渲染查询的优惠券
     */
    renderSearchCoupon = () => {
        return (
            <View style={styles.centerContainer}>
                <PagingView
                    onScrollStatusChange={this.onScrollStatusChange}
                    onPageListRefreshStart={this.onPageListRefreshStart}
                    pageSize={30}
                    renderItem={this.renderItem}
                    ItemSeparatorComponent={() => ItemSeparator({paddingLeft: 0})}
                    listUrl={QUERY_COUPON_LIST}
                    fetchMethod="post"
                    endMode='lastListNone'
                    fetchParams={this.searchParams}
                    _ref={ref => this._pagingRef = ref}
                />
                {this.renderGoTopView()}
            </View>
        )
    };

    /**
     * 渲染优惠券
     * @returns {*}
     */
    renderCoupon = () => {
        return (
            this.state.type === 'default'
                ?
                (this.state.renderState === 'HISTORY') ? this.renderHistoryCoupon() : this.renderSearchCoupon()
                :
                this.renderSearchCoupon()
        );
    };

    render() {
        return (
            <PageView style={styles.containerStyle} scroll={false}>
                <SearchBar
                    ref={ref => this._search = ref}
                    showCancel={true}
                    placeholder={INPUT_MERCHANT_NAME_MCC}
                    onChangeText={(text) => this.setSearchText(text)}
                    onSubmitEditing={this.searchCoupon}
                    onCancel={this.cancelSearch}
                />
                {this.renderCoupon()}
            </PageView>
        );
    }
}

const styles = StyleSheet.create({
    containerStyle: {
        flex: 1,
    },
    containerViewStyle: {
        flexDirection: 'column',
        alignItems: 'center',
        width: deviceWidth,
        height: px(111),
        backgroundColor: '#F5F5F5'
    },
    centerContainer: {
        flex: 1,
        marginTop:px(19),
    },
    firstTextStyle: {
        fontSize: px(30),
        color: '#3B3B3B',
        paddingLeft: px(30)
    },
    noCouponHistoryTextStyle: {
        textAlign: 'center',
        marginTop: px(30)
    },
    goTopImgContainerStyle: {
        position: 'absolute',
        bottom: px(20),
        right: px(18),
    },
    goTopImgStyle: {
        width: px(80),
        height: px(80)
    }
});
