<template>
  <div class="paymentApp">
    <el-form label-position="left" :model="budgetForm" :rules="budgetRule" ref="budgetForm" label-width="128px">
      <el-form-item label="预算年份" class="widthLeft40 year">
        {{year}}
      </el-form-item>
      <el-form-item label="预算机构/科目" prop="budgetDept" class="widthRight60">
        <el-cascader :clearable="true" :options="budgetDeptList" :props="budgetProp" v-model="budgetForm.budgetDept" :show-all-levels="false" @active-item-change="handleItemChange" @change="depChange" popper-class="myCascader" style="width:100%"></el-cascader>
      </el-form-item>
      <ul class="budgetInfo clearfix clearBoth" v-show="budgetInfo">
        <li>年度预算{{budgetInfo.budgetTotal | toThousands}}元</li>
        <li>可用预算{{budgetInfo.budgetRemain | toThousands}}元</li>
        <li>预算执行比例{{budgetInfo.execRateStr}}</li>
      </ul>
      <el-form-item label="付款类型" prop="payTypeCode" placeholder="" class="deptArea" style="width:51%">
        <el-select v-model="budgetForm.payTypeCode" style="width:100%" ref="contractType">
          <el-option v-for="item in payTypes" :key="item.dictCode" :label="item.dictName" :value="item.dictCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="申请金额" label-width="100px" class="arrArea" style="width:49%" prop="appMoney">
        <money-input v-model="budgetForm.appMoney">
          <el-select v-model="activeCurrency" slot="prepend" style="width:90px">
            <el-option :label="currency.currencyName" :value="currency.currencyCode" v-for="currency in currencyList"></el-option>
          </el-select>
          <template slot="append">元</template>
        </money-input>
      </el-form-item>
      <el-form-item label="发票类型" prop="invoiceNum" placeholder="" class="clearBoth">
        <el-input v-model="budgetForm.invoiceNum" class="hasUnit" :disabled="activeInvoice!='FIN0201'">
          <el-select v-model="activeInvoice" slot="prepend" style="width:160px" @change="invoiceTypeChange">
            <el-option v-for="item in invoiceList" :key="item.dictCode" :label="item.dictName" :value="item.dictCode"></el-option>
          </el-select>
        </el-input>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="addBudget" class="addBudget"><i class="el-icon-plus"></i> 添加付款项</el-button>
      </el-form-item>
    </el-form>
    <div class="appTable">
      <el-table :data="budgetTable" :stripe="true" highlight-current-row style="width: 100%" empty-text="未添加付款项">
        <el-table-column property="budgetDeptName" label="预算机构/科目">
          <template scope="scope">
            {{scope.row.budgetDeptName}}/{{scope.row.budgetItemName}}
          </template>
        </el-table-column>
        <el-table-column property="invoiceCode" label="增值税票号" width="150">
          <template scope="scope">
            <el-tooltip effect="dark" :content="scope.row.invoiceCode.join()" placement="top">
              <div>
                <p v-for="(code,index) in scope.row.invoiceCode" v-if="index<3" class="invoiceNum">{{index==2?'...':code}}</p>
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column property="appMoney" label="报销金额(元)" width="130">
          <template scope="scope">
            <money-input v-model="scope.row.appMoney" :prepend="false" :append="false" @change="tranMoney(scope.row)"></money-input>
          </template>
        </el-table-column>
        <el-table-column property="accurencyName" label="币种" width="75"></el-table-column>
        <el-table-column property="rmb" label="人民币(元)" width="125">
        </el-table-column>
        <el-table-column label=" " width="55">
          <template scope="scope">
            <el-button @click.native.prevent="deleteBudget(scope.$index)" type="text" size="small" icon="delete">
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <p class="totalMoney">合计金额 人民币 <span>{{totalMoney}} 元</span></p>
    </div>
    <el-form label-position="left" :model="paymentForm" :rules="paymentRule" ref="paymentForm" label-width="128px">
      <el-form-item label="收款供应商" prop="supplierIds">
        <el-cascader expand-trigger="hover" :options="supplierList" filterable :props="paymentProp" v-model="paymentForm.supplierIds" style="width:100%" popper-class="myCascader" @change="supplierChange" ref="supplier">
        </el-cascader>
      </el-form-item>
      <ul class="supplierInfo clearfix" v-show="supplierInfo">
        <li>开户银行 {{supplierInfo.accountBank}}</li>
        <li>收款账户 {{supplierInfo.accountName}}</li>
      </ul>
      <el-form-item label="付款方式" prop="payMthodCode" placeholder="" class="deptArea">
        <el-select v-model="paymentForm.payMthodCode" style="width:100%" ref="contractType">
          <el-option v-for="item in payMthods" :key="item.dictCode" :label="item.dictName" :value="item.dictCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="其他" prop="paymentOthers" class="arrArea" v-if="paymentForm.payMthodCode=='FIN0104'" label-width="100px">
        <el-input v-model="paymentForm.paymentOthers">
        </el-input>
      </el-form-item>
      <el-form-item label="合同" prop="contractAttach" class="clearBoth">
        <el-upload class="myUpload" :auto-upload="false" :action="baseURL+'/doc/uploadDocFinFile'" :data="{docTypeCode:'FKS',finType:1,classify:1}" :on-success="handleContractSuccess" :on-error="handleContractError" :on-change="handleContractChange" ref="contractUpload" :on-remove="handleContractRemove">
          <el-button size="small" type="primary">上传文件<i class="el-icon-upload el-icon--right"></i></el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="上传发票" prop="invoiceAttach">
        <el-upload class="myUpload" :auto-upload="false" :action="baseURL+'/doc/uploadDocFinFile'" :data="{docTypeCode:'FKS',finType:1,classify:2}" :on-success="handleInvoiceSuccess" :on-error="handleInvoiceError" :on-change="handleInvoiceChange" ref="invoiceUpload" :on-remove="handleInvoiceRemove">
          <el-button size="small" type="primary">上传文件<i class="el-icon-upload el-icon--right"></i></el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="费用类型" prop="feeType" placeholder="" class="width60">
        <el-cascader expand-trigger="hover" :options="feeTypes" :props="feeTypeProp" v-model="paymentForm.feeType" style="width:100%" popper-class="myCascader" ref="feeType">
        </el-cascader>
      </el-form-item>
      <el-form-item label="预付款" prop="isAdvancePayment" placeholder="" class="width40" label-width="110px">
        <el-radio-group v-model="paymentForm.isAdvancePayment" class="myRadio">
          <el-radio-button label="1">是<i></i></el-radio-button>
          <el-radio-button label="0">否<i></i></el-radio-button>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import MoneyInput from '../../../components/moneyInput.component'
