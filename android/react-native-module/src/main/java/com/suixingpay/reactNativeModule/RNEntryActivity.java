package com.suixingpay.reactNativeModule;

import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.support.v7.app.AppCompatActivity;
import android.view.KeyEvent;
import android.widget.Toast;

import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactRootView;
import com.facebook.react.common.LifecycleState;
import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler;
import com.facebook.react.shell.MainReactPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.microsoft.codepush.react.CodePush;

import java.util.Arrays;

public class RNEntryActivity extends AppCompatActivity implements DefaultHardwareBackBtnHandler {

    private int OVERLAY_PERMISSION_REQ_CODE = 0x001;

    public static final String BUNDLE_EXTRA = "BUNDLE_EXTRA";
    public static final String ROUTE_NAME = "routeName";
    public static final String ROUTE_NAME_ROOT = "root";

    private ReactRootView mReactRootView;
    private ReactInstanceManager mReactInstanceManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (!Settings.canDrawOverlays(this)) {
                Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                        Uri.parse("package:" + getPackageName()));
                startActivityForResult(intent, OVERLAY_PERMISSION_REQ_CODE);
            }
        }
        super.onCreate(savedInstanceState);

        mReactRootView = new ReactRootView(this);
        mReactInstanceManager = ReactInstanceManager.builder()
                .setApplication(getApplication())
                .setBundleAssetName("index.android.bundle")
                .setJSMainModulePath("index")
                .addPackages(Arrays.asList(
                        new MainReactPackage(),
                        new RNBridgePackage(),
                        new RNDeviceInfo()
                ))
                .setUseDeveloperSupport(BuildConfig.DEBUG)
                .setInitialLifecycleState(LifecycleState.RESUMED)
                // Add CodePush package
                .addPackage(new CodePush("tHMy3Ph65xknhgerufF05r8d5EZI4ksvOXqog", getApplicationContext(), BuildConfig.DEBUG, ""))
                // Get the JS Bundle File via Code Push
                .setJSBundleFile(CodePush.getJSBundleFile())
                .build();

        // 注意这里的 moduleName 必须对应“index.js”中的
        // “AppRegistry.registerComponent()”的第一个参数
        mReactRootView.startReactApplication(mReactInstanceManager, "TestMPOSRN", packageBundleParams());

        setContentView(mReactRootView);
    }

    /**
     * 打包参数
     *
     * @return
     */
    private Bundle packageBundleParams() {
        Intent intent = getIntent();
        Bundle initialProperties = null;
        if (intent != null) {
            initialProperties = intent.getBundleExtra(BUNDLE_EXTRA);
            if (initialProperties == null) {
                initialProperties = new Bundle();
                initialProperties.putString(ROUTE_NAME, ROUTE_NAME_ROOT);
            }
        }
        return initialProperties;
    }

    @Override
    public void invokeDefaultOnBackPressed() {
        super.onBackPressed();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == OVERLAY_PERMISSION_REQ_CODE) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                if (!Settings.canDrawOverlays(this)) {
                    // SYSTEM_ALERT_WINDOW permission not granted...
                    Toast.makeText(this,
                            "SYSTEM_ALERT_WINDOW permission not granted...",
                            Toast.LENGTH_LONG).show();
                }
            }
        }
    }

    @Override
    protected void onPause() {
        super.onPause();

        if (mReactInstanceManager != null) {
            mReactInstanceManager.onHostPause(this);
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (mReactInstanceManager != null) {
            mReactInstanceManager.onHostResume(this, this);
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();

        if (mReactInstanceManager != null) {
            mReactInstanceManager.onHostDestroy();
        }
    }

    @Override
    public void onBackPressed() {
        if (mReactInstanceManager != null) {
            mReactInstanceManager.onBackPressed();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    public boolean onKeyUp(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_MENU && mReactInstanceManager != null) {
            mReactInstanceManager.showDevOptionsDialog();
            return true;
        }
        return super.onKeyUp(keyCode, event);
    }

}
