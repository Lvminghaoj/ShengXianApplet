//index.js
//获取应用实例
import { apiObj } from '../../api/api'
import { postData, getData } from '../../utils/https'
Page({
    data: {
        items: [
            { name: 'Complaint', value: '投诉', checked: 'true' },
            { name: 'proposal', value: '建议' },
        ],
        EngineeringName: '',
        cursor: 0,
        checked: '',
        isok: 0
    },
    //事件处理函数

    onLoad: function(optiacy) {
        var isok = wx.getStorageSync('isOk')
        let that = this;
        if (isok == 1) {
            that.setData({
                isok: 1
            })
        }
        console.log(that.data.isok)
    },
    Engineering(e) {
        // 监听文本域
        console.log(e)
        let that = this;
        that.setData({
            EngineeringName: e.detail.value,
            cursor: e.detail.cursor
        })
    },
    radioChange(e) {
        console.log(e)
            // 点击切换radio
        let that = this;
        if (e.detail.value == "proposal") {
            that.setData({
                checked: '建议'
            })
        } else {
            that.setData({
                checked: '投诉'
            })
        }
    },
    btnAddData() {
        // 点击提交
        let that = this;
        console.log(that.data.isok)
        if (that.data.isok == 0) {
            wx.showToast({ title: '您尚未登录', icon: 'none', duration: 2000 })
            return
        }
        var feType = that.data.checked;
        if (feType == '' || feType == undefined || feType == null || feType == 'undefined') {
            feType = '投诉'
        }
        if (that.data.EngineeringName == null || that.data.EngineeringName == '' || that.data.EngineeringName == undefined || that.data.EngineeringName == 'undefined') {
            wx.showToast({ title: '请填写内容', icon: 'none' });
            return;
        }
        postData(apiObj.feedback, {
            phone: wx.getStorageSync('phone'),
            feType: feType,
            detail: that.data.EngineeringName
        }, (res) => {
            console.log(res)
        }, (res) => { // 成功
            console.log(res)
            if (res.code == 200) {
                wx.navigateBack({
                    delta: 1
                });
                wx.showToast({ title: '提交成功', icon: 'none', duration: 2000 })
            }
        })
    }
})