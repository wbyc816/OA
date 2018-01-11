<template>
  <div class='myAdvice'>
    <h4 class='doc-form_title'>我的审批意见 
      <a :href="baseURL+'/pdf/exportPdf?docId='+$route.params.id" target="_blank" class="exportButton" v-if="showDowload($route.query.code)">
          <el-button type="text"><i class="iconfont icon-icon202"></i>导出PDF</el-button>
        </a>
    </h4>
    <el-form label-position="left" label-width="128px" :model="ruleForm" :rules="rules" ref="ruleForm">
      <el-form-item label="审批意见" class="textarea" prop="state">
        <el-col :span='18'>
          <el-radio-group class="myRadio" v-model="ruleForm.state" @change="adviceChange">
            <el-radio-button label="1">{{$route.query.code!=='SWD'?'同意':'正常办理'}}<i></i></el-radio-button>
            <el-radio-button label="2" v-if="$route.query.code!=='SWD'">不同意<i></i></el-radio-button>
            <el-radio-button label="6" class="isChen" v-if="docDetail.isTaskUser==1&&hasSecretary()">承办部门办理<i></i></el-radio-button>
          </el-radio-group>
        </el-col>
      </el-form-item>
      <el-form-item label="审批类型" class="textarea" v-if="showSignType">
        <el-col :span='18'>
          <el-radio-group class="myRadio" v-model="signType" @change="signTypeChange">
            <el-radio-button label="0" :disabled="disableApproval">审批<i></i></el-radio-button>
            <el-radio-button label="1" :disabled="chooseDisable" v-if="docDetail.isDept==1">部门会签<i></i></el-radio-button>
            <el-radio-button label="2" :disabled="chooseDisable" v-if="docDetail.isPerson==1">人员会签<i></i></el-radio-button>
          </el-radio-group>
        </el-col>
      </el-form-item>
      <el-form-item class="textarea signWrap" label="接收人" prop="sign" v-if="!(currentView=='LZS'&&docDetail.isDept==1)">
        <el-col :span='18' class="clearfix">
          <el-input class="search" :value="ruleForm.sign[0]?ruleForm.sign[0].signUserName:''" :readonly="true" v-show="signType==0">
            <template slot="append">
              <el-button @click="selSignPerson" :disabled="chooseDisable">选择</el-button>
              <i class="iconfont icon-renyuanshezhi defaultPerson" @click="defaultVisible=true" v-if="!chooseDisable"></i>
            </template>
          </el-input>
          <div class="signList" v-show="signType!=0">
            <el-tag :key="person.signDeptMajorId" :closable="ableDepClose(person.signDeptMajorId)" type="primary" @close="closeSign(index)" v-for="(person,index) in ruleForm.sign" v-show="signType==1">
              {{person.signDeptMajorName}}
            </el-tag>
            <el-tag :key="person.empId" :closable="true" type="primary" @close="closeSign(index)" v-for="(person,index) in ruleForm.sign" v-show="signType==2">
              {{person.signUserName}}
            </el-tag>
          </div>
          <el-button class="addButton" @click="selSignPerson" v-show="signType==1||signType==2"><i class="el-icon-plus"></i></el-button>
        </el-col>
      </el-form-item>
      <el-form-item label="建议路径" class="textarea">
        <el-col :span='18'>
          <p class="textContent suggestHtml" v-html="suggestHtml"></p>
        </el-col>
      </el-form-item>
      <el-form-item label="审批内容" prop="taskContent" class="textarea">
        <el-col :span='18'>
          <!-- <el-input type="textarea" v-model="ruleForm.taskContent" resize="none" :rows="8" :maxlength="500">
          </el-input> -->
          <task-content v-model="ruleForm.taskContent"></task-content>
        </el-col>
      </el-form-item>
      <el-form-item label="约定离职日期" class="textarea" prop="planDate" v-if="currentView=='LZS'&&docDetail.isDept==1">
        <el-col :span='18'>
          <el-date-picker v-model="ruleForm.planDate" type="date" placeholder="选择离职日期" :picker-options="pickerOptions0" style="width:100%">
          </el-date-picker>
        </el-col>
      </el-form-item>

       <el-form-item label="附件" prop="attchment">
          <el-col :span='18'>
          <el-upload class="myUpload" :auto-upload="false" :action="baseURL+'/doc/uploadDocFile'" :data="{docTypeCode:$route.params.code}" :multiple="false" :on-success="handleAvatarSuccess" :on-error="handleAvatarError" :on-change="handleChange" :file-list="successUps" :on-remove="handleRemove" ref="myUpload">
            <el-button size="small" type="primary" :disabled="ruleForm.attchment.length>4"  v-show="!isIE()||(ruleForm.attchment.length<=4&&!disabledUpload)">上传附件<i class="el-icon-upload el-icon--right"></i></el-button>
          </el-upload>
         </el-col>
        <p class="uploadInfo">单个附件不能超过500MB</br>最多上传5个附件</p>
      </el-form-item>

      <el-form-item>
        <el-col :span='18'>
          <el-button type="primary" size="large" class="submitButton" @click="submit">提交</el-button>
          <slot name="docArchive"></slot>
        </el-col>
      </el-form-item>
    </el-form>
    <person-dialog @updatePerson="updatePerson" :admin="normalPersonAdmin" :visible.sync="dialogTableVisible" dialogType="radio" :deptId="docDetail.deptId" :hasSecretary="docDetail.isAdmin==1&&hasSecretary()&&docDetail.isTaskUser!=1"></person-dialog>
    <person-dialog @updatePerson="updateSignPerson" :admin="docDetail.isAdmin==1?'1':'0'" :visible.sync="signPersonVisible" dialogType="multi" :deptId="docDetail.deptId" :data="signPersons"></person-dialog>
    <person-dialog @updatePerson="updateDefaultPerson" selText="默认收件人" :visible.sync="defaultVisible" :admin="normalPersonAdmin" :deptId="docDetail.deptId" :hasSecretary="docDetail.isAdmin==1&&hasSecretary()&&docDetail.isTaskUser!=1"></person-dialog>
    <dep-dialog :dialogVisible.sync="signDepVisible" :data="signDeps" dialogType="multi" @updateDep="updateSignDep" :disableDep="disableDep" isSaveInit></dep-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import PersonDialog from '../../../components/personDialog.component'
