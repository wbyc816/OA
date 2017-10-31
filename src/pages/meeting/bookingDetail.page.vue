<template>
  <div id='bookingDetail'>
    <el-card class="borderCard">
      <span slot="header">{{detail.convenerEmpId==userInfo.empId?'会议室预订明细':'会议通知详情'}}</span>
      <el-row>
        <el-col :span="13" class="clearfix">
          <span class="title">会议编号</span>
          <p class="text">{{detail.conferenceNumber}}</p>
        </el-col>
        <el-col :span="11" class="clearfix right">
          <span class="title">发起人</span>
          <p class="text">{{detail.convenerName}}</p>
        </el-col>
        <el-col :span="13" class="clearfix">
          <span class="title">会议日期</span>
          <p class="text">{{detail.reserveDate | time('date')}}</p>
        </el-col>
        <el-col :span="11" class="clearfix right">
          <span class="title">会议类型</span>
          <p class="text">{{detail.conferenceTypeName}}</p>
        </el-col>
        <el-col :span="13" class="clearfix">
          <span class="title">开始时间</span>
          <p class="text">{{detail.beginTime | time('hours')}}</p>
        </el-col>
        <el-col :span="11" class="clearfix right">
          <span class="title">结束时间</span>
          <p class="text">{{detail.endTime | time('hours')}}</p>
        </el-col>
        <el-col :span="13" class="clearfix">
          <span class="title">位置</span>
          <p class="text">{{detail.roomPlace}}</p>
        </el-col>
        <el-col :span="11" class="clearfix right">
          <span class="title">房间</span>
          <p class="text">{{detail.roomName}}</p>
        </el-col>
        <el-col :span="24" class="clearfix">
          <span class="title">是否内部会议</span>
          <p class="text">{{detail.isInside==1?'内部会议':'外部会议'}}</p>          
        </el-col>
        <el-col :span="24" class="clearfix">
          <span class="title">会议名称</span>
          <p class="text">
            {{detail.conferenceTitle}}
          </p>
        </el-col>
        <el-col :span="24" class="clearfix">
          <span class="title">参会人</span>
          <p class="text">
            <el-tag :key="person.id" type="primary" v-for="(person,index) in detail.persons">
              {{person.personEmpName}}
            </el-tag>
          </p>
        </el-col>
        <el-col :span="13" class="clearfix">
          <span class="title">短信会议通知</span>
          <p class="text">{{detail.isCancel==1?'是':'否'}}</p>
        </el-col>
        <el-col :span="11" class="clearfix right">
          <span class="title">会议状态</span>
          <p class="text">{{detail.isCancel==1?'已取消':'正常'}}</p>
        </el-col>
        <el-col :span="24" class="clearfix">
          <span class="title">会议通知内容</span>
          <p class="text">{{detail.messageContent}}</p>
        </el-col>
      </el-row>
      <el-button type="primary" :disabled="detail.isCancel==1" v-if="detail.convenerEmpId==userInfo.empId" @click="cancel">取消会议</el-button>
    </el-card>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
export default {

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
      'roomList',
    ])
  },
  methods: {
    getDetail() {
      this.$http.post('/conference/conferReserveDetails', { reserveId: this.$route.params.id })
        .then(res => {
          if (res.status == 0) {
            this.detail = res.data;
          } else {

          }
        })
    },
    cancel() {
      this.$confirm('确定取消此次会议预定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post('/conference/cancalConference', { id: this.$route.params.id,cancelEmpId:this.userInfo.empId,cancelName:this.userInfo.name },{body:true})
          .then(res => {
            if (res.status == 0) {
              this.$message.success('取消成功');
              this.$router.push('/meeting/MyBooking');
            } else {
              this.$message.warning('取消失败')
            }
          })
      }).catch(() => {

      });
    },

  }
}

</script>
<style lang='scss'>
$main: #0460AE;
$sub:#1465C0;
#bookingDetail {
  .borderCard {
    padding-bottom: 0;
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
    .text {}
    &.right {
      padding-left: 145px;
    }
  }
  button {
    margin: 30px 0 20px 30px;
    width: 150px;
    height: 45px;
  }
}

</style>
