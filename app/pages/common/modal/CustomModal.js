/**
 * Created by chengkai on 2017/12/6.
 */

import React, {Component} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Platform} from 'react-native';
import {Modal} from 'antd-mobile';
import * as theme from '../../../config/theme.conf';
import {px} from '../../../utils/ScreenUtil';
import PropTypes from 'prop-types';
import {IS_IOS_OS} from "../../../utils/PlatformUtil";

export default class CustomModal extends Component {

    static propTypes = {
        signBtn: PropTypes.bool, /* 是否展示单一按钮 */
        visibility: PropTypes.bool, /* 是否展示modal */
        clickIKnow: PropTypes.func, /* 点击确定回调函数 */
        leftBtnText: PropTypes.string, /* 左按钮文字 */
        rightBtnText: PropTypes.string, /* 右按钮文字 */
        clickLeftBtn: PropTypes.func, /* 左按钮点击事件 */
        clickRightBtn: PropTypes.func, /* 右按钮点击事件 */
        btnStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]), /* 按钮 样式 */
        btnContainerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]), /* 按钮容器 样式 */
        titleStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]), /* title 样式 */
        titleText: PropTypes.string, /* title文字 */
        isShowTitle: PropTypes.bool, /* 是否展示title */
        describeText: PropTypes.string, /* 描述信息 文字内容 */
        describeTextStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]), /* 描述信息文字 样式 */
        containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]), /* 根布局 样式 */
        betweenBtnLine: PropTypes.oneOfType([PropTypes.object, PropTypes.number]), /* 按钮之间的竖线 样式 */
        isShowDescribe: PropTypes.bool, /* 是否展示 描述信息 */
    }

    renderBtn = () => {
        let {
            signBtn = false,
            leftBtnText = '',
            rightBtnText = '',
            clickLeftBtn = () => {
            },
            clickRightBtn = () => {
            },
            btnStyle = {},
            btnContainerStyle = {},
            betweenBtnLine = {},
        } = this.props;
        return signBtn ?
            (<View style={[styles.btnContainer, btnContainerStyle]}>
                <TouchableOpacity style={styles.btnContainer} onPress={clickRightBtn}>
                    <Text style={[styles.singleBtnStyle, btnStyle]}>
                        {rightBtnText}
                    </Text>
                </TouchableOpacity>
            </View>)
            :
            (<View style={[styles.btnContainer, btnContainerStyle]}>
                <TouchableOpacity onPress={clickLeftBtn}>
                    <Text style={[styles.btnStyle, {color: theme.GRAY_FONT_COLOR,}, btnStyle]}>
                        {leftBtnText}
                    </Text>
                </TouchableOpacity>
                <View style={[styles.betweenBtnLine, betweenBtnLine]}/>
                <TouchableOpacity onPress={clickRightBtn}>
                    <Text style={[styles.btnStyle, btnStyle]}>
                        {rightBtnText}
                    </Text>
                </TouchableOpacity>
            </View>);
    }

    render() {

        let {
            visibility = false,
            titleStyle = {},
            titleText = '',
            describeText = '',
            describeTextStyle = {},
            isShowTitle = true,
            isShowDescribe = true,
            containerStyle = {},
        } = this.props;

        let btnView = this.renderBtn();
        let titleView = isShowTitle ? (<Text style={[styles.titleStyle, titleStyle]}>{titleText}</Text>) : null;
        let describeView = isShowDescribe ? (
                <Text style={[styles.describeTextStyle, describeTextStyle]}>{describeText}</Text>) : null;

        return (
            <Modal
                visible={visibility}
                transparent
                onRequestClose={() => {/* android强制调用,必须重写 */}}
                maskClosable={false}>
                <View style={[styles.modalContainer, containerStyle]}>
                    {titleView}
                    {describeView}
                    <View style={styles.line}/>
                    {btnView}
                </View>
            </Modal>
        );
    }

}

const styles = StyleSheet.create({
    modalContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: px(230),
    },
    btnStyle: {
        textAlign: 'center',
        width: px(286),
        color: theme.BASE_COLOR,
    },
    betweenBtnLine: {
        height: px(82),
        width: 0.5,
        backgroundColor: theme.GRAY_FONT_COLOR,
    },
    btnContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: px(572),
    },
    titleStyle: {
        fontSize: px(36),
        marginBottom: px(19),
        marginTop: px(30),
        color: theme.BASE_FONT_COLOR,
    },
    describeTextStyle: {
        fontSize: px(32),
        paddingLeft: px(20),
        paddingRight: px(20),
        marginBottom: px(56),
        color: theme.GRAY_FONT_COLOR,
    },
    line: {
        width: px(624),
        height: 0.5,
        backgroundColor: theme.GRAY_FONT_COLOR
    },
    singleBtnStyle: {
        textAlign: 'center',
        width: px(572),
        color: theme.BASE_COLOR,
        marginTop: px(IS_IOS_OS ? 30 : 20),
        marginBottom: px(30)
    }
})