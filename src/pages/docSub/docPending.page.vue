<template>
  <div id="docPending">
    <search-options title="公文签批" @search="setOptions" hasOverTime></search-options>
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
  </div>
</template>
<script>
import SearchOptions from '../../components/searchOptions.component'
import { docConfig } from '../../common/docConfig'
import { mapGetters } from 'vuex'

const tableTitle = ['', '公文名称', '呈报人', '呈报时间', '当前节点', '操作']

export default {
  data() {
    return {
      tableTitle,
      contractView: false,
      params: {
        "pageNumber": 1,
        "pageSize": 10
      },
      docData: [],
      totalSize: 0,
      searchLoading: false,
      searchOptions: {isOverTime:''}
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
    if(this.$route.params.isOverTime){
      this.searchOptions.isOverTime='1'
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
      return docConfig.find(d => d.code == val.docTypeCode)||{color: '',shortName: '',}
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
#docPending {
  .pageBox {
    text-align: right;
    margin-top: 20px;
  }
  margin-bottom:30px;
}

</style>
