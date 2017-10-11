<template>
  <div id="salary">
    <el-card class="commonCard">
      <div slot="header" class="clearfix">
        <span>最新工资单</span>
        <div class="salaryHearder">
          <span>增加</span>
          <span>扣减</span>
        </div>
      </div>
      <div class="showBox">
        <div class="boxTitle">
          <el-row>
            <el-col :span="12">{{salaryMonth}}个人工资表</el-col>
            <el-col :span="12">{{userInfo.name}}</el-col>
          </el-row>
        </div>
        <div class="alignCenter" v-if="salaryType==0"><br>暂无数据<br></div>
        <el-row class="salaryList" v-if="salaryType>0">
          <el-col :span="12">
            <el-row v-for="salary in salaryLeft" v-if="salaryData[salary.name]">
              <el-col :span="12">
                {{salary.label}}
              </el-col>
              <el-col :span="12" class="ad">
                {{salaryData[salary.name]}}
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row v-for="salary in salaryRight" v-if="salaryData[salary.name]">
              <el-col :span="12">
                {{salary.label}}
              </el-col>
              <el-col :span="12" class="ad" :class="{'ec':salary.isDeduction}">
                {{salaryData[salary.name]}}
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <el-card class="commonCard otherCard" v-if="salaryType>0">
      <div class="boxTitle">
        <el-row>
          <el-col :span="8">项目</el-col>
          <el-col :span="4" class="alignCenter">明细</el-col>
          <el-col :span="8">项目</el-col>
          <el-col :span="4" class="alignCenter">明细</el-col>
        </el-row>
      </div>
      <div class="salaryList" v-if="salaryType==1">
        <el-row>
            <el-col :span="8">上月夜班夜餐天数</el-col>
            <el-col :span="4" class="alignCenter">{{salaryData.nightMealDays}}</el-col>
            <el-col :span="8">上月节假日加班天数</el-col>
            <el-col :span="4" class="alignCenter">{{salaryData.overtimeDays}}</el-col>
        </el-row>
        <el-row>
            <el-col :span="8">上月跟机小时数</el-col>
            <el-col :span="4" class="alignCenter">{{salaryData.followFlightHours}}</el-col>
            <el-col :span="8">上月培训课时</el-col>
            <el-col :span="4" class="alignCenter">{{salaryData.trainNumber}}</el-col>
        </el-row>
        <el-row>
            <el-col :span="8">驻外天数</el-col>
            <el-col :span="4" class="alignCenter">{{salaryData.stationedAbroadDays}}</el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
              上述各项小时生产数据由人力资源部薪酬管理处根据各业务部门所提供的生产数据核算，如有疑问可与部门考勤专员联系，点此<a href="#">查询联系方式及计算公式。</a>
            </el-col>
        </el-row>
      </div>
      <div class="salaryList" v-if="salaryType==2">
        <el-row>
            <el-col :span="8">技术等级</el-col>
            <el-col :span="4" class="alignCenter">{{salaryData.technicalGrade}}</el-col>
            <el-col :span="8">本场训练时间</el-col>
            <el-col :span="4" class="alignCenter">{{salaryData.trainTime}}</el-col>
        </el-row>
        <el-row>
            <el-col :span="8">小时标准费</el-col>
            <el-col :span="4" class="alignCenter">{{salaryData.standardHour}}</el-col>
            <el-col :span="8">模拟机时间</el-col>
            <el-col :span="4" class="alignCenter">{{salaryData.simulationTime}}</el-col>
        </el-row>
        <el-row>
            <el-col :span="8">国内航线飞行时间</el-col>
            <el-col :span="4" class="alignCenter">{{salaryData.inlandFlightTime}}</el-col>
            <el-col :span="8">试飞时间</el-col>
            <el-col :span="4" class="alignCenter">{{salaryData.trialTime}}</el-col>
        </el-row>
        <el-row>
            <el-col :span="8">国外航线飞行时间</el-col>
            <el-col :span="4" class="alignCenter">{{salaryData.foreignFlightTime}}</el-col>
            <el-col :span="8">国内总承包时间</el-col>
            <el-col :span="4" class="alignCenter">{{salaryData.inlandTotalContractTime}}</el-col>
        </el-row>
        <el-row>
            <el-col :span="8">飞行乘务课时</el-col>
            <el-col :span="4" class="alignCenter">{{salaryData.crewLesson}}</el-col>
            <el-col :span="8">飞行员加机组时间</el-col>
            <el-col :span="4" class="alignCenter">{{salaryData.addFlightTime}}</el-col>
        </el-row>
        <el-row>
            <el-col :span="8">超时时间</el-col>
            <el-col :span="4" class="alignCenter">{{salaryData.overtimeTime}}</el-col>
            <el-col :span="8">飞行特殊机场起落总次数</el-col>
            <el-col :span="4" class="alignCenter">{{salaryData.specialFlightNumber}}</el-col>
        </el-row>
        <el-row>
            <el-col :span="8">备份天数</el-col>
            <el-col :span="4" class="alignCenter">{{salaryData.backupsDays}}</el-col>
            <el-col :span="8">空勤人员过夜天数</el-col>
            <el-col :span="4" class="alignCenter">{{salaryData.overnightDays}}</el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
              上述各项小时生产数据由人力资源部薪酬管理处根据各业务部门所提供的生产数据核算，如有疑问可与部门考勤专员联系，点此<a href="#">查询联系方式及计算公式。</a>
            </el-col>
        </el-row>
      </div>
      <div class="salaryList" v-if="salaryType==3">
        <el-row>
            <el-col :span="8">技术等级</el-col>
            <el-col :span="4" class="alignCenter">{{salaryData.technicalGrade}}</el-col>
            <el-col :span="8">双照人员担任双职时间</el-col>
            <el-col :span="4" class="alignCenter">{{salaryData.doubleLicenseTime}}</el-col>
        </el-row>
        <el-row>
            <el-col :span="8">小时标准费</el-col>
            <el-col :span="4" class="alignCenter">{{salaryData.standardHour}}</el-col>
            <el-col :span="8">超时时间</el-col>
            <el-col :span="4" class="alignCenter">{{salaryData.overtimeTime}}</el-col>
        </el-row>
        <el-row>
            <el-col :span="8">国内航线飞行时间</el-col>
            <el-col :span="4" class="alignCenter">{{salaryData.inlandFlightTime}}</el-col>
            <el-col :span="8">备份天数</el-col>
            <el-col :span="4" class="alignCenter">{{salaryData.backupsDays}}</el-col>
        </el-row>
        <el-row>
            <el-col :span="8">国外航线飞行时间</el-col>
            <el-col :span="4" class="alignCenter">{{salaryData.foreignFlightTime}}</el-col>
            <el-col :span="8">国内总承包时间</el-col>
            <el-col :span="4" class="alignCenter">{{salaryData.inlandTotalContract}}</el-col>
        </el-row>
        <el-row>
            <el-col :span="8">机上广播时间</el-col>
            <el-col :span="4" class="alignCenter">{{salaryData.broadcastTime}}</el-col>
            <el-col :span="8">乘务员安全员调组乘机时间</el-col>
            <el-col :span="4" class="alignCenter">2{{salaryData.othercompanyFlyingTime}}</el-col>
        </el-row>
        <el-row>
            <el-col :span="8">飞行乘务课时</el-col>
            <el-col :span="4" class="alignCenter">{{salaryData.crewLesson}}</el-col>
            <el-col :span="8">空勤人员过夜天数</el-col>
            <el-col :span="4" class="alignCenter">{{salaryData.overnightDays}}</el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
              上述各项小时生产数据由人力资源部薪酬管理处根据各业务部门所提供的生产数据核算，如有疑问可与部门考勤专员联系，点此<a href="#">查询联系方式及计算公式。</a>
            </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>
