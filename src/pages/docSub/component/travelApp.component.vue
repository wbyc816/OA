<template>
  <div class="travelApp">
    <el-form label-position="left" :model="travelForm" :rules="rules" ref="travelForm" label-width="128px">
      <el-form-item label="出差时间" prop="timeRange">
        <el-date-picker v-model="travelForm.timeRange" type="daterange" :editable="false" :clearable="false" style="width:100%" :picker-options="pickerOptions0"></el-date-picker>
      </el-form-item>
      <el-form-item label="出发地" prop="deptArea" class="deptArea">
        <el-input v-model="travelForm.deptArea" :maxlength="10">
        </el-input>
      </el-form-item>
      <el-form-item label="目的地" prop="arrArea" class="arrArea">
        <el-input v-model="travelForm.arrArea" :maxlength="10">
        </el-input>
      </el-form-item>
      <el-form-item label="出差人列表" prop="person" class="reciverWrap">
        <div class="reciverList">
          <el-tag :key="person.id" :closable="true" type="primary" @close="closePerson(index)" v-for="(person,index) in travelForm.person">
            {{person.name}}
          </el-tag>
        </div>
        <el-button class="addButton" @click="signDialogVisible=true"><i class="el-icon-plus"></i></el-button>
      </el-form-item>
      <el-form-item label="是否预订机票" prop="isBookFlight">
        <el-radio-group v-model="travelForm.isBookFlight" class="myRadio">
          <el-radio-button label="1">是<i></i></el-radio-button>
          <el-radio-button label="0">否<i></i></el-radio-button>
        </el-radio-group>
        <el-radio-group v-model="travelForm.bookType" class="myRadio bookType" v-show="travelForm.isBookFlight==1">
          <el-radio-button :label="bookType.dictCode" v-for="bookType in bookTypes">{{bookType.dictName}}<i></i></el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="报销归口" prop="budgetDept">
        <!-- <el-input class="search" :readonly="true" :value="travelForm.signName">
          <el-button slot="append" @click='signDialogVisible=true'>选择</el-button>
        </el-input> -->
        <el-cascader :clearable="true" :options="budgetDeptList" :props="defaultProp" v-model="travelForm.budgetDept" :show-all-levels="false" @active-item-change="handleItemChange" popper-class="myCascader" style="width:100%"></el-cascader>
      </el-form-item>
      <el-form-item label="出差总预算" prop="budgetMoney" class="budgetMoney">
        <el-input v-model="travelForm.budgetMoney" ref="budgetMoney" @change="fomatMoney" :maxlength="10" class="hasUnit" @blur="blurInput">
          <template slot="append">元</template>
        </el-input>
        <span class="usge">預算已使用率 75%</span>
      </el-form-item>
    </el-form>
    <person-dialog @updatePerson="updatePerson" dialogType="multi" :visible.sync="signDialogVisible"></person-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import PersonDialog from '../../../components/personDialog.component'
