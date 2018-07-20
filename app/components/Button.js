import React, {Component} from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ImageBackground } from 'react-native';

import { px } from '../utils/ScreenUtil';
import * as theme from '../config/theme.conf';

export default class Button extends Component {

    render () {

        const {
            children,
            disable,
            onClick = () => {},
            style = '',
            textStyle,
        } = this.props;

        return (
            <View>
                {
                    disable ?
                    <View style={[styles.buttonDisable, style]}>
                        <Text style={styles.buttonText}>{children}</Text>
                    </View> :
                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={[styles.buttonContent, style]}
                        onPress={onClick}
                    >   
                        {
                            <View
                                style={styles.buttonBg}
                            >
                                <Text style={[styles.buttonText, textStyle]}>{children}</Text>
                            </View>
                        }
                    </TouchableOpacity>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    buttonContent: {
        height: px(86),
        backgroundColor: '#4D7BFE',
        borderRadius: px(10),
        overflow: 'hidden',
    },
    buttonBg: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: px(86),
    },
    buttonText: {
        fontSize: px(28),
        color: '#fff',
    },
    buttonDisable: {
        justifyContent: 'center',
        alignItems: 'center',
        height: px(86),
        backgroundColor: '#e2e2e2',
        borderRadius: px(10),
        overflow: 'hidden',
    }
});