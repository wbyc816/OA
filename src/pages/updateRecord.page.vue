<template>
  <div id='test'>
    <el-row :gutter='12'>
      <el-col :span='17' :xs="24">
        <el-card class="softcard">
          <div slot="header">
            <el-row>
              <el-col :span="4">
                E网更新记录
              </el-col>
              <!-- <el-col class="titleRight" :offset="16" :span="4">
                <i class="iconfont icon-zhinan"></i>
                <a style="color: #0460AE" href="#">下载操作说明</a>
              </el-col> -->
              <!-- <a :href="link" target="_blank" style="float:right;color:#0460AE;font-size:14px;">软件下载说明</a> -->
            </el-row>
          </div>

          <el-table id="tab" @row-click="clickRow" :data="tableData" :stripe="true" highlight-current-row style="width:100%" empty-text="暂无数据" class="airMaterialTable">
          <el-table-column type="expand">
            <template scope="props">
              <div class='tableExpandBox'>
                <div class="width100" >
                  <div>
                    <span>版本更新说明</span>
                    <p>{{props.row.remark1}}</p>
                  </div>
                </div>
                <div class="width100" v-if="false">

                  <div>
                    v-if="props.row.documentUrl!==''"
                    <span>版本发行文档</span>
                    <p><a :href="props.row.documentUrl">{{props.row.documentUrl}}</a></p>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column property="versionTime" label="版本发行日期" width="150"></el-table-column>
          <el-table-column property="version" label="VERSION" width="150"></el-table-column>
          <el-table-column property="remark" label="版本更新说明" ></el-table-column>
          <el-table-column label="操作"  width="100">
            <template slot-scope="scope">
               <el-button   type="text" size="small">展开</el-button>
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

const fmts = [['remark'],['remark1'],  ['versionTime'], ['version'], ['documentUrl'],['id']]
const data=[]
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
      link:''
    }
  },
  created() {
    this.search();
  },
  methods: {
    clickRow(row, event, column){
      document.getElementsByClassName("el-table__expand-icon ")[row.id-1].click();
      let interval = setTimeout(() => {
        if(document.getElementsByTagName("tbody")[0].children[row.id]){
          var data=document.getElementsByTagName("tbody")[0].children[row.id].children[0].children[0].children[0].children[0].children[1].innerHTML
          var da = data.replace(/\\n/g,"<br/>");
          document.getElementsByTagName("tbody")[0].children[row.id].children[0].children[0].children[0].children[0].children[1].innerHTML=da
        }

    }, 10)
    },
    search() {
      var that=this;
      api.getUpdateRecord({
        pageNumber: this.paginate.currentPage,
        pageSize: 10
      }).then((data) => {
        this.link=data.manualUrl;
        this.paginate.total = data.data.totalSize;
        this.tableData = dataTransform(data.data.records, fmts)
        for(var i=0;i<data.data.records.length;i++){
             if(data.data.records[i].remark.indexOf("\\n")>-1)
             document.getElementsByTagName("tbody")[0].children[i].children[3].innerHTML=data.data.records[i].remark.substring(0,data.data.records[i].remark.indexOf("\\n")) +'<br/>'+  data.data.records[i].remark.substring(data.data.records[i].remark.indexOf("\\n")+2)
        }
          
      
        
        // that.tableData = data.data.records;
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
#test {
  .el-table_1_column_4{
    text-align: center
  }
  .el-card.softcard {
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
