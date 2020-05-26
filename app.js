App({
    async onLaunch() {
        // 展示本地存储能力   
        wx.hideTabBar()
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)
            // 登录
        wx.login({
                success: res => {
                    console.log(res);
                    wx.setStorageSync('code', res.code)
                        // 发送 res.code 到后台换取 openId, sessionKey, unionId
                }
            })
            // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            console.log(res)
                                // 可以将 res 发送给后台解码出 unionId
                            this.globalData.userInfo = res.userInfo;
                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res)
                            }
                        }
                    })
                }
            }
        })
        wx.checkSession({
            success(res) {
                console.log(res)
                    //session_key 未过期，并且在本生命周期一直有效
            },
            fail(res) {
                console.log(res)
                    // session_key 已经失效，需要重新执行登录流程
                wx.login() //重新登录
            }
        })
    },
    globalData: {
        userInfo: null,
        tabBar: {
            "backgroundColor": "#ffffff",
            "color": "#D0D0D0",
            "selectedColor": "#FF9702",
            "list": [{
                    "pagePath": "/pages/index/index",
                    "text": "首页",
                    "iconPath": "icon/indexOne.png",
                    "selectedIconPath": "icon/indexTwo.png"
                },
                {
                    "pagePath": "/pages/car/car",
                    "text": "购物车",
                    "iconPath": "icon/carOne.png",
                    "selectedIconPath": "icon/carTwo.png"
                },
                {
                    "pagePath": "/pages/myPage/myPage",
                    "text": "我的",
                    "iconPath": "icon/meOne.png",
                    "selectedIconPath": "icon/meTwo.png"
                }
            ]
        },
        isIphoneX: false,
    },
    onShow: function() {  
        let  that = this;  
        let systemInfo = wx.getSystemInfoSync(); // 当前机型的总高度
        let modelmes = systemInfo.model.substring(0, 8)
        if (modelmes == "iPhone X") {
            that.globalData.isIphoneX = true;
            wx.setStorage({
                key: 'isIphoneX',
                data: true,
            })
        } else {
            wx.setStorage({ key: 'isIphoneX', data: false, });
        }
    },
    editTabbar: function() {
        let tabbar = this.globalData.tabBar;
        let currentPages = getCurrentPages();
        let _this = currentPages[currentPages.length - 1];
        let pagePath = _this.route;
        (pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath);
        for (let i in tabbar.list) {
            tabbar.list[i].selected = false;
            (tabbar.list[i].pagePath == pagePath) && (tabbar.list[i].selected = true);
        }
        _this.setData({
            tabbar: tabbar
        });
    },
    onReady: function() {
        wx.hideTabBar({
            fail: function() {
                setTimeout(function() {
                    wx.hideTabBar()
                }, 500)
            }
        });
    },
})