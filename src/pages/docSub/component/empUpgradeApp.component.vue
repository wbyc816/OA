<template>
  <div class="empUpgradeApp">
    <el-form label-position="left" :model="upGradeForm" :rules="rules" ref="upGradeForm" label-width="128px">
      <el-form-item label="晋升员工" prop="emp">
        <el-input class="search" :readonly="true" :value="upGradeForm.emp.name">
          <el-button slot="append" @click='dialogVisible=true'>选择</el-button>
        </el-input>
      </el-form-item>
    </el-form>
    <person-dialog @updatePerson="updatePerson" :selfDisable="false" :visible.sync="dialogVisible"></person-dialog>
  </div>
</template>
<script>
import PersonDialog from '../../../components/personDialog.component'
import { mapGetters } from 'vuex'
export default {
  components: {PersonDialog},
  data() {
    var checkDept = (rule, value, callback) => {
      if (value.empId) {
        callback();
      } else {
        callback(new Error('请选择晋升员工'))
      }
    };
    return {
      upGradeForm: {
        emp: {
          empId: '',
          name:''
        }
      },
      rules: {
        emp: [{ type: 'object', required: true, trigger: 'blur' }],
      },
      params: '',
      dialogVisible:false
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
  },
  methods: {
    saveForm() {
      this.$emit('saveMiddle', JSON.stringify(this.upGradeForm));
    },
    getDraft(obj) {
      this.combineObj(this.upGradeForm, obj);
    },
    submitForm() {
      this.$refs.upGradeForm.validate((valid) => {
        if (valid) {
          this.params = {
            "empId": this.upGradeForm.emp.empId, //人员id
            "empName":this.upGradeForm.emp.name //人员
          }
          this.$emit('submitMiddle', this.params);
        } else {
          this.$message.warning('请检查填写字段')
          this.$emit('submitMiddle', false);
          return false;
        }
      });
    },
    updatePerson(reciver) {
      this.upGradeForm.emp.name = reciver.name;
      this.upGradeForm.emp.empId = reciver.empId;
      this.dialogVisible = false;
    },
  }
}

</script>
<style lang='scss'>
$main:#0460AE;
.empUpgradeApp {
  .el-input {
    width: 100%;
  }
}

</style>
