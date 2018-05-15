<template>
    <div class="wapper">
        <div class="line_wapper" id="search_result">
            <div class="tag">
                <a id="time" style="margin-left:0.4rem;" v-bind:class="{active: defaults}" v-on:click='change(0)'>较快捷</a><a id="walk" style="margin-left:0.8rem;" v-on:click='change(3)'>少步行</a><a id="transfle" style="margin-left:0.8rem;" v-on:click='change(2)'>少换乘</a>
            </div>
            <div id="time_list" v-for='item in plan'>
                <div class="line_info">
                    <div class="site">
                        <span class="dot_s"></span>
                        <span class="from">{{item.trans.join('-')}}</span>
                    </div>
                    <div class="tit">
                        <span class="time_s">约 {{item.time}} 分钟</span>
                        <span class="price">票价:{{item.cost}}元</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="sm_noneTic" v-bind:style="{display:none_data}" id="none_data">
            <img src="../assets/line/icon-none.png" alt="无数据" />
            <strong>暂无线路信息</strong>
        </div>
    </div>
</template>

<script>
import AMap from 'AMap'

export default {
  name: 'transferList',
  data () {
    return {
      transfer: '',
      none_data: 'none',
      oneorTow: 'from',
      autocomplete: '',
      keywords: '',
      plan: []
    }
  },
  mounted: function () {
    AMap.service('AMap.Transfer', function () { // 回调函数
      // 实例化Transfer
      var transptions = {
        policy: 0, // 乘车策略，少时间0 少步行3 最少换乘2
        city: '苏州'  // 城市
      }
      this.transfer = new AMap.Transfer(transptions)
      this.Linesearch()
    }.bind(this))
  },
  methods: {
    Toggle: function (status) {
      this.home = 'none'
      this.about = 'block'
      this.oneorTow = status
    },
    homeShow: function () {
      this.home = 'block'
      this.about = 'none'
    },
    change: function (status) {
      this.defaults = false
      console.log(status)
      var transptions = {
        policy: status, // 乘车策略，少时间0 少步行3 最少换乘2
        city: '苏州'  // 城市
      }
      this.transfer = new AMap.Transfer(transptions)
      this.Linesearch()
    },
    Linesearch: function () {
      this.plan = []
      console.log(this.$route.query.fromAddressLat, this.$route.query.fromAddressLng, this.$route.query.toAddressLat, this.$route.query.toAddressLng)
      this.transfer.search([this.$route.query.fromAddressLng, this.$route.query.fromAddressLat], [this.$route.query.toAddressLng, this.$route.query.toAddressLat], function (status, result) {
        console.log(status)
        console.log(result)
        if (status === 'complete' && result.info === 'OK') {
          var plans = result.plans
          console.log('plans', plans)
          for (var i = 0; i < plans.length; i++) {
            var cost = plans[i].cost
            var time = parseInt(plans[i].time / 60)
            var segments = plans[i].segments
            var trans = []
            if (segments !== '' && segments !== undefined) {
              for (var j = 0; j < segments.length; j++) {
                if (segments[j].transit_mode === 'BUS') {
                  const linename = segments[j].instruction
                  trans.push(linename.substr(2, linename.indexOf('(') - 2))
                } else if (segments[j].transit_mode === 'SUBWAY') {
                  const linename = segments[j].instruction
                  trans.push(linename.substr(2, linename.indexOf('线') - 2))
                }
              }
            }
            this.plan.push({
              cost: cost,
              time: time,
              trans: trans
            })
          }
        } else {
        }
      }.bind(this))
    }
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
  margin-top:0.88rem;
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
  float: right  
}
.search_wapper .button_area span{
    display: inline-block; 
    height: 1.8rem;
  line-height: 1.8rem;
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
.active{
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
    text-align: left;
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
