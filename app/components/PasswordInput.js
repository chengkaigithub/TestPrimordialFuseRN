/**
 * Created by chenchunyong on 12/2/15.
 */

import React, {
  Component,
} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableHighlight,
  InteractionManager,
} from 'react-native';
import { px } from '../utils/ScreenUtil';

export default class Password extends Component {

  static defaultProps = {
    autoFocus: true,
    onChange: () => {},
    onEnd: () => {},
  };

  state = {
    text: ''
  };

  componentDidMount() {
    if (this.props.autoFocus) {
      InteractionManager.runAfterInteractions(() => {
        this._onPress();
      });
    }
      const { _ref = () => {} } = this.props;
      _ref({
          clearPassword: () => this.onClearContent()
      });
  }

  /* 清空数据之后的回调 */
  onClearContent = ()=> {
      let {
          onClearEnd = () => {}
      } = this.props;

      this.setState({text: ''});
      this.refs.textInput.clear();
      onClearEnd();
  }

  render(){
    return(
      <TouchableHighlight
        onPress={this._onPress.bind(this)}
        activeOpacity={1}
        underlayColor='transparent'>
        <View style={[styles.container,this.props.style]} >
          <TextInput
            style={{height:45,zIndex:99,position:'absolute',width:45*4,opacity:0}}
            ref='textInput'
            maxLength={this.props.maxLength}
            autoFocus={false}
            keyboardType="numeric"
            onChangeText={
              (text) => {
                this.setState({text});
                this.props.onChange(text);
                if (text.length === this.props.maxLength) {
                  this.props.onEnd(text);
                }
              }
            }
          />
          {
            this._getInputItem()
          }
        </View>
      </TouchableHighlight>
    )

  }
  _getInputItem(){
    let inputItem = [];
    let {text}=this.state;
    for (let i = 0; i < parseInt(this.props.maxLength); i++) {
      if (i == 0) {
        inputItem.push(
          <View key={i} style={[styles.inputItem,this.props.inputItemStyle]}>
            {i < text.length ? <View style={[styles.iconStyle,this.props.iconStyle]} /> : null}
          </View>)
      }
      else {
        inputItem.push(
          <View key={i} style={[styles.inputItem,styles.inputItemBorderLeftWidth,this.props.inputItemStyle]}>
            {i < text.length ?
              <View style={[styles.iconStyle,this.props.iconStyle]}>
              </View> : null}
          </View>)
      }
    }
    return inputItem;
  }

  _onPress(){
      this.refs.textInput &&
    this.refs.textInput.focus();
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff'
  },
  inputItem: {
    height: px(92),
    width: px(92),
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputItemBorderLeftWidth: {
    borderLeftWidth: 1,
    borderColor: '#ccc',
  },
  iconStyle: {
    width: px(13),
    height: px(13),
    backgroundColor: '#222',
    borderRadius: px(16),
  },
});
