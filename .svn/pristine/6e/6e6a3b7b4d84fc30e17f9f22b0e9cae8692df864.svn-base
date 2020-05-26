import { apiObj } from '../../api/api'
import { getData, postData } from '../../utils/https'
Page({
    data: {
        tradeName: '越南火龙果"保鲜""高质"', //商品名称
        prurl: [],
        searchLength: ['红枣', '恩德呃呃呃呃呃呃', '内存嗯嗯嗯条', 'NiuZaiMaxKu', '最长的❀'],
        searchWords: '', // 搜索内容
        show: false, // 控制搜索内容清空
    },
    //事件处理函数

    onLoad: function(options) {
        var that = this;

    },
    bindKeyInput(e) {
        let that = this;
        that.setData({
            searchWords: e.detail.value,
            show: true
        })
        if (e.detail.value == "") {
            that.setData({
                show: false
            })
        }
    },
    tapDelect(e) {
        console.log(1111)
        let that = this;
        that.setData({
            searchWords: '',
            show: false
        })
    },
    ModelTap(e) {
        wx.navigateBack({
            delta: 1
        })
    }
})