//
//  ViewController.m
//  TestMPOSRN
//
//  Created by chengkai on 2018/7/20.
//  Copyright © 2018年 suixingpay. All rights reserved.
//

#import "ViewController.h"
#import <React/RCTRootView.h>
#import "CodePush.h"

@interface ViewController ()
- (IBAction)showRNPage:(id)sender;

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
}


- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}


- (IBAction)showRNPage:(id)sender {
    NSLog(@"showRNPage Button Pressed");

    NSURL *jsCodeLocation;
    #ifdef DEBUG
        jsCodeLocation = [NSURL URLWithString:@"http://localhost:8081/index.bundle?platform=ios&dev=true"];
    #else
        jsCodeLocation = [CodePush bundleURL];
    #endif
    RCTRootView *rootView =
    [[RCTRootView alloc] initWithBundleURL : jsCodeLocation
                         moduleName        : @"TestMPOSRN"
                         initialProperties : @{
                                               @"routeName": @"root"
                                               }
                         launchOptions     : nil];
    UIViewController *vc = [[UIViewController alloc] init];
    vc.view = rootView;
    [self presentViewController:vc animated:YES completion:nil];
}
@end
