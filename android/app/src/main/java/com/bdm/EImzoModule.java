package com.bdm;

import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.util.Base64;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;

import uz.sicnt.horcrux.Constants;
import uz.sicnt.horcrux.Horcrux;

public class EImzoModule extends ReactContextBaseJavaModule implements ActivityEventListener {
    private ReactApplicationContext reactContext;

    EImzoModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        reactContext.addActivityEventListener(this);
        horcrux = MainApplication.horcrux;
    }

    @NonNull
    @Override
    public String getName() {
        return "EImzo";
    }

    Promise promise;
    Horcrux horcrux;

    @ReactMethod
    public void createSign(ReadableMap params, final Promise promise) {
        this.promise = promise;
        if (params.hasKey(Constants.EXTRA_PARAM_MESSAGE)) {
            this.horcrux.createPKCS7(getCurrentActivity(), params.getString(Constants.EXTRA_PARAM_MESSAGE));
        } else {
            this.horcrux.createPKCS7(getCurrentActivity(), "login");
        }
    }

    @ReactMethod
    public void appendSign(ReadableMap params, final Promise promise) {
        this.promise = promise;
        if (params.hasKey(Constants.EXTRA_PARAM_APPEND_PKCS7)) {
            this.horcrux.appendPkcs7(getCurrentActivity(), params.getString(Constants.EXTRA_PARAM_APPEND_PKCS7));
            return;
        }
        this.horcrux.appendPkcs7(getCurrentActivity());
    }

    @ReactMethod
    public void attachTimestamp(ReadableMap params, final Promise promise) {
        this.promise = promise;
        if (params.hasKey(Constants.EXTRA_PARAM_APPEND_PKCS7)) {
            this.horcrux.appendPkcs7(getCurrentActivity(), params.getString(Constants.EXTRA_PARAM_APPEND_PKCS7));
            return;
        }
        this.horcrux.appendPkcs7(getCurrentActivity());
    }

    public static String encodeHex(byte[] bytes) {
        StringBuilder hexString = new StringBuilder();

        for (byte aByte : bytes) {
            String hex = Integer.toHexString(0xFF & aByte);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }

        return hexString.toString();
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        if (requestCode != Constants.CREATE_PKCS7 && requestCode != Constants.APPEND_CODE && requestCode != Constants.ATTACH_CODE) {
            return;
        }
        WritableMap params = Arguments.createMap();
        if (data != null) {
            params.putInt("resultCode", resultCode);
            this.horcrux.parsePFX(data);
            params.putString(Constants.EXTRA_RESULT_PKCS7, Base64.encodeToString(data.getByteArrayExtra(Constants.EXTRA_RESULT_PKCS7), Base64.NO_WRAP));
            try {
                params.putString(Constants.EXTRA_RESULT_SIGNATURE, encodeHex(data.getByteArrayExtra(Constants.EXTRA_RESULT_SIGNATURE)));
            } catch (Exception e) {
                this.promise.reject(e);
            }
        }
        this.promise.resolve(params);

    }

    @Override
    public void onNewIntent(Intent intent) {

    }

    @ReactMethod
    public void isAppInstalled(String packageName, final Promise promise) {
        try {
            this.reactContext.getPackageManager().getPackageInfo(packageName, 0);
        } catch (PackageManager.NameNotFoundException e) {
            promise.reject("app not found");
            return;
        }
        promise.resolve(true);
    }
}
