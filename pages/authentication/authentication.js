//index.js
//获取应用实例
import { apiObj } from '../../api/api'
import { postData, ChooImg } from '../../utils/https'
import { checkAll } from '../../utils/util'
Page({
    data: {
        bankCardname: [], // 身份证名称
        bankCardNum: [], //身份证号码
        IDturePhoto: '', // 正面
        IDfalsePhoto: '', // 反面
        IDtruePhotofalse: false,
        IDtruePhototrue: false,
        showModel: true,
        code: ''
    },
    //事件处理函数
    onLoad: function(optiacy) {
        let that = this;
        that.getDetail()
    },
    onShow() {

    },
    IDname(e) {
        //监听输入身份证名称
        let that = this;
        that.setData({
            bankCardname: e.detail.value
        })
    },
    IDNum(e) {
        // 身份证号码
        let that = this;
        that.setData({
            bankCardNum: e.detail.value
        })
    },
    chooseId(e) {
        // 点击重新上传图片  正面
        let that = this;
        console.log(e)
        let id = e.currentTarget.dataset.id;
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
                const tempFilePaths = res.tempFilePaths;
                let url = 'https://www.powerboy.vip/ebm/api/sys/uploadFile/' + wx.getStorageSync('phone') + '/1'
                let photos = tempFilePaths[0];
                ChooImg(url, photos, (res) => {
                    var img = res.split('"')
                    if (id == 1) {
                        that.setData({
                            IDturePhoto: img[1],
                            IDtruePhototrue: true
                        })
                    } else {
                        that.setData({
                            IDfalsePhoto: img[1],
                            IDtruePhotofalse: true
                        })
                    }
                })
            }
        })
    },
    btnAddData() {
        // 点解提交保存身份证信息
        let that = this;
        if (checkAll('Chinese', that.data.bankCardname) != true) {
            wx.showToast({ title: '身份证名称请输入中文', icon: 'none' });
            return;
        }
        if (that.data.show == true) {
            postData(apiObj.updateUserAuth, {
                "phone": wx.getStorageSync('phone'),
                "idName": that.data.bankCardname, // 身份证名称
                "idCard": that.data.bankCardNum, //身份证号码
                "frontPhoto": that.data.IDturePhoto, // 身份证正面图片
                "backPhoto": that.data.IDfalsePhoto, // 身份证反面图片
                "code": that.data.code
            }, (res) => {
                console.log(res)
            }, () => {
                // 这里是成功
                wx.setStorageSync('authentication', true) //根据这个来判断是否已通过认证
                wx.redirectTo({
                    url: '../information/information'
                })
                wx.showToast({ title: '修改成功', icon: 'none' });
            })
        } else {
            postData(apiObj.updateUserAuth, {
                "phone": wx.getStorageSync('phone'),
                "idName": that.data.bankCardname, // 身份证名称
                "idCard": that.data.bankCardNum, //身份证号码
                "frontPhoto": that.data.IDturePhoto, // 身份证正面图片
                "backPhoto": that.data.IDfalsePhoto, // 身份证反面图片
                "code": ""
            }, (res) => {
                console.log(res)
            }, () => {
                // 这里是成功
                wx.setStorageSync('authentication', true) //根据这个来判断是否已通过认证
                wx.navigateBack({
                    delta: 1
                })
                wx.showToast({ title: '提交成功', icon: 'none' });
            })
        }
    },
    getDetail() {
        // 获取身份证信息
        let that = this;
        postData(apiObj.queryUserAuth, { phone: wx.getStorageSync('phone') }, (res) => {
            console.log(res.idName)
            if (res.status == 1) {
                that.setData({
                    IDfalsePhoto: res.backPhoto,
                    IDturePhoto: res.frontPhoto,
                    bankCardname: res.idName,
                    bankCardNum: res.idCard,
                    status: res.status,
                    showModel: false,
                    code: res.code,
                    IDtruePhototrue: true,
                    IDtruePhotofalse: true,
                    show: true
                })
            } else {
                that.setData({
                    IDfalsePhoto: res.backPhoto,
                    IDturePhoto: res.frontPhoto,
                    bankCardname: res.idName,
                    bankCardNum: res.idCard,
                    status: res.status,
                    code: res.code,
                    IDtruePhototrue: true,
                    IDtruePhotofalse: true,
                    show: true
                })
            }
        }, (res) => {
            // 错误的函数
            console.log(res)
        })
    },
    previewImageFalse() {
        // 点击 身份证反面的图片
        wx.previewImage({
            current: this.data.IDfalsePhoto, // 当前显示图片的http链接
            urls: [this.data.IDfalsePhoto] // 需要预览的图片http链接列表
        })
    },
    previewImageTrue() {
        // 点击 身份证正面的图片
        wx.previewImage({
            current: this.data.IDturePhoto, // 当前显示图片的http链接
            urls: [this.data.IDturePhoto] // 需要预览的图片http链接列表
        })
    }
})