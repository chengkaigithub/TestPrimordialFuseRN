package com.suixingpay.reactNativeModule;

import android.widget.Toast;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

/**
 * Created by chengkai on 2018/4/26.
 */

public class RNBridgeModule extends ReactContextBaseJavaModule {


    public RNBridgeModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "RNBridgeModule";
    }

    @ReactMethod
    public void startNativePage() {
        Toast.makeText(getCurrentActivity(), "startNativePage", Toast.LENGTH_SHORT).show();
    }


}
