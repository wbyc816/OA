<template>
  <div class="docBaseBox">
    <h4 class='doc-form_title'>基本信息</h4>
    <el-form label-position="left" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="128px">
      <el-form-item class='form-box' label="呈报人" prop="taskUserID">
        <el-select v-model="ruleForm.taskUserID" style="width:100%" @change="changeTaskUser" :disabled="taskUserList.length<2" class="taskUserSel">
          <el-option v-for="item in taskUserList" :key="item.deptId+item.jobtitle" :label="item.empName" :value="item.deptId+item.jobtitle">
            <span style="float: left">{{ item.empName }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{item.deptParentName}} / {{ item.jobtitle }}</span>
          </el-option>
        </el-select>
        <span class="taskUserInfo" v-if="taskUser">{{taskUser.deptParentName}} / {{ taskUser.jobtitle }}</span>
      </el-form-item>
      <el-form-item class='form-box' :label="reciverTtitle" prop="rec">
        <el-input class="search selPerson" :disabled="isQJSFX" v-model="ruleForm.rec" :readonly="true">
          <template slot="append">
            <el-button @click='selectPerson(false)' :disabled="isQJSFX">选择</el-button>
            <i class="iconfont icon-renyuanshezhi" v-if="!isQJSFX" @click="selectPerson(true)"></i>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item class='form-box suggestPath' label="建议路径" prop="path">
        <div class="pathBox clearfix" v-html="pathHtml">
        </div>
        <el-button size="small" type="text" @click="pathDialogVisible=true" :disabled="disableEditSuggest"><i class="iconfont icon-edit"></i>编辑</el-button>
      </el-form-item>
      <el-form-item class='form-box' label="标题" prop="sub">
        <el-input :value="docTitle" @input="updateTitle" :maxlength="50">
        </el-input>
        <p class="maxText" v-show="docTitle.length==50">已达到最大输入长度</p>
      </el-form-item>
      <el-form-item class='form-box' label="密级程度">
        <el-radio-group :value="selConfident.docDenseType" @input="updateCon" class="myRadio">
          <el-radio-button :label="item.dictName" v-for="item in confidentiality">{{item.dictName}}<i></i></el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item class='form-box' label="重要程度">
        <el-radio-group :value="selUrgency.docImportType" @input="updateUrgency" class="myRadio">
          <el-radio-button :label="item.dictName" v-for="item in urgency">{{item.dictName}}<i></i></el-radio-button>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <person-dialog @updatePerson="updatePerson" :selText="isDefault?'默认收件人':'收件人'" :visible.sync="dialogTableVisible" :admin="personAdmin" :deptId="taskUser.deptParentId" :hasSecretary="otherAdviceDoc.find(d=>d==$route.params.code)!=undefined&&isAdmin&&userInfo.isTaskUser != 1"></person-dialog>
    <path-dialog @updatePath="updatePath" :visible.sync="pathDialogVisible" :paths="ruleForm.path"></path-dialog>
  </div>
