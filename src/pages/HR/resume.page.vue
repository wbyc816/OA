<template>
  <div id="resume">
    <el-card class="commonCard">
      <div slot="header" class="clearfix">
        <span>个人简历</span>
        <router-link tag="el-button" to="editResume" type="text" class="handleButton"><i class="iconfont icon-edit"></i>完善简历</router-link>
      </div>
      <div class="showBox">
        <el-row :gutter="20" class="baseDetail">
          <el-col :span="6" class="leftDetail">
            <div class="photoBox">
              <img :src="userInfo.picUrl" alt="" v-show="userInfo.picUrl">
              <img src="../../assets/images/blankHead.png" alt="" v-show="!userInfo.picUrl">
            </div>
          </el-col>
          <el-col :span="8">
            <div class="infoItem">
              <span class="infoTittle">姓名</span>
              <p class="infoText" v-if="resumeInfo">{{resumeInfo.name}}</p>
            </div>
            <div class="infoItem">
              <span class="infoTittle">性别</span>
              <p class="infoText" v-if="resumeInfo">{{resumeInfo.gender | sex}}</p>
            </div>
            <div class="infoItem">
              <span class="infoTittle">出生日期</span>
              <p class="infoText" v-if="resumeInfo">{{resumeInfo.birthday}}</p>
            </div>
            <div class="infoItem">
              <span class="infoTittle">籍贯</span>
              <p class="infoText" v-if="resumeInfo">{{resumeInfo.nativePlace}}</p>
            </div>
            <div class="infoItem">
              <span class="infoTittle">民族</span>
              <p class="infoText" v-if="resumeInfo">{{resumeInfo.nationality2}}</p>
            </div>
            <div class="infoItem">
              <span class="infoTittle">出生地</span>
              <p class="infoText" v-if="resumeInfo">{{resumeInfo.birthplace}}</p>
            </div>
            <div class="infoItem">
              <span class="infoTittle">身高</span>
              <p class="infoText" v-if="resumeInfo">{{resumeInfo.height}}</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="infoItem">
              <span class="infoTittle">工号</span>
              <p class="infoText" v-if="resumeInfo">{{resumeInfo.workNo}}</p>
            </div>
            <div class="infoItem">
              <span class="infoTittle">政治面貌</span>
              <p class="infoText" v-if="resumeInfo">{{resumeInfo.politicsStatus}}</p>
            </div>
            <div class="infoItem">
              <span class="infoTittle">婚姻状况</span>
              <p class="infoText" v-if="resumeInfo">{{resumeInfo.marrieStatus}}</p>
            </div>
            <div class="infoItem">
              <span class="infoTittle">手机</span>
              <p class="infoText" v-if="resumeInfo">{{resumeInfo.mobileNumber}}</p>
            </div>
            <div class="infoItem">
              <span class="infoTittle">身份证号</span>
              <p class="infoText" v-if="resumeInfo">{{resumeInfo.idNumber}}</p>
            </div>
            <div class="infoItem">
              <span class="infoTittle">工作地点</span>
              <p class="infoText" v-if="resumeInfo">{{resumeInfo.workPlace}}</p>
            </div>
            <div class="infoItem">
              <span class="infoTittle">工作邮箱</span>
              <p class="infoText" v-if="resumeInfo">{{resumeInfo.workEmail}}</p>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <el-card class="commonCard othersBox">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="职务信息" name="post">
          <my-table :tableInfo="item" v-for="item in postInfo" :key="item.head" :getData="tabList.post"></my-table>
        </el-tab-pane>
        <el-tab-pane label="合同信息" name="contract">
          <my-table :tableInfo="item" v-for="item in contractInfo" :key="item.head" :getData="tabList.contract"></my-table>
        </el-tab-pane>
        <el-tab-pane label="教育经历" name="edu">
          <my-table :tableInfo="item" v-for="item in eduInfo" :key="item.head" :getData="tabList.edu"></my-table>
        </el-tab-pane>
        <el-tab-pane label="任职经历" name="postExp">
          <my-table :tableInfo="item" v-for="item in postExperienceInfo" :key="item.head" :getData="tabList.postExp"></my-table>
        </el-tab-pane>
        <el-tab-pane label="考核奖惩" name="assessre">
          <my-table :tableInfo="item" v-for="item in assessreCordInfo" :key="item.head" :getData="tabList.assessre"></my-table>
        </el-tab-pane>
        <el-tab-pane label="家庭信息" name="contact">
          <my-table :tableInfo="item" v-for="item in contactInfo" :key="item.head" :getData="tabList.contact"></my-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script>
import MyTable from '../../components/myTable.component'
import { postInfo, contractInfo, eduInfo, assessreCordInfo, postExperienceInfo, contactInfo } from '../../common/resumeConfig'
import { mapGetters } from 'vuex'
export default {
  components: { MyTable },
  data() {
    return {
      activeName: 'post',
      contractInfo,
      postInfo,
      eduInfo,
      assessreCordInfo,
      postExperienceInfo,
      contactInfo: contactInfo,
      tabList: {
        post: false,
        contract: false,
        edu: false,
        assessre: false,
        postExp: false,
        contact: false
      }
    }
  },
  computed: {
    ...mapGetters([
      'resumeInfo',
      'getEmpPostInfo',
      'userInfo'
    ])
  },
  created() {
    this.$store.dispatch('getResumeInfo');
    this.$store.dispatch('getEmpPostInfo');
    this.tabList.post = true;
    // this.$store.dispatch('getEmergencyContactInfo', this.userInfo.empId);
  },
  // beforeRouteLeave(to, from, next) {
  //   // this.$store.dispatch('setEditStatus', false);
  //   // next()
  // },
  methods: {
    handleClick(tab, event) {
      this.tabList[tab.name] = !this.tabList[tab.name];
    }
  }
}

</script>
<style lang="scss">
$main:#0460AE;
$sub:#1465C0;
#resume {
  .showBox {
    .baseDetail {
      margin-bottom: 20px;
      .leftDetail {
        .photoBox {
          font-size: 0;
          padding-top: 19px;
          height: 219px;
          margin-bottom: 10px;
          img {
            max-height: 100%;
            max-width: 100%;
          }
        }
        .infoItem {
          line-height: 35px;
          .infoTittle {
            width: 65px;
          }
        }
      }
    }
    .contactDetail {
      padding-bottom: 100px;
    }
  }
}

.infoItem {
  line-height: 55px;
  font-size: 15px;
  .infoTittle {
    display: inline-block;
    width: 90px;
    color: $main;
  }
  .infoText {
    display: inline-block;
  }
}

.othersBox {
  padding: 5px 0 0;
  .el-card__body {
    padding: 0;
    .el-tabs__nav {
      width: 100%;
      display: flex;
    }
    .el-tabs__content {
      padding: 0 35px 20px;
    }
  }
}

.postInfo {
  width: 100%;
  .infoItem {
    width: 50%;
    float: left;
    &:nth-child(even) {
      .infoTittle {
        width: 178px;
      }
    }
  }
}

.el-tabs__item {
  font-size: 18px;
  height: 50px;
  line-height: 50px;
  flex: 1;
  text-align: center;
  &.is-active {
    color: $sub;
  }
}

</style>
