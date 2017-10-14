<template>
  <div id='softDownload'>
    <el-row :gutter='12'>
      <el-col :span='17' :xs="24">
        <el-card>
          <div slot="header">
            <el-row>
              <el-col :span="4">
                软件下载
              </el-col>
              <el-col class="titleRight" :offset="16" :span="4">
                <i class="iconfont icon-zhinan"></i>
                <a style="color: #0460AE" href="#">下载操作说明</a>
              </el-col>
            </el-row>
          </div>
          <el-table :data="tableData" highlight-current-row style="width: 100%">
            <el-table-column property="name" label="软件名称" width="230">
            </el-table-column>
            <el-table-column property="type1Name" label="分类" width="130">
            </el-table-column>
            <el-table-column property="type2Name" label="适用系统" width="140">
            </el-table-column>
            <el-table-column property="url" label="下载地址">
              <template scope="scope">
                <a :href="formatUrl(scope.row.url)">{{scope.row.url}}</a>
              </template>
            </el-table-column>
          </el-table>
          <div class="paginateWrap">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="paginate.currentPage" :page-sizes="paginate.pageSizes" :layout="paginate.layout" :total="paginate.total">
            </el-pagination>
          </div>
        </el-card>
      </el-col>
      <el-col :span='7' class="sideBox">
        <side-Person-Search></side-Person-Search>
        <duty></duty>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import duty from '../components/duty.component'
import deptList from '../components/deptList.component'
import SidePersonSearch from '../components/sidePersonSearch.component'
import util from '../common/util'
import dataTransform from '../common/dataTransform'
import api from '../fetch/api'

const fmts = [['name'], ['type1Name'], ['type2Name'], ['url']]

export default {
  data() {
    return {
      date: '',
      deptList: [],
      tableData: [],
      currentRow: null,
      paginate: {
        pageSizes: [10, 12, 36],
        currentPage: 1,
        layout: "total,prev, pager, next, jumper",
        total: 0,
      },
    }
  },
  created() {
    this.search();
  },
  methods: {
    search() {
      api.getSoftList({
        name: '',
        pageNumber: this.paginate.currentPage,
        pageSize: 10
      }).then((data) => {
        this.paginate.total = data.totalSize
        this.tableData = dataTransform(data.basicSoftwareInfosList, fmts)
      })
    },
    handleCurrentChange() {
      this.search()
    },
    formatUrl(data) {
      if(/^http/.test(data)){
        return data
      }
      return 'http://'+data
    }
  },
  components: {
    deptList,
    duty,
    SidePersonSearch
  }
}
</script>

<style lang="scss">
#softDownload {
  .el-card {
    padding: 0 20px;
    .el-card__header {
      padding-left: 0;
      padding-right: 0;
      .titleRight {
        font-size: 14px;
        color: #0460AE;
        text-indent: 20px;
      }
    }
    .el-card__body {
      padding: 20px 0;
      .el-table .cell {
        font-size: 13px;
      }
    }
    .alignCenter {
      text-align: center!important;
    }
    .paginateWrap {
      margin: 20px auto 20px
    }
    a{
      color: #3399ff;
    }
  }
}
</style>
