// pages/usercenter/coupon.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    themeData:{
      navbar: ['全部', '待使用', '已使用', '已过期'],
      couponsTab: -1,
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //检查主题是否存在
    app.getFileWhetherHas(that, app.ext.theme);
    app.getCoupons(this, this.data.themeData.couponsTab);
  },
  // 顶部菜单切换
  //切换tab
  switchTab: function (e) {
    var coupons_id = e.currentTarget.dataset.idx;
    app.getCoupons(this, coupons_id);
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