// pages/news/news.js
var WxParse = require('../../wxParse/wxParse.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    notices: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //检查主题是否存在
    app.getFileWhetherHas(that, app.ext.theme);
    var news_id = options.news_id;
    that.setData({
      'themeData.news_id': news_id
    });
    var result;
    console.log('这是参数id  ' + news_id);
    app.AutoVarifyCache('gonggao', function (e) {
      if (!e) {
        app.getNoticesAll(that, true);
      } else {
        for (var i = 0; i < e.length; i++) {
          if (e[i].id == news_id) {
            result = e[i];
          }
        }
        that.setData({
          'themeData.notices': result,
        });
      }
      console.log('这是result  ' + result);
      WxParse.wxParse('themeData.contents', 'html', result.content, that, 5);
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