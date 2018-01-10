<template>
  <div class="reimburseApp">
    <el-form label-position="left" :model="paymentForm" :rules="paymentRule" ref="paymentForm" label-width="128px">
      <el-form-item label="预算年份" class="widthLeft40 year">
        {{year}}
      </el-form-item>
      <el-form-item label="报销类型" prop="payTypeCode" placeholder="" class="widthRight60">
        <el-select v-model="paymentForm.payTypeCode" style="width:100%" ref="contractType" @change="changePayType">
          <el-option v-for="item in payTypes" :key="item.dictCode" :label="item.dictName" :value="item.dictCode">
          </el-option>
        </el-select>
        <p class="tipInfo">更改报销类型会清</br>空已添加付款项</p>
      </el-form-item>
      <el-form label-position="left" :model="budgetForm" :rules="budgetRule" ref="budgetForm" label-width="128px" class="clearBoth">
        <el-form-item label="预算机构/科目" prop="budgetDept" class="">
          <el-cascader :clearable="true" filterable :options="budgetDeptList" :props="budgetProp" v-model="budgetForm.budgetDept" :show-all-levels="false" @active-item-change="handleItemChange" @change="depChange" popper-class="myCascader" style="width:100%"></el-cascader>
        </el-form-item>
        <ul class="budgetInfo clearfix clearBoth" v-show="budgetInfo">
          <li>年度预算{{budgetInfo.budgetTotal | toThousands}}元</li>
          <li>可用预算{{budgetInfo.budgetRemain | toThousands}}元</li>
          <li>预算执行比例{{budgetInfo.execRateStr}}</li>
        </ul>
        <el-form-item label="申请金额" class="deptArea" prop="appMoney" style="width:60%">
          <money-input v-model="budgetForm.appMoney" class="hasUnit">
            <el-select v-model="activeCurrency" slot="prepend" style="width:90px">
              <el-option :label="currency.currencyName" :value="currency.currencyCode" v-for="currency in currencyList"></el-option>
            </el-select>
            <template slot="append">元</template>
          </money-input>
        </el-form-item>
        <el-form-item label="发票类型" prop="invoiceNum" placeholder="" class="clearBoth">
          <money-input v-model="budgetForm.invoiceNum" :disabled="activeInvoice!='FIN0201'" placeholder="用 , 分割多个票号" :append="false" type="invoice" :maxlength="250">
            <el-select v-model="activeInvoice" slot="prepend" style="width:160px" @change="invoiceTypeChange">
              <el-option v-for="item in invoiceList" :key="item.dictCode" :label="item.dictName" :value="item.dictCode" :disabled="item.dictCode==='FIN0201'&&(paymentForm.payTypeCode==='DOC0504'||paymentForm.payTypeCode==='DOC0505')"></el-option>
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
          <el-table-column property="rmb" label="人民币(元)" width="135" class-name="columnAppMoney">
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
              <el-button @click.native.prevent="deleteBudget(scope.$index)" type="text" size="small" icon="delete" v-if="scope.row.budgetItemId!=addTax.budgetItemId||scope.row.receiptTypeCode != 'FIN0201'">
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <p class="totalMoney">合计金额 人民币 <span>{{totalMoney | toThousands}}元 {{totalMoney | moneyCh}}</span></p>
      </div>
      <el-form-item label="付款方式" prop="payMthodCode" placeholder="" class="deptArea" style="width:51%">
        <el-select v-model="paymentForm.payMthodCode" style="width:100%" ref="contractType" @change="payMthodChange">
          <el-option v-for="item in payMthods" :key="item.dictCode" :label="item.dictName" :value="item.dictCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="其他" prop="paymentOthers" class="arrArea" v-if="paymentForm.payMthodCode=='FIN0104'" label-width="100px" style="width:49%">
        <el-input v-model="paymentForm.paymentOthers">
        </el-input>
      </el-form-item>
      <template v-if="paymentForm.payMthodCode=='FIN0101'">
        <el-form-item label="收款人" prop="payee" class="deptArea" style="width:51%">
          <el-autocomplete v-model="paymentForm.payee" :fetch-suggestions="querySearchAsync" placeholder="请输入内容" @select="handleSelect" :props="testprops" ref="payee"></el-autocomplete>
        </el-form-item>
        <el-form-item label="收款账户" prop="bankAccount" class="arrArea" style="width:49%" label-width="100px">
          <money-input v-model="paymentForm.bankAccount" :maxlength="50" :prepend="false" :append="false" type="bankCode"></money-input>
        </el-form-item>
      </template>
      <el-form-item label="上传发票" prop="invoiceAttach" class="clearBoth">
        <el-upload class="myUpload" :action="baseURL+'/doc/uploadDocFinFile'" :data="{docTypeCode:'BXS',finType:2,classify:2}" :on-success="handleInvoiceSuccess" :on-error="handleInvoiceError" :before-upload="beforeInvoiceUpload" :file-list="paymentForm.invoiceAttach" ref="invoiceUpload" :on-remove="handleInvoiceRemove">
          <el-button size="small" type="primary">上传发票<i class="el-icon-upload el-icon--right"></i></el-button>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import MoneyInput from '../../../components/moneyInput.component'