<script>
import { salaryLeft,salaryRight } from '../../common/salaryConfig'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      activeName: 'post',
      salaryLeft,
      salaryRight,
      salaryMonth:"",
      salaryData:{},
      salaryType:0,
      paramsMonth:""
    }
  },
  computed: {
    ...mapGetters([
      'resumeInfo',
      'getEmpPostInfo',
      'userInfo'
    ])
  },
  created() {
    let month=this.$route.params.salaryMonth;
    if(month!=1){
      this.paramsMonth=month;
    }
    this.getData();
  },
  beforeRouteUpdate(to, from, next){
    next();
    this.paramsMonth=this.$route.params.salaryMonth;
    this.getData();
  },
  methods: {
    getData(){
      this.$http.post("/salary/getNewSalaryOrMonth", {
        empId:this.userInfo.empId,
        salaryMonth:this.paramsMonth,
      }).then(res => {
        if (res.status == 0) {
          if(res.data.crewSalary!=null){
            this.salaryData=res.data.crewSalary;
            this.salaryType=1;
          }else if(res.data.filghtSalary!=null){
            this.salaryData=res.data.filghtSalary;
            this.salaryType=2;
          }else if(res.data.groundSalary!=null){
            this.salaryData=res.data.groundSalary;
            this.salaryType=3;
          }else{
            this.salaryType=0;
          }
          if(this.salaryType>0){
            let month=this.salaryData.salaryMonth;
            this.salaryMonth=month.slice(0,4)+"年"+month.slice(4,6)+"月";
            console.log(this.salaryMonth);
          }
          console.log(this.salaryData);
        }
      }, res => {

      })
    }
  }
}

