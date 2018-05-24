<template>
  <div id='forumApp' class="commonApp" v-loading.fullscreen="submitLoading">
    <el-card>
      <div slot="header" class='doc_title'>
        <span>发帖</span>
      </div>
      <div class="docBaseBox doc-section">
        <!-- <h4 class='doc-form_title'>信息填写</h4> -->
        <el-form label-position="left" :model="forum" :rules="rules" ref="forum" label-width="128px">
          <el-form-item label="标题" prop="forumTitle">
            <el-input v-model="forum.forumTitle"></el-input>
          </el-form-item>
          <el-form-item label="截止时间" prop="limitTime" class="deptArea">
            <el-date-picker v-model="forum.limitTime" type="date" :editable="false" :clearable="false" style="width:100%" ></el-date-picker>
          </el-form-item>
          <!-- <el-form-item label="奖金" prop="messageContent">
            <el-input v-model="forum.messageContent"></el-input>
          </el-form-item> -->

          <!-- <el-form-item label="匿名状态" prop="anonymitySts">
            <el-radio-group class="myRadio" v-model="forum.anonymitySts">
              <el-radio-button label="1">是<i></i></el-radio-button>
              <el-radio-button label="0">否<i></i></el-radio-button>
            </el-radio-group>
          </el-form-item> -->

          
          
          <el-form-item label="帖子类型" prop="forumType1" class="arrArea">
            <el-select v-model="forum.forumType1" style="width:100%" placeholder="帖子类型" clearable>
              <el-option
                v-for="item in dataTypes"
                :key="item.dictCode"
                :label="item.dictName"
                :value="item.dictCode">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="是否启用" prop="sts"  class="clearBoth">
            <el-radio-group class="myRadio" v-model="forum.sts">
              <el-radio-button label="1">是<i></i></el-radio-button>
              <el-radio-button label="0">否<i></i></el-radio-button>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="图片     (800*240)" class="uploadBox" :rules="[{ required: false, message: '图片未上传'}]" prop="picUrl">
            <el-upload ref="upload" class="avatar-uploader" :auto-upload="true" :action="baseURL+'/forum/uploadForumImage'" :data="{forumType:this.forum.forumType1,empId:userInfo.empId}" :show-file-list="false" :on-success="handleAvatarSuccess" :on-error="handleAvatarError" :on-change="handleChange">
              <img v-if="forum.picUrl" :src="forum.picUrl"  @error="forum.picUrl=blankHead" class="avatar" width="400"> 
              <img v-else src="http://filetest.donghaiair.cn/pic/pic/2018-04-23/22-09-29/png/Group 31508.png" alt="">
            </el-upload>
          </el-form-item>

          <el-form-item label="头像" v-if="forumPic" class="uploadBox" :rules="[{ required: false, message: '头像未上传'}]" prop="avatar">
            <el-upload ref="uploadAavatar" class="avatar-uploader" :auto-upload="true" :action="baseURL+'/emp/updatePic'" :data="{id:userInfo.empId}" :show-file-list="false"  :on-change="handleChangeAvatar">
              <img v-if="forum.avatar" :src="forum.avatar"  @error="forum.avatar=blankHead" class="avatar">
              <img v-else src="http://filetest.donghaiair.cn/backstage/illustrate/icon.png" alt="">
            </el-upload>
          </el-form-item>
          
          <!-- <el-form-item label="内容" prop="taskContent1">
            <el-input type="textarea" :rows="8" resize='none' v-model="forum.taskContent1" :maxlength="1950"></el-input>
            <p class="maxText">内容最多为1950个字</p>
          </el-form-item> -->

          <el-form-item label="内容" prop="taskContent1" :rules="[{ required: true,validator:checkDes,trigger: 'blur,change' }]">
            <forum-editor @input="desChange" @updateLen="updateLen" :data="forum.taskContent1" ref="editor"></forum-editor>
          </el-form-item>
        </el-form>

        <div class='doc-form-submit_btn'>
          <el-button type="primary" @click="submit">提交</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import forumEditor from '../../components/forumEditor.component'
