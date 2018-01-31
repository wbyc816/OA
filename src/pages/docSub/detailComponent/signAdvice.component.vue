<template>
  <div class="signAdvice">
    <h4 class='doc-form_title'>
      我的会签意见
      <a :href="baseURL+'/pdf/exportPdf?docId='+$route.params.id" target="_blank" class="exportButton" v-if="showDowload($route.query.code)">
            <el-button type="text"><i class="iconfont icon-icon202"></i>导出PDF</el-button>
      </a>
      <doc-return :docId="$route.params.id" class="retrunButton" @confirm="$router.push('/doc/docPending')" v-if="docDetail.isReturn!==0" warnText="此操作将在会签中删除本节点记录">
        <el-button type="text"><i class="iconfont icon-chehui"></i>退回</el-button>
      </doc-return>
    </h4>
    <el-form label-position="left" label-width="128px" :model="ruleForm" :rules="rules" ref="ruleForm">
      <!-- 收文登记没有不同意选项 -->
      <el-form-item label="会签意见" class="textarea" prop="state" v-show="docDetail.pageCode!=='SWD'">
        <el-col :span='18'>
          <el-radio-group class="myRadio" v-model="ruleForm.state" @change="adviceChange">
            <el-radio-button label="1">同意<i></i></el-radio-button>
            <el-radio-button label="2">不同意<i></i></el-radio-button>
          </el-radio-group>
        </el-col>
      </el-form-item>
      <!-- 只有部门会签能选择接收人(docDetail.signDoc==1) -->
      <el-form-item class="textarea signWrap" label="接收人" prop="signUserName" v-if="docDetail.signDoc==1">
        <el-col :span='18' class="clearfix">
          <el-input class="search" :value="ruleForm.signUserName" :readonly="true">
            <el-button slot="append" @click="dialogTableVisible=true">选择</el-button>
          </el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="会签内容" prop="taskContent" class="textarea">
        <el-col :span='18'>
          <el-input type="textarea" v-model="ruleForm.taskContent" resize="none" :rows="8" :maxlength="$route.query.code==='HTS'?500:100"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="附件" prop="attchment">
        <el-col :span='18'>
          <el-upload class="myUpload" :auto-upload="false" :action="baseURL+'/doc/uploadDocFile'" :data="{docTypeCode:$route.params.code}" :multiple="false" :on-success="handleAvatarSuccess" :on-error="handleAvatarError" :on-change="handleChange" :file-list="successUps" :on-remove="handleRemove" ref="myUpload">
            <el-button size="small" type="primary" :disabled="ruleForm.attchment.length>4" v-show="!isIE()||(ruleForm.attchment.length<=4&&!disabledUpload)">上传附件<i class="el-icon-upload el-icon--right"></i></el-button>
          </el-upload>
        </el-col>
        <p class="uploadInfo">单个附件不能超过500MB</br>最多上传5个附件</p>
      </el-form-item>
      <el-form-item>
        <el-col :span='18'>
          <el-button type="primary" size="large" class="submitButton" @click="submitSign">提交</el-button>
          <!-- isManager字段判断是否有结束会签权限 1有 0 无 -->
          <el-button size="large" class="docArchiveButton" @click="endDepSign" v-if="docDetail.isManager==1&&docDetail.signDoc==1">结束会签</el-button>
        </el-col>
      </el-form-item>
    </el-form>
    <!-- 部门会签人员选择不能跨部门 -->
    <person-dialog @updatePerson="updatePerson" admin="0" :deptId="docDetail.deptId" :visible.sync="dialogTableVisible" dialogType="radio"></person-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import PersonDialog from '../../../components/personDialog.component'
