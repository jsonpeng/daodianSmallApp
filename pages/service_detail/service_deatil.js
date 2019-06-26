// pages/service_detail/service_deatil.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //检查主题是否存在
    app.getFileWhetherHas(that, app.ext.theme.name);
    //app.getServices(this, '待使用');
    var service = app.getStorageName('serives');
    console.log(options.serviceId + 'service');
    let result = null;
    for(var i=0;i<service.length;i++){
      if (service[i].id == options.serviceId){
        result = service[i]
      }
    }
    that.setData({
      'themeData.servie': result
    });
    // 根据服务id获取对应二维码
    // zcjy.request(that, '/api/get_service_user_qrcode?service_user_id=' + options.serviceId, function (res) {
    //   if (!that.errorRes(res)) {
    //     obj.setData({
    //       'themeData.qrcode_l': res.data.data
    //     });
    //   }
    // });
    app.request('/api/get_service_user_qrcode',function(res){
      if (res) {
        that.setData({
          'themeData.qrcode_l': res
        });
      }
    }, { service_user_id: options.serviceId },true)
  },
  /** 
  ** 根据服务id获取对应二维码
  */
  
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