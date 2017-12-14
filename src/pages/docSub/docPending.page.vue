<template>
  <div id="docPending">
    <search-options title="公文签批" @search="setOptions" hasOverTime></search-options>
    <el-table ref="multipleTable" :data="docData" style="width: 100%" @selection-change="handleSelectionChange" class="taskAllTable" stripe v-if="userInfo.empId==leaderEmpid" v-loading.body="searchLoading">
      <el-table-column type="selection" width="35" class-name="selectionColumn" label-class-name="selectionColumnLabel">
      </el-table-column>
      <el-table-column label=" " width="50" class-name="docType">
        <template scope="scope">
          <span :style="{background:handDocType(scope.row).color}">{{handDocType(scope.row).shortName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="docTitle" label="公文名称">
        <template scope="scope">
          <router-link :to="{path:'/doc/docInfo/'+scope.row.id,query:{code:scope.row.docTypeCode}}" class="linkTitle">
            <span class="overTime" v-if="scope.row.isOvertime"><i class="el-icon-information"></i> 超时</span>
            <span class="title" :style="{maxWidth:calWidthAll(scope.row)}">{{scope.row.docTitle}}</span>
            <span class="improtType" v-if="scope.row.docImprotType!='普通'&&scope.row.docImprotType!=''" :style="{background:scope.row.docImprotType=='紧急'?'#FFD702':'#FF0202'}">{{scope.row.docImprotType}}</span>
            <span class="improtType" v-if="scope.row.docDenseType!='平件'&&scope.row.docDenseType!=''" :style="{background:scope.row.docDenseType=='保密'?'#FFD702':'#FF0202'}">{{scope.row.docDenseType}}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="taskUser" label="呈报人" width="100">
      </el-table-column>
      <el-table-column prop="taskTime" label="呈报时间" width="110">
      </el-table-column>
      <el-table-column prop="currentUser" label="当前节点" width="100">
        <template scope='scope'>
          <span>{{scope.row.currentUser}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" class-name="operateColumn">
        <template scope="scope">
          <el-tooltip content="签批" placement="top" :enterable="false" effect="light">
              <router-link tag="i" class="link iconfont icon-icon-approve-bold" :to="{path:'/doc/docDetail/'+scope.row.id,query:{code:scope.row.docTypeCode}}"></router-link>
            </el-tooltip>
            <el-tooltip content="查看流转" placement="top" :enterable="false" effect="light">
              <i class="link iconfont icon-liucheng" @click="getProcess(scope.row.id)"></i>
            </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <table bgcolor="#fff" class="myDocList" width="100%" cellspacing="0" v-loading.body="searchLoading" v-else>
      <caption>
      </caption>
      <thead align="left">
        <tr>
          <th v-for="title in tableTitle">{{title}}</th>
        </tr>
      </thead>
      <tbody v-for="doc in docData" :key="doc.taskTime" :class="{disAgree:doc.isAgree===0}">
        <tr>
          <td><span class="docType" :style="{background:handDocType(doc).color}">{{handDocType(doc).shortName}}</span></td>
          <router-link tag="td" :to="{path:'/doc/docDetail/'+doc.id,query:{code:doc.docTypeCode}}" class="linkTitle">
            <span class="overTime" v-if="doc.isOvertime"><i class="el-icon-information"></i> 超时</span>
            <span class="title" :style="{maxWidth:calWidth(doc)}">{{doc.docTitle}}</span>
            <span class="improtType" v-if="doc.docImprotType!='普通'&&doc.docImprotType!=''" :style="{background:doc.docImprotType=='紧急'?'#FFD702':'#FF0202'}">{{doc.docImprotType}}</span>
            <span class="improtType" v-if="doc.docDenseType!='平件'&&doc.docDenseType!=''" :style="{background:doc.docDenseType=='保密'?'#FFD702':'#FF0202'}">{{doc.docDenseType}}</span>
          </router-link>
          <td>{{doc.taskUser}}</td>
          <td>{{doc.taskTime}}</td>
          <td><span>{{doc.currentUser}}</span></td>
          <td>
            <el-tooltip content="签批" placement="top" :enterable="false" effect="light">
              <router-link tag="i" class="link iconfont icon-icon-approve-bold" :to="{path:'/doc/docDetail/'+doc.id,query:{code:doc.docTypeCode}}"></router-link>
            </el-tooltip>
            <el-tooltip content="查看流转" placement="top" :enterable="false" effect="light">
              <i class="link iconfont icon-liucheng" @click="getProcess(doc.id)"></i>
            </el-tooltip>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="pageBox" v-show="docData.length>0">
      <el-pagination @current-change="handleCurrentChange" :current-page="params.pageNumber" :page-size="10" layout="total, prev, pager, next, jumper" :total="totalSize">
      </el-pagination>
    </div>
    <el-card class="taskCard" v-if="userInfo.empId==leaderEmpid&&docData.length>0">
      <h4 class="title">我的审批意见 <span>已选择<i> {{selDocs.length}} </i>条公文</span></h4>
      <el-form label-position="left" label-width="128px" :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item label="审批意见" class="textarea" prop="state">
          <el-col :span='18'>
            <el-radio-group class="myRadio" v-model="ruleForm.state" @change="adviceChange">
              <el-radio-button label="1">同意<i></i></el-radio-button>
              <el-radio-button label="2">不同意<i></i></el-radio-button>
            </el-radio-group>
          </el-col>
        </el-form-item>
        <el-form-item label="审批内容" prop="taskContent" class="textarea">
          <el-col :span='18'>
            <el-input type="textarea" v-model="ruleForm.taskContent" resize="none" :rows="8" :maxlength="500"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" :disabled="selDocs.length==0" @click="taskAll">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import SearchOptions from '../../components/searchOptions.component'
import { docConfig } from '../../common/docConfig'
import { mapGetters } from 'vuex'

const tableTitle = ['', '公文名称', '呈报人', '呈报时间', '当前节点', '操作']
const leaderEmpid='C35215E25CE0CA7858829540EFF44FA8'
// const leaderEmpid='3BCF6EECB2611212E088D0D91F2ADE9C'  //杨总
export default {
  data() {
    return {
      leaderEmpid,
      tableTitle,
      contractView: false,
      params: {
        "pageNumber": 1,
        "pageSize": 10
      },
      docData: [],
      totalSize: 0,
      searchLoading: false,
      searchOptions: { isOverTime: '' },
      ruleForm: {
        state: "1",
        taskContent: "同意。"
      },
      rules: {
        state: [{ required: true, message: '请选择审批意见' }],
        taskContent: [{ required: true, message: '请填写审批内容' }]
      },
      selDocs: []
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'confidentiality',
      'urgency',
      'docType'
    ])
  },
  components: {
    SearchOptions
  },
  created() {
    if (this.$route.params.isOverTime) {
      this.searchOptions.isOverTime = '1'
    }
    this.getData();
  },
  methods: {
    getData() {
      var that = this;
      this.searchLoading = true;
      var params = Object.assign({ userId: this.userInfo.empId }, this.params, this.searchOptions);
      this.$http.post("/doc/docPendingList", params, { body: true }).then(res => {
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
    handleSelectionChange(val) {
      this.selDocs = val;
    },
    adviceChange(val) {
      if (val == 1) {
        this.ruleForm.taskContent = '同意。';
      } else if (val == 2) {
        this.ruleForm.taskContent = "不同意。";
      }
    },
    taskAll() {
      this.$confirm('确认一键审批这' + this.selDocs.length + '条公文?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var params = {
          "ids": this.selDocs.map(doc => doc.id),
          "empId": this.userInfo.empId,
          "state": this.ruleForm.state,
          "taskContent": this.ruleForm.taskContent
        }
        this.searchLoading = true;
        this.$http.post('/doc/docTaskAll', params, { body: true })
          .then(res => {
            this.searchLoading = false;
            if (res.status == 0) {
              this.$message.success('审批成功!');
              this.ruleForm.taskContent = '同意。';
              this.ruleForm.state='1'
              this.getData();
              this.$store.dispatch('getDocTips');
            } else {
              this.$message.error(res.message);
            }
          }, res => {
            this.$message.error(res.message);
          })
      })

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
        width -= 0.16
      }
      if (doc.docImprotType != '普通' && doc.docImprotType != '') {
        width -= 0.13
      }
      if (doc.docDenseType != '平件' && doc.docDenseType != '') {
        width -= 0.13
      }
      return parseInt(width * 100) + '%'
    },
    calWidthAll(doc) {
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
#docPending {
  margin-bottom: 30px;
  .pageBox {
    text-align: right;
    margin-top: 20px;
  }
  .taskAllTable {
    .el-table__body-wrapper {
      overflow-x: hidden;
    }
    thead {
      th {
        height: 28px;
        .selectionColumnLabel {
          padding-left: 9px;
        }
      }
    }
    .cell {
      padding-left: 13px;
      padding-right: 0;
      line-height: 16px;
    }
    .link {
      color: $main;
      cursor: pointer;
      font-size: 22px; // display: none;
      padding-right: 10px;
    }
    .link:last-child {
      padding-right: 0;
    }
    tr:hover {
      .link {
        display: inline-block;
      }
    }

    td {
      font-size: 15px;
      word-wrap: break-word;
      vertical-align: middle;
      height: 55px;
      border-bottom: none;
      &.operateColumn {
        .cell {
          padding-top: 10px;
          padding-bottom: 10px;
        }
      }

      &.selectionColumn {
        .cell {
          padding-left: 9px;
        }
      }
      &.docType {
        padding-left: 0;
        .cell {
          padding-left: 0;
          padding-right: 0;
        }
        span {
          color: #fff;
          width: 42px;
          height: 42px;
          display: inline-block;
          text-align: center;
          font-size: 13px; // border-top-right-radius: 5px;
          // border-bottom-right-radius: 5px;
          padding: 3px;
          vertical-align: middle;
          line-height: 16px;
          border-radius: 5px;
        }
      }
      .overTime {
        background: #ED854E;
        height: 19px;
        display: inline-block;
        font-size: 13px;
        line-height: 19px;
        color: #fff;
        border-radius: 2px;
        margin-right: 5px;
        width: 50px;
        text-align: center;
        i {
          margin-right: 1px;
          vertical-align: text-bottom;
        }
      }
      .improtType {
        display: inline-block;
        width: 40px;
        line-height: 19px;
        height: 19px;
        border-radius: 2px;
        text-align: center;
        font-size: 13px;
        margin-left: 5px;
        vertical-align: middle;
        color: #fff;
      }
      .linkTitle {
        cursor: pointer;
        color: inherit;
        display: inline-block;
        width: 100%;
      }
      .title {
        display: inline-block;
        vertical-align: middle;
        max-width: 70%;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
    &.disAgree {
      background: #FFF0F0 !important;
      td:nth-child(5) {
        position: relative;
        span {
          z-index: 2;
          position: relative;
        }
        &:before {
          font-weight: normal;
          content: "\e743";
          font-family: "iconfont" !important;
          font-size: 70px;
          font-style: normal;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          position: absolute;
          top: -15px;
          right: 4px;
          color: #F4B8B2;
        }
      }
    }
  }
  .taskCard {
    margin-top: 20px;
    .myRadio .el-radio-button .el-radio-button__inner {
      height: 45px;
      width: 100px;
      line-height: 45px;
      padding: 0;
    }
    .title {
      position: relative;
      font-size: 18px;
      padding-bottom: 27px;
      line-height: 20px;
      color: #0460AE;
      text-indent: 15px;
      &:before {
        content: '';
        display: block;
        position: absolute;
        left: 0;
        top: 2px;
        width: 4px;
        height: 15px;
        background-color: #0460AE;
      }
      span {
        float: right;
        font-size: 14px;
        color: rgb(72, 86, 106);
        i {
          color: $main;
          font-style: normal;
        }
      }
    }
    .el-button {
      width: 200px;
      border-radius: 3px;
      margin-left: 6px;
    }
  }
}

</style>
