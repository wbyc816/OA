<template>
  <div class="CPDDetail">
    <el-col :span="24">
      <h1 class="title">公司领导批示</h1>
      <p class="textContent">
        <template v-for="adviceBox in otherAdvice.empSign">
          <span v-for="advice in adviceBox.deptSigns" class="adviceSpan">{{advice.signContent}} {{advice.signUserName}} {{advice.signTime}}</span>
        </template>
      </p>
    </el-col>
    <el-col :span="24">
      <h1 class="title">部门会签意见</h1>
      <p class="textContent">
          <template v-for="adviceBox in otherAdvice.deptSign">
            <span v-for="advice in adviceBox.deptSigns" class="adviceSpan">{{advice.signContent}} {{advice.signUserName}} {{advice.signTime}}</span>
          </template>
        </p>
    </el-col>
    <el-col :span="24">
      <h1 class="title">承办部门意见</h1>
      <p class="textContent">
        <template v-for="adviceBox in otherAdvice.taskDeptSign">
          <span v-for="advice in adviceBox.signInfo" class="adviceSpan">{{advice.signContent}} {{advice.signUserName}} {{advice.signTime}}</span>
        </template>
      </p>
    </el-col>
    <el-col :span="24">
      <h1 class="title">拟稿部门意见</h1>
      <p class="textContent">
        <span v-for="advice in otherAdvice.deptDetail" class="adviceSpan">{{advice.taskContent}} {{advice.taskUserName}} {{advice.taskTime}}</span>
      </p>
    </el-col>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  components: {  },
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
  mounted() {},
  methods: {
    getOtherAdvice(route) {
      this.$http.post("/doc/getDetailByType", { id: route.params.id, empId: this.userInfo.empId })
        .then(res => {
          if (res.status == 0) {
            this.otherAdvice = res.data
          } else {

          }
        })
    },
  }
}

</script>
<style lang='scss'>
$main:#0460AE;
.CPDDetail {
  
}

</style>
