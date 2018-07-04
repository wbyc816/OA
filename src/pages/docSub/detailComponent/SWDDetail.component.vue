<template>
  <div class="SWDDetail">
    <el-col :span="12" class="rightBorder redBorder">
      <h1 class="title rightRedBorder">来文文号</h1>
      <p v-if="info[0]" class="textContent pdl25">{{info[0].wordNo}}</p>
    </el-col>
    <el-col :span="12" class="redBorder">
      <h1 class="title rightRedBorder">收文日期</h1>
      <p v-if="info[0]" class="textContent pdl25">{{info[0].receiveTime.slice(0,4)}}年{{info[0].receiveTime.slice(5,7)}}月{{info[0].receiveTime.slice(8,10)}}日</p>
    </el-col>
    <el-col :span="24">
      <h1 class="title rightRedBorder">来文单位</h1>
      <p v-if="info[0]" class="textContent pdl25">{{info[0].receiveCompany}}</p>
    </el-col>
    <el-col :span="24">
      <h1 class="title rightRedBorder">公司领导意见</h1>
      <p class="textContent">
        <template v-for="adviceBox in otherAdvice.empSign">
          <!-- <span v-for="advice in adviceBox.deptSigns" class="adviceSpan">{{advice.signContent}} {{advice.signUserName}} {{advice.signTime}}</span> -->
          <div v-for="advice in adviceBox.deptSigns" >
            <el-col :span="24" class="noBorder">
              <div >{{advice.signContent}}</div>
              <div class="chaetosema">{{advice.signUserName}} {{advice.signTime}}</div>
            </el-col>
          </div>
        </template>
      </p>
    </el-col>
    <el-col :span="24">
      <h1 class="title rightRedBorder">综合管理部<br/>拟办意见</h1>
      <p class="textContent">
        <!-- <span v-for="advice in otherAdvice.deptDetail" class="adviceSpan">{{advice.taskContent}} {{advice.taskUserName}} {{advice.startTime}}</span> -->
        <template v-for="advice in otherAdvice.deptDetail">
          <div>
          <el-col :span="24" class="noBorder">
            <div>{{advice.taskContent}}</div>
            <div class="chaetosema">{{advice.taskUserName}} {{advice.startTime}}</div>
          </el-col>
          </div>
        </template>
      </p>
    </el-col>
    <el-col :span="24">
      <h1 class="title rightRedBorder">承办部门意见</h1>
      <p class="textContent">
        <template v-for="adviceBox in otherAdvice.taskDeptSign">
          <template v-for="adviceChild in adviceBox.signInfo">
            <!-- <span v-for="advice in adviceChild.deptSigns" class="adviceSpan">{{advice.signContent}} {{advice.signUserName}} {{advice.signTime}}</span> -->
            <template v-for="advice in adviceChild.deptSigns">
              <el-col :span="24" class="noBorder">
                <div >{{advice.signContent}}</div>
                <div class="chaetosema">{{advice.signUserName}} {{advice.signTime}}</div>
              </el-col>
            </template>
          </template>

        </template>
         
      </p>
    </el-col>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
// import pdf from 'vue-pdf'
import pdf from '../../../components/pdf.component'
export default {
  components: { pdf },
  props: {
    info: {
      type: Array
    },
    docDetialInfo: '',
  },
  data() {
    return {
      detail:{},
      otherAdvice: '',
      pageNum: 1,
      totalNum: 0,
      pdfHeight: 900,
    }
  },
  computed: {
    ...mapGetters([
      'submitLoading',
      'userInfo'
    ])
  },
  created() {
    this.getOtherAdvice(this.$route);
  },
  beforeRouteUpdate(to, from, next) {
    this.getOtherAdvice(to);
    next();
  },
  watch: {
    // open:function(newval){
    //   if(newval&&!this.first){
    //     this.first=true;
    //   }
    // }
  },
  mounted() {
    this.addClass();
  },
  methods: {
    addClass(){
      document.getElementsByClassName("titleSpan")[0].setAttribute("style",";padding:0 0 0 24px");
    },
    getOtherAdvice(route) {
      this.$http.post("/emp/getEmpInfoById", {id: this.userInfo.empId})
        .then(res => {
          if (res.status == 0) {
            this.detail = res.data

             this.$http.post("/doc/getDetailByType", { id: route.params.id, empId: this.userInfo.empId,empPostId:this.docDetialInfo.doc.postId||this.detail.empPost[0].id })
              .then(res => {
                if (res.status == 0) {
                  this.otherAdvice = res.data
                } else {

                }
              })
          } else {

          }
        })
       
     
    },
  }
}

</script>
<style lang='scss'>
$main:#0460AE;
.SWDDetail {
   .chaetosema{
      float:right;
      font-size:14px
    }
  .pdfBox {
    padding: 0;
    position: relative;
    text-align: center;
    padding-top: 10px;
    padding-bottom: 50px;
    .pdfScrollBox {
      margin: 0 auto;
      width: 80%;
      overflow-y: auto;
      height: 800px;
      overflow-x: hidden;
      border-bottom: 1px solid #F2F2F2;
    }
    .el-pagination {
      position: absolute;
      margin: 0 auto;
      left: 0;
      right: 0;
      bottom: 10px;
    }
  }
}

#docDetail  .baseInfoBox .SWDDetail .el-col {
  border-bottom: 1px solid red;
  padding: 0px 0px 0px 24px;
}
#docDetail  .baseInfoBox .SWDDetail .textContent .el-col {
  border-bottom: 1px solid red;
}
#docDetail  .baseInfoBox .SWDDetail .textContent div .noBorder{
    border: 0px;
}
#docInfo  .baseInfoBox .SWDDetail .el-col {
  border-bottom: 1px solid red;
  padding: 0px 0px 0px 24px;
}
#docInfo  .baseInfoBox .SWDDetail .textContent .el-col {
  border-bottom: 1px solid red;
}
#docInfo  .baseInfoBox .SWDDetail .textContent div .noBorder{
    border: 0px;
}
.SWDDetail .redBorder{
  border-top:1px solid red;
  border-bottom:1px solid red;
}
#docDetail .baseInfoBox .SWDDetail .rightBorder{
  border-right:1px solid red;
}
#docInfo .baseInfoBox .SWDDetail .rightBorder{
  border-right:1px solid red;
}

</style>
