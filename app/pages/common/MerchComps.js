import React, { Component } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Image } from 'react-native';
import Checkbox from '../../components/Checkbox'
import { Text as _Text, Link, FlexView } from '../../components';
import { px } from '../../utils/ScreenUtil';
import * as theme from '../../config/theme.conf';

const FlexItem = FlexView.Item;
const Tel = Link.Tel;
// 未选中的checkBox
const CHECK = 'checkbox-blank-outline';

// 已选中的CheckBox
const CHECKEDBOX = 'checkbox-marked';

/**
 * 商户状态
 * @type {Object}
 */
const contractStatusMap = {
	'1': <_Text color="red" size={24}>待审核</_Text>,
	'2': <_Text color="red" size={24}></_Text>,
	'3': <_Text color="red" size={24}>已退件</_Text>,
	'4': <_Text color="red" size={24}>已注销</_Text>,
};

/**
 * 业务ID对应颜色
 * @type {Object}
 */
const businessColorMap = {
	'101': '#EEA134',
	'75285504': '#4CA44C',
};

/**
 * 渲染商户列表项组件
 */
export const MerchItem = props => {

	const { goToDetailPage, merch,isSaleBusiness,selectAddMembers } = props;
	const getText = (text, size = 26, color = theme.GRAY_FONT_COLOR) => (
		<_Text
			size={size}
			color={color}
			selectable={true}
			numberOfLines={1}
			lineHeight={32}
		>{text}</_Text>
	);

	return (
		<TouchableOpacity
			onPress={isSaleBusiness?() => {selectAddMembers(merch)} : () => goToDetailPage(merch)}
			style={[styles.merchItem, {
				borderLeftColor: businessColorMap[merch.businessId] || theme.GRAY_FONT_COLOR}
			]}
			activeOpacity={0.75}
		>
			{
                isSaleBusiness ?
					<View style={{flexDirection:'row' ,alignItems: 'center'}}>
						<Checkbox
							onPress={() => {selectAddMembers(merch)}}
							checked={merch.check === CHECKEDBOX}
							name={merch.check}
							style={{marginTop: px(55)}}
						/>

						<FlexView justify="between" align="start" style={{marginLeft: px(15)}}>
							<FlexItem>
								<_Text
									size={36}
									color={theme.BASE_FONT_COLOR}
									style={styles.merchItemTitle}
									selectable={true}
									numberOfLines={1}
									lineHeight={36}
								>
                                    {merch.manageName || '无'}
								</_Text>
                                {
                                    merch.merchantNo ?
										<_Text
											size={24}
											style={{marginBottom: px(12)}}
											color={theme.GRAY_FONT_COLOR}
											lineHeight={24}
										>
                                            {merch.merchantNo}
										</_Text> : null
                                }
							</FlexItem>
							<View style={{marginRight: px(25),marginTop: px(10)}}>
                            {contractStatusMap[merch.contractStatus]}
							</View>
						</FlexView>
					</View>
					:
					<FlexView justify="between" align="start">
						<FlexItem>
							<_Text
								size={36}
								color={theme.BASE_FONT_COLOR}
								style={styles.merchItemTitle}
								selectable={true}
								numberOfLines={1}
								lineHeight={36}
							>
                                {merch.manageName || '无'}
							</_Text>
                            {
                                merch.merchantNo ?
									<_Text
										size={24}
										style={{marginBottom: px(12)}}
										color={theme.GRAY_FONT_COLOR}
										lineHeight={24}
									>
                                        {merch.merchantNo}
									</_Text> : null
                            }
						</FlexItem>
                        {contractStatusMap[merch.contractStatus]}
					</FlexView>
            }
			<FlexView justify="start" align="start" style={ isSaleBusiness ?{marginLeft: px(47)}:{}}>
				<FlexItem>
					<FlexView direction="column" align="start">
						<FlexView>
							<FlexItem>
                                {getText(
                                    merch.businessName, 26,
                                    businessColorMap[merch.businessId] || theme.GRAY_FONT_COLOR
                                )}
							</FlexItem>
							<FlexItem >
								<View>
                                    {getText(`直属：${merch.rootAgentName || '无'}`)}
								</View>
							</FlexItem>
						</FlexView>
                        {
                            merch.businessId !== 101 ?
                                getText([
                                    `装机地址：${merch.provinceName || ''}`,
                                    `${merch.cityName || ''}`,
                                    `${merch.countyName || ''}`,
                                    `${merch.detailedAddress || ''}`,
                                ].join(' ')) : null
                        }
					</FlexView>
				</FlexItem>
				<Tel telCode={merch.phone} style={{marginLeft: px(20)}}>
					<Image
						style={styles.telIcon}
						source={require('../../assets/images/merch/tel-2@3x.png')}
					/>
				</Tel>
			</FlexView>
		</TouchableOpacity>
	);
}

/**
 * 间隔元素
 * @type {Component}
 */
export const ItemSeparator = props => {
	return (
		<View style={styles.separatorView}></View>
	);
}

const styles = StyleSheet.create({
	merchItem: {
		backgroundColor: '#fff',
		padding: px(36),
		borderLeftWidth: px(8),
		borderLeftColor: '#eee'
	},
	merchItemTitle: {
		fontSize: px(34),
		marginTop: px(10),
		marginBottom: px(10),
	},
	telIcon: {
		width: px(58),
		height: px(58),
	},
	merchFunColor: {
		width: px(8),
		backgroundColor: 'red',
		marginRight: px(28),
		borderColor: 'blue',
		borderWidth: 1,
	},
	separatorView: {
		height: px(18),
		borderTopWidth: 1,
		borderBottomWidth: 1,
		borderColor: '#eee',
	}
});
