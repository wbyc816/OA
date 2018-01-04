<template>
  <div class="empIntroduceDetail clearBoth">
    <div class="empBox clearfix">
      <div class="imgBox">
        <img :src="info[0].picUrl" alt="" v-show="info[0].picUrl">
        <img src="../../../assets/images/blankHead.png" alt="" v-show="!info[0].picUrl">
      </div>
      <el-row class="empinfoBox">
        <el-col :span="11"><span class="itemTitle">姓名</span><span class="text">{{info[0].name}}</span></el-col>
        <el-col :span="13"><span class="itemTitle">毕业学校</span><span class="text">{{info[0].graduationSchool}}</span></el-col>
        <el-col :span="11"><span class="itemTitle">性别</span><span class="text">{{info[0].gender | sex}}</span></el-col>
        <el-col :span="13"><span class="itemTitle">学历</span><span class="text">{{info[0].education}}</span></el-col>
        <el-col :span="11"><span class="itemTitle">出生日期</span><span class="text">{{info[0].birthday | time('ch')}}</span></el-col>
        <el-col :span="13"><span class="itemTitle">专业</span><span class="text">{{info[0].major}}</span></el-col>
        <el-col :span="11"><span class="itemTitle">手机</span><span class="text">{{info[0].mobileNumber}}</span></el-col>
        <el-col :span="13"><span class="itemTitle">外语水平</span><span class="text">{{info[0].languageLevel}}</span></el-col>
        <el-col :span="11"><span class="itemTitle">邮箱</span><span class="text">{{info[0].email}}</span></el-col>
        <el-col :span="13"><span class="itemTitle">参加工作时间</span><span class="text">{{info[0].beginWorkDate | time('ch')}}</span></el-col>
      </el-row>
    </div>
    <!-- <el-table :data="info[0].introduceContract" :stripe="true" highlight-current-row style="width: 100%" class="appTable">
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column property="contractType" label="合同类型" width="200"></el-table-column>
      <el-table-column property="contractMajor" label="合同主体"></el-table-column>
      <el-table-column property="contractStart" label="合同开始日期" width="150">
        <template scope="scope">
          {{scope.row.contractStart | time('ch')}}
        </template>
      </el-table-column>
      <el-table-column property="contractEnd" label="合同预计结束日期" width="150">
        <template scope="scope">
          {{scope.row.contractEnd | time('ch')}}
        </template>
      </el-table-column>
    </el-table> -->
    <el-row>
      <el-col :span="24">
        <h1 class="title">上次离职原因</h1>
        <p v-if="info" class="textContent">{{info[0].leaveReason}}</p>
      </el-col>
      <el-col :span="12" class="rightBorder">
        <h1 class="title">离职时间</h1>
        <p v-if="info" class="textContent">{{info[0].leaveDate | time('ch')}}</p>
      </el-col>
      <el-col :span="12">
        <h1 class="title">离职办理地点</h1>
        <p v-if="info" class="textContent">{{info[0].leavePlace}}</p>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    info: {
      type: Array
    },
  },
  data() {
    return {

    }
  },
  computed: {
    ...mapGetters([
      'submitLoading'
    ])
  },
  methods: {

  }
}

</script>
<style lang='scss'>
$main:#0460AE;
.empIntroduceDetail {
  .empBox {
    padding: 20px 0;
    border-bottom: 1px solid #D5DADF;
    // margin-bottom: 20px;
    .imgBox {
      float: left;
      width: 18%;
      padding-top:20px;
      padding-left: 24px;
      img {
        width: 100%;
      }
    }
    .empinfoBox {
      float: right;
      width: 80%;
      .el-col {
        min-height: 50px;
        font-size: 15px;
        border-bottom:none!important;
        .itemTitle {
          display: table-cell;
          vertical-align:middle;
          color: $main;
          width: 110px;
        }
        .text{
          display:table-cell;
          vertical-align:middle;
          line-height: 18px;
        }
        // &:nth-child(odd) {
        //   .itemTitle {
        //     width: 110px;
        //   }
        // }
      }
    }
  }
}

</style>
