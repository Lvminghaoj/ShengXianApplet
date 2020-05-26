function Canvas(img) {
    wx.showLoading({ title: '正在生成大图', mask: 'true' })
    var that = this;
    const ctx = wx.createCanvasContext('myCanvas')

    ctx.setFontSize(15)
    ctx.fillStyle = 'rgba(102,102,102,1)';
    // 设置矩形边框
    // ctx.setStrokeStyle('#fff')
    // 设置矩形宽高
    // ctx.strokeRect(0, 0, 400, 200)
    let canvas = '../../images/background.jpg';
    //背景图片
    ctx.drawImage(canvas, 0, 0, 370, 550)
    ctx.drawImage(img, 0, 0, 370, 550)
        // 名字设置
    var datatimeTwo = time.formatTime(new Date().getTime(), 'Y/M/D h:m:s');
    console.log(datatimeTwo)
    ctx.fillText(datatimeTwo, 230, 570)
    ctx.setFontSize(24)
    ctx.fillStyle = 'red';
    // var name = wx.getStorageSync('companyContacts');
    // 小程序二维码
    ctx.draw(false, function() {
        wx.canvasToTempFilePath({
            canvasId: 'myCanvas',
            success: function(res) {
                console.log(res.tempFilePath);
                let ImgArray = that.data.prurl;
                console.log(ImgArray)
                ImgArray.push(res.tempFilePath);
                setTimeout(function() {
                    that.setData({
                        prurl: ImgArray,
                        showModalStatus: false,
                        hidden: true
                    })
                    wx.hideLoading()
                }, 1000)
            }
        })
    });
}

function DeepImg() {
    wx.chooseImage({
        count: 1,
        sizeType: ['original'],
        sourceType: ['camera', 'album'],
        success(res) {
            let Img = res.tempFilePaths[0];
            wx.getImageInfo({
                src: Img,
                success(Res) {
                    console.log(111111)
                    console.log(Res)
                    console.log(Res.width)
                    console.log(Res.height)
                }
            })
            Canvas(Img)
        }
    })
}