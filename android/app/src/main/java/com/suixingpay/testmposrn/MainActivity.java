package com.suixingpay.testmposrn;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.View;

import com.suixingpay.reactNativeModule.RNEntryActivity;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }

    public void clickText(View view) {
        startActivity(new Intent(this, RNEntryActivity.class));
    }
}
