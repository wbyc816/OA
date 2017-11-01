<template>
  <div id="docSearch">
    <search-options title="公文查询" @search="setOptions"></search-options>
    <table bgcolor="#fff" class="myDocList" width="100%" cellspacing="0" v-loading.body="searchLoading">
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
          <td>
            <span class="title" :style="{maxWidth:calWidth(doc)}">{{doc.docTitle}}</span>
            <span class="improtType" v-if="doc.docImprotType!='普通'&&doc.docImprotType!=''" :style="{background:doc.docImprotType=='紧急'?'#FFD702':'#FF0202'}">{{doc.docImprotType}}</span>
            <span class="improtType" v-if="doc.docDenseType!='平件'&&doc.docDenseType!=''" :style="{background:doc.docDenseType=='保密'?'#FFD702':'#FF0202'}">{{doc.docDenseType}}</span>
          </td>
          <td>{{doc.taskUser}}</td>
          <td>{{doc.taskTime}}</td>
          <td><span>{{doc.currentUser}}</span></td>
          <td>
            <el-tooltip content="查看" placement="top" effect="light">
              <router-link tag="i" class="link iconfont icon-icon-approve-bold" :to="'/doc/docDetail/'+doc.id"></router-link>
            </el-tooltip>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="pageBox" v-show="docData.length>0">
      <el-pagination @current-change="handleCurrentChange" :current-page="params.pageNumber" :page-size="10" layout="total, prev, pager, next, jumper" :total="totalSize">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import SearchOptions from '../../components/searchOptions.component'
import { docConfig } from '../../common/docConfig'
import { mapGetters } from 'vuex'
const tableTitle = ['', '公文名称', '呈报人', '呈报时间', '当前节点', '']

export default {
  components: {
    SearchOptions
  },
  data() {
    return {
      tableTitle,
      params: {
        "pageNumber": 1,
        "pageSize": 10
      },
      docData: [],
      totalSize: 0,
      searchLoading: false,
      searchOptions: ''
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'confidentiality',
      'docType',
      'urgency'
    ])
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      var that = this;
      this.searchLoading = true;
      var params = Object.assign({ userId: this.userInfo.empId }, this.params, this.searchOptions);
      this.$http.post("/doc/selectDocList", params, { body: true }).then(res => {
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
      return docConfig.find(d => d.docName == val.docTypeCode)||{color: '',shortName: '',}
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
    }
  }
}

</script>
<style lang='scss'>
$purple: #0460AE;
#docSearch {
  .pageBox {
    text-align: right;
    margin-top: 20px;
  }
  margin-bottom:30px;
}

</style>
