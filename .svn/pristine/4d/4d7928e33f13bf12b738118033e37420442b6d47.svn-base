const app = getApp();
import { apiObj } from '../../api/api';
import { postData } from '../../utils/https';
Page({
    data: {
        tabbar: {},
        items: [],
        color: "#FF9702",
        checked: false, // 控制全选按钮
        getHeightS: 0, // 自定义tabbar的弹起高度
        btnbottom: 0, // 底部购买按钮盒子弹起高度
        price: 0, // 总价
        carNumber: 0, // 购物车的数量
        ShowModel: false, // 查看购物车是否为空
    },
    onLoad: function(options) {},
    onShow: function() {
        let that = this;
        that.getData(); // 获取购物车数量
        that.getHeight();
        app.editTabbar();

    },

    getHeight() {
        // 获取底部两个固定定位盒子的高度
        let that = this;
        let systemInfo = wx.getSystemInfoSync(); // 当前机型的总高度
        let pxToRpxScale = 750 / systemInfo.windowWidth; //px转换rpx的系数
        let iphoneX = wx.getStorageSync('isIphoneX');
        if (iphoneX != null || iphoneX != '' || iphoneX != undefined) {
            console.log(iphoneX)
            if (iphoneX == true) {
                that.setData({
                    btnbottom: 164 / pxToRpxScale,
                    getHeightS: (85 + 98 + 68) / pxToRpxScale,
                })
            } else {
                that.setData({
                    btnbottom: 96 / pxToRpxScale,
                    getHeightS: (86 + 98) / pxToRpxScale,
                })
            }
        }
        // that.setData({
        //     btnbottom: 162 / pxToRpxScale,
        //     getHeightS: (70 + 162) / pxToRpxScale + 10,
        // })
    },
    radioChange: function(e) {
        // 商品的选择radio
        let that = this;
        let id = e.target.dataset.id;
        var dataItems = that.data.items;
        let price = 0;
        dataItems[id].checked = !dataItems[id].checked;
        // 算出合计
        for (let o = 0; o < dataItems.length; o++) {
            if (dataItems[o].checked == true) {
                price += dataItems[o].num * dataItems[o].money;
            }
        }
        that.setData({
            items: dataItems,
            price: price.toFixed(2),
        })
    },
    addNumber: function(e) {
        // 购物车的加
        let that = this;
        var id = e.target.dataset.id;
        var dataItems = that.data.items;
        let price = 0;
        dataItems[id - 1].num = dataItems[id - 1].num * 1 + 1;
        postData(apiObj.saveShoppingTrolley, {
            // 只要数据出来了只需要获取对应的标识id就可以 不用加入时候的id
            tradeName: dataItems[id - 1].tradeName,
            phone: wx.getStorageSync('phone'),
            checked: dataItems[id - 1].checked,
            money: dataItems[id - 1].money,
            goodsImg: dataItems[id - 1].goodsImg,
            IndexNum: id, // 我们使用的标识
            index: id, // 传的标识
            num: dataItems[id - 1].num, // 数量
            phone: wx.getStorageSync('phone'),
        }, (res) => {
            console.log(res)
        }, () => {
            console.log('data为空了咯')
        })
        for (let o = 0; o < dataItems.length; o++) {
            if (dataItems[o].checked == true) {
                price += dataItems[o].num * 1 * dataItems[o].money * 1
            }
        }
        that.setData({
            items: dataItems,
            price: price.toFixed(2),
        })
    },
    reduceNumber: function(e) {
        // 购物车的减
        let that = this;
        var id = e.target.dataset.id;
        var dataItems = that.data.items;
        var Index = e.target.dataset.index
        console.log(Index)
        let price = 0.00;
        if (dataItems[id - 1].num < 2) {
            wx.showModal({
                content: `您不要该宝贝了吗`,
                success(res) {
                    if (res.confirm) {
                        dataItems.splice(id - 1, 1);
                        postData(apiObj.delShoppingTrolley, { phone: wx.getStorageSync('phone'), index: id }, (res) => {
                            console.log(res)
                        }, () => {
                            console.log('data为空了咯')
                        })
                        price = 0.00;
                        for (let i = 0; i < dataItems.length; i++) {
                            if (dataItems[i].checked == true) {
                                price += dataItems[i].num * 1 * dataItems[i].money * 1
                            }
                        }
                        wx.setStorageSync('carNumber', dataItems.length)
                        that.setData({
                            items: dataItems,
                            price: price.toFixed(2),
                        })
                    }
                }
            })
        } else {
            dataItems[id - 1].num = dataItems[id - 1].num * 1 - 1;
            postData(apiObj.saveShoppingTrolley, {
                // 只要数据出来了只需要获取对应的标识id就可以 不用加入时候的id
                tradeName: dataItems[id - 1].tradeName,
                phone: wx.getStorageSync('phone'),
                checked: dataItems[id - 1].checked,
                money: dataItems[id - 1].money,
                goodsImg: dataItems[id - 1].goodsImg,
                IndexNum: id, // 我们使用的标识
                index: id, // 传的标识
                num: dataItems[id - 1].num, // 数量
                phone: wx.getStorageSync('phone'),
            }, (res) => {
                console.log(res)
            }, () => {
                console.log('data为空了咯')
            })
        }
        for (let o = 0; o < dataItems.length; o++) {
            if (dataItems[o].checked == true) {
                price += dataItems[o].num * dataItems[o].money;
            }
        }
        that.setData({
            items: dataItems,
            price: price.toFixed(2),
            carNumber: dataItems.length,
        })
    },
    RadiosUpShow: function() {
        // 点击全选的按钮
        let that = this;
        var dataItems = that.data.items;
        let price = 0;
        if (that.data.checked == false) {
            for (let i = 0; i < dataItems.length; i++) {
                dataItems[i].checked = true;
                price += dataItems[i].num * dataItems[i].money;

            }
            that.setData({
                items: dataItems,
                checked: true,
                price: price.toFixed(2),
            })
        } else {
            for (let i = 0; i < dataItems.length; i++) {
                dataItems[i].checked = false;
            }
            that.setData({
                items: dataItems,
                checked: false,
                price: 0,
            })
        }
    },
    Eatchclick() {
        // 点击购买商品的事件
        let that = this;
        let dataItems = that.data.items;
        let arrayData = [];
        for (let i = 0; i < dataItems.length; i++) {
            if (dataItems[i].checked == true) {
                arrayData.push(dataItems[i])
            }

        }
        console.log(arrayData)
        if (arrayData == [] || arrayData == '' || arrayData == null || arrayData == undefined) {
            wx.showToast({ title: '您还没选择要购买的宝贝!', icon: 'none' });
        } else {
            for (let i = 0; i < arrayData.length; i++) {
                postData(apiObj.saveShoppingTrolley, {
                    // 只要数据出来了只需要获取对应的标识id就可以 不用加入时候的id
                    tradeName: arrayData[i].tradeName,
                    phone: wx.getStorageSync('phone'),
                    checked: arrayData[i].checked,
                    money: arrayData[i].money,
                    goodsImg: arrayData[i].goodsImg,
                    IndexNum: arrayData[i].id, // 我们使用的标识
                    index: arrayData[i].id, // 传的标识
                    num: arrayData[i].num, // 数量
                    phone: wx.getStorageSync('phone'),
                    addWxPayment: 1,
                }, (res) => {
                    console.log(res)
                }, () => {
                    console.log('data为空了咯')
                })
            }
            let url = `../confirmOrder/confirmOrder`
            wx.navigateTo({
                url: url
            })
        }
    },
    getData() {
        // 获取购物车数量
        let that = this;
        var carNumber = 0;
        postData(apiObj.queryShoppingTrolley, { "phone": `${wx.getStorageSync('phone')}` }, (res) => {
            var item = new Array();
            for (let i = 0; i < res.length; i++) {
                var obj = {
                    tradeName: res[i].tradeName,
                    checked: false,
                    id: i * 1 + 1,
                    money: res[i].money,
                    goodsImg: res[i].goodsImg,
                    num: res[i].num, // 数量
                    phone: wx.getStorageSync('phone'),
                    IndexNum: res[i].IndexNum,
                    expressFlag: res.expressFlag
                }
                item.push(obj);
                carNumber = i + 1
            }
            wx.setStorageSync('carNumber', carNumber);
            that.setData({
                items: item,
                carNumber: carNumber,
                ShowModel: false,
                checked: false,
                price: 0
            })
        }, () => {
            console.log('data为空了咯');
            wx.setStorageSync('carNumber', carNumber);
            wx.showToast({ title: '您的购物车是空的哟!', icon: 'none', duration: 3000 });
        })
    }
})