import DepDialog from '../../../components/depDialog.component'
import TaskContent from '../../../components/taskContent.component'

const arrowHtml = '<i class="iconfont icon-jiantouyou"></i>'
const signFlag = '<i class="signFlag">#</i>'
const initFWGDeps = [{
  code: "",
  companyName: "东海航空有限公司",
  createTime: "",
  createUser: "",
  deptId: "",
  description: "",
  empCount: 0,
  fatherId: "CFCD208495D565EF66E7DFF9F98764DA",
  id: "C16A5320FA475530D9583C34FD356EF5",
  levelNum: 30,
  name: "综合管理部",
  sortNum: "",
  sts: "",
  updateTime: "",
  updateUser: "",
}]
const initHTSDeps = [{
  code: "",
  companyName: "东海航空有限公司",
  createTime: "",
  createUser: "",
  deptId: "",
  description: "",
  empCount: 0,
  fatherId: "CFCD208495D565EF66E7DFF9F98764DA",
  id: "1905AEDAB9BF2477EDC068A355BBA31A",
  levelNum: 30,
  name: "法律部",
  sortNum: "",
  sts: "",
  updateTime: "",
  updateUser: ""
}]
const secretaryDoc = ['FWG', 'HTS', 'SWD', 'CPD']
export default {
  components: {
    PersonDialog,
    DepDialog,
    TaskContent
  },
  props: {
    docDetail: {
      type: Object
    },
    taskDetail: '',
    suggestHtml: '',
    otherInfo: ''
  },
  data() {
    var checkSign = (rule, value, callback) => {
      if (this.signType == 1 || this.signType == 2) {
        if (value.length != 0) {
          callback();
        } else {
          if (this.signType == 1) {
            callback(new Error('请选择至少一个会签部门'))
          } else {
            callback(new Error('请选择至少一个会签接收人'))
          }
        }
      } else {
        if (value.length != 0) {
          callback();
        } else {
          callback(new Error('请选择接收人'))
        }
      }
    };
    return {
      ruleForm: {
        taskContent: '同意。',
        state: '1',
        sign: [],
        attchment:[],
        planDate: ''
      },
      rules: {
        sign: [{ type: 'array', validator: checkSign, required: true }],
        state: [{ required: true, message: '请选择审批意见' }],
        planDate: [{ required: true, type: 'date', message: '请选择离职日期' }],
        taskContent: [{ required: true, message: '请填写审批内容',trigger: 'blur,change' }]
      },
      successUps: [],
      dialogTableVisible: false,
      defaultVisible: false,
      reciver: '',
      signType: '0',
      currentView: '',
      signDepVisible: false,
      signPersonVisible: false,
      chooseDisable: false,
      workState: '',
      signPersons: [],
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      successUps: [],
      signDeps: [],
      adminReci: '',
      initFWGDeps,
      difLength: 0,
      upCount: 0,
      fileIds: [],
      fileIdArr:[],
      isSaveForm:false,
      initHTSDeps,
      disableApproval: false
    }
  },
  computed: {
    showSignType() {
      if (this.docDetail != {}) {
        if (this.currentView == 'LZS' && this.docDetail.isDept == 1) {
          return false
        } else {
          return this.docDetail.isDept == 1 || this.docDetail.isPerson == 1 && this.docDetail.signDoc == 0
        }
      } else {
        return false
      }
    },
    normalPersonAdmin: function() {
      var temp = '0';
      if (this.docDetail.isAdmin == 1) { //公文详情里控制是否有跨部门权限
        temp = '1'
      }
      if (this.hasSecretary()) { //四类特殊公文且不是承办人员角色  不能跨部门
        if (this.docDetail.isTaskUser != 1) {
          temp = '0'
        }
      }
      return temp;
    },
    disableDep: function() {
      var dep = [];
      if (this.ruleForm.state != 6) { //非承办部门办理
        if (this.docDetail && this.otherInfo && this.$route.query.code == 'FWG') { //只针对发文稿纸
          var typeName = this.otherInfo[0].classify1;
          if (typeName === '公司发文' || typeName === '会议纪要') {

            dep = initFWGDeps;

          }
        }
      }
      return dep
    },
    ...mapGetters([
      'userInfo',
      'submitLoading',
      'baseURL',
      'secretaryInfo'
    ])
  },
  created() {
    if (this.hasSecretary()) {
      this.getSecretaryInfo();
    }
    this.currentView = this.docDetail.pageCode;
    if(this.currentView==='SWD'){
      this.ruleForm.taskContent='已阅。'
    }
    if (this.docDetail.defaultSuggestVo.reciUserId) {
      this.handleReciver(this.docDetail.defaultSuggestVo); //设置收件人，固定流
    } else {
      this.getDefaultReciver();
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
          this.fileIdArr= params.fileId;
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
      // const isPDF = file.raw.type === 'application/pdf';
      const isLt10M = file.size / 1024 / 1024 < 500;
      // if (!isPDF) {
      //   this.$message.error('上传附件只能是 PDF 格式!');
      // }
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


    getSecretaryInfo() {
      if (!this.secretaryInfo) {
        var roleUserState = 0; // 机要秘书
        var typeName;
        if (this.$route.query.code == 'FWG') {
          typeName = this.otherInfo[0].classify1;
        }
        //发文稿纸 类型为公司发文或会议纪要时 不是综合管理部的人 添加默认部门
        if ((typeName === '公司发文' || typeName === '会议纪要') && this.userInfo.deptId != initFWGDeps[0].id && this.userInfo.deptParentId != initFWGDeps[0].id) {
          roleUserState = 1; // 综合管理部
        }
        this.$http.post('doc/getSecInfo', { roleUserState: roleUserState })
          .then(res => {
            if (res.status == '0') {
              this.$store.commit('setSecretaryInfo', res.data);
            } else {

            }
          })
      }
    },
    hasSecretary() {
      return secretaryDoc.find(d => d == this.$route.query.code) != undefined;
    },
    getAdminReci() {
      if (this.adminReci) {
        if (this.userInfo.empId != this.adminReci.secUserId && this.adminReci.secUserId) {
          var person = {
            "signUserName": this.adminReci.secUserName,
          }
          this.ruleForm.sign = [];
          this.ruleForm.sign.push(person);
          this.chooseDisable = true;
        }
      } else {
        this.$http.post('/doc/getSecUserName', { docId: this.$route.params.id })
          .then(res => {
            if (res.status == 0) {
              this.adminReci = res.data;
              if (this.userInfo.empId != this.adminReci.secUserId && this.adminReci.secUserId) {
                var person = {
                  "signUserName": this.adminReci.secUserName,
                }
                this.ruleForm.sign = [];
                this.ruleForm.sign.push(person);
                this.chooseDisable = true;
              }
            } else {

            }
          })
      }
    },
    getDefaultReciver() {
      var taskEmpPostId = this.taskDetail[this.taskDetail.length - 1].taskEmpPostId;
      this.$http.post('/doc/getDefaultRecipent', { docTypeCode: this.$route.query.code, empId: this.userInfo.empId, empPostId: taskEmpPostId })
        .then(res => {
          if (res.status == 0) {
            this.reciver = {
              "nextUserId": res.data.reciUserId,
              "nextUserName": res.data.reciUserName,
              "nextDeptId": res.data.reciDeptId, //           部门
              "nextDeptName": res.data.reciDeptName, //
              "nextDeptMajorId": res.data.reciDeptMajorId, //      主部门
              "nextDeptMajorName": res.data.reciDeptMajorName, //
              "nextJobtitle": res.data.reciJobtitle, //          职位
              "nextPostrankId": res.data.reciPostrankId, //        职位id
              "nextEmpPostId": res.data.reciEmpPostId,
              "nextPostrankName": res.data.reciPostrankName, //      职级名称
              "nextSupervisoryLevel": res.data.reciSupervisoryLevel, //  安全级别
            }
            this.ruleForm.sign = [];
            this.ruleForm.sign.push({
              signUserName: res.data.reciUserName
            });
          } else {
            this.ruleForm.sign = [];
          }
        })
    },
    closeSign(index) {
      this.ruleForm.sign.splice(index, 1);
      if (this.signType == 1) {
        this.signDeps.splice(index, 1)
      }
    },
    handleReciver(vo) {
      this.ruleForm.sign = [];
      this.ruleForm.sign.push({
        signUserName: vo.reciUserName
      });
      this.workState = vo.workState;
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
      };
      this.chooseDisable = true;
    },
    adviceChange(val) {
      if (val == 1) {
        this.ruleForm.taskContent = '同意。';
        this.disableApproval = false;
        if (this.signType == 0) {
          if (this.docDetail.defaultSuggestVo.reciUserId) {
            this.handleReciver(this.docDetail.defaultSuggestVo); //设置收件人，固定流
          } else {
            this.getDefaultReciver();
            this.chooseDisable = false;
          }
        } else if (this.signType == 1) {
          this.signTypeChange('1')
        }
      } else if (val == 2) {
        this.disableApproval = false;
        this.ruleForm.taskContent = "不同意。";
        if (this.signType == 0) {
          this.getAdminReci();
        } else if (this.signType == 1) {
          this.signTypeChange('1')
        }
      } else {
        this.ruleForm.taskContent = "同意。";
        this.disableApproval = true;
        this.signType = '1';
        if (this.signType == 1) {
          this.ruleForm.sign = [];
          this.signDeps = [];
        }
      }
    },
    signTypeChange(val) {
      this.ruleForm.sign = [];
      this.signDeps = [];
      this.chooseDisable = false;
      if (val == 1 && this.ruleForm.state != 6) { //部门会签
        if (this.$route.query.code == 'HTS' && this.docDetail.taskDeptMajorId != initHTSDeps[0].id && this.docDetail.taskDeptId != initHTSDeps[0].id) {
          this.updateSignDep(initHTSDeps);
        }
      } else if (val == 0) {
        this.adviceChange(this.ruleForm.state);
      }

      this.$refs.ruleForm.validateField('sign');
    },
    ableDepClose(val) {
      if (this.ruleForm.state != 6) {

        //特定公文类型 发文稿纸、合同申请  呈报人所在部门不在特殊范围 自动添加默认部门
        if (this.$route.query.code == 'FWG') {
          var typeName = this.otherInfo[0].classify1;

          //发文稿纸 类型为公司发文或会议纪要时 不是综合管理部的人 添加默认部门
          if ((typeName === '公司发文' || typeName === '会议纪要') && this.docDetail.taskDeptMajorId != initFWGDeps[0].id && this.docDetail.taskDeptId != initFWGDeps[0].id) {

            return initFWGDeps.find(d => d.id == val) == undefined;
          } else {
            return true
          }
        } else if (this.$route.query.code == 'HTS' && this.docDetail.taskDeptMajorId != initHTSDeps[0].id && this.docDetail.taskDeptId != initHTSDeps[0].id) {

          return initHTSDeps.find(d => d.id == val) == undefined;

        } else {
          return true
        }
      } else {
        return true
      }
    },
    updateDefaultPerson(payLoad) {
      this.defaultVisible = false;
      var person = {
        "signDeptMajorName": payLoad.deptParentName,
        "signDeptMajorId": payLoad.deptParentId,
        "signDeptName": payLoad.depts,
        "signDeptId": payLoad.deptId,
        "signUserName": payLoad.name,
        "signUserId": payLoad.empId,
        "signJobtitle": payLoad.jobtitle, //接收人职位
        "signPostrankId": payLoad.postrankId, //职位id
        "signEmpPostId": payLoad.postId,
        "signPostrankName": payLoad.postRankName, //职级名称
        "signSupervisoryLevel": payLoad.supLevel //安全级别
      }
      if (this.ruleForm.sign.length != 0) {
        this.ruleForm.sign.splice(0, 1, person)
      } else {
        this.ruleForm.sign.push(person);
      }
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
      this.setDefault(person);
    },
    updatePerson(payLoad) { //单个审批接收人
      this.dialogTableVisible = false;
      var person = {
        "signUserName": payLoad.name,
      }
      if (this.ruleForm.sign.length != 0) {
        this.ruleForm.sign.splice(0, 1, person)
      } else {
        this.ruleForm.sign.push(person);
      }
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
    updateSignPerson(payLoad) { //人员会签更新人员
      this.signPersonVisible = false;
      this.ruleForm.sign = [];
      this.signPersons = payLoad;
      payLoad.forEach(p => {
        this.ruleForm.sign.push({
          "signDeptMajorName": p.deptParentName,
          "signDeptMajorId": p.deptParentId,
          "signDeptName": p.depts,
          "signDeptId": p.deptId,
          "signUserName": p.name,
          "signUserId": p.empId,
          "signJobtitle": p.jobtitle, //接收人职位
          "signPostrankId": p.postrankId, //职位id
          "signEmpPostId": p.postId,
          "signPostrankName": p.postRankName, //职级名称
          "signSupervisoryLevel": p.supLevel //安全级别
        })
      })
    },
    updateSignDep(payLoad) { //部门会签更新部门
      this.signDepVisible = false;
      this.ruleForm.sign = [];
      this.signDeps = payLoad;
      payLoad.forEach(p => {
        this.ruleForm.sign.push({
          "signDeptMajorName": p.name,
          "signDeptMajorId": p.id,
        })
      })
    },
    selSignPerson() {
      if (this.signType == 0) {
        this.dialogTableVisible = true;
      } else if (this.signType == 1) {
        this.signDepVisible = true;
      } else {
        this.signPersonVisible = true;
      }
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
      var subType = this.signType;
      if (this.currentView == 'LZS') { //
        if (this.docDetail.isDept == 1) {
          subType = 1
        } else if (this.docDetail.isSign == 1) {
          subType = 2
        }
      }
      this.fileId= this.ruleForm.attchment.map(f => f.response.data);
      var params = {
        fileIds:this.fileId,
        docId: this.docDetail.id,
        "taskUserName": this.userInfo.name,
        "taskUserId": this.userInfo.empId,
        taskContent: this.ruleForm.taskContent,
        state: this.ruleForm.state,
        submitType: subType,
        operateType: '1',
        workState: this.workState,
      }
      if (this.currentView == 'LZS' && this.docDetail.isDept == 1) {
        params.dimissionDate = +this.ruleForm.planDate;
      }
      if (this.signType == '0') { //普通审批
        if (this.ruleForm.state == 1) { //同意
          Object.assign(params, this.reciver)
        } else if (this.ruleForm.state == 2 && this.userInfo.empId == this.adminReci.secUserId) {
          // 不同意时且本人与默认接收人为同一人时
          Object.assign(params, this.reciver)
        }
      } else {
        params.signs = this.ruleForm.sign;
      }
      var url = "/doc/docTask";
      if (this.$route.query.code == 'LZS') { //离职审批
        url = '/doc/docDimissionTask'
      }
      this.$http.post(url, params, { body: true })
        .then(res => {
          if (res.status == '0') {
            this.$message.success('审批成功');
            this.$router.push('/doc/docPending');
          } else {
            this.$message.error('审批失败，请重试');
          }
        }, res => {

        })
    },
    setDefault(person) {
      var taskEmpPostId = this.taskDetail[this.taskDetail.length - 1].taskEmpPostId;
      this.$http.post('/doc/updateDefaultRecipent', { docTypeCode: this.$route.query.code, empId: this.userInfo.empId, taskEmpPostId: taskEmpPostId, reciId: person.signUserId, reciEmpPostId: person.signEmpPostId })
        .then(res => {
          if (res.status == 0) {
            this.$message.success('设置默认收件人成功！');
          } else {
            this.$message.error('设置默认收件人失败,' + res.message);
          }
        })
    },
  }
}

</script>
<style lang='scss'>
$main:#0460AE;
$sub:#1465C0;
.myAdvice {
  .exportButton {
    float: right;
    position: relative;
    top: -10px;
    i {
      font-size: 22px;
      vertical-align: middle;
    }
  }
  .uploadInfo{
    position: absolute;
    left: 75%;
    font-size: 13px;
    color: #9a9a9a;
    line-height: 15px;
    top: 7px;
    white-space: nowrap;
  }
  .myUpload {
    width: 100% !important;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-direction: row-reverse;
    flex-direction: row-reverse;
}
  .myRadio {
    line-height: 45px;
    .el-radio-button .el-radio-button__inner {
      height: 45px;
      width: 100px;
      line-height: 45px;
      padding: 0;
    }
    .isChen .el-radio-button__inner {
      width: 150px!important;
    }
  }
  .suggestHtml {
    line-height: 20px;
    padding-top: 10px;
    i {
      color: $main;
      &.icon-jiantouyou {
        padding-right: 10px;
      }
      &.signFlag {
        font-style: normal;
      }
    }
  }
  .signWrap {
    .signList {
      width: 88%;
      float: left;
      min-height: 48px; // padding-top: 10px;
    }
    .addButton {
      float: right;
    }
    .defaultPerson {
      position: absolute;
      right: 109px;
      top: 7px;
      font-size: 30px;
      cursor: pointer;
      &:hover {
        color: $main;
      }
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
