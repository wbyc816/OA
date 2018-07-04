<template>
  <div class="HTSDetail">
    <el-col :span="24">
      <h1 class="title  rightRedBorder">公司领导意见</h1>
      <p class="textContent">
        <template v-for="adviceBox in otherAdvice.empSign">
          <div v-for="advice in adviceBox.deptSigns">
            <el-col :span="24" class="noBorder">
              <div >{{advice.signContent}}</div>
              <div class="chaetosema">{{advice.signUserName}} {{advice.signTime}}</div>
            </el-col>
          </div>
        </template>
      </p>
    </el-col>
    <el-col :span="24">
      <h1 class="title rightRedBorder">法律部审批意见</h1>
      <p class="textContent">
        <!-- <span v-for="advice in otherAdvice.givenDeptSign" class="adviceSpan">{{advice.taskContent}} {{advice.taskUserName}} {{advice.startTime}}</span> -->
        <template v-for="advice in otherAdvice.givenDeptSign">
          <div>
            <el-col :span="24" class="noBorder">
              <div  >{{advice.taskContent}}</div>
              <div class="chaetosema">{{advice.taskUserName}} {{advice.startTime}}</div>
            </el-col>
          </div>
        </template>
      </p>
    </el-col>
    <el-col :span="24">
      <h1 class="title rightRedBorder">部门会签意见</h1>
      <p class="textContent">
        <!-- <template v-for="adviceBox in otherAdvice.deptSign" v-if="adviceBox.deptName!='法律部'">
          <span v-for="advice in adviceBox.deptSigns" class="adviceSpan">{{advice.signContent}} {{advice.signUserName}} {{advice.signTime}}</span>
        </template> -->
        <template v-for="adviceBox in otherAdvice.deptSign" v-if="adviceBox.deptName!='综合管理部'">
          <div v-for="advice in adviceBox.deptSigns" >
              <el-col :span="24" class="noBorder">
                <div >{{advice.signContent}}</div>
                <div class="chaetosema">{{advice.signUserName}} {{advice.signTime}}</div>
              </el-col>
          </div>
        </template>
      </p>
    </el-col>
    <el-col :span="24" class="noBorder">
      <h1 class="title rightRedBorder">拟稿部门意见</h1>
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
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  components: {},
  props: {
    docDetialInfo: '',
  },
  data() {
    return {
      detail:{},
      otherAdvice: '',
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
  mounted() {this.addClass();},
  methods: {
    addClass(){
      document.getElementsByClassName("titleSpan")[0].setAttribute("style","border-bottom: 1px solid red;padding: 0px 18px 0px 24px");
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
  .HTSDetail{
    .chaetosema{
      float:right;
      font-size:14px
    }
  }
  .rightRedBorder{
    border-right:1px solid red;
  }
  #docDetail  .baseInfoBox .HTSDetail .el-col {
    border-bottom: 1px solid red;
    // padding: 5px 0px 5px 24px;
    padding: 0px 0px 0px 24px
  }
  #docDetail  .baseInfoBox .HTSDetail .textContent .el-col {
    border-bottom: 1px solid red;
  }
  #docDetail  .baseInfoBox .HTSDetail .textContent div .noBorder{
     border: 0px;
  }
  #docInfo  .baseInfoBox .HTSDetail .el-col {
    border-bottom: 1px solid red;
    // padding: 5px 0px 5px 24px;
    padding: 0px 0px 0px 24px;
  }
  #docInfo  .baseInfoBox .HTSDetail .textContent .el-col {
    border-bottom: 1px solid red;
  }
  #docInfo  .baseInfoBox .HTSDetail .textContent div .noBorder{
     border: 0px;
  }
  #docDetail  .baseInfoBox {
    padding-bottom: 0
  }
  #docInfo  .baseInfoBox {
    padding-bottom: 0
  }
</style>
