<template>
  <div class='tableBox'>
    <div class="tableHead">
      {{tableInfo.head}}
    </div>
    <el-table :data="detailList" class="myTable" v-loading.body="searchLoading">
      <el-table-column type="index" width="60" label="序号">
      </el-table-column>
      <el-table-column :prop="prop.name" :label="prop.label" :width="prop.width" v-for="prop in tableInfo.prop" :key="prop.name" :formatter="formatter"></el-table-column>
    </el-table>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'MyMenuItem',
  props: {
    tableInfo: {
      type: Object,
      default: function() {
        return { head: '', prop: [], url: '' }
      }
    },
    getData: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      detailList: [],
      searchLoading: false,
      requestLoading: false
    }
  },
  computed: {
    ...mapGetters([
      'baseURL',
      'userInfo'
    ])
  },
  watch: {
    getData: function(newVal, oldVal) {
      this.getDetail()
    }
  },
  created(){
    if(this.getData){
      this.getDetail()
    }
  },
  methods: {
    getDetail() {
      if (!this.requestLoading) {
        this.requestLoading = true;
        this.searchLoading = true;
        this.$http.post(this.tableInfo.url, { id: this.userInfo.empId })
          .then(res => {
            this.searchLoading = false;
            if (res.status == '0') {
              this.detailList = res.data
            } else {
              // this.requestLoading = false;
              // this.$notify.error({
              //   title: '错误',
              //   message: '获取' + this.tableInfo.head + '失败!'
              // });
            }
          }, res => {
            this.searchLoading = false;
            this.requestLoading = false;
            this.$notify.error({
              title: '错误',
              message: '获取' + this.tableInfo.head + '失败!'
            });
          })
      }

    },
    formatter(row, column, cellValue) {
      // console.log(cellValue);

      var type = this.tableInfo.prop.find(ele => ele.label == column.label).type;
      switch (type) {
        case undefined:
          return cellValue;
          break;
        case 'date':
          return this.timeFilter(cellValue, type);
          break;
        default:
          return cellValue;
      }
    }
  }
}

</script>
<style lang='scss'>
$main:#0460AE;
$sub:#1465C0;
.tableBox {
  padding-bottom: 40px;
  .tableHead {
    color: $main;
    margin-bottom: 15px;
    font-size: 18px;
    position: relative;
    padding-left: 15px;
    &:before {
      content: '';
      position: absolute;
      height: 15px;
      width: 4px;
      background: $main;
      left: 0;
      top: 5px;
    }
  }
  .el-table__body-wrapper {
    table {
      border: 1px solid #E7E7EB;
    }
  }
  .el-table td {
    border-bottom: none;
  }
  .myTable {
    &:before {
      display: none;
    }
  }
}

</style>
