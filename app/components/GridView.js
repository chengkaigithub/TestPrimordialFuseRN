/**
 * Created by chengkai on 2017/4/17.
 */
import React, {Component} from 'react';
import {
    View,
    ScrollView,
    Image,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform
} from 'react-native';
import {deviceWidth, px} from "../utils/ScreenUtil";
import PropTypes from 'prop-types';
import {IS_IOS_OS} from "../utils/PlatformUtil";

/**
 * 替代 antd-mobile 中的 Grid
 * @author chengkai
 * @date 20180507
 */
export default class GridView extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            currentPage: 0
        };
    }

    static propTypes = {
        style: PropTypes.object, // container style
        dataSource: PropTypes.array.isRequired, // data source
        pageItemCount: PropTypes.number.isRequired, // one page item count
        renderItem: PropTypes.func.isRequired, // renderItem function
        onClick: PropTypes.func, // on item click
        column: PropTypes.number, // column default 5
    }

    /**
     * 渲染子视图
     * @returns {Array}
     */
    renderChild() {
        let itemsPages = this.getItemsPages();
        let views = [];
        for (let position = 0; position < itemsPages.length; position++) {
            views.push(
                <View key={position} style={[styles.pageStyle, this.props.style]}>
                    {itemsPages[position]}
                </View>
            )
        }
        return views;
    }

    /**
     * 获取分页数据
     * @returns {Array}
     */
    getItemsPages() {
        let {
            dataSource,
            pageItemCount = 1,
            renderItem = () => <View/>,
            onClick = () => {},
            column = 5,
        } = this.props;

        let length = Math.ceil(dataSource.length / pageItemCount);
        let views = [];

        for (let pagePosition = 0; pagePosition < length; pagePosition++) {
            let tempViews = [];
            let maxLength = (pagePosition + 1) * pageItemCount <= dataSource.length ? (pagePosition + 1) * pageItemCount : dataSource.length;
            for (let i = pagePosition * pageItemCount; i < maxLength; i++) {
                tempViews.push(
                    <TouchableOpacity style={[styles.itemWrapStyle, {width: deviceWidth / column}]} key={i} activeOpacity={1} onPress={() => onClick(dataSource[i])}>
                        {renderItem(dataSource[i], i)}
                    </TouchableOpacity>
                )
            }
            views.push(
                <View style={styles.pageWrapStyle}>
                    {tempViews}
                </View>
            )
        }
        return views;
    }

    /**
     * 渲染指示器
     * @returns {Array}
     */
    renderIndicator() {
        let {
            dataSource,
            pageItemCount = 1,
        } = this.props;
        let length = Math.ceil(dataSource.length / pageItemCount);
        let points = [];
        for (let position = 0; position < length; position++) {
            var currentStyle = {};
            if (position === this.state.currentPage) {
                currentStyle = {backgroundColor: '#4D7BFE'};
            }
            points.push(
                <View key={position} style={[styles.indicatorStyle, currentStyle]} />
            )
        }
        return points;
    }

    /**
     * 处理ScrollView的滑动事件
     * @param event
     */
    handleOnScroll(event) {
        let x = event.nativeEvent.contentOffset.x;
        if (x % deviceWidth === 0) {
            let currentPage = Math.floor(x / deviceWidth);
            this.setState({currentPage: currentPage});
        }
    }


    /** 当手动拖拽滑动开始时执行 */
    handleOnScrollBeginDrag() {

    }

    /** 当手动拖拽滑动结束时执行 */
    handleOnScrollEndDrag() {

    }

    render() {
        return (
            <View style={{flex: 1}}>
                <ScrollView
                    removeClippedSubviews={true}
                    scrollEventThrottle={16}
                    ref={ref => this.ScrollView = ref}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled={true}
                    onScroll={(event) => this.handleOnScroll(event)}
                    onScrollBeginDrag={() => this.handleOnScrollBeginDrag()}
                    onScrollEndDrag={() => this.handleOnScrollEndDrag()}
                >
                    {this.renderChild()}
                </ScrollView>
                <View style={styles.indicatorParentStyle}>
                    {this.renderIndicator()}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    indicatorParentStyle: {
        position: 'relative',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: px(70),
    },
    indicatorStyle: {
        width: IS_IOS_OS ? 8 : 7,
        height: IS_IOS_OS ? 8 : 7,
        backgroundColor: '#D8D8D8',
        borderRadius: IS_IOS_OS ? 4 : 3.5,
        marginLeft: px(5),
        marginRight: px(5)
    },
    pageWrapStyle: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    pageStyle: {
        flex: 1,
        width: deviceWidth,
    },
    itemWrapStyle: {
        height: px(160),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    }
});