Page({
    data: {
        iphone: '0755-88680510',
        showImg: ['../../images/QRcode.png']
    },
    onLoad: function() {},
    bindViewTap: function(e) {
        console.log(e)
        if (e.target.dataset.iphone == '' || e.target.dataset.iphone == null || e.target.dataset.iphone == undefined) {

        } else {
            wx.makePhoneCall({
                phoneNumber: e.target.dataset.iphone //仅为示例，并非真实的电话号码
            })
        }

    },
    showImages() {
        let that = this;
        wx.previewImage({
            urls: that.data.showImg,
            current: that.data.showImg
        })
    }
})