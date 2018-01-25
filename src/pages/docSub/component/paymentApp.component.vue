<template>
  <div class="paymentApp">
    <el-form label-position="left" :model="paymentForm" :rules="paymentRule" ref="paymentForm" label-width="128px">
      <el-form-item label="预算年份" class="widthLeft40 year">
        {{year}}
      </el-form-item>
      <el-form-item label="付款类型" prop="payTypeCode" placeholder="" class="widthRight60">
        <el-select v-model="paymentForm.payTypeCode" style="width:100%" ref="contractType" @change="changePayType">
          <el-option v-for="item in payTypes" :key="item.dictCode" :label="item.dictName" :value="item.dictCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="预付款" prop="isAdvancePayment" placeholder="" class="clearBoth">
        <el-radio-group v-model="paymentForm.isAdvancePayment" class="myRadio" @change="isAdvancePaymentChange">
          <el-radio-button label="1">是<i></i></el-radio-button>
          <el-radio-button label="0">否<i></i></el-radio-button>
        </el-radio-group>
        <p class="tipInfo" v-show="paymentForm.isAdvancePayment==1">预付款仅能添加一个付款项</p>
      </el-form-item>
      <el-form label-position="left" :model="budgetForm" :rules="budgetRule" ref="budgetForm" label-width="128px" class="clearBoth">
        <el-form-item label="预算机构/科目" prop="budgetDept" class="clearBoth">
          <el-cascader :clearable="true" :options="budgetDeptList" filterable :props="budgetProp" v-model="budgetForm.budgetDept" :show-all-levels="false" @active-item-change="handleItemChange" @change="depChange" popper-class="myCascader" style="width:100%" :disabled="paymentForm.isAdvancePayment==1"></el-cascader>
        </el-form-item>
        <ul class="budgetInfo clearfix clearBoth" v-show="budgetInfo">
          <li>年度预算{{budgetInfo.budgetTotal | toThousands}}元</li>
          <li>可用预算{{budgetInfo.budgetRemain | toThousands}}元</li>
          <li>预算执行比例{{budgetInfo.execRateStr}}</li>
        </ul>
        <el-form-item label="申请金额" class="deptArea" prop="appMoney" style="width:60%">
          <money-input v-model="budgetForm.appMoney">
            <el-select v-model="activeCurrency" slot="prepend" style="width:90px">
              <el-option :label="currency.currencyName" :value="currency.currencyCode" v-for="currency in currencyList"></el-option>
            </el-select>
            <template slot="append">元</template>
          </money-input>
        </el-form-item>
        <el-form-item label="发票类型" prop="invoiceNum" placeholder="" class="clearBoth">
          <money-input v-model="budgetForm.invoiceNum" :disabled="activeInvoice!='FIN0201'" placeholder="用 , 分割多个票号" :append="false" type="invoice" :maxlength="250">
            <el-select v-model="activeInvoice" slot="prepend" style="width:160px" @change="invoiceTypeChange">
              <el-option v-for="item in invoiceList" :key="item.dictCode" :label="item.dictName" :value="item.dictCode"></el-option>
            </el-select>
          </money-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="addBudget" class="addBudget"><i class="el-icon-plus"></i> 添加付款项</el-button>
        </el-form-item>
      </el-form>
      <div class="appTable clearBoth">
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
          <el-table-column property="money" label="报销金额(元)" width="140">
            <template scope="scope">
              <money-input v-model="scope.row.money" :prepend="false" :append="false" @change="tranMoney(scope.row)"></money-input>
            </template>
          </el-table-column>
          <el-table-column property="accurencyName" label="币种" width="75"></el-table-column>
          <el-table-column property="rmb" label="人民币(元)" width="125" class-name="columnAppMoney">
            <template scope="scope">
              {{scope.row.rmb}}
              <transition name="el-zoom-in-bottom">
                <span class="warnInfo" v-show="!scope.row.rmb">报销金额不能为空</span>
              </transition>
              <transition name="el-zoom-in-bottom">
                <span class="warnInfo" v-show="parseFloat(scope.row.rmb)>scope.row.budegetRemain">不能大于预算可用金额</span>
              </transition>
            </template>
          </el-table-column>
          <el-table-column label=" " width="55">
            <template scope="scope">
              <el-button @click.native.prevent="deleteBudget(scope.$index)" type="text" size="small" icon="delete" v-if="scope.row.budgetItemId!=addTax.budgetItemId||scope.row.invoiceTypeCode != 'FIN0201'">
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

      <el-form-item label="供应商银行信息" prop="supplierInfos" v-if="ifSupplierChange">
       <el-select v-model="paymentForm.supplierInfos"  ref="supplierInfos" @change="changeSelect">
          <el-option :label="item.accountBank+'/'+item.accountCode" :value="item.accountCode" v-for="item in supplierInfo"></el-option>
        </el-select>
      </el-form-item>
      <div v-show="ifChangeSelect">
      <ul class="supplierInfo clearfix" v-show="supplierInfo" style="width: 750px;" >
        <li>开户银行 {{accountBank}}</li>
        <li>收款账户 {{accountCode}}</li>
      </ul>
      </div>
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
      <el-form-item label="账号" class="arrArea" v-if="paymentForm.payMthodCode=='FIN0101'&&supplierInfo.accountCode" label-width="100px">
        <el-input v-model="supplierInfo.accountCode" readonly>
        </el-input>
      </el-form-item>
      <el-form-item label="合同" prop="contractAttach" class="clearBoth">
        <el-upload class="myUpload" :action="baseURL+'/doc/uploadDocFinFile'" :data="{docTypeCode:'FKS',finType:1,classify:1}" :on-success="handleContractSuccess" :on-error="handleContractError" ref="contractUpload" :file-list="paymentForm.contractAttach" :on-remove="handleContractRemove" :before-upload="beforeContractUpload">
          <el-button size="small" type="primary">上传合同<i class="el-icon-upload el-icon--right"></i></el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="上传发票" prop="invoiceAttach">
        <el-upload class="myUpload" :action="baseURL+'/doc/uploadDocFinFile'" :data="{docTypeCode:'FKS',finType:1,classify:2}" :on-success="handleInvoiceSuccess" :on-error="handleInvoiceError" ref="invoiceUpload" :file-list="paymentForm.invoiceAttach" :before-upload="beforeInvoiceUpload" :on-remove="handleInvoiceRemove">
          <el-button size="small" type="primary">上传发票<i class="el-icon-upload el-icon--right"></i></el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="费用类型" prop="feeType" placeholder="" class="width60">
        <el-cascader expand-trigger="hover" :options="feeTypes" :props="feeTypeProp" v-model="paymentForm.feeType" style="width:100%" popper-class="myCascader" ref="feeType">
        </el-cascader>
      </el-form-item>
      <!-- <el-form-item label="预付款" prop="isAdvancePayment" placeholder="" class="width40" label-width="110px">
        <el-radio-group v-model="paymentForm.isAdvancePayment" class="myRadio">
          <el-radio-button label="1">是<i></i></el-radio-button>
          <el-radio-button label="0">否<i></i></el-radio-button>
        </el-radio-group>
      </el-form-item> -->
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
        invoiceNum: '',
        appMoney: ''
      },
      budgetRule: {
        budgetDept: [{ type: 'array', required: true, message: '请选择预算机构/科目', trigger: 'blur' }],
        invoiceNum: [{ required: true, message: '请输入发票号', validator: checkNum, trigger: 'blur' }],
        appMoney: [{ required: true, message: '请输入申请金额', trigger: 'blur' }],
      },
      // year: new Date().getFullYear(),
      budgetDeptList: [],
     
      budgetInfo: '',
      payTypes: [],
      currencyList: [],
      accountBank:"",
      accountName:"",
      ifSupplierChange:false,
      ifChangeSelect:false,
      invoiceList: [],
      activeCurrency: '',
      activeInvoice: '',
      budgetTable: [],
      paymentForm: {
        supplierIds: [],
        payMthodCode: '',
        paymentOthers: '',
        contractAttach: [],
        payTypeCode: '',
        invoiceAttach: [],
        feeType: [],
        isAdvancePayment: '0',
        supplierInfos:"",
      },
      paymentRule: {
        supplierInfos: [{ required: true, message: '请选择供应商银行信息', trigger: 'blur' }],
        contractCode: [{ required: true, message: '请选择合同类型', trigger: 'blur' }],
        payMthodCode: [{ required: true, message: '请选择付款方式', trigger: 'blur' }],
        supplierIds: [{ type: 'array', required: true, message: '请选择收款供应商', trigger: 'blur' }],
        paymentOthers: [{ required: true, trigger: 'blur', message: '请输入付款方式' }],
        feeType: [{ type: 'array', required: true, trigger: 'blur', message: '请选费用类型' }],
        isAdvancePayment: [{ required: true, trigger: 'blur' }],
        contractAttach: [{ type: 'array', required: true, trigger: 'blur', message: '请选择合同' }],
        payTypeCode: [{ required: true, message: '请选择付款类型', trigger: 'blur' }],
        invoiceAttach: [{ type: 'array', required: false, trigger: 'blur', message: '请选择发票' }],
      },
      payMthods: [],
      types: [],
      payMthod: '',
      supplierList: [],
      supplierInfo: '',
      params: '',
      feeTypes: [],
      addTax: '',
      draftFirst: false,
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
      },
      isfirst: false,
      prePayTemp: [],
      draftFirst1: false,
      accountCode:"",
      supplierBank:"",
      supplierBankAccountName:"",
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
      return parseFloat(this.numFixed2(num))
    },
    ...mapGetters([
      'submitLoading',
      'baseURL',
      'userInfo',
      'year'
    ])
  },
  created() {

    this.getPayType(); //付款类型
    this.getBudgetDeptList(); //预算机构/科目
    if (!this.$route.params.id) {
      this.getFileCatalogue(); //收款供应商
      this.getPrePayTemp(); //预付款单独项
    }
    this.getInvoiceList(); //发票类型
    this.getCurrencyList(); //币种
    this.getPayMthod(); //付款方式
    this.getFeeTypes(4); //费用类型
    this.getFeeTypes(5); //费用类型
    this.getAddTax() //增值税进项税额
  },
  watch:{
    budgetTable:function(newval){
      if(newval.some(b=>b.invoiceTypeCode==='FIN0201')){
        this.paymentRule.invoiceAttach[0].required=true;
      }else{
        this.paymentRule.invoiceAttach[0].required=false;
      }
    }
  },
  methods: {
    saveForm() {
      console.log(this.ifSupplierChange)
      var params = JSON.stringify({
        bankinfo:{
          ifSupplierChange:this.ifSupplierChange,
          ifChangeSelect:this.ifChangeSelect,
          supplierName:this.supplierName,
          "supplierBank": this.supplierBank, //供应商开户银行
          "supplierBankAccountName": this.supplierBankAccountName, //供应商开户账号名
          "supplierBankAccountCode": this.accountCode, //供应商开户账号编号
          supplierId: this.supplierId, //  供应商id
        },
        budgetTable: this.budgetTable,
        paymentForm: this.paymentForm,
      });
      this.$emit('saveMiddle', params);
    },
    getDraft(obj) {
      if (obj.paymentForm.payTypeCode) {
        this.isfirst = true;
      }
      if (obj.paymentForm.isAdvancePayment == 1) {
        this.draftFirst1 = true;
      }
      this.combineObj(this.paymentForm, obj.paymentForm)
      this.budgetTable = obj.budgetTable;
      if (this.paymentForm.supplierIds.length != 0) {
        this.draftFirst = true;
      }

      this.getFileCatalogue(obj);
      this.getPrePayTemp();
    },
    changePayType(val) {
      if (!this.isfirst) { //草稿箱第一次不调用建议路径模板        
        this.$emit('updateSuggest', val)
      }
      this.isfirst = false;
      this.$store.dispatch('getTemplate',{code:this.$route.params.code,subCode:val});      
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
      
      
      
      var payMthod = this.payMthods.find(i => i.dictCode == this.paymentForm.payMthodCode);
      var payType = this.payTypes.find(i => i.dictCode == this.paymentForm.payTypeCode);
      var feeType = this.getFeeType();

      var finPayment = {
        "paymentTypeCode": payType.dictCode, //付款申请类型code, DOC04中
        "paymentTypeName": payType.dictName, //付款申请类型名
        "budgetYear": this.year, //预算年份
        "supplierId": this.id, //供应商id
        supplierName:this.supplierName,
        "supplierBank": this.accountBank, //供应商开户银行
        "supplierBankAccountName": this.supplierBankAccountName, //供应商开户账号名
        "supplierBankAccountCode": this.accountCode, //供应商开户账号编号
        "totalMoney": this.totalMoney, //合计金额
        "paymentMethodCode": payMthod.dictCode, //付款方式code 
        "paymentMethodName": payMthod.dictName, //付款方式名
        "paymentOthers": this.paymentForm.paymentOthers, //其他付款方式名
        "isAdvancePayment": this.paymentForm.isAdvancePayment, //是否是预付款, 1为是, 0为否
        "isProduction": feeType.pro, //是否是生产类, 1为是,0为否
        "costTypeCode": feeType.dictCode, //费用类型code , FIN04和FIN05 中
        "costTypeName": feeType.dictName //费用类型名
      };
     
     
      
      var paymentItems = this.clone(this.budgetTable).map(function(b) {
        delete b.currencyCode;
        delete b.budegetRemain;
        b.invoiceCode = b.invoiceCode.join();
        return b;
      });
     
      var finFileIds = this.paymentForm.contractAttach.map(c => c.response.data).concat(this.paymentForm.invoiceAttach.map(c => c.response.data));

      this.$http.post('/Supplier/getSupplierBankInfo', { 
          accountCode: this.accountCode
        })
        .then(res => {
          if (res.status == '0') {
            this.supplierName = res.data.supplierName;
            finPayment.supplierId=res.data.id;
            finPayment.supplierName=res.data.supplierName;
            this.$emit('submitMiddle', { finPayment: finPayment, paymentItems: paymentItems, finFileIds: finFileIds })
          } 
        }, res => {

      });
      
    },
    checkBudgetTable() {
      if (this.budgetTable.length != 0) {
        var totalTAX = 0;
        for (var i = 0; i < this.budgetTable.length; i++) {
          var temp = this.budgetTable[i];
          if (temp.budgetItemId == this.addTax.budgetItemId) {
            totalTAX += temp.rmb;
          }
          if (temp.money == '' || temp.rmb > temp.budegetRemain) {
            this.$message.warning('请检查付款项');
            this.$emit('submitMiddle', false);
            return false
          }
        }
        if (totalTAX > this.addTax.remainMoney) {
          this.$message.warning('付款项所有增值税进项税额不能大于增值税进项税额可用预算( ' + this.addTax.remainMoney + ' 元)');
          this.$emit('submitMiddle', false);
          return false
        } else {
          return true
        }
      } else {
        this.$message.warning('未添加付款项');
        this.$emit('submitMiddle', false);
        return false
      }
    },
    isAdvancePaymentChange(val) {
      if (!this.draftFirst1) {
        if (val == 1) {
          this.handleItemChange(this.prePayTemp.slice(0, 1));
          this.budgetForm.budgetDept = this.prePayTemp;
          this.depChange(this.prePayTemp);
          this.budgetTable = [];
        } else {
          this.budgetForm.budgetDept = [];
          this.budgetInfo = '';
          this.budgetTable = [];
        }
      }
    },
    invoiceTypeChange(code) {
      if (code != 'FIN0201') {
        this.budgetForm.invoiceNum = '';
      }
    },
    beforeContractUpload(file) {
      var isJPG;
      if (file.type) {
        isJPG = file.type === 'image/jpeg' || file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      } else {
        var regExp = new RegExp("\.(docx|jpg|pdf)$", "i");
        isJPG = regExp.test(file.name);
      }
      const isLt10M = file.size / 1024 / 1024 < 30;

      if (!isJPG) {
        this.$message.error('上传文件只能是 JPG、DOCX、PDF 格式!');
      }
      if (!isLt10M) {
        this.$message.error('上传文件大小不能超过 30MB!');
      }
      return isJPG && isLt10M;
    },
    handleContractSuccess(res, file, fileList) {
      this.paymentForm.contractAttach = fileList;
    },
    handleContractError(res, file, fileList) {
      this.paymentForm.contractAttach = fileList;
    },

    handleContractRemove(file, fileList) {
      this.paymentForm.contractAttach = fileList;
    },
    beforeInvoiceUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'application/pdf';
      const isLt10M = file.size / 1024 / 1024 < 30;

      if (!isJPG) {
        this.$message.error('上传文件只能是 JPG或PDF 格式!');
      }
      if (!isLt10M) {
        this.$message.error('上传文件大小不能超过 30MB!');
      }
      return isJPG && isLt10M;
    },
    handleInvoiceSuccess(res, file, fileList) {
      this.paymentForm.invoiceAttach = fileList;
    },
    handleInvoiceError(res, file, fileList) {
      this.paymentForm.invoiceAttach = fileList;
    },
    handleInvoiceRemove(file, fileList) {
      this.paymentForm.invoiceAttach = fileList;
    },
    addBudget() {
      this.$refs.budgetForm.validate((valid) => {
        if (valid) {
          var dep = this.getBudgetDep();
          var invoice = this.invoiceList.find(i => i.dictCode == this.activeInvoice);
          var currency = this.currencyList.find(c => c.currencyCode == this.activeCurrency)
          var item = {
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
            "invoiceCode": [], //发票票号, 可以为多个, 用英文逗号分隔
            "rmb": "", //对应的人民币
            "budgetYear": this.year,
            "budegetRemain": this.budgetInfo.budgetRemain
          }
          this.$http.post('/doc/getRmbByExchangeRate', { currencyId: currency.currencyCode, amount: this.budgetForm.appMoney })
            .then(res => {
              if (res.status == 0) {
                item.rmb = res.data.amount;
                item.exchangeRateId = res.data.rateId;
                item.exchangeRate = res.data.rateReverse;
                if (this.checkBuudget(item.rmb)) {
                  this.budgetTable.push(item);
                  if (this.activeInvoice == 'FIN0201') {
                    var taxItem = {
                      "budgetDeptId": this.addTax.deptId, //预算部门id
                      "budgetDeptName": this.addTax.budgetDeptName, //预算部门名
                      "budgetItemId": this.addTax.budgetItemId, //预算科目id
                      "budgetItemName": this.addTax.budgetName, //预算科目名
                      "money": '0', //申报金额
                      "invoiceTypeCode": invoice.dictCode, //发票类型code, FIN02中
                      "invoiceTypeName": invoice.dictName, //发票类型名
                      "accurencyName": currency.currencyName, //币种
                      "currencyCode": currency.currencyCode,
                      "exchangeRateId": res.data.rateId, //汇率id
                      "exchangeRate": res.data.rateReverse, //汇率
                      "invoiceCode": this.budgetForm.invoiceNum.split(','), //发票票号, 可以为多个, 用英文逗号分隔
                      "rmb": 0, //对应的人民币
                      "budgetYear": this.year,
                      "budegetRemain": this.addTax.remainMoney
                    }
                    this.budgetTable.push(taxItem);
                  }
                  this.budgetItemReset();
                }
              } else {
                console.log('货币兑换失败')
              }
            })

        } else {

        }
      })
    },
    deleteBudget(index) {
      if (this.budgetTable[index].invoiceTypeCode == 'FIN0201') {
        this.budgetTable.splice(index, 2);
      } else {
        this.budgetTable.splice(index, 1);
      }
    },
    checkBuudget(rmb) {
      var dep = this.getBudgetDep();
      var temp = this.budgetTable.find(b => b.budgetDeptId == dep.budgetDeptCode && b.budgetItemId == dep.budgetItemCode)
      if (temp == undefined) {
        if (!this.budgetInfo||this.budgetInfo.budgetRemain <= 0 || rmb > this.budgetInfo.budgetRemain) {
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
    budgetItemReset() {
      if (this.budgetForm.isAdvancePayment == 0) {
        this.budgetForm.budgetDept = [];
        this.budgetInfo = '';
      }
      this.budgetForm.invoiceNum = '';
      this.budgetForm.appMoney = '';
      this.activeInvoice = this.invoiceList[0].dictCode;
      this.activeCurrency = this.currencyList[0].currencyCode;
    },
    tranMoney: _.debounce(function(row) {
      this.$http.post('/doc/getRmbByExchangeRate', { currencyId: row.currencyCode, amount: row.money })
        .then(res => {
          if (res.status == 0) {
            row.rmb = res.data.amount;
          } else {
            row.rmb = 0;
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
    getFileCatalogue(obj) {
      if(obj){
        var that=this;
        this.$http.post('/doc/getSupplier', { empId: this.userInfo.empId })
        .then(res => {
          if (res.status == '0') {
            res.data.forEach((s, index) => {
              s.id = s.supplierName;             
            })
            this.supplierList = res.data;
            that.supplierChange(obj);
            // if (this.draftFirst) {
            //   that.supplierChange(obj);
            //   this.draftFirst = false;
            // }
          } else {
            console.log('获取供应商失败')
          }
        })
      }else{
         this.$http.post('/doc/getSupplier', { empId: this.userInfo.empId })
        .then(res => {
          if (res.status == '0') {
            res.data.forEach((s, index) => {
              s.id = s.supplierName;             
            })
            this.supplierList = res.data;
            if (this.draftFirst) {
              this.draftFirst = false;
              this.supplierChange();
            }
          } else {
            console.log('获取供应商失败')
          }
        })
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
       if(val&&val.bankinfo){
        var len = this.paymentForm.supplierIds.length;
        var temp = this.supplierList;
        for (var i = 0; i < len; i++) {
          temp = temp.find(s => s.id == this.paymentForm.supplierIds[i]);
          if (temp.supplier && temp.supplier.length != 0) {
            temp = temp.supplier;
          }
        }
        console.log(val)
        this.$http.post('/Supplier/getSupplierBanks', { supplierBankId: temp.supplierBankId })
        .then(res => {
          if (res.status == 0) {
            this.supplierInfo =  res.data;
            this.accountBank=val.bankinfo.supplierBank;
            this.supplierBank=val.bankinfo.supplierBank;
            this.accountCode=val.bankinfo.supplierBankAccountCode;
            this.ifChangeSelect=val.bankinfo.ifChangeSelect;
            this.ifSupplierChange=val.bankinfo.ifSupplierChange;
            this.supplierName=val.bankinfo.supplierName;
            this.supplierBankAccountName=val.bankinfo.supplierBankAccountName;
            this.supplierBankAccountCode=val.bankinfo.supplierBankAccountCode;
          } else {
          }
        })
      }else{
      var len = this.paymentForm.supplierIds.length;
      var temp = this.supplierList;
      for (var i = 0; i < len; i++) {
        temp = temp.find(s => s.id == this.paymentForm.supplierIds[i]);
        if (temp.supplier && temp.supplier.length != 0) {
          temp = temp.supplier;
        }
      }
      this.$http.post('/Supplier/getSupplierBanks', { supplierBankId: temp.supplierBankId })
          .then(res => {
            if (res.status == 0) {
              this.supplierInfo =  res.data;
              this.accountBank="";
              this.accountCode="";
              if(res.data.length==1){
                 this.supplierBank=res.data[0].accountBank;
                 this.supplierBankAccountName=res.data[0].accountName;
                 this.accountBank=res.data[0].accountBank;
                 this.accountCode=res.data[0].accountCode;
                 this.ifSupplierChange=false;
                 this.ifChangeSelect=true;
              }else{
                this.ifSupplierChange=true;
                this.ifChangeSelect=false;
              }
            } else {
            }
          })
      }
     
    },
    changeSelect() {
      this.ifChangeSelect=true;
      if(this.$refs.supplierInfos.selectedLabel.indexOf("/")>0){
        this.accountBank=this.$refs.supplierInfos.selectedLabel.split("/")[0];
        this.supplierBank=this.$refs.supplierInfos.selectedLabel.split("/")[0];
      }else{
         this.accountBank=this.$refs.supplierInfos.selectedLabel;
         this.supplierBank=this.$refs.supplierInfos.selectedLabel;
      }
      this.accountCode=this.$refs.supplierInfos.value;
      var that=this;
      this.$http.post('/Supplier/getSupplierBankInfo', { accountCode:this.$refs.supplierInfos.value })
      .then(res => {
        if (res.status == 0) {
          that.supplierBankAccountName=res.data.accountName;
          that.supplierName=res.data.supplierName;
          that.ifChangeSelect=true;
        } else {
        }
      })
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
    getAddTax() {
      this.$http.post('/doc/addValueTax', { budgetYear: this.year })
        .then(res => {
          if (res.status == 0) {
            this.addTax = res.data[0];
          } else {

          }
        })
    },
    getPrePayTemp() {
      this.$http.post('/doc/getOneBudgetItemCode', { budgetYear: this.year })
        .then(res => {
          if (res.status == 0) {
            this.prePayTemp = res.data.budgetItemIds;
            if (this.draftFirst1) {
              this.draftFirst1 = false;
              this.handleItemChange(this.prePayTemp.slice(0, 1));
              this.budgetForm.budgetDept = this.prePayTemp;
              this.depChange(this.prePayTemp);
            }
          } else {

          }
        })
    }
  }
}

</script>
<style lang='scss'>
$main:#0460AE;
.paymentApp {
  // .el-input {
  //   width: 100%;
  // }
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
  .addBudget {
    width: 220px;
    height: 45px;
  }
  .appTable {
    width: 750px;
    margin-bottom: 20px;
    td {
      height: 60px;
      &.columnAppMoney {
        .cell {
          height: 60px;
          line-height: 60px;
        }
        .el-input__inner {
          height: 30px;
        }
        .warnInfo {
          position: absolute;
          bottom: 0;
          left: 18px;
          color: #ff4949;
          font-size: 12px;
          line-height: 1;
          white-space: nowrap;
        }
      }
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
