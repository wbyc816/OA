<template>
  <div id="docDetail">
    <el-card class="borderCard">
      <div slot="header" class="clearfix docheader">
        <span class="docTypeName">{{docDetialInfo.doc.docTypeName}}</span>
        <span class="docNo">{{docDetialInfo.doc.docNo}}</span>
        <span class="improtType" v-if="docDetialInfo.doc.docImportType=='紧急'||docDetialInfo.doc.docImportType=='特急'" :style="{background:docDetialInfo.doc.docImportType=='紧急'?'#FFD702':'#FF0202'}">{{docDetialInfo.doc.docImportType}}</span>
        <span class="improtType" v-if="docDetialInfo.doc.docDenseType=='保密'||docDetialInfo.doc.docDenseType=='绝密'" :style="{background:docDetialInfo.doc.docDenseType=='保密'?'#FFD702':'#FF0202'}">{{docDetialInfo.doc.docDenseType}}</span>
        <div class="rightBox">
          <span class="taskUserName">呈报人 {{docDetialInfo.doc.taskUserName}}</span>
          <span class="deptName">{{docDetialInfo.doc.taskDeptMajorName}}</span>
          <span class="deptName">{{docDetialInfo.doc.taskUserJobTitle}}</span>
        </div>
      </div>
      <div class="baseInfoBox commonBox">
        <!-- <h4 class='doc-form_title'>公文信息</h4> -->
        <el-row>
          <el-col :span="24">
            <h1 class="title">标题</h1>
            <p class="textContent blackText">{{docDetialInfo.doc.docTitle}}</p>
          </el-col>
          <component v-bind:is="computeView" :info="docDetialInfo.otherInfo" :docDetialInfo="docDetialInfo" v-if="computeView"></component>
          <el-col :span="24" style="min-height:90px" v-if="$route.query.code!='FWG'">
            <h1 class="title">请示内容</h1>
            <p class="textContent" v-html="docDetialInfo.doc.taskContent"></p>
          </el-col>
          <el-collapse v-model="activeContent" class="clearBoth">
            <el-collapse-item title="附加内容" name="1">
              <component v-bind:is="currentView" :info="docDetialInfo.otherInfo" :state="docDetialInfo.task[0].state" :open="activeContent" class="clearfix">
                <!-- 组件在 vm.currentview 变化时改变！ -->
              </component>
              <el-row>
                <el-col :span="24">
                  <h1 class="title">建议路径</h1>
                  <p class="textContent suggestHtml" v-html="suggestHtml"></p>
                </el-col>
                <el-col :span="24" v-if="$route.query.code!='FWG'">
                  <h1 class="title">附件</h1>
                  <p class="attch textContent">
                    <template v-if="docDetialInfo&&docDetialInfo.taskFile.length>0">
                      <a :href="file.filePath" target="_blank" v-for="file in docDetialInfo.taskFile">{{file.fileNameNew}}</a>
                    </template>
                  </p>
                </el-col>
                <el-col :span="24" style="border-bottom:none">
                  <h1 class="title">附加公文</h1>
                  <p class="attch textContent">
                    <router-link :to="{path:'/doc/docInfo/'+file.quoteDocId,query:{code:file.docType}}" v-for="file in docDetialInfo.taskQuote">{{file.quoteDocTitle}}</router-link>
                  </p>
                </el-col>
              </el-row>
            </el-collapse-item>
          </el-collapse>
        </el-row>
      </div>
      <history-advice :taskDetail="docDetialInfo.taskDetail"></history-advice>
      <div v-if="distData.length!=0" style="margin-bottom:20px;">
        <h4 class='doc-form_title'>分发意见</h4>
        <el-table :data="topDistData" style="width: 100%" class="distTable" :stripe="true">
          <el-table-column prop="distUserName" label="分发人" width="100"></el-table-column>
          <el-table-column prop="reciveUserName" label="被分发人" width="100"></el-table-column>
          <el-table-column prop="content" label="分发人意见">
            <template scope="scope">
              <el-tooltip popper-class="contentTip" :enterable="false" effect="dark" :content="scope.row.content" placement="top" :disabled="scope.row.content.length<=20">
                <span style="display: inline-block;">{{scope.row.content | dotdotdot}}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="distTime" label="分发时间" width="120"></el-table-column>
          <el-table-column prop="readTime" label="阅读时间" width="120"></el-table-column>
        </el-table>
        <el-collapse v-model="activeNames" @change="handleChange" class="moreButton" v-if="distData.length>3">
          <el-collapse-item title="查看更多记录" name="1">
          </el-collapse-item>
        </el-collapse>
      </div>
      <div class="operateBox" v-if="docDetialInfo.task[0].state==3">
        <el-button type="primary" class="myButton" @click="DialogSubmitVisible=true">公文分发</el-button>
        <el-button class="myButton" v-if="docDetialInfo.doc.isPay" @click="changePay" :disabled="docDetialInfo.doc.isView!=1">{{docDetialInfo.doc.isView==1?'付款':'已付款'}}</el-button>
        <a :href="baseURL+'/pdf/exportPdf?docId='+$route.params.id" target="_blank" v-if="showDowload($route.query.code)">
          <el-button type="text"><i class="iconfont icon-icon202"></i>导出PDF</el-button>
        </a>
      </div>
      <quit-advice :info="docDetialInfo" v-if="$route.query.code=='LZS'">
      </quit-advice>
      <my-advice :docDetail="docDetialInfo.doc" :otherInfo="docDetialInfo.otherInfo" :taskDetail="docDetialInfo.taskDetail" :suggestHtml="suggestHtml" v-if="showMyadvice" ref="myAdvice">
        <el-button size="large" class="docArchiveButton" @click="DialogArchiveVisible=true;getFileSend();" v-if="showdArchiveButton" slot="docArchive"><i class="iconfont icon-archive" slot="docArchive"></i>归档</el-button>
      </my-advice>
      <sign-advice :docDetail="docDetialInfo.doc" v-if="docDetialInfo.doc.isSign==1&&$route.query.code!='LZS'"></sign-advice>
    </el-card>
    <el-dialog :visible.sync="DialogArchiveVisible" size="small" class="myDialog" custom-class="archiveDialog">
      <span slot="title">公文归档</span>
      <el-form :model="fileForm" :inline="!isRedFile&&!isInArray(addFileDoc,$route.query.code)" :rules="fileRules" ref="fileForm" class="fileForm" :class="{fileRed:isRedFile||isInArray(addFileDoc,$route.query.code)}">
        <el-form-item label="建议发文号:" v-if="isRedFile">
          <p class="fwNo">{{docDetialInfo.doc.fwNo}}</p>
        </el-form-item>
        <el-form-item label="发布正文" prop="taskFileId" v-if="isRedFile&&archiveState==1" :rules="[{ required: true, message: '请上传正文！' }]">
          <el-upload class="myUpload" :multiple="false" :action="baseURL+'/doc/uploadDocFile'" :data="{docTypeCode:'FWG'}" :on-success="handleAvatarSuccess" :file-list="taskFile" ref="myUpload" :before-upload="beforeUploadFWG" :on-remove="handleRemove">
            <el-button size="small" type="primary" :disabled="fileForm.taskFileId!=''">上传发布正文<i class="el-icon-upload el-icon--right"></i></el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="发布范围" class='reciverWrap' prop="fileSend" v-if="isRedFile&&archiveState==1">
          <div class="reciverList">
            <el-tag key="all" :closable="true" v-show="fileForm.fileSend.all.max" v-if="fileForm.fileSend.all" type="primary" @close="closeAll">
              {{'所有人('+fileForm.fileSend.all.min+'-'+fileForm.fileSend.all.max+')'}}
            </el-tag>
            <el-tag :key="dep.id" :closable="true" type="primary" @close="closeDep(index)" v-for="(dep,index) in fileForm.fileSend.depList">
              {{dep.name+'('+dep.min+'-'+dep.max+')'}}
            </el-tag>
            <el-tag :key="person.id" :closable="true" type="primary" @close="closePerson(index)" v-for="(person,index) in fileForm.fileSend.personList">
              {{person.name}}
            </el-tag>
          </div>
          <el-button class="addButton" @click="showArchive"><i class="el-icon-plus"></i></el-button>
        </el-form-item>
        <el-form-item label="上传附件" prop="fileIds" v-if="isInArray(addFileDoc,$route.query.code)">
          <el-upload class="myUpload" :multiple="false" :action="baseURL+'/doc/uploadDocFile'" :data="{docTypeCode:$route.query.code}" :on-success="handleAvatarSuccess" ref="myUpload" :before-upload="beforeUpload" :on-remove="handleRemove">
            <el-button size="small" type="primary" :disabled="fileForm.fileIds.length>4">上传附件<i class="el-icon-upload el-icon--right"></i></el-button>
          </el-upload>
          <p class="uploadInfo">最多上传5个附件</p>
        </el-form-item>
        <el-form-item label="归档状态" class="textarea" prop="state">
          <el-radio-group class="myRadio" v-model="archiveState">
            <el-radio-button label="1">通过<i></i></el-radio-button>
            <el-radio-button label="2">不通过<i></i></el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div class="buttonBox">
        <el-button size="large" type="primary" @click="docArchive(true)">归档并结束</el-button>
        <el-button size="large" @click="DialogSubmitVisible = true;"><i class="iconfont icon-archive"></i>归档并分发</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="DialogSubmitVisible" size="small" class="myDialog" custom-class="archiveSubmitDialog" @close="DialogSubmitClose">
      <span slot="title">公文分发</span>
      <el-form label-position="left" :model="archiveForm" :rules="archiveFormRule" ref="archiveForm" label-width="75px">
        <el-form-item class='reciverWrap' label="收件人">
          <div class="reciverList">
            <el-tag type="primary" :closable="true" v-for="(person,index) in archiveForm.persons" @close="removePerson(index)">{{person.name}}</el-tag>
          </div>
          <el-button class="addButton" @click="selectArchivePerson"><i class="el-icon-plus"></i></el-button>
        </el-form-item>
        <el-form-item label="分发意见" prop="res">
          <el-input type="textarea" :rows="6" resize='none' v-model="archiveForm.res" :maxlength="100"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="dialogSubmitButton" @click="dialogSubmit">分发</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <person-dialog @updatePerson="updateArchivePerson" :data="archiveForm.persons" admin="1" :visible.sync="dialogArchivePersonVisible" dialogType="multi"></person-dialog>
    <major-dialog :params="fileForm.fileSend" @updatePerson="updateFileSend" :visible.sync="fileSendVisible"></major-dialog>
  </div>
