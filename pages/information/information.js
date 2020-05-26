//index.js
//获取应用实例
import { apiObj } from '../../api/api';
import { ChooImg, postData } from '../../utils/https'
Page({
    data: {
        img: '',
        nickName: "", //名称
        identity: '', // 身份
        Superior: '', //上级
        bankCard: false, //银行卡信息
        authenTication: false, //个人认证
    },
    //事件处理函数

    onLoad: function() {
        let that = this;
    },
    onShow() {
        let that = this;
        let authentication = wx.getStorageSync('authentication');
        let cardCertification = wx.getStorageSync('cardCertification');
        console.log(authentication);
        // 判断是否已经通过个人认证
        if (authentication == null || authentication == undefined || authentication == '') {
            that.setData({
                authenTication: true
            })
        } else {
            that.setData({
                authenTication: false
            })
        }
        console.log(that.data.authentication)
            //判断是否已经通过银行卡认证
        if (cardCertification == null || cardCertification == undefined || cardCertification == '') {
            that.setData({
                bankCard: true
            })
        } else {
            that.setData({
                bankCard: false
            })
        }
        that.getDetail()
    },
    authenTicationIsok(e) {
        //点击个人认证
        console.log(e)
        let authentication = e.currentTarget.dataset.authentication;
        let url = `../authentication/authentication?authentication=` + authentication;
        wx.navigateTo({
            url: url
        })
    },
    bankCardIsok(e) {
        // 点击银行卡认证
        let bankCard = e.currentTarget.dataset.bankCard;
        let url = `../cardCertification/cardCertification?cardCertification=` + bankCard;
        wx.navigateTo({
            url: url
        })
    },
    getDetail() {
        let that = this;
        postData(apiObj.personal, { phone: wx.getStorageSync('phone') }, res => {
            console.log(res);
            var img;
            if (res.avtor == '' || res.avtor == undefined || res.avtor == null) {
                img = wx.getStorageSync('img')
            } else {
                img = res.avtor
            }
            that.setData({
                img: img,
                nickName: res.name,
                identity: res.gradeName,
                Superior: res.shareName
            })
        })
    }
})