</template>
<script>
import PersonDialog from '../../../components/personDialog.component'
import PathDialog from '../../../components/pathDialog.component'
import { mapGetters, mapMutations } from 'vuex'
const arrowHtml = '<i class="iconfont icon-jiantouyou"></i>'
const otherAdviceDoc = ["FWG", "SWD", "CPD", "HTS"]
export default {
  components: {
    PersonDialog,
    PathDialog
  },
  props: {
    reciverTtitle: {
      type: String,
      default: '收件人'
    },
    reciverName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dialogTableVisible: false,
      pathDialogVisible: false,
      disableEditSuggest: false,
      isQJSFX:false,
      ruleForm: {
        rec: '',
        sub: '',
        confident: '',
        urgency: '',
        confidentiality: '',
        taskUserID: '',
        path: []
      },
      searchForm: {
        name: ''
      },
      rules: {
        rec: [
          { required: true, message: '请选择收件人' },

        ],
        taskUserID: [
          { required: true, message: '请选择呈报人' },

        ],
        sub: [
          { required: true, message: '请输入标题', trigger: 'blur,change' },
          // { min: 2, max: 5, message: '长度在 1 到 100 个字符之间', trigger: 'change' }
        ],
        path: [{ type: 'array', required: true, message: '请选择建议路径', trigger: 'blur,change' }],
      },
      isDefault: false,
      taskUserList: [],
      draftFirst: false,
      otherAdviceDoc,
      isAdmin: false,
      isfirst: true,
    }
  },
  computed: {
    personAdmin: function() {
      var temp = '';
      if (otherAdviceDoc.find(d => d == this.$route.params.code)) {
        if (this.userInfo.isTaskUser == 1) {
          temp = '1'
        } else {
          temp = '0'
        }
      } else if (this.$route.params.code == 'LZS') {
        temp = '0'
      } else if (this.isAdmin) {
        temp = '1';
      } else {
        temp = '0';
      }
      return temp
    },
    pathHtml: function() {
      var html = '起草' + arrowHtml + ' ';
      if (this.ruleForm.path.length != 0) {
        this.ruleForm.path.forEach((node, index) => {
          if (node.nodeName == 'sign' || node.nodeName == 'trans') {
            if (!node.children || node.children.length == 0) {
              html += node.typeIdName + ' ' + arrowHtml
            } else {
              node.children.forEach((child, childIndex) => {
                if (childIndex == 0) {
                  html += '#' + child.typeIdName + child.remark;
                  if (childIndex == node.children.length - 1) {
                    html += '# ' + arrowHtml
                  } else {
                    html += ' '
                  }
                } else if (childIndex == node.children.length - 1) {
                  html += child.typeIdName + child.remark + '# ' + arrowHtml;
                } else {
                  html += child.typeIdName + child.remark + ' '
                }
              })
            }
          } else {
            if (index != this.ruleForm.path.length - 1) {
              html += node.typeIdName + node.remark + arrowHtml
            } else {
              html += node.typeIdName + node.remark
            }
          }
        })
      }
      html += '归档'
      return html;
    },
    ...mapGetters([
      'userInfo',
      'confidentiality',
      'urgency',
      'baseForm',
      'selConfident',
      'selUrgency',
      'docTitle',
      'searchLoading',
      'searchRes',
      'reciver',
      'taskUser',
      'secretaryInfo'
    ])
  },
  watch: {
    reciverName: function(newVal) {
      if (newVal) {
        this.ruleForm.rec = newVal;
      }
    },
    taskUser: function(newval) {
      if (newval) {
        if (!this.$route.query.id || !this.isfirst) { //草稿箱第一次不调用建议路径模板
          this.getSuggestTemp();
        }
      }
    }
  },
  created() {
    this.getIsAdmin();
    this.$store.dispatch('getConfident');
    this.$store.dispatch('getUrgency');
    this.$store.dispatch('getAdminStatus');
    this.getTaskPerson();
    if (otherAdviceDoc.find(d => d == this.$route.params.code) != undefined) {
      this.getSecretaryInfo();
    }
  },
  methods: {
    getSecretaryInfo() {
      if (!this.secretaryInfo) {
        this.$http.post('doc/getSecInfo', { roleUserState: 0 })
          .then(res => {
            if (res.status == '0') {
              this.$store.commit('setSecretaryInfo', res.data);
            } else {

            }
          })
      }
    },
    changeTaskUser(val) {
      var user = this.taskUserList.find(t => (t.deptId + t.jobtitle) == val);
      if (user) {
        this.$store.commit('setTaskUser', user);
        if (!this.draftFirst) {
          this.getDefaultReciver();
        }
        this.draftFirst = false;
      }
    },
    selectPerson(val) {
      this.isDefault = val;
      this.dialogTableVisible = true;
    },
    updateCon(val) {
      var confident = this.confidentiality.find(ele => ele.dictName == val);
      this.$store.commit('setConfident', { docDenseType: confident.dictName, docDenseTypeCode: confident.dictCode })
    },
    updateUrgency(val) {
      var urgency = this.urgency.find(ele => ele.dictName == val);
      this.$store.commit('setUrgency', { docImportType: urgency.dictName, docImportTypeCode: urgency.dictCode })
    },
    updateTitle(val) {
      this.ruleForm.sub = val;
      this.$store.commit('setDocTtile', val)
    },
    updatePerson(reciver) {
      var temp = {
        "reciDeptMajorName": reciver.deptParentName,
        "reciDeptMajorId": reciver.deptParentId,
        "reciDeptName": reciver.depts,
        "reciDeptId": reciver.deptId,
        "reciUserName": reciver.name,
        "reciUserId": reciver.empId,
        "reciUserJobTitle": reciver.jobtitle, //接收人职位
        "reciEmpPostId": reciver.postId,
        "reciPostrankId": reciver.postrankId, //职位id
        "reciPostrankName": reciver.postRankName, //职级名称
        "reciSupervisory": reciver.supLevel //安全级别
      }
      this.$store.commit('setReciver', temp);
      this.dialogTableVisible = false;
      this.ruleForm.rec = temp.reciUserName+"-"+temp.reciDeptMajorName;
      if (this.isDefault) {
        this.setDefault(temp);
      }
    },
    returnT() {
      return true;
    },
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.checkSuggest()) {
            this.$store.commit('setSuggestPath', {suggests:this.handlePath(this.ruleForm.path)});
            this.$emit('submitStart', true);
          } else {
            this.$emit('submitStart', false);
          }
        } else {
          this.$message.warning('请检查填写字段')
          this.$emit('submitStart', false);
          return false;
        }
      });
    },
    saveForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.checkSuggest()) {
            this.$store.commit('setSuggestPath', {suggests:this.handlePath(this.ruleForm.path)});
            this.$emit('saveStart');
          } else {
            this.$store.commit('SET_SUBMIT_LOADING', false)
          }
        } else {
          this.$message.warning('请检查填写字段')
          this.$store.commit('SET_SUBMIT_LOADING', false)
          return false;
        }
      });
    },
    setDefault(person) {
      this.$http.post('/doc/updateDefaultRecipent', { docTypeCode: this.$route.params.code, empId: this.userInfo.empId, taskEmpPostId: this.taskUser.postId, reciId: person.reciUserId, reciEmpPostId: person.reciEmpPostId })
        .then(res => {
          if (res.status == 0) {
            this.$message.success('设置默认收件人成功！');
          } else {
            this.$message.error('设置默认收件人失败,' + res.message);
          }
        })
    },
    getTaskPerson() {
      this.$http.post('emp/getTaskUserList', { empId: this.userInfo.empId })
        .then(res => {
          if (res.status == 0) {
            this.draftFirst = this.$route.query.id != undefined;
            this.taskUserList = res.data;
            if (!this.$route.query.id) {
              this.ruleForm.taskUserID = res.data[0].deptId + res.data[0].jobtitle;
              this.$store.commit('setTaskUser', res.data[0]);
              // this.getDefaultReciver();
            }
          } else {

          }
        })
    },
    getDefaultReciver() {
      if(this.$route.params.code=="QJSFX"){
         this.$http.post('/doc/getFixDefaultRecipent', { docTypeCode: this.$route.params.code, empId: this.userInfo.empId, empPostId: this.taskUser.postId })
        .then(res => {
          if (res.status == 0) {
            if (res.data) {
              var receiver = {
                "reciDeptMajorName": res.data.majorDeptName,
                "reciDeptMajorId": res.data.majorDeptId,
                "reciDeptName": res.data.deptName,
                "reciDeptId": res.data.deptId,
                "reciUserName": res.data.name,
                "reciUserId": res.data.empId,
                "reciUserJobTitle": res.data.jobtitle, //接收人职位
                "reciPostrankId": res.data.postrankId, //职位id
                "reciEmpPostId": res.data.empPostId,
                "reciPostrankName": res.data.postrankName, //职级名称
                "reciSupervisory": res.data.supervisoryLevel //安全级别
              }
              this.$store.commit('setReciver', receiver);
              this.ruleForm.rec = res.data.name+"-"+res.data.majorDeptName;
              this.isQJSFX=true;
            } else {
              this.$store.commit('setReciver', '');
              this.ruleForm.rec = '';
            }
          } else {

          }
        })
      }else{
        this.$http.post('/doc/getDefaultRecipent', { docTypeCode: this.$route.params.code, empId: this.userInfo.empId, empPostId: this.taskUser.postId })
        .then(res => {
          if (res.status == 0) {
            if (res.data) {
              var receiver = {
                "reciDeptMajorName": res.data.reciDeptMajorName,
                "reciDeptMajorId": res.data.reciDeptMajorId,
                "reciDeptName": res.data.reciDeptName,
                "reciDeptId": res.data.reciDeptId,
                "reciUserName": res.data.reciUserName,
                "reciUserId": res.data.reciUserId,
                "reciUserJobTitle": res.data.reciJobtitle, //接收人职位
                "reciPostrankId": res.data.reciPostrankId, //职位id
                "reciEmpPostId": res.data.reciEmpPostId,
                "reciPostrankName": res.data.reciPostrankName, //职级名称
                "reciSupervisory": res.data.reciSupervisoryLevel //安全级别
              }
              this.$store.commit('setReciver', receiver);
              this.ruleForm.rec = res.data.reciUserName+"-"+res.data.reciDeptMajorName;
            } else {
              this.$store.commit('setReciver', '');
              this.ruleForm.rec = '';
            }
          } else {

          }
        })
      }
      
    },
    getIsAdmin() {
      this.$http.post('doc/isAdmin', { empId: this.userInfo.empId, docTypeCode: this.$route.params.code })
        .then(res => {
          if (res.status == '0') {
            if (res.data == 1) {
              this.isAdmin = true;
            }
          } else {

          }
        })
    },
    checkSuggest() {
      var success = true;
      if (!this.disableEditSuggest) {
        this.ruleForm.path.forEach((p, i, arr) => {
          if (p.type == 4 || p.type == 5) { //判断会签不能为空
            if (!p.children || p.children.length == 0) {
              this.$message.warning('建议路径内会签列表不能为空！');
              success = false
            } else if (i == 0) {
              this.$message.warning('建议路径不能以会签开始！');
              success = false
            } else if (i == arr.length - 1) {
              this.$message.warning('建议路径不能以会签结束！');
              success = false
            }
          } else {
            if (p.state && p.state == 1 && p.type != 7) {
              this.$message.warning('建议路径内'+p.typeIdName + '需替换！');
              success = false
            }
          }
        })
      }
      return success
    },
    updatePath(list) {
      this.ruleForm.path = this.clone(list);
      this.pathDialogVisible = false;
    },
    handlePath(list) {
      var _list = [];
      list.forEach((item, index, arr) => {
        var nodeName = '';
        if (index == 0) {
          nodeName = 'start';
        } else if (index == arr.length - 1) {
          nodeName = 'end';
        } else {
          nodeName = 'task';
        }
        if (item.nodeName == 'sign' || item.type == 4) {
          nodeName = 'sign';
          if (item.type == 4) {
            nodeName = 'trans';
          }
          item.children.forEach((child, i) => {
            _list.push({
              nodeId: index + 1 + '-' + i,
              nodeName: nodeName,
              typeId: child.typeId,
              typeIdName: child.typeIdName,
              type: child.type,
              docType: this.$route.params.code,
              remark: child.ramark
            })
          })
        } else {
          _list.push({
            nodeId: index + 1,
            nodeName: nodeName,
            typeId: item.typeId,
            typeIdName: item.typeIdName,
            type: item.type,
            docType: this.$route.params.code,
            remark: item.remark
          })
        }
      })
      return _list
    },
    getSuggestTemp(param) {
      this.$http.post('/doc/suggestTemplate', { docTypeCode: this.$route.params.code, userId: this.taskUser.empId, deptId: this.taskUser.deptParentId, docTypeSubCode: param })
        .then(res => {
          this.isfirst = false;
          if (res.status == 0) {
            this.disableEditSuggest = res.data.isEdit == 0 ? false : true;
            this.handleSuggestTemp(res.data.paths);
          } else {

          }
        })
    },
    handleSuggestTemp(arr) {
      var temp = [];
      var start;
      arr.forEach((s, index) => {
        if (s.type == 4 || s.type == 5) { //人员或部门会签
          s.nodeName = 'sign';
          s.children = [];
          temp.push(s);
        } else if (s.type == 7) {
          if (start) {
            start = 0;
          } else {
            start = index;
            s.nodeName = 'sign';
            s.children = [];
            temp.push(s);
          }
        } else {
          if (start) {
            temp[start].children.push(s);
          } else {
            temp.push(s);
          }
        }
      })
      this.ruleForm.path = temp;
    },
    ...mapMutations(['setConfident', 'setUrgency'])
  },

}

