<template>
  <div class="wapper">
    <div class="info_wapper">
      <div class="line_info">
        <div class="site">
          <span class="from" id="from">{{ from }}</span>
          <span class="to" id="to">{{ to }}</span>
        </div>
        <div class="tit">
          <span class="time_s">首班:<strong >{{ time_s }}</strong></span>
          <span class="time_e">末班:<strong >{{ time_e }}</strong></span>
          <span class="price">票价:<strong >{{ pay }}</strong>元</span>
        </div>
      </div>
      <div class="distance">
        <div class="time" id="distance">
          <span v-if="haveBus">距 <strong id="dis_num">{{siteNum}}</strong> 站</span>
          <span v-else>暂无车辆</span>
        </div>
        <span class="arr">到达</span>
        <span class="next_site">{{text}}</span>
      </div>
    </div>
    <div class="site_list">
      <div class="wapper_sitelist">
        <ul class="road" :style="{width: listWidth + 'rem'}">
          <li class='part' v-for="(item, index) in siteList" @click="showActive(index, item.siteName)">
            <span class="dot_p" :class="{'dot_show': ind === index}"></span>
            <span class='dot_r'></span>
            <div class='name'>
              <span class='dot_d ' :class="{'dot_d_show': ind === index}"></span>
              <span class='text ' :class="{'text_show': ind === index}">{{item.siteName}}</span>
            </div>
          </li>
        </ul>
        <div class="bus_road" :style="backImage"></div>
      </div>
      <div id="gotomap" class="button" style="right:1.24rem">
        <img src="../assets/line/map.png" />
        <span>地图</span>
      </div>
      <div class="button" style="right:0.3rem" @click="changeDirect">
        <img src="../assets/line/change3.png" />
        <span>换向</span>
      </div>
    </div>
  </div>
</template>
<script>
import AMap from 'AMap'

export default {
  name: 'simpleMap',
  data () {
    return {
      siteId: this.$route.query.siteId,
      lineName: this.$route.query.lineName,
      siteName: this.$route.query.siteName,
      siteList: [],
      time_s: '',
      time_e: '',
      from: '',
      busPosition: [2, 5, 11],
      to: '',
      lineInfo: [],
      listWidth: '',
      isActive: false,
      pay: '',
      ind: '',
      text: this.$route.query.siteName,
      lineId: '',
      backImage: {
        backgroundImage: 'url(' + require('../assets/line/bus.png') + '),url(' + require('../assets/line/bus.png') + '),url(' + require('../assets/line/bus.png') + ')',
        backgroundPosition: '2rem,5rem,11rem',
        width: ''
      },
      siteNum: '0',
      haveBus: true
    }
  },
  mounted: function () {
    AMap.service(['AMap.LineSearch'], function () {
      var linesearch = new AMap.LineSearch({
        pageIndex: 1,
        city: this.city,
        pageSize: 20,
        extensions: 'all' // 返回全部信息
      })
      linesearch.search(this.lineName, function (status, result) {
        // 取回公交路线查询结果
        if (status === 'complete' && result.info === 'OK') {
          this.lineInfo = result.lineInfo
          var tips = result.lineInfo[0]
          console.log(tips)
          this.from = tips.start_stop + '-'
          this.to = tips.end_stop
          this.lineId = tips.id
          if (tips.stime.length !== 0 && tips.length !== 0) {
            this.time_s = tips.stime.substr(0, 2) + ':' + tips.stime.substr(2, 2)
            this.time_e = tips.etime.substr(0, 2) + ':' + tips.etime.substr(2, 2)
          } else {
            this.time_s = '05:40'
            this.time_e = '18:40'
          }
          this.pay = tips.basic_price
          this.listWidth = tips.via_stops.length
          this.backImage.width = tips.via_stops.length + 'rem'
          tips.via_stops.forEach((item, index) => {
            if (item.id === this.siteId) {
              this.ind = index
              console.log(index)
              this.showActive(this.ind, this.siteName)
            }
            this.siteList.push({
              siteName: item.name,
              siteLat: item.location.lat,
              siteLng: item.location.lng
            })
          })
        } else {
          // 无数据或者查询失败
        }
        // setInterval(busposition(), 60000)
      }.bind(this))
    }.bind(this))
  },
  methods: {
    showActive: function (index, siteName) {
      this.ind = index
      this.text = siteName
      var TF = false
      for (let i = 0; i <= this.busPosition.length; i++) {
        if (index + 1 > this.busPosition[i]) {
          this.haveBus = true
          this.siteNum = index + 1 - this.busPosition[i]
          TF = true
        }
      }
      if (TF === false) {
        this.haveBus = false
      }
    },
    changeDirect: function () {
      for (let i = 0; i < this.lineInfo.length; i++) {
        console.log(this.lineInfo[i].name.substr(0, this.lineInfo[i].name.indexOf('(')))
        if (this.lineInfo[i].id !== this.lineId && this.lineName === this.lineInfo[i].name.substr(0, this.lineInfo[i].name.indexOf('('))) {
          var tips = this.lineInfo[i]
          console.log(tips)
          this.siteList = []
          this.from = tips.start_stop + '-'
          this.to = tips.end_stop
          this.lineId = tips.id
          if (tips.stime.length !== 0 && tips.length !== 0) {
            this.time_s = tips.stime.substr(0, 2) + ':' + tips.stime.substr(2, 2)
            this.time_e = tips.etime.substr(0, 2) + ':' + tips.etime.substr(2, 2)
          } else {
            this.time_s = '05:40'
            this.time_e = '18:40'
          }
          this.pay = tips.basic_price
          this.listWidth = tips.via_stops.length
          tips.via_stops.forEach((item, index) => {
            if (item.id === this.siteId) {
              this.ind = index
              this.showActive(this.ind, this.siteName)
              console.log(index)
            }
            this.siteList.push({
              siteName: item.name,
              siteLat: item.location.lat,
              siteLng: item.location.lng
            })
          })
          break
        }
      }
    }
  }
}
</script>
<style scoped>
.info_wapper {
  height: 3.12rem;
  background: #36A3F9;
  padding: 0.3rem;
}

