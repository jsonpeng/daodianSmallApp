// pages/subscribe/subscribe.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    themeData:{
      hadSubscribe: true,
      navbar:[
        '我要预约',
        '预约列表'
      ],
      currentTab: 0
    }
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


  },
  navbarTap: function (e) {
    let index = parseInt(e.currentTarget.dataset.idx);
    this.setData({
      'themeData.currentTab': index
    })

  },

  //地图中打开
  openMap: function (e) {
    app.openMap(e.currentTarget.dataset.jindu, e.currentTarget.dataset.weidu);
  },
  //打电话
  phone: function (e) {
    app.phone(e.currentTarget.dataset.tel);
  },
  //手动取消预约
  cancleSub:function(e){
    let that = this;
    wx.showModal({
      content: '确定要取消该预约吗',
      cancelText: '取消',
      confirmText: '确定',
      confirmColor: '#ff4e44',
      success: function (res) {
        if (res.confirm) {
          app.cancleSubscribe(that,e.currentTarget.dataset.id);
        }
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
    var that = this;
    //检查主题是否存在

    app.getFileWhetherHas(that, app.ext.theme);
    app.authSubscribes(that);
    // 获取技师列表
    app.request('/api/get_technicicans', function (res) {
      if (res) {
        that.setData({
          'themeData.technicicans': res,
          'themeData.shop_add': app.getStorageName("now_shop").address
        });
      }
    }, { shop_id: app.globalData.shop_id }, true);
    var past_currentTab = global.currentTab;
    console.log('global.currentTab' + global.currentTab);
    if (global.currentTab == 1) {
      this.setData({
        'themeData.currentTab': past_currentTab
      })
    }
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