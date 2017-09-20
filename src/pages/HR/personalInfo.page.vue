<template>
  <div id="personalInfo">
    <el-card class="commonCard">
      <div slot="header" class="clearfix">
        <span>个人信息</span>
        <el-button type="text" class="handleButton" v-show="!editStatus" @click.native="edit"><i class="iconfont icon-edit"></i>编辑</el-button>
      </div>
      <div class="showBox" v-show="!editStatus">
        <el-row :gutter="20" class="baseDetail">
          <el-col :span="8" class="leftDetail">
            <div class="photoBox">
              <img :src="userInfo.picUrl" alt="" v-show="userInfo.picUrl">
              <img src="../../assets/images/blankHead.png" alt="" v-show="!userInfo.picUrl">
            </div>
            <div class="infoItem">
              <span class="infoTittle">姓名</span>
              <p class="infoText">{{empDetial.name}}</p>
            </div>
            <div class="infoItem">
              <span class="infoTittle">工号</span>
              <p class="infoText">{{empDetial.workNo}}</p>
            </div>
          </el-col>
          <el-col :span="16">
            <div class="infoItem">
              <span class="infoTittle">公司</span>
              <p class="infoText">{{empDetial.workPlace}}</p>
            </div>
            <div class="infoItem">
              <span class="infoTittle">部门</span>
              <p class="infoText">{{empDetial.depts}}</p>
            </div>
            <div class="infoItem">
              <span class="infoTittle">职务</span>
              <p class="infoText">{{empDetial.jobtitle}}</p>
            </div>
            <div class="infoItem">
              <span class="infoTittle">电话</span>
              <p class="infoText">{{empDetial.phoneNumber}}</p>
            </div>
            <div class="infoItem">
              <span class="infoTittle">手机</span>
              <p class="infoText">{{empDetial.moblieNumber}}</p>
            </div>
            <div class="infoItem">
              <span class="infoTittle">邮箱</span>
              <p class="infoText">{{empDetial.workEmail}}</p>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="contactDetail">
          <el-col :span="8" class="leftDetail">
            <div class="infoItem">
              <span class="infoTittle">紧急联系人</span>
              <p class="infoText" v-if="emergencyContactInfo">{{emergencyContactInfo[0].name}}</p>
            </div>
            <div class="infoItem">
              <span class="infoTittle">联系人电话</span>
              <p class="infoText" v-if="emergencyContactInfo">{{emergencyContactInfo[0].phoneNum}}</p>
            </div>
          </el-col>
          <el-col :span="16">
            <div class="infoItem">
              <span class="infoTittle">联系人关系</span>
              <p class="infoText" v-if="emergencyContactInfo">{{emergencyContactInfo[0].relationship}}</p>
            </div>
            <div class="infoItem">
              <span class="infoTittle">联系人地址</span>
              <p class="infoText" v-if="emergencyContactInfo">{{emergencyContactInfo[0].address}}</p>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="editBox" v-show="editStatus" v-if="empDetial">
        <el-form :model="baseForm" :rules="rules" ref="baseForm" label-position="left" label-width="85px" class="editForm">
          <el-form-item label="姓名">
            <p>{{empDetial.name}}</p>
          </el-form-item>
          <el-form-item label="工号">
            <p>{{empDetial.workNo}}</p>
          </el-form-item>
          <el-form-item label="公司">
            <p>{{empDetial.workPlace}}</p>
          </el-form-item>
          <el-form-item label="部门">
            <p>{{empDetial.depts}}</p>
          </el-form-item>
          <el-form-item label="职务">
            <p>{{empDetial.jobtitle}}</p>
          </el-form-item>
          <el-form-item label="邮箱">
            <p>{{empDetial.workEmail}}</p>
          </el-form-item>
          <el-form-item label="电话" class="pr70" prop="phoneNumber">
            <el-input v-model="baseForm.phoneNumber" :maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="手机">
            <p>{{empDetial.moblieNumber}}</p>
          </el-form-item>
          <div class="borderBox"></div>
          <el-form-item label="紧急联系人" class="pr70">
            <el-input v-model="baseForm.emergency.name" :maxlength="10"></el-input>
          </el-form-item>
          <el-form-item label="联系人关系">
            <el-input v-model="baseForm.emergency.relationship" :maxlength="10"></el-input>
          </el-form-item>
          <el-form-item label="联系人电话" class="pr70" :rules="rules.emergencPhone" prop="emergency.phoneNum">
            <el-input v-model="baseForm.emergency.phoneNum" :maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="联系人地址">
            <el-input type="textarea" resize="none" :maxlength="100" :rows="4" v-model="baseForm.emergency.address"></el-input>
          </el-form-item>
          <div class="borderBox"></div>
          <el-form-item label="个人照片" class="uploadBox" :rules="[{ required: false, message: '头像未上传'}]" prop="picUrl">
            <el-upload ref="upload" class="avatar-uploader" :auto-upload="false" :action="baseURL+'/emp/updatePic'" :data="{id:userInfo.empId}" :show-file-list="false" :on-success="handleAvatarSuccess" :on-error="handleAvatarError" :on-change="handleChange">
              <img v-if="baseForm.picUrl" :src="baseForm.picUrl" class="avatar">
              <img v-else src="../../assets/images/blankHead1.png" alt="">
            </el-upload>
          </el-form-item>
          <div class="borderBox"></div>
          <el-form-item>
            <el-button type="primary" size="large" class="submitButton" @click.native="onSubmit" :disabled="submitLoading">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import blankHead from '../../assets/images/blankHead.png'
