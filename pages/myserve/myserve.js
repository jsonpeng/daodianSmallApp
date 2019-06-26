// pages/myserve/myserve.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    themeData: {
      navbar: ['待使用', '已使用', '已过期', '待支付'],
      currentTab: 0,
    },
    timer: ''
  },
  navbarTap: function (e) {
    let index = parseInt(e.currentTarget.dataset.idx);
    if (index == 3) {
      wx.redirectTo({
        url: '../orders/orders?order_id=2',
      })
    }
    app.getServices(this, this.data.themeData.navbar[index]);
    this.setData({
      'themeData.currentTab': index
    })
  },
  //查看二维码大图
  watchQrcode: function (e) {
    let qrcode = e.currentTarget.dataset.qrcode;
    let id = e.currentTarget.dataset.id;
    app.previewImage([qrcode]);
    let that = this;
    let times = 1;
    that.setData({
      timer: setInterval(function () {
        that.notify_success(id);
        times++;

        // if(times >=60){
        //   clearInterval(that.data.timer);
        //   app.alert('已超时!请重新操作');
        // }

      }, 1000)
    })
  },
  //成功提示
  notify_success: function (id) {
    let that = this;
    app.request('/api/services_success_notify', function (res) {
      console.log(res);
      if (res == '服务使用成功') {
        that.onShow();
        app.alert(res);
        clearInterval(that.data.timer);
        app.getServices(that, that.data.themeData.navbar[1]);
        that.setData({
          'themeData.currentTab': 1
        })
      }
    }, { id: id });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //检查主题是否存在

    app.getFileWhetherHas(that, app.ext.theme);
    app.getServices(that);

    if (typeof (options.currentTab) === 'undefined'){
        app.getServices(that);
    }
    if (options.currentTab!==null){
      that.setData({
        'themeData.currentTab': options.currentTab
      });
      app.getServices(this, this.data.themeData.navbar[options.currentTab]);
    }

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