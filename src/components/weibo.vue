<template>
  <el-row :gutter="20" class="weibo">
    <el-col class='display' :span="4">
      <img src='../assets/images/weibo.png'>
    </el-col>
    <el-col :span="weibo.img ? 15 :20" :xs="24" class='content'>
      <h4 class='author'>{{weibo.author}}:</h4>
      <p class='text'>{{weibo.text}}</p>
      <div>
        <span class='time'>{{timeFilter}}</span>
        <div class='states' v-if="weibo.forword">
          <span>Forword{{weibo.forword}}</span> | <span >Favorite{{weibo.favorite}}</span> | <span @click="showComment">Comment{{weibo.comment}}</span>
        </div>
      </div>
    </el-col>
    <el-col :span="5" v-if="weibo.img" class="image">
      <img src="../assets/images/Image79.png">
    </el-col>
  </el-row>
</template>
<style scoped lang='scss'>
  .weibo{
    margin-top: 25px;
    margin-bottom: 15px;
    @media (max-width: 768px){
      .image,.display{
        display: none;
      }
      .time{
        
      }
      .el-col-4{
        padding: 0!important
      }
    }
  }
  .display img{
    display: block;
    max-width:100%;
    margin:0 auto;
  }
  .author{
    font-size: 16px;
    line-height: 18px;
    color: #7C5598;
    /*font-weight: bold;*/
  }
  .content{
    .text{
      height:auto;
      padding:9px 0;
      font-size: 15px;
      color: #393939;
      word-break:break-word;
    }
    .time{
      float: left;
      font-size: 12px;
      color: #676767;
    }
    .states{
      float: right;
      font-size: 12px;
      color: #7C5598;
      span{
        margin: 0 4px;
        cursor: pointer;
      }
    }
  }
  .image{
    img{
      max-width: 100%;
    }
  }
</style>
<script>
  export default{
    data(){
      return{

      }
    },
    props:['weibo'],
    components:{

    },
    computed:{
      timeFilter:function(){
        function add0(m){return m<10?'0'+m:m }
        let time = new Date(parseInt(this.weibo.time)*1000);
        var y = time.getFullYear();
        var m = time.getMonth()+1;
        var d = time.getDate();
        var h = time.getHours();
        var mm = time.getMinutes();
        var s = time.getSeconds();
        return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
      },
    },
    methods:{
      showComment(){
        this.$emit('showComment');
      }
    }
  }
</script>
