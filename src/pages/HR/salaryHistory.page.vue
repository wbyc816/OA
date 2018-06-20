<template>
  <div id="salaryHistory">
    <el-card class="commonCard">
      <div slot="header" class="clearfix">
        <span>历史工资单</span>
        <div class="salaryHearder">
          <span>增加</span>
          <span>扣减</span>
        </div>
      </div>
      <div class="showBox">
        <div class="boxTitle">
          <el-row class="title">
            <el-col style="text-align: center" v-for="item in tableTitle" :key="tableTitle[item]" :span="24/tableTitle.length">{{item}}</el-col>
          </el-row>
        </div>
        <div class="alignCenter" v-if="!salaryData.length">
          <br>暂无数据
          <br>
        </div>
        <div class="salaryList" v-for="mouthData in salaryData" @click="goSalary(mouthData.salaryMonth)">
          <el-row>
            <el-col class="el-col" v-for="i in tableFields" :span="24/tableTitle.length">
              <span v-if="i=='salaryMonth'">{{mouthData[i] | didDate}}</span>
              <span v-if="i!='salaryMonth'">{{mouthData[i]}}</span>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-card>
    <div class="block" v-if="salaryData.length">
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="paginate.currentPage" :page-sizes="paginate.pageSizes" :layout="paginate.layout" :total="paginate.total">
      </el-pagination>
    </div>
    <salary-dialog @updateSalary="updateSalary" :visible.sync="salaryDialogVisible"></salary-dialog>
  </div>
</template>
<script>
import { tableTitle, tableFields } from '../../common/salaryHistoryConfig'
import SalaryDialog from '../../components/salaryDialog.component'
import { mapGetters } from 'vuex'
export default {
  components: { SalaryDialog },
  data() {
    return {
      salaryData: [],
      tableTitle,
      tableFields,
      startDate: '',
      endDate: '',
      salaryDialogVisible: false,
      paginate: {
        pageSizes: [5, 10, 12, 36],
        currentSize: 10,
        currentPage: 1,
        layout: "total, prev, pager, next, jumper",
        total: 10
      }
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  mounted() {
    // this.checkPassword();
  },
  created() {

  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.getParam()
      vm.checkPassword();
    })
  },
  beforeRouteUpdate(to, from, next) {
    next()
    this.getParam()
    this.checkPassword()
  },
  beforeRouteLeave(to, from, next) {
    this.salaryDialogVisible = false;
    next();
  },
  methods: {
    checkPassword() {
      if (this.getCookie('salaryAccount') == this.userInfo.empId) {
        this.getData();
      } else {
        this.salaryDialogVisible = true;
      }
    },
    getParam() {
      let month = this.$route.params.param;
      if (month != 1) {
        let param = month.split('@')
        this.startDate = param[0]
        this.endDate = param[1]
      } else {
        this.startDate = '';
        this.endDate = ''
      }
    },
    getData() {
      var token=this.getCookie("token");
      this.$http.post("/salary/getHistorySalary", {
        empId: this.userInfo.empId,
        pageSize: this.paginate.currentSize,
        pageNumber: this.paginate.currentPage,
        startDate: this.startDate,
        endDate: this.endDate,
        token:token,
      }).then(res => {
        if (res.status == 0) {
          const records = res.data.records
          this.paginate.total = records.length //  给分页器提供数据
          this.salaryData = records;
        }
      }, res => {

      })
    },
    goSalary(date) {
      this.$router.push('/HR/salary/' + date);
    },
    handleSizeChange(val) {
      this.paginate.currentSize = val;
      this.getData()
    },
    handleCurrentChange(val) {
      this.paginate.currentPage = val;
      this.getData()
    },
    updateSalary(val) {
      console.log(val);
      if (val) {
        this.getData();
      }
    }
  }
}

</script>
<style lang="scss">
$main:#0460AE;
$sub:#1465C0;
#salaryHistory {
  .salaryList {
    text-align: center;
    .el-col {
      padding: 10px 0;
    }
    .ad {
      color: #0460AE;
    }
    .ec {
      color: #BE3B7F;
    }
  }
  .salaryHearder {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    span {
      position: relative;
      padding: 0 20px;
      float: left;
      font-size: 16px;
      &:before {
        content: "";
        width: 12px;
        height: 12px;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        border-radius: 2px;
      }
      &:nth-child(1) {
        color: #0460AE;
        &:before {
          background: #0460AE;
        }
      }
      &:nth-child(2) {
        color: #BE3B7F;
        &:before {
          background: #BE3B7F;
        }
      }
    }
  }

  .showBox {
    .boxTitle {
      background: #0460AE;
      color: #fff;
      padding: 10px 0;
      font-size: 16px;
      font-weight: 300;
      .el-col:last-child {
        text-align: right;
      }
    }
  }
  .alignCenter {
    text-align: center!important;
  }
}

</style>
