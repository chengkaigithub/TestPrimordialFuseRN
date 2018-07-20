Pod::Spec.new do |s|
    s.name         = "TestMPOSRN"
    s.version      = "1.0.0"
    s.ios.deployment_target = '9.0'
    s.summary      = "A test interface framework for react native."
    s.homepage     = "https://github.com/chengkaigithub/TestPrimordialFuseRN.git"
    s.license              = { :type => "MIT", :file => "LICENSE" }
    s.author             = { "cheng_kai" => "cheng_kai@suixingpay.com" }
    s.social_media_url   = "https://github.com/chengkaigithub/TestPrimordialFuseRN/tree/master/ios"
    s.source       = { :svn => "https://github.com/chengkaigithub/TestPrimordialFuseRN/tree/master/ios", :tag => s.version }
    s.source_files  = "TestMPOSRN/*.{h,m}"
    # s.resources          = "TestMPOSRN/TestMPOSRN.bundle"
    # s.dependency = "react-native"
    s.requires_arc = true
end
