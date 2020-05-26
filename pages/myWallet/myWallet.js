//index.js
//获取应用实例
import { apiObj } from '../../api/api'
import { postData } from '../../utils/https'
Page({
    data: {
        addNum: 0, // 总收入
        CashNum: 0, //已经提现
        CashinNum: 0, //提现中
        cashAddnum: 0, //累计提现
        balance: 0, //余额
        isok: 0
    },
    //事件处理函数

    onLoad: function(optiacy) {

    },
    onShow() {
        let that = this;
        var isok = wx.getStorageSync('isOk')
        if (isok == 1) {
            that.setData({
                isok: 1
            })
            that.getDetail();
        } else {
            wx.showToast({
                title: '您尚未登录',
                icon: 'none',
                duration: 2000
            })
        }
    },
    tapincomeDetails(e) {
        console.log(e)
        let that = this;
        let id = e.currentTarget.dataset.id;
        // 点击收入明细跳转
        if (that.data.isok != 1) {
            wx.showToast({ title: '您尚未登录', icon: 'none', duration: 2000 })
            return
        }
        let url = `../incomeDetails/incomeDetails?id=` + id;
        wx.navigateTo({
            url: url
        })

    },
    cashWithdrawal() {
        let cardCertification = wx.getStorageSync('cardCertification');
        let that = this;
        console.log(cardCertification)
        if (that.data.isok != 1) {
            wx.showToast({ title: '您尚未登录', icon: 'none', duration: 2000 })
            return
        }
        if (cardCertification == undefined || cardCertification == '' || cardCertification == null) {
            wx.showModal({
                title: `您尚未认证银行卡信息`,
                content: `请前往认证`,
                success(res) {
                    if (res.confirm) {
                        let url = `../cardCertification/cardCertification`;
                        wx.navigateTo({
                            url: url
                        });
                    }
                }
            })
        } else {
            let url = `../cashWithdrawal/cashWithdrawal?balance=` + that.data.balance;
            wx.navigateTo({
                url: url
            });
        }
    },
    getDetail() {
        let that = this;
        postData(apiObj.queryWallet, { phone: wx.getStorageSync('phone') }, (res) => {
            console.log(res)
            that.setData({
                addNum: res.toalAmt, // 总收入
                CashNum: res.haveWithdrawal, //已经提现
                CashinNum: res.withdrawalOf, //提现中
                balance: res.balance //余额
            })
        }, (res) => {
            console.log(res)
        })
    }
})