<template>
  <div class="injuryApp">
    <el-form label-position="left" :model="injuryForm" :rules="rules" ref="injuryForm" label-width="128px">
      <el-form-item label="受伤日期" prop="injuryDate">
        <el-date-picker v-model="injuryForm.injuryDate" type="date" :editable="false" :clearable="false" style="width:100%"></el-date-picker>
      </el-form-item>
      <el-form-item label="医院" prop="hospital">
        <el-input v-model="injuryForm.hospital"  :maxlength="50">
        </el-input>
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
      injuryForm: {
        hospital: '',
        injuryDate: '',
      },
      rules: {
        hospital: [{ required: true, message: '请输入医院', trigger: 'blur' }],
        injuryDate: [{ type: 'date', required: true,  message: '请选择受伤日期', trigger: 'blur' }],
      },
      params: '',
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
      this.$emit('saveMiddle', JSON.stringify(this.injuryForm));
    },
    getDraft(obj) {
      this.combineObj(this.injuryForm, obj, ['injuryDate']);
      if (obj.injuryDate) {
        this.injuryForm.injuryDate = new Date(obj.injuryDate);
      }
    },
    submitForm() {
      var that = this;
      this.$refs.injuryForm.validate((valid) => {
        if (valid) {
          this.params = {
              "injuryDate": this.injuryForm.injuryDate.getTime(), //受伤日期
              "hospital": this.injuryForm.hospital, //医院
          }
          this.$emit('submitMiddle', this.params);
        } else {
          this.$message.warning('请检查填写字段')
          this.$emit('submitMiddle', false);
          return false;
        }
      });
    }
  }
}

</script>
<style lang='scss'>
$main:#0460AE;
.injuryApp {
  .el-input {
    width: 100%;
  }
}

</style>
