//index.js
//获取应用实例
import { apiObj } from '../../api/api';
import { postData } from '../../utils/https';
Page({
    data: {
        Name: '', // 收货人
        phone: '', // 收货电话
        posiTion: '', // 收货地址
        Number: 0, // 金额
        PriceNumber: 0, // 商品数量,
        priceAdd: 0, // 总金额
        getheight: 0, // 底部盒子高度
        show: true,
        item: [{ id: 1, price: 18.9, Number: 2, data: '火龙果之奥义敲击好吃快点买多点', img: ['../../images/Honey.jpg'] }],
        iphoneX: wx.getStorageSync('isIphoneX')
    },
    //事件处理函数

    onLoad: function(optiacy) {
        let that = this;
        console.log(optiacy)
        that.getDetail();
        that.getHeight();
        // 判断是否通过微信获取通讯地址 未授权就调起授权
        wx.getSetting({
            success(res) {
                console.log(res)
                if (!res.authSetting['scope.address']) {
                    console.log(111)
                    wx.chooseAddress({
                        success(res) {
                            that.setData({
                                Name: res.userName,
                                phone: res.telNumber,
                                posiTion: `${res.provinceName}${res.cityName}${res.countyName}${res.detailInfo}`,
                                show: false
                            })
                        }
                    })
                    console.log(res.authSetting['scope.address'])
                } else {
                    that.setData({
                        address: res.authSetting['scope.address']
                    })
                }
            }
        })
    },
    getHeight() {
        // 获取底部盒子的高度自适应
        var that = this;
        let systemInfo = wx.getSystemInfoSync(); // 当前机型的总高度
        let pxToRpxScale = 750 / systemInfo.windowWidth; //px转换rpx的系数
        let iphoneX = that.data.iphoneX;
        if (iphoneX != null || iphoneX != '' || iphoneX != undefined) {
            if (iphoneX == true) {
                that.setData({
                    getheight: (98 + 68) / pxToRpxScale
                })
            } else {
                that.setData({
                    getheight: 98 / pxToRpxScale
                })
            }
        }
    },
    WeChatpayment: function() {
        // 调用微信支付
        let that = this;
        if (that.data.posiTion == '' || that.data.posiTion == null || that.data.posiTion == undefined) {
            wx.showToast({ title: '请授权选择收货地址', icon: 'none', duration: 2000 });
            return;
        }
        wx.requestPayment({
            timeStamp: '',
            nonceStr: '',
            package: '',
            signType: 'MD5',
            paySign: '',
            success(res) {},
            fail(res) {}
        })
    },
    posiTionSet() {
        // 点击添加收货地址按钮
        let that = this;
        if (that.data.address == true) {
            wx.chooseAddress({
                success(res) {
                    that.setData({
                        Name: res.userName,
                        phone: res.telNumber,
                        posiTion: `${res.provinceName}${res.cityName}${res.countyName}${res.detailInfo}`,
                        show: false
                    })
                }
            })
        } else {
            wx.showModal({
                content: '检测到您没打开微信地址，是否去设置打开？',
                confirmText: "确认",
                cancelText: "取消",
                success: function(res) {
                    console.log(res);
                    //点击“确认”时打开设置页面
                    if (res.confirm) {
                        console.log('用户点击确认')
                            // 点击确定调起微信设置打开
                        wx.openSetting({
                            success: (res) => {
                                console.log(res)
                                if (res.authSetting['scope.address'] == true) {
                                    wx.chooseAddress({
                                        success(res) {
                                            that.setData({
                                                Name: res.userName,
                                                phone: res.telNumber,
                                                posiTion: `${res.provinceName}${res.cityName}${res.countyName}${res.detailInfo}`,
                                                show: false
                                            })
                                        }
                                    })
                                } else {
                                    console.log('用户点击了取消获取微信位置')
                                }
                            }
                        })
                    } else {
                        console.log('用户点击取消')
                    }
                }
            });
        }
    },
    positionEach() {
        // 出现收货地址后更换地址
        let that = this;
        wx.chooseAddress({
            success(res) {
                that.setData({
                    Name: res.userName,
                    phone: res.telNumber,
                    posiTion: `${res.provinceName}${res.cityName}${res.countyName}${res.detailInfo}`,
                    show: false
                })
            }
        })
    },
    getDetail() {
        let that = this;
        postData(apiObj.queryShoppingTrolley, { "phone": `${wx.getStorageSync('phone')}` }, (res) => {
            var item = new Array();
            let Price = 0; // 钱
            let number = 0; // 数量
            for (let i = 0; i < res.length; i++) {
                if (res[i].addWxPayment == 1) {
                    console.log(res[i])
                    var obj = {
                        tradeName: res[i].tradeName,
                        checked: false,
                        id: i,
                        money: res[i].money,
                        goodsImg: res[i].goodsImg,
                        num: res[i].num, // 数量
                        phone: wx.getStorageSync('phone'),
                        IndexNum: res[i].IndexNum,
                    }
                    postData(apiObj.saveShoppingTrolley, {
                        // 只要数据出来了只需要获取对应的标识id就可以 不用加入时候的id
                        tradeName: res[i].tradeName,
                        phone: wx.getStorageSync('phone'),
                        checked: res[i].checked,
                        money: res[i].money,
                        goodsImg: res[i].goodsImg,
                        IndexNum: res[i].IndexNum, // 我们使用的标识
                        index: res[i].IndexNum, // 传的标识
                        num: res[i].num, // 数量
                        phone: wx.getStorageSync('phone'),
                        addWxPayment: 2,
                    }, (res) => {
                        console.log(res)
                    }, () => {
                        console.log('data为空了咯')
                    })
                    item.push(obj);
                }
            }
            for (let i = 0; i < item.length; i++) { // 把钱和数量 统计
                Price += item[i].num * 1 * item[i].money * 1
                number += item[i].num * 1
            }
            that.setData({
                item: item,
                priceAdd: Price.toFixed(2),
                PriceNumber: number
            })
        }, () => {
            console.log('data为空了咯');
            wx.setStorageSync('carNumber', carNumber);
            that.setData({
                ShowModel: true
            })
        })
    }
})