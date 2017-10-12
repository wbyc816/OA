<template>
  <div class="empChangeDetail clearBoth">
    <div class="empBox">
      <div class="imgBox">
        <img :src="info[0].empInfo.picUrl" alt="" v-show="info[0].empInfo.picUrl">
        <img src="../../../assets/images/blankHead.png" alt="" v-show="!info[0].empInfo.picUrl">
      </div>
      <ul class="clearfix">
        <li><span class="itemTitle">姓名</span><span class="text">{{info[0].empInfo.name}}</span></li>
        <li><span class="itemTitle">毕业学校</span><span class="text">{{info[0].empInfo.graduationSchool}}</span></li>
        <li><span class="itemTitle">性别</span><span class="text">{{info[0].empInfo.gender | sex}}</span></li>
        <li><span class="itemTitle">学历</span><span class="text">{{info[0].empInfo.eduBackground}}</span></li>
        <li><span class="itemTitle">年龄</span><span class="text">{{info[0].empInfo.age}}</span></li>
        <li><span class="itemTitle">专业</span><span class="text">{{info[0].empInfo.major}}</span></li>
        <li><span class="itemTitle">入公司时间</span><span class="text">{{info[0].empInfo.joinDate |time('ch')}}</span></li>
        <li><span class="itemTitle">外语水平</span><span class="text">{{info[0].empInfo.certificateType}}</span></li>
      </ul>
    </div>
    <el-col :span="12" class="rightBorder">
      <h1 class="title">拟调入部门</h1>
      <p v-if="info" class="textContent">{{info[0].planDeptMajorName}}</p>
    </el-col>
    <el-col :span="12">
      <h1 class="title">拟调入处室</h1>
      <p v-if="info" class="textContent">{{info[0].planDeptName}}</p>
    </el-col>
    <el-col :span="12" class="rightBorder">
      <h1 class="title">拟调入岗位</h1>
      <p v-if="info" class="textContent">{{info[0].palnJobtitle}}</p>
    </el-col>
    <el-col :span="12" class="blank">
      <h1 class="title"></h1>
    </el-col>
    <el-col :span="24" style="min-height:90px">
      <h1 class="title">工作经历</h1>
      <p v-if="info" class="textContent">{{info[0].workExperience}}</p>
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
.empChangeDetail {
  .empBox {
    position: relative;
    padding: 20px 0 20px 176px;
    border-bottom: 1px solid #D5DADF;
    .imgBox {
      position: absolute;
      left: 24px;
      top: 35px;
      width: 120px;
      img{
        width:100%;
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