</script>
<style lang="scss">
$main:#0460AE;
$sub:#1465C0;
#salary {
  .salaryList{
    text-align:center;
    .el-col{
      padding:10px 0;
    }
    &>.el-col{
      &:nth-child(1){
        border-right:1px solid #CBCBCB;
      }
      .el-row{
        &>.el-col:nth-child(1){
          border-right:1px solid #CBCBCB;
        }
      }
      &>.el-row:nth-of-type(odd){
        background: rgba(118, 135, 206,.15)
      }
    }
    .ad{
      color:#0460AE;
    }
    .ec{
      color:#BE3B7F;
    }
  }
  .salaryHearder{
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    span{
      position: relative;
      padding:0 20px;
      float: left;
      font-size:16px;
      &:before{
        content:"";
        width:12px;
        height:12px;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        border-radius:2px;
      }
      &:nth-child(1){
        color:#0460AE;
        &:before{
          background:#0460AE;
        }
      }
      &:nth-child(2){
        color:#BE3B7F;
        &:before{
          background:#BE3B7F;
        }
      }
    }
  }

  .showBox {
    .boxTitle{
      background:#0460AE;
      color:#fff;
      padding:10px 20px;
      font-size:16px;
      font-weight:300;
      .el-col:last-child{
        text-align:right;
      }
    }
  }
  .otherCard{
    .el-card__body{
      border:1px solid #EAEAEA;
      padding:0;
      margin:20px 0;
    }
    .boxTitle{
      background:#0460AE;
      color:#fff;
      font-size:14px;
      font-weight:300;
      .el-col{
        padding:5px 20px;
      }
      .el-col:last-child{
        text-align:right;
      }
    }
    .salaryList{
      .el-col{
        text-align:left;
        padding:10px 20px;
        min-height:40px;
        &:nth-child(1){
          border-right:none;
        }
      }
      &>.el-row{
        .el-col{
          &:nth-child(2){
            border-right:1px solid #CBCBCB;
          }
        }
        &:nth-of-type(even){
          background: rgba(118, 135, 206,.15)
        }
        &:last-child{
          border-top:1px solid #EAEAEA;
          background:none;
          a{
            color:#0460AE;
            text-decoration: underline;
          }
        }
      }
    }
  }
  .alignCenter{
    text-align:center!important;
  }
}

</style>
