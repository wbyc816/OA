<template>
  <div class="commonBudgetApp">
    <el-form label-position="left" :model="paymentForm" :rules="paymentRule" ref="paymentForm" label-width="128px">
      <el-form-item label="呈批单类型" prop="docCommonTypeCode">
        <el-select v-model="paymentForm.docCommonTypeCode" style="width:100%" ref="docCommonTypeCode">
          <el-option v-for="item in childTypeList" :key="item.dictCode"  :label="item.dictName" :value="item.dictName">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="预算年份" class="year">
        {{year}}
      </el-form-item>
      <el-form label-position="left" :model="budgetForm" :rules="budgetRule" ref="budgetForm" label-width="128px" class="clearBoth">
        <el-form-item label="预算机构/科目" prop="budgetDept" class="clearBoth">
          <el-cascader :clearable="true" :options="budgetDeptList" :props="budgetProp" v-model="budgetForm.budgetDept" :show-all-levels="false" @active-item-change="handleItemChange" @change="depChange" popper-class="myCascader" style="width:100%" :disabled="paymentForm.isAdvancePayment==1"></el-cascader>
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
        <el-table :data="budgetTable" :stripe="true" highlight-current-row style="width: 100%" empty-text="未添加付款项">
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
      <el-form-item label="收款供应商" prop="supplierIds">
        <el-cascader expand-trigger="hover" :options="supplierList" filterable :props="paymentProp" v-model="paymentForm.supplierIds" style="width:100%" popper-class="myCascader" @change="supplierChange" ref="supplier">
        </el-cascader>
      </el-form-item>
      <ul class="supplierInfo clearfix" v-show="supplierInfo" style="width: 750px;">
        <li>开户银行 {{supplierInfo.accountBank}}</li>
        <li>收款账户 {{supplierInfo.accountName}}</li>
      </ul>
    </el-form>
  </div>
</template>
<script>
import MoneyInput from '../../../components/moneyInput.component'
import _ from 'lodash'
import { mapGetters } from 'vuex'

export default {
  components: { MoneyInput },
  data() {
    return {
      budgetForm: {
        budgetDept: [],
        appMoney: '',
        remark: ''
      },
      budgetRule: {
        budgetDept: [{ type: 'array', required: true, message: '请选择预算机构/科目', trigger: 'blur' }],
        appMoney: [{ required: true, message: '请输入申请金额', trigger: 'blur' }],
      },
      year: new Date().getFullYear(),
      budgetDeptList: [],
      budgetInfo: '',
      budgetTable: [],
      paymentForm: {
        supplierIds: [],
        docCommonTypeCode: ''
      },
      paymentRule: {
        // supplierIds: [{ type: 'array', required: true, message: '请选择收款供应商', trigger: 'blur' }],
         docCommonTypeCode: [{ required: true, message: '请选择呈批单类型', trigger: 'blur' }],
      },
      childTypeList: [],
      activeCurrency: '',
      supplierInfo: '',
      isDraft: false,
      paymentProp: {
        value: 'id',
        label: 'supplierName',
        children: 'supplier'
      },
      budgetProp: {
        label: 'budgetItemName',
        value: 'budgetItemCode',
        children: 'items'
      },
      isfirst: true
    }
  },
  computed: {
    totalMoney() {
      var num = 0;
      if (this.budgetTable.length != 0) {
        this.budgetTable.forEach(b => {
          if (b.rmb) {
            num += b.rmb;
          }
        })
      }
      return num
    },
    ...mapGetters([
      'submitLoading',
      'baseURL',
      'userInfo',
      'supplierList',
      'currencyList'
    ])
  },
  watch: {
    currencyList: function(newval) {
      if (newval.length !== 0) {
        this.getCurrencyList();
      }
    },
    supplierList: function(newval) {
      if (this.isDraft && this.isfirst) {
        this.supplierChange();
        this.isfirst = false;
      }
    }
  },
  created() {
    this.getChildTypeList();
    if (this.$route.query.id) {
      this.isDraft = true;
    }
    this.getBudgetDeptList(); //预算机构/科目
    if (!this.isDraft) {
      this.getSupplier(); //收款供应商
    }
    this.getCurrencyList(); //币种
  },
  methods: {
    saveForm() {
      var params = JSON.stringify({
        budgetTable: this.budgetTable,
        paymentForm: this.paymentForm,
      });

      this.$emit('saveMiddle', params);
    },
    getDraft(obj) {
      this.paymentForm = obj.paymentForm;
      this.budgetTable = obj.budgetTable;
      if (this.paymentForm.supplierIds.length != 0) {
        if (this.supplierList.length == 0) {
          this.getSupplier();
        } else {
          this.supplierChange();
        }
      }
    },
    submitForm() {
      if (this.checkBudgetTable()) {
        this.$refs.paymentForm.validate((valid) => {
          if (valid) {
            this.submitAll();
          } else {
            this.$message.warning('请检查填写字段')
            this.$emit('submitMiddle', false);
            return false;
          }
        });
      }
    },
    submitAll() {
      console.log(this.$refs.docCommonTypeCode)
      var docCommonFin = {
        "docCommonTypeCode": this.paymentForm.docCommonTypeCode, //公文子类型
        "docCommonTypeName": this.$refs.docCommonTypeCode.selectedLabel, //公文子类型名称
        "supplierId": this.supplierInfo.id, //供应商id
        "supplierName": this.supplierInfo.supplierName, //供应商名
        "supplierBank": this.supplierInfo.accountBank, //供应商开户银行
        "supplierBankAccountName": this.supplierInfo.accountName, //供应商开户账号名
        "supplierBankAccountCode": this.supplierInfo.accountCode, //供应商开户账号编号
        "totalMoneyRmb": this.totalMoney, //合计金额
      };
      this.$emit('submitMiddle', { docCommonFin: docCommonFin, docCommonFinItem: this.budgetTable })
    },
    getChildTypeList() {
      this.$http.post('/api/getDict', { dictCode: 'DOC24' })
        .then(res => {
          if (res.status == '0') {
            this.childTypeList = res.data;
          } else {
            console.log('获取公文子类型失败')
          }
        }, res => {

        })
    },
    checkBudgetTable() {
      if (this.budgetTable.length != 0) {
        return true;
      } else {
        this.$message.warning('未添加付款项');
        this.$emit('submitMiddle', false);
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
            "exchangeRateId": currency.exchangeRate, //汇率id
            "remark": this.budgetForm.remark
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
        if (this.budgetInfo.budgetRemain <= 0 || rmb > this.budgetInfo.budgetRemain) {
          this.$message.warning('申请金额不能大于可用预算金额');
          return false
        } else {
          return true
        }
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
    getSupplier() {
      this.$store.dispatch('getSupplier');
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
    supplierChange(val) {
      var len = this.paymentForm.supplierIds.length;
      var temp = this.supplierList;
      for (var i = 0; i < len; i++) {
        temp = temp.find(s => s.id == this.paymentForm.supplierIds[i]);
        if (temp.supplier && temp.supplier.length != 0) {
          temp = temp.supplier;
        }
      }
      this.supplierInfo = temp
    }
  }
}

</script>
<style lang='scss'>
$main:#0460AE;
.commonBudgetApp {
  .tipInfo {
    display: inline-block;
    font-size: 14px;
    color: $main;
  }
  .myRadio {
    .el-radio-button__inner {
      width: 60px;
      line-height: 45px;
      height: 45px;
      padding: 0;
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