import TaskContent from '../../../components/taskContent.component'
import DocReturn from '../../../components/docReturn.component'
export default {
  components: {
    PersonDialog,
    TaskContent,
    DocReturn
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
        attchment: [],
        signUserName: '',
      },
      rules: {
        signUserName: [{ required: true, message: '请选择会签接收人' }],
        state: [{ required: true, message: '请选择会签意见' }],
        taskContent: [{ required: true, message: '请填写会签内容' }]
      },
      dialogTableVisible: false,
      reciver: '',
      difLength: 0,
      upCount: 0,
      fileIds: [],
      fileIdArr: [],
      successUps: [],
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'submitLoading',
      'baseURL'
    ])
  },
  created() {
    if (this.docDetail.pageCode === 'SWD') {
      this.ruleForm.state = '1'
      this.ruleForm.taskContent = '已阅。';
    }
    // 判断公文详情里defaultSuggestVo字段，有值则为固定流接收人不可改
    if (this.docDetail.defaultSuggestVo.reciUserId) {
      this.handleReciver(this.docDetail.defaultSuggestVo); //设置收件人，固定流
    }
  },
  methods: {
    initAttchment(list) {
      this.successUps = list;
      this.ruleForm.attchment = this.successUps;
    },
    handleAvatarSuccess(res, file, fileList) {
      this.fileIds = fileList;
      this.upCount++;
      if (this.upCount == this.difLength) {
        var params = {
          taskContent: this.ruleForm.des,
        }
        if (this.isSaveForm) {
          params.files = JSON.stringify(this.fileIds);
        } else {
          params.fileId = this.fileIds.map(f => f.response.data);
          this.fileIdArr = params.fileId;
        }
      }
    },
    checkAttchment() { //检查是否需要上传
      this.difLength = this.ruleForm.attchment.length;
      this.ruleForm.attchment.forEach(f => {
        if (this.successUps.find(s => s.uid == f.uid)) {
          this.difLength--;
        }
      })
    },
    handleAvatarError(res, file) {
      this.$emit('submitEnd', false);
      this.$message.error('附件上传失败，请重试');
    },
    handleChange(file, fileList) {
      const isLt10M = file.size / 1024 / 1024 < 500;

      if (!isLt10M) {
        this.$message.error('上传附件大小不能超过 500MB!');
      }
      if (isLt10M) {
        this.ruleForm.attchment = fileList;
        this.$refs.myUpload.submit();
      } else {
        this.$refs.myUpload.uploadFiles.splice(this.$refs.myUpload.uploadFiles.length - 1, 1)
      }
    },
    handleRemove(file, fileList) {
      this.ruleForm.attchment = fileList;
    },
    adviceChange(val) {
      if (val == 1) {
        this.ruleForm.taskContent = '同意。'
      } else {
        this.ruleForm.taskContent = "不同意。"
      }
    },
    handleReciver(vo) {
      delete vo.workState;
      this.reciver = {
        "nextUserId": vo.reciUserId,
        "nextUserName": vo.reciUserName,
        "nextDeptId": vo.reciDeptId, //           部门
        "nextDeptName": vo.reciDeptName, //
        "nextDeptMajorId": vo.reciDeptMajorId, //      主部门
        "nextDeptMajorName": vo.reciDeptMajorName, //
        "nextJobtitle": vo.reciJobtitle, //          职位
        "nextPostrankId": vo.reciPostrankId, //        职位id
        "nextEmpPostId": vo.reciEmpPostId,
        "nextPostrankName": vo.reciPostrankName, //      职级名称
        "nextSupervisoryLevel": vo.reciSupervisoryLevel, //  安全级别
      }
      this.ruleForm.signUserName = vo.reciUserName
    },
    updatePerson(payLoad) { //单个审批接收人
      this.dialogTableVisible = false;
      this.ruleForm.signUserName = payLoad.name;
      this.reciver = {
        "nextUserId": payLoad.empId,
        "nextUserName": payLoad.name,
        "nextDeptId": payLoad.deptId, //           部门
        "nextDeptName": payLoad.depts, //
        "nextDeptMajorId": payLoad.deptParentId, //      主部门
        "nextDeptMajorName": payLoad.deptParentName, //
        "nextJobtitle": payLoad.jobtitle, //          职位
        "nextPostrankId": payLoad.postrankId, //        职位id
        "nextEmpPostId": payLoad.postId,
        "nextPostrankName": payLoad.postRankName, //      职级名称
        "nextSupervisoryLevel": payLoad.supLevel, //  安全级别
      };
    },
    submitSign() { //会签审批
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.docDetail.signDoc == 1) { //部门会签
            this.docTask();
          } else { //人员会签
            this.fileId = this.ruleForm.attchment.map(f => f.response.data);
            var params = {
              fileIds: this.fileId,
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
    docTask() { //部门会签
      this.fileId = this.ruleForm.attchment.map(f => f.response.data);
      var params = {
        fileIds: this.fileId,
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
      }
      Object.assign(params, this.reciver);
      this.$http.post("/doc/docTask", params, { body: true })
        .then(res => {
          if (res.status == '0') {
            this.$message.success('会签成功');
            this.$router.push('/doc/docPending');
          } else {
            this.$message.error('会签失败' + res.message);
          }
        }, res => {})
    },
    endDepSign() { //部门结束会签
      this.fileId = this.ruleForm.attchment.map(f => f.response.data);
      this.$refs.ruleForm.validateField('state', (error) => {
        if (error == '') {
          this.$refs.ruleForm.validateField('taskContent', (error1) => {
            if (error1 == '') {
              var params = {
                fileIds: this.fileId,
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
                    this.$router.push('/doc/docPending');
                  } else {
                    this.$message.error('结束会签失败。' + res.message);
                  }
                }, res => {

                })
            } else {
              return false
            }
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
  .exportButton,.retrunButton {
    float: right;
    position: relative;
    top: -10px;
    i {
      font-size: 22px;
      vertical-align: middle;
    }
  }
  .retrunButton {
    .el-button {
      color: rgb(191, 202, 217);
      &:hover {
        color: $main;
      }
    }
    i {
      margin-right: 5px;
    }
  }
  .uploadInfo {
    position: absolute;
    left: 75%;
    font-size: 13px;
    color: #9a9a9a;
    line-height: 15px;
    top: 7px;
    white-space: nowrap;
  }
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
