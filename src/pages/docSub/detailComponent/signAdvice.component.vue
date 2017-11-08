<template>
  <div class="signAdvice">
    <h4 class='doc-form_title'>我的会签意见</h4>
    <el-form label-position="left" label-width="128px" :model="ruleForm" :rules="rules" ref="ruleForm">
      <el-form-item label="会签意见" class="textarea" prop="state">
        <el-col :span='18'>
          <el-radio-group class="myRadio" v-model="ruleForm.state" @change="adviceChange">
            <el-radio-button label="1">同意<i></i></el-radio-button>
            <el-radio-button label="2">不同意<i></i></el-radio-button>
          </el-radio-group>
        </el-col>
      </el-form-item>
      <el-form-item class="textarea signWrap" label="接收人" prop="sign" v-if="docDetail.signDoc==1">
        <el-col :span='18' class="clearfix">
          <el-input class="search" :value="ruleForm.signUserName" :readonly="true">
            <el-button slot="append" @click="dialogTableVisible=true">选择</el-button>
          </el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="会签内容" class="textarea">
        <el-col :span='18'>
          <el-input type="textarea" v-model="ruleForm.taskContent" resize="none" :rows="8"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-col :span='18'>
          <el-button type="primary" size="large" class="submitButton" @click="submitSign">提交</el-button>
          <el-button size="large" class="docArchiveButton" @click="endDepSign" v-if="docDetail.isManager==1&&docDetail.signDoc==1">结束会签</el-button>
        </el-col>
      </el-form-item>
    </el-form>
    <person-dialog @updatePerson="updatePerson" admin="0" :visible.sync="dialogTableVisible" dialogType="radio"></person-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import PersonDialog from '../../../components/personDialog.component'
export default {
  components: {
    PersonDialog
  },
  props: {
    docDetail: {
      type: Object
    }
  },
  data() {
    return {
      ruleForm: {
        taskContent: '',
        state: '',
        signUserName: '',
      },
      rules: {
        signUserName: [{ required: true, message: '请选择会签接收人' }],
        state: [{ required: true, message: '请选择会签意见' }],
      },
      dialogTableVisible: false,
      reciver:'',
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'submitLoading'
    ])
  },
  created(){
  },
  methods: {
    adviceChange(val) {
      if (val == 1) {
        this.ruleForm.taskContent = '同意。'
      } else {
        this.ruleForm.taskContent = "不同意。"
      }
    },
    updatePerson(payLoad) {
      this.dialogTableVisible = false;
      this.ruleForm.signUserName=payLoad.reciUserName;
      this.reciver = payLoad;
    },
    submitSign() { //会签审批
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.docDetail.signDoc == 1) { //部门会签
            this.docTask();
          } else { //人员会签
            var params = {
              "state": this.ruleForm.state,
              "signContent": this.ruleForm.taskContent,
              "signUserId": this.userInfo.empId,
              "docId": this.docDetail.id,
              "operateType": 1,
            }
            this.$http.post('/doc/empSignTask', params, { body: true })
              .then(res => {
                if (res.status == '0') {
                  this.$message.success('会签成功');
                  this.$router.push('/doc/docPending');
                } else {
                  this.$message.error('会签失败，请重试');
                }
              }, res => {

              })
          }
        } else {
          return false;
        }
      });
    },
    docTask() {
      var params = {
        docId: this.docDetail.id,
        "taskDeptMajorName": this.userInfo.deptVo.fatherDept,
        "taskDeptMajorId": this.userInfo.deptVo.fatherDeptId,
        "taskDeptName": this.userInfo.deptVo.dept,
        "taskDeptId": this.userInfo.deptVo.deptId,
        "taskUserName": this.userInfo.name,
        "taskUserId": this.userInfo.empId,
        taskContent: this.ruleForm.taskContent,
        state: this.ruleForm.state,
        submitType: 4,
        operateType: '1',
        nextUserId:this.reciver.reciUserId,
        nextUserName:this.reciver.reciUserName
      }
      this.$http.post("/doc/docTask", params, { body: true })
        .then(res => {
          if (res.status == '0') {
            this.$message.success('会签成功');
            this.$router.push('/doc/docTracking');
          } else {
            this.$message.error('会签失败'+res.message);
          }
        }, res => {

        })
    },
    endDepSign() { //部门结束会签
      this.$refs.ruleForm.validateField('state', (errorMessage) => {
        if (errorMessage == '') {
          var params = {
            docId: this.docDetail.id,
            "taskDeptMajorName": this.userInfo.deptVo.fatherDept,
            "taskDeptMajorId": this.userInfo.deptVo.fatherDeptId,
            "taskDeptName": this.userInfo.deptVo.dept,
            "taskDeptId": this.userInfo.deptVo.deptId,
            "taskUserName": this.userInfo.name,
            "taskUserId": this.userInfo.empId,
            taskContent: this.ruleForm.taskContent,
            state: this.ruleForm.state,
            submitType: 3,
            operateType: '1'
          }
          this.$http.post('/doc/docTask', params, { body: true })
            .then(res => {
              if (res.status == '0') {
                this.$message.success('结束会签成功');
                this.$router.push('/doc/docTracking');
              } else {
                this.$message.error('结束会签失败。'+res.message);
              }
            }, res => {

            })
        } else {
          return false
        }
      })
    },
  }
}

</script>
<style lang='scss'>
$main:#0460AE;
.signAdvice {
  .myRadio {
    line-height: 45px;
    .el-radio-button .el-radio-button__inner {
      height: 45px;
      width: 100px;
      line-height: 45px;
      padding: 0;
    }
  }
  .submitButton {
    width: 200px;
    border-radius: 3px;
  }
  .docArchiveButton {
    border-radius: 3px;
    float: right;
  }
}

</style>
