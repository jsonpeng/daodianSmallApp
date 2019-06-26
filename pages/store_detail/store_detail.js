// pages/store_detail/store_detail.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index:0,
    shops:[]
  },
  //地图中打开
  openMap: function (e) {
    app.openMap(e.currentTarget.dataset.jindu, e.currentTarget.dataset.weidu);
  },
  //打电话
  phone: function (e) {
    app.phone(e.currentTarget.dataset.tel);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    let index = options.index;
    //检查主题是否存在
    app.getFileWhetherHas(that, app.ext.theme);
    app.AutoVarifyCache('shops', function (e) {
      if (e) {
        that.setData({
          'themeData.shops': e,
          'themeData.index':index
        })
      }
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