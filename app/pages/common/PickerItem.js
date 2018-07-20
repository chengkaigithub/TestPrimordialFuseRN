import React, {Component} from 'react';
import {TouchableOpacity, Keyboard} from 'react-native';

/**
 * 选择器容器(点击选择器会关闭键盘)
 * @author chengkai
 */
export default class PickerItem extends Component {

    onPressContainer = () => {
        let {onClick = () => {}} = this.props;
        onClick();
        Keyboard.dismiss();
    }

    render() {
        return (
            <TouchableOpacity
                activeOpacity={0.6}
                onPress={this.onPressContainer}
                style={this.props.style}>
                {this.props.children}
            </TouchableOpacity>
        );
    }
}
