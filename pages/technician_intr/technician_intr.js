// pages/technician_intr/technician_intr.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      themeData:{
        indicatorDots: false, //是否显示面板指示点，默认为false;
        autoplay: true, //是否自动切换，默认为false;
        interval: 4000,//自动切换时间间隔，默认5000ms;
        circular: true,//是否采用衔接滑动
        duration: 1000,//滑动动画时长，默认为1000ms;
        vertical: false
      },

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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

    var technician_id = options.technician_id;
    // 获取技师列表
    app.request('/api/get_technicicans', function (res) {
      if (res) {
        that.setData({
          'themeData.technicicans': res,
          'themeData.shop_add': app.getStorageName("now_shop").address
        });
        for(var i=0;i<res.length;i++){
          if (technician_id==res[i].id){
            var technician=res[i];
          }
        }
        that.setData({
          'themeData.technician':technician
        })
      }
    }, { shop_id: app.globalData.shop_id }, true)
  },
  // 将联系方式添加到通讯录
  addToIPA:function(){
    wx.addPhoneContact({
      mobilePhoneNumber: this.data.themeData.technician.mobile,   //名字
      weChatNumber: this.data.themeData.technician.weixin,    //手机号
      addressStreet: this.data.themeData.shop_add,
      success: function () {
        console.log('添加成功')
      }
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
    var viewHeight = parseInt(this.data.themeData.scrollWidth) / ratio;
    var _imgheight = viewHeight.toFixed(0);
    // var imgheightarray = this.data.imgheights;
    //把每一张图片的高度记录到数组里
    // imgheightarray.push(imgheight);

    this.setData({
      'themeData.imgheight': _imgheight,
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {



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