// pages/recharge/recharge.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    'themeData.ifhaschoose':true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    //检查主题是否存在
    app.getFileWhetherHas(that, app.ext.theme);
    app.request('/api/topup_list', function (res) {
      if (res) {
        that.setData({
          'themeData.topup_list': res
        });
      }
    }, {}, true)
  },
  // 选中充值金额
  selected:function(e){
    var nowtab = e.currentTarget.dataset.index;
    this.setData({
      'themeData.currutId': nowtab
    })
  },
  otherPrice:function(){
    this.setData({
      'themeData.ifhaschoose': false
    })
  },
  // 任意金额输入时查询对应满足的充值赠送条件
  checkNum:function(e){
    var that=this;
    var money= e.detail.value;
    console.log(money+'money');
    if (!app.empty(money)){
      app.request('/api/topup_input', function (res) {
        if (res) {
          that.setData({
            'themeData.free': res,
          });
        }
      }, { price:money}, true)
    }
    that.setData({
      'themeData.charge': money
    })
  },
  // 发起充值调用充值
  payFor:function(){
    var that=this;
    var price_id = that.data.themeData.currutId;
    if (typeof (price_id) == 'undefined'){
      wx.showModal({
        title: '请选择充值金额',
        content: '您还未选择充值金额',
      });
      return false;
    }
    var price = that.data.themeData.topup_list[price_id].price;
    var topup_id = that.data.themeData.topup_list[price_id].id;
    if (price !== 'undefined'){
      app.request('/api/topup_publish', function (res) {
        if (res) {
          app.alert(res);
          setTimeout(function(){
            wx.switchTab({
              url: '../usercenter/usercenter',
            })
          },1000);
        }
      }, { price: price , topup_id: topup_id}, true)
    }
  },
  // 任意金额充值
  charge:function(){
      var that = this;
      var price = that.data.themeData.charge;
      if (!app.empty(price)){
        let request_data = { price: price };
        if (typeof (that.data.themeData.free !== 'undefined') && !app.empty(that.data.themeData.free)){
          request_data['topup_id'] = that.data.themeData.free.id;
        }
          app.request('/api/topup_publish', function (res) {
            if (res) {
              app.alert(res);
              setTimeout(function () {
                wx.switchTab({
                  url: '../usercenter/usercenter',
                })
              }, 1000);
            }
          }, request_data , true);
       
      }
      else{
        app.alert('请输入充值金额');
      }
  },
  /**
   *  获取所有充值金额列表
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