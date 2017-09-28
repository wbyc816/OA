<template>
  <div class="editResume">
    <el-card class="commonCard othersBox">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="个人信息" name="person">
          <person-edit :getData="tabList.person"></person-edit>
        </el-tab-pane>
        <!-- <el-tab-pane label="职务信息" name="post">
        </el-tab-pane> -->
        <el-tab-pane label="合同信息" name="contract">
        	<contract-edit :getData="tabList.contract"></contract-edit>
        </el-tab-pane>
        <el-tab-pane label="教育经历" name="edu">
          <common-edit :getData="tabList.edu" :dataList="eduInfo"></common-edit>
        </el-tab-pane>
        <el-tab-pane label="任职经历" name="postExp">
          <common-edit :getData="tabList.postExp" :dataList="postExperienceInfo"></common-edit>
        </el-tab-pane>
        <el-tab-pane label="考核奖惩" name="assessre">
          <common-edit :getData="tabList.assessre" :dataList="assessreCordInfo"></common-edit>
        </el-tab-pane>
        <el-tab-pane label="家庭信息" name="contact">
          <common-edit :getData="tabList.contact" :dataList="contactInfo"></common-edit>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script>
import PersonEdit  from './components/personEdit.component'
import ContractEdit  from './components/contractEdit.component'
import CommonEdit  from './components/commonEdit.component'
import { eduInfo,assessreCordInfo, postExperienceInfo, contactInfo } from '../../common/resumeConfig'
import { mapGetters } from 'vuex'
export default {
  components: { PersonEdit,ContractEdit,CommonEdit },
  data() {
    return {
      eduInfo,
      assessreCordInfo,
      postExperienceInfo,
      contactInfo,
      activeName: 'person',
      tabList: {
        person: false,
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
      'userInfo'
    ])
  },
  created() {
    // this.$store.dispatch('getResumeInfo');
    this.tabList.person = true;
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
.othersBox .el-card__body .el-tabs__content{
	padding:0 25px 20px;
}
.editForm .el-form-item{
	padding-right: 45px;
}

</style>
