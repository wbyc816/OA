<template>
  <div class="airSellApp">
    <h4 class='doc-form_title'>合同信息</h4>
    <el-form label-position="left" :model="contractForm" :rules="contractRule" ref="contractForm" label-width="128px">
      <el-form-item label="合同子类型" prop="contractCode" placeholder="" class="deptArea">
        <el-select v-model="contractForm.contractCode" style="width:100%" ref="contractCode" @change="typeChange">
          <el-option v-for="item in contractCodeList" :key="item.dictCode" :label="item.dictName" :value="item.dictCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="填表时间" prop="createTime" class="arrArea">
        <el-date-picker v-model="contractForm.createTime" type="date" :editable="false" :clearable="false" style="width:100%" :picker-options="pickerOptions0"></el-date-picker>
      </el-form-item>
      <el-form-item label="合同号" prop="contractNo" class="deptArea">
        <el-input v-model="contractForm.contractNo" :maxlength="200">
        </el-input>
      </el-form-item>
      <el-form-item label="优先级" prop="priority" placeholder="" class="arrArea">
        <el-select v-model="contractForm.priority" style="width:100%">
          <el-option v-for="item in priorityList" :key="item.dictCode" ref="priority" :label="item.dictName" :value="item.dictName">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="收款供应商" prop="supplierIds" class="clearBoth">
        <el-cascader expand-trigger="hover" :options="supplierList" filterable :props="supplierProp" v-model="contractForm.supplierIds" style="width:100%" popper-class="myCascader" @change="supplierChange" ref="supplier">
        </el-cascader>
      </el-form-item>

      <el-form-item label="供应商银行信息" prop="supplierInfos" v-if="ifSupplierChange">
       <el-select v-model="contractForm.supplierInfos"  ref="supplierInfos" @change="changeSelect">
          <el-option :label="item.accountBank+'/'+item.accountCode" :value="item.accountCode" v-for="item in supplierInfo"></el-option>
        </el-select>
      </el-form-item>
      <div v-show="ifChangeSelect">
      <ul class="supplierInfo clearfix" v-show="supplierInfo" style="width: 750px;" >
        <li>开户银行 {{accountBank}}</li>
        <li>收款账户 {{accountCode}}</li>
      </ul>
      </div>

      <!-- <ul class="supplierInfo clearfix" v-show="supplierInfo" style="width: 750px;">
        <li>开户银行 {{supplierInfo.accountBank}}</li>
        <li>银行账号 {{supplierInfo.accountCode}}</li>
      </ul> -->
      <el-form-item label="币种" class="deptArea" prop="currencyId">
        <el-select v-model="contractForm.currencyId" @change="currencyChange">
          <el-option :label="currency.currencyName" :value="currency.currencyCode" v-for="currency in currencyList"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="付款方式" class="arrArea" prop="isAdvancePayment">
        <el-select v-model="contractForm.isAdvancePayment">
          <el-option label="预付" value="1"></el-option>
          <el-option label="后付" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="预付款百分比" prop="advancePaymentPercent" v-if="contractForm.isAdvancePayment==='1'" class="deptArea">
        <money-input v-model="contractForm.advancePaymentPercent" :prepend="false" :max="100">
          <template slot="append">%</template>
        </money-input>
      </el-form-item>
    </el-form>
    <h4 class='doc-form_title clearBoth'>详细信息</h4>
    <el-form label-position="left" :model="budgetForm" :rules="budgetRule" ref="budgetForm" label-width="128px">
      <el-form-item label="预算年份" class="year">
        {{year}}
      </el-form-item>
      <el-form-item label="预算机构/科目" prop="budgetDept">
        <el-cascader :clearable="true" :options="budgetDeptList" :props="budgetProp" v-model="budgetForm.budgetDept" :show-all-levels="false" @active-item-change="handleItemChange" @change="depChange" popper-class="myCascader" style="width:100%"></el-cascader>
      </el-form-item>
      <ul class="budgetInfo clearfix clearBoth" v-show="budgetInfo">
        <li>年度预算{{budgetInfo.budgetTotal | toThousands}}元</li>
        <li>可用预算{{budgetInfo.budgetRemain | toThousands}}元</li>
        <li>预算执行比例{{budgetInfo.execRateStr}}</li>
      </ul>
      <el-form-item label="器材中文名称" prop="airmaterialNameZn">
        <el-input v-model="budgetForm.airmaterialNameZn" :maxlength="20">
        </el-input>
      </el-form-item>
      <el-form-item label="件号" prop="pieceNo" class="deptArea">
        <el-input v-model="budgetForm.pieceNo" :maxlength="20">
        </el-input>
      </el-form-item>
      <el-form-item label="序号" prop="airmaterialCode" class="arrArea">
        <el-input v-model="budgetForm.airmaterialCode" :maxlength="20">
        </el-input>
      </el-form-item>
      <el-form-item label="件状态" prop="pieceStatus" class="deptArea">
        <el-select v-model="budgetForm.pieceStatus">
          <el-option :label="item.dictName" :value="item.dictName" v-for="item in pieceStatusList"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="单位" prop="unit" class="arrArea">
        <el-input v-model="budgetForm.unit" :maxlength="8">
        </el-input>
      </el-form-item>
      <el-form-item label="合同数量" prop="pieceNum" class="deptArea">
        <money-input v-model="budgetForm.pieceNum" type="int" :prepend="false" :append="false" :maxlength="4">
        </money-input>
      </el-form-item>
      <el-form-item label="单价" prop="unitPrice" class="arrArea">
        <money-input v-model="budgetForm.unitPrice" :prepend="false" :append="false">
        </money-input>
      </el-form-item>
      <el-form-item label="总价"  class="offerPrice clearfix clearBoth">
        <money-input v-model="totalPrice" :prepend="false" :append="false" readonly style="width:200px">
        </money-input>
        <el-button type="primary" @click="addBudget"><i class="el-icon-plus"></i> 添加</el-button>
      </el-form-item>
      <div class="appTable clearBoth" style="width:750px">
        <el-table :data="budgetTable" :stripe="true" highlight-current-row style="width:100%" empty-text="未添预算项" class="budgetTable">
          <el-table-column type="expand">
            <template scope="props">
              <div class='tableExpandBox'>
                <div class="width50">
                  <div>
                    <span>预算机构/科目</span>
                    <p>{{props.row.budgetDeptName}}/{{props.row.budgetItemName}}</p>
                  </div>
                  <div>
                    <span>预算年度</span>
                    <p>{{props.row.budgetYear}}</p>
                  </div>
                </div>
                <div class="width50">
                  <div>
                    <span>执行比例</span>
                    <p>{{props.row.excutionRatio}}</p>
                  </div>
                  <div>
                    <span>序号</span>
                    <p>{{props.row.airmaterialCode}}</p>
                  </div>
                </div>
                <div class="width50">
                  <div>
                    <span>件状态</span>
                    <p>{{props.row.pieceStatus}}</p>
                  </div>
                  <div>
                    <span>单位</span>
                    <p>{{props.row.unit}}</p>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column property="airmaterialNameZn" label="器材中文名称"></el-table-column>
          <el-table-column property="pieceNo" label="件号" width="120"></el-table-column>
          <el-table-column property="pieceNum" label="合同数量" width="90"></el-table-column>
          <el-table-column property="unitPrice" label="单价" width="120"></el-table-column>
          <el-table-column property="totalPrice" label="总价" width="150"></el-table-column>
          <el-table-column label="操作" width="55">
            <template scope="scope">
              <el-button @click.native.prevent="deleteBudget(scope.$index)" type="text" size="small" icon="delete">
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <p class="totalMoney">合同总金额 人民币 <span>{{totalRmb | toThousands}}元 {{totalRmb | moneyCh}}</span></p>
      </div>
      <el-form-item label="合同总金额" class="deptArea">
        <el-input v-model="totalMoney" readonly>
        </el-input>
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
      year: new Date().getFullYear(),
      contractForm: {
        createTime: new Date(),
        contractCode: '',
        contractNo: '',
        priority: '',
        supplierIds: [],
        currencyId: '',
        isAdvancePayment: '1',
        advancePaymentPercent: '',
        supplierInfos:"",
      },
      contractRule: {
        supplierInfos: [{ required: true, message: '请选择供应商银行信息', trigger: 'blur' }],
        priority: [{ required: true, message: '请选择优先级', trigger: 'blur' }],
        contractCode: [{ required: true, message: '请选择合同子类型', trigger: 'blur' }],
        advancePaymentPercent: [{ required: true, message: '请输入预付款百分比', trigger: 'blur' }],
        contractNo: [{ required: true, message: '请输入合同号', trigger: 'blur' }],
        supplierIds: [{ type: 'array', required: true, message: '请选择供应商', trigger: 'blur' }],
      },
      budgetForm: {
        "budgetDept": [],
        "airmaterialNameZn": "", //航材中文名称，件号中文名称
        "airmaterialCode": "", //器材编码
        "pieceNo": "", //件号
        "pieceStatus": "", //件状态
        "pieceNum": "", //合同数量 即合同里的件数量
        "unit": "", //单位
        "unitPrice": "", //单价
        // "totalPrice": "", //总价（合同数量*单价）
      },
      budgetRule: {
        pieceNo: [{ required: true, message: '请输入件号', trigger: 'blur' }],
        airmaterialNameZn: [{ required: true, message: '请输器材中文名称', trigger: 'blur' }],
        pieceStatus: [{ required: true, message: '请选择件状态', trigger: 'blur' }],
        pieceNum: [{ required: true, message: '请输入合同数量', trigger: 'blur' }],
        // totalPrice: [{ required: true, message: '请输入总价', trigger: 'blur' }],
        unitPrice: [{ required: true, message: '请输入单价', trigger: 'blur' }],
        budgetDept: [{ type: 'array', required: true, message: '请选择预算机构', trigger: 'blur' }],
      },
      budgetTable: [],
      supplierInfo: '',
      budgetInfo: '',
      id: '',
      contractCodeList: [],
      pieceStatusList:[],
      priorityList: [],
      budgetDeptList: [],
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      supplierProp: {
        value: 'id',
        label: 'supplierName',
        children: 'supplier'
      },
      budgetProp: {
        label: 'budgetItemName',
        value: 'budgetItemCode',
        children: 'items'
      },
      isDraft: false,
      totalRmb: '',
      isfirst: true,
      accountCode:"",
      accountBank:"",
      ifSupplierChange:false,
      ifChangeSelect:false,
      supplierId:"",
    }

  },
  created() {
    if (this.$route.query.id) {
      this.isDraft = true;
    }
    this.getContractCodeList();
    this.getPriorityList();
    if (!this.isDraft) {
      this.getSupplier(); //收款供应商
    }
    this.getCurrencyList();
    this.getBudgetDeptList();
    this.getPieceStatusList();
  },
  computed: {
    totalMoney() {
      var num = 0;
      if (this.budgetTable.length != 0) {
        this.budgetTable.forEach(b => {
          if (b.totalPrice) {
            num += parseFloat(b.totalPrice);
          }
        })
      }
      return num.toFixed(2) || ''
    },
    totalPrice(){
      var num=0;
      if(this.budgetForm.pieceNum&&this.budgetForm.unitPrice){
        num=parseFloat(this.budgetForm.pieceNum)*parseFloat(this.budgetForm.unitPrice)
      }
      return this.numFixed2(num)
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
    totalMoney: function(newval) {
      this.getTotalRmb();
    },
    supplierList: function(newval) {
      if (this.isDraft && this.isfirst) {
        this.supplierChange();
        this.isfirst = false;
      }
    }
  },
  methods: {
    saveForm() {
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
        contractForm: this.contractForm,
      });
      this.$emit('saveMiddle', params);
    },
    getDraft(obj) {
      this.combineObj(this.contractForm, obj.contractForm, ['createTime']);
      this.contractForm.createTime = new Date(obj.contractForm.createTime);
      this.budgetTable = obj.budgetTable;
      if (this.contractForm.supplierIds.length != 0) {
        if (this.supplierList.length == 0) {
          this.getSupplier();
        } else {
          this.supplierChange(obj);
        }
      }
    },
    submitForm() {
      if (this.checkTable()) {
        this.$refs.contractForm.validate((valid) => {
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
    checkTable() {
      if (this.budgetTable.length == 0) {
        this.$message.warning('请填加预算项');
        this.$emit('submitMiddle', false);
        return false;
      }
      return true;
    },
    submitAll() {
      var currency = this.currencyList.find(c => c.currencyCode === this.contractForm.currencyId);
      var airmSell = {
        contractSubtypeCode: this.contractForm.contractCode,
        contractSubtypeName: this.$refs.contractCode.selectedLabel,
        priority: this.contractForm.priority, //  优先级   
        accurencyName: currency.currencyName, // 币种名
        accurencyCode:currency.currencyCode,

        supplierName:this.supplierName,
        supplierBank: this.supplierBank, //供应商开户银行
        supplierBankAccoutName: this.supplierBankAccountName, //供应商开户账号名
        supplierBankAccoutCode: this.accountCode, //供应商开户账号编号
        supplierId: this.supplierId, //  供应商id

        // supplierId: this.supplierInfo.Id, //  供应商id
        // supplierName: this.supplierInfo.supplierName, //  供应商名
        // supplierBank: this.supplierInfo.accountBank, //  供应商开户银行
        // supplierBankAccoutName: this.supplierInfo.accountName, //  供应商开户账号名
        // supplierBankAccoutCode: this.supplierInfo.accountCode, //供应商开户账号编号
        advancePaymentPercent: this.contractForm.advancePaymentPercent, //  预付款百分比
        contractNo: this.contractForm.contractNo, //  合同号
        createTime: Date.parse(this.contractForm.createTime), //   填表日期（创建日期）（推送日期）        
        isAdvancePayment: this.contractForm.isAdvancePayment, //   付款方式,1预付 0后付
        exchangeRateId: currency.exchangeId, //   汇率id
        exchangeRate: currency.exchangeRate, //    汇率
        totalManey: this.totalMoney, //租金合计总价，（所有项次租金总价合计）（借出）
        rmbTotalMoney: this.totalRmb, //人民币总金额
      }
      console.log(airmSell)
      this.$emit('submitMiddle', { airmSell: airmSell, items: this.budgetTable })
    },
    typeChange(val) {
      this.$store.dispatch('getTemplate',{code:this.$route.params.code,subCode:val});      
    },
    getContractCodeList() {
      this.$http.post('/api/getDict', { dictCode: 'DOC19' })
        .then(res => {
          if (res.status == '0') {
            this.contractCodeList = res.data;
          } else {

          }
        }, res => {

        })
    },
    getPriorityList() {
      this.$http.post('/api/getDict', { dictCode: 'DOC16' })
        .then(res => {
          if (res.status == '0') {
            this.priorityList = res.data;
          } else {

          }
        }, res => {

        })
    },
    getPieceStatusList() {
      this.$http.post('/api/getDict', { dictCode: 'DOC17' })
        .then(res => {
          if (res.status == '0') {
            this.pieceStatusList = res.data;
          } else {

          }
        }, res => {

        })
    },
    getSupplier() {
      this.$store.dispatch('getSupplier');
    },
    getCurrencyList() {
      if (this.currencyList.length !== 0) {
        if (!this.isDraft) {
          this.contractForm.currencyId = this.currencyList[0].currencyCode;
        }
      } else {
        this.$store.dispatch('getCurrency')
      }
    },
    supplierChange(val) {
      if(val.bankinfo){
        console.log(val)
        var len = this.contractForm.supplierIds.length;
        var temp = this.supplierList;
      
        for (var i = 0; i < len; i++) {
          temp = temp.find(s => s.id == this.contractForm.supplierIds[i]);
          if (temp.supplier && temp.supplier.length != 0) {
            temp = temp.supplier;
          }
        } 
        this.id=temp.id;
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
      var len = this.contractForm.supplierIds.length;
      var temp = this.supplierList;
      for (var i = 0; i < len; i++) {
        temp = temp.find(s => s.id == this.contractForm.supplierIds[i]);
        if (temp.supplier && temp.supplier.length != 0) {
          temp = temp.supplier;
        }
      }
      this.id=temp.id;
      this.supplierName=temp.supplierName;
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
          that.supplierId=res.data.id;
        } else {
        }
      })
    },
    currencyChange(val) {
      if (this.totalMoney) {
        this.getTotalRmb();
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
        this.budgetInfo = '';
      }
    },
    addBudget() {
      this.$refs.budgetForm.validate((valid) => {
        if (valid) {
          var dep = this.getBudgetDep();
          var item = {
            budgetItemId: dep.budgetItemCode, // 预算科目id
            budgetItemName: dep.budgetItemName, //  预算科目名
            budgetDeptId: dep.budgetDeptCode, //   预算部门id
            budgetDeptName: dep.budgetDeptName, //   预算部门名
            budgetYear: this.year, //   预算年份
            excutionRatio: this.budgetInfo.execRateStr, //   执行比例
            totalPrice:this.totalPrice
          }
          item = Object.assign(item, this.budgetForm);
          delete item.budgetDept;
          this.budgetTable.push(item);
          this.budgetForm.budgetDept = [];
          this.budgetForm.airmaterialNameZn = "";
          this.budgetForm.airmaterialCode = "";
          this.budgetForm.pieceNo = "";
          this.budgetForm.pieceStatus = "";
          this.budgetForm.pieceNum = "";
          this.budgetForm.unit = "";
          this.budgetForm.unitPrice = "";
          // this.budgetForm.totalPrice = "";

          this.budgetInfo = '';
        } else {}
      });
    },
    deleteBudget(index) {
      this.budgetTable.splice(index, 1);
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
    getTotalRmb() {
      this.$http.post('/doc/getRmbByExchangeRate', { currencyId: this.contractForm.currencyId, amount: this.totalMoney })
        .then(res => {
          if (res.status == 0) {
            this.totalRmb = res.data.amount;
          } else {
            console.log('货币兑换失败')
          }
        })
    }
  }
}

</script>
<style lang='scss'>
$main:#0460AE;
$sub:#1465C0;
.airSellApp {
  .offerPrice {
    .moenyInput {
      float: left;
      width: 170px;
    }
    .el-button {
      width: 100px;
      float: right;
      height: 46px;
    }
  }
  .uniqueInfo {
    float: right;
    color: #9a9a9a;
    line-height: 45px;
  }
  .el-radio-button__inner {
    padding: 0;
    line-height: 44px;
    width: 70px;
  }
  .fixLabel {
    .el-form-item__label {
      padding-top: 5px;
      padding-bottom: 5px;
      line-height: 18px;
    }
  }
  .factoryTable,
  .appTable {
    margin-bottom: 30px;
  }
  .el-table__fixed-right {
    box-shadow: -1px -3px 8px #d3d4d6;
    &:before {
      display: none;
    }
    .el-table__header th .cell {
      padding-left: 15px;
      padding-right: 0;
      background: $sub;
      color: #fff;
    }
    td {
      border-bottom: none;
    }
  }
}

</style>
