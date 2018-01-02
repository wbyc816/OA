<template>
  <div class="distAdvice" v-show="totalSize!==0">
    <h4 class='doc-form_title'>分发意见</h4>
    <el-table :data="distData" style="width: 100%" class="distTable" :stripe="true">
      <el-table-column prop="distUserName" label="分发人" width="100"></el-table-column>
      <el-table-column prop="reciveUserName" label="被分发人" width="100"></el-table-column>
      <el-table-column prop="content" label="分发人意见">
        <template scope="scope">
          <el-tooltip popper-class="contentTip" :enterable="false" effect="dark" :content="scope.row.content" placement="top" :disabled="scope.row.content.length<=20">
            <span style="display: inline-block;">{{scope.row.content | dotdotdot}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="distTime" label="分发时间" width="120"></el-table-column>
      <el-table-column prop="readTime" label="阅读时间" width="120"></el-table-column>
    </el-table>
    <div class="pageBox" v-show="totalSize>pageSize">
      <el-pagination @current-change="handleCurrentChange" :current-page="pageNumber" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="totalSize">
      </el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      distData: [],
      pageSize: 10,
      pageNumber: 1,
      totalSize: 0
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.pageNumber = val;
      this.getDistInfo();
    },
    getDistInfo() {
      this.$http.post('/doc/getDistInfo', { docId: this.$route.params.id, pageSize: this.pageSize, pageNumber: this.pageNumber })
        .then(res => {
          if (res.status == '0') {
            this.distData = res.data.records;
            this.totalSize = res.data.total;
          } else {

          }
        }, res => {

        })
    },
  }
}

</script>
<style lang='scss'>
$main:#0460AE;
$sub:#1465C0;
.distAdvice {
  margin-bottom: 20px;
  .distTable {
    th {
      background: $sub;
    }
    td {
      height: 50px;
    }
  }
  .pageBox{
  	text-align:right;
  	padding-top:10px;
  }
}

</style>
