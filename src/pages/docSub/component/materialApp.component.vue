<template>
  <div class="materialApp clearfix">
    <el-form label-position="left" :model="materialForm" :rules="rules" ref="materialForm" label-width="128px">
      <el-form-item label="物品名称" class="inlinItem" prop="productName">
        <el-input v-model="materialForm.productName" :maxlength="25"></el-input>
      </el-form-item>
      <el-form-item label="型号" class="inlinItem" prop="specification">
        <el-input v-model="materialForm.specification" :maxlength="25"></el-input>
      </el-form-item>
      <el-form-item label="单价" class="inlinItem" prop="plannedUnitPrice">
        <money-input v-model="materialForm.plannedUnitPrice" :prepend="false" :append="false" @change="caculateTotal">
        </money-input>
      </el-form-item>
      <el-form-item label="数量" class="inlinItem" prop="quantity">
        <money-input v-model="materialForm.quantity" :maxlength="5" :prepend="false" :append="false" type="int" @change="caculateTotal"></money-input>
      </el-form-item>
      <el-form-item label="预算年份" class="year clearBoth">
        {{year}}
      </el-form-item>
      <el-form-item label="预算机构/科目" prop="budgetDept" class="clearBoth">
        <el-cascader :clearable="true" :options="budgetDeptList" :props="budgetProp" v-model="materialForm.budgetDept" :show-all-levels="false" @active-item-change="handleItemChange" @change="depChange" popper-class="myCascader" style="width:100%"></el-cascader>
      </el-form-item>
      <ul class="budgetInfo clearfix clearBoth" v-show="budgetInfo">
        <li>年度预算{{budgetInfo.budgetTotal | toThousands}}元</li>
        <li>可用预算{{budgetInfo.budgetRemain | toThousands}}元</li>
        <li>预算执行比例{{budgetInfo.execRateStr}}</li>
      </ul>
      <el-form-item label="总价" class="deptArea" prop="appMoney" style="width:60%">
        <money-input :value="materialForm.appMoney" :append="false" readonly>
          <el-tooltip content="修改币种将清空已添加的物品列表" v-model="showTip" slot="prepend" placement="left" effect="light" manual>
            <el-select v-model="activeCurrency" ref="currency" style="width:90px" @change="currencyChange"@visible-change="listShow">
              <el-option :label="currency.currencyName" :value="currency.currencyCode" v-for="currency in currencyList"></el-option>
            </el-select>
          </el-tooltip>
        </money-input>
      </el-form-item>
      <el-form-item label="" class="arrArea" style="width:40%">
        <el-button type="primary" @click="addMaterial" class="addBudget"><i class="el-icon-plus"></i> 添加</el-button>
      </el-form-item>
    
    <div class="appTable clearBoth">
      <el-table :data="materials" :stripe="true" highlight-current-row style="width: 100%" empty-text="未添加物品">
        <el-table-column type="expand">
          <template scope="props">
            <div class="remarkBox">
              <span>预算机构/科目</span>
              <p>{{props.row.budgetDeptName}}/{{props.row.budgetItemName}}</p>
            </div>
            <div class="remarkBox">
              <span>预算年度</span>
              <p>{{props.row.budgetYear}}</p>
            </div>
            <div class="remarkBox">
              <span>费用归属部门</span>
              <p>{{props.row.budgetDeptName}}</p>
            </div>
            <div class="remarkBox">
              <span>执行比例</span>
              <p>{{props.row.rate}}</p>
            </div>
            <div class="remarkBox">
              <span>币种</span>
              <p>{{props.row.accurencyName}}</p>
            </div>
            <div class="remarkBox">
              <span>人民币</span>
              <p>{{props.row.rmb}}元</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column property="productName" label="物品名称"></el-table-column>
        <el-table-column property="specification" label="型号" width="130"></el-table-column>
        <el-table-column property="plannedUnitPrice" label="单价" width="110"></el-table-column>
        <el-table-column property="quantity" label="数量" width="100"></el-table-column>
        <el-table-column property="money" label="总价" width="130"></el-table-column>
        <el-table-column label="操作" width="55">
          <template scope="scope">
            <el-button @click.native.prevent="deleteRow(scope.$index)" type="text" size="small" icon="delete">
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <p class="totalPrice" v-show="totalPrice!=0">合计人民币<span>{{totalPrice | toThousands}}元 {{totalPrice | moneyCh}}</span></p>
    </div>
    <el-form-item label="总金额" class="deptArea">
        <el-input :value="totalMoney" readonly></el-input>
      </el-form-item>
    </el-form>
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
        budgetDept: [],
        appMoney:0
      },
      rules: {
        productName: [{ required: true, message: '请输入品名', trigger: 'blur' }],
        // specification: [{ required: true, message: '请输入规格', trigger: 'blur' }],
        quantity: [{ required: true, message: '请输入数量' }],
        plannedUnitPrice: [{ required: true, message: '请输入单价' }],
        budgetDept: [{ type: 'array', required: true, message: '请选择预算机构/科目', trigger: 'blur' }],
        appMoney: [{ type: 'number',required: true, message: '请输入总价', trigger: 'blur' }],
      },
      materials: [],
      budgetForm: {

      },
      showTip: false,
      budgetRule: {

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
          num += m.rmb
        })
        return parseFloat(this.numFixed2(num))
      } else {
        return 0
      }
    },
    // appMoney() {
    //   var num = 0;
    //   if (this.materialForm.quantity && this.materialForm.plannedUnitPrice) {
    //     num = parseInt(this.materialForm.quantity) * parseFloat(this.materialForm.plannedUnitPrice)
    //   }
    //   return parseFloat(this.numFixed2(num))
    // },
    totalMoney() {
      if (this.materials.length != 0) {
        var num = 0;
        this.materials.forEach(m => {
          num += parseFloat(m.money)
        })
        return parseFloat(this.numFixed2(num))
      } else {
        return 0
      }
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
        materials: this.materials,
      });

      this.$emit('saveMiddle', params);
    },
    getDraft(obj) {
      this.materials = obj.materials;
    },
    caculateTotal(){
      var money=0;
      if(this.materialForm.plannedUnitPrice&&this.materialForm.quantity){
        money=parseFloat(this.numFixed2(parseInt(this.materialForm.quantity) * parseFloat(this.materialForm.plannedUnitPrice)));
      }
      this.materialForm.appMoney=money;
    },
    addMaterial() {
      this.$refs.materialForm.validate((valid) => {
        if (valid) {
          var dep = this.getBudgetDep();
          var currency = this.currencyList.find(c => c.currencyCode === this.activeCurrency);
          var item = {
            "productName": this.materialForm.productName,
            "specification": this.materialForm.specification,
            "quantity": parseInt(this.materialForm.quantity),
            "plannedUnitPrice": this.materialForm.plannedUnitPrice,
            "budgetDeptId": dep.budgetDeptCode, //预算部门id
            "budgetDeptName": dep.budgetDeptName, //预算部门名
            "budgetItemId": dep.budgetItemCode, //预算科目id
            "budgetItemName": dep.budgetItemName, //预算科目名
            "money": this.materialForm.appMoney, //金额
            "rmb": 0, //人民币
            "accurencyName": currency.currencyName, //币种名称
            "exchangeRateId": currency.exchangeId, //汇率id
            "budgetYear": this.year,
            "exchangeRate": currency.exchangeRate,
            "rate": this.budgetInfo.execRateStr
          }
          this.$http.post('/doc/getRmbByExchangeRate', { currencyId: currency.currencyCode, amount: item.money })
            .then(res => {
              if (res.status == 0) {
                item.rmb = res.data.amount;
                this.materials.push(item);
                this.$refs.materialForm.resetFields();
                this.caculateTotal();
                this.budgetInfo=''
              } else {
                this.$message.error(res.message)
              }
            })
        } else {
          return false;
        }
      });
    },
    currencyChange() {
      this.materials = [];
    },
    listShow(val){
      this.showTip=val;
    },
    deleteRow(index) {
      this.materials.splice(index, 1)
    },
    fomatFloat(src, pos) {
      return Math.round(src * Math.pow(10, pos)) / Math.pow(10, pos);
    },
    submitForm() {
      if (this.checkTable()) {
        var params = this.clone(this.materials).map(function(s) {
          delete s.rate;
          return s;
        })
        this.$emit('submitMiddle', { materials: params });
      } else {
        this.$emit('submitMiddle', false);
      }
    },
    checkTable() {
      if (this.materials.length != 0) {
        return true
      } else {
        this.$message.warning('请添加材料');
        return false;
      }
    },
    getBudgetDep() {
      var len = this.materialForm.budgetDept.length;
      var temp = this.budgetDeptList;
      for (var i = 0; i < len; i++) {
        temp = temp.find(dep => dep.budgetItemCode == this.materialForm.budgetDept[i]);
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
    text-align: right;
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
    width: 100%;
    height: 45px;
  }
  .appTable {
    width: 750px;
    margin-bottom: 20px;
    td {
      height: 60px;
    }
  }
  .remarkBox {
    overflow: hidden;
    display: table;
    font-size: 15px;
    table-layout: fixed;
    min-height: 57px;
    width: 50%;
    float: left;
    span {
      color: #99a9bf;
      padding: 0 0 0 10px;
      line-height: 36px;
      width: 117px;
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
