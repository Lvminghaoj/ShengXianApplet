//index.js
//获取应用实例
import { apiObj } from '../../api/api'
import { formatTimeThree } from '../../utils/util'
import { postData } from '../../utils/https'
Page({
    data: {
        condition: true, //控制是收入明细还是提现明细
        cashMoney: 0, //提现明细金额
        cashMoneyTwo: 0, //收入明细金额
        cashNum: 0, //提现次数
        cashNumTwo: 0, // 收入次数
        items: []
    },
    //事件处理函数

    onLoad: function(optiacy) {
        let that = this;
        if (optiacy.id == 1) {
            console.log(123)
            wx.setNavigationBarTitle({
                title: '收入明细'
            })
            that.setData({
                condition: false
            })

            that.getDetail();
        } else {
            wx.setNavigationBarTitle({
                title: '提现明细'
            })
            that.setData({
                condition: true
            })
            that.getDatas(10, 0);
        }
        that.getHeight();
    },
    scrollTwo(e) {
        //下拉加载的
        let that = this;
        var minnum = this.data.items.length;
        var maxnum = minnum * 1 + 10;
        if (that.data.condition == false) {
            that.getDetail(maxnum, minnum); // 收入明细
        } else {
            that.getDatas(maxnum, minnum); // 提现明细
        }
    },
    getDatas(maxNum, minNum) {
        // 提现明细
        let that = this;
        postData(apiObj.queryWithdrawDeposit, { phone: wx.getStorageSync('phone'), minSize: minNum, maxSize: maxNum, }, res => {
            var items = that.data.items;
            var cashMoney = 0;
            var cashNum = res.length;
            for (let i = 0; i < res.length; i++) {
                var obj = {
                    registerNumber: res[i].code, // 单号
                    type: res[i].status, // 0是审核中 1是通过 2是不通过
                    BankNum: `${res[i].bankName}****${res[i].cardNo.slice(-4, res[i].cardNo.length)}`, //银行和卡号
                    money: res[i].amount, // 金额
                    time: formatTimeThree(new Date(res[i].createDate)), // 时间
                    Remarks: res[i].detail // 未通过备注
                }
                cashMoney += Number(res[i].amount); //提现总金额
                items.push(obj)
            }
            that.setData({
                items: items,
                cashMoney: cashMoney,
                cashNum: cashNum
            })
        }, res => {
            if (that.data.items == [] || that.data.items == '') {
                wx.showToast({ title: '暂无提现记录', icon: 'none', duration: 2000 });
                that.setData({
                    items: [],
                    cashMoney: 0,
                    cashNum: 0,
                })
            } else {
                wx.showToast({ title: '已经到底了咯', icon: 'none', duration: 2000 });
            }
        })
    },
    getDetail(maxNum, minNum) {
        // 收入明细
        let that = this;
        postData(apiObj.queryMemberIncome, { phone: wx.getStorageSync('phone'), minSize: minNum, maxSize: maxNum }, res => {
            var items = that.data.items;
            var cashMoney = 0;
            var cashNum = res.length;
            for (let i = 0; i < res.length; i++) {
                var obj = {
                    registerNumber: res[i].code, // 单号
                    money: res[i].amount, // 金额
                    time: formatTimeThree(new Date(res[i].createDate)), // 时间
                    sourceName: `**${res[i].sourceName.slice(-1,res[i].sourceName.length)}`
                }
                cashMoney += Number(res[i].amount); //提现总金额
                items.push(obj)
            }
            that.setData({
                items: items,
                cashMoneyTwo: cashMoney.toFixed(2),
                cashNumTwo: cashNum,

            })
        }, res => {
            if (that.data.items == [] || that.data.items == '') {
                wx.showToast({ title: '暂无收入记录', icon: 'none', duration: 2000 });
                that.setData({
                    items: [],
                    cashMoneyTwo: 0,
                    cashNumTwo: 0,
                })
            } else {
                wx.showToast({ title: '已经到底了咯', icon: 'none', duration: 2000 });
            }
        })

    },
    getHeight() {
        // 获取底部固定盒子的高度
        let that = this;
        let systemInfo = wx.getSystemInfoSync(); // 当前机型的总高度
        console.log(systemInfo);
        that.setData({
            heightTop: systemInfo.windowHeight
        })
    },
})