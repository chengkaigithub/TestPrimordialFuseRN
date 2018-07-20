/**
 * app 配置信息
 */

import * as DeviceInfo from "react-native-device-info";

import {
    ENVIRONMENT,
    ENVIRONMENT_DEVELOP,
    ENVIRONMENT_RELEASE,
    ENVIRONMENT_TEST_INTRANET,
    ENVIRONMENT_TEST_EXTRANET,
	ENVIRONMENT_RC_EXTRANET,
	ENVIRONMENT_RC_INTRANET,
} from './Environment';

/* app 当前版本号 */
export const VERSION_CODE = DeviceInfo.getVersion();

/* 当前手机的IMEI */
export const PHONE_IMEI = DeviceInfo.getUniqueID();

/* 当前手机系统版本 */
export const PHONE_SYSTEM_VERSION = DeviceInfo.getSystemVersion();

const getBaseURL = () => {
	let BASE_URL;
	switch (ENVIRONMENT) {
		case ENVIRONMENT_RELEASE:
			BASE_URL = ''; // 生产服务器
			break;
		case ENVIRONMENT_TEST_INTRANET:
			BASE_URL = ''; // 测试服务器(内网)
			break;
		case ENVIRONMENT_TEST_EXTRANET:
			BASE_URL = ''; // 测试服务器(外网)
			break;
		case ENVIRONMENT_RC_EXTRANET:
			BASE_URL = ''; // RC服务器(外网)
			break;
		case ENVIRONMENT_RC_INTRANET:
			BASE_URL = ''; // RC服务器(内网)
			break;
		case ENVIRONMENT_DEVELOP:
			BASE_URL = '';  // 开发服务器(内网)
			break;
		default:
			BASE_URL = ''; // 生产服务器
			break;
	}
	return BASE_URL;
}

/* 服务端URL */
export const BASE_URL = getBaseURL();

/**
 * 新网络请求实例URL
 * @type {string}
 * TODO 暂无使用
 */
export const TOP_BASE_URL = 'https://ip:port';