.info_wapper .info {}

.info_wapper .site {
  font-size: 0.32rem;
  color: #fff;
  margin-bottom: 0.2rem;
  text-align: left;
}

.info_wapper .site span {
  width: 40%;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.info_wapper .from {
  padding-left: 0.52rem;
  background: url(../assets/line/position2.png) no-repeat left;
  background-size: 0.28rem 0.32rem;
}

.info_wapper .tit {
  color: #fff;
  font-size: 0.26rem;
  padding-left: 0.52rem;
  margin-bottom: 0.2rem;
  height: 0.42rem;
}

.info_wapper .tit span {
  float: left;
  margin-right: 0.3rem;
}

.info_wapper .distance {
  height: 1.3rem;
  background: #fff;
  border-radius: 0.08rem;
  font-size: 0rem;
  color: #B7BABB;
  line-height: 1.3rem;
  text-align: center;
}

.info_wapper .time {
  float: left;
  width: 40%;
  font-size: 0.26rem;
  height: 1.3rem;
  line-height: 1.3rem;
}

.info_wapper .time strong {
  font-size: 0.32rem;
  color: #353738;
}

.info_wapper .arr {
  float: left;
  width: 20%;
  font-size: 0.26rem;
}

.info_wapper .next_site {
  width: 40%;
  font-size: 0.32rem;
  color: #353738;
  text-overflow: ellipsis;
  line-height: 0.4rem;
  display: inline-block;
  vertical-align: middle;
}




/*站点列表*/

.site_list {
  width: 100%;
  height: 100%;
  position: relative;
  padding-top: 1.64rem;
}

.site_list .button {
  width: 0.64rem;
  height: 0.64rem;
  border-radius: 50%;
  background: #fff;
  position: absolute;
  top: 0.4rem;
  font-size: 0.12rem;
  color: #36A3F9;
  line-height: 0.34rem;
  text-align: center;
}

.site_list .bus_road {
  height: 0.28rem;
  background-repeat: no-repeat;
  background-size: 0.48rem 0.24rem;
  position: absolute;
  top: 0.3rem;
  left: 0;
  z-index: 1001;
}

.site_list .button span {
  font-size: 0.24rem;
  transform: scale(0.7);
  display: block;
}

.site_list .button img {
  width: 0.24rem;
  display: block;
  margin: 0 auto;
  margin-top: 0.05rem;
}

.site_list .wapper_sitelist {
  width: 100%;
  overflow-x: scroll;
  position: relative;
  -webkit-overflow-scrolling: touch;
}

.wapper_sitelist::-webkit-scrollbar {
  display: none;
}

.site_list .road {}

.site_list .part {
  width: 1rem;
  float: left;
}

.site_list .dot_p {
  width: 1rem;
  height: 0.36rem;
  display: block;
}

.site_list .dot_show {
  background: url(../assets/line/position_red.png) no-repeat center;
  background-size: 0.28rem 0.36rem;
}

.site_list .dot_r {
  width: 1rem;
  height: 0.2rem;
  background: url(../assets/line/road.png) no-repeat center;
  background-size: 100%;
  margin-top: 0.1rem;
  display: block;
}

.site_list .name {
  width: 0.36rem;
  margin: auto;
}

.site_list .dot_d {
  width: 0.12rem;
  height: 0.12rem;
  border-radius: 50%;
  background: #B3B3B3;
  margin-top: 0.1rem;
  margin-right: 0.12rem;
  display: block;
  float: right;
}

.site_list .dot_d_show {
  background: #F0585D;
}

.site_list .text_show {
  color: #F0585D;
}

.site_list .text {
  font-size: 0.32rem;
  width: 0.36rem;
  margin-top: 0.2rem;
  float: right;
}

</style>
