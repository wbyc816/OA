<template>
  <div class="materialApp clearfix">
    <el-form label-position="left" :model="budgetForm" :rules="budgetRule" ref="budgetForm" label-width="128px" class="clearBoth">
      <el-form-item label="预算年份" class="year">
        {{year}}
      </el-form-item>
      <el-form-item label="预算机构/科目" prop="budgetDept" class="clearBoth">
        <el-cascader :clearable="true" :options="budgetDeptList" :props="budgetProp" v-model="budgetForm.budgetDept" :show-all-levels="false" @active-item-change="handleItemChange" @change="depChange" popper-class="myCascader" style="width:100%"></el-cascader>
      </el-form-item>
      <ul class="budgetInfo clearfix clearBoth" v-show="budgetInfo">
        <li>年度预算{{budgetInfo.budgetTotal | toThousands}}元</li>
        <li>可用预算{{budgetInfo.budgetRemain | toThousands}}元</li>
        <li>预算执行比例{{budgetInfo.execRateStr}}</li>
      </ul>
      <el-form-item label="申请金额" class="deptArea" prop="appMoney" style="width:60%">
        <money-input v-model="budgetForm.appMoney">
          <el-select v-model="activeCurrency" slot="prepend" ref="currency" style="width:90px">
            <el-option :label="currency.currencyName" :value="currency.currencyCode" v-for="currency in currencyList"></el-option>
          </el-select>
          <template slot="append">元</template>
        </money-input>
      </el-form-item>
      <el-form-item label="说明" prop="remark" placeholder="" class="clearBoth">
        <el-input v-model="budgetForm.remark"></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="addBudget" class="addBudget"><i class="el-icon-plus"></i> 添加</el-button>
      </el-form-item>
    </el-form>
    <div class="appTable clearBoth">
      <el-table :data="budgetTable" :stripe="true" highlight-current-row style="width: 100%" empty-text="未添加预算项">
        <el-table-column type="expand">
          <template scope="props">
            <div class="remarkBox">
              <span>说明</span>
              <p>{{props.row.remark}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column property="budgetDeptName" label="预算年度" width="75">
          <template scope="scope">
            {{year}}
          </template>
        </el-table-column>
        <el-table-column property="budgetDeptName" label="预算机构/科目">
          <template scope="scope">
            {{scope.row.budgetDeptName}}/{{scope.row.budgetItemName}}
          </template>
        </el-table-column>
        <el-table-column property="accurencyName" label="币种" width="75"></el-table-column>
        <el-table-column property="money" label="申请金额" width="140"></el-table-column>
        <el-table-column property="rmb" label="人民币(元)" width="125"></el-table-column>
        <el-table-column label=" " width="55">
          <template scope="scope">
            <el-button @click.native.prevent="deleteBudget(scope.$index)" type="text" size="small" icon="delete">
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <p class="totalMoney">合计金额 人民币 <span>{{totalMoney | toThousands}}元 {{totalMoney | moneyCh}}</span></p>
    </div>
    <el-form label-position="left" :model="materialForm" :rules="rules" ref="materialForm" label-width="128px">
      <el-form-item label="品名" class="inlinItem" prop="productName">
        <el-input v-model="materialForm.productName" :maxlength="25"></el-input>
      </el-form-item>
      <el-form-item label="规格" class="inlinItem" prop="specification">
        <el-input v-model="materialForm.specification" :maxlength="25"></el-input>
      </el-form-item>
      <el-form-item label="计划单价" class="inlinItem" prop="plannedUnitPrice">
        <money-input v-model="materialForm.plannedUnitPrice" :prepend="false">
          <template slot="append">元</template>
        </money-input>
      </el-form-item>
      <el-form-item label="数量" class="inlinItem" prop="quantity">
        <money-input v-model="materialForm.quantity" :maxlength="5" :prepend="false" :append="false" type="int"></money-input>
      </el-form-item>
      <el-form-item label="备注" class="clearBoth">
        <el-col :span="19">
          <el-input v-model="materialForm.remark" class="fixF5" :maxlength="100">
          </el-input>
        </el-col>
        <el-col :span="5">
          <el-button @click='addMaterial' type="primary" class="addbutton1"><i class="el-icon-plus"></i> 添加</el-button>
        </el-col>
      </el-form-item>
    </el-form>
    <div class="appTable">
      <el-table :data="materials" :stripe="true" highlight-current-row style="width: 100%" empty-text="未添加材料">
        <el-table-column type="index" label="序号" width="55"></el-table-column>
        <el-table-column property="productName" label="品名" width="160"></el-table-column>
        <el-table-column property="specification" label="规格" width="65"></el-table-column>
        <el-table-column property="plannedUnitPrice" label="计划单价" width="110"></el-table-column>
        <el-table-column property="quantity" label="数量" width="100"></el-table-column>
        <el-table-column property="remark" label="备注"></el-table-column>
        <el-table-column label="操作" width="55">
          <template scope="scope">
            <el-button @click.native.prevent="deleteRow(scope.$index)" type="text" size="small" icon="delete">
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <p class="totalPrice" v-show="totalPrice!=0">合计金额<span>{{totalPrice | toThousands}}元 {{totalPrice | moneyCh}}</span></p>
    </div>
  </div>
</template>
<script>
import MoneyInput from '../../../components/moneyInput.component'
import { mapGetters } from 'vuex'
export default {
  components: { MoneyInput },
  data() {
    return {
      materialForm: {
        productName: '',
        specification: '',
        quantity: '',
        plannedUnitPrice: '',
        remark: ''
      },
      rules: {
        productName: [{ required: true, message: '请输入品名', trigger: 'blur' }],
        specification: [{ required: true, message: '请输入规格', trigger: 'blur' }],
        quantity: [{ required: true, message: '请输入数量' }],
        plannedUnitPrice: [{ required: true, message: '请输入单价' }],
      },
      materials: [],
      budgetForm: {
        budgetDept: [],
        appMoney: '',
        remark: ''
      },
      budgetRule: {
        budgetDept: [{ type: 'array', required: true, message: '请选择预算机构/科目', trigger: 'blur' }],
        appMoney: [{ required: true, message: '请输入申请金额', trigger: 'blur' }],
      },
      budgetDeptList: [],
      budgetInfo: '',
      budgetTable: [],
      activeCurrency: '',
      budgetProp: {
        label: 'budgetItemName',
        value: 'budgetItemCode',
        children: 'items'
      },
    }
  },
  computed: {
    totalPrice: function() {
      if (this.materials.length != 0) {
        var num = 0;
        this.materials.forEach(m => {
          num += m.plannedUnitPrice * m.quantity
        })
        return parseFloat(this.numFixed2(num))
      } else {
        return 0
      }
    },
    totalMoney() {
      var num = 0;
      if (this.budgetTable.length != 0) {
        this.budgetTable.forEach(b => {
          if (b.rmb) {
            num += b.rmb;
          }
        })
      }
      return parseFloat(this.numFixed2(num))
    },
    ...mapGetters([
      'submitLoading',
      'currencyList',
      'year'
    ])
  },
  watch: {
    currencyList: function(newval) {
      if (newval.length !== 0) {
        this.getCurrencyList();
      }
    },
  },
  created() {
    this.getBudgetDeptList(); //预算机构/科目
    this.getCurrencyList(); //币种

  },
  methods: {
    saveForm() {
      var params = JSON.stringify({
        budgetTable: this.budgetTable,
        materials: this.materials,
      });

      this.$emit('saveMiddle', params);
    },
    getDraft(obj) {
      this.materials = obj.materials;
      this.budgetTable = obj.budgetTable;
    },
    addMaterial() {
      this.$refs.materialForm.validate((valid) => {
        if (valid) {
          var temp = this.clone(this.materialForm);
          temp.plannedUnitPrice = this.fomatFloat(temp.plannedUnitPrice, 1);
          temp.quantity = parseInt(temp.quantity);
          this.materials.push(temp);
          this.$refs.materialForm.resetFields();
          this.materialForm.remark = '';
        } else {
          return false;
        }
      });
    },
    deleteRow(index) {
      this.materials.splice(index, 1)
    },
    fomatFloat(src, pos) {
      return Math.round(src * Math.pow(10, pos)) / Math.pow(10, pos);
    },
    submitForm() {
      if (this.checkTable()) {
        this.$emit('submitMiddle', { materials: this.materials, materialItem: this.budgetTable });
      } else {
        this.$emit('submitMiddle', false);
      }
    },
    checkTable() {
      if (this.budgetTable.length != 0) {
        if (this.materials.length != 0) {
          return true
        } else {
          this.$message.warning('请添加材料');
          return false;
        }
      } else {
        this.$message.warning('未添加预算项');
        return false;
      }
    },
    addBudget() {
      this.$refs.budgetForm.validate((valid) => {
        if (valid) {
          var dep = this.getBudgetDep();
          var currency = this.currencyList.find(c => c.currencyCode === this.activeCurrency);
          var item = {
            "budgetDeptId": dep.budgetDeptCode, //预算部门id
            "budgetDeptName": dep.budgetDeptName, //预算部门名
            "budgetItemId": dep.budgetItemCode, //预算科目id
            "budgetItemName": dep.budgetItemName, //预算科目名
            "money": this.budgetForm.appMoney, //金额
            "rmb": 0, //人民币
            "accurencyName": currency.currencyName, //币种名称
            "exchangeRateId": currency.exchangeId, //汇率id
            "remark": this.budgetForm.remark,
            "budgetYear": this.year,
            "exchangeRate": currency.exchangeRate,
          }
          this.$http.post('/doc/getRmbByExchangeRate', { currencyId: currency.currencyCode, amount: item.money })
            .then(res => {
              if (res.status == 0) {
                item.rmb = res.data.amount;
                if (this.checkBuudget(item.rmb, dep)) {
                  this.budgetTable.push(item);
                  this.budgetForm.budgetDept = [];
                  this.budgetForm.appMoney = '';
                  this.budgetForm.remark = '';
                  this.budgetInfo = '';
                }
              } else {
                console.log('货币兑换失败')
              }
            })
        }
      })
    },
    deleteBudget(index) {
      this.budgetTable.splice(index, 1);
    },
    checkBuudget(rmb, dep) {
      var temp = this.budgetTable.find(b => b.budgetDeptId == dep.budgetDeptCode && b.budgetItemId == dep.budgetItemCode)
      if (temp == undefined) {
        return true
      } else {
        this.$message.warning('不能添加相同的预算科目')
        return false
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
    getCurrencyList() {
      if (this.currencyList.length !== 0) {
        if (!this.isDraft) {
          this.activeCurrency = this.currencyList[0].currencyCode;
        }
      } else {
        this.$store.dispatch('getCurrency')
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
    depChange(val) {
      if (val.length > 0) {
        this.$http.post('/doc/getExecStatisofItemId', { budgetYear: this.year, budgetItemCode: val[val.length - 1] })
          .then(res => {
            if (res.status == 0) {
              this.budgetInfo = res.data;
            } else {

            }
          })
      } else {
        this.budgetInfo = ''
      }
    },
  }
}

</script>
<style lang='scss'>
$main:#0460AE;
.materialApp {
  margin-bottom: 30px;
  .inlinItem {
    display: inline-block;
    width: 50%;
    float: left;
    &:nth-child(even) {
      .el-form-item__label {
        text-indent: 30px;
      }
    }
  }
  .totalPrice {
    line-height: 40px;
    padding-right: 15px;
    border: 1px solid #D5DADF;
    border-top: none;
    font-size: 15px;
    text-align:right;
    span {
      margin-left: 5px;
      color: $main;
    }
  }
  .budgetInfo {
    background: #F7F7F7;
    font-size: 15px;
    color: $main;
    margin-bottom: 20px;
    li {
      float: left;
      width: 33.33%;
      text-align: center;
      line-height: 54px;
      &:nth-child(2) {
        border-left: 1px solid #D5DADF;
        border-right: 1px solid #D5DADF;
      }
    }
  }
  .addBudget {
    width: 220px;
    height: 45px;
  }
  .appTable {
    width: 750px;
    margin-bottom: 20px;
    td {
      height: 60px;
    }
  }
  .totalMoney {
    text-align: right;
    font-size: 15px;
    line-height: 38px;
    padding-right: 30px;

    border: 1px solid #D5DADF;
    border-top: none;
    span {
      color: $main;
    }
  }
  .remarkBox {
    overflow: hidden;
    display: table;
    font-size: 15px;
    table-layout: fixed;
    min-height: 57px;
    span {
      color: #99a9bf;
      padding: 0 0 0 10px;
      line-height: 36px;
      width: 90px;
      display: table-cell;
      vertical-align: middle;
      word-wrap: break-word;
      word-break: break-word;
    }
    p {
      display: table-cell;
      vertical-align: middle;
      overflow: hidden;
      word-wrap: break-word;
      line-height: 19px;
      word-break: break-word;
    }
  }
}

</style>