</template>
<script>
import PersonDialog from '../../components/personDialog.component'
import QuitAdvice from './detailComponent/empQuitAdvice.component'
import MajorDialog from '../../components/majorDialog.component'
import historyAdvice from './detailComponent/historyAdvice.component'
import signAdvice from './detailComponent/signAdvice.component'
import myAdvice from './detailComponent/myAdvice.component'
import FWGD from './detailComponent/FWGDetail.component'
import SWDD from './detailComponent/SWDDetail.component'
import CPDD from './detailComponent/CPDDetail.component'
import HTSD from './detailComponent/HTSDetail.component'
import YCS from './component/vehicleDetail.component' //用车详情
import CLS from './component/materialDetail.component' //材料详情
import FWG from './component/manuscriptDetail.component' //发文详情
import CLV from './component/travelDetail.component' //差旅详情
import GSS from './component/injuryDetail.component' //工伤详情
import QJS from './component/vacationDetail.component' //休假详情
import RSB from './component/empChangeDetail.component' //人事变动详情
import ZZS from './component/empBecomeDetail.component' //转正详情
import JJS from './component/empUpgradeDetail.component' //晋升详情
import PXS from './component/empTrainingDetail.component' //培训详情
import RYY from './component/empIntroduceDetail.component' //引进详情
import SWD from './component/docCheckInDetail.component' //引进详情
import HTS from './component/contractDetail.component' //合同详情
import JKS from './component/loanDetail.component' //借款详情
import YSS from './component/budgetDetail.component' //预算详情
import BXS from './component/reimburseDetail.component' //预算详情
import FKS from './component/paymentDetail.component' //付款详情
import YFK from './component/prePayDetail.component' //预付款详情
import CLB from './component/travelRemibDetail.component' //预付款详情
import BKY from './component/guestTicketDetail.component.vue' //宾客机票详情
import YGY from './component/staffBenefitDetail.component.vue' //员工优惠机票
import LZS from './component/empQuitDetail.component.vue' //离职详情
import SXS from './component/airRepairDetail.component.vue' //送修详情
import JHH from './component/airExchangeDetail.component.vue' //交换详情
import ZJJ from './component/airLoanDetail.component.vue' //租借详情
import JBC from './component/airSellDetail.component.vue' //售出详情

