// pages/subscribe/addSubscribe.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    themeData: {
    //大致日期选择:
    dateTime: {
      timedateIndex: 'now',
      dateDetailIndex: -1,
      date_time:'',
      detail_time:'',
    },
    timeTabel: false,
    shop_tab:-1,
    subscribeConfig:[
      {
        name: '请选择服务',
        data: [
            '足浴',
            '按摩',
            '针灸'
        ],
      },
      {
        name: '请选择技师',
        data: [
            '西施',
            '林黛玉',
            '梦露',
            '张柏芝'
        ],
      },
    ],
    sconfig_index:0,
    sconfig_show_data:{
      'service':'',
      'jishi':'',
      'time':''
    },
    pay_status: false,
    cancel_status: false,
    indicatorDots: false, //是否显示面板指示点，默认为false;
    autoplay: false, //是否自动切换，默认为false;
    interval: 4000,//自动切换时间间隔，默认5000ms;
    circular: false,//是否采用衔接滑动
    duration: 1000,//滑动动画时长，默认为1000ms;
    vertical: false,
    previousMargin:'240rpx',
    nextMargin:'240rpx',
    itemIndex:0,
    current:0,
    requestData:{
      service_id:0,
      technician_id:0,
      arrive_time:'',
      mobile:''
    },
    showServices:false,
    service_active:''
    },
  },
  //保存手机号
  savePhone:function(e){
    this.setData({
        'themeData.requestData.mobile':e.detail.value
    });
  },
  //确认
  selectSub:function(e){
    //当前是选中的 **
    let type = this.data.themeData.service[this.data.themeData.sconfig_index]['name'];
    console.log(type);

    //如果是服务选择
    // if (type == '请选择服务'){
    //   this.setData({
    //     'themeData.sconfig_show_data.service': this.data.themeData.subscribeConfig[this.data.themeData.sconfig_index]['data'][this.data.themeData.current]['name'],
    //     //保存店铺选择shop_id信息
    //     'themeData.requestData.shop_id': this.data.themeData.shops[this.data.themeData.shop_tab]['id'],
    //     //保存服务选择service_id信息
    //     'themeData.requestData.service_id': this.data.themeData.subscribeConfig[this.data.themeData.sconfig_index]['data'][this.data.themeData.current]['id']

    //   });
    // }//如果是技师选择
    // else{
    //   this.setData({
    //     'themeData.sconfig_show_data.jishi': this.data.themeData.subscribeConfig[this.data.themeData.sconfig_index]['data'][this.data.themeData.current]['name'],
    //     //保存技师选择technician_id信息
    //     'themeData.requestData.technician_id': this.data.themeData.subscribeConfig[this.data.themeData.sconfig_index]['data'][this.data.themeData.current]['id']
    //   });
    // }
    // 当前所选服务下标
    var index = this.data.themeData.current;
    this.setData({
      'themeData.requestData.service_id': this.data.themeData.service[index]['id'],
      'themeData.service_active': this.data.themeData.service[index]['name'],
      'themeData.showServices':false
    });
    
  },
  //选择服务
  selectService:function(e){
    var that = this;
    var shop_tab = this.data.themeData.shop_tab;
    that.setData({
      'themeData.showServices':true
    });
    // if (shop_tab < 0){
    //     app.alert('请选择门店');
    //     return false;
    // }
    //当前选中的店铺id
    var technician_id = this.data.themeData.technician['id'];
    console.log(technician_id);
    //获取服务
    // app.getServicesByShopId(this , shop_id,function(res){
    //   console.log(res);
    //   if(res.length == 0){
    //     app.alert('当前店铺下没有服务,请重新选择!');
    //     return false;
    //   }
    //   let subscribeConfig = that.data.themeData.subscribeConfig;
    //   subscribeConfig[0]['data'] = res;
    //   that.setData({
    //     'themeData.pay_status': true,
    //     'themeData.subscribeConfig': subscribeConfig,
    //     'themeData.sconfig_index':0
    //   });
    // });

    // 根据技师id获取服务
    app.request('/api/get_services_by_technicican', function (res) {
      if (res) {
        that.setData({
          'themeData.service': res,
          'themeData.shop_add': app.getStorageName("now_shop").address
        });
      }
    }, { id: technician_id }, true)
  },
  //选择技师
  selectJishi:function(e){
    var shop_tab = this.data.themeData.shop_tab;
    if (shop_tab < 0) {
      app.alert('请选择门店');
      return false;
    }
    // let services = this.data.themeData.subscribeConfig[0]['data'];
    // if (services.length==0){
    //   app.alert('请选择服务');
    //   return false;
    // }
    var service_id = this.data.themeData.subscribeConfig[0]['data'][this.data.themeData.current]['id'];
    var that = this;
    app.getJishiByServiceId(this, service_id,function(res){
        if (res.length == 0) {
          app.alert('当前服务下没有技师,请重新选择!');
          return false;
        }
        let subscribeConfig = that.data.themeData.subscribeConfig;
        subscribeConfig[1]['data'] = res;
        that.setData({
          'themeData.pay_status': true,
          'themeData.subscribeConfig': subscribeConfig,
          'themeData.sconfig_index': 1
        });
    });
  },
  //日期选择
  subDateTimeSelect:function(e){
    let type = e.currentTarget.dataset.type;
    let detail_time = e.currentTarget.dataset.timer;
    this.setData({
      'themeData.dateTime.timedateIndex':type,
      'themeData.dateTime.date_time': detail_time,
      //把时分选择重置下
      'themeData.dateTime.dateDetailIndex':-1,
      'themeData.dateTime.detail_time':''
    });
  },
  //详细时分选择
  subDetailTimeSelect:function(e){
  let now = e.currentTarget.dataset.now;
  let index = e.currentTarget.dataset.index;
  let time = e.currentTarget.dataset.timer;
  if(!now){
    this.setData({
      'themeData.dateTime.dateDetailIndex': index,
      'themeData.dateTime.detail_time': time
    });
  }
  else{
  app.alert('当前时间不可选');
  }
  },
  //确认时间选择
  enterTimeSelect:function(){
    let detail_time = this.data.themeData.dateTime.detail_time;
    if (app.empty(detail_time)){
      app.alert('请选择具体预约时间!');
      return false;
    }
    this.setData({
      'themeData.requestData.arrive_time': this.data.themeData.shopTimer[this.data.themeData.dateTime.timedateIndex.toString()] + ' ' + this.data.themeData.dateTime.detail_time.toString() 
    })
    this.exitTimetabel();
  },
  //点击立即预约
  newSubscribe:function(){
    let data = this.data.themeData.requestData;
    //验证门店选择
    // if (app.empty(data.shop_id)){
    //     app.alert('请选择门店');
    //     return false;
    // }
    //验证服务选择
    if (app.empty(data.service_id)) {
      app.alert('请选择服务');
      return false;
    }
    //验证技师选择
    // if (app.empty(data.technician_id)) {
    //   app.alert('请选择技师');
    //   return false;
    // }

    //验证电话输入
    if (app.empty(data.mobile)) {
      app.alert('请输入联系电话');
      return false;
    }

    //验证到店时间选择
    if (app.empty(data.arrive_time)) {
      app.alert('请选择到店时间');
      return false;
    }

    app.newSubscribe(this,function(res){
      app.alert(res);
      wx.switchTab({
        url: '../subscribe/subscribe',
      })
      global.currentTab=1;
    });

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.hideTabBar();
    var that = this;
    //检查主题是否存在
    app.getFileWhetherHas(that, app.ext.theme);
    wx.getSystemInfo({
      success: function (res) {
        //获取屏幕的宽度并保存
        that.setData({
          'themeData.scrollWidth': res.windowWidth
        });
      }
    });
    app.AutoVarifyCache('shops', function (e) {
      if (e) {
        //过滤min_distance
        delete e.min_distance;
        that.setData({
          'themeData.shops': e,
        })
      }
    });
    //获取店铺经营时间
    app.getShopTimer(that,function(res){
      that.setData({
        'themeData.shopTimer':res
      })
    });    
    var technician_id = options.technician_id;
    // 获取技师列表
    app.request('/api/get_technicicans', function (res) {
      if (res) {
        that.setData({
          'themeData.technicicans': res,
          'themeData.shop_name': app.getStorageName("now_shop").name
        });
        for (var i = 0; i < res.length; i++) {
          if (technician_id == res[i].id) {
            var technician = res[i];
          }
        }
        that.setData({
          'themeData.technician': technician,
          'themeData.requestData.technician_id':technician.id,
          'themeData.requestData.mobile': technician.mobile
        })
      }
    }, { shop_id: app.globalData.shop_id }, true)
  },
  // 选择技师切换
  swiperChange: function (e) {
    console.log(e.detail.current);
    this.setData({
      'themeData.current': e.detail.current,   //获取当前轮播图片的下标
      'themeData.itemIndex': e.detail.current
    })
  },
  imageLoad: function (e) {
    //获取图片真实宽度  
    var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      //宽高比  
      ratio = imgwidth / imgheight;
    //console.log(imgwidth, imgheight);
    //计算的高度值  
    var viewHeight = parseInt(this.data.scrollWidth-15) /3;
    var _imgheight = viewHeight.toFixed(0);
    // var imgheightarray = this.data.imgheights;
    //把每一张图片的高度记录到数组里
    // imgheightarray.push(imgheight);

    this.setData({
      'themeData.imgheight': viewHeight,
    });
  },
  payNowAction: function () {
    this.setData({
      'themeData.cancel_status':true
    });
  },
  exitAction:function(){
    this.setData({
      'themeData.showServices': false,
      'themeData.cancel_status': false
    });
  },
  showTimetabel:function(){
    let that = this;
    that.setData({
      'themeData.timeTabel': true
    })
    app.getShopTimer(that, function (res) {
      that.setData({
        'themeData.shopTimer': res
      })
    });
  },
  exitTimetabel:function(){
    this.setData({
      'themeData.timeTabel':false
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})