// pages/orders/orders.js
var app=getApp();
var i=app.conf.pageTake;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    themeData:{
      navbar: ['全部', '待付款', '已付款', '已取消'],
      currentTab:0
    }
  },
  /**
 * 切换左侧tab
 */
  navbarTap: function (e) {
    app.getOrdersList(this, parseInt(e.currentTarget.dataset.idx) + 1);
    //切换左侧tab就重置一次
    i = app.conf.pageTake;
  }, 
  //微信支付
  wechatPay:function(e){
    app.wechatPay(this, e.currentTarget.dataset.id);
  } ,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var currentTab = that.data.themeData.currentTab;
    //检查主题是否存在
    app.getFileWhetherHas(that, app.ext.theme);

    //获取系统的宽高度来赋值给当前对象
    app.getSystemHeightAndWidth(this);
    var currentTab = this.data.themeData.currentTab;
    if (options.order_id) {
      currentTab = parseInt(options.order_id) - 1;
    }
    //进来的时候置为空
    app.conf.orders.orders = [];
    app.getOrdersList(that, currentTab + 1);
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