// pages/issue/issue.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    themeData:{
      issue:[
        {
          'logo':'../../images/c1.png',
          'name':'老乡鸡',
          'humanTime':'1个月前',
          'content':'全场8折，无限制使用',
          'images':[
              {
                'url':'../../images/p1.jpg',
                '':''
              },
              {
                'url': '../../images/p2.jpg',
                '': ''
              },
              {
                'url': '../../images/p3.jpg',
                '': ''
              },
              {
                'url': '../../images/p4.jpg',
                '': ''
              },
          ],
          'products':[
            {
              'image':'../../images/c2.png',
              'id':'1',
              'name':'窗前明月光',
              'price':'100',
              'originalPrice':'180'
            },
            {
              'image': '../../images/c2.png',
              'id': '1',
              'name': '疑是地上霜',
              'price': '100',
              'originalPrice': '180'
            },
            {
              'image': '../../images/c2.png',
              'id': '1',
              'name': '举头望明月',
              'price': '100',
              'originalPrice': '180'
            },
            {
              'image': '../../images/c2.png',
              'id': '1',
              'name': '低头思故乡',
              'price': '100',
              'originalPrice': '180'
            }

          ],
          '':'',
          '':'',
          '':''
        }
      ]
    }
  },
  //删除发布
  deleteIssue:function(e){
    let that = this;
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let issue = that.data.themeData.issue;
    wx.showModal({
      content: '确定要删除吗',
      cancelText: '取消',
      confirmText: '确定',
      confirmColor: '#ff4e44',
      success: function (res) {
        if (res.confirm) {
          //删除文章
          app.request('/api/delete_post',function(res){
                if(res){
                  app.alert(res);
                  issue.splice(index,1);
                  that.setData({
                    'themeData.issue': issue
                  });
                }
          },{id:id},true);
        }
      }
    });
  },
  //预览图片
  previewImage: function (e) {
    var index = e.currentTarget.dataset.index;
    var imageindex = e.currentTarget.dataset.imageindex;
    var image_arr = this.data.themeData.issue[index]['images'];
    var image_new_arr = [];
    //处理image_arr
    for (var i in image_arr) {
      image_new_arr.push(image_arr[i]['url']);
    }
    app.previewImage(image_new_arr, imageindex);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;

    //检查主题是否存在
    app.getFileWhetherHas(that, app.ext.theme);

    
    app.request('/api/user_posts', function (res) {
      if (res) {
        that.setData({
          'themeData.issue':res
        })
      }
    }, {}, true);
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