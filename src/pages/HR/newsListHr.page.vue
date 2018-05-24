<template>
  <div id="newsListHr">
    <el-card class="borderCard highLight">
      <div slot="header" class="clearfix">
        <span>{{newsType[params.classify2]}}</span>
        <span v-show="params.title" class="headLeft">按搜索条件 "<i>{{params.title}}</i>" 查询结果</span>
        <el-cascader expand-trigger="hover" :options="catalogueList" :props="defaultProp" v-model="catalogueName" popper-class="myCascader" class="headRight" clearable @change="catalogueChange" placeholder="所有">
        </el-cascader>
      </div>
      <el-row>
        <template>
          <el-col :span="12" v-for="(news,index) in newList">
            <router-link target= "_blank" :to="'/HR/newsDetailHr/'+news.fileId">
              <p>{{news.fileNameOld}} </p>
              <p class="clearfix">{{news.majorName}}<span>{{news.createTime | time('date')}}</span></p>
            </router-link>
          </el-col>
        </template>
      </el-row>
      <div class="alignCenter" v-if="newList.length==0">
        <br>暂无数据
        <br>
      </div>
    </el-card>
    <div class="pageBox" v-show="newList.length>0">
      <el-pagination @current-change="handleCurrentChange" :current-page="params.pageNumber" :page-size="10" layout="total, prev, pager, next, jumper" :total="totalSize">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'newsListHr',
  components: {},
  data() {
    return {
      newList: [],
      newsType: {
        'FIL03': '所有文件',
        'FIL0301': '人事任免',
        'FIL0302': 'HR政策',
        'FIL0303': '规章制度',
        'FIL0304': '使用手册',
        'FIL0305': '办事指南',
        'FIL0306': '各类模板',
        'FIL0307': '局方政策',
        'FIL0308': '公司政策',
        'FIL0309': '公司推进情况',
      },
      params: {
        classify2: "",
        pageNumber: 1,
        pageSize: 10,
        title: '',
        deptId: ''
      },
      totalSize: 0,
      defaultProp: {
        value: 'id',
        label: 'name',
        children: 'catalogues'
      },
      catalogueList: [],
      catalogueName: []
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
    ])
  },
  created() {
    this.initSearch(this.$route);
    this.getFileCatalogue();
  },
  beforeRouteEnter(to, from, next) {
    // console.log(from);
    if (from.name === 'newsDetailHr') {
      next()
    } else {
      next(vm => {
        vm.initSearch(to);
      });
    }

  },
  beforeRouteUpdate(to, from, next) {
    this.initSearch(to);
    next();
  },
  methods: {
    initSearch(route) {
      this.params.classify2 = route.params.classify;
      this.params.title = route.query.title;
      this.getOtherNews();
    },
    getOtherNews() {
      this.$http.post('/index/selectBasicFileList', Object.assign(this.params, { empId: this.userInfo.empId }))
        .then(res => {
          if (res.status == 0) {
            if (res.data.tBasicFileList) {
              this.newList = res.data.tBasicFileList;
              this.totalSize = res.data.totalSize;
            } else {
              this.newList = [];
              this.totalSize = 1;
            }

          }
        })
    },
    handleCurrentChange(page) {
      this.params.pageNumber = page;
      this.getOtherNews()
    },
    catalogueChange(val) {

      this.params.deptId = val[val.length - 1] || '';
      this.getOtherNews();
    },
    getFileCatalogue() {

      function loopMap(arr) {
        arr.forEach(function(dep) {
          dep.catalogues.forEach(function(child) {
            child.catalogues = null;
          })
        })
      }
      this.$http.post('/doc/getFileCatalogue')
        .then(res => {
          if (res.status == '0') {
            loopMap(res.data);
            res.data[0].catalogues = null;
            // console.log(res.data)
            this.catalogueList = res.data;
          } else {
            console.log('获取发文目录失败')
          }
        })
    },
  }
}

</script>
<style lang="scss">
$main: #0460AE;
$brown: #985D55;

#newsListHr {
  .alignCenter {
    text-align: center!important;
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

      .headLeft {
        font-size: 14px;
        color: #676767;
        i {
          color: $main;
          font-style: normal;
        }
      }
      .headRight {
        height: 35px;
        input {
          height: 35px;
        }
        .el-cascader__label {
          line-height: 45px;
        }
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
          display: inline-block;
          width: 100%;
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
            height: 14px;
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
