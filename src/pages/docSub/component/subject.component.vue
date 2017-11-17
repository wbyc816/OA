<template>
  <div class="docBaseBox">
    <h4 class='doc-form_title'>基本信息</h4>
    <el-form label-position="left" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="128px">
      <!-- <el-form-item class='form-box' label="呈报人">
        <el-input class="search selPerson" v-model="ruleForm.rec" :readonly="true">
          <template slot="append">
            <el-button @click='selectPerson(false)'>选择</el-button>
            <i class="iconfont icon-renyuanshezhi" @click="selectPerson(true)"></i>
          </template>
        </el-input>
      </el-form-item> -->
      <el-form-item class='form-box' :label="reciverTtitle" prop="rec">
        <el-input class="search selPerson" v-model="ruleForm.rec" :readonly="true">
          <template slot="append">
            <el-button @click='selectPerson(false)'>选择</el-button>
            <i class="iconfont icon-renyuanshezhi" @click="selectPerson(true)"></i>
          </template>
        </el-input>
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
    <person-dialog @updatePerson="updatePerson" :selText="isDefault?'默认收件人':'收件人'" :visible.sync="dialogTableVisible" :admin="$route.params.code=='LZS'?'0':''"></person-dialog>
  </div>
</template>
<script>
import PersonDialog from '../../../components/personDialog.component'
import { mapGetters, mapMutations } from 'vuex'
export default {
  components: {
    PersonDialog
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
      ruleForm: {
        rec: '',
        sub: '',
        confident: '',
        urgency: '',
        confidentiality: '',
      },
      searchForm: {
        name: ''
      },
      rules: {
        rec: [
          { required: true, message: '请选择收件人' },

        ],
        sub: [
          { required: true, message: '请输入标题', trigger: 'blur,change' },
          // { min: 2, max: 5, message: '长度在 1 到 100 个字符之间', trigger: 'change' }
        ],
      },
      isDefault: false,

    }
  },
  computed: {
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
      'reciver'
    ])
  },
  watch: {
    reciverName: function(newVal) {
      if (newVal) {
        this.ruleForm.rec = newVal;
      }
    }
  },
  created() {
    this.$store.dispatch('getConfident');
    this.$store.dispatch('getUrgency');
    this.$store.dispatch('getAdminStatus');
  },
  methods: {
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
        "reciDeptMajorName": reciver.reciDeptMajorName,
        "reciDeptMajorId": reciver.reciDeptMajorId,
        "reciDeptName": reciver.reciDeptName,
        "reciDeptId": reciver.reciDeptId,
        "reciUserName": reciver.reciUserName,
        "reciUserId": reciver.reciUserId,
      }
      this.$store.commit('setReciver', temp);
      this.dialogTableVisible = false;
      this.ruleForm.rec = temp.reciUserName;
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
          this.$emit('submitStart', true);
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
          this.$emit('saveStart');
        } else {
          this.$message.warning('请检查填写字段')
          this.$store.commit('SET_SUBMIT_LOADING', false)
          return false;
        }
      });
    },
    setDefault(person) {
      this.$http.post('/doc/updateDefaultRecipent', { docTypeCode: this.$route.params.code, empId: this.userInfo.empId, taskDeptId: this.userInfo.deptId, reciId: person.reciUserId, reciDeptId: person.reciDeptId })
        .then(res => {
          if (res.status == 0) {
            this.$message.success('设置默认收件人成功！');
          } else {
            this.$message.error('设置默认收件人失败,' + res.message);
          }
        })
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
}

</style>
