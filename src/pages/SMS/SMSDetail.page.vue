<template>
  <div id='SMSDetail'>
    <el-card class="borderCard">
      <span slot="header">短信详情</span>
      <el-row>
        <el-col :span="24" class="clearfix">
          <span class="title">发送人</span>
          <p class="text">{{detail.sendUserName}}</p>
        </el-col>
        <el-col :span="24" class="clearfix right">
          <span class="title">接收人</span>
          <p class="text">{{detail.reciUserName}}</p>
        </el-col>
        <el-col :span="24" class="clearfix">
          <span class="title">短信内容</span>
          <p class="text">{{detail.content}}</p>
        </el-col>
        <el-col :span="24" class="clearfix right">
          <span class="title">短信状态</span>
          <p class="text">{{detail.sendStatus=='1'?'发送成功':'发送失败'}}</p>
        </el-col>
      </el-row>
    </el-card>
    <back-button :backTop="130"></back-button>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import BackButton from '../../components/backButton.component.vue'
export default {
  name:'SMSDetail',
  components:{BackButton},
  data() {
    return {
      detail: ''
    };
  },
  created() {
    this.getDetail();
  },
  computed: {
    ...mapGetters([
      'userInfo',
    ])
  },
  methods: {
    getDetail() {
      this.$http.post('/tSmsSend/selectSmsDetail', { id: this.$route.params.id })
        .then(res => {
          if (res.status == 0) {
            this.detail = res.data;
          } else {

          }
        })
    },
  }
}

</script>
<style lang='scss'>
$main: #0460AE;
$sub:#1465C0;
#SMSDetail {
  .borderCard {
    padding-bottom: 0;
    min-height:500px;
    .el-card__header{
      padding:12px;
    }
    .el-card__body{
      padding-bottom:10px;
    }
  }
  .el-col {
    position: relative;
    font-size: 15px;
    border-bottom: 1px solid #F2F2F2;
    padding: 15px 15px 15px 190px;
    min-height: 51px;
    .title {
      position: absolute;
      color: $main;
      left: 30px;
      top: 15px;
    }
  }
}

</style>
