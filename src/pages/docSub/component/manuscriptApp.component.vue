<template>
  <div class="manuscriptApp">
    <el-form label-position="left" :model="manuscriptForm" :rules="rules" ref="manuscriptForm" label-width="128px">
      <el-form-item label="发文类型" prop="classify1" placeholder="">
        <el-select v-model="manuscriptForm.classify1" style="width:100%" @change="typeChange">
          <el-option v-for="item in types" :key="item.dictCode" :label="item.dictName" :value="item.dictCode" v-if="item.dictCode==='ADM0406'?userInfo.deptId==='88AE6372CFDC5DF69A976E893F4D554B':true">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发文目录" prop="catalogueName">
        <el-cascader expand-trigger="hover" :options="catalogueList" :props="defaultProp" v-model="manuscriptForm.catalogueName" style="width:100%" ref="catalogue" popper-class="myCascader">
        </el-cascader>
      </el-form-item>
      <el-form-item label="发文日期" prop="issueDate">
        <el-date-picker v-model="manuscriptForm.issueDate" type="date" :editable="false" :clearable="false" style="width:100%" :picker-options="pickerOptions0"></el-date-picker>
      </el-form-item>
      <el-form-item label="发布范围" prop="fileSend" class="reciverWrap">
        <div class="reciverList">
          <el-tag key="chooseEmpty" :closable="true" v-show="manuscriptForm.fileSend.chooseEmpty" type="primary" @close="closeEmpty">
            不公开
          </el-tag>
          <el-tag key="all" :closable="true" v-show="manuscriptForm.fileSend.all.max" type="primary" @close="closeAll">
            {{'所有人('+manuscriptForm.fileSend.all.min+'-'+manuscriptForm.fileSend.all.max+')'}}
          </el-tag>
          <el-tag :key="dep.id" :closable="true" type="primary" @close="closeDep(index)" v-for="(dep,index) in manuscriptForm.fileSend.depList">
            {{dep.name+'('+dep.min+'-'+dep.max+')'}}
          </el-tag>
          <el-tag :key="person.id" :closable="true" type="primary" @close="closePerson(index)" v-for="(person,index) in manuscriptForm.fileSend.personList">
            {{person.name}}
          </el-tag>
        </div>
        <el-button class="addButton" @click="aaa"><i class="el-icon-plus"></i></el-button>
      </el-form-item>
      <el-form-item label="主送人" prop="mainPeople" class="reciverWrap">
        <div class="reciverList">
          <el-tag key="all" :closable="true" v-show="manuscriptForm.mainPeople.all" type="primary" @close="closeMainAll">
            所有人
          </el-tag>
          <el-tag :key="dep.id" :closable="true" type="primary" @close="closeMainDep(index)" v-for="(dep,index) in manuscriptForm.mainPeople.depList">
            {{dep.name}}
          </el-tag>
          <el-tag :key="person.id" :closable="true" type="primary" @close="closeMainPerson(index)" v-for="(person,index) in manuscriptForm.mainPeople.personList">
            {{person.name}}
          </el-tag>
          <el-tag :key="item" :closable="true" type="primary" @close="closeMainOutSend(index)" v-for="(item,index) in manuscriptForm.mainPeople.outList">
            {{item}}(对外)
          </el-tag>
        </div>
        <el-button class="addButton" @click="mainPeopleVisible=true"><i class="el-icon-plus"></i></el-button>
      </el-form-item>
      <el-form-item label="抄送人" prop="ccPeople" class="reciverWrap">
        <div class="reciverList">
          <el-tag key="all" :closable="true" v-show="manuscriptForm.ccPeople.all" type="primary" @close="closeCcAll">
            所有人
          </el-tag>
          <el-tag :key="dep.id" :closable="true" type="primary" @close="closeCcDep(index)" v-for="(dep,index) in manuscriptForm.ccPeople.depList">
            {{dep.name}}
          </el-tag>
          <el-tag :key="person.id" :closable="true" type="primary" @close="closeCcPerson(index)" v-for="(person,index) in manuscriptForm.ccPeople.personList">
            {{person.name}}
          </el-tag>
        </div>
        <el-button class="addButton" @click="ccPeopleVisible=true"><i class="el-icon-plus"></i></el-button>
      </el-form-item>
      <el-form-item label="签发人" prop="signName">
        <el-input class="search" :readonly="true" :value="manuscriptForm.signName">
          <el-button slot="append" @click='signDialogVisible=true'>选择</el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="打印份数" class="inlinItem" prop="printNum">
        <money-input v-model="manuscriptForm.printNum" :maxlength="5" :prepend="false" :append="false" type="int"></money-input>
      </el-form-item>
      <el-form-item label="存档份数" class="inlinItem" prop="storeNum">
        <money-input v-model="manuscriptForm.storeNum" :maxlength="5" :prepend="false" :append="false" type="int"></money-input>
      </el-form-item>
      <el-table :data="fileRedData" style="width: 100%;margin-bottom:20px;" max-height="200">
        <el-table-column prop="fileName" label="模板名称" width="">
        </el-table-column>
        <el-table-column prop="name" label="操作" width="100">
          <template scope="scope">
            <a :href="scope.row.fileUrl" target="_blank" style="color:#0460AE">下载</a>
          </template>
        </el-table-column>
      </el-table>
      <el-form-item label="正文" prop="docFileId">
        <el-upload class="myUpload" :multiple="false" :action="baseURL+'/doc/uploadDocFile'" :data="{docTypeCode:$route.params.code}" :on-success="handleAvatarSuccess" ref="myUpload" :before-upload="beforeUpload" :on-remove="handleRemove" :file-list="files" :on-progress="handleProgress">
          <el-button size="small" type="primary" :disabled="manuscriptForm.docFileId!=''||disabledUpload" v-show="!isIE()||(manuscriptForm.docFileId==''&&!disabledUpload)">上传正文<i class="el-icon-upload el-icon--right"></i></el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <person-dialog @updatePerson="updateSign" :visible.sync="signDialogVisible" admin="1" selText="签发人"></person-dialog>
    <major-dialog :params="manuscriptForm.fileSend"  @updatePerson="updateFileSend" :visible.sync="fileSendVisible"></major-dialog>
    <major-dialog :params="manuscriptForm.mainPeople" @updatePerson="updateMainPeople" :visible.sync="mainPeopleVisible" :hasLevel="false" hasOutSend></major-dialog>
    <major-dialog :params="manuscriptForm.ccPeople" @updatePerson="updateCcPeople" :visible.sync="ccPeopleVisible" :hasLevel="false"></major-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import PersonDialog from '../../../components/personDialog.component'
