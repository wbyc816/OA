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
        <div class="alignCenter" v-if="!salaryData.length"><br>暂无数据<br></div>
        <div class="salaryList" v-for="mouthData in salaryData" :key='salaryData[mouthData]'>
          <el-row>
            <el-col class="el-col" v-for="i in mouthData" :span="24/tableTitle.length" :key="mouthData[i]">{{i}}</el-col>
          </el-row>
        </div>
      </div>
    </el-card>
    <div class="block" v-if="salaryData.length">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="paginate.currentPage" :page-sizes="paginate.pageSizes" :page-size="paginate.currentPage" :layout="paginate.layout" :total="paginate.total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { tableTitle, tableFields, supportId, aviatorId, groundId } from '../../common/salaryHistoryConfig'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      salaryData: [],
      supportId,
      tableTitle,
      tableFields,
      startDate: '',
      endDate: '',
      paginate: {
        pageSizes: [5, 10, 12, 36],
        currentSize: 5,
        currentPage: 1,
        layout: "total, sizes, prev, pager, next, jumper",
        total: 10
      }
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  created() {
    this.getParam()
    this.getData()
  },
  beforeRouteUpdate(to, from, next) {
    next()
    this.getParam()
    this.getData()
  },
  methods: {
    getParam() {
      if (this.$route.params.param) {
        let param = this.$route.params.param.split('@')
        this.startDate = param[0]
        this.endDate = param[1]
      }
    },
    getData() {
      this.$http.post("/salary/getHistorySalary", {
        empId: this.userInfo.empId,
        pageSize: this.paginate.currentSize,
        pageNumber: this.paginate.currentPage,
        startDate: this.startDate,
        endDate: this.endDate
      }).then(res => {
        if (res.status == 0) {
          const records = res.data.records
          this.paginate.total = records.length       //  给分页器提供数据
          this.salaryData = records.map((item) => {    // 转换函数 将 data 转换为渲染需要的二维数组格式
            const data = []
            this.tableFields.forEach((field) => {
              if (item[field]) {
                if (field === 'salaryMonth') {   // 日期字段添加.符号
                  let x = item[field].slice(0, 4) + '.' + item[field].slice(4, 6)
                  data.push(x)
                } else {
                  data.push(item[field])
                }
              }
            })
            return data
          })
        }
      }, res => {

      })
    },
    handleSizeChange(val) {
      this.paginate.currentSize = val;
      this.getData()
    },
    handleCurrentChange(val) {
      this.paginate.currentPage = val;
      this.getData()
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
