<template>
  <div id="newsListHr">
    <el-card class="borderCard highLight">
      <div slot="header" class="clearfix">
        <span>{{newsType[params.classify2]}}</span>
      </div>
      <el-row>
        <template>
          <el-col :span="12" v-for="(news,index) in newList">
            <router-link :to="'/HR/newsDetailHr/'+news.fileId">
              <p>{{news.fileNameOld}} </p>
              <p>{{news.majorName}}<span>{{news.createTime | time('date')}}</span></p>
            </router-link>
          </el-col>
        </template>
      </el-row>
      <div class="alignCenter" v-if="newList.length==0"><br>暂无数据<br></div>
    </el-card>
    <div class="pageBox" v-show="newList.length>0">
      <el-pagination @current-change="handleCurrentChange" :current-page="params.pageNumber" :page-size="10" layout="total, prev, pager, next, jumper" :total="totalSize">
      </el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      newList:[],
      newsType:{
        'FIL0301':'人事任免',
        'FIL0302':'HR政策',
        'FIL0303':'规章制度',
        'FIL0304':'使用手册',
        'FIL0305':'办事指南'
      },
      params:{
        classify2:"",
        pageNumber:1,
        pageSize:10
      },
      totalSize:0
    }
  },
  created() {
    this.params.classify2=this.$route.params.classify;
    this.getOtherNews();
  },
  methods: {
    getOtherNews(){
      this.$http.post('/index/selectBasicFileList', this.params)
      .then(res => {
        if (res.status == 0 && res.data.tBasicFileList) {
          this.newList=res.data.tBasicFileList;
          this.totalSize = res.data.totalSize;
        }
      })
    },
    handleCurrentChange(page) {
      this.params.pageNumber = page;
      this.getOtherNews()
    }
  }
}

</script>
<style lang="scss">
$main: #0460AE;
$brown: #985D55;

#newsListHr {
  .alignCenter{
    text-align:center!important;
  }
  .pageBox {
    text-align: right;
    margin: 20px 0;
  }
  .el-carousel {
    margin-bottom: 20px;
  }
  .highLight {
    .el-card__header {
      margin: 0 12px;
      padding: 0;
      line-height: 45px;
      color: $main;
      i {
        margin-right: 10px;
        font-size: 20px;
      }
      .headRight {
        font-size: 14px;
        color: #676767;
      }
    }
    .el-card__body {
      padding: 12px 0;
      .el-col {
        padding: 12px 18px 0 14px;
        border-right: 1px solid #E9E9E9;
        a {
          padding: 14px 7px 10px;
          border-top: 1px solid #E9E9E9;
          color: #676767;
          cursor: pointer;
          .new {
              font-size: 12px;
              font-weight: normal;
              background: #FF9300;
              color: #fff;
              border-radius: 2px;
              padding: 0 2px;
              vertical-align: top;
            }
          p:first-child {
            font-size: 16px;
            line-height: 30px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            img {
              vertical-align: sub;
              padding-right: 5px;
            }
          }
          p:last-child {
            margin-top: 10px;
            font-size: 12px;
            span {
              float: right;
            }
          }
        }
      }
      .el-col:nth-child(-n+2) {
        padding-top: 6px;
        a {
          padding-top: 0;
          border-top: none;
        }
      }
    }
  }
}

</style>
