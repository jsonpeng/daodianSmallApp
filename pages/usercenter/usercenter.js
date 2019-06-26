// pages/usercenter/usercenter.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    themeData:{
      switch: app.conf.switch
    }
  },
  shopManageRedirect:function(e){
    let user = this.data.themeData.myself;
    if (user.type !='用户'){
      wx.navigateTo({
        url: e.currentTarget.dataset.url,
      })
    }
    else{
      app.alert('您好!你的权限还不够访问,请联系管理员');
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    //检查主题是否存在
    app.getFileWhetherHas(that, app.ext.theme);
    // 获取功能开关
    // app.getFuncSwithList(that ,false);

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
    let that = this;
    app.meInfo(that);
    app.getMessage(that);
    app.getCoupons(that, 0);
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