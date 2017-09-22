<template>
  <div id="docTracking">
    <el-card class="borderCard searchOptions">
      <div slot="header">
        <span>公文追踪</span>
        <i class="iconfont icon-shuaxin"></i>
      </div>
      <el-row :gutter="10">
        <el-col :span="6">
          <el-select v-model="urgencyValue" placeholder="重要程度">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="item in urgency" :label="item.dictName" :value="item.dictCode"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-select v-model="params.docType" placeholder="公文类型">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="item in docType" :label="item.docName" :value="item.docTypeCode"></el-option>
          </el-select>
        </el-col>
        <el-col :span="12">
          <el-input placeholder="公文标题" v-model="params.keyWords"></el-input>
        </el-col>
        <el-col :span="6">
          <el-input placeholder="公文编号" v-model="params.docNo"></el-input>
        </el-col>
        <el-col :span="12">
          <el-date-picker v-model="params.startTime" @change="dateChange" type="date" placeholder="选择呈报日期">
          </el-date-picker>
        </el-col>
        <el-col :span="6">
          <el-button class="searchButton" @click="getDate">搜索</el-button>
        </el-col>
      </el-row>
    </el-card>
    <table bgcolor="#fff" class="myTableList" width="100%" cellspacing="0" v-loading.body="searchLoading">
      <caption>
      </caption>
      <thead align="left">
        <tr>
          <th v-for="title in tableTitle">{{title}}</th>
        </tr>
      </thead>
      <tbody v-for="doc in docData" :key="doc.taskTime">
        <tr>
          <td>{{doc.docDenseType}}</td>
          <td>{{doc.docImprotType}}</td>
          <td>{{doc.docTypeCode}}</td>
          <td>{{doc.taskTime}}</td>
          <td>{{doc.taskUser}}</td>
          <td>{{doc.currentUser}}</td>
        </tr>
        <tr>
          <td>{{doc.docNo}}</td>
          <td colspan="3">{{doc.docTitle}}</td>
          <td>
            <span>
              <!-- <router-link :to="'/doc/docDetail/'+doc.id">详情</router-link> -->
              <!-- <span>Withdraw</span>
            <span @click="contractView = true">Delete</span> -->
            </span>
          </td>
          <td @click="getProcess(doc.id)">查看流转</td>
        </tr>
      </tbody>
    </table>
    <div class="pageBox" v-show="docData.length>0">
      <el-pagination @current-change="handleCurrentChange" :current-page="params.pageNumber" :page-size="5" layout="total, prev, pager, next, jumper" :total="totalSize">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

const tableTitle = ['密级程度', '重要程度', '公文类型', '呈报时间', '呈报人', '当前节点']