import _ from 'lodash'

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
      invoiceList: [],
      activeCurrency: '',
      activeInvoice: '',
      budgetTable: [],
      timeout: null,
      paymentForm: {
        payMthodCode: '',
        payTypeCode: '',
        paymentOthers: '',
        invoiceAttach: [],
        payee: '',
        bankAccount: '',
        empId: '',
      },
      paymentRule: {
        payMthodCode: [{ required: true, message: '请选择付款方式', trigger: 'blur' }],
        paymentOthers: [{ required: true, trigger: 'blur', message: '请输入付款方式' }],
        contractAttach: [{ type: 'array', required: true, trigger: 'blur', message: '请选择合同' }],
        invoiceAttach: [{ type: 'array', required: true, trigger: 'blur', message: '请选择发票' }],
        bankAccount: [{ required: true, trigger: 'blur', message: '请输入收款账户' }],
        payee: [{ required: true, trigger: 'blur', message: '请选择收款人' }],
        payTypeCode: [{ required: true, message: '请选择报销类型', trigger: 'blur' }],
      },
      invoiceAttach: [],
      payMthods: [],
      types: [],
      payMthod: '',
      addTax: '',
      params: '',
      budgetProp: {
        label: 'budgetItemName',
        value: 'budgetItemCode',
        children: 'items'
      },
      testprops: {
        value: "name",
        label: "name"
      },
      payees: [],
      isDraft: false,
      isfirst: false
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
    this.getPayType(); //报销类型
    this.getBudgetDeptList(); //预算机构
    this.getInvoiceList(); //发票类型
    this.getCurrencyList(); //币种
    this.getPayMthod(); //付款方式
    this.getAddTax() //增值税进项税额
  },
  mounted() {},
  methods: {
    changePayType(val) {
      if (!this.isfirst) { //草稿箱第一次不调用建议路径模板  
        this.$emit('updateSuggest', val)
        this.budgetTable = [];
      }
      this.isfirst = false;
      if (val === 'DOC0504' || val === 'DOC0505') {
        this.budgetForm.invoiceNum = '';
        this.activeInvoice = 'FIN0202';
      }
    },
    saveForm() {
      var params = JSON.stringify({
        budgetTable: this.budgetTable,
        paymentForm: this.paymentForm,
      });
      this.$emit('saveMiddle', params);
    },
    getDraft(obj) {
      if (obj.paymentForm.payTypeCode) {
        this.isfirst = true;
      }
      if (obj.paymentForm.payMthodCode == 'FIN0101') {
        this.isDraft = true;
      }
      this.combineObj(this.paymentForm, obj.paymentForm);
      this.budgetTable = obj.budgetTable;
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
      var tDocFinReimbursementItems = this.clone(this.budgetTable).map(function(b) {
        delete b.currencyCode;
        b.receiptTicket = b.invoiceCode.join();
        delete b.budegetRemain;
        delete b.invoiceCode;
        return b;
      });
      var tDocFinReimbursement = {
        "budgetYear": this.year,
        "docTypeCode": payType.dictCode, //付款申请类型code, DOC04中
        "docTypeName": payType.dictName, //付款申请类型名
        "paymentMethodCode": payMthod.dictCode, //付款方式code 
        "paymentMethodName": payMthod.dictName, //付款方式名
        "paymentOthers": this.paymentForm.paymentOthers, //其他付款方式名
        "payeeEmpId": this.paymentForm.empId,
        "payeeName": this.paymentForm.payee,
        "payeeAccount": this.paymentForm.bankAccount,
        "tDocFinReimbursementItems": tDocFinReimbursementItems
      }
      // console.log(this.clone(this.budgetTable));
      var finFileIds = this.paymentForm.invoiceAttach.map(c => c.response.data);
      console.log(tDocFinReimbursement, finFileIds);
      this.$emit('submitMiddle', { tDocFinReimbursement: tDocFinReimbursement, finFileIds: finFileIds })
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
    invoiceTypeChange(code) {
      if (code != 'FIN0201') {
        this.budgetForm.invoiceNum = '';
      }
    },
    querySearchAsync(queryString, cb) {
      clearTimeout(this.timeout);
      var that = this;
      this.timeout = setTimeout(() => {
        that.$http.post('/emp/queryEmpDeptList', { name: that.paymentForm.payee, pageSize: 100, })
          .then(res => {
            if (res.status == 0) {
              if (res.empVoList) {
                cb(res.empVoList)
              } else {
                cb([])
              }
            } else {
              cb([])
            }
          })
      }, 600);

    },
    handleSelect(item) {
      this.getEmpBankAccount(item.empId);
      this.paymentForm.empId = item.empId
    },
    getEmpBankAccount(Id) {
      if (!this.isDraft) {
        this.$http.post('/doc/getEmpBankAccount', { empId: Id })
          .then(res => {
            if (res.status == 0) {
              this.paymentForm.bankAccount = res.data.data.bankAccount;
              this.paymentForm.payee = res.data.data.empName;
            }
          })
      }
      this.isDraft = false;
    },
    beforeInvoiceUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'application/pdf';
      const isLt10M = file.size / 1024 / 1024 < 10;

      if (!isJPG) {
        this.$message.error('上传文件只能是 JPG或PDF 格式!');
      }
      if (!isLt10M) {
        this.$message.error('上传文件大小不能超过 10MB!');
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
      this.$refs.paymentForm.validateField('payTypeCode', error => {
        if (!error) {
          this.$refs.budgetForm.validate((valid) => {
            if (valid) {
              var dep = this.getBudgetDep();
              var invoice = this.invoiceList.find(i => i.dictCode == this.activeInvoice);
              var currency = this.currencyList.find(c => c.currencyCode == this.activeCurrency);
              var item = {
                "budgetDeptId": dep.budgetDeptCode, //预算部门id
                "budgetDeptName": dep.budgetDeptName, //预算部门名
                "budgetItemId": dep.budgetItemCode, //预算科目id
                "budgetItemName": dep.budgetItemName, //预算科目名
                "money": this.budgetForm.appMoney, //申报金额
                "receiptTypeCode": invoice.dictCode, //发票类型code, FIN02中
                "receiptTypeName": invoice.dictName, //发票类型名
                "accurencyName": currency.currencyName, //币种
                "currencyCode": currency.currencyCode,
                "invoiceCode": [], //发票票号, 可以为多个, 用英文逗号分隔
                "rmb": "", //对应的人民币
                "budgetYear": this.year,
                "exchangeRateId": "", //汇率id
                "exchangeRate": "", //汇率
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
                          "money": "0", //申报金额
                          "receiptTypeCode": invoice.dictCode, //发票类型code, FIN02中
                          "receiptTypeName": invoice.dictName, //发票类型名
                          "accurencyName": currency.currencyName, //币种
                          "currencyCode": currency.currencyCode,
                          "invoiceCode": this.budgetForm.invoiceNum.split(','), //发票票号, 可以为多个, 用英文逗号分隔
                          "rmb": 0, //对应的人民币
                          "budgetYear": this.year,
                          "exchangeRateId": res.data.rateId, //汇率id
                          "exchangeRate": res.data.rateReverse, //汇率
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
        }
      })
    },
    checkBuudget(rmb) {
      var dep = this.getBudgetDep();
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
    budgetItemReset() {
      this.budgetForm.budgetDept = [];
      this.budgetForm.invoiceNum = '';
      this.budgetForm.appMoney = '';
      this.budgetInfo = '';
      this.activeInvoice = this.invoiceList[0].dictCode;
      this.activeCurrency = this.currencyList[0].currencyCode;
    },
    deleteBudget(index) {
      if (this.budgetTable[index].receiptTypeCode == 'FIN0201') {
        this.budgetTable.splice(index, 2);
      } else {
        this.budgetTable.splice(index, 1);
      }
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
      this.$http.post('/api/getDict', { dictCode: 'DOC05' })
        .then(res => {
          if (res.status == '0') {
            this.payTypes = res.data;
          } else {
            console.log('获取报销类型失败')
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
    payMthodChange(val) {
      if (val == 'FIN0101') {
        this.getEmpBankAccount(this.userInfo.empId);
        this.paymentForm.empId = this.userInfo.empId;
      } else {
        this.paymentForm.empId = '';
        this.paymentForm.bankAccount = '';
        this.paymentForm.payee = '';
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
    getAddTax() {
      this.$http.post('/doc/addValueTax', { budgetYear: this.year })
        .then(res => {
          if (res.status == 0) {
            this.addTax = res.data[0];
          } else {

          }
        })
    }
  }
}

</script>
<style lang='scss'>
$main:#0460AE;
.reimburseApp {
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
    .tipInfo {
      position: absolute;
      left: 101%;
      font-size: 13px;
      color: #9a9a9a;
      line-height: 15px;
      top: 7px;
      white-space: nowrap;
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
