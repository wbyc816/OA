<template>
  <div class="empTrainingApp">
    <el-form label-position="left" :model="trainingForm" :rules="rules" ref="trainingForm" label-width="128px">
      <el-form-item label="参训部门/处室" prop="deps">
        <el-cascader expand-trigger="hover" :options="depList" :props="defaultProp" v-model="trainingForm.deps" style="width:100%" popper-class="myCascader">
        </el-cascader>
      </el-form-item>
      <el-form-item label="参训人" prop="person" class="reciverWrap">
        <div class="reciverList">
          <el-tag :key="person.id" :closable="true" type="primary" @close="closePerson(index)" v-for="(person,index) in trainingForm.person">
            {{person.name}}
          </el-tag>
        </div>
        <el-button class="addButton" @click="dialogVisible=true"><i class="el-icon-plus"></i></el-button>
      </el-form-item>
      <el-form-item label="参训日期" prop="timeRange" class="deptArea">
        <el-date-picker v-model="trainingForm.timeRange" type="daterange" :editable="false" :clearable="false" style="width:100%" :picker-options="pickerOptions0"></el-date-picker>
      </el-form-item>
      <el-form-item label="培训科目" prop="trainSubjects" class="arrArea" label-width="100px">
        <el-input v-model="trainingForm.trainSubjects" :maxlength="25">
        </el-input>
      </el-form-item>
      <el-form-item label="培训总预算" prop="trainTotalCost" class="deptArea">
        <money-input v-model="trainingForm.trainTotalCost"  :prepend="false" :default0="true" @change="$refs.trainingForm.validateField('trainPerCost')">
          <template slot="append">元</template>
        </money-input>
      </el-form-item>
      <el-form-item label="单人培训差旅费" prop="trainPerTravelCost" class="arrArea" label-width="138px">
        <money-input v-model="trainingForm.trainPerTravelCost"  :prepend="false"  @change="changeTravelCost">
          <template slot="append">元</template>
        </money-input>
      </el-form-item>
      <el-form-item label="单人培训费用" prop="trainPerTrainlCost" class="deptArea" >
        <money-input v-model="trainingForm.trainPerTrainlCost"  :prepend="false"  @change="changeTrainlCost">
          <template slot="append">元</template>
        </money-input>
      </el-form-item>
      <el-form-item label="单人预算总费用" prop="trainPerCost" class="arrArea" label-width="138px" >
        <money-input v-model="trainingForm.trainPerCost" :prepend="false" :readonly="true">
          <template slot="append">元</template>
        </money-input>
      </el-form-item>
      <el-form-item label="参训人数" prop="trainPerCount" class="deptArea" >
        <money-input v-model="trainingForm.trainPerCount" :prepend="false" :append="false">
        </money-input>
      </el-form-item>
    </el-form>
    <person-dialog @updatePerson="updatePerson" :data="trainingForm.person" dialogType="multi" :visible.sync="dialogVisible"></person-dialog>
  </div>
