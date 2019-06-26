// pages/message/message.js
var app = getApp();
var cardTeams;
var startX;
var startY;
var endX;
var endY;
var key;
var maxRight = 87.5;
var first = true;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    themeData:{
      addressList: [{ "Contact": "钟诚", "Mobile": 13888888888, "Address": "江苏省苏州市工业园区创意产业园" },
      { "Contact": "凹凸曼", "Mobile": 13666666666, "Address": "江苏省苏州市工业园区独墅湖体育馆" },
      { "Contact": "图傲曼", "Mobile": 13666666666, "Address": "江苏省苏州市工业园区独墅湖体育馆" }],
      editIndex: 0,
      delBtnWidth: 150//删除按钮宽度单位（rpx）
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //检查主题是否存在
    app.getFileWhetherHas(that, app.ext.theme);
    //获取所有通知消息
    app.getMessage(that,false);
    //把未读取的置为已读
    app.setMessageRead();
  },
  drawStart: function (e) {
    console.log("drawStart");  
    var touch = e.touches[0];
    var index = parseInt(e.currentTarget.dataset.index);
    startX = touch.clientX;
    startY = touch.clientY;
    var cardTeams = this.data.themeData.messages;
    for (var i in cardTeams) {
      var data = cardTeams[index];
      data.startRight = data.right;
    }

    key = true;
  },
  drawEnd: function (e) {
    console.log("drawEnd");
    var cardTeams = this.data.themeData.messages;
    var index = parseInt(e.currentTarget.dataset.index);
    for (var i in cardTeams) {
      var data = cardTeams[index];
      if (data.right <= 100 / 2) {
        data.right = 0;
      } else {
        data.right = maxRight;
      }
    }
    this.setData({
      'themeData.messages': cardTeams
    });
  },
  drawMove: function (e) {
    console.log("drawMove");  
    var self = this;
    var dataId = e.currentTarget.id;
    var cardTeams = this.data.themeData.messages;
    if (key) {
      var touch = e.touches[0];
      endX = touch.clientX;
      endY = touch.clientY;
      console.log("startX=" + startX + " endX=" + endX);
      if (endX - startX == 0)
        return;
      var res = cardTeams;
      //从右往左  

      if ((endX - startX) < 0) {
        for (var k in res) {
          var data = res[k];
          if (res[k].id == dataId) {
            var startRight = res[k].startRight;
            var change = startX - endX;
            startRight += change;
            if (startRight > maxRight)
              startRight = maxRight;
            res[k].right = startRight;
          }
        }
      } else {//从左往右  
        for (var k in res) {
          var data = res[k];
          if (res[k].id == dataId) {
            var startRight = res[k].startRight;
            var change = endX - startX;
            startRight -= change;
            if (startRight < 0)
              startRight = 0;
            res[k].right = startRight;
          }
        }
      }
      self.setData({
        'themeData.messages': cardTeams
      });

    }
  },
  //删除item  
  delItem: function (e) {
    let that = this;
    var id = e.target.dataset.id;
    var index =parseInt(e.target.dataset.index);
    var messages = that.data.themeData.messages;
    console.log("删除" + id);
    //请求服务器删除item
    app.request('/api/delete_notice',function(res){
        if(res){
          messages.splice(index,1);
          that.setData({
            'themeData.messages': messages
          });
          app.alert(res);
        }
    } , {notice_id:id} , true);
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
  
  },
  //手指刚放到屏幕触发
  touchS: function (e) {
    console.log("touchS" + e);
    //判断是否只有一个触摸点
    if (e.touches.length == 1) {
      this.setData({
        //记录触摸起始位置的X坐标
        startX: e.touches[0].clientX
      });
    }
  },
  //触摸时触发，手指在屏幕上每移动一次，触发一次
  touchM: function (e) {
    console.log("touchM:" + e);
    var that = this
    if (e.touches.length == 1) {
      //记录触摸点位置的X坐标
      var moveX = e.touches[0].clientX;
      //计算手指起始点的X坐标与当前触摸点的X坐标的差值
      var disX = that.data.startX - moveX;
      //delBtnWidth 为右侧按钮区域的宽度
      var delBtnWidth = that.data.delBtnWidth;
      var txtStyle = "";
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变
        txtStyle = "left:0px";
      } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度
          txtStyle = "left:-" + delBtnWidth + "px";
        }
      }
      //获取手指触摸的是哪一个item
      var index = e.currentTarget.dataset.index;
      var list = that.data.addressList;
      //将拼接好的样式设置到当前item中
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        addressList: list
      });
    }
  },
  touchE: function (e) {
    console.log("touchE" + e);
    var that = this
    if (e.changedTouches.length == 1) {
      //手指移动结束后触摸点位置的X坐标
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = that.data.startX - endX;
      var delBtnWidth = that.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var list = that.data.addressList;
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      that.setData({
        addressList: list
      });
    }
  }
  
})