export default {
  components: {},
  data() {
    return {
      blankHead,
      picChangeStatus: false,
      submitLoading: false,
      baseForm: {
        phoneNumber: '',
        emergency: {
          phoneNum: '',
          name: '',
          address: '',
          relationship: ''
        },
        picUrl: ''
      },
      rules: {
        phoneNumber: [{ validator: this.validatePhone, trigger: 'blur,change' }],
        emergencPhone: [{ validator: this.validatePhone, trigger: 'blur,change' }],
      },
    }
  },
  computed: {
    ...mapGetters([
      'depts',
      'userInfo',
      'searchRes',
      'queryDepId',
      'depPageNumber',
      'searchLoading',
      'empDetial',
      'emergencyContactInfo',
      'baseURL',
      'editStatus'
    ])
  },
  created() {
    this.$store.dispatch('getEmpDetail', this.userInfo.empId);
    this.$store.dispatch('getEmergencyContactInfo', this.userInfo.empId);
  },
  beforeRouteLeave(to, from, next) {
    this.$store.dispatch('setEditStatus', false);
    next()
  },
  methods: {
    onSubmit() {
      this.$refs['baseForm'].validate((valid) => {
        if (valid) {
          if (!this.submitLoading) {
            this.submitLoading = true;
            if (this.picChangeStatus) {
              this.$refs.upload.submit();
            } else {
              this.updateInfo();
            }
          }

        } else {
          return false;
        }
      });
    },
    updateInfo(picUrl) {
      var emergencyParam = Object.assign({ empId: this.userInfo.empId }, this.baseForm.emergency);
      var empParam = { id: this.userInfo.empId, phoneNumber: this.baseForm.phoneNumber, picUrl: picUrl };
      if (this.emergencyContactInfo&&this.emergencyContactInfo[0]) {
        emergencyParam.oldId = this.emergencyContactInfo[0].id
      }
      // this.$store.dispatch('updateEmp', { id: this.userInfo.empId, phoneNumber: this.baseForm.phoneNumber, picUrl: picUrl });

      // this.$store.dispatch('updateEmergencyContactInfo', emergencyParam)
      this.$store.dispatch('updateBaseInfo', { emergency: emergencyParam, emp: empParam });
    },
    handleAvatarSuccess(res, file) {
      this.updateInfo(res.data);
    },
    handleAvatarError(res, file) {
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
        this.baseForm.picUrl = file.url
      }

    },
    // beforeAvatarUpload(file) {
    //   return true
    // },
    edit() {
      this.combineObj(this.baseForm, this.empDetial);
      this.combineObj(this.baseForm.emergency, this.emergencyContactInfo&&this.emergencyContactInfo[0] ? this.emergencyContactInfo[0] : {})
      this.$store.dispatch('setEditStatus', true);
    }
  }
}

</script>
<style lang="scss">
$main:#0460AE;
$sub:#1465C0;
#personalInfo {
  .showBox {
    .baseDetail {
      border-bottom: 1px solid #EAEAEA;
      padding-bottom: 20px;
      margin-bottom: 20px;
      .leftDetail {
        .photoBox {
          font-size: 0;
          padding-top: 19px;
          height: 219px;
          margin-bottom: 10px;
          line-height: 219px;
          img {
            vertical-align: middle;
            max-height: 100%;
          }
        }
        .infoItem {
          line-height: 35px;
          .infoTittle {
            width: 65px;
          }
        }
      }
    }
    .contactDetail {
      padding-bottom: 100px;
    }
  }
}

.infoItem {
  line-height: 55px;
  font-size: 15px;
  .infoTittle {
    display: inline-block;
    width: 90px;
    color: $main;
  }
  .infoText {
    display: inline-block;
  }
}

.uploadBox {
  // height:150px;
}

.editForm {
  font-size: 15px;
  padding-top: 10px;
  .el-form-item {
    width: 50%;
    float: left;
    padding-right: 30px;
    &.pr70 {
      padding-right: 70px;
    }
  }
  .el-form-item__label {
    color: $main;
  }
  .el-form-item__content {
    // float: left;
    // margin-left: 90px;
  }
  .el-select {
    width: 100%;
  }
  .borderBox {
    border-bottom: 1px solid #EAEAEA;
    padding-top: 8px;
    margin-bottom: 25px;
    clear: both;
  }
  .avatar-uploader {
    // border: 1px dashed #d9d9d9;
    // border-radius: 6px;
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
  .submitButton {
    width: 160px;
    height: 45px;
    font-size: 16px;
  }
  .el-form-item__label {
    padding: 16px 12px 16px 0;
  }
}

</style>
