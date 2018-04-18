<template>
  <div id="dhCommunity">
    <el-carousel height="347px" arrow="always">
      <el-carousel-item v-for="p in pics">
        <img :src="p">
      </el-carousel-item>
    </el-carousel>
    <!-- <el-card class="shareBox">
      <el-row>
        <el-col :span="12" class="shareWith">
          <p> <i class="iconfont icon-renmian"></i> 人事任免
            <router-link :to="{ name: 'newsListHr', params: { classify: 'FIL0301' }}">更多</router-link>
          </p>
          <ul>
            <li v-for="(hr,index) in hr1" v-if="index<3" @click="goTo(hr)">
              <p><span class="title">{{hr.fileNameOld}}</span> <span class="new" v-if="hr.isRead==='0'">NEW</span></p>
              <p>{{hr.majorName}}<span>{{hr.createTime | time('date')}}</span></p>
            </li>
          </ul>
        </el-col>
        <el-col :span="12" class="shareWith myShare">
          <p> <i class="iconfont icon-hr"></i> HR政策
            <router-link :to="{ name: 'newsListHr', params: { classify: 'FIL0302' }}">更多</router-link>
          </p>
          <ul>
            <li v-for="(hr,index) in hr2" v-if="index<3" @click="goTo(hr)">
              <p><span class="title">{{hr.fileNameOld}}</span> <span class="new" v-if="hr.isRead==='0'">NEW</span></p>
              <p>{{hr.majorName}}<span>{{hr.createTime | time('date')}}</span></p>
            </li>
          </ul>
        </el-col>
      </el-row>
    </el-card>
    <div class="imgBox">
      <img :src="childPic" alt="">
    </div> -->
    <el-card class="highLight" >
      <el-row>
        <template>
          <div v-for="(hr,index) in CommunityDatas" v-if="index<10" >
            <div @click="goTo(hr)" style="width:850px;margin:0 auto">
              <p class="title" style="display:inline-block;font-size:20px;line-height:40px;color:#0170cb">  <span >{{hr.empName}}</span></p>
              <p style="display:inline-block;font-size:16px;line-height:40px;float:right;"><span>{{hr.birthday | time('date')}}</span></p>
              <ul>
                <li><img src=""></li>
              </ul>
            </div>
          </div>
        </template>
      </el-row>
    </el-card>
    <div class="pageBox" v-if="CommunityDatas.length>0">
        <el-pagination @current-change="handleCurrentChange" :current-page="pageNumber" :page-size="10" layout="total, prev, pager, next, jumper" :total="totalSize">
        </el-pagination>
    </div>
  </div>
   
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  components: {},
  data() {
    return {
      pics: [],
      childPic: '',
      hr1: [],
      hr2: [],
      CommunityDatas: [],
      pageNumber:1,
      totalSize: 0,
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
    ])
  },
  created() {
    this.getPics();
    this.getChildPic();
    this.getData();
  },
  methods: {
    handleCurrentChange(page) {
      this.params.pageNumber = page;
      this.getData()
    },
    getPics() {
      this.$http.post('/index/getBasicImage', { imageType: 'ADM0602' })
        .then(res => {
          if (res.status == 0) {
            this.pics = res.data;
          }
        })
    },
    getChildPic() {
      this.$http.post('/index/getBasicImage', { imageType: 'ADM0603' })
        .then(res => {
          if (res.status == 0) {
            this.childPic = res.data[0];
          }
        })
    },
    getData() {
      this.$http.post("/forum/selectForumList", {
        pageNumber: this.pageNumber,
        pageSize: "10"
      }).then(res => {
        setTimeout(function() {
          this.searchLoading = false;
        }, 200)
        if (res.status == 0) {
          this.tableData = res.data.records;
          this.total = res.data.total;
          this.CommunityDatas = res.data.records;
        } else {
          this.tableData = [];
          this.total = 0;
        }
      }, res => {

      })
    }
  }
}

</script>
<style lang="scss">
$main: #0460AE;
$brown: #985D55;

#dhCommunity {
  .circle{
    width: 100px;
    height: 100px;
    background-color:red;
    border-radius: 50%;
    -moz-border-radius: 50%;
    -webkit-border-radius: 50%;
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
        // padding: 12px 18px 0 14px;
        border-right: 1px solid #E9E9E9;
        div {
          padding: 14px 7px 10px;
          border-top: 1px solid #E9E9E9;
          color: #676767;
          cursor: pointer;
          p:first-child {
            font-size: 16px;
            line-height: 30px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            ;
            img {
              vertical-align: sub;
            //   padding-right: 5px;
            }
          }
          p:last-child {
            // margin-top: 10px;
            // font-size: 12px;
            span {
              float: right;
            }
          }
        }
      }
      .el-col:nth-child(-n+2) {
        // padding-top: 6px;
        div {
          padding-top: 0;
          border-top: none;
        }
      }
    }
  
//   .imgBox {
//     width: 100%;
//     margin-bottom: 20px;
//     img {
//       width: 100%;
//     }
//   }
//   .new {
//     font-size: 12px;
//     font-weight: normal;
//     background: #FF9300;
//     color: #fff;
//     border-radius: 2px;
//     padding: 0 2px;
//     vertical-align: top;
//   }
  .title {
    display: inline-block;
    max-width: 90%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
//   .shareBox {
//     .el-card__body {
//       padding: 0 12px;
//     }
//     .shareWith {
//       border-right: 1px solid #E9E9E9;
//       padding-right: 14px;
//       &>p {
//         font-size: 18px;
//         color: $main;
//         line-height: 45px;
//         border-bottom: 1px solid #E9E9E9;
//         padding: 0 15px 0 3px;
//         i {
//           font-size: 20px;
//           vertical-align: middle;
//           margin-right: 10px;
//         }
//         a:last-child {
//           float: right;
//           font-size: 14px;
//           color: #676767;
//           cursor: pointer;
//         }
//       }
//       ul {
//         li {
//           padding: 18px 7px 18px;
//           border-top: 1px solid #E9E9E9;
//           color: #676767;
//           cursor: pointer;
//           p:first-child {
//             font-size: 16px;
//             line-height: 23px;
//             img {
//               vertical-align: sub;
//               padding-right: 5px;
//             }
//           }
//           p:last-child {
//             margin-top: 10px;
//             font-size: 12px;
//             span {
//               float: right;
//             }
//           }
//         }
//         li:first-child {
//           border-top: none;
//         }
//       }
//     }
//     .myShare {
//       border: none;
//       padding-right: 0;
//       padding-left: 14px;
//       .purpleTip {
//         background: $main;
//         color: #fff;
//         padding: 5px 10px;
//         border-bottom-right-radius: 5px;
//         border-top-right-radius: 5px;
//       }
//       .greyTip {
//         background: #AAAAAA;
//       }
//     }
  }
}

</style>
