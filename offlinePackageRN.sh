#!/bin/sh

function moveFileToProj()
{
	PLATFORM=$1
	echo --------------------------------- $PLATFORM 移动文件开始 ---------------------------------
	
        if [ "$PLATFORM" == "ios" ]
        then
                echo "移动ios文件到指定位置"
		cp -ri ./bundle/$PLATFORM/index.$PLATFORM.bundle ./$PLATFORM/main.jsbundle
		cp -ri ./bundle/$PLATFORM/index.$PLATFORM.bundle.meta ./$PLATFORM/main.jsbundle.meta
		cp -ri ./bundle/$PLATFORM/assets/. ./$PLATFORM/assets
        elif [ "$PLATFORM" == "android" ]
        then
                echo "移动android文件到指定位置"
        # app => react-native-module
		cp -f ./bundle/$PLATFORM/index.$PLATFORM.bundle ./$PLATFORM/react-native-module/src/main/assets/index.$PLATFORM.bundle
		cp -f ./bundle/$PLATFORM/index.$PLATFORM.bundle.meta ./$PLATFORM/react-native-module/src/main/assets/index.$PLATFORM.bundle.meta
		# cp -f ./bundle/$PLATFORM/CodePushHash ./$PLATFORM/react-native-module/src/main/assets/CodePushHash
		mkdir -p ./$PLATFORM/react-native-module/src/main/res/drawable-hdpi/
		mkdir -p ./$PLATFORM/react-native-module/src/main/res/drawable-mdpi/
		mkdir -p ./$PLATFORM/react-native-module/src/main/res/drawable-xhdpi/
		mkdir -p ./$PLATFORM/react-native-module/src/main/res/drawable-xxhdpi/
		mkdir -p ./$PLATFORM/react-native-module/src/main/res/drawable-xxxhdpi/
		cp -ri ./bundle/$PLATFORM/drawable-hdpi/* ./$PLATFORM/react-native-module/src/main/res/drawable-hdpi/
		cp -ri ./bundle/$PLATFORM/drawable-mdpi/* ./$PLATFORM/react-native-module/src/main/res/drawable-mdpi/
		cp -ri ./bundle/$PLATFORM/drawable-xhdpi/* ./$PLATFORM/react-native-module/src/main/res/drawable-xhdpi/
		cp -ri ./bundle/$PLATFORM/drawable-xxhdpi/* ./$PLATFORM/react-native-module/src/main/res/drawable-xxhdpi/
		cp -ri ./bundle/$PLATFORM/drawable-xxxhdpi/* ./$PLATFORM/react-native-module/src/main/res/drawable-xxxhdpi/
        elif [ "$PLATFORM" == "all" ]
        then
                moveFileToProj ios
                moveFileToProj android
        else
                echo "请手动移动文件到项目指定位置"
        fi

	echo --------------------------------- $PLATFORM 移动文件结束 ---------------------------------
}

function calculateFileSign()
{
	PLATFORM=$1

	echo --------------------------------- $PLATFORM 计算hash开始 ---------------------------------

	if [ "$PLATFORM" == "ios" ]
        then
                node ./scripts/recordFilesBeforeBundleCommand.js ./bundle/ios CodePushResourcesMap-ios.json
        	node ./scripts/generateBundledResourcesHash.js ./bundle/ios ./bundle/android/index.ios.bundle ./bundle/ios
        elif [ "$PLATFORM" == "android" ]
        then
                node ./scripts/recordFilesBeforeBundleCommand.js ./bundle/android CodePushResourcesMap-android.json
        	node ./scripts/generateBundledResourcesHash.js ./bundle/android ./bundle/android/index.android.bundle ./bundle/android
        elif [ "$PLATFORM" == "all" ]
        then
                calculateFileSign ios
                calculateFileSign android
        else
                echo "请添加参数: ios 或 android 或 all"
                echo "参数 all 会将 ios 与 android 全部重新计算"
        fi

        echo --------------------------------- $PLATFORM 计算hash结束 ---------------------------------

	moveFileToProj $PLATFORM
}

function offlinePackage()
{
	PLATFORM=$1

	echo --------------------------------- $PLATFORM 准备工作 ---------------------------------

	if [ ! -d "./bundle/$PLATFORM/" ];then
		mkdir -p ./bundle/$PLATFORM
		echo 创建目录: ./bundle/$PLATFORM
	else
		rm -rf ./bundle/$PLATFORM/
		mkdir -p ./bundle/$PLATFORM
		echo 重新 创建目录: ./bundle/$PLATFORM
	fi

		echo 开始打包 $PLATFORM

		react-native bundle --entry-file index.js --bundle-output ./bundle/$PLATFORM/index.$PLATFORM.bundle --platform $PLATFORM --assets-dest ./bundle/$PLATFORM --dev false

		echo --------------------------------- 打包 $PLATFORM 结束 ---------------------------------
	
	# calculateFileSign $PLATFORM
	moveFileToProj $PLATFORM
}

function checkPaerams()
{
	PLATFORM=$1

	if [ "$PLATFORM" == "ios" ]
	then
        	offlinePackage ios
        elif [ "$PLATFORM" == "android" ]
	then
                offlinePackage android
	elif [ "$PLATFORM" == "all" ]
	then
		offlinePackage ios
		offlinePackage android
	else
		echo "请添加参数: ios 或 android 或 all"
		echo "参数 all 会将 ios 与 android 全部重新打包"
        fi
}

checkPaerams $1