export default {
  components: { PersonDialog },
  data() {
    var checkDate = (rule, value, callback) => {
      if (value.every(val => val != null)) {
        callback();
      } else {
        callback(new Error('请选择出差时间'))
      }
    };
    var checkDept = (rule, value, callback) => {
      if (value[0]) {
        callback();
      } else {
        callback(new Error('请选择报销归口'))
      }
    };
    return {
      signDialogVisible: false,
      bookTypes:[],
      travelForm: {
        isBookFlight: '1',
        deptArea: '',
        arrArea: '',
        bookType: '',
        timeRange: [],
        budgetMoney: '',
        person: [],
        budgetDept: [],
      },
      rules: {
        isBookFlight: [{ required: true, trigger: 'blur' }],
        person: [{ type: 'array', required: true, message: '请选择出差人', trigger: 'blur' }],
        deptArea: [{ required: true, message: '请输入出发地', trigger: 'blur' }],
        arrArea: [{ required: true, message: '请输入目的地', trigger: 'blur' }],
        budgetMoney: [{ required: true, message: '请输入出差总预算', trigger: 'blur' }],
        timeRange: [{ type: 'array', required: true, validator: checkDate, trigger: 'blur' }],
        budgetDept: [{ type: 'array', required: true, validator: checkDept, trigger: 'blur' }],
      },
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      budgetDeptList: [],
      params: '',
      defaultProp: {
        label: 'budgetItemName',
        value: 'budgetItemCode',
        children: 'items'
      },
    }
  },
  computed: {
    ...mapGetters([
      'sumitLoading',
      'baseURL'
    ])
  },
  created() {
    this.getBudgetDeptList();
    this.getBookType();
  },
  methods: {
    updatePerson(list) {
      // console.log(list)
      this.travelForm.person = list
      this.signDialogVisible = false;
    },
    submitForm() {
      var that = this;
      this.$refs.travelForm.validate((valid) => {
        if (valid) {
          var dep=this.getBudgetDep();
          this.params = {
            app: {
              "startTime": this.travelForm.timeRange[0].getTime(), //出差开始时间
              "endTime": this.travelForm.timeRange[1].getTime(), //出差结束时间
              "deptArea": this.travelForm.deptArea, //出发地
              "arrArea": this.travelForm.arrArea, //目的地
              "isBookFlight": this.travelForm.isBookFlight, //是否预订机票 0否 1是
              "bookType": this.travelForm.bookType, //预定类型
              "budgetMoney": this.travelForm.budgetMoney, //预算
              "budgetItemCode": dep.budgetItemCode, //报销科目code
              "budgetItemName": dep.budgetItemName, //报销科目名称
              "budgetDeptCode": dep.budgetDeptCode, //报销部门
              "budgetDeptName": dep.budgetDeptName, //报销部门名称
              "appPerson": this.travelForm.person.map(function(person) {
                return {
                  "travelUserName": person.name, //随行人员姓名
                  "travelDeptId": person.deptId, //部门id
                  "travelDeptName": person.depts, //部门名称
                  "travelDeptMajorId": person.deptId, //主部门id
                  "travelDeptMajorName": person.deptName, //主部门名称
                }
              })
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
    closePerson(index) {
      this.travelForm.person.splice(index, 1);
    },
    fomatMoney(val) {
      val = val.toString().match(/^\d+(?:\.\d{0,2})?/);
      if (val) {
        this.travelForm.budgetMoney = val[0];
        this.$refs.budgetMoney.setCurrentValue(val[0]);
      } else {
        this.travelForm.budgetMoney = ''
        this.$refs.budgetMoney.setCurrentValue('')
      }
    },
    getBudgetDeptList() {
      this.$http.post('/doc/getBudItemTreeList')
        .then(res => {
          if (res.status == 0) {
            res.data.forEach(i => i.isParent == 1 ? i.items = [] : i.items = null)
            this.budgetDeptList = res.data
          } else {
            console.log(res)
          }
        }, res => {})
    },
    handleItemChange(val) {
      var len = val.length;
      var temp = this.budgetDeptList;
      var i = 0;
      while (len > i) {
        temp = temp.find(dep => dep.budgetItemCode == val[i]).items;
        i++
      }
      if (temp.length == 0) {
        this.$http.post('/doc/getBudItemTreeList', { parentId: val[val.length - 1] })
          .then(res => {
            if (res.status == 0) {
              res.data.forEach(i => {
                i.isParent == 1 ? i.items = [] : i.items = null
                temp.push(i)
              })
            }
          })
      }
    },
    getBookType(){
      this.$http.post('/api/getDict',{dictCode:'ADM05'})
      .then(res=>{
        if(res.status==0){
          this.bookTypes=res.data;
          this.travelForm.bookType=this.bookTypes[0].dictCode
        }
      })
    },
    getBudgetDep(){
      var len=this.travelForm.budgetDept.length;
      var temp=this.budgetDeptList;
      for(var i=0;i<len;i++){
        temp=temp.find(dep=>dep.budgetItemCode==this.travelForm.budgetDept[i]);
        if(temp.items&&temp.items.length!=0){
          temp=temp.items;
        }
      }
      return temp;
    },
    blurInput(event){
      console.log(event)
      var temp=event.target.value.split('.');
      if(temp.length==2&&(temp[1]==undefined||temp[1]==''||temp[1]==null)){
        this.travelForm.budgetMoney = temp[0];
        this.$refs.budgetMoney.setCurrentValue(temp[0]);
      }
    }
  }
}

</script>
<style lang='scss'>
$main:#0460AE;
.travelApp {
  .el-input {
    width: 100%;
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
  .myRadio {
    .el-radio-button__inner {
      padding: 0;
      line-height: 45px;
      width: 99px;
    }
  }
  .usge {
    color: $main;
    vertical-align: text-top;
  }
  .bookType {
    float: right;
    .el-radio-button__inner {
      width: 140px;
    }
    .el-radio-button {
      margin-right: 0;
      &:nth-child(2) {
        margin-left: 15px;
      }
    }
  }
  .budgetMoney {
    .el-input {
      width: 40%;
    }
  }
}

</style>
