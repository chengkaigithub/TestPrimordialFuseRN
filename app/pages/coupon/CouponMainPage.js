import React, { Component } from 'react';
import {
    Image, StyleSheet, View, ScrollView, Text, TouchableOpacity, RefreshControl, ActivityIndicator,
    InteractionManager, Platform, BackHandler, ListView, ImageStore, ImageBackground
} from 'react-native';
// import fetch from 'sx-fetch/src';
import {deviceWidth, px} from '../../utils/ScreenUtil';
import {Header, GridView} from "../../components";
import PagingView, {ItemSeparator} from "../common/PagingView";
import * as theme from '../../config/theme.conf';
import CouponItem from '../common/CouponItem';
import {
    COUPON,
    RECEIVE_SUCCESS,
    INPUT_MERCHANT_NAME_MCC,
    NETWORK_UNSTABLE_PLEASE_TRY_AGAIN,
    CURRENT_USE_COUPON, GO_BACK_TOP_QUERY_MERCHANT,
} from '../../config/string.conf';
import {hideToast, showLoading, showToast} from "../../utils/ToastUtil";
import {handleError, handleSimpleData} from "../../utils/ResponseDataProcessUtils";
import {COUPON_PAGE_INIT, QUERY_COUPON_LIST, USE_NOW_COUPON} from "../../config/url.conf";
import {checkStr, urlEncode} from "../../utils/StringUtil";
import NavigationUtil from '../../utils/NavigationUtil';
import {IS_ANDROID_OS, IS_IOS_OS} from "../../utils/PlatformUtil";
import {NavigationActions} from "react-navigation";

// @fetch.inject()
export default class CouponMainPage extends Component {

    static navigationOptions = ({navigation, navigation: {state}}) => ({
        header: Header({
            title: COUPON,
            backButtonColor: theme.COLOR_WHITE,
            headerTintColor: theme.COLOR_WHITE,
            headerStyle: {
                borderBottomWidth: 0,
                backgroundColor: theme.BASE_COLOR,
                barStyle: "light-content",
            },
            // onBack: nav => {
            //     !!state && !!state.params && state.params.onBackPage();
            // }
        }),
        // gesturesEnabled: false,
    });

    state = {
        city: '',                        /* 城市 */
        ideName: '',                     /* 已领取优惠券名称 */
        merData: '',                     /* 展示的新商户信息 */
        isRefreshing: false,
        isShowGoTop: false,              /* 是否展示返回到顶部的布局 */
    };

    alreadyChosenItem = -1; // 当前已选则的优惠券
    lastLoadTime = ''; // 上一次加载更多的时间戳
    tempOffsetY = 0; // 上一次滑动的临时偏移量
    isCalculationScrollDistance = false; // 是否计算滑动方向距离

    componentDidMount() {
        const {navigation: {setParams}} = this.props;
        setParams({
            onBackPage: this.onBackPage,
        });
        // InteractionManager.runAfterInteractions(() => {
            this.netInitData();
        // });
        this.registerAndroidBack();
    }

    componentWillUnmount() {
        this.unRegisterAndroidBack()
        this.removeImageInfoFromImageStore();
        //重写组件的setState方法，直接返回空
        this.setState = (state, callback) => {
            return;
        };
    }

    /**
     * 移除加载在内存中的图片信息(only ios)
     */
    removeImageInfoFromImageStore = () => {
        if (IS_IOS_OS) {
            try {
                let merData = this.state.merData;
                let length =  merData.length;
                for (let i = 0; i < length; i++) {
                    let uri = merData[i].path;
                    ImageStore.removeImageForTag(uri);
                }
            } catch (e) {}
        }
    }

    /**
     * 界面返回
     */
    onBackPage = () => {
        NavigationUtil.back(this.props.navigation, 'MainTabHome');
        return true;
    };

    /**
     * 注册android返回事件
     */
    registerAndroidBack = () => {
        if (IS_ANDROID_OS) {
            BackHandler.addEventListener('physicalReturnKey', this.onBackPage);
        }
    };

    /**
     * 解除注册android返回事件
     */
    unRegisterAndroidBack = () => {
        if (IS_ANDROID_OS) {
            BackHandler.removeEventListener('physicalReturnKey', this.onBackPage);
        }
    };

    /**
     * 查询可选商户
     */
    netInitData = () => {
        showLoading();
        // this.props.$fetch.post(COUPON_PAGE_INIT).then(data => {
        //     handleSimpleData(data, (successData, dataIsNull) => {
        //         if (dataIsNull) {
        //             showToast(NETWORK_UNSTABLE_PLEASE_TRY_AGAIN); // 数据异常
        //             return;
        //         }
        //         this.setState({
        //             ideName: successData.couponVo.ideName,
        //             city: successData.city,
        //         });
        //         this.getMerchantsIcon(successData.categoryVos);
        //         hideToast();
        //     }, (errMsg) => {
        //         showToast(errMsg);
        //     });
        // }).catch(err => {
        //     showToast(handleError(err));
        // });
    };

    /**
     * 匹配商户icon
     */
    getMerchantsIcon = (selfSelectMerchantsData) => {
        this.setState({merData: selfSelectMerchantsData});
    };

