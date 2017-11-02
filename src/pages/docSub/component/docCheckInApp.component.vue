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
        <el-upload class="myUpload" :multiple="false" :action="baseURL+'/doc/uploadDocFile'" :data="{docTypeCode:$route.params.code}" :on-success="handleAvatarSuccess" ref="myUpload" :on-remove="handleRemove" :before-upload="beforeUpload">
          <el-button size="small" type="primary" :disabled="checkInForm.wordFileId!=''">上传文件<i class="el-icon-upload el-icon--right"></i></el-button>
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
      noMore: false
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
    console.log(this.$route.params)
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.checkInForm.wordFileId = res.data;
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
      this.checkInForm.wordFileId = '';
    },
    submitMiddle() {
      var params = {
        receiveWord: {
          classify1: this.checkInForm.classify1,
          classify2: this.checkInForm.classify2,
          wordNo: this.checkInForm.wordNo,
          catalogueId: this.checkInForm.catalogueName[this.checkInForm.catalogueName.length - 1],
        },
        wordFileId: this.checkInForm.wordFileId
      }
      this.$emit('submitMiddle', params);
    },
    submitForm() {
      this.$refs.checkInForm.validate((valid) => {
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
