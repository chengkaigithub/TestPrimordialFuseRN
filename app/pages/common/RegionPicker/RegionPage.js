import React, { Component } from 'react';
import { View } from 'react-native';
import {
    CHOOSE_AREA,
} from '../../../config/string.conf';

import { RegionPicker } from './RegionPicker';
import {Header} from "../../../components";
import * as theme from "../../../config/theme.conf";

export default class RegionPage extends Component {

    static navigationOptions = {
        header: Header({
            title: CHOOSE_AREA,
            backButtonColor: theme.NAVBAR_TITLE_COLOR,
            headerTintColor: theme.NAVBAR_TITLE_COLOR,
            headerStyle: {
                borderBottomWidth: 0,
                backgroundColor: theme.NAVBAR_BG_COLOR,
            }
        })
    }

	goToChildrenPage = region => {
		const { type, navigation } = this.props;
		let nextType = '';
		if(type === 'province') {
			nextType = 'city';
		} else if(type === 'city') {
			nextType = 'area';
		}

		this.props.navigation.navigate('RegionPage', {
			type: nextType,
			region,
		});
	}

	render() {
		const { type = 'province' } = this.props.navigation.state.params;

		return (
			<View>
				<RegionPicker
					type={type}
					onSelect={this.goToChildrenPage}
				/>
			</View>
		);
	}
}