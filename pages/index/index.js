//index.js
//获取应用实例
const app = getApp()
//logs.js
const util = require('../../utils/util.js')

const calendar = require('../../utils/calendar.js')

Page({
  data: {
    drinks: ["水", "茶", "红茶", "绿茶", "咖啡", "奶茶", "可乐", "鲜奶", "豆奶", "果汁", "果味汽水", "苏打水", "运动饮料", "酸奶", "酒", "啤酒", "王老吉"],
    motto: ['及时当勉励，岁月不待人',
            '少壮不努力，老大徒伤悲',
            '吾生也有涯，而知也无涯',
            '皇皇三十载，书剑两无成',
            '春光不自留，莫怪东风恶',
            //
            '岁往弦吐箭',
            '时间就是生命',
            '时间是最好的医生',
            '荒废时间等于荒废生命',
            '忘掉今天的人将被明天忘掉',
            //
            '逝者如斯夫，不舍昼夜',
            '一万年太久，只争朝夕',
            '辛勤的蜜蜂永没有时间的悲哀',
            '抛弃时间的人，时间也抛弃他',
            '天波易谢，寸暑难留',
            //
            '时间是最伟大、公正的裁判',
            '时间能揭露万事',
            '一寸光阴一寸金，寸金难买寸光阴',
            '年难留，时易损',
            '光阴潮汐不等人',
            //
            '光阴有脚当珍惜，书田无税应勤耕',
            '大豆不挤出油，时间不挤白会溜',
            '起早外出的跛子追不上',
            '皇皇三十载，书剑两无成',
            '任何节约归根到底是时间的节约',
            //
            '时间是伟大的导师',
            '浪费时间是一桩大罪过',
            '少年易学老难成，一寸光阴不可轻',
            '最严重的浪费就是时间的浪费',
            '欢娱不惜时光逝',
          ],
    userInfo: {},
    cur_time: 0,
    remain_days: 0,
    remain_hours: 0,
    remain_percent: 0,
    hasUserInfo: false,
    motto_index: 0,
    day_info : "",
    name: "上证指数",
    today_open_price: 0,
    lastday_close_price : 0,
    cur_price: 0,
    today_max: 0,
    dotay_min: 0,
    cur_desc:0,
    cur_percent: 0,

    name_sz: "深证成指",
    cur_price_sz: 0,
    cur_dec_sz: 0,
    cur_percent_sz : 0,

    name_cy: "创业板指",
    cur_price_cy: 0,
    cur_dec_cy: 0,
    cur_percent_cy : 0,

    i_month_cn: "",
    l_day_cn : "",

    l_term : "",

    today_driks: [],
    today_stars: "",


    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    iday: 0,
  },

  //转发
  onShareAppMessage: function () {
    return {
      title: '2019年倒计时',
      path: 'pages/index/index'
    }
  },


  //////////////////////////////////////////////////////////////////
  //1. 增加显示 2018 年当前多少天功能  2.增加显示农历
  ////////////////////////////////////////////////////////////////

  //
  random:function (dayseed, indexseed) {
      var n = dayseed % 11117;
      for (var i = 0; i < 100 + indexseed; i++) {
          n = n * n;
          n = n % 11117;   // 11117 是个质数
      }
      return n;
  },

  star:function(num) {
      var result = "";
      var i = 0;
      while (i < num) {
          result += "★";
          i++;
      }
      while(i < 5) {
          result += "☆";
          i++;
      }
      return result;
  },


  // 从数组中随机挑选 size 个
  pickRandom: function(array, size) {
      var result = [];

      for (var i = 0; i < array.length; i++) {
          result.push(array[i]);
      }

      for (var j = 0; j < array.length - size; j++) {
          var index = this.random(this.data.iday, j) % result.length;
          result.splice(index, 1);
      }

      return result;
  },

  recommend_read: function (){
    wx.navigateTo({
      url:'../more/more?nickname=' + this.data.userInfo.nickName,
      })      //结束后的回调(成功，失败都会执行)
  },

  pmp_exam: function (){
    wx.navigateTo({
      url:'../pmp/pmp?nickname=' + this.data.userInfo.nickName,
      })      //结束后的回调(成功，失败都会执行)
  },

  others_exam: function (){
    wx.navigateTo({
      url:'../others/others?nickname=' + this.data.userInfo.nickName,
      })      //结束后的回调(成功，失败都会执行)
  },

  getBoundsInfo: function (){
    ///http://www.cnblogs.com/luluping/archive/2010/11/15/1877817.html
    //https://blog.csdn.net/zai_yuzhong/article/details/51735769
    var that=this;
    wx.request ({
     url:'https://hq.sinajs.cn/list=sh000001',
     header: {
          'content-type': 'application/json' // 默认值
     },
     success: function (res) {
        //将获取到的json数据，存在名字叫list的这个数组中
        var res_info = res.data.substring(21, res.data.length - 3).split(",");
        that.setData({
          today_open_price: parseFloat(res_info[1]).toFixed(2),
          lastday_close_price: parseFloat(res_info[2]).toFixed(2),
          cur_price: parseFloat(res_info[3]).toFixed(2),
          today_max: parseFloat(res_info[4]).toFixed(2),
          dotay_min: parseFloat(res_info[5]).toFixed(2),
          cur_desc: (parseFloat(res_info[3]) - parseFloat(res_info[2])).toFixed(2),
          cur_percent: ((parseFloat(res_info[3]) - parseFloat(res_info[2]))/ parseFloat(res_info[2]) * 100).toFixed(2),
          //res代表success函数的事件对，data是固定的，list是数组
        })
      }
    });

    wx.request ({
     url:'https://hq.sinajs.cn/list=s_sz399001',
     header: {
          'content-type': 'application/json' // 默认值
     },
     success: function (res) {
        //将获取到的json数据，存在名字叫list的这个数组中
        var res_info = res.data.substring(23, res.data.length - 3).split(",");
        that.setData({
          cur_price_sz: parseFloat(res_info[1]).toFixed(2),
          cur_dec_sz: parseFloat(res_info[2]).toFixed(2),
          cur_percent_sz: parseFloat(res_info[3]).toFixed(2),
          //res代表success函数的事件对，data是固定的，list是数组
        })
      }
    });

    wx.request ({
     url:'https://hq.sinajs.cn/list=s_sz399006',
     header: {
          'content-type': 'application/json' // 默认值
     },
     success: function (res) {
        //将获取到的json数据，存在名字叫list的这个数组中
        var res_info = res.data.substring(23, res.data.length - 3).split(",");
        that.setData({
          cur_price_cy: parseFloat(res_info[1]).toFixed(2),
          cur_dec_cy: parseFloat(res_info[2]).toFixed(2),
          cur_percent_cy: parseFloat(res_info[3]).toFixed(2),
          //res代表success函数的事件对，data是固定的，list是数组
        })
      }
    });
  },

  //事件处理函数
  bindViewTap: function() {
    //wx.navigateTo({
    //  url: '../index/index'
    //})
    //https://www.cnblogs.com/seacryfly/articles/stock.html
    this.freshNewMotto();
    this.getBoundsInfo();

  },

  onPullDownRefresh: function () {
    wx.setNavigationBarTitle({
      title: '2019年倒计时，刷新中……'
    });
    //wx.showNavigationBarLoading();
    //wx.navigateTo({
    //  url: '../index/index'
    //})

    this.freshNewMotto();
    this.getBoundsInfo();
    wx.setNavigationBarTitle({
      title: '2019年倒计时'
    });
    wx.stopPullDownRefresh();
  },

  freshNewMotto : function() {
    var motto_index = Math.floor(Math.random() * 1000000 % this.data.motto.length);
    this.setData({motto_index    : motto_index})
  },

  getCurInfos: function() {
    var cur_now = new Date();
    var strYear = cur_now.getFullYear()
    var strMonth = cur_now.getMonth() + 1;
    var strDate = cur_now.getDate();
    var strHour = cur_now.getHours();
    var strMin = cur_now.getMinutes();
    var strSec = cur_now.getSeconds();
    var dayIndex = cur_now.getDay();
    var iday = strYear * 10000 + strMonth * 100 + strDate;
    //var weekday=["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];

    var timestampof2019 = 1546272000000;
    var timestampof2018 = 1514736000000;

    var timestampof2019festval = 1549296000000;

    var timestampof2020festval = 1579881600000;

    var timestampof2020 = 1577808000000;

    var cal_info = calendar.calc.solar2lunar(strYear, strMonth, strDate);

    //console.log(cal_info);

    if (strMonth >= 1 && strMonth <= 9) {
      strMonth = "0" + strMonth;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    if (strHour >= 0 && strHour <= 9) {
      strHour = "0" + strHour;
    }
    if (strMin >= 0 && strMin <= 9) {
      strMin = "0" + strMin;
    }
    if (strSec >= 0 && strSec <= 9) {
      strSec = "0" + strSec;
    }
    var cur_time = strYear + "-" + strMonth + "-" + strDate + " " + strHour + ":" +  strMin + ":" + strSec;

    var remain_days = Math.floor((timestampof2020 - Number(cur_now))/1000/3600/24)
    var remain_hours = Math.floor((timestampof2020 - Number(cur_now))/1000/3600)
    var remain_percent = ((timestampof2020 - Number(cur_now)) / (timestampof2020 - timestampof2019) * 100).toFixed(2);

    var fesval_remain_days = Math.floor((timestampof2020festval - Number(cur_now))/1000/3600/24)

    if(cur_now.getSeconds() % 5 == 0) {
      this.freshNewMotto();
    }

    if (cur_now.getSeconds() % 10 == 0) {
      this.getBoundsInfo();
    }
    this.setData({
      cur_time             : cur_time,
      remain_days          : remain_days,
      remain_hours         : remain_hours,
      remain_percent       : remain_percent,
      day_info             : cal_info.ncWeek,
      i_month_cn           : cal_info.IMonthCn,
      l_day_cn             : cal_info.IDayCn,
      l_term               : cal_info.Term,
      iday                 : iday,
      i_fesval_remain_days : fesval_remain_days,
      });
    //console.log(remain_hours);
  },

  getDrinkInfo:function() {
    this.setData({
      today_driks : this.pickRandom(this.data.drinks, 2).join(", "),
    });
  },

  getStarstInfo:function() {
    this.setData({
      today_stars : this.star(this.random(this.data.iday, 6) % 5 + 1),
    });
  },

  initDatas:function() {
    this.getCurInfos();
    this.getBoundsInfo();
    this.freshNewMotto();
    this.getDrinkInfo();
    this.getStarstInfo();
  },

  onLoad: function () {
    this.initDatas();
    setInterval(this.getCurInfos, 1000);
    if (app.globalData.userInfo) {
      this.setData({
        userInfo   : app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo   : res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo   : res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  getUserInfo: function(e) {
    //console.log(e)
    this.initDatas();
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo   : e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
