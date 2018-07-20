import React, { Component } from 'react';
import { BackHandler, DeviceEventEmitter } from 'react-native';
import {createStackNavigator, NavigationActions} from 'react-navigation';
import StackViewStyleInterpolator from 'react-navigation/src/views/StackView/StackViewStyleInterpolator';
import { connect } from 'react-redux';
import fetchInterceptors from './utils/fetchInterceptors';

import Home from './pages/home/navigation';
import Coupon from './pages/coupon/navigation';
import Common from './pages/common/navigation';
import {IS_ANDROID_OS} from "./utils/PlatformUtil";
import {createReactNavigationReduxMiddleware, reduxifyNavigator} from "react-navigation-redux-helpers";


const navReduxMiddleware = createReactNavigationReduxMiddleware(
    "root",
    state => state.nav,
);

/**
 * 应用根路由
 */
const RootNavigator = createStackNavigator({
    ...Home,
    ...Coupon,
    ...Common,
}, {
    initialRouteName: 'HomePage',
    mode: 'card',
    headerMode: 'screen',
    transitionConfig: () => ({
        // 配置android与IOS相同的PUSH动画
        screenInterpolator: StackViewStyleInterpolator.forHorizontal,
    }),
    navigationOptions: () => ({
        // headerBackTitle: null,
        // headerTintColor: theme.NAVBAR_TITLE_COLOR,
        // headerStyle: {
        //     backgroundColor: theme.NAVBAR_BG_COLOR,
        //     borderBottomWidth: 0,
        //     elevation: 0,
        // },
        header: null,
    }),
});

const AppReduxifyNavigator = reduxifyNavigator(RootNavigator, "root");

class AppWithNavigationState extends Component {

    componentWillMount() {
        /* 安卓添加返回按钮监听事件 */
        if(IS_ANDROID_OS) {
            DeviceEventEmitter.addListener('hardwareBackPress', this.onBack);
        }
        // fetchInterceptors(this.props.dispatch);
    }

    /**
     * 返回页面
     * @return {Boolean}
     */
    onBack = () => {
        const { dispatch, state } = this.props;
        if (state.index === 0) {
            return false;
        }
        dispatch(NavigationActions.back());
        return true;
    }

    render() {
        return (
            <AppReduxifyNavigator {...this.props}/>
        )
    }
}

const mapStateToProps = (state) => ({
    state: state.nav,
});

const AppNavigator = connect(mapStateToProps)(AppWithNavigationState);

export default AppNavigator;
export { RootNavigator, AppNavigator, navReduxMiddleware }
