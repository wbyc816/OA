<template>
  <div class="empBecomeApp">
    <div class="empBox">
      <ul class="clearfix">
        <li><span class="itemTitle">部门</span><span class="text">{{emp.deptName}}</span></li>
        <li><span class="itemTitle">岗位</span><span class="text">{{emp.jobTitle}}</span></li>
        <!-- <li><span class="itemTitle">签订合同日期</span><span class="text">{{emp.conStartDate}}</span></li> -->
        <li>
          <span class="itemTitle">试用期</span>
          <span class="text">
            <template v-if="emp.pribationMonths">
            {{emp.pribationMonths}}个月
          </template>
        </span>
        </li>
        <li><span class="itemTitle">试用期开始日期</span><span class="text">{{emp.probationTime | time('ch')}}</span></li>
        <li><span class="itemTitle">试用期结束日期</span><span class="text">{{emp.probationEndTime | time('ch')}}</span></li>
      </ul>
    </div>
    <el-form label-position="left" :model="becomeForm" :rules="rules" ref="becomeForm" label-width="128px">
      <el-form-item label="试用期自我评价" prop="evaluation">
        <el-input type="textarea" :rows="8" resize='none' v-model="becomeForm.evaluation" :maxlength="100"></el-input>
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
      becomeForm: {
        evaluation: '',
      },
      rules: {
        evaluation: [{ required: true, message: '请填写试用期自我评价', trigger: 'blur' }],
      },
      params: '',
      emp: '',
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
    this.getEmp();
  },
  methods: {
    saveForm() {
      this.$emit('saveMiddle', JSON.stringify(this.becomeForm));
    },
    getDraft(obj) {
      this.becomeForm = obj;
    },
    submitForm() {
      this.$refs.becomeForm.validate((valid) => {
        if (valid) {
          this.params = {
            "evaluation": this.becomeForm.evaluation //试用期自我评价
          }
          this.$emit('submitMiddle', this.params);
        } else {
          this.$message.warning('请检查填写字段')
          this.$emit('submitMiddle', false);
          return false;
        }
      });
    },
    getEmp() {
      this.$http.post('/doc/empBecomeInfo', { empId: this.userInfo.empId }) //东航ID
        .then(res => {
          if (res.status == 0) {
            this.emp = res.data
          }
        })
    }
  }
}

</script>
<style lang='scss'>
$main:#0460AE;
.empBecomeApp {
  .el-input {
    width: 100%;
  }
  .empBox {
    position: relative;
    padding: 0 0 20px 20px;
    ul {
      li {
        width: 45%;
        float: left;
        line-height: 50px;
        font-size: 15px;
        .itemTitle {
          display: inline-block;
          color: $main;
          width: 130px;
        }
        &:nth-child(odd) {
          width: 55%;
        }
      }
    }
  }
}

</style>