import _ from 'lodash'
import { mapGetters } from 'vuex'
export default {
  components: {MoneyInput},
  data() {
    var that = this;
    var checkNum = function(rule, value, callback) {
      if (that.activeInvoice != 'FIN0201') {
        callback();
      } else {
        if (!value) {
          callback(new Error('请输入发票号'))
        } else {
          callback();
        }
      }
    };
    return {
      budgetForm: {
        budgetDept: [],
        payTypeCode: '',
        invoiceNum: '',
        appMoney: ''
      },
      budgetRule: {
        budgetDept: [{ type: 'array', required: true, message: '请选择预算机构/科目', trigger: 'blur' }],
        payTypeCode: [{ required: true, message: '请选择付款类型', trigger: 'blur' }],
        invoiceNum: [{ required: true, message: '请输入发票号', validator: checkNum, trigger: 'blur' }],
        appMoney: [{ required: true, message: '请输入申请金额', trigger: 'blur' }],
      },
      year: new Date().getFullYear(),
      budgetDeptList: [],
      budgetInfo: '',
      payTypes: [],
      currencyList: [],
      invoiceList: [],
      activeCurrency: '',
      activeInvoice: '',
      budgetTable: [],
      paymentForm: {
        supplierIds: [],
        payMthodCode: '',
        paymentOthers: '',
        contractAttach: [],
        invoiceAttach: [],
        feeType: [],
        isAdvancePayment: '0'
      },
      paymentRule: {
        contractCode: [{ required: true, message: '请选择合同类型', trigger: 'blur' }],
        payMthodCode: [{ required: true, message: '请选择付款方式', trigger: 'blur' }],
        supplierIds: [{ type: 'array', required: true, message: '请选择发文目录', trigger: 'blur' }],
        paymentOthers: [{ required: true, trigger: 'blur', message: '请输入付款方式' }],
        feeType: [{ type: 'array', required: true, trigger: 'blur', message: '请选费用类型' }],
        isAdvancePayment: [{ required: true, trigger: 'blur' }],
        contractAttach: [{ type: 'array', required: true, trigger: 'blur', message: '请选择合同' }],
        invoiceAttach: [{ type: 'array', required: true, trigger: 'blur', message: '请选择发票' }],
      },
      invoiceAttach: [],
      contractAttach: [],
      payMthods: [],
      types: [],
      payMthod: '',
      supplierList: [],
      supplierInfo: '',
      params: '',
      feeTypes: [],
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
      feeTypeProp: {
        label: 'dictName',
        value: 'dictCode',
        children: 'child'
      }
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
      'userInfo'
    ])
  },
  created() {
    this.getPayType(); //付款类型
    this.getBudgetDeptList(); //预算机构/科目
    this.getFileCatalogue(); //收款供应商
    this.getInvoiceList(); //发票类型
    this.getCurrencyList(); //币种
    this.getPayMthod(); //付款方式
    this.getFeeTypes(4); //费用类型
    this.getFeeTypes(5); //费用类型
  },
  methods: {
    submitForm() {
      if (this.budgetTable.length != 0) {
        this.$refs.paymentForm.validate((valid) => {
          if (valid) {
            this.$refs.contractUpload.submit();
          } else {
            this.$message.warning('请检查填写字段')
            this.$emit('submitMiddle', false);
            return false;
          }
        });
      } else {
        this.$message.warning('未添加付款项');
      }
    },
    submitAll() {
      var payMthod = this.payMthods.find(i => i.dictCode == this.paymentForm.payMthodCode);
      var feeType = this.getFeeType();
      var finPayment = {
        "budgetYear": this.year, //预算年份
        "supplierId": this.supplierInfo.id, //供应商id
        "supplierName": this.supplierInfo.supplierName, //供应商名
        "supplierBank": this.supplierInfo.accountBank, //供应商开户银行
        "supplierBankAccountName": this.supplierInfo.accountName, //供应商开户账号名
        "supplierBankAccountCode": this.supplierInfo.accountCode, //供应商开户账号编号
        "totalMoney": this.totalMoney, //合计金额
        "paymentMethodCode": payMthod.dictCode, //付款方式code 
        "paymentMethodName": payMthod.dictName, //付款方式名
        "paymentOthers": this.paymentForm.paymentOthers, //其他付款方式名
        "isAdvancePayment": this.paymentForm.isAdvancePayment, //是否是预付款, 1为是, 0为否
        "isProduction": feeType.pro, //是否是生产类, 1为是,0为否
        "costTypeCode": feeType.dictCode, //费用类型code , FIN04和FIN05 中
        "costTypeName": feeType.dictName //费用类型名
      };
      console.log(this.clone(this.budgetTable));
      var paymentItems = this.clone(this.budgetTable).map(function(b) {
        delete b.currencyCode;
        delete b.appMoney;
        b.invoiceCode = b.invoiceCode.join();
        return b;
      });
      var finFileIds = this.contractAttach.concat(this.invoiceAttach);
      console.log(finPayment, paymentItems, finFileIds);
      this.$emit('submitMiddle', { finPayment: finPayment, paymentItems: paymentItems, finFileIds: finFileIds })
    },
    invoiceTypeChange(code) {
      if (code != 'FIN0201') {
        this.budgetForm.invoiceNum = '';
      }
    },
    handleContractSuccess(res, file) {
      this.contractAttach.push(res.data);
      if (this.contractAttach.length == this.paymentForm.contractAttach.length) {
        this.$refs.invoiceUpload.submit();
      }
    },
    handleContractError(res, file) {
      this.$emit('submitMiddle', false);
      this.$message.error('合同上传失败，请重试');
    },
    handleContractChange(file, fileList) {
      const isLt20M = file.size / 1024 / 1024 < 20;
      if (!isLt20M) {
        this.$message.error('上传合同大小不能超过 20MB!');
      }
      if (isLt20M) {
        this.paymentForm.contractAttach = fileList;
      }
    },

    handleContractRemove() {

    },
    handleInvoiceSuccess(res, file) {
      this.invoiceAttach.push(res.data);
      if (this.invoiceAttach.length == this.paymentForm.invoiceAttach.length) {
        this.submitAll();
      }
    },
    handleInvoiceError(res, file) {
      this.$emit('submitMiddle', false);
      this.$message.error('附件上传失败，请重试');
    },
    handleInvoiceChange(file, fileList) {
      const isLt20M = file.size / 1024 / 1024 < 20;
      if (!isLt20M) {
        this.$message.error('上传发票大小不能超过 20MB!');
      }
      if (isLt20M) {
        this.paymentForm.invoiceAttach = fileList;
      }
    },
    handleInvoiceRemove() {

    },
    addBudget() {
      this.$refs.budgetForm.validate((valid) => {
        if (valid) {
          var dep = this.getBudgetDep();
          var invoice = this.invoiceList.find(i => i.dictCode == this.activeInvoice);
          var payType = this.payTypes.find(i => i.dictCode == this.budgetForm.payTypeCode);
          var currency = this.currencyList.find(c => c.currencyCode == this.activeCurrency)
          var item = {
            "paymentTypeCode": payType.dictCode, //付款申请类型code, DOC04中
            "paymentTypeName": payType.dictName, //付款申请类型名
            "budgetDeptId": dep.budgetDeptCode, //预算部门id
            "budgetDeptName": dep.budgetDeptName, //预算部门名
            "budgetItemId": dep.budgetItemCode, //预算科目id
            "budgetItemName": dep.budgetItemName, //预算科目名
            "money": this.budgetForm.appMoney, //申报金额
            "invoiceTypeCode": invoice.dictCode, //发票类型code, FIN02中
            "invoiceTypeName": invoice.dictName, //发票类型名
            "accurencyName": currency.currencyName, //币种
            "currencyCode": currency.currencyCode,
            "exchangeRateId": "", //汇率id
            "exchangeRate": "", //汇率
            "invoiceCode": this.budgetForm.invoiceNum.split(','), //发票票号, 可以为多个, 用英文逗号分隔
            "rmb": "", //对应的人民币
            "appMoney": this.budgetForm.appMoney,
            "budgetYear": this.year
          }
          this.$http.post('/doc/getRmbByExchangeRate', { currencyId: currency.currencyCode, amount: this.budgetForm.appMoney })
            .then(res => {
              if (res.status == 0) {
                item.rmb = res.data.amount;
                item.exchangeRateId = res.data.rateId;
                item.exchangeRate = res.data.rateReverse;
                if (this.activeInvoice == 'FIN0201') {

                }
                this.budgetTable.push(item);
              } else {
                console.log('货币兑换失败')
              }
            })


        } else {

        }
      })
    },
    deleteBudget(index) {
      this.budgetTable.splice(index, 1);
    },
    tranMoney: _.debounce(function(row) {
      this.$http.post('/doc/getRmbByExchangeRate', { currencyId: row.currencyCode, amount: row.appMoney })
        .then(res => {
          if (res.status == 0) {
            row.rmb = res.data.amount;
          } else {
            console.log('货币兑换失败')
          }
        })
    }, 500),
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
    getPayType() {
      this.$http.post('/api/getDict', { dictCode: 'DOC04' })
        .then(res => {
          if (res.status == '0') {
            this.payTypes = res.data;
          } else {
            console.log('获取付款类型失败')
          }
        }, res => {

        })
    },
    getPayMthod() {
      this.$http.post('/api/getDict', { dictCode: 'FIN01' })
        .then(res => {
          if (res.status == '0') {
            this.payMthods = res.data;
          } else {
            console.log('获取付款方式失败')
          }
        }, res => {

        })
    },
    getFeeTypes(num) {
      this.$http.post('/api/getDict', { dictCode: 'FIN0' + num })
        .then(res => {
          if (res.status == '0') {
            res.data.forEach(r => {
              if (num == 5) {
                r.pro = 1
              } else {
                r.pro = 0
              }
            })
            var item = [{
              dictName: num == 5 ? '生产类' : '非生产类',
              dictCode: num,
              child: res.data
            }]
            this.feeTypes = this.feeTypes.concat(item);
          } else {
            console.log('获取费用类型失败')
          }
        }, res => {

        })
    },
    getCurrencyList() {
      this.$http.post('/doc/getCurrency')
        .then(res => {
          if (res.status == '0') {
            this.currencyList = res.data;
            this.activeCurrency = res.data[0].currencyCode;
          } else {
            console.log('获取币种失败')
          }
        }, res => {

        })
    },
    getInvoiceList() {
      this.$http.post('/api/getDict', { dictCode: 'FIN02' })
        .then(res => {
          if (res.status == '0') {
            this.invoiceList = res.data;
            this.activeInvoice = res.data[0].dictCode;
          } else {
            console.log('获取发票类型失败')
          }
        }, res => {

        })
    },
    getFileCatalogue() {
      this.$http.post('/doc/getSupplier')
        .then(res => {
          if (res.status == '0') {
            res.data.forEach((s, index) => {
              s.id = s.supplierName;
            })
            console.log(res.data)
            this.supplierList = res.data;
          } else {
            console.log('获取供应商失败')
          }
        })
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
    depChange(val) {
      if (val.length>0) {
        this.$http.post('/doc/getExecStatisofItemId', { budgetYear: this.year, budgetItemCode: val[val.length - 1] })
          .then(res => {
            if (res.status == 0) {
              this.budgetInfo = res.data;
            } else {

            }
          })
      }else{
        this.budgetInfo=''
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
    },
    getFeeType() {
      var len = this.paymentForm.feeType.length;
      var temp = this.feeTypes;
      for (var i = 0; i < len; i++) {
        temp = temp.find(s => s.dictCode == this.paymentForm.feeType[i]);
        if (temp.child && temp.child.length != 0) {
          temp = temp.child;
        }
      }
      return temp
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
  }
}

</script>
<style lang='scss'>
$main:#0460AE;
.paymentApp {
  // .el-input {
  //   width: 100%;
  // }
  .myRadio {
    .el-radio-button__inner {
      width: 60px;
      line-height: 45px;
      height: 45px;
      padding: 0;
    }
  }
  .width60 {
    float: left;
    width: 60%;
  }
  .width40 {
    float: left;
    width: 40%;
    .el-form-item__label {
      padding-left: 30px;
    }
  }
  .widthLeft40 {
    float: left;
    width: 40%;
  }
  .year {
    .el-form-item__content {

      font-size: 16px;
      line-height: 45px;
      padding-left: 10px;
    }
  }
  .invoiceNum {
    line-height: 15px;
  }
  .widthRight60 {
    float: left;
    width: 60%;
    .el-form-item__label {
      // padding-left: 30px;
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
  .supplierInfo {
    background: #F7F7F7;
    font-size: 15px;
    color: $main;
    margin-bottom: 20px;
    li {
      float: left;
      width: 60%;
      text-align: center;
      line-height: 54px;
      &:nth-child(2) {
        width: 40%;
        border-left: 1px solid #D5DADF;
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
}

</style>
