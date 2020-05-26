// tabBarComponent/tabBar.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        tabbar: {
            type: Object,
            value: {
                "selectedColor": "#FF9702",
                "borderStyle": "white",
                "color": "#D0D0D0",
                "list": [{
                        "pagePath": "pages/index/index",
                        "text": "首页",
                        "iconPath": "icon/indexOne.png",
                        "selectedIconPath": "icon/indexTwo.png"
                    },
                    {
                        "pagePath": "pages/car/car",
                        "text": "购物车",
                        "iconPath": "icon/carOne.png",
                        "selectedIconPath": "icon/carTwo.png"
                    },
                    {
                        "pagePath": "pages/myPage/myPage",
                        "text": "我的",
                        "iconPath": "icon/meOne.png",
                        "selectedIconPath": "icon/meTwo.png"
                    }
                ]
            }
        },
        text: {
            type: Number,
            value: '',
            observer: function(newVal, oldVal) {
                console.log(newVal)
                console.log(oldVal)
                var that = this;
                that.setData({
                    userid: newVal
                })
            }
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        userid: 0,
        isIphoneX: wx.getStorageSync('isIphoneX')
    },

    /**
     * 组件的方法列表
     */
    methods: {},
})