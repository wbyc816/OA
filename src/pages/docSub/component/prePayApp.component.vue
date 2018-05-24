<template>
  <div class="prePayApp">
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
      <el-form-item label="申请金额" class="deptArea" style="width:61%" prop="appMoney">
        <money-input v-model="budgetForm.appMoney">
          <el-select v-model="activeCurrency" slot="prepend" style="width:90px">
            <el-option :label="currency.currencyName" :value="currency.currencyCode" v-for="currency in currencyList"></el-option>
          </el-select>
          <template slot="append">元</template>
        </money-input>
      </el-form-item>
      <el-form-item label="发票类型" prop="invoiceNum" placeholder="" class="clearBoth">
        <money-input v-model="budgetForm.invoiceNum" :disabled="activeInvoice!='FIN0201'" placeholder="用 , 分割多个票号" :append="false" type="invoice" :maxlength="1000">
          <el-select v-model="activeInvoice" slot="prepend" style="width:160px" @change="invoiceTypeChange">
            <el-option v-for="item in invoiceList" :key="item.dictCode" :label="item.dictName" :value="item.dictCode"></el-option>
          </el-select>
        </money-input>
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
    <el-form label-position="left" :model="paymentForm" :rules="paymentRule" ref="paymentForm" label-width="128px">
      <el-form-item label="预付款公文" prop="docs">
        <el-col :span='21' class="docs" style="left: -6px;position: relative;">
          <div class="docsBox">
            <el-tag type="gray" v-for="(doc,index) in paymentForm.docs" :closable="true" @close="clearDoc(index)">{{doc.docTitle}}</el-tag>
          </div>
        </el-col>
        <el-col :span='3'>
          <el-button class="addButton" @click="addDoc"> <i class="el-icon-plus"></i></el-button>
        </el-col>
      </el-form-item>
      <div class="appTable">
        <el-table :data="paymentForm.docs" :stripe="true" highlight-current-row style="width: 100%" empty-text="未添加公文">
          <el-table-column property="supplierName" label="供应商"></el-table-column>
          <el-table-column property="paymentMethodName" label="付款方式" width="120"></el-table-column>
          <el-table-column property="supplierBank" label="开户行" width="130"></el-table-column>
          <el-table-column property="supplierBankAccountName" label="收款账户" width="120"></el-table-column>
          <el-table-column property="costTypeName" label="费用类型" width="125"></el-table-column>
        </el-table>
      </div>
      <el-form-item label="上传发票" prop="invoiceAttach" class="clearBoth">
        <el-upload class="myUpload" :action="baseURL+'/doc/uploadDocFinFile'" :data="{docTypeCode:'YFK',finType:3,classify:2}" :on-success="handleInvoiceSuccess" :on-error="handleInvoiceError" :before-upload="beforeInvoiceUpload" :file-list="paymentForm.invoiceAttach" ref="invoiceUpload" :on-remove="handleInvoiceRemove">
          <el-button size="small" type="primary">上传发票<i class="el-icon-upload el-icon--right"></i></el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="dialogTableVisible" size="large" class="docDialog">
      <div class="topSearch clearfix">
        <p class="tips">选择公文</p>
      </div>
      <search-options @search="setOptions" :notype="true"></search-options>
      <el-table :data="extraDocs" class="myTable searchRes" :height="250" v-loading="searchLoading" @selection-change="handleSelectionChange" :row-key="rowKey" ref="dialogTable">
        <el-table-column type="selection" width="55" :reserve-selection="true"></el-table-column>
        <el-table-column prop="docTitle" label="标题" width="310"></el-table-column>
        <el-table-column prop="taskName" label="呈报人" width="150"></el-table-column>
        <el-table-column prop="taskTime" label="呈报时间">
          <template scope="scope">
            {{scope.taskTime | time('all')}}
          </template>
        </el-table-column>
      </el-table>
      <div class="pageBox">
        <el-pagination @current-change="handleCurrentChange" :current-page="params.pageNumber" :page-size="5" layout="total, prev, pager, next, jumper" :total="totalSize" v-show="extraDocs.length>0">
        </el-pagination>
        <el-button size="small" type="primary" @click="confirmDocs">选中</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import SearchOptions from '../../../components/searchOptions.component'
import MoneyInput from '../../../components/moneyInput.component'
import { mapGetters } from 'vuex'
import _ from 'lodash'

