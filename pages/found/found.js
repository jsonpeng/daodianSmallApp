// pages/found/found.js
var app = getApp();

var basicdata = {
  toptab: 0,
  bottomtab: 0,
  type: 0,
  whetherShowMore: false,
  winHeight: app.winHeight,
  logo:''
};
Page({
  /**
   * 页面的初始数据
   */
  data: {
    logo:'',
    themeData: {},
    theme: 'social',
    post_cat_all:[
      {
      'id':'1',
      'name':'我要购',
      'slug':'wo-yao-gou',
      'image':'../../images/'
      },
    ],
    showHotNews:true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //检查主题是否存在
    app.getFileWhetherHas(that, app.ext.theme);
    app.getSystemHeightAndWidth(that, true);
    that.setData({
      tabBar: app.tabBar,
      themeData: basicdata
    });
    //获取话题分类列表
    app.getFoundsCats(that);
    //获取话题分类列表
    app.getFoundsPosts(that);
     
  },
  back: function (e) {
    this.setData({
      'themeData.type': 0
    });
    app.getFoundsPosts(this);
  },
  previewImage: function (e) {
    var index = e.currentTarget.dataset.index;
    var imageindex = e.currentTarget.dataset.imageindex;
    var image_arr = this.data.themeData.post_found[index]['images'];
    var image_new_arr = [];
    //处理image_arr
    for (var i in image_arr) {
      image_new_arr.push(image_arr[i]['url']);
    }
    app.previewImage(image_new_arr, imageindex);
  },
  /**
   * 切换底部tab (最新/热门切换)
   */
  switchBottomTab: function (e) {
    var that = this;
    //当前点击的index
    var nowtab = parseInt(e.currentTarget.dataset.index);
    //存在页面数据中的当前tab
    var bottomtab = parseInt(that.data.themeData.bottomtab);
    var cat_id = that.data.themeData.type;
    // that.setData({
    //   'themeData.post_found': []
    // });

    //热门的 //最新的
    app.getFoundsPosts(that, nowtab, cat_id);

    that.setData({
      'themeData.bottomtab': nowtab,
      'themeData.whetherShowMore': false,
      'thmeData.showHotNews': false
    });

  },
  /**
   * 切换顶部分类
   */
  switchFoundCat: function (e) {
    var that = this;
    var cat_id = parseInt(e.currentTarget.dataset.id);

    var nowtab = parseInt(that.data.themeData.bottomtab);

    that.setData({
      'themeData.bottomtab': 0,
      'themeData.type': cat_id,
      'themeData.whetherShowMore': false
    });

    //热门的 //最新的
    app.getFoundsPosts(that, nowtab, cat_id);
  },
  /**
 * 下拉无限加载
 */
  pullUpLoad: function () {
    //console.log('下拉');
    var that = this;
    console.log(that.data.themeData.whetherShowMore);
    app.getFoundsPosts(that, parseInt(that.data.themeData.bottomtab), that.data.themeData.type, true, that.data.themeData.post_found.length);


  },
  /**
   * 切换顶部tab (分类间切换)
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
    //app.setTabBar(app.getStorageName('theme').name, this);
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