import MoneyInput from '../../../components/moneyInput.component'
import MajorDialog from '../../../components/majorDialog.component'
const catalogAbleList = [
  { code: 'ADM0401', comList: ['公司发文', '公司新闻', '人事任免', 'HR政策', '办事指南', '使用手册', '规章制度'], depList: [] },
  { code: 'ADM0403', comList: ['业务通告'], depList: ['all'] },
  { code: 'ADM0402', comList: ['会议纪要'], depList: ['all'] },
  { code: 'ADM0404', comList: [], depList: ['all'] },
  { code: 'ADM0406', comList: ['all'], depList: ['all'] },
  { code: 'ADM1701', comList: ['all'], depList: ['all'] },
  { code: 'ADM1702', comList: ['all'], depList: ['all'] },
  { code: 'ADM1703', comList: ['all'], depList: ['all'] },
]
export default {
  components: { PersonDialog, MajorDialog, MoneyInput },
  data() {
    var checkFileSend = (rule, value, callback) => {
      if (value.all.max || value.personList.length != 0 || value.depList != 0||this.manuscriptForm.fileSend.chooseEmpty) {
        callback();
      } else {
        callback(new Error('请选择发布范围'))
      }
    };
    var checkFileSend1 = (rule, value, callback) => {
      if (value.all || value.personList.length != 0 || value.depList != 0 || value.outList.length != 0) {
        callback();
      } else {
        callback(new Error('请选择主送人'))
      }
    };
    var checkFileSend2 = (rule, value, callback) => {
      if (value.all || value.personList.length != 0 || value.depList != 0) {
        callback();
      } else {
        callback(new Error('请选择抄送人'))
      }
    };
    var checkPrintNum = (rule, value, callback) => {
      if (value && parseInt(value) <= 50) {
        callback();
      } else {
        callback(new Error('打印份数不能超过50'))
      }
    };
    var checkStoreNum = (rule, value, callback) => {
      if (value && parseInt(value) <= 50) {
        callback();
      } else {
        callback(new Error('存档份数不能超过50'))
      }
    };
    return {
      signDialogVisible: false,
      fileSendVisible: false,
      mainPeopleVisible: false,
      ccPeopleVisible: false,
      manuscriptForm: {
        classify1: '',
        catalogueName: [],
        signName: '',
        signId: '',
        issueDate: new Date(),
        printNum: '',
        storeNum: '',
        fileSend: {
          personList: [],
          all: '',
          depList: [],
          isEmpty:true,
          chooseEmpty:false,
        },
        mainPeople: {
          personList: [],
          all: '',
          depList: [],
          outList: []
        },
        ccPeople: {
          personList: [],
          all: '',
          depList: []
        },
        docFileId: ''
      },
      types: [],
      sendTypes: [],
      rules: {
        classify1: [{ required: true, message: '请选择发文类型', trigger: 'blur' }],
        docFileId: [{ required: true, message: '请选择正文', trigger: 'blur' }],
        fileSend: [{ type: 'object', required: true, validator: checkFileSend, trigger: 'blur' }],
        mainPeople: [{ type: 'object', required: true, validator: checkFileSend1, trigger: 'blur' }],
        // ccPeople: [{ type: 'object', required: true, validator: checkFileSend2, trigger: 'blur' }],
        catalogueName: [{ type: 'array', required: true, message: '请选择发文目录', trigger: 'blur' }],
        signName: [{ required: true, message: '请选择签发人', trigger: 'blur' }],
        issueDate: [{ type: 'date', required: true, message: '请选择发文日期', trigger: 'blur' }],
        printNum: [{ required: true, message: '请输入打印份数' }, { validator: checkPrintNum }],
        storeNum: [{ required: true, message: '请输入存档份数' }, { validator: checkStoreNum }],
      },
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      params: {},
      sucessFlag: 0,
      catalogueList: [],
      defaultProp: {
        value: 'id',
        label: 'name',
        children: 'catalogues'
      },
      fileRedData: [],
      files: [],
      disabledUpload: false,
      isDrafFirst: false
    }
  },
  computed: {
    ...mapGetters([
      'submitLoading',
      'baseURL',
      'userInfo'
    ])
  },
  created() {
    this.getType();
    this.getSendType();
    this.getFileCatalogue();
    this.initFileData();
  },
  methods: {
    aaa(){
      this.fileSendVisible=true;
      this.manuscriptForm.fileSend.isEmpty=true
      this.manuscriptForm.fileSend.all="";
      console.log( this.manuscriptForm.fileSend)
    },
    saveForm() {
      var params = JSON.stringify({
        manuscriptForm: this.manuscriptForm,
        files: this.files
      });
      this.$emit('saveMiddle', params,this.manuscriptForm.classify1);
    },
    getDraft(obj) {
      if (obj.manuscriptForm.classify1) {
        this.isDrafFirst = true;
      }
      this.combineObj(this.manuscriptForm, obj.manuscriptForm, ['issueDate']);
      this.files = obj.files;
      if (obj.manuscriptForm.issueDate) {
        this.manuscriptForm.issueDate = new Date(obj.manuscriptForm.issueDate);
      }
    },
    typeChange(val) {
      if (!this.isDrafFirst) {
        this.manuscriptForm.docFileId = '';
        this.files = [];
        this.$emit('updateSuggest', val);
        this.manuscriptForm.catalogueName = [];
        this.triggerAbleCatalog(val);
      } else { //草稿箱第一次
        this.isDrafFirst = false;
      }
    },
    triggerAbleCatalog(val){
      var ableList=catalogAbleList.find(c=>c.code===val);
      this.catalogueList.forEach(c => {
        var temp=[];
        if(c.name==='公司级'){
          temp=ableList.comList;
        }else if(c.name==='部门级'){
          temp=ableList.depList;
        }
        if(temp.length===0){
          c.disabled=true;
        }else{
          c.disabled=false;
          if(temp.indexOf('all')===-1){
            c.catalogues.forEach(d=>{
              if(temp.indexOf(d.name)!==-1){
                d.disabled=false;
              }else{
                d.disabled=true;
              }
            })
          }
        }
      })
    },
    updateSign(reciver) {
      this.manuscriptForm.signName = reciver.name;
      this.manuscriptForm.signId = reciver.empId;
      this.signDialogVisible = false;
    },
    updateFileSend(params) {
      console.log(params)
      this.manuscriptForm.fileSend = params;
      this.manuscriptForm.fileSend.chooseEmpty=params.chooseEmpty;
    },
    updateMainPeople(params) {
      this.manuscriptForm.mainPeople = params;
    },
    updateCcPeople(params) {
      this.manuscriptForm.ccPeople = params;
    },
    handleAvatarSuccess(res, file, fileList) {
      this.manuscriptForm.docFileId = res.data;
      this.files = fileList;
    },
    beforeUpload(file) {
      var isJPG;
      // if (this.manuscriptForm.classify1 == 'ADM0406' || this.manuscriptForm.classify1 == 'ADM0404') {
      //   // 公司新闻，部门发文
      //   if (file.type) {
      //     isJPG = file.type === 'application/pdf';
      //   } else {
      //     var regExp = new RegExp("\.pdf$", "i");
      //     isJPG = regExp.test(file.name);
      //   }
      //   if (!isJPG) {
      //     this.$message.error('上传文件只能是 PDF 格式!');
      //   }
      // } else {
      if (file.type) {
        isJPG = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      } else {
        var regExp = new RegExp("\.docx$", "i");
        isJPG = regExp.test(file.name);
      }
      if (!isJPG) {
        this.$message.error('上传文件只能是 DOCX 格式!');
      }
      // }

      const isLt10M = file.size / 1024 / 1024 < 50;
      var noUpload = true;
      if (this.manuscriptForm.docFileId) {
        noUpload = false
      }
      if (!isLt10M) {
        this.$message.error('上传文件大小不能超过 50MB!');
      }
      return isJPG && isLt10M && noUpload;
    },
    handleRemove() {
      this.manuscriptForm.docFileId = '';
      this.files = [];
    },
    submitMiddle() {
      var that = this;
      this.params = {
        "file": {
          "classify1": this.manuscriptForm.classify1, //发文类型 
          "issueDate": this.manuscriptForm.issueDate.getTime(), //发文日期
          "catalogueId": this.manuscriptForm.catalogueName[this.manuscriptForm.catalogueName.length - 1], //目录 
          "catalogueName": this.$refs.catalogue.currentLabels.join('/'),
          "signId": this.manuscriptForm.signId, //签发人
          "printNum": this.manuscriptForm.printNum,
          "storeNum": this.manuscriptForm.storeNum
        },
        "fileSend": {
          "sendTypeAll": {
            "sendType": this.sendTypes.find(type => type.dictEname == 'all').dictCode, //发布范围i人类型
            "max": this.manuscriptForm.fileSend.all.max, //最大
            "min": this.manuscriptForm.fileSend.all.min //最小
          },
          "sendTypeDept": [],
          "sendTypeEmp": {
            "sendType": this.sendTypes.find(type => type.dictEname == 'person').dictCode,
            "ids": this.manuscriptForm.fileSend.personList.map(person => person.empId),
            "empPostId": this.manuscriptForm.fileSend.personList.map(person => person.postId)
          }
        },
        "mainSend": {
          "sendTypeAll": {
            "sendType": this.manuscriptForm.mainPeople.all ? this.sendTypes.find(type => type.dictEname == 'all').dictCode : '', //主送人类型
          },
          "sendTypeDept": [],
          "sendTypeEmp": {
            "sendType": this.sendTypes.find(type => type.dictEname == 'person').dictCode,
            "ids": this.manuscriptForm.mainPeople.personList.map(person => person.empId)
          },
          "outSendBean": {
            "sendType": this.manuscriptForm.mainPeople.outList.length != 0 ? this.sendTypes.find(type => type.dictEname == 'outsend').dictCode : '',
            "name": this.manuscriptForm.mainPeople.outList
          }
        },
        "ccSend": {
          "sendTypeAll": {
            "sendType": this.manuscriptForm.ccPeople.all ? this.sendTypes.find(type => type.dictEname == 'all').dictCode : '', //抄送人类型
          },
          "sendTypeDept": [],
          "sendTypeEmp": {
            "sendType": this.sendTypes.find(type => type.dictEname == 'person').dictCode,
            "ids": this.manuscriptForm.ccPeople.personList.map(person => person.empId)
          }
        },
        docFileId: this.manuscriptForm.docFileId,
      }
      this.params.fileSend.sendTypeDept = this.manuscriptForm.fileSend.depList.map(function(dep) {
        return {
          sendType: that.sendTypes.find(type => type.dictEname == 'department').dictCode,
          id: dep.id,
          max: dep.max,
          min: dep.min
        }
      });
      this.params.mainSend.sendTypeDept = this.manuscriptForm.mainPeople.depList.map(function(dep) {
        return {
          sendType: that.sendTypes.find(type => type.dictEname == 'department').dictCode,
          id: dep.id,
        }
      });
      this.params.ccSend.sendTypeDept = this.manuscriptForm.ccPeople.depList.map(function(dep) {
        return {
          sendType: that.sendTypes.find(type => type.dictEname == 'department').dictCode,
          id: dep.id,
        }
      });
      this.params.docSubtypeCode=this.manuscriptForm.classify1;
      this.$emit('submitMiddle', this.params);
    },
    submitForm() {
      this.$refs.manuscriptForm.validate((valid) => {
        if (valid) {
          this.submitMiddle();
        } else {
          this.$message.warning('请检查填写字段')
          this.$emit('submitMiddle', false);
          return false;
        }
      });
    },
    getType() {
      this.$http.post('/api/getDict', { dictCode: 'ADM04' })
        .then(res => {
          if (res.status == '0') {
            this.types = res.data;
          } else {
            console.log('获取发文类型失败')
          }
        }, res => {

        })
    },
    removePerson() {

    },
    closeAll() {
      this.manuscriptForm.fileSend.all = '';
    },
    closeEmpty() {
      // this.manuscriptForm.fileSend.isEmpty=true;
      this.manuscriptForm.fileSend.chooseEmpty = false;
    },
    closeMainAll() {
      this.manuscriptForm.mainPeople.all = '';
    },
    closeMainOutSend(index) {
      this.manuscriptForm.mainPeople.outList.splice(index, 1);
    },
    closeCcAll() {
      this.manuscriptForm.ccPeople.all = '';
    },
    closePerson(index) {
      this.manuscriptForm.fileSend.personList.splice(index, 1);
    },
    closeDep(index) {
      this.manuscriptForm.fileSend.depList.splice(index, 1);
    },
    closeMainPerson(index) {
      this.manuscriptForm.mainPeople.personList.splice(index, 1);
    },
    closeMainDep(index) {
      this.manuscriptForm.mainPeople.depList.splice(index, 1);
    },
    closeCcPerson(index) {
      this.manuscriptForm.ccPeople.personList.splice(index, 1);
    },
    closeCcDep(index) {
      this.manuscriptForm.ccPeople.depList.splice(index, 1);
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
    getFileCatalogue() {
      function loopMap(arr) {
        arr.forEach(function(dep) {
          if (dep.catalogues) {
            if (dep.catalogues.length == 0) {
              dep.catalogues = null
            } else {
              loopMap(dep.catalogues)
            }
          }
        })
      }
      this.$http.post('/doc/getFileCatalogue')
        .then(res => {
          if (res.status == '0') {
            loopMap(res.data);
            res.data.forEach(r => {
              r.disabled = false;
              r.catalogues.forEach(d => {
                d.disabled = false;
              })
            })
            this.catalogueList = res.data;
          } else {
            console.log('获取发文目录失败')
          }
        })
    },
    initFileData() {
      this.$http.post('/doc/getRedFrom')
        .then(res => {
          if (res.status == 0) {
            this.fileRedData = res.data;
          } else {

          }
        })
    },
    handleProgress(event, file, fileList) {
      this.disabledUpload = true;
      if (event.percent == 100) {
        setTimeout(() => {
          this.disabledUpload = false;
        }, 2000)
      }
    }
  }
}

</script>
<style lang='scss'>
$main:#0460AE;
.manuscriptApp {
  .el-input {
    width: 100%;
  }
  .inlinItem {
    display: inline-block;
    width: 50%;
    float: left;
    &:nth-child(odd) {
      .el-form-item__label {
        text-indent: 30px;
      }
    }
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
}

</style>
