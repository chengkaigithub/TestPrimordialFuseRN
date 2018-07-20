import React, {Component} from 'react';
import {View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform} from 'react-native';
import {WhiteSpace} from 'antd-mobile';
import ScrollableTabView from 'react-native-scrollable-tab-view';
// import Ionicons from 'react-native-vector-icons/Ionicons';

import {RegionPicker} from './RegionPicker';
import {px, deviceHeight} from '../../../utils/ScreenUtil';
import * as theme from '../../../config/theme.conf';
import {
    CHOOSE_AREA,
} from '../../../config/string.conf';
import {IS_IOS_OS} from "../../../utils/PlatformUtil";

/**
 * 打开地址选择窗口
 * @param  {Function} callback 选择地址后的回调函数
 * @return {Component}
 */
const open = (callback,
    {
        level = 3,
        type = 'default',
        isUnlimited = false,
    } = {
        level: 3,
        type: 'default',
        isUnlimited: false,
    }, hide = () => {}) => {
    const _props = {
        callback,
        level,
        type,
        isUnlimited,
        hide,
    };
    return <RegionPopup {..._props}/>
}

/**
 * 地址选择窗口类
 */
class RegionPopup extends Component {
    state = {
        provinceId: 0,
        cityId: 0,
        tabIndex: 0, /* 当前tab的编号 */
    }

    /* 选中的地址信息 */
    _region = {
        province: {},
        city: {},
        area: {},
    };

    /**
     * 渲染返回按钮
     * @return {ReactComponent}
     */
    renderHeaderView = index => {
        return (
            <View style={styles.headerView}>
                <TouchableOpacity onPress={this.back}>
                    {/*<Ionicons name="ios-arrow-back" size={30} color="#666"/>*/}
                </TouchableOpacity>
                <Text style={{fontSize: 16}}>{CHOOSE_AREA}</Text>
                <TouchableOpacity onPress={this.close}>
                    {/*<Ionicons name="md-close" size={30} color="#666"/>*/}
                </TouchableOpacity>
            </View>
        );
    }

    close = () => {
        this.props.hide();
    }

    onSelectEnd = (area = {}) => {
        this._region.area = area;
        this.props.callback(this._region);
        this.close();
    }

    goToTab = index => {
        this.setState({tabIndex: index});
    }

    back = () => {
        const {tabIndex} = this.state;
        if (tabIndex === 0) {
            this.close();
        } else {
            this.goToTab(tabIndex - 1);
        }
    }

    selectProvince = province => {
        const {level} = this.props;

        this._region.province = province;
        if (level === 1 || province.id === 0) {
            this.onSelectEnd();
            return;
        }
        this.goToTab(1);
        this.setState({provinceId: province.id});
    }

    selectCity = city => {
        const {level, type} = this.props;

        this._region.city = city;
        if (level === 2 || type === 'bank') {
            this.onSelectEnd();
            return;
        }
        this.goToTab(2);
        this.setState({cityId: city.id});
    }

    render() {
        const {provinceId, cityId, tabIndex} = this.state;
        const {level, type, isUnlimited} = this.props;

        return (
            <View style={styles.popupView}>
                {this.renderHeaderView()}
                <ScrollableTabView
                    renderTabBar={() => <View></View>}
                    ref={ref => this._tabRef = ref}
                    initialPage={0}
                    page={tabIndex}
                    locked={true}
                >
                    <ScrollView>
                        <WhiteSpace size="lg"/>
                        <RegionPicker type="province"
                                      onSelect={this.selectProvince}
                                      regionType={type}
                                      isUnlimited={isUnlimited}
                        />
                        <WhiteSpace size="lg"/>
                    </ScrollView>
                    {
                        level > 1 ?
                            <ScrollView>
                                <WhiteSpace size="lg"/>
                                <RegionPicker
                                    type="city"
                                    regionId={provinceId}
                                    onSelect={this.selectCity}
                                    regionType={type}
                                />
                                <WhiteSpace size="lg"/>
                            </ScrollView> : null
                    }
                    {
                        (level > 2 && type === 'default') ?
                            <ScrollView>
                                <WhiteSpace size="lg"/>
                                <RegionPicker
                                    type="area"
                                    regionId={cityId}
                                    onSelect={this.onSelectEnd}
                                    regionType={type}
                                />
                                <WhiteSpace size="lg"/>
                            </ScrollView> : null
                    }
                </ScrollableTabView>
            </View>
        );
    }
}

export default {open};

const styles = StyleSheet.create({
    popupView: {
        height: deviceHeight,
        backgroundColor: theme.PAGE_BG_COLOR,
    },
    headerView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        paddingTop: IS_IOS_OS ? 28 : 10,
        paddingBottom: 6,
        borderBottomWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
    }
})