import HCG from './component/airMaterialDetail.component.vue' //航材工具详情

import YSL from './component/commonBudgetDetail.component.vue' //通用预算详情
import TYS from './component/commonDetail.component.vue' //通用申请详情

import { mapGetters } from 'vuex'
const arrowHtml = '<i class="iconfont icon-jiantouyou"></i>'
const signFlag = '<i class="signFlag">#</i>'
const otherAdviceDoc = ["FWG", "SWD", "CPD", "HTS"]
const addFileDoc = ["CPD", "HTS"]
export default {
  components: {
    PersonDialog,
    QuitAdvice,
    MajorDialog,
    historyAdvice,
    signAdvice,
    myAdvice,
    FWGD,
    SWDD,
    CPDD,
    HTSD,
    YSL,
    TYS,
    YCS,
    CLS,
    FWG,
    CLV,
    GSS,
    QJS,
    RSB,
    ZZS,
    JJS,
    PXS,
    RYY,
    SWD,
    HTS,
    JKS,
    YSS,
    BXS,
    FKS,
    YFK,
    CLB,
    BKY,
    YGY,
    LZS,
    FWGD,
    SXS,
    HCG,
    JHH,
    ZJJ,
    JBC
  },
  data() {
    var checkFileSend = (rule, value, callback) => {
      if (value.all.max || value.personList.length != 0 || value.depList != 0) {
        callback();
      } else {
        callback(new Error('请选择发布范围'))
      }
    };
    return {
      DialogArchiveVisible: false,
      DialogSubmitVisible: false,
      dialogArchivePersonVisible: false,
      currentView: '',
      archiveForm: {
        res: '',
        persons: []
      },
      docDetialInfo: { doc: {}, task: [{ state: '' }], taskDetail: [], taskFile: [], taskQuote: [], otherInfo: [], suggests: '' },
      archiveFormRule: {},
      fileRules: {
        fileSend: [{ type: 'object', required: true, validator: checkFileSend, trigger: 'blur' }],
      },
      fileForm: {
        taskFileId: '',
        fileSend: {
          personList: [],
          all: '',
          depList: []
        },
        fileIds: []
      },
      activeNames: [],
      topDistData: [],
      distData: [],
      isSuccessSubmit: false,
      suggestHtml: '',
      archiveState: '1',
      isRedFile: false,
      activeContent: ['1'],
      showOtherAdvice: false,
      otherAdviceDoc,
      fileSendVisible: false,
      sendTypes: [],
      addFileDoc,
      taskFile: []
    }
  },
  created() {
    this.getDetail(this.$route);
  },
  beforeRouteUpdate(to, from, next) {
    this.getDetail(to);
    next();
  },
  mounted() {

  },
  computed: {
    computeView() {
      var view = '';
      var temp = otherAdviceDoc.find(d => d == this.$route.query.code);
      if (temp) {
        view = temp + 'D'
      }
      return view
    },
    showMyadvice() {
      if (this.docDetialInfo.doc != {}) {
        if (this.currentView == 'LZS') {
          return this.docDetialInfo.doc.isTask == 1 && this.docDetialInfo.doc.isSign != 1 && this.docDetialInfo.doc.isFied != 1
        } else {
          return this.docDetialInfo.doc.isTask == 1 && this.docDetialInfo.doc.isSign != 1
        }

      } else {
        return false
      }
    },
    showdArchiveButton() {
      var isShow = false;
      if (this.docDetialInfo.doc != {} && this.docDetialInfo.doc.isFied == 1) {
        if (this.currentView == 'FWG') {
          if(this.docDetialInfo.doc.isConfidential==1&&(this.docDetialInfo.otherInfo[0].classify1==='会议纪要'||this.docDetialInfo.otherInfo[0].classify1==='公司发文')){
            isShow=true;
          }
        } else {
          isShow = true;
        }
      }

      return isShow
    },
    ...mapGetters([
      'userInfo',
      'isAdmin',
      'baseURL'
    ])
  },
  methods: {
    updateFileSend(params) {
      this.fileForm.fileSend = params;
    },
    showArchive() {
      this.fileSendVisible = true;
    },
    getFileSend() {
      if (this.isRedFile) {


        this.$http.post("/doc/getFileSend", { id: this.$route.params.id })
          .then(res => {
            if (res.status == 0) {
              if (res.data.sendTypeAll.max) {
                this.fileForm.fileSend.all = { max: res.data.sendTypeAll.max, min: res.data.sendTypeAll.min }
              } else {
                this.fileForm.fileSend.depList = [];
                this.fileForm.fileSend.personList = [];
                res.data.sendTypeDept.forEach(d => {
                  this.fileForm.fileSend.depList.push({
                    id: d.id,
                    name: d.name,
                    min: d.min,
                    max: d.max
                  })
                })
                res.data.sendTypeEmp.ids.forEach((d, index) => {
                  this.fileForm.fileSend.personList.push({
                    empId: d,
                    postId: res.data.sendTypeEmp.empPostId[index],
                    name: res.data.sendTypeEmp.names[index],
                  })
                })
              }
            } else {

            }
          })
      }
    },

    getDetail(route) {

      var url = "/doc/getDocDetailInfo";
      if (route.query.code == 'LZS') {
        url = '/doc/getDocDimissionInfo'
      }
      this.$http.post(url, { id: route.params.id, empId: this.userInfo.empId })
        .then(res => {
          if (res.status == 0) {
            this.docDetialInfo = res.data;
            if (route.query.code == 'LZS') {
              this.docDetialInfo.otherInfo = this.docDetialInfo.dimission;
            }
            if (this.docDetialInfo.doc.pageCode != 'CPD') {
              this.currentView = this.docDetialInfo.doc.pageCode;
            }
            if (this.docDetialInfo.task[0].state == 3 || this.docDetialInfo.task[0].state == 4) {
              this.getDistInfo();
            }
            if (route.query.code == 'FWG') {
              this.isRedFile = true;
              this.getSendType();
            }
            this.handleSuggest();
            if (route.query.code != 'CPD' && route.query.code != 'HTS') {
              this.activeContent = [];
            }
          }
        }, res => {

        })
    },
    getSendType() {
      this.$http.post('/api/getDict', { dictCode: 'FIL01' })
        .then(res => {
          if (res.status == '0') {
            this.sendTypes = res.data;
          } else {
            console.log('获取主送类型失败')
          }
        })
    },
    handleSuggest() {
      if (Array.isArray(this.docDetialInfo.suggests)) {
        var html = '起草' + arrowHtml + ' ';
        this.docDetialInfo.suggests.forEach((s, i, arr) => {
          if (s.nodeName == 'sign') {
            if (arr[i - 1].nodeName != 'sign') {
              html += signFlag + ' ' + s.typeIdName + s.remark + ' ';
              if (arr[i + 1].nodeName != 'sign') {
                html += signFlag + ' ' + arrowHtml
              }
            } else if (arr[i + 1].nodeName != 'sign') {
              html += s.typeIdName + s.remark + ' ' + signFlag + ' ' + arrowHtml;
            } else {
              html += s.typeIdName + s.remark + ' ';
            }
          } else if (s.nodeName == 'trans') {
            if (arr[i - 1].nodeName != 'trans') {
              html += signFlag + ' ' + s.typeIdName + s.remark + ' ';
              if (arr[i + 1].nodeName != 'trans') {
                html += signFlag + ' ' + arrowHtml
              }
            } else if (arr[i + 1].nodeName != 'trans') {
              html += s.typeIdName + s.remark + ' ' + signFlag + ' ' + arrowHtml;
            } else {
              html += s.typeIdName + s.remark + ' ';
            }
          } else {
            if (i == arr.length - 1) {
              html += s.typeIdName + s.remark
            } else {
              html += s.typeIdName + s.remark + arrowHtml
            }
          }
        })
        html += '归档'
        this.suggestHtml = html;
      }
    },
    selectArchivePerson() {
      this.dialogArchivePersonVisible = true;
    },
    updateArchivePerson(payLoad) {
      this.dialogArchivePersonVisible = false;
      this.archiveForm.persons = payLoad;
    },
    closeAll() {
      this.fileForm.fileSend.all = '';
    },
    closePerson(index) {
      this.fileForm.fileSend.personList.splice(index, 1);
    },
    closeDep(index) {
      this.fileForm.fileSend.depList.splice(index, 1);
    },
    docArchive(isEnd) { //归档
      this.$refs.fileForm.validate((valid) => {
        if (valid) {
          var that = this;
          var params = {
            docId: this.docDetialInfo.doc.id,
            "taskDeptMajorName": this.userInfo.deptVo.fatherDept,
            "taskDeptMajorId": this.userInfo.deptVo.fatherDeptId,
            "taskDeptName": this.userInfo.deptVo.dept,
            "taskDeptId": this.userInfo.deptVo.deptId,
            "taskUserName": this.userInfo.name,
            "taskUserId": this.userInfo.empId,
            "state": this.archiveState,
            "taskFileId": '',
            "taskContent": this.$refs.myAdvice.ruleForm.taskContent
          }
          if (this.archiveState == 1) {
            if (this.isRedFile) {
              params.taskFileId = this.fileForm.taskFileId;
              params.fileSend = {
                "sendTypeAll": {
                  "sendType": this.sendTypes.find(type => type.dictEname == 'all').dictCode, //发布范围i人类型
                  "max": this.fileForm.fileSend.all.max, //最大
                  "min": this.fileForm.fileSend.all.min //最小
                },
                "sendTypeDept": [],
                "sendTypeEmp": {
                  "sendType": this.sendTypes.find(type => type.dictEname == 'person').dictCode,
                  "ids": this.fileForm.fileSend.personList.map(person => person.empId),
                  "empPostId": this.fileForm.fileSend.personList.map(person => person.postId),
                }
              }
              params.fileSend.sendTypeDept = this.fileForm.fileSend.depList.map(function(dep) {
                return {
                  sendType: that.sendTypes.find(type => type.dictEname == 'department').dictCode,
                  id: dep.id,
                  max: dep.max,
                  min: dep.min
                }
              });
            }
          }
          if (this.isInArray(addFileDoc, this.$route.query.code)) {
            params.fileIds = this.fileForm.fileIds.map(f => f.response.data);
          }
          console.log(params)
          this.$http.post('/doc/docArchive', params, { body: true })
            .then(res => {
              if (res.status == '0') {
                if (isEnd) {
                  this.$message.success('归档成功');
                  this.$router.push('/doc/docSearch');
                } else {
                  this.docDistribution();
                }
              } else {
                this.$message.error('归档失败，请重试');
              }
            }, res => {

            })
        } else {
          this.$message.waring('请填写归档信息');
          this.DialogSubmitVisible = false;
          return false;
        }
      });

    },
    removePerson(index) {
      this.archiveForm.persons.splice(index, 1);
    },
    changePay() {
      this.$confirm('确定已付款?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post('/doc/updateFinPayState', { docId: this.$route.params.id })
          .then(res => {
            if (res.status == 0) {
              this.$message.success('操作成功!');
              this.getDetail(this.$route);
            } else {
              this.$message.error('操作失败!' + res.message);
            }
          })
      }).catch(() => {

      });
    },
    dialogSubmit() {
      if (this.archiveForm.persons.length > 0) {
        if (this.docDetialInfo.task[0].state == 3) {
          this.docDistribution();
        } else {
          this.docArchive(false);
        }
      } else {
        this.$message.warning('请选择收件人！');
      }
    },
    docDistribution() {
      var params = [];
      var dist = {
        "distDeptMajorId": this.userInfo.deptVo.fatherDeptId,
        "distDeptMajorName": this.userInfo.deptVo.fatherDept,
        "distDeptId": this.userInfo.deptVo.deptId,
        "distDeptName": this.userInfo.deptVo.dept,
        "distUserId": this.userInfo.empId,
        "distUserName": this.userInfo.name,
        "content": this.archiveForm.res,
        "docId": this.$route.params.id,
        "operateType": '1'
      }
      this.archiveForm.persons.forEach(person => {
        var temp = {
          "reciveDeptMajorId": person.deptParentId,
          "reciveDeptId": person.deptId,
          "reciveDeptName": person.deptParentName,
          "reciveUserId": person.empId,
          "reciveUserName": person.name,
        }
        Object.assign(temp, dist);
        params.push(temp);
      })
      this.$http.post('/doc/docDistribution', params, { body: true })
        .then(res => {
          if (this.docDetialInfo.task[0].state == 3) {
            if (res.status == 0) {
              this.$message.success('分发成功！');
            } else {
              this.$message.error(res.message)
            }
          } else {
            if (res.status == 0) {
              this.$message.success('归档并分发成功！');
            } else {
              this.$message('归档成功，分发失败！')
            }
          }
          this.DialogArchiveVisible = false;
          this.DialogSubmitVisible = false;
          this.$router.push('/doc/docSearch');
        })
    },
    DialogSubmitClose() {
      if (this.isSuccessSubmit) {
        this.$router.push('/doc/docSearch');
      }
    },
    handleChange(activeNames) {
      if (activeNames.length == 0) {
        this.topDistData = this.distData.slice(0, 3);
      } else {
        this.topDistData = this.distData;
      }
    },
    getDistInfo() {
      this.$http.post('/doc/getDistInfo', { docId: this.$route.params.id })
        .then(res => {
          if (res.status == '0') {
            this.distData = res.data;
            this.topDistData = this.distData.slice(0, 3);
          } else {

          }
        }, res => {

        })
    },
    handleAvatarSuccess(res, file, fileList) {
      if (this.isRedFile) {
        this.fileForm.taskFileId = res.data;
        this.taskFile = fileList;
      } else {
        this.fileForm.fileIds = fileList;
      }
    },
    beforeUploadFWG(file) {
      // const isJPG = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      const isJPG = file.type === 'application/pdf';
      const isLt10M = file.size / 1024 / 1024 < 50;

      if (!isJPG) {
        // this.$message.error('上传文件只能是 DOCX 格式!');
        this.$message.error('上传文件只能是 PDF 格式!');
      }
      if (!isLt10M) {
        this.$message.error('上传文件大小不能超过 50MB!');
      }
      return isJPG && isLt10M;
    },
    beforeUpload(file) {
      // const isJPG = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      // const isJPG = file.type === 'application/pdf';
      const isLt10M = file.size / 1024 / 1024 < 500;

      // if (!isJPG) {
      //   // this.$message.error('上传文件只能是 DOCX 格式!');
      //   this.$message.error('上传文件只能是 PDF 格式!');
      // }
      if (!isLt10M) {
        this.$message.error('上传文件大小不能超过 500MB!');
      }
      return  isLt10M;
    },
    handleRemove(file, fileList) {
      if (this.isRedFile) {
        this.fileForm.taskFileId = '';
      } else {
        this.fileForm.fileIds = fileList;
      }
    },

  }
}

