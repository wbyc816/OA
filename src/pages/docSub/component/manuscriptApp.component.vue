<template>
  <div class="manuscriptApp">
    <el-form label-position="left" :model="manuscriptForm" :rules="rules" ref="manuscriptForm" label-width="128px">
      <el-form-item label="发文类型" prop="classify1" placeholder="">
        <el-select v-model="manuscriptForm.classify1" style="width:100%">
          <el-option v-for="item in types" :key="item.dictCode" :label="item.dictName" :value="item.dictCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发文目录" prop="catalogueName">
        <el-cascader expand-trigger="hover" :options="catalogueList" :props="defaultProp" v-model="manuscriptForm.catalogueName" style="width:100%" popper-class="myCascader">
        </el-cascader>
      </el-form-item>
      <el-form-item label="发文日期" prop="issueDate">
        <el-date-picker v-model="manuscriptForm.issueDate" type="date" :editable="false" :clearable="false" style="width:100%" :picker-options="pickerOptions0"></el-date-picker>
      </el-form-item>
      <el-form-item label="主送人" prop="fileSend" class="reciverWrap">
        <div class="reciverList">
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
        <el-button class="addButton" @click="fileSendVisible=true"><i class="el-icon-plus"></i></el-button>
      </el-form-item>
      <el-form-item label="签发人" prop="signName">
        <el-input class="search" :readonly="true" :value="manuscriptForm.signName">
          <el-button slot="append" @click='signDialogVisible=true'>选择</el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="正文" prop="docFileId">
        <el-upload class="myUpload" :multiple="false" :action="baseURL+'/doc/uploadDocFile'" :data="{docTypeCode:$route.params.code}" :on-success="handleAvatarSuccess" ref="myUpload" :before-upload="beforeUpload" :on-remove="handleRemove">
          <el-button size="small" type="primary" :disabled="manuscriptForm.docFileId!=''">上传文件<i class="el-icon-upload el-icon--right"></i></el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <person-dialog @updatePerson="updateSign" :visible.sync="signDialogVisible"></person-dialog>
    <major-dialog :params="manuscriptForm.fileSend" @updatePerson="updateFileSend" :visible.sync="fileSendVisible"></major-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import PersonDialog from '../../../components/personDialog.component'
import MajorDialog from '../../../components/majorDialog.component'
export default {
  components: { PersonDialog, MajorDialog },
  data() {
    var checkFileSend = (rule, value, callback) => {
      if (value.all.max || value.personList.length != 0 || value.depList != 0) {
        callback();
      } else {
        callback(new Error('请选择主送人'))
      }
    };
    return {
      signDialogVisible: false,
      fileSendVisible: false,
      manuscriptForm: {
        classify1: '',
        catalogueName: [],
        signName: '',
        signId: '',
        issueDate: '',
        fileSend: {
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
        catalogueName: [{ type: 'array', required: true, message: '请选择发文目录', trigger: 'blur'  }],
        signName: [{ required: true, message: '请选择签发人', trigger: 'blur' }],
        issueDate: [{ type: 'date', required: true, message: '请选择发文日期', trigger: 'blur' }],
      },
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      params: {},
      sucessFlag: 0,
      catalogueList:[],
       defaultProp: {
        value: 'id',
        label: 'name',
        children: 'catalogues'
      },
    }
  },
  computed: {
    ...mapGetters([
      'submitLoading',
      'baseURL'
    ])
  },
  created() {
    this.getType();
    this.getSendType();
    this.getFileCatalogue();
  },
  methods: {
    updateSign(reciver) {
      this.manuscriptForm.signName = reciver.reciUserName;
      this.manuscriptForm.signId = reciver.reciUserId;
      this.signDialogVisible = false;
    },
    updateFileSend(params) {
      this.manuscriptForm.fileSend = params;
    },
    handleAvatarSuccess(res, file) {
      this.manuscriptForm.docFileId = res.data;
    },
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'application/pdf';
      const isLt10M = file.size / 1024 / 1024 < 10;

      if (!isJPG) {
        this.$message.error('上传文件只能是 JPG或PDF 格式!');
      }
      if (!isLt10M) {
        this.$message.error('上传文件大小不能超过 10MB!');
      }
      return isJPG && isLt10M;
    },
    handleRemove() {
      this.manuscriptForm.docFileId = '';
    },
    submitMiddle() {
      var that = this;
      this.params = {
        "file": {
          "classify1": this.manuscriptForm.classify1, //发文类型 
          "issueDate": this.manuscriptForm.issueDate.getTime(), //发文日期
          "catalogueId": this.manuscriptForm.catalogueName[this.manuscriptForm.catalogueName.length-1], //目录 
          "signId": this.manuscriptForm.signId //签发人
        },
        "fileSend": {
          "sendTypeAll": {
            "sendType": this.sendTypes.find(type => type.dictEname == 'all').dictCode, //主送人类型
            "max": this.manuscriptForm.fileSend.all.max, //最大
            "min": this.manuscriptForm.fileSend.all.min //最小
          },
          "sendTypeDept": [],
          "sendTypeEmp": {
            "sendType": this.sendTypes.find(type => type.dictEname == 'person').dictCode,
            "ids": []
          }
        },
        docFileId:this.manuscriptForm.docFileId
      }
      // if(!this.manuscriptForm.fileSend.all.max){
      //   this.params.fileSend.sendTypeAll={};
      // }
      this.params.fileSend.sendTypeDept = this.manuscriptForm.fileSend.depList.map(function(dep) {
        return {
          sendType: that.sendTypes.find(type => type.dictEname == 'department').dictCode,
          id: dep.id,
          max: dep.max,
          min: dep.min
        }
      });
      this.params.fileSend.sendTypeEmp.ids = this.manuscriptForm.fileSend.personList.map(function(person) {
        return person.empId
      });
      this.$emit('submitMiddle', this.params);
    },
    saveForm(){
      var params=JSON.stringify(Object.assign(this.manuscriptForm));
      this.$emit('saveMiddle',params);
    },
    getDraft(obj){
      this.combineObj(this.manuscriptForm,obj);
      if(this.manuscriptForm.issueDate){
        this.manuscriptForm.issueDate=new Date(this.manuscriptForm.issueDate);
      }
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
    closePerson(index) {
      this.manuscriptForm.fileSend.personList.splice(index, 1);
    },
    closeDep(index) {
      this.manuscriptForm.fileSend.depList.splice(index, 1);
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
            this.catalogueList = res.data;
          } else {
            console.log('获取发文目录失败')
          }
        })
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
