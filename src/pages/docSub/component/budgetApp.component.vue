<template>
  <div class="budgetApp">
    <el-form label-position="left" :model="budgetForm" :rules="rules" ref="budgetForm" label-width="128px">
      <el-form-item label="申请类型" prop="type" class="deptArea">
        <el-select v-model="budgetForm.type" value-key="dictCode" @change="typeChange">
          <el-option v-for="item in types" :label="item.dictName" :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <template v-if="!budgetForm.type||budgetForm.type.dictCode!=='DOC2602'">
        <el-form-item label="预算年份" class="deptArea year">
          {{year}}
        </el-form-item>
        <el-form-item label="预算机构/科目" prop="budgetDept" class="clearBoth">
          <div>
            <el-cascader :clearable="true" :options="budgetDeptList" :props="defaultProp" v-model="budgetForm.budgetDept" @active-item-change="handleItemChange" filterable @change="changeDept" popper-class="myCascader" class="budgetDept" ref="budgetDept"></el-cascader>
          </div>
        </el-form-item>
        <div class="change_data" v-show="showData==1">
          <ul>
            <li>年度预算{{yearBudget}}元</li>
            <li>可用预算{{useBudget}}元</li>
            <li>预算执行比例{{execRateStr}}</li>
          </ul>
        </div>
        <el-form-item label="申报金额" prop="budgetMoney" class="budgetMoney">
          <el-col :span="12" class="clearPadding input">
            <el-input ref="budgetMoney" @change="fomatMoney" :maxlength="10" class="hasUnit" @blur="blurInput">
              <template slot="append">元</template>
            </el-input>
          </el-col>
          <el-col :span="5" class="clearPadding btn">
            <el-button @click='addBudget' type="primary" class="addbutton1"><i class="el-icon-plus"></i> 添加</el-button>
          </el-col>
        </el-form-item>
      </template>
    </el-form>
    <div style="width:750px;margin-bottom:20px;" v-show="!budgetForm.type||budgetForm.type.dictCode!=='DOC2602'">
      <el-table :data="budgetTable" :stripe="true" highlight-current-row class="appTable">
        <el-table-column label=" " width="50" class-name="upDown">
          <template scope="scope">
            <span v-if="parseFloat(scope.row.budgetMoney)>0" style="background:rgb(72, 153, 223)">调增</span>
            <span v-else style="background:#FF8460">调减</span>
          </template>
        </el-table-column>
        <el-table-column property="budgetDept" label="预算机构"></el-table-column>
        <el-table-column property="useBudget" label="可用额度(元)" width="150"></el-table-column>
        <el-table-column property="execRateStr" label="执行比例" width="100"></el-table-column>
        <el-table-column property="budgetMoney" label="申报额度(元)" width="150"></el-table-column>
        <el-table-column label="操作" width="55">
          <template scope="scope">
            <el-button @click.native.prevent="deleteRow(scope.$index)" type="text" size="small" icon="delete">
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <p class="totalMoney">合计金额 人民币 <span>{{totalMoney | toThousands}}元 {{totalMoney | moneyCh}}</span></p>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import util from '../../../common/util'
export default {
  components: {},
  data() {
    var checkDate = (rule, value, callback) => {
      if (value) {
        callback();
      } else {
        callback(new Error('请选择预算年份'))
      }
    };
    var checkDept = (rule, value, callback) => {
      if (value[0]) {
        callback();
      } else {
        callback(new Error('请选择预算机构/科目'))
      }
    };
    return {
      val2: "",
      bookTypes: [],
      budgetDate: {},
      showData: 0,
      yearBudget: 0,
      useBudget: 0,
      execRateStr: "0%",
      budgetForm: {
        isBookFlight: '1',
        deptArea: '',
        arrArea: '',
        bookType: '',
        timeRange: "",
        // year: new Date(),
        budgetMoney: '',
        person: [],
        budgetDept: [],
        budgetDate: {},
        type: {
          dictCode:"DOC2601"
        }
      },
      rules: {
        // isBookFlight: [{ required: true, trigger: 'blur' }],
        // person: [{ type: 'array', required: true, message: '请选择出差人', trigger: 'blur' }],
        // deptArea: [{ required: true, message: '请输入出发地', trigger: 'blur' }],
        // arrArea: [{ required: true, message: '请输入目的地', trigger: 'blur' }],
        budgetMoney: [{ required: true, message: '请输入申报金额', trigger: 'blur' }],
        type: [{ type: 'object', required: true, message: '请选择申请类型', trigger: 'blur' }],
        // year: [{  required: true, validator: checkDate, trigger: 'blur' }],
        budgetDept: [{ type: 'array', required: true, message: '请输入预算机构/科目', trigger: 'blur' }],
      },
      budgetTable: [],
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
      types: [],
    }
  },
  computed: {
    totalMoney() {
      var num = 0;
      if (this.budgetTable.length != 0) {
        this.budgetTable.forEach(b => {
          if (b.budgetMoney) {
            num += Number(b.budgetMoney);
          }
        })
      }
      return parseFloat(this.numFixed2(num))
    },
    ...mapGetters([
      'submitLoading',
      'baseURL',
      'year'
    ])
  },
  created() {
    this.getTypes();
    this.getBookType();
    this.getBudgetDeptList();
  },
  methods: {
    // saveForm() {
    //   this.$emit('saveMiddle', JSON.stringify(this.budgetTable));
    // },
    // getDraft(obj) {
    //   this.budgetTable = obj;
    // },
    typeChange(val) {
      this.$store.dispatch('getTemplate', { code: this.$route.params.code, subCode: val.dictCode });
    },
    addBudget() {
      this.$refs.budgetForm.validate((valid) => {
        if (valid) {
          if (this.checkBudget()) {
            var temp = {};
            temp.budgetDept = this.$refs.budgetDept.currentLabels[0] + "/" + this.$refs.budgetDept.currentLabels[this.$refs.budgetDept.currentLabels.length - 1];
            temp.budgetMoney = this.budgetForm.budgetMoney;
            temp.useBudget = this.useBudget;
            temp.execRateStr = this.execRateStr;
            temp.budgetDeptId = this.budgetForm.budgetDept[0];
            temp.budgetDeptName = this.$refs.budgetDept.currentLabels[0];
            temp.budgetItemId = this.budgetForm.budgetDept[this.budgetForm.budgetDept.length - 1];
            temp.budgetItemName = this.$refs.budgetDept.currentLabels[this.$refs.budgetDept.currentLabels.length - 1];
            temp.budgetYear = this.year;

            this.budgetTable.push(temp);

            this.isDisable = true;
            // this.budgetForm.year="";
            this.$refs.budgetMoney.currentValue = "";
            this.budgetForm.budgetDept = [];
            this.budgetForm.budgetMoney = "";
            // this.$refs.budgetForm.resetFields();
            this.showData = 0;
          }
        } else {
          return false;
        }
      });
    },
    deleteRow(index) {
      this.budgetTable.splice(index, 1)
    },
    // fomatFloat(src, pos) {
    //   return Math.round(src * Math.pow(10, pos)) / Math.pow(10, pos);
    // },
    checkEmpty() {
      // console.log(this.budgetTable.length);
      if (this.budgetTable.length != 0) {
        this.$emit('submitMiddle', { budgetTable: this.budgetTable });
      } else {
        this.$message.warning('请添加预算')
        this.$emit('submitMiddle', false);
      }
    },
    getBudgetDep() {
      var len = this.budgetForm.budgetDept.length;
      var temp = this.budgetDeptList;
      for (var i = 0; i < len; i++) {
        temp = temp.find(dep => dep.budgetItemCode == this.budgetForm.budgetDept[i]);
        if (temp.items && temp.items.length != 0) {
          temp = temp.items;
        }
      }
      return temp;
    },
    checkBudget() {
      var dep = this.getBudgetDep();
      var temp = this.budgetTable.find(b => b.budgetItemId == dep.budgetItemCode)
      if (!this.useBudget) {
        this.$message.warning('该科目无预算信息');
        return false
      } else if (temp == undefined) {
        return true;
      } else {
        this.$message.warning('不能添加相同的预算科目')
        return false
      }
    },
    saveForm() {
      // console.log(this.vehicleForm)
      if(this.budgetForm.type.dictCode=="DOC2602"){
        var param = {  type:this.budgetForm.type.dictCode}
        var params = JSON.stringify(param);
      }else{
        // console.log(this.budgetForm.type)
        var param = { "budgetTable": this.budgetTable, type:this.budgetForm.type.dictCode}
        var params = JSON.stringify(param);
        // console.log(params)
      }
      this.$emit('saveMiddle', params,this.budgetForm.type.dictCode);
    },
    getDraft(obj) {
      // console.log(obj)
      if(obj.budgetTable){
        this.budgetTable = obj.budgetTable;
      }
      this.budgetForm.type.dictCode=obj.type;
    },
    submitForm() {
      this.$refs.budgetForm.validateField('type', error => {
        if (!error) {
          this.params = {
            docSubtypeCode:this.budgetForm.type.dictCode,
            typeCode: this.budgetForm.type.dictCode,
          }
          if (this.budgetForm.type.dictCode === 'DOC2601') {
            if (this.budgetTable.length != 0) {
              this.params.finBudget = {
                "totalMoney": this.totalMoney,
                "finBudgetItems": this.budgetTable.map(function(tabel) {
                  return {
                    "budgetDeptId": tabel.budgetDeptId, //预算部门id
                    "budgetDeptName": tabel.budgetDeptName, //预算部门名字
                    "budgetItemName": tabel.budgetItemName, //-预算科目名字
                    "budgetItemId": tabel.budgetItemId, //预算科目id
                    "money": tabel.budgetMoney, //预算钱数
                    "budgetYear": tabel.budgetYear //预算年数
                  }
                })
              }
              this.$emit('submitMiddle', this.params);
            } else {
              this.$message.warning('请检查填写字段')
              this.$emit('submitMiddle', false);
              return false;
            }
          } else {
            this.$emit('submitMiddle', this.params);
          }
        } else {
          this.$message.warning('请检查填写字段')
          this.$emit('submitMiddle', false);
          return false;
        }
      })

    },
    closePerson(index) {
      this.budgetForm.person.splice(index, 1);
    },
    fomatMoney(val) {
      if (val.toString().match(/^\./)) {
        this.budgetForm.budgetMoney = "";
        this.$refs.budgetMoney.setCurrentValue("");
      } else if (val.toString().match(/^\-?[0]{2}/)) {
        this.budgetForm.budgetMoney = val[0];
        this.$refs.budgetMoney.setCurrentValue(val[0]);
      } else if (val.toString().match(/^\-?[0]\.[0]{2}/)) {
        this.budgetForm.budgetMoney = val[0];
        this.$refs.budgetMoney.setCurrentValue(val[0]);
      } else if (val.toString().match(/^\-?[0][0-9]+$/)) {
        this.budgetForm.budgetMoney = val[0];
        this.$refs.budgetMoney.setCurrentValue(val[0]);
      } else {
        val = val.toString().match(/^\-?[0-9]*\.?[0-9]{0,2}$/);
        // if(val.toString().match(/^\-/)){
        //     val = val.toString().match(/(^\-[1-9]([0-9]{0,})|^[0])+(?:\.\d{0,2})?/);
        // }else{
        //     val = val.toString().match(/(^[1-9]([0-9]{0,})|^[0])+(?:\.\d{0,2})?/);
        // }
        if (val) {
          this.val2 = val.toString();
        }


        if (val) {
          this.budgetForm.budgetMoney = val[0];
          this.$refs.budgetMoney.setCurrentValue(val[0]);
        } else {
          this.budgetForm.budgetMoney = this.val2
          this.$refs.budgetMoney.setCurrentValue(this.val2)
        }
      }

    },
    getBudgetDeptList() {
      if (this.year) {
        this.showData = "0";
        this.$http.post('/doc/getBudItemTreeList', {
            // year: this.year,
          })
          .then(res => {
            if (res.status == 0) {
              res.data.forEach(i => i.isParent == 1 ? i.items = [] : i.items = null)
              this.budgetDeptList = res.data
            } else {}
          }, res => {})
      }
    },
    handleItemChange(val) {
      var len = val.length;
      var temp = this.budgetDeptList;
      var i = 0;
      while (len > i) {
        temp = temp.find(dep => dep.budgetItemCode == val[i]).items;
        i++
      }
      // console.log(temp);
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
    getBookType() {
      this.$http.post('/api/getDict', { dictCode: 'ADM05' })
        .then(res => {
          if (res.status == 0) {
            this.bookTypes = res.data;
            this.budgetForm.bookType = this.bookTypes[0].dictCode
          }
        })
    },
    blurInput(event) {
      var temp = event.target.value.split('.');
      if (temp.length == 2 && (temp[1] == undefined || temp[1] == '' || temp[1] == null)) {
        this.budgetForm.budgetMoney = temp[0];
        this.$refs.budgetMoney.setCurrentValue(temp[0]);
      }
    },

    changeDept() {
      this.$http.post('/doc/getExecStatisofItemId', {
          budgetItemCode: this.budgetForm.budgetDept[this.budgetForm.budgetDept.length - 1],
          budgetYear: this.year,
        })
        .then(res => {
          if (res.status == 0) {
            this.showData = 1;
            this.execRateStr = res.data.execRateStr;
            this.yearBudget = res.data.budgetTotal;
            this.useBudget = res.data.budgetRemain;
          }
        })
    },
    getTypes() {
      this.$http.post('/api/getDict', { dictCode: 'DOC26' })
        .then(res => {
          if (res.status == 0) {
            this.types = res.data;
          } else {
            console.log(res)
          }
        }, res => {})
    }
  }
}

</script>
<style lang='scss'>
$main:#0460AE;

.change_data {
  width: calc(100% - 18px);
  height: 54px;
  margin: 0px 0 20px 18px;
  background: #F7F7F7;
  color: #0460AE;

  ul li {
    font-size: 15px;
    border: 1px solid transparent;
    width: 33.3%;
    float: left;
    height: 54px;
    line-height: 54px;
    text-align: center;
  }
  ul li:first-child {
    border-right: 1px solid #D5DADF;
  }
  ul li:last-child {
    border-left: 1px solid #D5DADF;
  }
}

.clearPadding {
  padding: 0 !important;
}

.budgetApp {
  .el-input {
    width: 100%;
  } // .totalMoney {
  //   text-align: right;
  //   font-size: 15px;
  //   line-height: 38px;
  //   padding-right: 30px;
  //   margin: -20px 0 30px 18px;
  //   border: 1px solid #D5DADF;
  //   border-top: none;
  //   span {
  //     color: $main;
  //   }
  // }
  .budgetMoney {
    .input {
      width: 252px
    }
    .btn {
      margin-left: 5px;
    }
  }
  .budgetYear .el-input__inner {
    border: 0px solid red;
  }



  .appTable {
    // width: calc(100% - 18px);
    // margin: 0 0 20px 18px;
    .upDown {
      .cell {
        padding-left: 0;
        span {
          color: #fff;
          width: 42px;
          height: 42px;
          line-height: 37px;
          display: inline-block;
          text-align: center;
          font-size: 14px;
          border-top-right-radius: 5px;
          border-bottom-right-radius: 5px;
          padding: 3px;
        }
      }
    }
  }
  .year {
    width: 252px;
  }
  .budgetDept {
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
}

// .widthLeft40 {
//     float: left;
//     width: 40%;
//   }
//   .year {
//     .el-form-item__content {
//       font-size: 16px;
//       line-height: 45px;
//     }
//   }

</style>
