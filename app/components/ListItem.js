/**
 * Created by chengkai on 2017/12/1.
 * 针对 'antd-mobile' { List.Item } 中的 children 封装(首尾两个Text)
 */
import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import * as theme from '../config/theme.conf';
import {px} from '../utils/ScreenUtil';

export default class ListItem extends Component {

    static propTypes = {
        firstText: PropTypes.string, /* 首文字 */
        tailedText: PropTypes.string, /* 尾文字 */
        firstTextStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]), /* 首文字 样式 */
        tailedTextStyle:PropTypes.oneOfType([PropTypes.object, PropTypes.number,  PropTypes.array]), /* 尾文字 样式 */
    }

    render() {

        let {
            firstText = '',
            tailedText = '',
            firstTextStyle = {},
            tailedTextStyle = {},
        } = this.props;

        return (
            <View style={styles.containerStyle}>
                <Text style={[styles.text, firstTextStyle]}>{firstText}</Text>
                <Text style={[styles.text, tailedTextStyle]}>{tailedText}</Text>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    containerStyle: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    text: {
        fontSize: px(30),
        color: '#333333',
    },

})