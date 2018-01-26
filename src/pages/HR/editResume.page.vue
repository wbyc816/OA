<template>
  <div class="editResume">
    <el-card class="commonCard othersBox" v-loading="submitLoading">
      <p slot="header" class="msg" v-if="msg">
        {{msg}}
      </p>
      <el-tabs v-model="activeName">
        <el-tab-pane label="个人信息" name="person" :disabled="true">
          <person-edit ref="person" :getData="tabList.person" @nextClick="nextClick" @submit="handleSub"></person-edit>
        </el-tab-pane>
        <el-tab-pane label="合同信息" name="contract" :disabled="true">
          <contract-edit ref="contract" :getData="tabList.contract" @nextClick="nextClick" @submit="handleSub"></contract-edit>
        </el-tab-pane>
        <el-tab-pane label="教育经历" name="edu" :disabled="true">
          <common-edit ref="edu" :getData="tabList.edu" preTabName="contract" nextTabName="postExp" :dataList="eduInfo" @nextClick="nextClick" @submit="handleSub"></common-edit>
        </el-tab-pane>
        <el-tab-pane label="任职经历" name="postExp" :disabled="true">
          <common-edit ref="postExp" :getData="tabList.postExp" preTabName="edu" nextTabName="assessre" :dataList="postExperienceInfo" @nextClick="nextClick" @submit="handleSub"></common-edit>
        </el-tab-pane>
        <el-tab-pane label="考核奖惩" name="assessre" :disabled="true">
          <common-edit ref="assessre" :getData="tabList.assessre" preTabName="postExp" nextTabName="contact" :dataList="assessreCordInfo" @nextClick="nextClick" @submit="handleSub"></common-edit>
        </el-tab-pane>
        <el-tab-pane label="家庭信息" name="contact" :disabled="true">
          <common-edit ref="contact" :getData="tabList.contact" preTabName="assessre" nextTabName="last" :dataList="contactInfo" @nextClick="nextClick" @submit="handleSub"></common-edit>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script>
import PersonEdit from './components/personEdit.component'
import ContractEdit from './components/contractEdit.component'
import CommonEdit from './components/commonEdit.component'
import { eduInfo, assessreCordInfo, postExperienceInfo, contactInfo } from '../../common/resumeConfig'
import { mapGetters } from 'vuex'
export default {
  components: { PersonEdit, ContractEdit, CommonEdit },
  data() {
    return {
      eduInfo,
      assessreCordInfo,
      postExperienceInfo,
      contactInfo,
      activeName: '',
      tabList: {
        person: false,
        post: false,
        contract: false,
        edu: false,
        assessre: false,
        postExp: false,
        contact: false
      },
      checkId: '',
      msg: '',
      successCount: 0,
      submitLoading: false,
      paramsList: {}
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

    // this.$store.dispatch('getEmergencyContactInfo', this.userInfo.empId);
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.checkState();
    })
  },
  methods: {
    handleSub(params) {
      this.successCount++;
      Object.assign(this.paramsList, params)
      if (this.successCount == 6) {
        this.submitLoading = false;
        this.getCheckId()
      }
    },
    nextClick(tabName) {
      if (tabName == 'last') {
        this.childSubmit();
      } else {
        this.tabList[tabName] = !this.tabList[tabName];
        this.activeName = tabName;
      }
    },
    checkState() {
      this.$http.post('/resume/checkState', { empId: this.userInfo.empId })
        .then(res => {
          if (res.status == 0) {
            if (res.data === 0) { //待审核
              this.activeName = '';
              this.$message.warning('简历审核中，无法修改！')
              this.msg = "简历审核中..."
            } else {
              this.tabList.person = true;
              this.activeName = 'person';
              if (res.data == 1) { //审核通过
                this.msg = "上一次修改通过审核。"
              } else if (res.data == 2) { //审核不通过
                this.msg = "上一次修改审核不通过。"
              }
            }
          } else {

          }
        })
    },
    childSubmit() {
      this.$refs.person.onSubmit();
      this.$refs.postExp.onSubmit();
      this.$refs.contract.onSubmit();
      this.$refs.edu.onSubmit();
      this.$refs.assessre.onSubmit();
      this.$refs.contact.onSubmit();
    },
    getCheckId() {
      this.submitLoading = true;
      this.$http.post('/resume/checkState', { empId: this.userInfo.empId })
        .then(res => {
          if (res.status == 0) {
            if (res.data === 0) { //待审核
              this.submitLoading = false;
              this.$message.warning('简历审核中，无法修改！')
            } else {
              this.$http.post('/resume/insertCheck', { empId: this.userInfo.empId }, { body: true })
                .then(res => {
                  if (res.status == 0) {
                    Object.keys(this.paramsList).forEach(name => {
                      if (Array.isArray(this.paramsList[name])) {
                        this.paramsList[name].forEach(p => {
                          p.checkId = res.data;
                        })
                      } else {
                        this.paramsList[name].checkId = res.data;
                      }
                    })
                    // console.log(this.paramsList);
                    this.UpdateResume();
                  } else {
                    this.submitLoading = false;
                  }
                })
            }
          } else {
            this.submitLoading = false;
            this.$message.error('提交失败,请重新提交');
          }
        })
    },
    UpdateResume() {
      this.$http.post('/resume/submitResume', this.paramsList, { body: true })
        .then(res => {
          this.submitLoading = false;
          if (res.status == 0) {

            this.$notify.success('提交修改申请成功,请等待后台审核!');
            this.$router.push('/HR/resume');
          } else {
            this.$message.error('提交失败,请重新提交');
            this.$router.push('/HR/resume')
          }
          this.activeName = '';
        })
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

.editResume {
  .msg {
    color: $main;
    line-height: 40px;
    padding-left: 30px;
    font-size: 15px;
  }
}

.othersBox .el-card__body .el-tabs__content {
  padding: 0 25px 20px;
}

.editForm .el-form-item {
  padding-right: 45px;
}

</style>
