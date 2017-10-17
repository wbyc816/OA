<template>
  <div class="docCheckInApp">
    <el-form label-position="left" :model="checkInForm" :rules="rules" ref="checkInForm" label-width="128px">
      <el-form-item label="收文类型" prop="classify1" placeholder="" class="deptArea">
        <el-select v-model="checkInForm.classify1" style="width:100%">
          <el-option v-for="item in types" :key="item.dictCode" :label="item.dictName" :value="item.dictCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="来文种类" prop="classify2" placeholder="" class="arrArea">
        <el-select v-model="checkInForm.classify2" style="width:100%">
          <el-option v-for="item in sendTypes" :key="item.dictCode" :label="item.dictName" :value="item.dictCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发文目录" prop="catalogueName" class="clearBoth">
        <el-cascader expand-trigger="hover" :options="catalogueList" :props="defaultProp" v-model="checkInForm.catalogueName" style="width:100%" popper-class="myCascader">
        </el-cascader>
      </el-form-item>
      <el-form-item label="来文文号" prop="wordNo">
        <el-input v-model="checkInForm.wordNo">
        </el-input>
      </el-form-item>
      <el-form-item label="正文" prop="wordFileId">
        <el-upload class="myUpload" :auto-upload="false" :multiple="false" :action="baseURL+'/doc/uploadDocFile'" :data="{docTypeCode:'DOC_ADM_APPROVAL'}" :on-success="handleAvatarSuccess" :on-error="handleAvatarError" :on-change="handleChange" ref="myUpload" :on-remove="handleRemove"  :disabled="noMore">
          <el-button size="small" type="primary">上传文件<i class="el-icon-upload el-icon--right"></i></el-button>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  components: {},
  data() {
    return {
      checkInForm: {
        classify1: '',
        classify2: '',
        wordNo: '',
        catalogueName: [],
        wordFileId: ''
      },
      types: [],
      sendTypes: [],
      rules: {
        classify1: [{ required: true, message: '请选择收文类型', trigger: 'blur' }],
        classify2: [{ required: true, message: '请选择莱文种类', trigger: 'blur' }],
        wordFileId: [{ required: true, message: '请选择正文', trigger: 'blur' }],
        wordNo: [{ required: true, message: '请输入来文文号', trigger: 'blur' }],
        catalogueName: [{ type: 'array', required: true, message: '请选择发文目录', trigger: 'blur' }],
      },
      catalogueList: [],
      params: '',
      defaultProp: {
        value: 'id',
        label: 'name',
        children: 'catalogues'
      },
      wordFileId: '',
      sucessFlag: 0,
      noMore:false
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
    handleAvatarSuccess(res, file) {
      this.wordFileId = res.data;
      this.picSuccesss = 1;
      this.submitMiddle();
    },
    handleAvatarError(res, file) {
      this.$emit('submitMiddle', false);
      this.$message.error('正文上传失败，请重试');
    },
    handleChange(file, fileList) {
      if (this.picSuccesss == 1) {
        this.picSuccesss = 2;
      } else {
        this.picSuccesss = 0;
      }
      const isPDF = file.raw.type === 'application/pdf';
      const isLt15M = file.size / 1024 / 1024 < 15;
      if (!isPDF) {
        this.$message.error('上传正文只能是 PDF 格式!');
        this.$refs.myUpload.clearFiles();
      }
      if (!isLt15M) {
        this.$refs.myUpload.clearFiles();
        this.$message.error('上传正文大小不能超过 15MB!');
      }
      if (isPDF && isLt15M) {
        this.noMore=true;
        this.checkInForm.wordFileId = file.url
      }
    },
    handleRemove() {
      this.checkInForm.wordFileId = '';
      this.wordFileId = '';
      this.picSuccesss = 0;
      this.noMore=false;
    },
    submitMiddle() {
      var params = {
        receiveWord: {
          classify1: this.checkInForm.classify1,
          classify2: this.checkInForm.classify2,
          wordNo: this.checkInForm.wordNo,
          catalogueId: this.checkInForm.catalogueName[this.checkInForm.catalogueName.length - 1],
        },
        wordFileId: this.wordFileId
      }
      this.$emit('submitMiddle', params);
    },
    submitForm() {
      this.$refs.checkInForm.validate((valid) => {
        if (valid) {
          if (this.picSuccesss == 2) {
            this.submitMiddle();
          } else {
            this.$refs.myUpload.submit();
          }
        } else {
          this.$message.warning('请检查填写字段')
          this.$emit('submitMiddle', false);
          return false;
        }
      });
    },
    getType() {
      this.$http.post('/api/getDict', { dictCode: 'ADM07' })
        .then(res => {
          if (res.status == '0') {
            this.types = res.data;
          } else {
            console.log('获取收文类型失败')
          }
        }, res => {

        })
    },
    getSendType() {
      this.$http.post('/api/getDict', { dictCode: 'ADM08' })
        .then(res => {
          if (res.status == '0') {
            this.sendTypes = res.data;
          } else {
            console.log('获取来文种类失败')
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
.docCheckInApp {
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
