//index.js
//获取应用实例
import { apiObj } from '../../api/api'
import { postData } from '../../utils/https'
import { checkAll } from '../../utils/util'
Page({
    data: {
        bankCardname: '', // 银行名称
        bankCardNum: '', //银行卡账号
        bankCardwordsName: '', //开户名
        addCashcare: false, // 点击添加银行卡
        Frray: [], // 银行名称列表
        bankList: [], //银行列表
        bankListName: '', //银行名称
        bankListCode: '', //银行code
        bankListShow: []
    },
    //事件处理函数

    onLoad: function(optiacy) {},
    onShow() {
        let that = this;
        that.getqueryBankList();
        that.getDetail();
    },
    colok(e) {
        //监听输入银行卡名称
        let that = this;
        that.setData({
            bankCardname: e.detail.value
        })
    },
    colokNum(e) {
        // 银行卡账号
        let that = this;
        that.setData({
            bankCardNum: e.detail.value
        })
    },
    colokName(e) {
        // 开户名
        let that = this;
        that.setData({
            bankCardwordsName: e.detail.value
        })
    },
    addCashcare() {
        // 点击添加银行卡信息
        let that = this;
        that.setData({
            addCashcare: true
        });

    },
    btnAddData() {
        // 点击保存修改
        let that = this;
        if (that.data.bankListCode == '' || that.data.bankListCode == null || that.data.bankListCode == undefined || that.data.bankListCode == 'undefined') {
            wx.showToast({ title: '请选择归属银行', icon: 'none' });
            return;
        }
        if (that.data.bankCardNum == '' || that.data.bankCardNum == null || that.data.bankCardNum == undefined || that.data.bankCardNum == 'undefined') {
            wx.showToast({ title: '卡号不能为空', icon: 'none' });
            return;
        }
        if (that.data.bankCardwordsName == '' || that.data.bankCardwordsName == null || that.data.bankCardwordsName == undefined || that.data.bankCardwordsName == 'undefined') {
            wx.showToast({ title: '开户名不能为空', icon: 'none' });
            return;
        } else if (checkAll('Chinese', that.data.bankCardwordsName) == !true) {
            wx.showToast({ title: '请输入中文', icon: 'none' });
            return;
        }
        postData(apiObj.updateBank, {
            phone: wx.getStorageSync('phone'),
            cardNo: that.data.bankCardNum, //卡号
            userName: that.data.bankCardwordsName, //开户名
            bankInfoCode: that.data.bankListCode // 银行code
        }, (res) => {
            console.log(res)
        }, (res) => {
            console.log(res)
            wx.showToast({ title: '提交成功', icon: 'none' });
            if (res.message == '操作成功') {
                wx.setStorageSync('cardCertification', true) //根据他判断
                wx.navigateBack({
                    delta: 1
                })

            }
        })
    },
    getDetail() {
        // 获取查看是否添加过银行卡
        let that = this;
        postData(apiObj.queryBank, { phone: wx.getStorageSync('phone'), }, (res) => {
                console.log(res)
                wx.setStorageSync('cardCertification', true) //根据他判断
                var bankListShow = [];
                for (let i = 0; i < res.length; i++) {
                    var obj = {
                        img: res[i].logo,
                        cardNo: `${res[i].cardNo.slice(0,4)}****${res[i].cardNo.slice(-4,res[i].cardNo.length)}`,
                        cardType: res[i].cardType,
                        code: res[i].code,
                        bankName: '建设银行'
                    }
                    bankListShow.push(obj)
                };
                that.setData({
                    bankListShow: bankListShow
                });
            }, (res) => {
                console.log(res);
            })
            // eaimkName
    },
    getqueryBankList() {
        // 获取暂支持的银行列表
        postData(apiObj.queryBankList, {
            phone: wx.getStorageSync('phone'),
        }, (res) => {
            console.log(res)
            let that = this;
            var Frray = []; // 存储银行名称
            for (let i = 0; i < res.length; i++) {
                Frray.push(res[i].bankname);
            }
            that.setData({
                Frray: Frray,
                bankList: res
            })
        }, (res) => {
            wx.showToast({ title: '暂无数据,请刷新重试', icon: 'none' });
        })
    },
    bankListName(e) {
        // 监听选择框
        console.log(e)
        this.setData({
            bankListName: this.data.bankList[e.detail.value].bankname,
            bankListCode: this.data.bankList[e.detail.value].code,
        })
    }
})