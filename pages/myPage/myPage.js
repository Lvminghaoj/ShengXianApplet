//index.js
//获取应用实例
const app = getApp()
import { apiObj } from '../../api/api'
import { postData, getData } from '../../utils/https'
Page({
    data: {
        tabbar: {},
        img: ['../../images/weilogin.jpg'],
        name: '',
        posiTioni: '区长',
        bottom: 0,
        login: false,
        carNumber: 0,
        priceMoney: 0.00, //钱包余额
        List: [{ id: 1, words: '区救扶资金', number: '0.00' }, { id: 2, words: '今日收入', number: '0.00' }, { id: 1, words: '本月收入', number: '0.00' }],
        powerList: [{ id: 0, words: '未支付', img: ['../../images/daikuan.png'] }, { id: 1, words: '待发货', img: ['../../images/daifa.png'] }, { id: 3, words: '完成', img: ['../../images/good.png'] }, { id: 4, words: '取消', img: ['../../images/no.png'] }],
        powerListTwo: [{ id: 4, words: '我的粉丝', img: ['../../images/friends.png'] }, { id: 5, words: '粉丝订单', img: ['../../images/dingdan.png'] }, { id: 6, words: '我的业绩', img: ['../../images/yeji.png'] }]
    },
    //事件处理函数
    onShow() {
        let that = this;
        var img = wx.getStorageSync('img');
        var name = wx.getStorageSync('name');
        var isok = wx.getStorageSync('isOk')
        let carnumber = wx.getStorageSync('carNumber');
        let gradeName = wx.getStorageSync('gradeName');
        let amt = wx.getStorageSync('amt');
        if (carnumber == null || carnumber == '' || carnumber == undefined) {} else {
            that.setData({
                carNumber: carnumber,
            })
        }
        if (isok == 1) {
            that.setData({
                login: true,
                name: name,
                img: img,
                posiTion: gradeName,
                priceMoney: amt
            })
            that.getDetail();

        } else {
            that.setData({
                login: false,
            })
        }
        app.editTabbar();
        that.getHeight();
    },
    onLoad: function() {},
    bindGetUserInfo(e) {
        console.log(e.detail.userInfo);
        wx.setStorageSync('img', e.detail.userInfo.avatarUrl);
        wx.setStorageSync('name', e.detail.userInfo.nickName);
        wx.setStorageSync('gender', e.detail.userInfo.gender);
        let url = `../login/login`
        wx.navigateTo({
            url: url
        })
    },
    getHeight() {
        // 获取底部两个固定定位盒子的高度
        let that = this;
        let systemInfo = wx.getSystemInfoSync(); // 当前机型的总高度
        let pxToRpxScale = 750 / systemInfo.windowWidth; //px转换rpx的系数
        let iphoneX = wx.getStorageSync('isIphoneX');
        if (iphoneX != null || iphoneX != '' || iphoneX != undefined) {
            console.log(iphoneX)
            if (iphoneX == true) {
                that.setData({
                    bottom: (96 + 66) / pxToRpxScale,
                })
            } else {
                that.setData({
                    bottom: 96 / pxToRpxScale,
                })
            }
        }

    },
    lookImgfree() {
        // 点击查看详情
        let url = `../information/information`
        wx.navigateTo({
            url: url
        })
    },
    onCustomer() {
        // 邀请成为群主
        let url = `../becomeLeader/becomeLeader`
        wx.navigateTo({
            url: url
        })
    },
    onAboutUs() {
        let url = `../aboutUs/aboutUs`
        wx.navigateTo({
            url: url
        })
    },
    navRouter(e) {
        //根据不同id跳转 我的粉丝 粉丝订单 粉丝业绩
        let index = e.currentTarget.dataset.id;
        if (index == 0) {
            wx.navigateTo({
                url: `../myFans/myFans`
            })
        } else if (index == 2) {
            wx.navigateTo({
                url: `../myAchievements/myAchievements`
            })
        } else {
            wx.navigateTo({
                url: `../orderData/orderData?Ordertype=0`
            })
        }
    },
    navRouterOrder(e) {
        let index = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: `../orderData/orderData?Ordertype=1&id=` + index
        })
    },
    RouterToMywallet() {
        //点击钱包跳转去我的钱包
        wx.navigateTo({
            url: `../myWallet/myWallet`
        })
    },
    onSuggested() {
        // 跳转投诉与建议
        wx.navigateTo({
            url: `../Suggested/Suggested`
        })
    },
    getDetail() {
        let that = this;
        postData(apiObj.queryCount, { phone: wx.getStorageSync('phone') }, (res) => {
            console.log(res)
            let listobjOne = `List[1].number`;
            let listobjTwo = `List[0].number`;
            let listobjThree = `List[2].number`;
            that.setData({
                [listobjThree]: res.monCou, //本月收入
                [listobjOne]: res.dayCou, // 今日收入
                [listobjTwo]: res.ouAll // 区资金.
            })
        }, (res) => {
            console.log(res)
        });
        // 获取银行卡信息
        postData(apiObj.queryBank, {
            phone: wx.getStorageSync('phone'),
        }, (res) => {
            console.log(res)
            wx.setStorageSync('cardCertification', true) //根据他判断
            that.setData({
                bankCard: false
            })
        }, (res) => {
            console.log(res)
        });
        // 获取身份证信息
        postData(apiObj.queryUserAuth, { phone: wx.getStorageSync('phone') }, (res) => {
            console.log(res)
            wx.setStorageSync('authentication', true) //根据这个来判断是否已通过认证
            that.setData({
                authenTication: false
            })
        }, (res) => {
            // 错误的函数
            console.log(res)
        })
    }
})