    /**
     * 渲染优惠券列表
     * @param info: {item: ItemT, index: number}
     * @returns {*}
     */
    renderItem = ({item, index}) => {
        if (item.selected) {
            this.alreadyChosenItem = index
        }
        return <CouponItem tag={index} couponData={item} btnType='USE' onClick={() => this.useNowCoupon(item, index)}/>;
    };

    /**
     * 点击立即使用
     * @param item
     */
    useNowCoupon = (dataItem, index) => {
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
        //     handleSimpleData(data, (successData, dataIsNull) => {
        //         hideToast();
        //         if (dataIsNull) {
        //             showToast(NETWORK_UNSTABLE_PLEASE_TRY_AGAIN); // 数据异常
        //             return;
        //         }
        //         this.setState({
        //             ideName: successData.ideName,
        //         }, showToast(RECEIVE_SUCCESS));
        //         // this._pagingRef.refresh();
        //         this.resetListData(dataItem, index);
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
     * 获取行业大类名称并跳转
     * @param dataItem
     */
    getIndustryCategory = (dataItem) => {
        try {
            dataItem['refreshData'] = this.scrollRefresh
        } catch (e){
        }
        this.props.navigation.navigate('CouponSearchResult', dataItem);
    };

    /**
     * 换一批 TODO 暂时不做
     */
    changeBatch = () => {
    };

    /**
     * 搜索栏获得焦点时跳转
     */
    getbackFillData = () => {
        this.props.navigation.navigate('CouponSearchResult', {type: 'default', refreshData: this.scrollRefresh});
    };

    /**
     * 下拉刷新
     */
    scrollRefresh = () => {
        this.setState({isRefreshing: true});
        this._pagingRef.refresh();
        this.netInitData();
    };

    /**
     * 刷新结束
     */
    refreshFinish = () => {
        this.setState({isRefreshing: false});
    };

    /**
     * 上拉加载
     * @returns {*}
     */
    _onViewScroll = (e) => {
        var offsetY = e.nativeEvent.contentOffset.y; // 滑动距离

        /* calculate goTopView visibility start */
        if (this.isCalculationScrollDistance) {
            if (offsetY - this.tempOffsetY >= 0) {
                this.setState({isShowGoTop: false})
            } else {
                this.setState({isShowGoTop: true})
            }
        }
        this.tempOffsetY = offsetY;
        if (offsetY <= 50) {
            this.setState({isShowGoTop: false})
        }
        /* calculate goTop visibility end */

        /* calculate scroll to bottom start */
        var contentSizeHeight = e.nativeEvent.contentSize.height; // scrollView contentSize高度
        var oriageScrollHeight = e.nativeEvent.layoutMeasurement.height; // scrollView高度
        if (offsetY + oriageScrollHeight >= contentSizeHeight - 50) {
            if (new Date().getTime() - this.lastLoadTime > 1000) {
                // console.log('两次刷新间隔 大于1000毫秒, 可以刷新')
                this.lastLoadTime = new Date().getTime();
                this._pagingRef.loadMore();
            } else {
                // console.log('两次刷新间隔时间太短啦，不建议刷新')
            }
        }
        /* calculate scroll to bottom end */
    };

    /** 当手动拖拽滑动开始时执行 */
    handleOnScrollBeginDrag() {
        this.isCalculationScrollDistance = true;
    }

    /** 当手动拖拽滑动结束时执行 */
    handleOnScrollEndDrag() {
        this.isCalculationScrollDistance = false;
    }

    /**
     * 显示优惠券名字
     */
    checkIdenameLength = (value) => {
        let len = 0;
        let couponName = '';
        for (let i = 0; i < value.length; i++) {
            let str = value.charAt(i);
            if (checkStr(str) !== null) {
                len += 2;
            } else {
                len += 1;
            }
            if (len >= 17) {
                couponName += str + '...';
                break;
            } else {
                couponName += str;
            }
        }
        return couponName;
    };

    renderGrid = () => {
        let {merData} = this.state;
        return (
            !!merData ?
                <GridView
                    pageItemCount={10}
                    dataSource={merData}
                    column={5}
                    onClick={dataItem => this.getIndustryCategory(dataItem)}
                    renderItem={(dataItem, index) => (
                        <View key={index} style={styles.centerContainerStyle}>
                            <View key={index} style={{height: px(76)}}>
                                <ImageBackground key={index} source={{uri: dataItem.path}} style={styles.imgStyle}/>
                            </View>
                            <View style={{marginTop: px(12)}}>
                                <Text style={styles.descriptionStyle}>{dataItem.name}</Text>
                            </View>
                        </View>
                    )}
                /> : <ActivityIndicator style={{marginTop: px(50)}} animating={true}/>
        )
    };

    /**
     * 点击列表footer展示文字，返回到顶部
     */
    endListFooterOnPress = () => {
        this.goToPageTop();
    }

    /**
     * 回到界面顶端
     */
    goToPageTop = () => {
        this.scrollView.scrollTo({y: 0})
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

    render() {
        let {isRefreshing, city, ideName = ''} = this.state;
        return (
            <View style={styles.containerStyle}>
                <ScrollView
                    ref={ref => this.scrollView = ref}
                    removeClippedSubviews={true}
                    style={styles.containerStyle}
                    refreshControl={
                        <RefreshControl
                            onRefresh={this.scrollRefresh}
                            refreshing={isRefreshing}
                        />
                    }
                    scrollEventThrottle={200}
                    stickyHeaderIndices={[1]}
                    onScrollBeginDrag={() => this.handleOnScrollBeginDrag()}
                    onScrollEndDrag={() => this.handleOnScrollEndDrag()}
                    onScroll={this._onViewScroll}>
                    <View style={styles.topContainerStyle}>
                        <View style={styles.topsSearchContainerStyle}>
                            <View style={styles.textViewStyle}>
                                <Text numberOfLines={1} adjustsFontSizeToFit={true}
                                      style={styles.textAddStyle}>{city}</Text>
                            </View>
                            <View style={styles.searchContainerStyle}>
                                <Image
                                    source={require('../../assets/images/coupon/search.png')}
                                    style={styles.searchImageStyle}/>
                                <TouchableOpacity
                                    style={styles.touchSearchStyle}
                                    onPress={this.getbackFillData}>
                                    <Text style={styles.textInputStyle}>{INPUT_MERCHANT_NAME_MCC}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {this.renderGrid()}
                    </View>
                    <View>
                        <View style={styles.textContainerStyle}>
                            <View style={styles.tipImage}></View>
                            {
                                ideName === '' ? <Text style={styles.textStyle}>{COUPON}</Text> :
                                    <Text style={styles.textStyle}>{CURRENT_USE_COUPON}{this.checkIdenameLength(ideName)}</Text>
                            }
                            {/* 换一批暂时不做 */}
                            {/*<TouchableOpacity*/}
                            {/*activeOpacity={0.7}*/}
                            {/*onPress={this.changeBatch}*/}
                            {/*style={styles.changeContainerStyle}>*/}
                            {/*<Text style={styles.secondTextStyle}>{CHANGE_BATCH}</Text>*/}
                            {/*<Image*/}
                            {/*source={require('../../assets/images/coupon/reflash.png')}*/}
                            {/*resizeMode="stretch"*/}
                            {/*style={styles.reflashImgStyle}/>*/}
                            {/*</TouchableOpacity>*/}
                        </View>
                    </View>
                    <PagingView
                        renderItem={this.renderItem}
                        ItemSeparatorComponent={() => ItemSeparator({paddingLeft: 0})}
                        listUrl={QUERY_COUPON_LIST}
                        fetchMethod="post"
                        _ref={ref => this._pagingRef = ref}
                        refreshFinish={this.refreshFinish}
                        pageSize={30}
                        endMode='lastListNone'
                        endListFooterHint={GO_BACK_TOP_QUERY_MERCHANT}
                        isbackTopIcon = {true}
                        enabledPullDownRefresh={false}
                        endListFooterOnPress={this.endListFooterOnPress}
                        enableOnEndReached={false}/>
                </ScrollView>
                {this.renderGoTopView()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    containerStyle: {
        flex: 1,
        backgroundColor: theme.PAGE_BG_COLOR,
    },
    topContainerStyle: {
        marginBottom: px(16),
        flexDirection: 'column',
        height: px(460),
        backgroundColor: theme.COLOR_WHITE,
    },
    centerContainerStyle: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tipImage: {
        width: px(7),
        height: px(23),
        marginLeft: px(39),
        backgroundColor: theme.BASE_COLOR,
    },
    textContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.COLOR_WHITE,
        height: px(94),
    },
    changeContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        height: px(45),
        width: px(120),
        marginLeft: px(450),
    },
    descriptionStyle: {
        fontSize: px(26),
        color: '#3B3B3B',
    },
    topsSearchContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        height: px(57),
        marginBottom: px(16),
        marginTop: px(16),
    },
    touchSearchStyle: {
        width: px(460),
        height: px(57),
        justifyContent: 'center'
    },
    textInputStyle: {
        fontSize: px(24),
        color: '#c5c5c5',
        marginLeft: px(15),
    },
    searchImageStyle: {
        height: px(25),
        width: px(25),
        marginLeft: px(24),
    },
    searchContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: px(30),
        width: px(529),
        height: px(57),
        backgroundColor: '#f5f5f5',
        borderRadius: px(89),
    },
    textStyle: {
        marginLeft: px(19),
        fontSize: px(30),
        color: '#3B3B3B',
    },
    secondTextStyle: {
        fontSize: px(26),
        color: '#556CF7',
    },
    textViewStyle: {
        borderWidth: 1,
        justifyContent: 'center',
        borderRadius: px(8),
        borderColor: '#868686',
        width: px(120),
        height: px(46),
        marginLeft: px(40),
    },
    textAddStyle: {
        fontSize: px(30),
        color: '#868686',
        textAlign: 'center',
    },
    imgStyle: {
        width: px(76),
        height: px(76),
    },
    reflashImgStyle: {
        width: px(24),
        height: px(23),
        marginLeft: px(6),
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