export default {
  data() {
    return {
      urgencyValue: "",
      type: '',
      tableTitle,
      detailView: false,
      params: {
        "keyWords": "",
        "docNo": "",
        "taskUserName": "",
        "taskDeptName": "",
        "taskDeptId": "",
        "docType": "",
        "startTime": "",
        "userId": "",
        "pageNumber": 1,
        "pageSize": 5
      },
      docData: [],
      totalSize: 0,
      searchLoading: false
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

  },
  created() {
    this.$store.dispatch('getConfident');
    this.$store.dispatch('getUrgency');
    this.$store.dispatch('getDocForm');
    this.params.userId = this.userInfo.empId;
    this.getDate();
  },
  methods: {
    getDate() {
      var that=this;
      this.searchLoading = true;
      this.$http.post("/doc/trackingDocList", this.params, { body: true }).then(res => {
        setTimeout(function() {
          that.searchLoading = false;

        }, 200)
        if (res.data.status == 0) {
          this.docData = res.data.data.dList;
          this.totalSize = res.data.data.totalSize;
        } else {
          this.docData = [];
          this.totalSize = 0;
        }
      }, res => {

      })
    },
    getProcess(id) {
      this.$store.dispatch('getTaskDetail',id);
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
      this.getDate()
    },
    dateChange(val){
      this.params.startTime=val;
    }
  }
}

</script>
<style lang='scss'>
$purple: #0460AE;
#docTracking {
  .pageBox {
    text-align: right;
    margin-top: 20px;
  }
  margin-bottom:30px;
  .searchOptions {
    .el-card__body {
      .el-col {
        margin-top: 13px;
      }
      .el-select {
        width: 100%;
      }
    }
    padding-bottom:10px;
  }
  .el-date-editor.el-input {
    width: 100%;
  }
  &>table {
    thead {
      background: $purple;
      color: #fff;
      font-size: 13px;
      th {
        padding: 6px 13px;
      }
      $widths: (1: 15%, 2: 10%, 3: 21%, 4: 22%, 5: 16%, 6: 16%);
      @each $num,
      $width in $widths {
        th:nth-child(#{$num}) {
          width: $width;
        }
      }
    }
    td {
      padding: 4px 13px;
      font-size: 14px;
    }
    tbody {
      tr:first-child {
        td {
          border-bottom: 1px dashed #D5DADF;
        }
      }
      tr:last-child {
        td {
          border-bottom: 1px solid #D5DADF;
          vertical-align: middle;
        }
        height: 76px;
        td {
          font-size: 15px;
        }
        td:nth-child(2) {
          color: #151515;
        }
        td:nth-child(3),
        td:last-child {
          color: $purple;
          span {

            cursor: pointer;
          }
        }
        td:last-child {
          cursor: pointer;
        }
      }
    }
    tbody:nth-child(even) {
      background: #F7F7F7;
    }
    tfoot {
      td {
        color: #95989A;
      }
    }
  }
  .myDialog {
    .el-dialog--large {
      display: table;
      width: 1200px;
      top: 0 !important;
      bottom: 0;
      margin: auto !important;
      left: 0;
      right: 0;
      transform: none;
    }
    .el-dialog__body {
      padding: 0;
      position: relative;
    }
    .el-dialog__header {
      padding: 13px 12px;
      border-bottom: 1px solid #F2F2F2;
      .el-dialog__title {
        color: #393939;
        font-size: 18px;
        font-weight: normal;
      }
      .el-dialog__close {
        color: #676767;
      }
    }
  }
  .myTable {
    border: none;
    &:after {
      width: 0;
    }
    tr:hover>td {
      background: #fff;
    }
    tr:nth-child(even) {
      td {
        background: #F7F7F7;
      }
    }
    th {
      height: 26px;
    }
    td {
      border: none;
    }
    .cell {
      padding-left: 5px;
      padding-right: 5px;
    }
  }
  @mixin base-ul {
    display: flex;
    width: 100%;
    .base {
      width: 38%;
      border-right: 1px solid #F2F2F2;
      margin: 18px 0;
      padding-right: 25px;
      li {
        height: 50px;
        line-height: 50px;
        border-bottom: 1px solid #F2F2F2;
        padding-left: 24px;
        span {
          display: inline-block;
          position: relative;
          width: 50%;
          font-size: 15px;
          color: #393939;
        }
      }
      li:first-child {
        height: 35px;
        line-height: 15px;
      }
      li:last-child {
        border: none;
      }
    }
  }
  .description {
    width: 61%;
    font-size: 15px;
    position: relative;
    color: #393939;
    padding-left: 28px;
    p:first-child {
      color: $purple;
      height: 53px;
      line-height: 53px;
    }
    .attachment {
      position: absolute;
      left: 0;
      bottom: 18px;
      width: 100%;
      box-sizing: border-box;
      padding-left: 28px;
      padding-right: 25px;
      li {
        height: 50px;
        line-height: 50px;
        border-bottom: 1px solid #f2f2f2;
        span {
          display: inline-block;
        }
        span:first-child {
          color: $purple;
          width: 20%;
        }
      }
      li:first-child {
        border-top: 1px solid #f2f2f2;
      }
      li:last-child {
        span:last-child {
          text-decoration: underline;
        }
      }
    }
  }
  .detailDialog {
    .information {
      @include base-ul;
    }
    .el-table {
      td {
        height: 54px;
      }
      .cell {
        padding-left: 20px;
        padding-right: 20px;
      }
    }
  }
  .paymentDialog {
    .el-dialog__body {
      position: static;
    }
    .savePdf {
      position: absolute;
      top: 4px;
      right: 50px;
      height: 35px;
      border-radius: 2px;
      width: 152px;
      border: none;
      font-size: 16px;
    }
    .staff {
      @include base-ul;
      .base {
        li span:first-child {
          color: $purple;
        }
      }
      .payment {
        width: 61%;
        border: none;
        padding-left: 25px;
        li {
          padding-left: 14px;
          span:first-child {
            width: 30%;
          }
        }
      }
    }
    .el-table {
      td {
        height: 54px;
      }
      tr th:first-child .cell,
      tr td:first-child .cell {
        padding-left: 20px;
      }
      .cell {
        padding-left: 5px;
        padding-right: 5px;
      }
    }
  }
  .contractDialog {
    .el-dialog__body {
      position: static;
    }
    .topButtons {
      position: absolute;
      top: 4px;
      left: 467px;
      button {
        border-radius: 2px;
        border: none;
        font-size: 16px;
        padding: 10px 20px;
      }
    }
    .information {
      @include base-ul;
      .base {
        margin-bottom: 0;
        li:first-child {
          span {
            color: $purple;
          }
        }
      }
    }
    .information:nth-child(2) {
      padding-bottom: 8px;
      border-bottom: 10px solid $purple;
      .base {
        border-right: 2px solid #CECECE;
      }
    }
    .infoBottom {
      margin-bottom: 15px;
      .base {
        margin: 0;
        li {
          height: 55px !important;
          line-height: 55px !important;
        }
      }
      .base:first-child {
        border-right: 2px solid #CECECE;
        li:not(:first-child) {
          span:first-child {
            top: -10px;
          }
          span:last-child {
            top: 10px;
          }
        }
      }
      .base:last-child {
        padding-left: 28px;
        padding-right: 0;
        width: 61%;
        li {
          padding: 0;
          margin-right: 25px;
        }
        li:not(:first-child) {
          &>span:first-child {
            width: 60%;
            top: 9px;
            span {
              display: block;
              width: 100%;
              line-height: initial;
            }
          }
          &>span:last-child {
            width: 39%;
          }
        }
      }
    }
  }
}

</style>
