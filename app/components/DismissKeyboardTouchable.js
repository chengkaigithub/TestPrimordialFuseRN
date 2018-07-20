/**
 * Created by chengkai on 2018/2/1.
 */

import React, {Component} from 'react';
import {TouchableWithoutFeedback, Keyboard} from 'react-native';

export default class DismissKeyboardTouchable extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    /**
     * 收起键盘
     */
    keyboardHide = () => {
        Keyboard.dismiss();
    }

    render() {
        let {
            children = null,
            style = null,
        } = this.props;
        return (
            <TouchableWithoutFeedback onPress={this.keyboardHide} style={style}>
                {children}
            </TouchableWithoutFeedback>
        )

    }

}