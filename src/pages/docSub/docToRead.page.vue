<template>
  <div id="docToRead">
    <search-options title="公文待阅" @search="setOptions"></search-options>
    <table bgcolor="#fff" class="myTableList" width="100%" cellspacing="0" v-loading.body="searchLoading">
      <caption>
      </caption>
      <thead align="left">
        <tr>
          <th v-for="title in tableTitle">{{title}}</th>
        </tr>
      </thead>
      <tbody v-for="doc in docData">
        <tr>
          <td>{{doc.docNo}}</td>
          <td>{{doc.docTitle}}</td>
          <td>{{doc.docTypeCode}}</td>
          <td>{{doc.taskTime}}</td>
          <td>{{doc.taskUser}}</td>
          <td>{{doc.nodeName | nodeNameFormatter}}</td>
          <td>
            <router-link :to="'/doc/docDetail/'+doc.id">查看</router-link>
          </td>
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
import SearchOptions from '../../components/searchOptions.component'
import { mapGetters } from 'vuex'

const tableTitle = ['公文号', '标题', '类型', '分发时间', '分发人', '状态', '操作']
export default {
  components: {
    SearchOptions
  },
  data() {
    return {
      tableTitle,
      params: {
        "pageNumber": 1,
        "pageSize": 5
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
      this.$http.post("/doc/toReadingDocList", params, { body: true }).then(res => {
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
    }
  }
}

</script>
<style lang='scss'>
$purple: #0460AE;
#docToRead {
  .pageBox {
    text-align: right;
    margin-top: 20px;
  }
  margin-bottom:30px;

  &>table {
    thead {
      background: $purple;
      color: #fff;
      font-size: 13px;
      th {
        padding: 6px 13px;
      }
      $widths: (1: 15%, 2: 25%, 3: 15%, 4: 15%, 5: 10%, 6: 10%, 7:10%);
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
      background:#fff;
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
}

</style>
