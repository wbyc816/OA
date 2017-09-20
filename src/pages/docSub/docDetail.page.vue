<template>
  <div id="docDetail">
    <el-card class="borderCard searchOptions">
      <div slot="header">
        <span>呈批单</span>
      </div>
      <div class='doc-section'>
        <h4 class='doc-form_title'>公文信息</h4>
        <el-row>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="5">公文号</el-col>
          <el-col :span="6" v-if="docDetialInfo">{{docDetialInfo.doc.docNo}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="5">呈报人</el-col>
          <el-col :span="6" class="rightBorder" v-if="docDetialInfo">{{docDetialInfo.doc.taskUserName}}</el-col>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="5">部门</el-col>
          <el-col :span="6" v-if="docDetialInfo">{{docDetialInfo.doc.taskDeptMajorName}}{{docDetialInfo.doc.taskDeptName}}</el-col>
          <!-- <el-col :span="1">&nbsp;</el-col>
		  <el-col :span="5">职务</el-col>
		  <el-col :span="6">{{docDetialInfo.doc.docNo}}</el-col> -->
        </el-row>
        <el-row>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="5">密级程度</el-col>
          <el-col :span="6" class="rightBorder" v-if="docDetialInfo">{{docDetialInfo.doc.docDenseType}}</el-col>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="5">重要程度</el-col>
          <el-col :span="6" v-if="docDetialInfo">{{docDetialInfo.doc.docImportType}}</el-col>
        </el-row>
        <el-row class="backV">
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="5">标题</el-col>
          <el-col :span="18">
            <h4 v-if="docDetialInfo">{{docDetialInfo.doc.docTitle}}</h4></el-col>
        </el-row>
        <el-row>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="5">请示内容</el-col>
          <el-col :span="18" v-if="docDetialInfo">{{docDetialInfo.doc.taskContent}}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="5">附件</el-col>
          <el-col :span="18"></el-col>
        </el-row>
        <el-row>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="5">附加公文</el-col>
          <el-col :span="18"></el-col>
        </el-row>
      </div>
      <div class='doc-section'>
        <h4 class='doc-form_title'>历史审批意见</h4>
        <el-row class="backV" v-for="(task,index) in docDetialInfo.taskDetail">
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="23" v-if="index>0">{{task.taskContent}}</el-col>
          <el-col :span="24" class="timeRight" v-if="index>0">{{task.taskUserName}} {{task.startTime}}</el-col>
          <el-col :span="23" v-if="index==0">无</el-col>
        </el-row>
      </div>
      <div class='doc-section' v-if="docDetialInfo.doc&&docDetialInfo.doc.reciUserId==userInfo.empId">
        <h4 class='doc-form_title'>我的审批意见</h4>
        <el-form label-position="left" label-width="128px" :model="ruleForm" :rules="rules" ref="ruleForm">
          <el-form-item label="审批意见" class="textarea">
            <el-col :span='18'>
              <el-radio-group class="myRadio" v-model="ruleForm.state">
                <el-radio-button label="1">同意<i></i></el-radio-button>
                <el-radio-button label="2">拒绝<i></i></el-radio-button>
              </el-radio-group>
            </el-col>
          </el-form-item>
          <el-form-item label="审批内容" class="textarea">
            <el-col :span='18'>
              <el-input type="textarea" v-model="ruleForm.taskContent" resize="none" :rows="8"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item class="textarea" label="收件人" prop="rec">
            <el-col :span='18'>
              <el-input class="search" v-model="ruleForm.rec" :readonly="true">
                <el-button slot="append" @click='selectPerson'>选择</el-button>
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-col :span='18'>
              <el-button type="primary" size="large" class="submitButton" @click="submit">提交</el-button>
            </el-col>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-dialog :visible.sync="dialogTableVisible" size="large" class="personDialog">
      <person-dialog @updatePerson="updatePerson"></person-dialog>
    </el-dialog>
  </div>
</template>
<script>
import PersonDialog from '../../components/personDialog.component'
import { mapGetters } from 'vuex'

export default {
  components: {
    PersonDialog
  },
  data() {
    return {
      dialogTableVisible: false,
      ruleForm: {
        taskContent: '',
        state: '1',
        rec: ''
      },
      docDetialInfo: "",
      rules: {
        rec: [
          { required: true, message: '请选择收件人' },
        ]

      },
    }
  },
  created() {
    this.$http.post("/doc/getDocDetailInfo", { id: this.$route.params.id }).then(res => {

      if (res.data.status == 0) {
        this.docDetialInfo = res.data.data
        console.log(this.docDetialInfo)
      }
    }, res => {

    })
  },
  computed: {
    ...mapGetters([
      'reciver',
      'userInfo'
    ])
  },
  methods: {
    selectPerson: function() {
      this.dialogTableVisible = true;
    },
    updatePerson() {
      this.dialogTableVisible = false;
      this.ruleForm.rec = this.reciver.reciUserName;
    },
    submit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
        	this.docTask();
        } else {
          return false;
        }
      });
    },
    docTask() {
      var params = {
        docId: this.docDetialInfo.doc.id,
        "taskDeptMajorName": this.userInfo.deptVo.fatherDept,
        "taskDeptMajorId": this.userInfo.deptVo.fatherDeptId,
        "taskDeptName": this.userInfo.deptVo.dept,
        "taskDeptId": this.userInfo.deptVo.deptId,
        "taskUserName": this.userInfo.name,
        "taskUserId": this.userInfo.empId,
        nextUserId: this.reciver.reciUserId,
        nextUserName: this.reciver.reciUserName,
        taskContent: this.ruleForm.taskContent,
        state: this.ruleForm.state,
        operateType: '1'
      }
      this.$http.post('/doc/docTask', params, { body: true })
        .then(res => {
          if (res.data.status == '0') {
            this.$message.success('审批成功');
            this.$router.push('/doc/docTracking');
          } else {
            this.$message.error('审批失败，请重试');
          }
        }, res => {

        })
    }
  }
}

</script>
<style lang='scss'>
#docDetail {
  .el-card__header {
    margin-bottom: 10px;
  }
  .doc-section {
    .doc-form_title {
      padding-bottom: 5px;
    }
    .el-row {
      border-bottom: 1px solid #D5DADF;
      .el-col {
        padding: 15px 0;
        min-height: 50px;
      }
    }
    h4 {
      font-weight: bold;
    }
    .rightBorder {
      border-right: 1px solid #D5DADF;
    }
    &+.doc-section {
      margin-top: 20px;
    }
    .backV {
      background: #F7F7F7;
    }
    .timeRight {
      text-align: right;
      padding-top: 0!important;
      padding-right: 20px!important;
      min-height: inherit!important;
    }
    .submitButton {
      width: 200px;
      border-radius: 3px;
    }
    .myRadio .el-radio-button .el-radio-button__inner {
      padding: 11px 24px;
    }
  }
  .personDialog {
    .el-dialog--large {
      width: 1100px;
      top: 50%!important;
      margin-top: -315px;
      .el-dialog__header {
        display: none;
      }
      .el-dialog__body {
        padding: 0;
      }
    }
  }
  .el-form-item__error {
    padding-left: 5px;
  }
}

</style>
