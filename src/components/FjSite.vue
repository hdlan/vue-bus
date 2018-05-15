<template>
  <div class="wapper">
    <div>
    <searchBox></searchBox>
      <!-- <div class="pop_list_title">
        <span class="apptit">实时公交</span>
        <div class="input_area" id="address_input">
          <input placeholder="请输入站点或线路" />
        </div>
      </div> -->
    <div class="line_list" >
        <div class="part" v-for="item in items">
          <router-link :to="{ path:'/simpleMap', query: { siteId: item.siteId,  lineName:item.line.substr(0, item.line.indexOf(';')), siteName: item.site}}">
            <div class="site">
              <span>{{item.site}}</span>
              <span class="sitedistance">{{item.distance}} 米</span>
            </div>
            <div class="tit">
              <span class="name">{{item.line.substr(0,item.line.indexOf(";"))}}</span>
              <span class="distance">距离<strong>{{item.sitenum}}</strong>站</span>
            </div>
            <div class="next_site">下一站：{{item.next_site}}</div>
          </router-link>
        </div>
    </div>
    <div class="column">
      <router-link to="/">
        <div class="column_item"><img src="../assets/line/bus.png" />
          <br/>乘车</div>
      </router-link>
      <router-link to="/LineTransfer">
        <div class=" column_item gray"><img src="../assets/line/line2.png" />
          <br/>路线</div>
      </router-link>
    </div>
    <div class="sm_noneTic" v-bind:class="{ toggle: isShow }">
      <img src="../assets/line/icon-none.png" alt="无数据" />
      <strong>暂无车辆信息</strong>
    </div>
    </div>
  </div>
</template>


<script>
import AMap from 'AMap'
import Vue from 'Vue'
import axios from 'axios'
import searchBox from './searchBox.vue'

export default {
  name: 'FjSite',
  data () {
    return {
      isShow: false,
      items: [],
      lineSite: [],
      lineInfos: []
    }
  },
  mounted: function () {
    this.home = 'block'
    this.lineInfo()
    axios.get('/api/posts', {}).then(
      m => console.log(m.data)
      )
    AMap.service(['AMap.PlaceSearch'], function () {
      var placeSearch = new AMap.PlaceSearch({ // 构造地点查询类
        pageSize: 4,
        typ: '',
        pageIndex: 1,
        city: '苏州' // 城市
      })
        // 中心点坐标
        // [currentLocation.lng,currentLocation.lat]
        // 120.6400961887,31.1411187922
      var currentLocation = true
      if (currentLocation !== undefined) {
        placeSearch.searchNearBy('公交站点', [120.6400961887, 31.1411187922], 1500, function (status, result) {
          if (status === 'complete' && result.info === 'OK') {
            var pois = result.poiList.pois
            var random = [4, 4, 24, 14]
            pois.forEach((item, index) => {
              this.items.push({
                site: item.name.substr(0, item.name.indexOf('(')),
                line: item.address,
                distance: item.distance,
                next_site: '',
                sitenum: random[index],
                siteId: item.id
              })
              this.lineInfo(item.address.substr(0, item.address.indexOf(';') - 1), item.id, index)
            })
            console.log(result.poiList)
          }
        }.bind(this))
      }
    }.bind(this))
  },
  methods: {
    lineInfo: function (linename, id, index) {
      console.log(linename, index)
      AMap.service(['AMap.LineSearch'], function () {
        var linesearch = new AMap.LineSearch({
          pageIndex: 1,
          city: this.city,
          pageSize: 10,
          extensions: 'all' // 返回全部信息
        })
        linesearch.search(linename, function (status, result) {
              // 取回公交路线查询结果
          console.log(status)
          if (status === 'complete' && result.info === 'OK') {
            var tips = result.lineInfo[0]
            var num = ''
            this.isShow = true
            console.log('posi:', tips, id, index)
            Vue.set(this.lineInfos, index, tips)
            Vue.set(this.lineSite, index, tips.via_stops)
            Vue.set(this.items[index], 'lineId', tips.id)
            if (tips.id !== '' && undefined !== tips.id) {
              for (let j = 0; j < tips.via_stops.length; j++) {
                if (tips.via_stops[j].id === id) {
                  num = j + 1
                  break
                }
              }
              if (num !== tips.via_stops.length) {
                console.log('下一站：', num)
                Vue.set(this.items[index], 'next_site', tips.via_stops[num].name)
              } else {
                Vue.set(this.items[index], 'next_site', '当前站为终点站')
              }
            }
          } else {
            this.isShow = true
          }
        }.bind(this))
      }.bind(this, linename, id, index))
    }
  },
  components: {
    searchBox
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/*新搜索框*/
.toggle{
  display: none;
}
.pop_list_title {
  width: 100%;
  height: 0.88rem;
  padding: 0.14rem 0.2rem;
  background: #36A3F9;
  overflow: hidden;
  position: fixed;
  left: 0;
  top: 0;
}

.pop_list_title .closespan {
  float: right;
  display: block;
  width: 0.9rem;
  height: 0.6rem;
  line-height: 0.6rem;
  font-size: 0.32rem;
  color: #fff;
}

.pop_list_title .input_area {
  float: left;
  width: 70%;
  padding: 0.12rem;
  height: 0.6rem;
  background: #5DB4F9;
  margin-left: 0.1rem;
  border-radius: 0.16rem;
}

.pop_list_title .input_area input::-webkit-input-placeholder {
  color: #fff;
}

.pop_list_title .input_area input {
  font-size: 0.28rem;
  color: #fff;
  display: block;
  width: 90%;
  padding-left: 0.52rem;
  height: 0.36rem;
  line-height: 0.36rem;
  background: url(../assets/line/search2.png) no-repeat left center;
  background-size: 0.36rem 0.36rem;
  border: none;
}
.line_list{
}
.line_list .part{
  background: #fff;
  color:#292A2C;
  font-size: 0.32rem;
  height:2.2rem;
  width:100%;
  margin-bottom: 0.2rem;
  padding:0.3rem;
  text-align:left;
}
.line_list .site{
  padding-left: 0.52rem;
  margin-bottom: 0.2rem;
    background:url(../assets/line/position.png) left no-repeat;
    background-size:0.36rem; 
}
.line_list .tit{
  height: 0.42rem;
  margin-bottom: 0.2rem;
}
.line_list .name{
  padding-left: 0.52rem;
  float: left;
  background:url(../assets/line/car.png) left no-repeat;
    background-size:0.36rem 0.36rem; 
}
.line_list .distance{
  float: right;
  color:#9A9DA0;
  margin-right: 0.35rem;
}
.line_list .sitedistance{
  float: right;
  margin-right: 0.35rem;
}
.line_list .distance strong{
  font-size: 0.28rem;
  color:#292A2C;
  margin:0 0.2rem;
}
.line_list .next_site{
  padding-left:0.56rem;
  color:#9A9DA0;
  font-size: 0.28rem;
}
</style>
