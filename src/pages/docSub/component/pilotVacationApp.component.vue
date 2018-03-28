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
        <el-select v-model="vacationForm.typeId" @change="typeChange" ref="typeId">
          <el-option v-for="item in types" :key="item.dictCode" :label="item.dictName"  :value="item.dictCode">
          </el-option>
        </el-select>
      </el-form-item>


      <el-form-item label="机长/副驾驶" prop="pilotType" class="deptArea">
        <el-select v-model="vacationForm.pilotType">
          <el-option v-for="item in pilotTypes" :key="item.dictCode" :label="item.dictName" :value="item.dictCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="飞行分部" prop="pilotDept" class="arrArea">
        <el-select v-model="vacationForm.pilotDept">
          <el-option v-for="item in pilotDepts" :key="item.dictCode" :label="item.dictName" :value="item.dictCode">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="工作交接情况" prop="workHandover" class="clearBoth">
        <el-input type="textarea" :rows="8" resize='none' v-model="vacationForm.workHandover" :maxlength="500"></el-input>
        <p  class="remainNum" style="{color:#ff4949}">最大不超过500字</p>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import util from '../../../common/util'
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
    var checkTimeline = (rule, value, callback) => {
      if (value.length > 0 &&value[0]&& value[0].getTime() == value[1].getTime()) {
        callback(new Error('开始时间不能等于结束时间'))
      } else {
        callback();
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
      ruleForm: {
        workHandover: '',
        attchment: [],
      },
      vacationForm: {
        typeId: '',
        workHandover: '',
        timeRange: [],
        days: '',
        pilotType:"",
        pilotDept:""
      },
      rules: {
        days: [{ required: true, message: '请输入休假天数', trigger: 'blur' },
          { validator: checkDay, trigger: 'change,blur' }
        ],
        timeRange: [{ type: 'array', required: true,  trigger: 'blur' },{validator: checkTimeline,trigger: 'blur,change'}],
        typeId: [{ required: true, message: '请选择休假类型', trigger: 'blur' }],
        workHandover: [{ required: true, message: '请填写工作交接情况', trigger: 'blur' }],
        pilotType: [{ required: true, message: '请选择飞行员种类', trigger: 'blur' }],
        pilotDept: [{ required: true, message: '请填写部门', trigger: 'blur' }],
      },
      pickerOptions0: {
        // disabledDate(time) {
        //   return time.getTime() < Date.now() - 8.64e7;
        // }
      },
      types: [],
      pilotTypes:[],
      pilotDepts:[],
      desLenth: 0,
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
      'userInfo',
    ])
  },
  created() {
    this.getTypes();
    this.getPilotTypes();
    this.getPilotDepts();
    this.getEmpVacation();
  },
  mounted() {
    // this.$emit('updateSuggest','DOC1001');
  },
  methods: {
    // checkworkHandover(rule, value, callback) {
    //   console.log(this.desLenth)
    //   if (this.desLenth == 0) {
    //     callback(new Error('请填写工作交接情况'))
    //   } else if (this.desLenth > 500) {
    //     callback(new Error('超出最大输入长度'))
    //   } else {
    //     callback();
    //   }
    // },
    // workHandoverChange(html) {
    //   this.ruleForm.workHandover = html;
    //   this.desLenth=html.length;
    // },
    // updateLen(num) {
    //   console.log(num)
    //   console.log(66)
    //   this.desLenth = num;
    //   this.$refs.ruleForm.validateField('workHandover')
    // },
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
            docFlightVacation: {
              docTypeCode:"QJSFX",
              "startDate":util.formatTime(this.vacationForm.timeRange[0], 'yyyy-MM-dd')   ,
              "endDate": util.formatTime(this.vacationForm.timeRange[1], 'yyyy-MM-dd'),
              "days": this.vacationForm.days,
              "typeCode": this.vacationForm.typeId,
              "typeName": this.$refs.typeId.selectedLabel,
              "role": this.vacationForm.pilotType,
              "branch": this.vacationForm.pilotDept,
              "handOver": this.vacationForm.workHandover,
              "startTime": util.formatTime(this.vacationForm.timeRange[0], 'hh:mm:ss'),
              "endTime": util.formatTime(this.vacationForm.timeRange[1], 'hh:mm:ss'),
              "year": new Date().getFullYear(),
              "yearDays": this.empVacation.annualDays,
              "lastYearDays": this.empVacation.annual1Days,
              "state": 1,
              "lastYear": (new Date().getFullYear())-1,
            }
          }
          this.$emit('submitMiddle', this.params);
        } else {
          this.$message.warning('请检查填写字段')
          this.$emit('submitMiddle', false);
          return false;
        }
      });
    },
    typeChange(){
      this.$refs.vacationForm.validateField('days')
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
     getPilotDepts() {
      this.$http.post('/api/getDict', { dictCode: 'EMP11' })
        .then(res => {
          if (res.status == 0) {
            this.pilotDepts = res.data;
          } else {
            console.log(res)
          }
        }, res => {})
    },
     getPilotTypes() {
      this.$http.post('/api/getDict', { dictCode: 'EMP10' })
        .then(res => {
          if (res.status == 0) {
            this.pilotTypes = res.data;
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
