<template>
  <div class="vacationApp">
    <div class="vacationInfo clearfix">
      <div class="infoBox">上年度休假天数<span>{{empVacation.annual1Days}}</span></div>
      <div class="infoBox remain">剩余<span>{{empVacation.preQuarterdDays-empVacation.annual1Days}}</span></div>
      <div class="infoBox">本年度休假天数<span>{{empVacation.annualDays}}</span></div>
      <div class="infoBox remain">剩余<span>{{empVacation.currentSeasonDays-empVacation.annualDays}}</span></div>
    </div>
    <el-form label-position="left" :model="vacationForm" :rules="rules" ref="vacationForm" label-width="128px">
      <el-form-item label="休假时间" prop="timeRange">
        <el-date-picker v-model="vacationForm.timeRange" type="datetimerange" :editable="false" :clearable="false" style="width:100%" :picker-options="pickerOptions0"></el-date-picker>
      </el-form-item>
      <el-form-item label="休假天数" prop="days" class="deptArea">
        <el-input v-model="vacationForm.days" ref="days" @change="fomatDays" :maxlength="6" class="hasUnit" @blur="blurInput">
          <template slot="append">天</template>
        </el-input>
      </el-form-item>
      <el-form-item label="类型" prop="typeId" class="arrArea">
        <el-select v-model="vacationForm.typeId">
          <el-option v-for="item in types" :key="item.dictCode" :label="item.dictName" :value="item.dictCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="工作交接情况" prop="workHandover" class="clearBoth">
        <el-input type="textarea" :rows="8" resize='none' v-model="vacationForm.workHandover" :maxlength="100"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  components: {},
  data() {
    var checkDate = (rule, value, callback) => {
      if (value.every(val => val != null)) {
        callback();
      } else {
        callback(new Error('请选择休假时间'))
      }
    };
    var checkDay = (rule, value, callback) => {
      var remain = this.empVacation.currentSeasonDays - this.empVacation.annual1Days + this.empVacation.preQuarterdDays - this.empVacation.annualDays
      if (this.vacationForm.typeId == 'EMP0101') {
        if (parseFloat(value) && parseFloat(value) <= remain) {
          callback();
        } else {
          callback(new Error('休假天数不能大于剩余总天数'))
        }
      } else {
        callback();
      }
    };
    return {
      vacationForm: {
        typeId: '',
        workHandover: '',
        timeRange: [],
        days: '',
      },
      rules: {
        days: [{ required: true, message: '请输入休假天数', trigger: 'blur' },
          { validator: checkDay, trigger: 'change,blur' }
        ],
        timeRange: [{ type: 'array', required: true, validator: checkDate, trigger: 'blur' }],
        typeId: [{ required: true, message: '请选择休假类型', trigger: 'blur' }],
        workHandover: [{ required: true, message: '请填写工作交接情况', trigger: 'blur' }],
      },
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      types: [],
      params: '',
      empVacation: {
        "preQuarterdDays": 0,
        "currentSeasonDays": 0,
        "annual1Days": 0,
        "annualDays": 0
      }
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
    this.getEmpVacation();
  },
  mounted() {
    this.$emit('updateSuggest','DOC1001');
  },
  methods: {
    saveForm() {
      this.$emit('saveMiddle',JSON.stringify(this.vacationForm));
    },
    getDraft(obj) {
      this.combineObj(this.vacationForm,obj,['timeRange']);
      obj.timeRange.forEach(t=>{
        this.vacationForm.timeRange.push(new Date(t));
      })
    },
    submitForm() {
      this.$refs.vacationForm.validate((valid) => {
        if (valid) {
          this.params = {
            vacationRecords: [{
              "beginTime": this.vacationForm.timeRange[0], //开始时间
              "endTime": this.vacationForm.timeRange[1], //结束时间
              "annual": new Date().getFullYear(), //年度
              "days": this.vacationForm.days, //本次休假天数
              "typeId": this.vacationForm.typeId, //类型
              "workHandover": this.vacationForm.workHandover, //工作交接
            }]
          }
          this.$emit('submitMiddle', this.params);
        } else {
          this.$message.warning('请检查填写字段')
          this.$emit('submitMiddle', false);
          return false;
        }
      });
    },
    fomatDays(val) {
      val = val.toString().match(/^\d+(?:\.\d{0,1})?/);
      if (val) {
        this.vacationForm.days = val[0];
        this.$refs.days.setCurrentValue(val[0]);
      } else {
        this.vacationForm.days = ''
        this.$refs.days.setCurrentValue('')
      }
    },
    getTypes() {
      this.$http.post('/api/getDict', { dictCode: 'EMP01' })
        .then(res => {
          if (res.status == 0) {
            this.types = res.data;
          } else {
            console.log(res)
          }
        }, res => {})
    },
    getEmpVacation() {
      this.$http.post('/emp/empVacationDays', { empId: this.userInfo.empId })
        .then(res => {
          if (res.status == 0) {
            this.empVacation = res.data;
          } else {
            console.log(res)
          }
        }, res => {})
    },
    blurInput(event) {
      var temp = event.target.value.split('.');
      if (temp.length == 2 && (temp[1] == undefined || temp[1] == '' || temp[1] == null)) {
        this.vacationForm.days = temp[0];
        this.$refs.days.setCurrentValue(temp[0]);
      }
    }
  }
}

</script>
<style lang='scss'>
$main:#0460AE;
.vacationApp {
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
