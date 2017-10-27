<template>
  <div class="docBaseBox">
    <h4 class='doc-form_title'>基本信息</h4>
    <el-form label-position="left" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="128px">
      <el-form-item class='form-box' :label="reciverTtitle" prop="rec">
        <el-input class="search" v-model="ruleForm.rec" :readonly="true">
          <el-button slot="append" @click='selectPerson'>选择</el-button>
        </el-input>
      </el-form-item>
      <el-form-item class='form-box' label="标题" prop="sub">
        <el-input :value="docTitle" @input="updateTitle" :maxlength="50">
        </el-input>
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
    <person-dialog @updatePerson="updatePerson" :visible.sync="dialogTableVisible"></person-dialog>
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
    reciverName:{
      type:String,
      default:''
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
  watch:{
    reciverName:function(newVal){
      if(newVal){
        this.ruleForm.rec=newVal;
      }
    }
  },
  created() {
    this.$store.dispatch('getConfident');
    this.$store.dispatch('getUrgency');
    this.$store.dispatch('getAdminStatus');
  },
  methods: {
    selectPerson: function() {
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
      this.$store.commit('setReciver', reciver);
      this.dialogTableVisible = false;
      this.ruleForm.rec = reciver.reciUserName;
    },
    returnT() {
      return true;
    },
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          console.log(2);
          this.$emit('submitStart', true);
        } else {
          this.$message.warning('请检查填写字段')
          this.$emit('submitStart', false);
          return false;
        }
      });
    },
    ...mapMutations(['setConfident', 'setUrgency'])
  },

}

</script>
<style lang='scss'>
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
}

</style>
