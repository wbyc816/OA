<template>
  <div id="homeChild">
    <el-carousel height="347px" arrow="always">
      <el-carousel-item v-for="p in pics">
        <img :src="p">
      </el-carousel-item>
    </el-carousel>
    <el-card class="shareBox">
      <el-row>
        <el-col :span="12" class="shareWith">
          <p> <i class="iconfont icon-renmian"></i> 人事任免
            <router-link :to="{ name: 'newsListHr', params: { classify: 'FIL0301' }}">更多</router-link>
          </p>
          <ul>
            <li v-for="(hr,index) in hr1" v-if="index<3" @click="goTo(hr)">
              <p>{{hr.fileNameOld}} <span class="new" v-if="index==0">NEW</span></p>
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
              <p>{{hr.fileNameOld}} <span class="new" v-if="index==0">NEW</span></p>
              <p>{{hr.majorName}}<span>{{hr.createTime | time('date')}}</span></p>
            </li>
          </ul>
        </el-col>
      </el-row>
    </el-card>
    <div class="imgBox">
      <!-- <img src="../../assets/images/Image88.jpg" alt=""> -->
      <img :src="childPic" alt="">
    </div>
    <el-card class="borderCard highLight">
      <p slot="header"><i class="iconfont icon-zhinan"></i>办事指南
        <router-link :to="{ name: 'newsListHr', params: { classify: 'FIL0305' }}" class="headRight">更多</router-link>
      </p>
      <el-row>
        <template>
          <el-col :span="12" v-for="(hr,index) in hr3" v-if="index<3">
            <div @click="goTo(hr)">
              <p>{{hr.fileNameOld}} </p>
              <p>{{hr.majorName}}<span>{{hr.createTime | time('date')}}</span></p>
            </div>
          </el-col>
        </template>
      </el-row>
    </el-card>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      pics: [],
      childPic:'',
      hr1:[],
      hr2:[],
      hr3:[]
    }
  },
  created() {
    this.getPics();
    this.getChildPic();
    this.getOtherNews('FIL0301');
    this.getOtherNews('FIL0302');
    this.getOtherNews('FIL0305');
  },
  methods: {
    getPics() {
      this.$http.post('/index/getBasicImage', { imageType: 'ADM0602' })
        .then(res => {
          if (res.status == 0) {
            this.pics = res.data;
          }
        })
    },
    getChildPic(){
      this.$http.post('/index/getBasicImage', { imageType: 'ADM0603' })
        .then(res => {
          if (res.status == 0) {
            this.childPic = res.data[0];
          }
        })
    },
    getOtherNews(classify){
      this.$http.post('/index/selectFileList', { classify2: classify })
      .then(res1 => {
        if (res1.status == 0) {
          if(classify=='FIL0301'){
            this.hr1=res1.data;
          }else if(classify=='FIL0302'){
            this.hr2=res1.data;
          }else{
            this.hr3=res1.data;
          }
        }
      })
    },
    goTo(data){
      this.$router.push('/HR/newsDetailHr/'+data.fileId);
    }
  }
}

</script>
<style lang="scss">
$main: #0460AE;
$brown: #985D55;

#homeChild {
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
        text-overflow: ellipsis;;
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
        div {
          padding-top: 0;
          border-top: none;
        }
      }
    }
  }
  .imgBox {
    width: 100%;
    margin-bottom: 20px;
    img {
      width: 100%;
    }
  }
  .shareBox {
    .el-card__body {
      padding: 0 12px;
    }
    .shareWith {
      border-right: 1px solid #E9E9E9;
      padding-right: 14px;
      &>p {
        font-size: 18px;
        color: $main;
        line-height: 45px;
        border-bottom: 1px solid #E9E9E9;
        padding: 0 15px 0 3px;
        i {
          font-size: 20px;
          vertical-align: middle;
          margin-right: 10px;
        }
        a:last-child {
          float: right;
          font-size: 14px;
          color: #676767;
          cursor: pointer;
        }
      }
      ul {
        li {
          padding: 18px 7px 18px;
          border-top: 1px solid #E9E9E9;
          color: #676767;
          cursor: pointer;
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
            .new {
              font-size: 12px;
              font-weight: normal;
              background: #FF9300;
              color: #fff;
              border-radius: 2px;
              padding: 0 2px;
              vertical-align: top;
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
        li:first-child {
          border-top: none;
        }
      }
    }
    .myShare {
      border: none;
      padding-right: 0;
      padding-left: 14px;
      .purpleTip {
        background: $main;
        color: #fff;
        padding: 5px 10px;
        border-bottom-right-radius: 5px;
        border-top-right-radius: 5px;
      }
      .greyTip {
        background: #AAAAAA;
      }
    }
  }
}

</style>
