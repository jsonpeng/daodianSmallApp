// page/index/index.js
var app = getApp();
Page({
  /**
   * 组件的初始数据
   */
  data: {
    themeData:{
    //主题配置标识
    theme: '',
    //第三方平台扩展数据
    ext:app.ext,
    //店铺列表
    shops:[],
    //对应shop的数据
    shop_tab:'',
    //全部分类
    cats:[],
    //对应分类的商品tab 默认0是全部商品
    productTab:-1,
    // 首页轮播
    bannerSet: {
      indicatorDots: false, //是否显示面板指示点，默认为false;
      autoplay: true, //是否自动切换，默认为false;
      interval: 4000,//自动切换时间间隔，默认5000ms;
      circular: true,//是否采用衔接滑动
      duration: 1000,//滑动动画时长，默认为1000ms;
      vertical: false,
    },
    swiperSet: {
      indicatorDots: false, //是否显示面板指示点，默认为false;
      autoplay: true, //是否自动切换，默认为false;
      interval: 5000,//自动切换时间间隔，默认5000ms;
      circular: true,//是否采用衔接滑动
      duration: 1000,//滑动动画时长，默认为1000ms;
      vertical: true,
    },
    }
  },
  onLoad: function (options){
    let that=this;
    app.getUserInfo(null, function () {
      //获取店铺列表
      app.getShops(that,function(res){
        that.basicIndexFunc(that);
      });
    });
    console.log(app.ext);
  },
  //首页初始化接口
  basicIndexFunc:function(obj){
    //检查主题是否存在
    app.getFileWhetherHas(obj, app.ext.theme);
    //获取通知消息
    app.getMessage(obj);
    //获取首页横幅
    app.getBanners(obj, 'index');
    //获取所有公告
    app.getNoticesAll(obj);
    //获取全部分类
    app.getCatsAll(obj);
    //获取全部产品
    app.getProductsAll(obj);
  },
  // 默认搜索框weui
  showInput: function () {
    this.setData({
      'themeData.inputShowed': true
    });
  },
  hideInput: function () {
    this.setData({
      'themeData.inputVal': "",
      'themeData.inputShowed': false
    });
  },
  clearInput: function () {
    this.setData({
      'themeData.inputVal': ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      'themeData.inputVal': e.detail.value
    });
  },
  scrollFunc: function (e) {
    var scrollTop = false
    if (e.detail.scrollTop > 0) {
      scrollTop = true
    }
    //console.log(e.detail);
  },
  //搜索
  searchword: function (e) {
    app.searchProducts(this, e.detail.value);
    this.setData({
      'themeData.inputShowed': true
    })
  },
  //取消搜索
  searchCancel: function (e) {
    this.setData({
      'themeData.search_product_list': [],
      'themeData.search_val': '',
      'themeData.inputShowed': false
    });
  },
  onShow:function(){
    this.basicIndexFunc(this);
  },
  //地图中打开
  openMap:function(e){
    app.openMap(e.currentTarget.dataset.jindu, e.currentTarget.dataset.weidu);
    // wx.chooseLocation({
    //   success: function(res) {
    //       console.log(res);
    //   },
    // })
  },
  //打电话
  phone:function(e){
    app.phone(e.currentTarget.dataset.tel);
  },
  //切换tab
  switchTab: function (e) {
    var cat_id = e.currentTarget.dataset.id;
    var nowtab = e.currentTarget.dataset.index;
    console.log(cat_id);
    console.log(nowtab);
    if (nowtab != -1){
      this.setData({
        'themeData.productTab': nowtab
      })
      app.getCatProductByCatId(this, cat_id, nowtab);
    }
    else{
      app.getProductsAll(this);
      this.setData({
        'themeData.productTab': nowtab
      })
    }
  },
  /**
 * 用户点击右上角分享
 */
  onShareAppMessage: function () {

  }
})
