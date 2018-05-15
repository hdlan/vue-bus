<template>
    <div class="wapper">
        <div id="home" v-bind:style="{display: home}">
            <!-- <div class="pop_list_title">
                <span class="apptit">实时公交</span>
                <div class="input_area" id="shows">
                    <input placeholder="请输入地点" />
                </div>
            </div> -->
            <searchBox></searchBox>
            <form method="get" action="">
                <div class="search_wapper">
                    <div class="search_area">
                        <div class="row" v-on:click="Toggle('from')">
                            <span class="dot"><img src="../assets/line/arrow.png" alt="" /></span>
                            <input class="int" type="text" name="fromAddressPlace" value="" placeholder="我的位置" v-model="start.from" readonly="readonly" />
                        </div>
                        <div class="row" style="border-bottom: none" v-on:click="Toggle('to')">
                            <span class="dot"><img src="../assets/line/round_gray.png" alt="" /></span>
                            <input class="int" name="toAddressPlace" type="text" placeholder="输入终点" v-model="end.to" readonly="readonly" />
                        </div>
                    </div>
                    <div class="button_area">
                        <span class="ex" v-on:click="change"></span><span class="search" v-on:click="findTrans">搜索</span>
                    </div>
                </div>
            </form>
            <div class="pop_list" id="his_list" style="padding-top: 0">
                <!--                 <div class="his">历史记录</div>
                <ul>
                    <li class="his_item">
                        <span class="from">我的位置</span>
                        <span class="dot"></span>
                        <span class="to">某某地点</span>
                    </li>
                </ul> -->
            </div>
            <div class="column">
                <router-link to="/">
                    <div class="column_item gray"><img src="../assets/line/bus2.png" />
                        <br/>乘车</div>
                </router-link>
                <div class="column_item"><img src="../assets/line/line.png" />
                    <br/>路线</div>
            </div>
        </div>
        <div  v-bind:style="{display: about}">
            <div class="pop_list" id="popsiteList">
                <div class="pop_list_title">
                    <span class="apptit"></span>
                    <div class="input_area" id="address_input" style="width:86%">
                        <input placeholder="请输入地点" v-model="keywords" v-on:input="showInput" />
                    </div>
                    <span class="closespan" v-on:click="homeShow">取消</span>
                </div>
                <div class="tishi" v-if="isActive">
                    <div class="pormpt">
                        <div class="text">
                            <span class="bar"></span>
                            <span style="width:35%">您可以搜索</span>
                            <span class="bar"></span>
                        </div>
                        <div class="icon">
                            <span><img src="../assets/line/pop_line.png">线路</span>
                            <span><img src="../assets/line/pop_site.png">车站</span>
                            <span><img src="../assets/line/pop_postion.png">地点</span>
                        </div>
                    </div>
                </div>
                <div class="scroll">
                    <div class="title">
                        <span></span>
                    </div>
                    <ul class="max-height" v-for="(item, index) in hisTips">
                        <li  v-on:click="selectInput(index)" class="auto">
                            <span class='site_big'>{{item.name}}</span>
                            <span class='site_del'>{{item.district}}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import AMap from 'AMap'
import searchBox from './searchBox.vue'
import Router from '../router/index.js'

