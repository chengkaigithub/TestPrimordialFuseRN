import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import { WhiteSpace, List, ActivityIndicator } from 'antd-mobile';
import fetch from 'sx-fetch/src';

import { px } from '../../../utils/ScreenUtil';
import * as theme from '../../../config/theme.conf';
import {QUERY_BANK_PROVINCE, QUERY_BANK_CITY} from '../../../config/url.conf';
import {
    GET_LIST_OF_PROVINCES_FAILED,
    GET_LIST_OF_CITY_FAILED,
    GET_LIST_OF_AREA_FAILED,
    UNLIMITED,
} from '../../../config/string.conf';

const regionData = {
	default: {},
	bank: {},
};

/**
 * 地址类型对应url及数据key
 * @type {Object}
 */
const regionUrlMap = {
	default: {
		province: { url: '/areaCodes/queryArea/1', idKey: 'id', nameKey: 'areaName' },
		city: { url: '/areaCodes/queryArea', idKey: 'id', nameKey: 'areaName' },
		area: { url: '/areaCodes/queryArea', idKey: 'id', nameKey: 'areaName' },
	},
	bank: {
		province: { url: QUERY_BANK_PROVINCE, idKey: 'proviceCode', nameKey: 'proviceName' },
		city: { url: QUERY_BANK_CITY, idKey: 'id', nameKey: 'cityName' },
	}
};

@fetch.inject()
export class RegionPicker extends Component {province
	static propTypes = {
		/* 地区类型（省、市、区） */
		type: PropTypes.oneOf(['province', 'city', 'area']).isRequired,
		/* 父地区ID */
		regionId: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.number,
		]),
		/* 选择地区事件方法 */
		onSelect: PropTypes.func,
		/* 地区业务类型（普通地区，银行地区） */
		regionType: PropTypes.oneOf(['default', 'bank']),
		/* 是否可选‘不限’ （默认无）*/
		isUnlimited: PropTypes.bool,
	}

	state = {
		regionList: [],
		errMsg: '',
	}

	componentDidMount() {
		const { type, regionRef = () => {}, regionId } = this.props;
		if(type === 'province') {
			this.getProviceList();
		} else if(regionId) {
			this.refreshRegionList(this.props);
		}
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.regionId !== this.props.regionId) {
			this.refreshRegionList(nextProps);
		}
	}

	/**
	 * 刷新地区列表
	 * @param  {Object} props props 或 nextProps
	 * @return {void}
	 */
	refreshRegionList = props => {
		const { type, regionId } = props;

		if(type === 'city') {
			this.getCityList(regionId);
		} else if(type === 'area') {
			this.getAreaList(regionId);
		}
	}

	/**
	 * 获取省份列表
	 * @return {void}
	 */
	getProviceList = () => {
		const { regionType } = this.props;

		const provinceConf = regionUrlMap[regionType]['province'];

		if(regionData[regionType]['province']) {
			this.setState({
				regionList: this.unlimited(regionData[regionType]['province'])
			});
		} else {
			// this.props.$fetch.get(provinceConf.url).then(res => {
			this.props.$fetch.post(provinceConf.url).then(res => {
				if(!res.success) {
					this.setState({ errMsg: GET_LIST_OF_PROVINCES_FAILED });
					return;
				}
				regionData[regionType]['province'] = res.data;
				this.setState({
					errMsg: '',
					regionList: this.unlimited(res.data)
				});
			}).catch(err => {
				this.setState({ errMsg: GET_LIST_OF_PROVINCES_FAILED });
			});
		}
	}

	/**
	 * 获取城市列表
	 * @return {void}
	 */
	getCityList = id => {
		const { regionType } = this.props;

		const cityConf = regionUrlMap[regionType]['city'];

		if(regionData[regionType][id]) {
			this.setState({
				regionList: regionData[regionType][id]
			});
		} else {
			// this.props.$fetch.get(`${cityConf.url}/${id}`).then(res => {
			this.props.$fetch.post(cityConf.url, {id}).then(res => {
				if(!res.success) {
					this.setState({ errMsg: GET_LIST_OF_CITY_FAILED });
					return;
				}
				regionData[regionType][id] = res.data;
				this.setState({
					errMsg: '',
					regionList: res.data
				});
			}).catch(err => {
				this.setState({ errMsg: GET_LIST_OF_CITY_FAILED });
			});
		}
	}

	/**
	 * 获取地区列表
	 * @return {void}
	 */
	getAreaList = id => {
		const areaConf = regionUrlMap['default']['area'];

		if(regionData['default'][id]) {
			this.setState({
				regionList: regionData['default'][id]
			});
		} else {
			// this.props.$fetch.get(`${areaConf.url}/${id}`).then(res => {
			this.props.$fetch.post(areaConf.url, {id}).then(res => {
				if(!res.success) {
					this.setState({ errMsg: GET_LIST_OF_AREA_FAILED });
					return;
				}
				regionData['default'][id] = res.data;
				this.setState({
					errMsg: '',
					regionList: res.data
				});
			}).catch(err => {
				this.setState({ errMsg: GET_LIST_OF_AREA_FAILED });
			});
		}
	}

	/**
	 * 渲染地区列表项
	 * @param  {Object} item  地区数据
	 * @param  {Number} index 序号
	 * @return {ReactComponent}   地区列表项
	 */
	renderRegionItem = (item, index) => {
		const { regionType, type } = this.props;

		const { idKey, nameKey } = regionUrlMap[regionType][type];

		return (
			<List.Item
				key={index}
				onClick={() =>
					this.onSelect({
						id: item[idKey],
						name: item[nameKey]
					})
				}
			>
				<Text style={{fontSize: px(30)}}>{item[nameKey]}</Text>
			</List.Item>
		);
	}

	/**
	 * 选择地址
	 * @param  {Object} region 地址信息
	 * @return {void}
	 */
	onSelect = region => {
		this.props.onSelect(region);
	}

	/**
	 * 省份列表头部添加‘不限选项’
	 * @return {Array} 地区列表
	 */
	unlimited = regionList => {
		const { type, isUnlimited = false } = this.props;

		if(type === 'province' && isUnlimited) {
			regionList = [{
				id: 0,
				areaName: UNLIMITED
			}, ...regionList];
		}

		return regionList;
	}

	render() {
		const { errMsg, regionList = [] } = this.state;

		return (
			<View>
				<ActivityIndicator animating={regionList.length === 0 && errMsg === ''}/>
				{ errMsg !== '' ? <Text style={styles.errMsg}>{ errMsg }</Text> : null }
				{
					regionList.length > 0 ?
					<List>
						{regionList.map(this.renderRegionItem)}
					</List> : undefined
				}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	errMsg: {
		color: theme.GRAY_FONT_COLOR,
		textAlign: 'center',
	}
});
