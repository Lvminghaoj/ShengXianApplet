//index.js
//获取应用实例
const app = getApp();
import { apiObj } from '../../api/api';
import { postData, newPostData } from '../../utils/https';
Page({
    data: {
        // 轮播图组件
        background: [],
        indicatorDots: true,
        vertical: false,
        autoplay: false,
        interval: 2000,
        duration: 500,
        // 短视频 
        videoIsok: true,
        danmuList: [], // 弹幕
        src: 'http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400', // 视频地址
        // 页面数据
        tradeName: '越南火龙果"保鲜""高质""超好吃""不买就浪费了""我一个做页面的都想吃"', //商品名称
        numberBuyers: '3.3', //购买人数
        money: '79.9',
        goodsImg: '',
        List: [{
                id: 1,
                img: ['../../images/index.png'],
                words: '首页'
            },
            {
                id: 2,
                img: ['../../images/Kefu.png'],
                words: '客服'
            },
            {
                id: 3,
                img: ['../../images/share.png'],
                words: '分享'
            }
        ],
        btnbottom: 0,
        btnBottoms: 0,
        iphoneX: wx.getStorageSync('isIphoneX'),
        show: false, // 控制点击分享按钮
        showModalStatus: false,
        animationDataTwo: '', // 下方点击分享出来的动画
        ShowList: [{ id: 1, img: ['../../images/shareTwo.png'], words: '发送给朋友' }, { id: 2, img: ['../../images/wechatMoments.png'], words: '生成分享大图' }],
        hidden: false,
        floorstatus: false, //判断滚动条是否到了显示按钮的位置
        scrollTop: -1,
        isokshowModal: 0, //控制滚动动画
        heightTop: 0,
        img: [],
        gradeName: true, // 查看是否是群主
        goodsList: [], // 转换为本地图片的地址
        itemGoods: [], // 详情的前3张图片
        indexImg: 0,

    },
    //事件处理函数

    onLoad: function(options) {
        let that = this;
        that.shopDetail(options.code); //获取详情信息
    },
    onShow() {
        var that = this;
        that.getHeight(); // 获取高度

    },
    scrolltoupper: function(e) {
        console.log(e)
        let that = this;
        if (e.detail.scrollTop > 300) {
            that.setData({
                goTop: '83%',
                carTop: '76%'
            });
        } else {
            that.setData({
                goTop: '91%',
                carTop: '83%'
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
    goTocarPage() { // 点击跳转到购物车页面
        wx.switchTab({
            url: '../car/car'
        })
    },
    getHeight() {
        // 获取底部固定盒子的高度
        let that = this;
        let systemInfo = wx.getSystemInfoSync(); // 当前机型的总高度
        let pxToRpxScale = 750 / systemInfo.windowWidth; //px转换rpx的系数
        console.log(systemInfo);
        let iphoneX = that.data.iphoneX;
        if (iphoneX != null || iphoneX != '' || iphoneX != undefined) {
            if (iphoneX == true) {
                that.setData({
                    btnbottom: (75 + 68) / pxToRpxScale,
                    btnBottoms: 68 / pxToRpxScale,
                    heightTop: systemInfo.windowHeight,
                    heightTopTwo: 166 / pxToRpxScale
                })
            } else {
                that.setData({
                    btnbottom: 75 / pxToRpxScale + 10,
                    heightTop: systemInfo.windowHeight,
                    heightTopTwo: 120 / pxToRpxScale
                })
            }
        }
    },
    taplistCar: function() {
        //加入购物车事件
        let isok = wx.getStorageSync('isOk');
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
            let that = this;
            var timestamp = Date.parse(new Date());
            postData(apiObj.saveShoppingTrolley, {
                "tradeName": `${that.data.tradeName}`, //商品名称
                "money": `${that.data.money}`, // 购买金额
                "goodsImg": `${that.data.goodsImg}`, // 商品图片
                "index": `${timestamp / 1000}`, // 标识
                "phone": `${wx.getStorageSync('phone')}`,
                "num": "1", // 数量
                "expressFlag": `${that.data.expressFlag}` // 是否包邮 0是包邮 1是不包邮
            }, (res) => {
                console.log(res);
                wx.showToast({
                    title: '添加成功',
                    icon: 'success',
                    duration: 2000
                });
            }, () => {
                console.log('data为空了咯')
            })
        }

    },
    purchase: function() {
        //立即购买事件
        let that = this;
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
                "tradeName": `${that.data.tradeName}`, //商品名称
                "money": `${that.data.money}`, // 购买金额
                "goodsImg": `${that.data.goodsImg}`, // 商品图片
                "index": `${timestamp / 1000}`, // 标识
                "phone": `${wx.getStorageSync('phone')}`,
                "num": "1", // 数量
                "addWxPayment": "1",
                "expressFlag": `${that.data.expressFlag}` // 是否包邮 0是包邮 1是不包邮
            }, (res) => {
                console.log(res);
                let url = `../confirmOrder/confirmOrder`;
                wx.navigateTo({
                    url: url
                })
            }, () => {
                console.log('data为空了咯')
            })
        }
    },
    taponClick: function(e) {
        var id = e.currentTarget.dataset.id; //点击的按钮id   1是首页  2是购物车 
        let that = this;
        console.log(id)
        if (id != '' || id != undefined || id != null) {
            if (id == 1) {
                let url = `../index/index`;
                wx.switchTab({
                    url: url
                })
            } else if (id == 2) {
                console.log(11)
                let url = `../Customer/Customer`;
                wx.navigateTo({
                    url: url
                })

            } else {
                that.setData({
                    show: true,
                    showModalStatus: true
                })
            }
        }
    },
    Btn(res) { // 点击分享
        console.log(res)
        if (res.from === 'button') {

        }
        return {
            title: "",
            path: 'pages/commodityDetails/commodityDetails'
        }
    },
    showModal: function() { // 底部弹层控制
        // 显示遮罩层
        var animation = wx.createAnimation({
            duration: 500,
            timingFunction: "linear",
            delay: 0
        })
        this.animation = animation
        animation.translateX(200).step()
        this.setData({
            animationData: animation.export(),
        });
        setTimeout(function() {
            animation.translateX(0).step()
            this.setData({
                animationData: animation.export()
            })
        }.bind(this), 100)
    },
    showModalThree: function() { // 底部弹层控制
        // 显示遮罩层
        var animation = wx.createAnimation({
            duration: 500,
            timingFunction: "linear",
            delay: 0
        })
        this.animation = animation
        animation.translateY(200).step()
        this.setData({
            animationDataTwo: animation.export(),
        });
        setTimeout(function() {
            animation.translateY(0).step()
            this.setData({
                animationDataTwo: animation.export()
            })
        }.bind(this), 200)
    },
    hideModal: function() { // 触摸盒子的其他部分隐藏
        this.setData({
            showModalStatus: false,
        })
    },

    CanvasHold(e) { // 点击分享按钮的两个选项
        let that = this;
        var id = e.currentTarget.dataset.id; //点击的按钮id   1是首页  2是购物车 
        if (id == 2) {
            that.share();

        } else {
            console.log('用户点击了发送给朋友')
        }
    },
    share: function() { // 生成分享大图
        wx.showLoading({ title: '正在生成大图', mask: 'true' })
        var that = this;
        // var imgs = 'http://tmp/wx3090e0a1fc278afb.o6zAJs8k3S5EIdL4pR5gPfMSHJFU.zBC1dDG8vKbg296d5adf1fb260513041effbe7f0226d.jpeg';

        // console.log(that.data.img)
        wx.getSystemInfo({
            success: function(res) {
                console.log(res.windowHeight)
                console.log(res.windowWidth)
                that.setData({
                    windowHeight: res.windowHeight,
                    windowWidth: res.windowWidth
                })
            },
        })
        var windowWidth = that.data.windowWidth;
        var windowHeight = that.data.windowHeight;


        const ctx = wx.createCanvasContext('myCanvas')
            // 设置矩形边框
            // ctx.setStrokeStyle('#fff')
            //     // 设置矩形宽高
            // ctx.strokeRect(0, 0, 400, 200)
        ctx.drawImage('../../images/black.jpg', 0, (windowHeight - 600) / 2, windowWidth, 600)
            //背景图片
        ctx.drawImage('../../images/timg.png', 0, (windowHeight - 600) / 2, windowWidth, 600)

        // 设置文字大小
        ctx.setFontSize(16)
            // 设置文字颜色
        ctx.fillStyle = '#666666';
        var str = `① 保存图片到相册`
        ctx.fillText(str, (windowWidth - ctx.measureText(str).width) / 2 + 30, windowHeight / 2 + 185)
        var strTwo = '② 打开微信-“扫一扫'
        ctx.fillText(strTwo, (windowWidth - ctx.measureText(str).width) / 2 + 30, windowHeight / 2 + 210)
        var strThree = '③ 识别小程序，分享成功'
        ctx.fillText(strThree, (windowWidth - ctx.measureText(str).width) / 2 + 30, windowHeight / 2 + 235)

        // var cover = '../../images/goods.jpg';
        var cover = that.data.goodsList[0];
        console.log(that.data.goodsList);
        // 顶层图片
        ctx.drawImage(cover, (windowWidth - 360) / 2, (windowHeight - 600) / 2 + 20, 360, 200);
        var cover = that.data.goodsList[1];
        // var cover = '../../images/goods.jpg';
        // 二层左图片
        ctx.drawImage(cover, windowWidth / 2 - 180, (windowHeight - 600) / 2 + 230, 175, 120);
        var cover = that.data.goodsList[2];
        // var cover = '../../images/goods.jpg';
        // 二层右图片
        ctx.drawImage(cover, windowWidth / 2 + 10, (windowHeight - 600) / 2 + 230, 175, 120);

        // 设置文字大小
        ctx.setFontSize(20)
        ctx.fillStyle = 'rgba(102,102,102,1)';

        var name = that.data.tradeName;
        if (name.length > 14) {
            var res = name.slice(0, 14);
            ctx.fillText(res, (windowWidth - 340) / 2, (windowHeight - 600) / 2 + 385)
            var Res = name.slice(14, name.length);
            if (Res.length > 10) {
                var data = Res.slice(0, 10) + ' ......'
                ctx.fillText(data, (windowWidth - 340) / 2, (windowHeight - 600) / 2 + 415)
            }
        } else {
            ctx.fillText(name, (windowWidth - 340) / 2, (windowHeight - 600) / 2 + 405)
        }
        if (that.data.money >= 100) {
            console.log(11111)
            ctx.setFontSize(18)
            ctx.fillStyle = '#FF0000';
            var Money = '¥';
            ctx.font = 'normal bold 16px sans-serif';
            ctx.fillText(Money, windowWidth - (windowWidth - 320), (windowHeight - 600) / 2 + 390)

            ctx.setFontSize(24)
            ctx.fillStyle = '#FF0000';
            var Price = that.data.money;
            ctx.font = 'normal bold 24px sans-serif';
            ctx.fillText(Price, windowWidth - (windowWidth - 330), (windowHeight - 600) / 2 + 390)
        } else {
            ctx.setFontSize(18)
            ctx.fillStyle = '#FF0000';
            var Money = '¥';
            ctx.font = 'normal bold 16px sans-serif';
            ctx.fillText(Money, windowWidth - (windowWidth - 340), (windowHeight - 600) / 2 + 390)

            ctx.setFontSize(24)
            ctx.fillStyle = '#FF0000';
            var Price = that.data.money;
            ctx.font = 'normal bold 24px sans-serif';
            ctx.fillText(Price, windowWidth - (windowWidth - 350), (windowHeight - 600) / 2 + 390)
        }

        // 小程序二维码
        var qrcode = '../../images/KeepImg.png'
        ctx.drawImage(qrcode, windowWidth / 2 - 165, (windowHeight - 600) / 2 + 460, 100, 100)

        ctx.draw(false, function() {
            wx.canvasToTempFilePath({
                canvasId: 'myCanvas',
                success: function(res) {
                    console.log(res.tempFilePath)
                    setTimeout(function() {
                        that.setData({
                            prurl: res.tempFilePath,
                            showModalStatus: false,
                            hidden: true
                        })
                        wx.hideLoading()
                    }, 1000)
                }
            })
        });
    },
    save: function() {
        var that = this
        wx.saveImageToPhotosAlbum({
            filePath: that.data.prurl,
            success(res) {
                wx.showModal({
                    content: '图片已保存到相册，赶紧晒一下吧~',
                    showCancel: false,
                    confirmText: '好的',
                    confirmColor: '#333',
                    success: function(res) {
                        if (res.confirm) {
                            console.log('用户点击确定');
                            /* 该隐藏的隐藏 */
                            that.setData({
                                hidden: false
                            })
                        }
                    }
                })
            }
        })
    },
    cancelBit() { // 点击取消按钮
        let that = this;
        that.setData({
            showModalStatus: false
        })
    },
    cancel() {
        let that = this;
        that.setData({
            hidden: false
        })
    },
    shopDetail(code) {
        let that = this;
        postData(apiObj.shopDetail, { code: code }, (res) => {
            console.log(res);
            var item = [];
            var background = [];
            var videoSrc = that.data.src;
            if (res.videoSrc == undefined || res.videoSrc == "" || res.videoSrc == null) {
                videoSrc = that.data.src;
            } else {
                videoSrc = res.videoSrc
            }
            // 根据图片的大小来放入详情页面中 获取高度放入
            that.getImagesHeight(res.img3, (res) => {
                that.setData({
                    heightImgThree: res.height
                })
            })
            that.getImagesHeight(res.img4, (res) => {
                that.setData({
                    heightImgFour: res.height
                })
            })
            that.getImagesHeight(res.img5, (res) => {
                that.setData({
                    heightImgFive: res.height
                })
            })
            that.getImagesHeight(res.img6, (res) => {
                that.setData({
                    heightImgSix: res.height
                })
            })
            that.getImagesHeight(res.img7, (res) => {
                that.setData({
                    heightImgSeven: res.height
                })
            })
            console.log(res.img7)
            that.setData({
                tradeName: res.name,
                numberBuyers: 3.3,
                money: res.salePrice,
                moneys: res.marketPrice,
                goodsImg: res.img1,
                goodImgTwo: res.img2,
                goodImgThree: res.img3,
                goodImgFour: res.img4,
                goodImgFive: res.img5,
                goodImgSix: res.img6,
                goodImgSeven: res.img7,
                src: videoSrc,
                expressFlag: res.expressFlag,
                bizTypeName: res.bizTypeName
            });
            if (res.img1 != '' || res.img1 != undefined) {
                item.push(res.img1);
                background.push(res.img1);
                console.log(res.img1)
            }
            if (res.img2 != '' || res.img2 != undefined) {
                item.push(res.img2);
                background.push(res.img2);
            }
            that.setData({
                itemGoods: item,
                background: background
            })
            that.getInfoImg();
        }, (res) => {
            console.log('data为空了咯');
        });
    },
    getInfoImg(index) {
        let that = this;
        var index = that.data.indexImg;
        if (that.data.itemGoods.length > index) {
            console.log(index)
            var gooditems = that.data.goodsList;
            console.log(that.data.itemGoods[index])
            wx.getImageInfo({
                src: that.data.itemGoods[index],
                success(res) {
                    console.log(res)
                    var img = res.path
                    index++;
                    that.data.goodsList.push(img);
                    that.setData({
                        goodsList: gooditems,
                        indexImg: index
                    })
                    console.log(that.data.goodsList)
                    that.getInfoImg();
                }
            })
        }
    },
    previewImage(e) {
        console.log(e)
        let that = this;
        let id = e.currentTarget.dataset.id;
        var img;
        if (id == 2) {
            img = that.data.goodImgTwo
        } else if (id == 3) {
            img = that.data.goodImgThree
        } else if (id == 4) {
            img = that.data.goodImgFour
        } else if (id == 5) {
            img = that.data.goodImgFive
        } else if (id == 6) {
            img = that.data.goodImgSix
        } else if (id == 7) {
            img = that.data.goodImgSeven
        } else {
            img = that.data.goodsImg;
        }
        wx.previewImage({
            urls: [img],
            current: img,
            fail(e) {
                console.log(e)
            }
        })
    },
    getImagesHeight(src, suc) {
        let that = this;
        wx.getImageInfo({
            src: src,
            success(res) {
                console.log(res.width)
                console.log(res.height)
                suc(res)
            },
            fail(res) {
                console.log(res)
            }
        })
    }

})