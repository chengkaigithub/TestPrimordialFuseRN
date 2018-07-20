import React, {Component} from 'react';
import {
    View,
    Image,
    StyleSheet,
    Modal,
    TouchableOpacity
} from 'react-native';
import {deviceHeight, deviceWidth, px} from '../utils/ScreenUtil';
import PropTypes from 'prop-types';

/*
    <IOSLocationGuideModal
        visible={this.state.lalalal}
        clickView={() => {
            this.setState({
                lalalal: !this.state.lalalal
            })
        }}
    />
 */
/**
 * IOS开启定位提示modal
 */
export default class IOSLocationGuideModal extends Component {

    static propTypes = {
        visible: PropTypes.bool.isRequired,
    }

    render() {
        let {
            visible = false,
            clickView = () => {}
        } = this.props;
        return (
            <Modal
                animationType={"fade"}
                transparent={true}
                onRequestClose={() => {/* android强制调用,必须重写 */}}
                visible={visible}>
                <TouchableOpacity style={styles.touchableContainerStyle}
                                  activeOpacity={1} onPress={clickView}>
                    <View style={styles.containerStyle}>
                        <Image style={styles.imageStyle}
                               source={require('../assets/images/common/location_modal.png')}/>
                    </View>
                </TouchableOpacity>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    containerStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    imageStyle: {
        width: px(595),
        height: px(652),
    },
    touchableContainerStyle: {
        width: deviceWidth,
        height: deviceHeight
    }
})