</script>
<style lang='scss'>
$main:#0460AE;
.docBaseBox {
  padding-right: 150px;
  .el-radio-button__inner {
    padding: 0;
    line-height: 45px;
    width: 99px;
  }
  .el-form-item__error {
    padding-left: 6px;
  }
  .selPerson {
    .el-input-group__append {
      i {
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
  }
  .maxText {
    position: absolute;
    right: 0;
    bottom: -18px;
    font-size: 12px;
    line-height: 1;
    color: #3F51B5;
  }
  .taskUserSel {
    .el-input.is-disabled .el-input__inner {
      color: #8492a6;
    }
  }
  .taskUserInfo {
    position: absolute;
    top: 6px;
    font-size: 13px;
    color: #8492a6;
    right: 31px;
  }
  .suggestPath {
    .pathBox {
      width: 88%;
      float: left;
      line-height: 20px;
      padding-top: 12px;
      .nodeBox {
        float: left;
        padding-right: 10px;
        .signList {
          color: #main;
          span {
            padding-right: 5px;
            &:last-of-type {
              padding-right: 0;
            }
          }
        }
      }
      i {
        padding-right: 10px;
        color: $main;
      }
    }
    .el-button {
      width: 12%;
      float: right;
      border-left: 1px solid #95989A;
      line-height: 30px;
      padding: 0;
      font-size: 15px;
      margin-top: 7px;
      text-align: right;
      i {
        margin-right: 5px;
      }
    }
  }
}

</style>
