<template>
  <div class="empIntroduceApp">
    <el-form label-position="left" :model="introduceForm" :rules="rules" ref="introduceForm" label-width="128px">
      <el-form-item label="姓名" prop="name" class="deptArea">
        <el-input v-model="introduceForm.name">
        </el-input>
      </el-form-item>
      <el-form-item label="性别" prop="gender" class="arrArea" label-width="100px">
        <el-select v-model="introduceForm.gender">
          <el-option key="M" label="男" value="M"></el-option>
          <el-option key="F" label="女" value="F"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="出生日期" prop="birthday" class="deptArea">
        <el-date-picker type="date" v-model="introduceForm.birthday" style="width: 100%;" :editable="false" :clearable="false"></el-date-picker>
      </el-form-item>
      <el-form-item label="手机" prop="mobileNumber" class="arrArea" label-width="100px">
        <el-input v-model="introduceForm.mobileNumber" :maxlength="11">
        </el-input>
      </el-form-item>
      <el-form-item label="毕业学校" prop="graduationSchool" class="clearBoth">
        <el-input v-model="introduceForm.graduationSchool">
        </el-input>
      </el-form-item>
      <el-form-item label="学历" prop="education" class="deptArea">
        <el-select v-model="introduceForm.education">
          <el-option :key="edu.dictCode" :label="edu.dictName" :value="edu.dictCode" v-for="edu in edus"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="专业" prop="major" class="arrArea" label-width="100px">
        <el-input v-model="introduceForm.major">
        </el-input>
      </el-form-item>
      <el-form-item label="参加工作时间" prop="beginWorkDate" class="deptArea">
        <el-date-picker type="date" v-model="introduceForm.beginWorkDate" style="width: 100%;" :editable="false" :clearable="false"></el-date-picker>
        </el-input>
      </el-form-item>
      <el-form-item label="外语水平" prop="languageLevel" class="arrArea" label-width="100px">
        <el-input v-model="introduceForm.languageLevel">
        </el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email" class="clearBoth">
        <el-input v-model="introduceForm.email">
        </el-input>
      </el-form-item>
      <el-form-item label="个人照片" class="uploadBox" prop="picUrl">
        <el-upload ref="upload" class="avatar-uploader" :auto-upload="false" :action="baseURL+'/emp/updatePic'" :data="{id:userInfo.empId,introducePic:'RRY'}" :show-file-list="false" :on-success="handleAvatarSuccess" :on-error="handleAvatarError" :on-change="handleChange">
          <img v-if="introduceForm.picUrl" :src="introduceForm.picUrl" class="avatar">
          <img v-else src="../../../assets/images/blankHead1.png" alt="">
        </el-upload>
      </el-form-item>
      <template v-for="(info,index) in introduceForm.introduceContract">
        <div class="header clearBoth">
          <span class="title">合同信息</span>
          <el-button type="primary" icon="plus" size="small" @click="addItem" v-if="index==0">添加</el-button>
          <el-button type="primary" icon="close" size="small" @click="delItem(index)" v-else>删除</el-button>
        </div>
        <el-form-item label="合同类型" :prop="'introduceContract'+'.'+index+'.'+'contractType'">
          <el-select v-model="introduceForm.introduceContract[index].contractType" style="width:100%">
            <el-option :key="type.dictCode" :label="type.dictName" :value="type.dictCode" v-for="type in types"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="合同主体" :prop="'introduceContract'+'.'+index+'.'+'contractMajor'">
          <el-input v-model="introduceForm.introduceContract[index].contractMajor"></el-input>
        </el-form-item>
        <el-form-item label="合同开始日期" :prop="'introduceContract'+'.'+index+'.'+'contractStart'" class="deptArea">
          <el-date-picker type="date" v-model="introduceForm.introduceContract[index].contractStart" style="width: 100%;" :editable="false"></el-date-picker>
        </el-form-item>
        <el-form-item label="合同结束日期" :prop="'introduceContract'+'.'+index+'.'+'contractEnd'" class="arrArea">
          <el-date-picker type="date" v-model="introduceForm.introduceContract[index].contractEnd" style="width: 100%;" :editable="false"></el-date-picker>
        </el-form-item>
      </template>
      <div class="header clearBoth">
        <span class="title">上次离职信息</span>
      </div>
      <el-form-item label="离职原因" prop="leaveReason">
        <el-input v-model="introduceForm.leaveReason">
        </el-input>
      </el-form-item>
      <el-form-item label="离职时间" prop="leaveDate" class="deptArea">
        <el-date-picker type="date" v-model="introduceForm.leaveDate" style="width: 100%;" :editable="false" :clearable="false"></el-date-picker>
      </el-form-item>
      <el-form-item label="离职办理地点" prop="leavePlace" class="arrArea">
        <el-input v-model="introduceForm.leavePlace">
        </el-input>
      </el-form-item>
      <div class="header clearBoth">
        <span class="title">审批相关信息</span>
      </div>
    </el-form>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  components: {},
  data() {
    return {
      introduceForm: {
        "name": '',
        "gender": '',
        "picUrl": "", //图片路径
        "birthday": "",
        "mobileNumber": "",
        "graduationSchool": "",
        "email": "",
        "education": "",
        "major": "",
        "beginWorkDate": "",
        "languageLevel": "",
        "leaveReason": "",
        "leaveDate": "",
        "leavePlace": "",
        "introduceContract": [{
          "contractType": "",
          "contractMajor": "",
          "contractStart": "",
          "contractEnd": ""
        }]
      },
      rules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        gender: [{ required: true, message: '请选择性别', trigger: 'blur' }],
        birthday: [{ type: 'date', required: true, message: '请选择出生日期', trigger: 'blur' }],
        mobileNumber: [{ required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: this.validatePhone, trigger: 'blur,change' }
        ],
        graduationSchool: [{ required: true, message: '请输入毕业学校', trigger: 'blur' }],
        education: [{ required: true, message: '请选择学历', trigger: 'blur' }],
        major: [{ required: true, message: '请输入专业', trigger: 'blur' }],
        picUrl: [{ required: true, message: '请上传照片', trigger: 'blur' }],
        email:[{type:'email',message:'请输入正确的邮箱',trigger: 'blur,change'}]
      },
      params: '',
      edus: [],
      types: [],
      picSuccesss: 0,
      picUrl: '',
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
    this.getEdus();
    this.getTypes();
  },
  methods: {
    submitForm() {
      this.$refs.introduceForm.validate((valid) => {
        if (valid) {
          if (this.picSuccesss == 2) {
            this.submitMiddle();
          } else {
            this.$refs.upload.submit();
          }
        } else {
          this.$message.warning('请检查填写字段')
          this.$emit('submitMiddle', false);
          return false;
        }
      });
    },
    getEdus() {
      this.$http.post('/api/getDict', { dictCode: 'EMP04' })
        .then(res => {
          if (res.status == 0) {
            this.edus = res.data;
          }
        })
    },
    getTypes() {
      this.$http.post('/api/getDict', { dictCode: 'EMP05' })
        .then(res => {
          if (res.status == 0) {
            this.types = res.data;
          }
        })
    },
    handleAvatarSuccess(res, file) {
      this.picUrl = res.data;
      this.picSuccesss = 1;
      this.submitMiddle();
    },
    submitMiddle() {
      var temp = [];
      var introduceForm = this.clone(this.introduceForm);
      if (this.introduceForm.beginWorkDate) {
        introduceForm.beginWorkDate = this.introduceForm.beginWorkDate.getTime();
      }
      if (this.introduceForm.leaveDate) {
        introduceForm.leaveDate = this.introduceForm.leaveDate.getTime();
      }
      introduceForm.introduceContract.forEach((c, i) => {
        if (Object.keys(c).every(function(e) { return c[e] == '' })) {
          temp.push(i);
        }
        if (this.introduceForm.introduceContract[i].contractStart) {
          c.contractStart = this.introduceForm.introduceContract[i].contractStart.getTime();
        }
        if (this.introduceForm.introduceContract[i].contractEnd) {
          c.contractEnd = this.introduceForm.introduceContract[i].contractEnd.getTime();
        }
      })
      temp.reverse();
      temp.forEach(t => {
        introduceForm.introduceContract.splice(t, 1)
      });
      this.params = {
        empintroduce: this.combineObj(introduceForm, { picUrl: this.picUrl })
      }
      this.$emit('submitMiddle', this.params);
    },
    handleAvatarError(res, file) {
      this.$emit('submitMiddle', false);
      this.$ref.upload.clearFiles();
      this.introduceForm.picUrl = '';
      this.$message.error('图片上传失败，请重试');
    },
    handleChange(file, fileList) {
      if (this.picSuccesss == 1) {
        this.picSuccesss = 2;
      } else {
        this.picSuccesss = 0;
      }
      const isJPG = file.raw.type === 'image/jpeg' || file.raw.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      if (isJPG && isLt2M) {
        this.introduceForm.picUrl = file.url
      }

    },
    addItem() {
      this.introduceForm.introduceContract.push({
        "contractType": "",
        "contractMajor": "",
        "contractStart": "",
        "contractEnd": ""
      });
    },
    delItem(index) {
      this.introduceForm.introduceContract.splice(index, 1);
    },
  }
}

</script>
<style lang='scss'>
$main:#0460AE;
.empIntroduceApp {
  .el-input {
    width: 100%;
  }
  .header {
    color: $main;
    margin-bottom: 25px;
    font-size: 18px;
    position: relative;
    padding-left: 15px;
    line-height: 26px;
    .title {
      margin-right: 14px;
    }
    &:before {
      content: '';
      position: absolute;
      height: 15px;
      width: 4px;
      background: $main;
      left: 0;
      top: 5px;
    }
    .el-button {
      font-size: 12px;
      border-radius: 5px;
      vertical-align: middle;
    }
  }
  .avatar-uploader {
    cursor: pointer;
    position: relative;
    overflow: hidden;
    height: 105px;
  }
  .avatar-uploader .el-upload {
    height: 105px;
    width: 105px;
    text-align: left;
  }

  .avatar {
    max-height: 100%;
    max-width: 100%;
    display: block;
  }
}

</style>
