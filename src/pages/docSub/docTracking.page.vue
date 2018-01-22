<template>
  <div id="docTracking">
    <search-options title="公文追踪" @search="setOptions" isCollapse hasSub></search-options>
    
    <table bgcolor="#fff" class="myDocList" width="100%" cellspacing="0" v-loading.body="searchLoading" >
      <caption>
      </caption>
      <thead>
        <tr>
          <th v-for="title in tableTitle" align="left">{{title}}</th>
        </tr>
      </thead>
      <tbody v-for="doc in docData" :key="doc.taskTime" :class="{disAgree:doc.isAgree===0}">
        <tr>
          <td><span class="docType" :style="{background:handDocType(doc).color}">{{handDocType(doc).shortName}}</span></td>
          <router-link tag="td" :to="{path:'/doc/docInfo/'+doc.id,query:{code:doc.docTypeCode}}" class="linkTitle">
            <span class="overTime" v-if="doc.isOvertime"><i class="el-icon-information"></i> 超时</span>
            <span class="title" :style="{maxWidth:calWidth(doc)}">{{doc.docTitle}}</span>
            <span class="improtType" v-if="doc.docImprotType!='普通'&&doc.docImprotType!=''" :style="{background:doc.docImprotType=='紧急'?'#FFD702':'#FF0202'}">{{doc.docImprotType}}</span>
            <span class="improtType" v-if="doc.docDenseType!='平件'&&doc.docDenseType!=''" :style="{background:doc.docDenseType=='保密'?'#FFD702':'#FF0202'}">{{doc.docDenseType}}</span>
          </router-link>
          <td>{{doc.taskUser}}</td>
          <td>{{doc.taskTime}}</td>
          <td><span>{{doc.currentUser}}</span></td>
          <td>
            <el-tooltip content="查看流转" placement="top" :enterable="false" effect="light">
              <i class="link iconfont icon-liucheng" @click="getProcess(doc.id)"></i>
            </el-tooltip>
            <!-- 撤回权限由后台返回字段isBack控制 0 无权限 1 有权限 -->
            <el-tooltip content="撤回" placement="top" :enterable="false" effect="light" v-if="doc.isBack!=0">
              <i class="link iconfont icon-chehui" @click="doBack(doc.id)"></i>
            </el-tooltip>
            <el-tooltip content="分发" placement="top" :enterable="false" effect="light">
              <i class="link iconfont icon-share1" @click="distribute(doc.id)"></i>
            </el-tooltip>
            <!-- 导出PDF权限 只有当公文申请人为当前登陆人 且符合特殊公文类型(由全局方法showDowload 判断) 才能导出 -->
            <el-tooltip content="导出" placement="top" :enterable="false" effect="light">
              <a :href="baseURL+'/pdf/exportPdf?docId='+doc.id" target="_blank" v-if="doc.taskUserId==userInfo.empId&&showDowload(doc.docTypeCode)">
              <i class="link iconfont icon-icon202"></i>
              </a>
            </el-tooltip>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="pageBox" v-show="docData.length>0">
      <el-pagination @current-change="handleCurrentChange" :current-page="params.pageNumber" :page-size="15" layout="total, prev, pager, next, jumper" :total="totalSize">
      </el-pagination>
    </div>    
    <distribute-dialog :visible.sync="showDistribute" :docId="docId"></distribute-dialog>
  </div>
</template>
<script>
import SearchOptions from '../../components/searchOptions.component'
import DistributeDialog from '../../components/distributeDialog.component'
import { docConfig } from '../../common/docConfig'
import { mapGetters } from 'vuex'

const tableTitle = ['', '公文名称', '呈报人', '呈报时间', '当前节点', '操作']

export default {
  data() {
    return {
      urgencyValue: "",
      type: '',
      tableTitle,
      detailView: false,
      params: {
        "pageNumber": 1,
        "pageSize": 15
      },
      docData: [],
      totalSize: 0,
      searchLoading: false,
      searchOptions: '',
      docId: '',
      showDistribute: false
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'confidentiality',
      'urgency',
      'docType',
      'baseURL'
    ])
  },
  components: {
    SearchOptions,
    DistributeDialog
  },
  created() {
    this.getData();
  },
  activated(){
    this.getData();
  },
  methods: {
    getData() {
      var that = this;
      this.searchLoading = true;
      var params = Object.assign({ userId: this.userInfo.empId }, this.params, this.searchOptions);
      this.$http.post("/doc/trackingDocList", params, { body: true }).then(res => {
        setTimeout(function() {
          that.searchLoading = false;
        }, 200)
        if (res.status == 0) {
          this.docData = res.data.dList;
          this.totalSize = res.data.totalSize;
        } else {
          this.docData = [];
          this.totalSize = 0;
        }
      }, res => {

      })
    },
    getProcess(id) {
      this.$store.dispatch('getTaskDetail', id);
    },
    distribute(id) {
      this.docId = id;
      this.showDistribute = true;
    },
    doBack(id) {
      this.$confirm('是否撤回此公文?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post('/doc/docTaskBack', { empId: this.userInfo.empId, docId: id }, )
          .then(res => {
            if (res.status == 0) {
              this.$message.success('撤回成功！');
              this.getData();
              this.$store.dispatch('getDocTips');
            } else {
              this.$message.error(res.message);
            }
          })
      }).catch(() => {

      });
    },
    formatter(row, column, cellValue) {
      switch (cellValue) {
        case "start":
          return "发起";
          break;
        case 'task':
          return "批核";
          break;
        case 'trans':
          return "转发";
          break;
        case 'end':
          return "归档";
          break;

        default:
          return cellValue;
      }
    },
    handleCurrentChange(page) {
      this.params.pageNumber = page;
      this.getData()
    },
    setOptions(options) {
      this.searchOptions = options;
      this.params.pageNumber = 1;
      this.getData();
    },
    handDocType(val) {
      return docConfig.find(d => d.code == val.docTypeCode) || { color: '', shortName: '', }
    },
    calWidth(doc) {
      var width = 1;
      if (doc.isOvertime) {
        width -= 0.18
      }
      if (doc.docImprotType != '普通' && doc.docImprotType != '') {
        width -= 0.16
      }
      if (doc.docDenseType != '平件' && doc.docDenseType != '') {
        width -= 0.16
      }
      return parseInt(width * 100) + '%'
    }
  }
}

</script>
<style lang='scss'>
$main: #0460AE;
#docTracking {
  .pageBox {
    text-align: right;
    margin-top: 20px;
  }
  margin-bottom:30px;
  thead {
    $widths: (1: 5%, 2: 36%, 3: 10%, 4: 11%, 5:10%, 6: 15%);
    @each $num,
    $width in $widths {
      th:nth-child(#{$num}) {
        width: $width;
      }
    }
  }
  
}

</style>