</script>
<style lang='scss'>
$main:#0460AE;
$sub:#1465C0;
#docDetail {
  .docheader {
    line-height: 24px;
    padding: 8px 0 4px;
    .docTypeName,
    .docNo {
      font-size: 18px;
      color: #151515;
      display: inline-block;
      vertical-align: middle;
      float: left;
    }
    .docTypeName {
      position: relative;
      padding-right: 7px;
      margin-right: 5px;
      &:before {
        content: '';
        position: absolute;
        right: 0;
        height: 18px;
        top: 2px;
        background: #151515;
        width: 2px;
      }
    }
    .improtType {
      display: inline-block;
      width: 40px;
      line-height: 19px;
      height: 19px;
      border-radius: 2px;
      text-align: center;
      font-size: 13px;
      margin-left: 10px;
      vertical-align: middle;
      color: #fff;
      float: left;
    }
    .rightBox {
      float: right;
      .taskUserName {
        color: $sub;
        font-size: 18px;
        padding-right: 5px;
      }
      .deptName {
        color: #646464;
        font-size: 15px;
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
  }
  .suggestHtml {
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
  .attch {
    color: $main;
    cursor: pointer;
    a {
      display: block;
      color: $main!important;
    }
  }
  .doc-form_title {
    padding-bottom: 20px;
    position: relative;
    font-size: 18px;
    line-height: 20px;
    color: $main;
    text-indent: 15px; // font-weight: bold;
    &:before {
      content: '';
      display: block;
      position: absolute;
      left: 0;
      top: 2px;
      width: 4px;
      height: 15px;
      background-color: #0460AE;
    }
  }
  .backV {
    background: #F7F7F7;
  }
  .commonBox {
    margin-bottom: 30px;
    padding-bottom: 30px;
    border-bottom: 1px dashed #D5DADF;
  }
  .adviceSpan {
    display: inline-block;
    padding-right: 10px;
    word-break: break-word;
  }
  .baseInfoBox {
    padding-bottom: 10px;
    .el-col {
      border-bottom: 1px solid #D5DADF;
      padding: 5px 18px 5px 24px;
      min-height: 57px;
      overflow: hidden;
      display: table;
      font-size: 15px;
      table-layout: fixed;
    }
    .rightBorder {
      border-right: 1px solid #D5DADF;
    }
    .blank {
      height: 57px;
    }
    .title {
      width: 140px;
      display: table-cell;
      vertical-align: middle;
      word-wrap: break-word;
    }
    .textContent {
      word-wrap: break-word;
      display: table-cell;
      vertical-align: middle;
      overflow: hidden;
      word-wrap: break-word;
      line-height: 19px;
      &.blackText {
        font-weight: bold;
      }
    }
    .el-collapse {
      border: none;
      .el-collapse-item__header {
        border-bottom: none;
        font-size: 18px;
        padding-left: 0;
        color: $main;
      }
      .el-collapse-item__content {
        overflow: hidden;
        padding: 0;
        border-top: 1px solid #D5DADF;
      }
    }
  }
  .timeRight {
    text-align: right;
  }

  .myAdvice {
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
  .archiveDialog {
    width: 700px;
    .el-dialog__header {
      font-size: 18px;
    }
    .el-dialog__body {
      padding: 35px 0;
      text-align: center;
      button {
        width: 180px;
        border-radius: 3px;
      }
      .fwNo {
        line-height: 46px;
        font-size: 16px;
      }
      .fileForm {
        padding: 0 20px;
        margin-bottom: 20px;
        &.fileRed {
          text-align: left;
          margin-bottom: 50px;
          .el-table {
            margin-bottom: 20px;
          }
          .myUpload {
            width: inherit!important;
          }
        }
        .el-form-item__label {
          padding-right: 20px;
          font-size: 15px;
        }
        .el-radio-button__inner {
          width: 100px;
          height: 45px;
          line-height: 45px;
          padding: 0;
        }
        .reciverWrap {
          .el-form-item__content {
            display: flex;
          }
          .reciverList {
            flex: 1;
            .el-tag {
              margin-right: 5px;
            }
          }
          button {
            width: 48px;
          }
        }
      }
    }
    .uploadInfo {
      position: absolute;
      right: 0;
      font-size: 13px;
      color: #9a9a9a;
      line-height: 15px;
      bottom: -23px;
      white-space: nowrap;
    }
  }
  .archiveSubmitDialog {
    width: 600px;
    .el-dialog__body {
      padding: 25px 25px 25px 8px;
    }
    .reciverWrap {
      .el-form-item__content {
        display: flex;
      }
      .reciverList {
        flex: 1;
        .el-tag {
          margin-right: 5px;
        }
      }
    }
    .dialogSubmitButton {
      width: 180px;
      border-radius: 3px;
    }
  }
  .el-form-item__error {
    padding-left: 5px;
  }
  .distTable {
    th {
      background: $sub;
    }
    td {
      height: 50px;
    }
  }
  .moreButton {
    border-top: none;
    .el-collapse-item__header {
      text-align: center;
      i {
        transform: rotate(90deg);
      }
    }
    .el-collapse-item.is-active>.el-collapse-item__header .el-collapse-item__header__arrow {
      transform: rotate(-90deg);
    }
    .el-collapse-item__wrap {
      display: none;
    }
  }
  .operateBox {
    margin: 30px 0;
    a {
      float: right;
      i {
        font-size: 22px;
        vertical-align: middle;
      }
    }
  }
}

</style>
