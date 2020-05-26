const formatTime = (datas) => {
    var date = new Date(datas) //一定要记得写这个，不然会报date.getFullYear is not a function
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

function formatTimeTwo(date) {
    console.log(date)
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()
    return year + "年" + month + "月" + day + "日" + hour + "时" + minute + "分" + second + "秒";
}

function formatTimeThree(date) {
    console.log(date)
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()
    return year + "/" + month + "/" + day + " " + hour + ":" + minute + ":" + second;
}

function strToObj(str) { // 字符串转对象  key0=0&key1=1&key2=2 
    //现在可以使用JSON.paras
    var obj = {};
    var data = str.slice(1, -1);
    var arr1 = data.split(',');
    for (var i = 0; i < arr1.length; i++) {
        var arr3 = arr1[i].split('=');
        var data = arr3[0].split(' ')
        obj[data[1]] = arr3[1]; //键值对
    }
    return obj;
}

function checkAll(type, value) { //checkAll函数,type是你要验证的类型,value要是验证该类型的值，msg是验证失败后弹出的提示语
    switch (type) //判断该类型
    {
        case 'Phone': //电话号码
            if (!(/^1[34578]\d{9}$/.test(value))) {
                return false;
            } else {
                return true;
            }
            break;
        case 'password': //用户密码 6位 首字母开头
            if (!(/^\d{6}$/.test(value))) {
                return false;
            } else {
                return true;
            }
            break;
        case 'Chinese': //汉字
            if (!(/^[\u4e00-\u9fa5]{0,}$/.test(value))) {
                return false;
            } else {
                return true;
            }
            break;
    }
}

module.exports = {
    formatTime,
    formatTimeTwo,
    strToObj,
    formatTimeThree,
    checkAll
}