</template>
<script>
import MoneyInput from '../../../components/moneyInput.component'
import PersonDialog from '../../../components/personDialog.component'
import { mapGetters } from 'vuex'
export default {
  components: { PersonDialog, MoneyInput },
  data() {
    var checkDept = (rule, value, callback) => {
      if (value[0]) {
        callback();
      } else {
        callback(new Error('参训部门/处室'))
      }
    }
    var checkMoney = (rule, value,callback) => {
      if (parseFloat(value) <= parseFloat(this.trainingForm.trainTotalCost)) {
        callback();
      }else if(value==0){
        callback();
      } 
      else {
        callback(new Error('单人预算不能大于总预算'))
      }
    }
    return {
      dialogVisible: false,
      trainingForm: {
        person: [],
        trainSubjects: '',
        deps: [],
        timeRange: [],
        trainTotalCost: '',
        trainPerCost: '',
        trainPerTrainlCost:"",
        trainPerTravelCost:"",
        trainPerCount:''
      },
      rules: {
        trainTotalCost: [{ required: true, message: '请输入培训总预算', trigger: 'blur' }],
        trainPerCost: [
        {validator: checkMoney, trigger: 'blur,change'}],
        trainPerTrainlCost: [{ required: true, message: '请输入培训费用', trigger: 'blur' }],
        trainPerCount: [{ required: true, message: '请输入参训人数', trigger: 'blur' }],
        trainPerTravelCost: [{ required: true, message: '请输入培训差旅费用', trigger: 'blur' }],
        person: [{ type: 'array', required: true, message: '请选择培训人', trigger: 'blur' }],
        timeRange: [{ type: 'array', required: true, message: '请选择培训日期', trigger: 'blur' }],
        trainSubjects: [{ required: true, message: '请输入培训科目', trigger: 'blur' }],
        deps: [{ type: 'array', required: true, validator: checkDept, trigger: 'blur' }],
      },
      params: '',
      depList: [],
      defaultProp: {
        value: 'id',
        label: 'name',
        children: 'childNode'
      },
      pickerOptions0: {
        
      },
    }
  },
  computed: {
    ...mapGetters([
      'submitLoading',
      'baseURL',
      'userInfo',
      'DHId'
    ])
  },
  created() {
    this.getDepList();
  },
  methods: {
    saveForm() {
      this.$emit('saveMiddle',JSON.stringify(this.trainingForm));
    },
    getDraft(obj) {
      this.combineObj(this.trainingForm,obj,['timeRange']);
      obj.timeRange.forEach(t=>{
        this.trainingForm.timeRange.push(new Date(t));
      })
    },
    updatePerson(list) {
      // console.log(list)
      this.trainingForm.person = list
      this.dialogVisible = false;
    },
    submitForm() {
      this.$refs.trainingForm.validate((valid) => {
        if (valid) {
          this.params = {
            "train": {
              "trainPerTrainlCost": this.trainingForm.trainPerTrainlCost, //培训费用
              "trainPerTravelCost": this.trainingForm.trainPerTravelCost, //培训差旅费用
              "trainDeptId": this.trainingForm.deps[this.trainingForm.deps.length - 1], //最后一级部门id
              "trainDeptMajorId": this.trainingForm.deps[0], //第一级部门id
              "trainDate": this.trainingForm.timeRange[0].getTime(), //培训开始时间
              "trainTotalCost": this.trainingForm.trainTotalCost, //培训总预算
              "trainPerCost": this.trainingForm.trainPerCost, //培训单人预算
              "trainEndDate": this.trainingForm.timeRange[1].getTime(), //培训结束时间
              "trainSubjects": this.trainingForm.trainSubjects, //培训科目
              "trainPerCount": this.trainingForm.trainPerCount //参训人数
            },
            "trainPersons": this.trainingForm.person.map(function(person) {
              return {
                "trainEmpName": person.name, //随行人员姓名
                "trainEmpId": person.empId, //人员id
              }
            })
          }
          this.$emit('submitMiddle', this.params);
        } else {
          this.$message.warning('请检查填写字段')
          this.$emit('submitMiddle', false);
          return false;
        }
      });
    },
    changeTravelCost(){
      this.trainingForm.trainPerCost=(Number(this.trainingForm.trainPerTrainlCost)+Number(this.trainingForm.trainPerTravelCost)).toFixed(2);
    },
    changeTrainlCost(){
      this.trainingForm.trainPerCost=(Number(this.trainingForm.trainPerTrainlCost)+Number(this.trainingForm.trainPerTravelCost)).toFixed(2);
    },
    getDepList() {
      function loopMap(arr) {
        arr.forEach(function(dep) {
          if (dep.childNode.length == 0) {
            dep.childNode = null
          } else {
            loopMap(dep.childNode)
          }
        })
      }
      this.$http.post('/dept/selectDeptOrgByDeptId', { deptId: this.DHId }) //东航ID
        .then(res => {
          if (res.status == 0) {
            loopMap(res.data.deptList[0].childNode)
            this.depList = res.data.deptList[0].childNode
          }
        })
    },
    closePerson(index) {
      this.trainingForm.person.splice(index, 1);
    },
    blurInput(event) {
      var temp = event.target.value.split('.');
      if (temp.length == 2 && (temp[1] == undefined || temp[1] == '' || temp[1] == null)) {
        this.trainingForm.trainTotalCost = temp[0];
        this.$refs.trainTotalCost.setCurrentValue(temp[0]);
      }
    },
    blurInput1(event) {
      var temp = event.target.value.split('.');
      if (temp.length == 2 && (temp[1] == undefined || temp[1] == '' || temp[1] == null)) {
        this.trainingForm.trainPerCost = temp[0];
        this.$refs.trainPerCost.setCurrentValue(temp[0]);
      }
    },
    fomatTotal(val) {
      val = val.toString().match(/^\d+(?:\.\d{0,2})?/);
      if (val) {
        this.trainingForm.trainTotalCost = val[0];
        this.$refs.trainTotalCost.setCurrentValue(val[0]);
      } else {
        this.trainingForm.trainTotalCost = '';
        this.$refs.trainTotalCost.setCurrentValue('')
      }
    },
    fomatPer(val) {
      val = val.toString().match(/^\d+(?:\.\d{0,2})?/);
      if (val) {
        this.trainingForm.trainPerCost = val[0];
        this.$refs.trainPerCost.setCurrentValue(val[0]);
      } else {
        this.trainingForm.trainPerCost = '';
        this.$refs.trainPerCost.setCurrentValue('')
      }
    },
  }
}

</script>
<style lang='scss'>
$main:#0460AE;
.empTrainingApp {
  .el-input {
    width: 100%;
  }
  .deptArea,
  .arrArea {
    float: left;
    width: 55%;
  }
  .arrArea {
    width: 45%;
    .el-form-item__label {
      padding-left: 18px;
    }
  }
  .reciverWrap {
    clear: both;
    .el-form-item__content {
      display: flex;
    }
    .reciverList {
      flex: 1;
      .el-tag {
        margin-right: 5px;
      }
    }
    .addButton {
      right: 0;
    }
  }
}

</style>
