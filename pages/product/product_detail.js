// pages/product/p.js
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
    app.getFileWhetherHas(that, app.ext.theme);
    let types = 'product';

    if (typeof (options.product_id) != 'undefined') {
      app.getProductContentById(that, options.product_id)
    }

    if (typeof (options.credit_shop_id) != 'undefined') {
      types = 'credit';
      let credits_products = app.getStorageName('credits_products');
      let credits_product_obj = null;
      for (var i = credits_products.length - 1; i >= 0; i--) {
        if (options.credit_shop_id == credits_products[i]['id']) {
          credits_product_obj = credits_products[i];
        }
      }
      console.log(credits_product_obj);
      that.setData({
        'themeData.credits_product': credits_product_obj
      });
    }
    else {
      //如果是服务 就取服务

      //如果是礼品就直接显示礼品
    }
    that.setData({
      'themeData.types': types
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