<template>
  <div class="CPDDetail">
    <el-col :span="24">
      <h1 class="title rightRedBorder">公司领导批示</h1>
      <p class="textContent">
        <template v-for="adviceBox in otherAdvice.empSign">
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
      <h1 class="title rightRedBorder">部门会签意见</h1>
      <p class="textContent">
        <!-- <template v-for="adviceBox in otherAdvice.deptSign">
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
    <el-col :span="24">
      <h1 class="title rightRedBorder">承办部门意见</h1>
      <p class="textContent">
        <template v-for="adviceBox in otherAdvice.taskDeptSign">
          <template v-for="adviceChild in adviceBox.signInfo">
            <!-- <span v-for="advice in adviceChild.deptSigns" class="adviceSpan">{{advice.signContent}} {{advice.signUserName}} {{advice.signTime}}</span> -->
         
         
          <template v-for="advice in adviceChild.deptSigns">
            <div>
              <el-col :span="24" class="noBorder">
                <div >{{advice.signContent}}</div>
                <div class="chaetosema">{{advice.signUserName}} {{advice.signTime}}</div>
              </el-col>
            </div>
          </template>
          
          
          </template>
        </template>
      </p>
    </el-col>
    <el-col :span="24">
      <h1 class="title rightRedBorder">拟稿部门意见</h1>
      <p class="textContent">
        <!-- <span v-for="advice in otherAdvice.deptDetail" class="adviceSpan">{{advice.taskContent}} {{advice.taskUserName}} {{advice.startTime}}</span> -->
        <template v-for="advice in otherAdvice.deptDetail">
          <div>
            <el-col :span="24" class="noBorder">
              <div  >{{advice.taskContent}}</div>
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
  mounted() { this.addClass();},
  methods: {
    addClass(){
      document.getElementsByClassName("titleSpan")[0].setAttribute("style","border-bottom: 1px solid red;padding:0 0 0 24px");
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
.CPDDetail{
    .chaetosema{
      float:right;
      font-size:14px
    }
  }
  #docDetail  .baseInfoBox .CPDDetail .el-col {
    border-bottom: 1px solid red;
    padding: 0px 0px 0px 24px;
  }
  #docDetail  .baseInfoBox .CPDDetail .textContent .el-col {
    border-bottom: 1px solid red;
  }
  #docDetail  .baseInfoBox .CPDDetail .textContent div .noBorder{
     border: 0px;
  }
  #docInfo  .baseInfoBox .CPDDetail .el-col {
    border-bottom: 1px solid red;
    padding: 0px 0px 0px 24px;
  }
  #docInfo  .baseInfoBox .CPDDetail .textContent .el-col {
    border-bottom: 1px solid red;
  }
  #docInfo  .baseInfoBox .CPDDetail .textContent div .noBorder{
     border: 0px;
  }
</style>
