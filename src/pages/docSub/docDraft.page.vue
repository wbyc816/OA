<template>
  <div id="docDraft">
    <search-options title="公文草稿箱" @search="setOptions" isCollapse></search-options>
    <table bgcolor="#fff" class="myDocList" width="100%" cellspacing="0" v-loading.body="searchLoading">
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
          <router-link tag="td"  :to="{path:'/doc/docCommonApp/'+doc.docTypeCode,query:{id:doc.id}}" class="linkTitle">
            <span class="title" :style="{maxWidth:calWidth(doc)}">{{doc.docTitle}}</span>
            <span class="improtType" v-if="doc.docImprotType!='普通'&&doc.docImprotType!=''" :style="{background:doc.docImprotType=='紧急'?'#FFD702':'#FF0202'}">{{doc.docImprotType}}</span>
            <span class="improtType" v-if="doc.docDenseType!='平件'&&doc.docDenseType!=''" :style="{background:doc.docDenseType=='保密'?'#FFD702':'#FF0202'}">{{doc.docDenseType}}</span>
          </router-link>
          <td>{{doc.taskTime}}</td>
          <td><span>{{doc.currentUser}}</span></td>
          <td>
            <el-tooltip content="编辑" placement="top" :enterable="false" effect="light">
              <router-link tag="i" class="link iconfont icon-icon-approve-bold" :to="{path:'/doc/docCommonApp/'+doc.docTypeCode,query:{id:doc.id}}"></router-link>
            </el-tooltip>
            <el-tooltip content="删除" placement="top" :enterable="false" effect="light">
              <i class="link el-icon-delete" @click="deleteDraft(doc.id)"></i>
            </el-tooltip>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="pageBox" v-show="docData.length>0">
      <el-pagination @current-change="handleCurrentChange" :current-page="params.pageNumber" :page-size="15" layout="total, prev, pager, next, jumper" :total="totalSize">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import SearchOptions from '../../components/searchOptions.component'
import { docConfig } from '../../common/docConfig'
import { mapGetters } from 'vuex'
const tableTitle = ['', '公文名称', '保存时间', '状态', '操作']


export default {
  data() {
    return {
      tableTitle,
      contractView: false,
      params: {
        "pageNumber": 1,
        "pageSize": 15
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
      'urgency',
      'docType'
    ])
  },
  components: {
    SearchOptions
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
      this.$http.post("/doc/getDocDraftsList", params, { body: true }).then(res => {
        setTimeout(function() {
          that.searchLoading = false;

        }, 200)
        if (res.status == 0) {
          this.docData = res.data.records;
          this.totalSize = res.data.total;
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
    deleteDraft(id){
      this.$confirm('是否删除此公文草稿?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post('/doc/deleteDraftsById', {  docId: id }, )
          .then(res => {
            if (res.status == 0) {
              this.$message.success('删除成功！');
              this.getData();
            } else {
              this.$message.error(res.message);
            }
          })
      }).catch(() => {

      });
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
        width -= 0.14
      }
      if (doc.docDenseType != '平件' && doc.docDenseType != '') {
        width -= 0.14
      }
      return parseInt(width * 100) + '%'
    }
  }
}

</script>
<style lang='scss'>
$purple: #0460AE;
#docDraft {
  .pageBox {
    text-align: right;
    margin-top: 20px;
  }
  margin-bottom:30px;
  .myDocList{
    $widths: (1: 5%, 2: 40%, 3: 21%,  4: 10%, 5: 10%);
    @each $num,
    $width in $widths {
      th:nth-child(#{$num}) {
        width: $width;
      }
    }
  }
}

</style>
