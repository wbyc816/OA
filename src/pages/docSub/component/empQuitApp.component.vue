<template>
  <div class="quitApp">
    <el-form label-position="left" :model="quitForm" :rules="rules" ref="quitForm" label-width="128px">
      <el-form-item label="预计离职日期" prop="planDimissionDate" class="deptArea">
        <el-date-picker v-model="quitForm.planDimissionDate" type="date" :editable="false" :clearable="false" style="width:100%" :picker-options="pickerOptions0"></el-date-picker>
      </el-form-item>
      <el-form-item label="离职理由" prop="dimissionReasonCode" class="arrArea">
        <el-select v-model="quitForm.dimissionReasonCode" ref="reason">
          <el-option v-for="item in types" :key="item.dictCode" :label="item.dictName" :value="item.dictCode">
          </el-option>
        </el-select>
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
      quitForm: {
        planDimissionDate: '',
        dimissionReasonCode: ''
      },
      rules: {
        planDimissionDate: [{ type: 'date',message: '请选择预计离职日期',required: true, trigger: 'blur' }],
        dimissionReasonCode: [{ required: true, message: '请选择离职理由', trigger: 'blur' }],
      },
      pickerOptions0: {
        disabledDate(time) {
          // return time.getTime() < Date.now() - 8.64e7;
        }
      },
      types: [],
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
    this.getTypes();
  },
  methods: {
    saveForm() {
      this.$emit('saveMiddle',JSON.stringify(this.quitForm));
    },
    getDraft(obj) {
      this.combineObj(this.quitForm,obj,['planDimissionDate']);
      if(obj.planDimissionDate){
        this.quitForm.planDimissionDate=new Date(obj.planDimissionDate)
      }
    },
    submitForm() {
      this.$refs.quitForm.validate((valid) => {
        if (valid) {
          var params = {
            dimission: {
              "planDimissionDate": +this.quitForm.planDimissionDate,
              "dimissionReasonCode": this.quitForm.dimissionReasonCode,
              "dimissionReasonName": this.$refs.reason.selectedLabel,
            }
          }
          this.$emit('submitMiddle', params);
        } else {
          this.$message.warning('请检查填写字段')
          this.$emit('submitMiddle', false);
          return false;
        }
      });
    },
    getTypes() {
      this.$http.post('/api/getDict', { dictCode: 'EMP09' })
        .then(res => {
          if (res.status == 0) {
            this.types = res.data;
          } else {
            console.log(res)
          }
        }, res => {})
    },
  }
}

</script>
<style lang='scss'>
$main:#0460AE;
.quitApp {
  .vacationInfo {
    line-height: 54px;
    background: #F7F7F7;
    font-size: 15px;
    position: relative;
    margin-bottom: 30px;
    &:before {
      display: block;
      content: '';
      height: 100%;
      left: 50%;
      top: 0;
      position: absolute;
      border-left: 1px solid #D5DADF;
    }
    .infoBox {
      float: left;
      width: 27%;
      padding-left: 20px;
      span {
        padding-left: 20px;
      }
      &.remain {
        color: $main;
        width: 23%;
        position: relative;
        &:before {
          content: '';
          height: 27px;
          left: 0;
          top: 50%;
          margin-top: -14px;
          position: absolute;
          border-left: 1px solid #D5DADF;
        }
      }
    }
  }
  .el-input {
    width: 100%;
  }
  .deptArea,
  .arrArea {
    float: left;
    width: 50%;
  }
  .arrArea {
    .el-form-item__label {
      padding-left: 36px;
    }
  }
}

</style>