export default {
  name: 'forumApp',
  components: {
    forumEditor
  },
  data() {
    var checkNum = (rule, value, callback) => {
      if (this.customNums.indexOf(value) === -1) {
        callback();
      } else {
        callback(new Error('不能添加相同的号码'))
      }
    };
    return {
      picId:"",
      picChangeStatus: false,
      avatarChangeStatus: false,
      signDialogVisible: false,
      forum:{
        forumTitle: '',
        taskContent1:"",
        sts:"1",
        limitTime:"",
        forumType1:"FUM0101",
        picUrl:"",
        avatar:""
      },
      inputForm: {
        inputValue: ''
      },
      inputRules: {
        inputValue: [{ validator: this.validatePhone, trigger: 'blur' }, { validator: checkNum, trigger: 'blur' }]
      },
      rules: {
        forumTitle: [{ required: true, message: '请输入贴子标题', trigger: 'blur,change' }],
        limitTime: [{ required: true,type:"date", message: '请选择截止时间', trigger: 'blur,change' }],
        // anonymitySts: [{ required: true, message: '请选择匿名状态', trigger: 'blur,change' }],
        sts: [{ required: true, message: '请选择启用状态', trigger: 'blur,change' }],
        forumType1: [{ required: true, message: '请选择帖子类型', trigger: 'blur,change' }],
        taskContent1: [{ required: true, message: '请输入帖子内容', trigger: 'blur,change' }],
      },
      submitLoading: false,
      customNums: [],
      inputVisible: false,
      inputValue: '',
      dataTypes:[],
      forumPic:true,
    
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'baseURL',
    ])
  },
  created() {

    // this.$router.push('/forum/myforum')
    this.getDataType();
    this.hasForumPic();
  },
  methods: {
    updateLen(num) {
      this.desLenth = num;
      this.$refs.forum.validateField('taskContent1')
    },
    desChange(html) {
      this.forum.taskContent1 = html;
    },
    checkDes(rule, value, callback) {
      if (this.desLenth == 0) {
        callback(new Error('请输入' + (this.options.desTitle || '请示内容')))
      } else if (this.desLenth > 1950) {
        callback(new Error('超出最大输入长度'))
      } else {
        callback();
      }
    },
    hasForumPic(){
      this.$http.post("/forum/validateForumPic", {
         empId:this.userInfo.empId
      }).then(res => {
        if (res.status == 0) {
          this.forumPic=false;
         
        } else {
        }
      }, res => {

      })
    },
    handleChange(file, fileList) {
      var res=/[\s{}#]/g;
      console.log(file)
      if(res.test(file.name)){
          this.$message.error('上传图片名字中不能包含空格，{，}，#!');
      }else{
        const isJPG = file.raw.type === 'image/jpeg' || file.raw.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 10;

        if (!isJPG) {
          this.$message.error('上传图片只能是 JPG/PNG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 10MB!');
        }
        if (isJPG && isLt2M) {
          this.picChangeStatus = true;
          this.forum.picUrl = file.url;
        }
      }
   

    },
    handleChangeAvatar(file, fileList) {
       var res=/[\s{}#]/g;
      if(res.test(file.name)){
          this.$message.error('上传图片名字中不能包含空格，{，}，#!');
      }else{
        const isJPG = file.raw.type === 'image/jpeg' || file.raw.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 <2;

        if (!isJPG) {
          this.$message.error('上传图片只能是 JPG/PNG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
        }
        if (isJPG && isLt2M) {
          this.avatarChangeStatus = true;
          this.forum.avatar = file.url;
        }
      }
      

    },
    handleAvatarSuccess(res, file) {
      this.picId=res.data;
    },
    handleAvatarError(res, file) {
      this.$message.error('图片上传失败，请重试');
    },
    updateInfo(picUrl) {
      var emergencyParam = Object.assign({ empId: this.userInfo.empId }, this.forum.emergency);
      var empParam = { empId: this.userInfo.empId, phoneNumber: this.forum.phoneNumber, picUrl: picUrl };
      if (this.emergencyContactInfo&&this.emergencyContactInfo[0]) {
        emergencyParam.oldId = this.emergencyContactInfo[0].id
      }
      this.$store.dispatch('updateBaseInfo', { emergency: [emergencyParam], emp: empParam });
      // this.$store.dispatch('updateBaseInfo', { emp: empParam });
    },
    getDataType() {
      this.$http.post("/api/getDict", {
         dictCode:"FUM01"
      }).then(res => {
        if (res.status == 0) {
          this.dataTypes = res.data;
          this.total = res.data.total;
         
        } else {
        }
      }, res => {

      })
    },
    updatePerson(list) {
      // console.log(list)
      this.appForm.person = this.clone(list);
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      if (this.inputForm.inputValue && this.inputForm.inputValue.length !== 0) {
        this.$refs.inputForm.validate((valid) => {
          if (valid) {
            this.customNums.push(this.inputForm.inputValue);
            this.inputVisible = false;
            this.inputForm.inputValue = '';
          }
        })
      } else {
        this.inputVisible = false;
      }
    },
    closePerson(index) {
      this.appForm.person.splice(index, 1);
    },
    closeCustomNum(index) {
      this.customNums.splice(index, 1);
    },
    submit() {
        this.$refs.forum.validate((valid) => {
          if (valid) {
            this.submitData();
          } else {
            this.$message.warning('请检查填写字段')
            return false;
          }
        });
      
    },
    submitData() {
      this.$refs.upload.submit();
      this.submitLoading = true;
      var time= new Date(this.forum.limitTime).getFullYear()+"-"+(new Date(this.forum.limitTime).getMonth()+1)+"-"+new Date(this.forum.limitTime).getDate()
      console.log(this.forum)
      var params = {
        "forum": {
            "forumTitle": this.forum.forumTitle,
            "forumType1": this.forum.forumType1,
            "taskUserId": this.userInfo.empId,
            "taskUserName": this.userInfo.name,
            "taskDeptId": this.userInfo.deptId,
            "taskDeptName": this.userInfo.deptName,
            "taskDeptMajorId":this.userInfo.deptParentId,
            "taskDeptMajorName": this.userInfo.deptParentName,
            "taskContent1": this.forum.taskContent1,
            "anonymitySts": 0,
            "limitTime": time,
            "sts":this.forum.sts,
            
        },
        "operation": "1",
        "imageList":[this.picId],
      }
      this.$http.post('/forum/addForumInfo', params, { body: true })
        .then(res => {
          this.submitLoading = false;
          if (res.status == 0) {
            this.$message.success('提交成功！');
            this.$router.push('/forum/myforum');
          } else {
            this.$message.error(res.message);
          }
        })
    }
  }
}

</script>
<style lang='scss'>
#forumApp {
  .docBaseBox {
    padding-right: 150px;
    border-bottom: none;
    .el-form-item__error {
      padding-left: 6px;
    }
    .el-radio-button__inner {
      width: 100px;
      height: 45px;
      line-height: 45px;
      padding: 0;
    }
    .reciverList {
      max-height: 250px;
      overflow-y: auto;
    }
  }
  .customNumBox {
    padding-top: 4px;
    .button-new-tag {
      height: 24px;
      line-height: 22px;
      padding-top: 0;
      padding-bottom: 0;
      font-size: 13px;
      border-radius: 3px;
      .el-icon-plus {
        font-size: 12px;
      }
    }
    .el-form {
      display: inline-block;
      .input-new-tag {
        width: 125px;
        line-height: 24px;
        input {
          border-radius: 3px;
          height: 24px;
        }
      }
    }
  }
  .doc-form-submit_btn {
    button {
      margin-left: 128px;
      width: 160px;
      height: 50px;
    }
  }
  .maxText {
    position: absolute;
    right:0;
    font-size: 13px;
    color: #9a9a9a;
    line-height: 15px;
    bottom: -15px;
    white-space: nowrap;
  }
}

</style>
