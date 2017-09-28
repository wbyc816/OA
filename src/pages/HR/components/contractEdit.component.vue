<template>
  <div class="contractEdit">
    <el-form :model="contractForm" ref="contractForm" label-position="left" label-width="110px" class="editForm">
      <div class="header">
        <span class="title">合同信息</span>
        <el-button type="primary" icon="plus" size="small" @click="addContract">添加</el-button>
        <el-button type="primary" icon="close" size="small" @click="delContract(0)" v-show="contractForm.content.length!=0">删除</el-button>
      </div>
      <template v-for="(contract,index) in contractForm.content">
        <div class="header" v-if="index!=0">
          <span class="title">合同信息</span>
          <el-button type="primary" icon="close" size="small" @click="delContract(index)">删除</el-button>
        </div>
        <el-form-item label="合同类型" :prop="'content.'+index+'.type'" :rules="{required: true, message: '合同类型不能为空', trigger: 'blur'}">
          <el-input v-model="contract.type"></el-input>
        </el-form-item>
        <el-form-item label="合同主体" :prop="'content.'+index+'.subject'" :rules="{required: true, message: '合同主体不能为空', trigger: 'blur'}">
          <el-input v-model="contract.subject"></el-input>
        </el-form-item>
        <el-form-item label="合同开始日期" :prop="'content.'+index+'.startDate'" :rules="{type:'date',required: true, message: '合同开始日期不能为空', trigger: 'blur'}">
          <el-date-picker type="date" v-model="contract.startDate" style="width: 100%;" :editable="false" :clearable="false"></el-date-picker>
        </el-form-item>
        <el-form-item label="合同结束日期" :prop="'content.'+index+'.endDate'" :rules="{type:'date',required: true, message: '合同结束日期不能为空', trigger: 'blur'}">
          <el-date-picker type="date" v-model="contract.endDate" style="width: 100%;" :editable="false" :clearable="false"></el-date-picker>
        </el-form-item>
        <div class="borderBox"></div>
      </template>
      <el-form-item>
        <el-button type="primary" size="large" class="submitButton" @click.native="onSubmit" :disabled="submitLoading">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    getData: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      contractForm: {
        content: []
      },
      submitLoading: false,
      constTemp: { type: '', subject: '', endDate: '', startDate: '', createUser: '', empId: '', oldId: '' }
    }
  },
  computed: {
    ...mapGetters([
      'resumeInfo',
      'userInfo',
      'baseURL'
    ])
  },
  watch: {
    resumeInfo: function(newVal) {
      if (newVal != undefined || newVal != null) {
        this.combineObj(this.contractForm, newVal);
      }
    },
    getData: function(newVal, oldVal) {
      this.getContract();
    }
  },
  created() {
    this.constTemp.empId = this.userInfo.empId;
    this.constTemp.createUser = this.userInfo.name;
    // this.$store.dispatch('getResumeInfo');
  },
  // beforeRouteLeave(to, from, next) {
  //   // this.$store.dispatch('setEditStatus', false);
  //   // next()
  // },
  methods: {
    getCheckId() {
      return this.$http.post('/resume/insertCheck', { empId: this.userInfo.empId }, { body: true })
    },
    addContract() {
      this.contractForm.content.push(this.clone(this.constTemp));
    },
    delContract(index) {
      this.contractForm.content.splice(index, 1);
    },
    onSubmit() {
      this.$refs['contractForm'].validate((valid) => {
        if (valid) {
          if (!this.submitLoading) {
            this.submitLoading = true;
            this.handleSubmit();
          }
        } else {
          this.$message.warning('请检查填写信息')
          return false;
        }
      });
    },
    handleSubmit() {
      this.getCheckId()
        .then(res => {
          if (res.status == '0') {
            this.contractForm.content.forEach(c => c.checkId = res.data);
            this.updateInfo();
          } else {
            console.log('获取checkId失败')
          }
        }, res => {

        })
    },
    updateInfo() {
      this.$http.post('/resume/updateContractInfo', this.contractForm.content.map(c=>this.changeTime(c)), { body: true })
        .then(
          res => {
            this.submitLoading = false;
            if (res.status == '0') {
              this.$message.success('提交修改申请成功,请等待后台审核！')
              this.$router.push('/HR/resume');
            } else {
              this.$message.error('修改个人信息失败,请稍后再试！');
            }
          }, res => {
            this.submitLoading = false;
          })
    },
    getContract() {
      this.$http.post('/resume/getContractInfo', { id: this.userInfo.empId })
        .then(res => {
          if (res.status == '0') {
            res.data.forEach(e => {
              e.startDate = new Date(e.startDate);
              e.endDate = new Date(e.endDate);
              this.contractForm.content.push(Object.assign(this.clone(this.constTemp), e))
            })
          }
        }, res => {

        })
    }
  }
}

</script>
<style lang="scss">
$main:#0460AE;
$sub:#1465C0;
.contractEdit {}

</style>
