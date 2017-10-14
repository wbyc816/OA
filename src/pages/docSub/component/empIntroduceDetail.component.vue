<template>
  <div class="empIntroduceDetail clearBoth">
    <div class="empBox">
      <div class="imgBox">
        <img :src="info[0].picUrl" alt="" v-show="info[0].picUrl">
        <img src="../../../assets/images/blankHead.png" alt="" v-show="!info[0].picUrl">
      </div>
      <ul class="clearfix">
        <li><span class="itemTitle">姓名</span><span class="text">{{info[0].name}}</span></li>
        <li><span class="itemTitle">毕业学校</span><span class="text">{{info[0].graduationSchool}}</span></li>
        <li><span class="itemTitle">性别</span><span class="text">{{info[0].gender | sex}}</span></li>
        <li><span class="itemTitle">学历</span><span class="text">{{info[0].education}}</span></li>
        <li><span class="itemTitle">出生日期</span><span class="text">{{info[0].birthday | time('ch')}}</span></li>
        <li><span class="itemTitle">专业</span><span class="text">{{info[0].major}}</span></li>
        <li><span class="itemTitle">手机</span><span class="text">{{info[0].mobileNumber}}</span></li>
        <li><span class="itemTitle">外语水平</span><span class="text">{{info[0].languageLevel}}</span></li>
        <li><span class="itemTitle">邮箱</span><span class="text">{{info[0].email}}</span></li>
        <li><span class="itemTitle">参加工作时间</span><span class="text">{{info[0].beginWorkDate | time('ch')}}</span></li>
      </ul>
    </div>
    <el-table :data="info[0].introduceContract" :stripe="true" highlight-current-row style="width: 100%" class="appTable">
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
    </el-table>
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
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    info: {
      type: Array
    }
  },
  data() {
    return {

    }
  },
  computed: {
    ...mapGetters([
      'sumitLoading'
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
    position: relative;
    padding: 20px 0 20px 176px;
    border-bottom: 1px solid #D5DADF;
        margin-bottom: 20px;
    .imgBox {
      position: absolute;
      left: 24px;
      top: 35px;
      width: 120px;
      img {
        width: 100%;
      }
    }
    ul {
      li {
        width: 50%;
        float: left;
        line-height: 50px;
        font-size: 15px;
        .itemTitle {
          display: inline-block;
          color: $main;
          width: 150px;
        }
        &:nth-child(odd) {
          width: 40%;
          .itemTitle {
            width: 110px;
          }
        }
      }
    }
  }
}

</style>
