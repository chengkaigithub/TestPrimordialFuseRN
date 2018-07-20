import fetch from 'sx-fetch/src';
// import { Toast } from 'antd-mobile';
import { TOP_BASE_URL } from '../config/app.conf';

/**
 * 新网络请求实例, 用于区别Root封装好的基础请求。
 * @type {SxFetch}
 * TODO (暂无使用)
 */
export const TopFetch = fetch.create({
    baseURL: TOP_BASE_URL,
    onShowErrorTip: (err, errorTip) => {
        // if(errorTip) Toast.fail(errorTip);
    },
    onShowSuccessTip: (response, successTip) => {
        // if(successTip) Toast.info(successTip, 2);
    },
    isMock: (url) => {
        return url.startsWith('/mock');
    }
});
