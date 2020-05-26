//index.js
//获取应用实例
import { apiObj } from '../../api/api'
import { postData, getData } from '../../utils/https'
Page({
    data: {
        AchievementsWords: [],
        performanceNote: '业绩说明',
        groupOwnerList: [], //群主名称

    },
    //事件处理函数

    onLoad: function(optiacy) {

    },
    onShow() {
        let that = this;
        var isok = wx.getStorageSync('isOk')
        if (isok == 1) {
            that.postData(); // 请求业绩列表
            that.posiDataWords(); // 请求业绩数量 
        } else {
            wx.showToast({
                title: '您尚未登录',
                icon: 'none',
                duration: 2000
            })
        }
    },
    postData() {
        postData(apiObj.queryPerformance, { 'phone': wx.getStorageSync('phone') }, (res) => {
            let that = this;
            let item = [];
            for (let i = 0; i < res.length; i++) {
                var obj = {
                    name: res[i].name,
                    position: res[i].gradeName, // 职位
                    gradeCode: res[i].gradeCode, // 职位code
                    phone: res[i].phone,
                    id: i
                }
                item.push(obj)
            }
            that.setData({
                AchievementsWords: item
            })
        }, () => {
            let that = this;
            that.setData({
                AchievementsWords: []
            })
        })
    },
    posiDataWords() {
        postData(apiObj.queryPerformanceCount, { 'phone': wx.getStorageSync('phone') }, (res) => {
            console.log(res)
            let that = this;
            let item = [];
            let resList = res; // 截取判断是否为数组
            if (resList.length == undefined || resList.length == 'undefined') {
                resList = new Array(res);
                console.log(resList)
            }
            for (let i = 0; i < resList.length; i++) {
                var obj = {
                    gradeName: resList[i].gradeName,
                    num: resList[i].num
                }
                item.push(obj)
            }
            console.log(item)
            that.setData({
                groupOwnerList: item,
                performanceNote: '暂无业绩说明'
            })
        }, () => {
            let that = this;
            that.setData({
                groupOwnerList: [],
                performanceNote: '暂无业绩说明'
            })
        })
    }
})