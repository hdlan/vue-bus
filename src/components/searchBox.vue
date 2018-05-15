<template>
	<div class="search_box">
      <div class="search">
        <span>查公交，搜路线</span>
      </div>
    </div>
</template>
<script>
export default {
}
</script>
<style scoped>
.search_box{
  background:#36A3F9;
  height:0.88rem;
  width:100%;
  padding-top:0.14rem;
}
.search{
  text-align: center;
    margin:0 auto;
    border-radius: 2rem;
    height:0.6rem;
    line-height: 0.6rem;
    width:90%;
    background:#88bfec;
    font-size: 0.28rem;
    color:#fff;
}
.search_box span{
    padding-left:0.56rem;
    line-height: 0.6rem;
    background: url(../assets/line/search2.png) no-repeat left;
    background-size: 0.32rem;
}
</style>