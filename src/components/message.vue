<template>
  <!-- <router-link class='message' :to="data.link" target= "_blank"> -->
    <a  target="_blank"  class='message'  @click="goToOtherReloads(data.link)">

    <span class='logo' :style='{backgroundColor:data.color}'>
        <i class='iconfont' :class="'icon-'+data.icon"></i>
      </span>
    <span class='text text-tilte'>{{data.text}} <span :style='{color:data.color}'>{{data.value}}</span></span>
    <!-- <span class='text text-type' :class='myType' v-text=''>
        {{textChg}}
      </span> -->
  <!-- </router-link> -->

                    
    </a>
</template>

<style scoped lang='scss'>
.message {
  display: inline-block;
  width: 100%;
  height: 57px;
  font-size: 0;
  background-color: #f0f0f0;
  border-radius: 5px 0 0 0;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  overflow: hidden;
  margin-bottom: 8px;
  .logo {
    float: left;
    display: block;
    width: 57px;
    height: 57px;
    border-radius: 5px 5px 5px 0;
    color: #fff;
    font-size: 50px;
    line-height: 57px;
    text-align: center;
  }
  .bg-purple {
    color: #0460AE;
  }
  .bg-brown {
    color: #51449C;
  }
  .bg-zi {
    color: #BE3B7F;
  }
  .text {
    display: inline-block;
    width: 100%;
    padding-left: 57px;
    margin-left: -57px;
    box-sizing: border-box;
    overflow: hidden;
    text-align: center;
  }
  .text-tilte {
    padding-top: 21px;
    font-size: 17px;
    line-height: 21px;
    color:#575757;
  }
  .text-type {
    font-size: 14px;
    line-height: 24px;
  }
  .iconfont {
    font-size: 35px;
    line-height: 57px;
    vertical-align: text-top;
    font-style: normal;
  }
}

// @media screen and (max-width: 992px) {
//   .message {
//     border-radius: 0;
//     .text {
//       padding-left: 0;
//       margin-left: 0;
//     }
//     .logo {
//       display: none;
//     }
//   }
// }

</style>
<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {}
    
  },
  props: {
    data: {
      type: Object,
      require: true
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
    ])
  },
  created(){
    // this.reloadMessage();
  },
  methods: {
    goToOtherReloads(link){
      if(link.indexOf('163')>-1){
        var that=this;
        this.$http.post('/index/mailLogin', { empId: this.userInfo.empId })
        .then(res => {
           link=res.data;
           var win=window.open(link);
           var loop = setInterval(function() { 
              if(win.closed) {    
                  clearInterval(loop);
                  that.$emit('search')
              }
            })
        }, res => {
        })
      }else{
      var that=this;
        if (typeof link === 'string') {
          if (/^http/.test(link)) {
            win=window.open(link);
          } else {
            win=window.open(location.href.slice(0,location.href.indexOf("#")+1)+link)
          }
        }
        var loop = setInterval(function() { 
        if(win.closed) {    
            clearInterval(loop);
            that.$emit('search')
        }
      })
      }
      
      

     
     
    }
    
  
    //  reloadMessage(){
    //   setInterval("window.location.reload()",300000)
    // },
  }
}

</script>
