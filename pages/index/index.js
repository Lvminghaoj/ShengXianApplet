//index.js
//获取应用实例
const app = getApp()
import { apiObj } from '../../api/api'
import { postData } from '../../utils/https'
Page({
    data: {
        tabbar: {},
        size: 14,
        interval: 20, // 时间间隔
        textBottom: '立即登录',
        textTop: "2栋102老冯",
        searchValue: '商品搜索', // 输入框的placeholder
        textimg: ['../../images/weilogin.jpg'],
        FansNum: 0, //粉丝数量
        OrderNum: 0, // 订单数量
        currentTab: 0,
        heightWindow: 0,
        index: 0,
        words: true, // 控制输入框的icon
        MoreImg: ['../../images/More.png'],
        top: 0,
        owners: true, //群主和非群主判断 true是群主
        carNumber: 0,
        floorstatus: false,
        dataNum: [],
        goodsList: [],
        fullDiscount: [],
        fullNums: 0, //超级优惠菜单索引
        Honey: false, // 选择超级优惠的开关
        phenylLiss: [],
        swiperName: '',
        searchWords: true, // 搜索框没内容时显示
        bannerImg: '', // 全部优惠广告栏图片地址
        bannerImgIsok: true, // 控制全部优惠广告栏是否显示
        firstOnlaunch: 0, // 登记是否为第一次登陆
        computWordsLeaungth: false, // 是否已经请求到底部
    },
    //事件处理函数
    onLoad: function(options) {},
    onShow: function() {
        let that = this;
        let carnumber = wx.getStorageSync('carNumber');
        let fsOrder = wx.getStorageSync('fsOrder');
        let fsNum = wx.getStorageSync('fsNum');
        let isOk = wx.getStorageSync('isOk');
        let gradeName = wx.getStorageSync('gradeName');
        if (gradeName == '群主') {
            that.setData({
                owners: true
            })
        } else {
            that.setData({
                owners: false,
            })
        }
        if (isOk == null || isOk == '' || isOk == undefined) {
            that.setData({
                isOk: true
            })
        } else {
            that.setData({
                isOk: false,
                textTop: wx.getStorageSync('name'),
                textBottom: '做个实惠的社群',
                textimg: wx.getStorageSync('img')
            })
        }
        if (carnumber == null || carnumber == '' || carnumber == undefined) {

        } else {
            that.setData({
                carNumber: carnumber
            })
        }
        if (fsOrder == null || fsOrder == '' || fsOrder == undefined) {

        } else {
            that.setData({
                OrderNum: fsOrder
            })
        }
        if (fsNum == null || fsNum == '' || fsNum == undefined) {

        } else {
            that.setData({
                FansNum: fsNum
            })
        }
        app.editTabbar(); // 自定义菜单执行方法
        that.getHeight();
        that.menu3(); //获取三大菜单
        that.myOrderList(); //全部优惠的第一类菜单
    },

    onReady: function() {
        wx.hideTabBar({
            fail: function() {
                setTimeout(function() {
                    wx.hideTabBar()
                }, 500)
            }
        });
    },
    scrollTwo(e) {
        //下拉加载的
        let that = this;
        console.log(e.target.dataset.current, 1111111);
        var minnum = this.data.goodsList.length;
        var maxnum = minnum * 1 + 10;
        that.postDataScroll(minnum, maxnum, that.data.dataNum[that.data.currentTab].code)
    },
    postDataScroll(num, Num, currentTab) {
        // that.data.dataNum[that.data.currentTab].code
        let that = this;
        let goodlist = this.data.goodsList;
        postData(apiObj.shopLists, { minSize: num, maxSize: Num, bizTypeCode: currentTab }, (res) => {
            console.log(res)
            for (let i = 0; i < res.length; i++) {
                var obj = {
                    img: res[i].img1,
                    data: res[i].name, //商品名称
                    surplusNum: res[i].productNum, //库存
                    money: res[i].salePrice, //销售价
                    nderlineNum: res[i].marketPrice, // 原价
                    code: res[i].code,
                    Img: res[i].friendBuyList,
                    ImgList: 0
                }
                goodlist.push(obj)
            }
            that.setData({
                goodsList: goodlist
            })
        }, res => {
            that.setData({
                goodsList: goodlist,
                computWordsLeaungth: true
            })

        })

    },
    focusFn: function(e) {
        this.setData({
            searchValue: ''
        })
    },
    blurFn: function(e) {
        this.setData({
            searchValue: '商品搜索'
        })
    },
    swichNav: function(e) {
        // 这里是头部三大菜单的点击事件
        var that = this;
        console.log(e)
        if (this.data.currentTab === e.target.dataset.current) {
            return false;
        } else {
            that.setData({
                currentTab: e.target.dataset.current,
            })
        }
        if (e.target.dataset.current == 1) {
            that.setData({
                Honey: true,
                swiperName: e.target.dataset.words
            })
        } else {
            that.setData({
                Honey: false,
                swiperName: e.target.dataset.words
            })
        }
        // that.shopLists(0, 10, that.data.dataNum[that.data.currentTab].code)
    },
    Tapfullount: function(e) {
        // 这里是全部优惠左边的点击切换事件  点击请求获取数据
        let that = this;
        if (that.data.fullNums == e.target.dataset.id) {
            return false;
        } else {
            that.setData({
                fullNums: e.target.dataset.id
            })
            that.myOrderListTwo(e.target.dataset.code); // 点击获取code去拿二类数据
        }
    },
    getHeight: function() { //获取当前高度
        var that = this;
        let systemInfo = wx.getSystemInfoSync(); // 当前机型的总高度
        let pxToRpxScale = 750 / systemInfo.windowWidth; //px转换rpx的系数
        let iphoneX = wx.getStorageSync('isIphoneX');
        var heightWindow;
        console.log(systemInfo)
        if (iphoneX != null || iphoneX != '' || iphoneX != undefined) {
            if (iphoneX == true) {
                that.setData({
                    // 164 是 底部tabbar和margin的66
                    heightWindow: systemInfo.screenHeight - 440 / pxToRpxScale - 170
                })
                console.log(that.data.heightWindow)
            } else {
                that.setData({
                    heightWindow: systemInfo.screenHeight - 440 / pxToRpxScale - 98 - systemInfo.statusBarHeight
                })
            }
        }
        console.log('高度', that.data.heightWindow)

    },
    bindKeyInput: function(e) {
        // 输入框选择
        // let that = this;
        // if (e.detail.value == "") {
        //     that.setData({
        //         searchWords: true,
        //     })
        // } else {
        //     that.setData({
        //         searchWords: false,
        //     })
        // }
        // var item = new Array();
        // postData(apiObj.shopLists, { name: e.detail.value, phone: wx.getStorageSync('phone') }, res => {
        //     console.log(res)
        //     for (let i = 0; i < res.length; i++) {
        //         var obj = {
        //             img: res[i].img1,
        //             data: res[i].name, //商品名称
        //             surplusNum: res[i].productNum, //库存
        //             money: res[i].salePrice, //销售价
        //             nderlineNum: res[i].marketPrice, // 原价
        //             code: res[i].code,
        //             Img: res[i].friendBuyList,
        //             ImgList: 0
        //         }
        //         item.push(obj)
        //     }
        //     that.setData({
        //         goodsList: item,
        //     })
        // }, res => {
        //     console.log(res)
        // })
        let url = `../search/search`;
        wx.navigateTo({
            url: url
        })
    },
    TapShowFriend: function() {
        //我的好友购买了此商品
    },
    tapBindJump: function(e) {
        // 点击跳转详情
        let code = e.currentTarget.dataset.code;
        let url = `../commodityDetails/commodityDetails?code=` + code;
        wx.navigateTo({
            url: url
        })
    },
    SwiperLissClick: function(e) {
        // 点击第三类菜单跳转详情
        let code = e.currentTarget.dataset.code;
        let url = `../commodityDetails/commodityDetails?code=` + code;
        wx.navigateTo({
            url: url
        })

    },
    swiperChange: function(e) {
        // 监听swiper滑动
        let that = this;
        console.log(e)
        console.log(that.data.swiperName)
        if (e.detail.source == 'touch') {
            if (that.data.currentTab == e.detail.current) {
                return false;
            } else {
                that.setData({
                    currentTab: e.detail.current,
                })
            }
            if (that.data.currentTab == 1) {
                that.setData({
                    Honey: true
                })
            } else {
                that.setData({
                    Honey: false
                })
            }
        }
        that.shopLists(0, 10, that.data.dataNum[e.detail.current].code); //请求商品列表
    },
    bindrefresherrefresh: function(e) {
        let that = this;
        console.log(e);
        that.setData({
            top: e.detail.scrollTop
        })
    },
    shopLists(minNum, maxNum, code) {
        // 获取商品列表
        let that = this;
        that.setData({
                goodsList: [],
            })
            // 根据bizTypeCode来返回
        let item = []; // 三大菜单第一个
        postData(apiObj.shopLists, { minSize: minNum, maxSize: maxNum, bizTypeCode: code }, (res) => {
            console.log(res)

            for (let i = 0; i < res.length; i++) {
                if (res[i].friendBuyList == undefined || res[i].friendBuyList == null || res[i].friendBuyList == '') {
                    var obj = {
                        img: res[i].img1,
                        data: res[i].name, //商品名称
                        surplusNum: res[i].productNum, //库存
                        money: res[i].salePrice, //销售价
                        nderlineNum: res[i].marketPrice, // 原价
                        code: res[i].code,
                        Img: res[i].friendBuyList,
                        ImgList: 0
                    }
                    item.push(obj)
                } else {
                    var obj = {
                        img: res[i].img1,
                        data: res[i].name, //商品名称
                        surplusNum: res[i].productNum, //库存
                        money: res[i].salePrice, //销售价
                        nderlineNum: res[i].marketPrice, // 原价
                        code: res[i].code,
                        Img: res[i].friendBuyList,
                        ImgList: 1
                    }
                    item.push(obj)
                }
            }
            console.log(item)
            that.setData({
                goodsList: item,
            })
        }, res => {
            console.log(res)
            that.setData({
                goodsList: item,
            })
        })
    },
    menu3() { //三大菜单
        let that = this;
        postData(apiObj.menu3, {}, (res) => {
            console.log(res)
            let item = [];
            for (let i = 0; i < res.length; i++) {
                var obj = {
                    code: res[i].code,
                    words: res[i].name,
                    status: res[i].status,
                    id: i
                }
                item.push(obj);
            }

            that.setData({
                dataNum: item
            })
            that.shopLists(0, 10, item[that.data.currentTab].code); //请求商品列表
        }, () => {
            that.setData({
                dataNum: []
            })
        })
    },
    myOrderList() { // 获取全部优惠的第一类
        let that = this;
        postData(apiObj.leftMenu, { level: 1 }, (res) => { // 获取一类
            console.log(res)
            let itemOne = [];
            for (let i = 0; i < res.length; i++) {
                var obj = {
                    parentCode: res[i].code,
                    words: res[i].name,
                    banner: res[i].banner
                }
                itemOne.push(obj);
            }
            that.setData({
                fullDiscount: itemOne
            })
            that.myOrderListThree(that.data.fullDiscount[that.data.fullNums].parentCode); // 根据当前点击的一类菜单的下标获取

        }, () => {
            that.setData({
                fullDiscount: []
            })
        })
    },
    myOrderListTwo(parentCode) {
        // 全部优惠 ,, 根据一类菜单获取二类
        let that = this;
        var parentCode = parentCode;
        wx.showLoading({
            title: '加载中',
        })
        postData(apiObj.leftMenu, { parentCode: parentCode }, (res) => { // 获取二类
            console.log(res)
            let itemOne = [];
            setTimeout(function() {
                wx.hideLoading()
                for (let i = 0; i < res.length; i++) {
                    var obj = {
                        code: res[i].code,
                        words: res[i].name,
                        images: ['../../images/Honey.jpg'],
                        parentCode: res[i].parentCode
                    }
                    itemOne.push(obj);
                }
                var parentCodeTwo = res[0].parentCode;
                var fullDiscount = that.data.fullDiscount;
                for (let u = 0; u < fullDiscount.length; u++) {
                    if (parentCodeTwo == fullDiscount[u].parentCode) {
                        console.log(fullDiscount[u])
                        if (fullDiscount[u].banner == undefined || fullDiscount[u].banner == '' || fullDiscount[u].banner == null) {
                            that.setData({
                                bannerImgIsok: false
                            })
                        } else {
                            that.setData({
                                bannerImg: fullDiscount[u].banner
                            })
                        }
                    }
                }
                that.setData({
                    phenylLiss: itemOne
                })
            }, 500)
        }, () => {
            that.setData({
                phenylLiss: []
            })
        })
    },
    myOrderListThree(parentCode) {
        // 全部优惠 ,, 根据一类菜单获取二类
        let that = this;
        var parentCode = parentCode;
        postData(apiObj.leftMenu, { parentCode: parentCode }, (res) => { // 获取二类
            console.log(res)
            let itemOne = [];
            for (let i = 0; i < res.length; i++) {
                var obj = {
                    code: res[i].code,
                    words: res[i].name,
                    images: ['../../images/Honey.jpg'],
                    parentCode: res[i].parentCode
                }
                itemOne.push(obj);
            }
            var parentCodeTwo = res[0].parentCode;
            var fullDiscount = that.data.fullDiscount;
            for (let u = 0; u < fullDiscount.length; u++) {
                if (parentCodeTwo == fullDiscount[u].parentCode) {
                    console.log(fullDiscount[u])
                    if (fullDiscount[u].banner == undefined || fullDiscount[u].banner == '' || fullDiscount[u].banner == null) {
                        that.setData({
                            bannerImgIsok: false
                        })
                    } else {
                        that.setData({
                            bannerImg: fullDiscount[u].banner
                        })
                    }

                }
            }
            that.setData({
                phenylLiss: itemOne
            })

        }, () => {
            that.setData({
                phenylLiss: []
            })
        })
    },
    switchRouter() {
        // 跳转至登录
        wx.switchTab({
            url: '../myPage/myPage'
        })
    },
    custormRequterToGoodlist(e) { // 点击小项
        console.log(e)
        var code = e.currentTarget.dataset.code;
        var words = e.currentTarget.dataset.words;
        this.indexLoginWordsDetail(code, words)
    },
    indexLoginWordsDetail(code, words) { // 查询是否有数据
        postData(apiObj.searchProduct, { productCatatoryCode: code }, res => {
            console.log(res);
            // let url = `../search/search?words=${words}&id=1`;
            // wx.navigateTo({
            //     url: url
            // })
        }, res => {
            console.log(res)
            wx.showToast({
                title: `${words}暂无数据哦`,
                icon: 'none',
            })
        })
    },
})