export default {
  components: { SearchOptions, MoneyInput },
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
      currencyList: [],
      invoiceList: [],
      activeCurrency: '',
      activeInvoice: '',
      budgetTable: [],
      paymentForm: {
        invoiceAttach: [],
        docs: []
      },
      paymentRule: {
        invoiceAttach: [{ type: 'array', required: true, trigger: 'blur', message: '请选择发票' }],
        docs: [{ type: 'array', required: true, trigger: 'blur', message: '请选择预付款公文' }],
      },
      invoiceAttach: [],
      budgetProp: {
        label: 'budgetItemName',
        value: 'budgetItemCode',
        children: 'items'
      },
      dialogTableVisible: false,
      extraDocs: [],
      totalSize: 0,
      searchOptions: '',
      addTax: '',
      searchLoading: false,
      params: {
        "pageNumber": 1,
        "pageSize": 5
      },
      docInfo: '',
      docsTemp: [],
      initData:false,
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
    this.getBudgetDeptList(); //预算机构
    this.getInvoiceList(); //发票类型
    this.getCurrencyList(); //币种
    this.getAddTax() //增值税进项税额
  },
  mounted() {

  },
  methods: {
    saveForm() {
      this.$emit('saveMiddle', JSON.stringify({ budgetTable: this.budgetTable, paymentForm: this.paymentForm }));
    },
    getDraft(obj) {
      this.budgetTable = obj.budgetTable;
      this.paymentForm = obj.paymentForm;
    },
    confirmDocs() {
      if (this.paymentForm.docs.length != 0) {
        this.dialogTableVisible = false;
      } else {
        this.$message.warning('请至少选择一个公文再提交！')
      }
    },
    rowKey(row) {
      return row.docId
    },
    handleSelectionChange(val) {
      this.paymentForm.docs = val;
    },
    addDoc() {
      this.dialogTableVisible = true;
      this.getDoc();
    },
    clearDoc(index) {
      this.paymentForm.docs.splice(index, 1);
    },
    setOptions(options) {
      this.searchOptions = options;
      this.params.pageNumber = 1;
      this.getDoc();
    },
    getDoc() {
      this.searchLoading = true;
      var params = Object.assign({ userId: this.userInfo.empId }, this.params, this.searchOptions);
      this.$http.post("/doc/advanceDocument", params, { body: true }).then(res => {
        setTimeout(function() {
          this.searchLoading = false;
        }.bind(this), 200)
        if (res.status == 0) {
          this.extraDocs = res.data.records;
          this.totalSize = res.data.total;
        } else {
          this.extraDocs = [];
          this.totalSize = 0;
        }
        if(this.initData&&this.paymentForm.docs.length!=0){    //初始化公文表格
          this.$refs.dialogTable.store.states.selection=this.clone(this.paymentForm.docs);
          this.initData=false;
        }
      }, res => {

      })
    },
    handleCurrentChange(page) {
      this.params.pageNumber = page;
      this.getDoc()
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
      var items = this.clone(this.budgetTable).map(function(b) {
        delete b.currencyCode;
        b.receiptTicket = b.invoiceCode.join();
        delete b.budegetRemain;
        delete b.invoiceCode;
        return b;
      });
      var verificationPays = this.paymentForm.docs.map(function(d) {
        return {
          "budgetYear": d.budgetYear, //预算年度
          "paymentDocId": d.docId, //预付款申请公文id
          "paymentDocName": d.docTitle, //预付款申请公文名
          "paymentSupplierId": d.supplierId, //预付款-供应商id
          "paymentSupplierName": d.supplierName, //预付款-供应商名
          "paymentSupplierBank": d.supplierBank, //预付款-供应商开户银行
          "paymentSupplierAccountName": d.supplierBankAccountName, //预付款-供应商开户名
          "paymentSupplierAccountCode": d.supplierBankAccountCode, //预付款-供应商开户号
          "paymentIsProduction": d.isProduction, //是否是生产类, 1为是 0为否
          "paymentMethodCode": d.paymentMethodName, //付款方式
          "costTypeCode": d.costTypeCode, //费用类型code , FIN04和FIN05 中
          "costTypeName": d.costTypeName, // 费用类型名
          "totalMoney": d.totalMoney
        }
      })
      var verification = {
        budgetYear: this.year
      }
      // console.log(this.clone(this.budgetTable));
      var finFileIds = this.paymentForm.invoiceAttach.map(c => c.response.data);
      this.$emit('submitMiddle', { verification: verification, items: items, verificationPays: verificationPays, finFileIds: finFileIds })
    },
    checkBudgetTable() {
      if (this.budgetTable.length != 0) {
        var totalTAX = 0;
        for (var i = 0; i < this.budgetTable.length; i++) {
          var temp = this.budgetTable[i];          
          if(temp.budgetItemId==this.addTax.budgetItemId){
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
            "budegetRemain": this.budgetInfo.budgetRemain,
            "budgetYear": this.year
          }
          this.$http.post('/doc/getRmbByExchangeRate', { currencyId: currency.currencyCode, amount: this.budgetForm.appMoney })
            .then(res => {
              if (res.status == 0) {
                item.rmb = res.data.amount;
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
.prePayApp {
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
  .docDialog {
    .el-dialog--large {
      width: 800px;
      top: 50%!important;
      transform: translate(-50%, -50%);
      margin-top: 0;
      .el-dialog__header {
        display: none;
      }
      .el-dialog__body {
        padding: 0;
      }
    }
    .topSearch {
      padding: 10px;
      line-height: 47px;
      .tips {
        float: left;
        font-size: 18px;
        span {
          font-size: 14px;
          margin-left: 5px;
        }
      }
    }
    .searchOptions {
      .el-card {
        box-shadow: none;
        padding-bottom: 0;
        margin-bottom: 0;
      }
      .el-card__body .el-col {
        margin-bottom: 13px;
        margin-top: 0;
      }
    }
    .myTable {
      &:before {
        display: none;
      }
      .selDoc {
        cursor: not-allowed;
        background-color: #eef1f6;
        .cell {
          color: #bfcbd9;
        }
      }
      tr {
        cursor: pointer;
      }
    }
    .pageBox {
      overflow: hidden;
      padding-right: 10px;
      padding-top: 5px;
      padding-bottom: 5px;
      border-bottom: 1px solid #D5DADF;
      .el-pagination {
        float: left;
      }
      .el-button {
        float: right;
        width: 100px;
      }
    }
  }
  .docs {
    .docsBox {
      min-height: 45px;
      border-bottom: 1px solid #D5DADF;
      padding-top: 10px;
      .el-tag {
        display: block;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 14px;
        position: relative;
        padding-right: 20px;
        .el-icon-close {
          position: absolute;
          top: 2px;
          right: 2px;
        }
      }
    }
  }
}

</style>
