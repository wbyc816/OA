<template>
  <div class="personEdit">
    <el-form :model="personForm" :rules="rules" ref="personForm" label-position="left" label-width="105px" class="editForm">
      <el-form-item label="姓名">
        <p>{{resumeInfo.name}}</p>
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group class="myRadio" v-model="personForm.gender">
          <el-radio-button label="M">男<i></i></el-radio-button>
          <el-radio-button label="F">女<i></i></el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="英文名" prop="nameEn">
        <el-input v-model="personForm.nameEn"></el-input>
      </el-form-item>
      <el-form-item label="出生日期" prop="birthday">
        <el-date-picker type="date" v-model="personForm.birthday" style="width: 100%;" :editable="false" :clearable="false" @change="function(val){personForm.birthday=val}"></el-date-picker>
      </el-form-item>
      <el-form-item label="国籍" prop="nationality1">
        <el-input v-model="personForm.nationality1"></el-input>
      </el-form-item>
      <el-form-item label="政治面貌" prop="politicsStatus">
        <el-input v-model="personForm.politicsStatus"></el-input>
      </el-form-item>
      <el-form-item label="婚姻状况" prop="marrieStatus">
        <el-input v-model="personForm.marrieStatus"></el-input>
      </el-form-item>
      <el-form-item label="结婚登记日期" prop="marryRegisterTime">
        <el-date-picker type="date" v-model="personForm.marryRegisterTime" style="width: 100%;" :editable="false" :clearable="false" @change="function(val){personForm.marryRegisterTime=val}"></el-date-picker>
      </el-form-item>
      <el-form-item label="籍贯" prop="nativePlace">
        <el-input v-model="personForm.nativePlace"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobileNumber">
        <el-input v-model="personForm.mobileNumber" :maxlength="11"></el-input>
      </el-form-item>
      <el-form-item label="民族" prop="nationality2">
        <el-input v-model="personForm.nationality2"></el-input>
      </el-form-item>
      <el-form-item label="工作地点" prop="workPlace">
        <el-input v-model="personForm.workPlace"></el-input>
      </el-form-item>
      <el-form-item label="出生地" prop="birthplace">
        <el-input v-model="personForm.birthplace"></el-input>
      </el-form-item>
      <el-form-item label="工作邮箱" prop="workEmail">
        <el-input v-model="personForm.workEmail"></el-input>
      </el-form-item>
      <el-form-item label="身高" prop="height">
        <el-input v-model="personForm.height"></el-input>
      </el-form-item>
      <el-form-item label="血型" prop="bloodType">
        <el-input v-model="personForm.bloodType"></el-input>
      </el-form-item>
      <el-form-item label="身份证号" prop="idNumber">
        <el-input v-model="personForm.idNumber" :maxlength="18"></el-input>
      </el-form-item>
      <el-form-item label="参加工作日期" prop="joinDate">
        <el-date-picker type="date" v-model="personForm.joinDate" style="width: 100%;" :editable="false" :clearable="false" @change="function(val){personForm.joinDate=val}"></el-date-picker>
      </el-form-item>
      <div class="borderBox"></div>
      <el-form-item label="个人照片" class="uploadBox" :rules="[{ required: false, message: '头像未上传'}]" prop="picUrl">
        <el-upload ref="upload" class="avatar-uploader" :auto-upload="false" :action="baseURL+'/emp/updatePic'" :data="{id:userInfo.empId}" :show-file-list="false" :on-success="handleAvatarSuccess" :on-error="handleAvatarError" :on-change="handleChange">
          <img v-if="personForm.picUrl" :src="personForm.picUrl" class="avatar">
          <img v-else src="../../../assets/images/blankHead1.png" alt="">
        </el-upload>
      </el-form-item>
      <div class="borderBox"></div>
      <el-form-item>
        <el-button type="primary" size="large" class="submitButton" @click="nextClick" :disabled="submitLoading">下一步</el-button>
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
      personForm: {
        gender: '',
        nameEn: '',
        birthday: '',
        nationality1: '',
        politicsStatus: '',
        marrieStatus: '',
        marryRegisterTime: '',
        nativePlace: '',
        mobileNumber: '',
        nationality2: '',
        workPlace: '',
        birthplace: '',
        workEmail: '',
        height: '',
        bloodType: '',
        idNumber: '',
        joinDate: '',
        picUrl: ''
      },
      rules: {
        mobileNumber: [{ validator: this.validatePhone, trigger: 'blur,change' }],
        workEmail: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }]
      },
      submitLoading: false,
      first: true
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
    'resumeInfo': function(newVal) {
      if (newVal != undefined || newVal != null) {
        this.combineObj(this.personForm, newVal);
      }
    },
    getData: function(newVal, oldVal) {
      if (this.first) {
        this.$store.dispatch('getResumeInfo');
        this.first = false;
      }
    }
  },
  created() {
    // this.$store.dispatch('getResumeInfo');
    if (this.getData) {
      this.$store.dispatch('getResumeInfo');
    }
  },
  // beforeRouteLeave(to, from, next) {
  //   // this.$store.dispatch('setEditStatus', false);
  //   // next()
  // },
  methods: {
    onSubmit() {
      if (!this.submitLoading) {
        this.submitLoading = true;
        if (this.picChangeStatus) {
          this.$refs.upload.submit();
        } else {
          this.updateInfo();
        }
      }
    },
    handleAvatarSuccess(res, file) {
      this.personForm.picUrl = res.data;
      this.updateInfo();
    },
    handleAvatarError(res, file) {
      this.submitLoading = false;
      this.$message.error('图片上传失败，请重试');
    },
    handleChange(file, fileList) {
      const isJPG = file.raw.type === 'image/jpeg' || file.raw.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      if (isJPG && isLt2M) {
        this.picChangeStatus = true;
        this.personForm.picUrl = file.url
      }
    },
    updateInfo() {
      var params = Object.assign({ createUser: this.userInfo.name, oldId: this.resumeInfo.id, empId: this.userInfo.empId }, this.personForm)
      this.$emit('submit', { emp: params })
    },
    nextClick() {
      this.$refs['personForm'].validate((valid) => {
        if (valid) {
          this.$emit('nextClick', 'contract')
        } else {
          return false;
        }
      });
    }
  }
}

</script>
<style lang="scss">
$main:#0460AE;
$sub:#1465C0;

</style>
