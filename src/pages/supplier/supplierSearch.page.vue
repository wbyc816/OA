<template>
  <div id="supplierSearch">
    <el-card class="borderCard searchOptions">
      <div slot="header">
        <span>客户查询</span>
        <i class="iconfont icon-shuaxin" @click="reset"></i>
      </div>
      <el-row :gutter="12">
        <el-col :span="6">
          <el-select v-model="searchParams.supplierType" placeholder="客户类型">
            <el-option key="0" :label="item.dictName" :value="item.dictCode" v-for="item in supplierTypes"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-input v-model="searchParams.supplierCity" placeholder="所在城市"></el-input>
        </el-col>
        <el-col :span="6">
          <el-input v-model="searchParams.empName" placeholder="客户经理"></el-input>
        </el-col>
        <el-col :span="6">
          <el-input v-model="searchParams.supplierNo" placeholder="客户编码"></el-input>
        </el-col>
        <el-col :span="21">
          <el-input v-model="searchParams.supplierName" placeholder="客户名称"></el-input>
        </el-col>        
        <el-col :span="3">
          <el-button type="primary" @click="search" :disabled="searchLoading">搜索</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="borderCard searchResult" v-loading="searchLoading">
      <el-table :data="searchData" class="myTable">
        <el-table-column prop="supplierNo" label="客户编码" width="180"></el-table-column>
        <el-table-column prop="supplierName" label="客户名称"></el-table-column>
        <el-table-column prop="supplierType" label="类型" width="100"></el-table-column>
        <el-table-column prop="supplierCity" label="所在城市" width="100"></el-table-column>
        <el-table-column prop="empName" label="客户经理" width="100"></el-table-column>
        <el-table-column prop="supplierStatus" label="状态" width="100"></el-table-column>
      </el-table>
      <div class="pageBox" v-show="searchData.length>0">
        <el-pagination @current-change="handleCurrentChange" :current-page="searchParams.pageNumber" :page-size="10" layout="total, prev, pager, next, jumper" :total="totalSize">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  data() {
    return {
      searchData: [],
      reserveDate: '',
      searchParams: {
        "supplierType": "",
        "supplierNo": "",
        "supplierName": "",
        "supplierCity": "",
        "empName": "",
        "pageSize": 10,
        "pageNumber": 1
      },
      totalSize: 1,
      status: '',
      searchLoading: false,
      supplierTypes: ''
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
    ])
  },
  created() {
    this.getSupplierTypes();
    this.getData();
  },
  methods: {
    getData() {
      this.searchLoading = true;
      this.$http.post("/Supplier/searchSupplier", this.searchParams, { body: true }).then(res => {
        setTimeout(function() {
          this.searchLoading = false;
        }.bind(this), 200)
        if (res.status == 0) {
          this.searchData = res.data.records;
          this.totalSize = res.data.total;
        } else {
          this.searchData = [];
          this.totalSize = 0;
        }
      }, res => {

      })
    },
    handleCurrentChange(page) {
      this.searchParams.pageNumber = page;
      this.getData()
    },
    search() {
      this.searchParams.pageNumber = 1;
      this.getData();
    },
    reset() {
      this.searchParams.supplierType = '';
      this.searchParams.supplierNo = '';
      this.searchParams.supplierName = '';
      this.searchParams.supplierCity = '';
      this.searchParams.empName = '';
    },
    getSupplierTypes() { //客户类型
      if (this.supplierTypes.length == 0) {
        this.$http.post('/api/getDict', { dictCode: 'ADM01' })
          .then(res => {
            if (res.status == 0) {
              this.supplierTypes = res.data
            } else {

            }
          })
      }
    },
  }
}

</script>
<style lang='scss'>
$main: #0460AE;
$sub:#1465C0;
#supplierSearch {
  .searchOptions {
    .el-card__body {
        padding-top: 13px;

      .el-col {
        margin-bottom: 13px;
        margin-top: 0;
      }
      .el-col-6 {
        .el-select {
          width: 100%;
        }
      }
      .el-col-8 {
        .el-select {
          width: 60%;
        }
      }

      button {
        height: 46px; // width: 40%;
        // float: right;
        font-size: 18px;
        width: 100%;
      }
    }
  }
  .searchResult {
    padding: 0;
    tr th:first-child .cell {
      padding-left: 15px;
    }
    .el-card__body {
      padding: 0;
      .el-table {
        tr td:first-child .cell {
          padding-left: 15px;
        }

        td {
          height: 70px;
        }
        td.clickItem {
          .cancelButton {
            color: $main;
          }
        }
        td.timeItem {
          padding-right: 25px;
        }
      }
    }
    .total {
      height: 33px;
      line-height: 33px;
      padding-left: 15px;
      font-size: 14px;
      color: #95989A;
    }
  }
  .pageBox {
    padding:10px 20px;
    text-align: right;
  }
}

</style>
