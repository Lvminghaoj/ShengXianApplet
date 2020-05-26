import { apiObj } from '../../api/api'
import { postData } from '../../utils/https'
Page({
    data: {
        tradeName: '越南火龙果"保鲜""高质"', //商品名称
        prurl: [],
        searchLength: [],
        searchWords: '', // 搜索内容
        show: false, // 控制搜索内容清空
        heightWindow: 0,
        // showTwo: true,
        // showThree: false,
        isok: 0,
        carNumber: 0,
        items: [], // 渲染的list
        words: '',
        computWordsLeaungth: false, //控制到底之后
        scrollTop: -1,
        inputShowisOK: false, // 控制是通过小类进来还是搜索框进入
    },
    //事件处理函数

    onLoad: function(options) {
        var that = this;
        if (options.id == 1) {
            wx.setNavigationBarTitle({
                title: options.words
            })
            that.indexLoginWordsDetail(options.words)
            that.setData({
                show: true,
                // showThree: false,
                // showTwo: false,
                searchWords: options.words,
                words: options.words,
                inputShowisOK: true,
            })
        }
        // that.getshopSearchHistory(); //  历史记录的查询
        that.getHeight(); // 获取当前手机的高度
        that.carNumberRequst(); // 获取购物车的数量

    },
    scrolltoupper: function(e) {
        console.log(e)
        let that = this;
        if (e.detail.scrollTop > 300) {
            that.setData({
                goTop: '3%',
            });
        } else {
            that.setData({
                goTop: '-30%',
            })
        }
    },
    goTop: function(e) { // 一键回到顶部
        let that = this;
        console.log(111)
        if (wx.pageScrollTo) {
            that.setData({
                scrollTop: 0
            })
        } else {
            wx.showModal({
                title: '提示',
                content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
            })
        }
    },
    bindKeyInput(e) {
        // 绑定搜索内容
        let that = this;
        that.setData({
            searchWords: e.detail.value,
        })
        that.setData({
            items: []
        })
        postData(apiObj.shopLists, { max: 10, min: 0, name: e.detail.value, phone: wx.getStorageSync('phone') }, res => {
            console.log(res)
            var array = new Array();
            for (let i = 0; i < res.length; i++) {
                if (res[i].couponTypeName == undefined || res[i].couponTypeName == '' || res[i].couponTypeName == null) {
                    var obj = {
                        name: res[i].name,
                        code: res[i].code,
                        img: res[i].img1,
                        productNum: res[i].productNum, //库存
                        marketPrice: res[i].marketPrice, // 原价
                        salePrice: res[i].salePrice, // 现价
                        bizTypeName: res[i].bizTypeName,
                        couponTypeName: 1,
                        expressFlag: res[i].expressFlag,
                    }
                    array.push(obj)
                } else { // 有活动的
                    var obj = {
                        name: res[i].name,
                        code: res[i].code,
                        img: res[i].img1,
                        productNum: res[i].productNum, //库存
                        marketPrice: res[i].marketPrice, // 原价
                        salePrice: res[i].salePrice, // 现价
                        bizTypeName: res[i].bizTypeName,
                        couponTypeName: res[i].couponTypeName,
                        expressFlag: res[i].expressFlag,
                    }
                    array.push(obj)
                }
            }
            that.setData({
                items: array,
                show: true
            })
        }, res => {
            console.log(res);
            wx.showToast({
                title: '暂无数据',
                icon: 'none',
                duration: 2000
            })
        })
        if (e.detail.value == "") {
            that.setData({
                // showTwo: true,
                // showThree: false,
                showDel: false,
                show: false
            })
        } else {
            that.setData({
                // showTwo: false,
                // showThree: true,
                showDel: true,
                show: false
            })
        }
    },
    indexLoginWordsDetail(words) {
        let that = this;
        postData(apiObj.shopLists, { max: 10, min: 0, name: words, phone: wx.getStorageSync('phone') }, res => {
            console.log(res)
            var array = new Array();
            for (let i = 0; i < res.length; i++) {
                if (res[i].couponTypeName == undefined || res[i].couponTypeName == '' || res[i].couponTypeName == null) {
                    var obj = {
                        name: res[i].name,
                        code: res[i].code,
                        img: res[i].img1,
                        productNum: res[i].productNum, //库存
                        marketPrice: res[i].marketPrice, // 原价
                        salePrice: res[i].salePrice, // 现价
                        bizTypeName: res[i].bizTypeName,
                        couponTypeName: 1,
                        expressFlag: res[i].expressFlag,

                    }
                    array.push(obj)
                } else { // 有活动的
                    var obj = {
                        name: res[i].name,
                        code: res[i].code,
                        img: res[i].img1,
                        productNum: res[i].productNum, //库存
                        marketPrice: res[i].marketPrice, // 原价
                        salePrice: res[i].salePrice, // 现价
                        bizTypeName: res[i].bizTypeName,
                        couponTypeName: res[i].couponTypeName,
                        expressFlag: res[i].expressFlag,
                    }
                    array.push(obj)
                }
            }
            that.setData({
                items: array
            })
        }, res => {
            console.log(res)
            wx.showToast({
                title: '暂无数据',
                icon: 'none',
                duration: 2000
            })
        })
    },
    tapWordsData() {
        // 点击搜索出来的内容
        let that = this;
        that.setData({
            show: true,
            // showThree: false
        })
    },
    // bindKeyTap() {
    //     // 点击搜索框的时候
    //     let that = this;
    //     if (that.data.searchWords == '' || that.data.searchWords == null || that.data.searchWords == undefined) {
    //         that.setData({
    //             // showTwo: true,
    //             // showThree: false,
    //             show: false
    //         })
    //     } else {
    //         that.setData({
    //             // showTwo: false,
    //             // showThree: true,
    //             show: false
    //         })
    //     }
    // },
    tapDelect(e) {
        // 点击清空搜索框内容
        let that = this;
        that.setData({
            searchWords: '',
            show: false,
            // showTwo: true,
            // showThree: false
        })
    },
    getHeight: function() { //获取当前高度
        var that = this;
        let systemInfo = wx.getSystemInfoSync(); // 当前机型的总高度
        let pxToRpxScale = 750 / systemInfo.windowWidth; //px转换rpx的系数
        that.setData({
            heightWindow: systemInfo.windowHeight - 90 / pxToRpxScale
        })
    },
    keitShowSwitch(e) {
        // 点击跳详情页
        console.log(e)
        let code = e.currentTarget.dataset.code;
        let url = `../commodityDetails/commodityDetails?code=` + code;
        wx.navigateTo({
            url: url
        })
    },
    // getshopSearchHistory() {
    //     // 历史记录搜索
    //     let that = this;
    //     postData(apiObj.shopSearchHistory, { phone: wx.getStorageSync('phone') }, res => {
    //         console.log(res);
    //         var array = new Array();
    //         for (let i = 0; i < res.length; i++) {
    //             if (i < 6) {
    //                 array.push(res[i])
    //             }
    //         }
    //         that.setData({
    //             searchLength: array
    //         })
    //     }, res => {
    //         console.log(res);
    //         wx.showToast({
    //             title: '暂无历史搜索数据',
    //             icon: 'none',
    //             duration: 2000
    //         })
    //     })
    // },
    searchLength(e) {
        // 点击历史搜索内容
        let that = this;
        let index = e.currentTarget.dataset.index;
        that.setData({
            searchWords: that.data.searchLength[index]
        })
        postData(apiObj.shopLists, { name: that.data.searchWords, phone: wx.getStorageSync('phone') }, res => {
            console.log(res)
            var array = new Array();
            for (let i = 0; i < res.length; i++) {
                if (res[i].couponTypeName == undefined || res[i].couponTypeName == '' || res[i].couponTypeName == null) {
                    var obj = {
                        name: res[i].name,
                        code: res[i].code,
                        img: res[i].img1,
                        productNum: res[i].productNum, //库存
                        marketPrice: res[i].marketPrice, // 原价
                        salePrice: res[i].salePrice, // 现价
                        bizTypeName: res[i].bizTypeName,
                        couponTypeName: 1,
                        expressFlag: res[i].expressFlag,
                    }
                    array.push(obj)
                } else { // 有活动的
                    var obj = {
                        name: res[i].name,
                        code: res[i].code,
                        img: res[i].img1,
                        productNum: res[i].productNum, //库存
                        marketPrice: res[i].marketPrice, // 原价
                        salePrice: res[i].salePrice, // 现价
                        bizTypeName: res[i].bizTypeName,
                        couponTypeName: res[i].couponTypeName,
                        expressFlag: res[i].expressFlag,
                    }
                    array.push(obj)
                }
            }
            that.setData({
                items: array
            })
            console.log(that.data.items)
        }, res => {
            console.log(res)
            wx.showToast({
                title: '暂无数据',
                icon: 'none',
                duration: 2000
            })
        })
    },
    addCarDatalength(e) {
        // 点击＋号添加至购物车
        console.log(e)
        let that = this;
        let index = e.currentTarget.dataset.index;
        var timestamp = Date.parse(new Date());
        var isok = wx.getStorageSync('isOk');
        if (isok == undefined || isok == '' || isok == null || isok == 'null' || isok == 'undefined') {
            wx.showModal({
                title: `您尙未登录`,
                content: `是否前往登录`,
                success(res) {
                    if (res.confirm) {
                        let url = `../myPage/myPage`;
                        wx.switchTab({
                            url: url
                        })
                    }
                },
                fail: function() {
                    console.log('用户电脑点击了取消')
                }
            })
        } else {
            postData(apiObj.saveShoppingTrolley, {
                "tradeName": `${that.data.items[index].name}`, //商品名称
                "money": `${that.data.items[index].salePrice}`, // 购买金额
                "goodsImg": `${that.data.items[index].img}`, // 商品图片
                "index": `${timestamp / 1000}`, // 标识
                "phone": `${wx.getStorageSync('phone')}`,
                "num": "1" // 数量
            }, (res) => {
                console.log(res);
                wx.showToast({
                    title: '添加成功',
                    icon: 'success',
                    duration: 2000
                });
                that.carNumberRequst();
            }, () => {
                console.log('data为空了咯')
            })
        }
    },
    carNumberRequst() { // 获取购物车的数量信息放至购物车icon
        let that = this;
        var carNumber = 0;
        postData(apiObj.queryShoppingTrolley, { "phone": `${wx.getStorageSync('phone')}` }, (res) => {
            carNumber = res.length
            wx.setStorageSync('carNumber', carNumber);
            that.setData({
                carNumber: carNumber,
            })
        }, () => {
            console.log('data为空了咯');
            wx.setStorageSync('carNumber', carNumber);
            that.setData({
                carNumber: carNumber,
            })
        })
    },
    goToCarPage() { // 点击购物车icon 跳转
        let url = `../car/car`;
        wx.switchTab({
            url: url
        })
    },
    scrollTwo(e) {
        //下拉加载的
        console.log(1111)
        let that = this;
        var minnum = this.data.items.length;
        var maxnum = minnum * 1 + 10;
        that.getDataDetail(minnum, maxnum, that.data.searchWords)
    },
    getDataDetail(min, max, name) {
        let that = this;
        postData(apiObj.shopLists, { max: min, min: max, name: name, phone: wx.getStorageSync('phone') }, res => {
            console.log(res)
            var array = that.data.items;
            for (let i = 0; i < res.length; i++) {
                if (res[i].couponTypeName == undefined || res[i].couponTypeName == '' || res[i].couponTypeName == null) {
                    var obj = {
                        name: res[i].name,
                        code: res[i].code,
                        img: res[i].img1,
                        productNum: res[i].productNum, //库存
                        marketPrice: res[i].marketPrice, // 原价
                        salePrice: res[i].salePrice, // 现价
                        bizTypeName: res[i].bizTypeName,
                        couponTypeName: 1,
                        expressFlag: res[i].expressFlag,
                    }
                    array.push(obj)
                } else { // 有活动的
                    var obj = {
                        name: res[i].name,
                        code: res[i].code,
                        img: res[i].img1,
                        productNum: res[i].productNum, //库存
                        marketPrice: res[i].marketPrice, // 原价
                        salePrice: res[i].salePrice, // 现价
                        bizTypeName: res[i].bizTypeName,
                        couponTypeName: res[i].couponTypeName,
                        expressFlag: res[i].expressFlag,
                    }
                    array.push(obj)
                }
            }
            that.setData({
                items: array
            })
        }, res => {
            console.log(res);
            that.setData({
                computWordsLeaungth: true
            })
        })
    }
})