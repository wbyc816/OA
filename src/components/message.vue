<template>
    <router-link class='message' :to="data.link">
      <span class='logo' :style='{backgroundColor:data.color}'>
        <i class='iconfont' :class='data.font'></i>
      </span>
      <span class='text text-tilte' v-text='data.text'>{{data.value}}</span>
      <span class='text text-type' :class='myType' v-text=''>
        {{textChg}}
      </span>
    </router-link>
</template>
<style scoped lang='scss'>
  .message{
    display:inline-block;
    width:100%;
    height:57px;
    font-size: 0;
    background-color: #f0f0f0;
    border-radius:5px 0 0 0;
    box-shadow: 0 2px 2px rgba(0,0,0,0.1);
    cursor: pointer;
    overflow: hidden;
    margin-bottom: 8px;
    .logo{
      float: left;
      display:block;
      width:57px;
      height:57px;
      border-radius:5px 5px 5px 0;
      color: #fff;
      font-size: 50px;
      line-height: 57px;
      text-align: center;
    }
    .bg-purple{
      color: #0460AE;
    }
    .bg-brown{
      color: #51449C;
    }
    .bg-zi{
      color:#BE3B7F;
    }
    .text{
      display:inline-block;
      width:100%;
      padding-left:57px;
      margin-left:-57px;
      box-sizing: border-box;
      overflow: hidden;
      text-align: center;
    }
    .text-tilte{
      padding-top:8px;
      font-size: 17px;
      line-height:21px;

    }
    .text-type{
      font-size: 14px;
      line-height:24px;
    }
    .iconfont{
      font-size: 35px;
      line-height: 57px;
      vertical-align: text-top;
      font-style: normal;
    }
  }
  @media screen and (max-width: 992px){
    .message{
      border-radius: 0;
      .text{
        padding-left:0;
        margin-left:0;
      }
      .logo{
        display: none;
      }
    }

  }
</style>
<script>
    export default{
        data(){
            return{
            }
        },
        props:{
            data:{
                type: Object,
                require: true
            }
        },
        computed:{
          myType:function(){
            if(this.data.type=='work'){
              return 'bg-purple';
            }else if(this.data.type=='message'){
              return 'bg-brown';

            }else{
              return 'bg-zi'
            }
          },
          textChg:function(){
            if(this.data.type=='work'){
              return '公文流转';
            }else if(this.data.type=='message'){
              return '个人中心';

            }else{
              return '我的工作'
            }
           
          },
        },
        methods:{
          route(){
            this.routerP
          }
        }
    }
</script>


