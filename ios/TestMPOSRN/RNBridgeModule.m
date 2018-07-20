//
//  RNBridgeModule.m
//  TestAndroidToRN
//
//  Created by chengkai on 2018/6/22.
//  Copyright © 2018年 chengkai. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "RNBridgeModule.h"
#import "ViewController.h"

@implementation RNBridgeModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(startNativePage) { // ViewController
    dispatch_async(dispatch_get_main_queue(), ^{
        [[[UIAlertView alloc] initWithTitle:@"" message:@"信息" delegate:nil cancelButtonTitle:@"确定" otherButtonTitles:nil] show];
    });
}

RCT_EXPORT_METHOD(closeNativePage) { // ViewController
    dispatch_async(dispatch_get_main_queue(), ^{
        [[UIApplication sharedApplication].delegate.window.rootViewController dismissViewControllerAnimated:YES completion:nil];
    });
}

@end
