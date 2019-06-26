// pages/store_list/store_list.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  //选择店铺返回
  selectShops:function(e){
    var shop_index = e.currentTarget.dataset.index;
    app.globalData.shop_id = e.currentTarget.dataset.id;

    console.log(shop_index);
    
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面

    app.saveStorageName('now_shop', app.getStorageName('shops')[shop_index]);
    
    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    prevPage.setData({
      'themeData.shop_tab': shop_index,
      'themeData.shop_tab': shop_index
    });

    wx.navigateBack({
      delta:1
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //检查主题是否存在
    app.getFileWhetherHas(that, app.ext.theme);
    app.AutoVarifyCache('shops', function (e) {
      if(e){
        //过滤min_distance
        delete e.min_distance;
        that.setData({
          'themeData.shops':e,
          'themeData.shops_length': app.countLength(e)   //计算长度
        })
      }
    });
    if (options.product_id){
      app.getProductContentById(that, options.product_id)
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