export default {
  name: 'LineTransfer',
  data () {
    return {
      keywords: '',
      home: 'block',
      about: 'none',
      oneorTow: 'from',
      autocomplete: '',
      hisTips: [],
      start: {
        from: '',
        fromAddressLat: '',
        fromAddressLng: ''
      },
      end: {
        to: '',
        toAddressLat: '',
        toAddressLng: ''
      },
      isActive: true
    }
  },
  mounted: function () {
    this.autocomplete = new AMap.Autocomplete({
      city: '苏州'
    })
  },
  methods: {
    Toggle: function (status) {
      this.home = 'none'
      this.about = 'block'
      this.oneorTow = status
      this.keywords = ''
      this.isActive = true
      this.hisTips = []
    },
    homeShow: function () {
      this.home = 'block'
      this.about = 'none'
    },
    showInput: function () {
      console.log(this.keywords)
      this.isActive = false
      this.autocomplete.search(this.keywords, function (status, result) {
        if (status === 'complete' && result.info === 'OK') {
          var tips = result.tips
          this.hisTips = []
          console.log('tips', tips)
          for (let i = 0; i < tips.length; i++) {
            if (tips[i].location !== '' && undefined !== tips[i].location && tips[i].district.substr(0, 6) === '江苏省苏州市') {
              this.hisTips.push({
                lng: tips[i].location.lng,
                lat: tips[i].location.lat,
                name: tips[i].name,
                district: tips[i].district
              })
            }
          }
        } else {
        }
      }.bind(this))
    },
    selectInput: function (index) {
      if (this.oneorTow === 'from') {
        this.start.from = this.hisTips[index].name
        this.start.fromAddressLng = this.hisTips[index].lng
        this.start.fromAddressLat = this.hisTips[index].lat
      } else {
        this.end.to = this.hisTips[index].name
        this.end.toAddressLng = this.hisTips[index].lng
        this.end.toAddressLat = this.hisTips[index].lat
      }
      this.home = 'block'
      this.about = 'none'
    },
    findTrans: function () {
      // eventBus.$emit('inc', [this.start, this.end])
      Router.push({path: '/transferList', query: {from: this.start.from, fromAddressLat: this.start.fromAddressLat, fromAddressLng: this.start.fromAddressLng, to: this.end.to, toAddressLat: this.end.toAddressLat, toAddressLng: this.end.toAddressLng}})
    },
    change: function () {
      console.log(this.start, this.end)
      var {from, fromAddressLng, fromAddressLat} = this.start
      var {to, toAddressLng, toAddressLat} = this.end
      this.start.from = to
      this.start.fromAddressLon = toAddressLng
      this.start.fromAddressLat = toAddressLat
      this.end.to = from
      this.end.toAddressLon = fromAddressLng
      this.end.toAddressLat = fromAddressLat
      console.log(this.start, this.end)
    }
  },
  components: {
    searchBox
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.search_wapper{
  width:100%;
  height: 2.2rem;
  background: #fff;
  color:#999;
  font-size: 0.32rem;
}
.search_wapper .search_area{
  height: 1.8rem;
  width:5rem;
  display: inline-block;
  margin-top:0.16rem;
  margin-left: 0.5rem;
}
.search_wapper .row{
  height:0.9rem;
  border-bottom: 0.02rem solid #dbd6d6;
}
.search_wapper .row img{
  height:0.36rem;
}
.search_wapper .dot{
  line-height: 0.9rem;
}
.search_wapper .int{
  background-color:transparent;
  color:#000;
}
::-webkit-input-placeholder { /* WebKit browsers */  
    color:#999;
}  
.search_wapper .button_area{
  float: right;
  margin-top: 0.16rem;
  margin-right: 0.3rem;
  height: 1.8rem;
  width:1.6rem;
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
.search_wapper .ex{ 
  width: 0.3rem;
  background: url(../assets/line/change.png) no-repeat center center;
  background-size: 0.3rem 0.36rem;
  margin-left:0.32rem;
}
.search_wapper .search{
  float: right;
  color: #999;  
}
.search_wapper .button_area span{
    display: inline-block; 
    height: 1.8rem;
  line-height: 1.8rem;
}
/*提示*/
.tishi{
  width:100%;
  height:4rem;
  color:#999;
  text-align: center;
  font-size: 0;
  padding-top:1rem;
}
.tishi span{
  display: inline-block;
  width:33%;
}
.tishi .pormpt{
  width:60%;
  margin:0 auto;
}
.tishi .text{
  height:1.4rem;
  line-height: 1.4rem;
  font-size: 0.28rem;
  color:#999;
}
.tishi .bar{
  height:0.02rem;
  border-top:0.02rem solid #999;
  width:20%;
  vertical-align: middle;
}
.tishi .icon span{
    width:33%;
  font-size: 0.24rem;
  color:#999;
}
.tishi .icon img{
  width:0.52rem;
  display: block;
  margin:0 auto;
  margin-bottom: -0.2rem;
}
/*历史记录*/
.pop_list {
    width: 100%;
    background: #efeff4;
    /*position:fixed;top:0;*/
    z-index: 1001;
    padding-top: 0.88rem;
    position: relative;
}
.pop_list li span {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    padding-left: 0.52rem;
}
.pop_list_title .closespan {
    float: right;
    display: block;
    width: 0.7rem;
    height: 0.6rem;
    line-height: 0.6rem;
    font-size: 0.28rem;
    color: #fff;
}
.pop_list .his{
  width: 100%;
  height:0.7rem;
  font-size: 0.28rem;
  color:#B7BABB;
  background:#F2F2F2;
  line-height: 0.7rem;
  padding-left: 0.3rem;
}
.pop_list .his_item{
  height: 0.9rem;
  background:#fff;
  padding-left: 0.3rem;
  font-size: 0rem;
}
.pop_list .his_item span{
  display: inline-block;
  font-size: 0.28rem;
  height:0.9rem;
  line-height: 0.9rem;
  vertical-align: middle;
}
.pop_list .from{
  color:#B7BABB;
  padding-left: 0.56rem;
  background: url(../assets/line/arrow.png) no-repeat left;
  background-size: 0.36rem;
}
.pop_list .dot{
  margin:0 0.15rem;
  width:0.24rem;
  background:url(../assets/line/to.png) no-repeat left;
  background-size: 0.24rem 0.16rem;
  padding-left: 0;
}
.pop_list .to{
  color:#353738;
  padding-left: 0;
}
.remove{border-bottom: none;}
.pop_list ul {
    background: #fff;
}

.pop_list ul li {
    border-bottom: 1px solid #dbe3ea;
    height: 0.88rem;
    line-height: 0.38rem;
    padding-left: 0.34rem;
    overflow:hidden;
}
.pop_list .auto{
    background: url(../assets/line/position.png) no-repeat left;
    background-size: 0.28rem 0.36rem;
    background-position: 0.4rem;
    text-align: left;
}
.site_big {
    display: block;
    font-size: 0.32rem;
    color: #4A4A4A;
    margin-top: 0.08rem;
    /*line-height: 0.68rem;*/
}
.site_del {
    display: block;
    height: 0.36rem;
    line-height: 0.36rem;
    font-size: 0.24rem;
    color: #9b9b9b;
}
.clearhistory {
    background: #fff;
    height: 1.08rem;
    line-height: 0.76rem;
    padding: 0.16rem 0.4rem;
    text-align: center;
    font-size: 0.32rem;
    color: #4A4A4A;
}
/*查询线路*/
.tag {
    background-color: #fff;
    width: 100%;
    height: 0.8rem;
    font-size: 0.32rem;
}

.tag a:hover{
    color: #36A3F9;
    border-bottom: 1px solid #36A3F9;
}

.tag a {
    text-align: center;
    display: inline-block;
    height: 0.8rem;
    line-height: 0.8rem;
    width: 1.6rem;
    color: #9A9DA0;
}
.line_wapper .line_info{
  height:1.7rem;
  margin:0.2rem 0;
  background: #fff;
  padding:0.3rem;
}
.line_wapper .site{
    font-size: 0.32rem;
    color: #292A2C;
    margin-bottom: 0.3rem;
    height: 0.4rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.line_wapper .site .dot_s{
  float: left;
  width:0.56rem;
  height:0.42rem;
  background: url(../assets/line/car.png) no-repeat left center;
    background-size: 0.36rem 0.32rem;
}
.line_wapper .site span{
    width: 40%;
    white-space:nowrap;
    text-overflow: ellipsis;
}
.line_wapper .from{

}
.line_wapper .tit{
    color:#9A9DA0;
    font-size: 0.26rem;
    padding-left:0.58rem;
    margin-bottom: 0.2rem; 
    height:0.42rem;
}
.line_wapper .tit span{
    float: left;
    margin-right: 0.3rem;
    max-width: 30%;
    overflow:hidden;
    text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
