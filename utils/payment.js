//获取openid
function getOpenId(code) {
    var that = this;
    wx.request({
        url: 'https://www.see-source.com/weixinpay/GetOpenId',
        method: 'POST',
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        data: { 'code': code },
        success: function(res) {
            var openId = res.data.openid;
            that.xiadan(openId);
        }
    })
}
//下单
function xiadan(openId) {
    var that = this;
    wx.request({
        url: 'https://www.see-source.com/weixinpay/xiadan',
        method: 'POST',
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        data: { 'openid': openId },
        success: function(res) {
            var prepay_id = res.data.prepay_id;
            console.log("统一下单返回 prepay_id:" + prepay_id);
            that.sign(prepay_id);
        }
    })
}
//签名
function sign(prepay_id) {
    var that = this;
    wx.request({
        url: 'https://www.see-source.com/weixinpay/sign',
        method: 'POST',
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        data: { 'repay_id': prepay_id },
        success: function(res) {
            that.requestPayment(res.data);
        }
    })
}
//申请支付
function requestPayment(obj) {
    wx.requestPayment({
        'timeStamp': obj.timeStamp,
        'nonceStr': obj.nonceStr,
        'package': obj.package,
        'signType': obj.signType,
        'paySign': obj.paySign,
        'success': function(res) {

        },
        'fail': function(res) {}
    })
}