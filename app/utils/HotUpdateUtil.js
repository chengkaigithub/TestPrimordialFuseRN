import {IS_ANDROID_OS} from "./PlatformUtil";
import {isRelease} from "../config/Environment";

//android key 配置
const PRODUCT_KEY_ANDROID = "tHMy3Ph65xknhgerufF05r8d5EZI4ksvOXqog";
const STA_KEY_ANDRIOD = "tHMy3Ph65xknhgerufF05r8d5EZI4ksvOXqog";

//ios key 配置
const PRODUCT_KEY_IOS = "5Ofqzk0rzjqLDbe9vEcmbX1XahfX4ksvOXqog";
const STA_KEY_IOS = "5Ofqzk0rzjqLDbe9vEcmbX1XahfX4ksvOXqog";

const codePush = require("react-native-code-push");

//远程服务检测更新
export const codePushUpdate = () => {
    let key = "";
    if (IS_ANDROID_OS) {
        key = isRelease ? PRODUCT_KEY_ANDROID : STA_KEY_ANDRIOD;
    } else {
        key =  isRelease ? PRODUCT_KEY_IOS : STA_KEY_IOS;
    }
    codePush.sync({
            checkFrequency: codePush.CheckFrequency.ON_APP_RESUME, // codePush.CheckFrequency.ON_APP_RESUME
            installMode: codePush.InstallMode.ON_NEXT_RESUME,
            deploymentKey: key,
        },
        (status) => {
            switch (status) {
                case codePush.SyncStatus.CHECKING_FOR_UPDATE:
                    console.log('codePush.SyncStatus.CHECKING_FOR_UPDATE');
                    break;
                case codePush.SyncStatus.AWAITING_USER_ACTION:
                    console.log('codePush.SyncStatus.AWAITING_USER_ACTION');
                    break;
                case codePush.SyncStatus.DOWNLOADING_PACKAGE:
                    console.log('codePush.SyncStatus.DOWNLOADING_PACKAGE');
                    break;
                case codePush.SyncStatus.INSTALLING_UPDATE:
                    console.log('codePush.SyncStatus.INSTALLING_UPDATE');
                    break;
                case codePush.SyncStatus.UP_TO_DATE:
                    console.log('codePush.SyncStatus.UP_TO_DATE');
                    break;
                case codePush.SyncStatus.UPDATE_IGNORED:
                    console.log('codePush.SyncStatus.UPDATE_IGNORED');
                    break;
                case codePush.SyncStatus.UPDATE_INSTALLED:
                    console.log('codePush.SyncStatus.UPDATE_INSTALLED');
                    break;
                case codePush.SyncStatus.SYNC_IN_PROGRESS:
                    console.log('codePush.SyncStatus.SYNC_IN_PROGRESS');
                    break;
                case codePush.SyncStatus.UNKNOWN_ERROR:
                    console.log('codePush.SyncStatus.UNKNOWN_ERROR');
                    break;
            }
        },
        ({receivedBytes, totalBytes}) => {
            let total = (receivedBytes / totalBytes).toFixed(2) * 100;
            console.log('codePush.sync download progress:', total);
        }
    );
};

export {codePush};