<template>
  <div id='templateDownload'>
    <el-row :gutter='12'>
      <el-col :span='24' :xs="24">
        <el-card class="softcard">
          <div slot="header">
            <el-row>
              <el-col :span="4">
                模板下载
              </el-col>
              <!-- <el-col class="titleRight" :offset="16" :span="4">
                <i class="iconfont icon-zhinan"></i>
                <a style="color: #0460AE" href="#">下载操作说明</a>
              </el-col> -->
              <!-- <a :href="link" target="_blank" style="float:right;color:#0460AE;font-size:14px;">软件下载说明</a> -->
              
            </el-row>
          </div>

          <div class="search">
            <el-row :gutter="10">
              <el-col :span="6">
                <el-input v-model="name" :maxlength="50"></el-input>
              </el-col>
              <el-col :span="6">
                <el-button class="searchButton" @click="search">搜索</el-button>
              </el-col>
            </el-row>
          </div>

          <el-table :data="tableData" stripe highlight-current-row style="width: 100%">
            <el-table-column property="name" label="模板名称" >
            </el-table-column>
            <el-table-column property="content" label="简介">
            </el-table-column>
            <el-table-column property="createTime" label="创建时间" >
              <template scope="scope">
                    <span>{{ scope.row.createTime | time('date')}}</span>
                  </template>
            </el-table-column>
            
             <el-table-column
              
              label="操作"
              width="500">
              <template scope="scope">
                <el-button @click="formatUrl(scope.row.url)"  type="text" size="small" class="downPdf">{{scope.row.url}}</el-button>
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
        <!-- <side-Person-Search></side-Person-Search> -->
        <!-- <duty></duty> -->
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import duty from '../components/duty.component'
// import deptList from '../components/deptList.component'
// import SidePersonSearch from '../components/sidePersonSearch.component'
import util from '../common/util'
import dataTransform from '../common/dataTransform'
import api from '../fetch/api'
// import searchTemplate from '../components/searchTemplate.component'

const fmts = [['name'], ['content'], ['createTime'], ['url']]

export default {
  data() {
    return {
      name:"",
      date: '',
      // deptList: [],
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
    search() {
      api.getTemplateDownload({
        name: this.name,
        pageNumber: this.paginate.currentPage,
        pageSize: 10
      }).then((res) => {
        // this.link=data.manualUrl;
        this.paginate.total = res.totalSize
        // console.log(data)
        // console.log(dataTransform(data.basicSoftwareInfosList, fmts))
        // console.log(dataTransform(data.basicTemplateInfosList, fmts));
        console.log(res)
        if(res.basicTemplateInfosList){
             console.log(6666)
          this.tableData = dataTransform(res.basicTemplateInfosList, fmts)
        }else{
             console.log(7777)
          this.tableData=[];
        }
        
      })
    },
    handleCurrentChange() {
      this.search()
    },
    formatUrl(data) {
      if(/^http/.test(data)){
         window.open(data,'_blank','width='+(window.screen.availWidth)+',height='+(window.screen.availHeight)+ ',top=0,left=0,status=no')
      }else{
       window.open('http://'+data,'_blank','width='+(window.screen.availWidth)+',height='+(window.screen.availHeight)+ ',top=0,left=0,status=no')
      }
       
    }
  },
  components: {
    // deptList,
    // duty,
    // SidePersonSearch
  }
}
</script>

<style lang="scss">
#templateDownload {
  .search{
    margin-bottom:10px
  }
  .searchButton{
    width: 100px;
  }
  .downPdf{
    font-size:13px;color:black
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
