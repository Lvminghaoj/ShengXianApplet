//index.js
//获取应用实例
const time = require("../../utils/util.js"); //根据自己项目的位置而定
import { apiObj } from '../../api/api'
import { postData } from '../../utils/https'
Page({
    data: {
        item: [],
        fansNumber: 0,
    },
    //事件处理函数

    onLoad: function(optiacy) {
        let that = this;
        var isok = wx.getStorageSync('isOk')
        if (isok == 1) {
            that.getDatas()
        } else {
            wx.showToast({
                title: '您尚未登录',
                icon: 'none',
                duration: 2000
            })
        }

    },
    getDatas() {
        // 发起请求获取数据
        let that = this;
        postData(apiObj.queryFans, { phone: wx.getStorageSync('phone') }, (res) => {
            console.log(res)
            let item = [];
            for (let i = 0; i < res.length; i++) {
                var obj = {
                    img: res[i].avtor,
                    time: time.formatTime(res[i].createDate, 'Y/M/D h:m:s'),
                    name: `**${res[i].name.slice(res[i].name.length - 1, res[i].name.length)}`
                }
                item.push(obj)
            }
            that.setData({
                item: item,
                fansNumber: item.length
            })
        }, res => {
            wx.showToast({ title: '您尚未拥有粉丝哦', icon: 'none' })
            return;
        })
    }
})