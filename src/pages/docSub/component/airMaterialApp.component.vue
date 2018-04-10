<template>
  <div class="airmaterial">
    <h4 class='doc-form_title'>合同信息</h4>
    <el-form label-position="left" :model="contractForm" :rules="contractRule" ref="contractForm" label-width="128px">
      <el-form-item label="合同子类型" prop="contractCode" placeholder="" class="deptArea">
        <el-select v-model="contractForm.contractCode" style="width:100%" @change="typeChange">
          <el-option v-for="item in contractCodeList" :key="item.dictCode" ref="contractCode" :label="item.dictName" :value="item.dictCode">
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
      <el-form-item label="币种" class="arrArea" prop="currencyId">
        <el-select v-model="contractForm.currencyId" @change="currencyChange">
          <el-option :label="currency.currencyName" :value="currency.currencyCode" v-for="currency in currencyList"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="付款方式" class="deptArea" prop="isAdvancePayment">
        <el-select v-model="contractForm.isAdvancePayment">
          <el-option label="预付" value="1"></el-option>
          <el-option label="后付" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="预付款百分比" prop="advancePaymentPercent" v-if="contractForm.isAdvancePayment==='1'" class="arrArea">
        <money-input v-model="contractForm.advancePaymentPercent" :prepend="false" :max="100">
          <template slot="append">%</template>
        </money-input>
      </el-form-item>
    </el-form>
    <div class="clearBoth"></div>
    <h4 class='doc-form_title'>详细信息</h4>
    <el-form label-position="left" :model="airMaterialForm" :rules="airmaterialRule" ref="airMaterialForm" label-width="128px">
      <el-form-item label="预算年份" class="year">
        {{year}}
      </el-form-item>
      <el-form-item label="预算机构/科目" prop="budgetDept" class="clearBoth">
        <!-- <el-cascader :clearable="true" :options="budgetDeptList" ref="budgetDept" :props="budgetProp" v-model="airMaterialForm.budgetDept" :show-all-levels="false" @active-item-change="handleItemChange"   ></el-cascader> -->
        <el-cascader :clearable="true" :options="budgetDeptList" :props="budgetProp" v-model="airMaterialForm.budgetDept" @active-item-change="handleItemChange" @change="depChange" popper-class="myCascader" class="budgetDept" ref="budgetDept" style="width:100%"></el-cascader>
      </el-form-item>
      <ul class="budgetInfo clearfix clearBoth" v-show="airMaterialInfo">
        <li>年度预算{{airMaterialInfo.budgetTotal | toThousands}}元</li>
        <li>可用预算{{airMaterialInfo.budgetRemain | toThousands}}元</li>
        <li>预算执行比例{{airMaterialInfo.execRateStr}}</li>
      </ul>
      <el-form-item label="件号" prop="pieceNo" class="deptArea">
        <el-input ref="pieceNo" v-model="airMaterialForm.pieceNo" :maxlength="20">
        </el-input>
      </el-form-item>
      <el-form-item label="件状态" prop="pieceState" class="arrArea">
        <el-select v-model="airMaterialForm.pieceState" ref="pieceState">
          <el-option v-for="item in pieceStates" :label="item.dictName" :value="item.dictCode" :maxlength="4">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="合同数量" class="deptArea" prop="pieceNum" style="height:46px;">
        <money-input ref="pieceNum" v-model="airMaterialForm.pieceNum" :maxlength="6" :prepend="false" @change="changePieceNum">
        </money-input>
      </el-form-item>
      <el-form-item label="索赔期/月" prop="claimMonth" class="arrArea">
        <el-input ref="claimMonth" v-model="airMaterialForm.claimMonth" :maxlength="7">
        </el-input>
      </el-form-item>
      <el-form-item label="单位" prop="unit" class="deptArea">
        <el-input ref="unit" v-model="airMaterialForm.unit" :maxlength="8">
        </el-input>
      </el-form-item>
      <el-form-item label="单价" class="arrArea" prop="unitPrice">
        <money-input ref="unitPrice" v-model="airMaterialForm.unitPrice" :maxlength="8" :prepend="false" @change="changeUnitPrice">
        </money-input>
      </el-form-item>
      <el-form-item label="总价" prop="totalPrice" class="deptArea">
        <el-input ref="totalPrice" v-model="airMaterialForm.totalPrice" :maxlength="12" readonly="">
        </el-input>
      </el-form-item>
      <el-form-item label="要求到货天数" prop="arrivalDays" class="arrArea">
        <el-input ref="arrivalDays" v-model="airMaterialForm.arrivalDays" :maxlength="8" @change="changeArrivalDays">
        </el-input>
      </el-form-item>
      <el-form-item label="航材中文名称" prop="airmaterialNameZn" :maxlength="20" placeholder="" class="deptArea">
        <el-input ref="airmaterialNameZn" v-model="airMaterialForm.airmaterialNameZn">
        </el-input>
      </el-form-item>
      <el-form-item label="航材英文名称" prop="airmaterialNameEn" placeholder="" class="arrArea">
        <el-input ref="airmaterialNameEn" v-model="airMaterialForm.airmaterialNameEn">
        </el-input>
      </el-form-item>
      <el-button type="primary" @click="addBudget" style="float:right"><i class="el-icon-plus"></i> 添加</el-button>
      <!-- <el-form-item label="合计金额" prop="totalItemMoney" class="offerPrice clearfix clearBoth">
        <money-input v-model="airMaterialForm.totalItemMoney" :prepend="false">
          <template slot="append">元</template>
        </money-input>
        
      </el-form-item> -->
      <div class="appTable clearBoth" style="width:750px">
        <el-table :data="airMaterialTable" :stripe="true" highlight-current-row style="width:100%" empty-text="未添预算项" class="airMaterialTable">
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
                    <span>费用归属部门</span>
                    <p>{{props.row.budgetDeptName}}</p>
                  </div>
                  <div>
                    <span>执行比例</span>
                    <p>{{props.row.execRateStr}}</p>
                  </div>
                </div>
                <div class="width50">
                  <div>
                    <span>航材英文名称</span>
                    <p>{{props.row.airmaterialNameEn}}</p>
                  </div>
                  <div>
                    <span>件状态</span>
                    <p>{{props.row.pieceState}}</p>
                  </div>
                </div>
                <div class="width50">
                  <div>
                    <span>单位</span>
                    <p>{{props.row.unit}}</p>
                  </div>
                  <div>
                    <span>要求到货天数</span>
                    <p>{{props.row.arrivalDays}}</p>
                  </div>
                </div>
                <div class="width50">
                  <div>
                    <span>索赔期/月</span>
                    <p>{{props.row.claimMonth}}</p>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column property="airmaterialNameZn" label="航材中文名称" width="120"></el-table-column>
          <el-table-column property="pieceNo" label="件号"></el-table-column>
          <el-table-column property="pieceNum" label="合同数量" width="90"></el-table-column>
          <el-table-column property="unitPrice" label="单价"></el-table-column>
          <el-table-column property="totalPrice" label="总价"></el-table-column>
          <el-table-column label="操作" width="55">
            <template scope="scope">
              <el-button @click.native.prevent="deleteBudget(scope.$index)" type="text" size="small" icon="delete">
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <p class="totalMoney">合同总金额 人民币 <span>{{totalRmb | toThousands}}元  {{totalRmb | moneyCh}}</span></p>
      </div>
      <el-form-item label="合同总金额" class="deptArea">
        <el-input v-model="totalMoney" readonly>
        </el-input>
      </el-form-item>
      <!-- <el-form-item label="人民币" class="arrArea">
        <el-input v-model="totalRmb" readonly>
        </el-input>
      </el-form-item> -->
    </el-form>
    <!-- <el-dialog title="选择合同子类型" :visible.sync="dialogVisible" size="tiny" :before-close="handleClose">
      <el-form label-position="left" :model="dialogForm" :rules="dialogRule" ref="dialogForm" label-width="128px">
        <el-form-item label="合同子类型" prop="contractCode" placeholder="" class="deptArea">
          <el-select v-model="contractForm.contractCode" style="width:100%">
            <el-option v-for="item in contractCodeList" :key="item.dictCode" ref="contractCode" :label="item.dictName" :value="item.dictCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="送修合同" prop="repairContract">
          <el-col :span='21' class="repairContract" style="left: -6px;position: relative;">
            <div class="docsBox">
              <el-tag type="gray" :closable="true" @close="clearDoc(index)">{{repairContractDoc.docTitle}}</el-tag>
            </div>
          </el-col>
          <el-col :span='3'>
            <el-button class="addButton" @click="addDoc"> <i class="el-icon-plus"></i></el-button>
          </el-col>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>
<script>
import MoneyInput from '../../../components/moneyInput.component'
import { mapGetters } from 'vuex'
export default {
  components: { MoneyInput },
  data() {
    var validatorpieceNum = (rule, value, callback) => {
      if (value && value.length != 0) {
        if (this.airMaterialForm.unitPrice * value > 999999999999) {
          callback(new Error("总价超额"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    var validatorUnitPrice = (rule, value, callback) => {
      if (value && value.length != 0) {
        if (value * this.airMaterialForm.pieceNum * value > 999999999999) {
          callback(new Error("总价超额"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      year: new Date().getFullYear(),
      contractForm: {
        createTime: new Date(),
        contractCode: '',
        contractNo: '',
        priority: '',
        supplierIds: [],
        isSupplierUnique: '0',
        isSupplierProtocol: '1',
        isSupplierCheck: '1',
        newReferencePrice: '',
        purchaseReferencePrice: '',
        repairPurchasePriceRate: '',
        supplierRepairCheck: '',
        currencyId: '',
        isAdvancePayment: '1',
        advancePaymentPercent: '',
        supplierInfos:"",
      },
      contractRule: {
        supplierInfos: [{ required: true, message: '请选择供应商银行信息', trigger: 'blur' }],
        contractCode: [{ required: true, message: '请选择合同子类型', trigger: 'blur' }],
        contractNo: [{ required: true, message: '请输入合同号', trigger: 'blur' }],
        priority: [{ required: true, message: '请选择优先级', trigger: 'blur' }],
        advancePaymentPercent: [{ required: true, message: '请输入预付款百分比', trigger: 'blur' }],
        supplierIds: [{ type: 'array', required: true, message: '请选择供应商', trigger: 'blur' }],
        currencyId: [{ required: true, message: '请选择币种', trigger: 'blur' }],
        isAdvancePayment: [{ required: true, message: '请选择付款方式', trigger: 'blur' }],
      },
      dialogForm: {
        contractCode: '',
        repairContract: ''
      },
      factoryForm: {
        supplierIds: [],
        currencyId: '',
        offerPrice: ''
      },

      pieceStates: [],
      bookTypes: [],
      budgetDate: {},

      accountCode:"",
      accountBank:"",
      ifSupplierChange:false,
      ifChangeSelect:false,


      showData: 0,
      yearBudget: 0,
      useBudget: 0,
      execRateStr: "0%",
      airMaterialForm: {
        pieceState: [],
        year: new Date(),
        budgetDept: [],
        pieceNo: "",
        pieceState: "",
        pieceNum: "",
        claimMonth: "",
        unit: "",
        unitPrice: "",
        airmaterialNameZn: "",
        totalPrice: "",

        arrivalDays: "",
        airmaterialNameEn: "",
      },
      airmaterialRule: {
        pieceNo: [{ required: true, message: '请输入件号', trigger: 'blur' }],
        pieceNum: [{ required: true, message: '请输入合同数量', trigger: 'blur' }, { validator: validatorpieceNum, trigger: 'blur,change' }],
        budgetDept: [{ type: 'array', required: true, message: '请预算机构', trigger: 'blur' }],
        pieceState: [{ required: true, message: '请选择件状态', trigger: 'blur' }],
        arrivalDays: [{ required: true, message: '请输入要求到货天数', trigger: 'blur' }],
        unitPrice: [{ required: true, message: '请输入单价', trigger: 'blur' }, { validator: validatorUnitPrice, trigger: 'blur,change' }],
        unit: [{ required: true, message: '请输入单位', trigger: 'blur' }],
        airmaterialNameZn: [{ required: true, message: '请输入航材中文名称', trigger: 'blur' }],
        airmaterialNameEn: [{ required: true, message: '请输入航材英文名称', trigger: 'blur' }],
      },
      factoryTable: [],
      airMaterialTable: [],
      repairContractDoc: null,
      supplierInfo: '',
      airMaterialInfo: '',
      contractCodeList: [],
      priorityList: [],
      budgetDeptList: [],
      id: '',
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
      supplierBankAccountName:"",
      supplierName:"",
      supplierBank:"",
      supplierBankAccountCode:"",
      supplierId:"",
    }

  },
  created() {
    if (this.$route.params.id) {
      this.isDraft = true;
    }
    this.getContractCodeList();
    this.getPriorityList();
    if (!this.isDraft) {
      this.getSupplier(); //收款供应商
    }
    this.getCurrencyList();
    this.getBudgetDeptList();
    this.getPieceState();
  },
  computed: {
    totalMoney() {
      var num = 0;
      if (this.airMaterialTable.length != 0) {
        this.airMaterialTable.forEach(b => {
          if (b.totalPrice) {
            num += parseFloat(b.totalPrice);
          }
        })
      }
      
      return num.toFixed(2) || ''
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
    }
  },
  methods: {
    getPieceState() {
      this.$http.post('/api/getDict', {
          "dictCode": "DOC17"
        })
        .then(res => {
          if (res.status == 0) {
            this.pieceStates = res.data;
          }
        })
    },
    typeChange(val) {
      this.$store.dispatch('getTemplate',{code:this.$route.params.code,subCode:val});      
    },
    changeArrivalDays(val) {
      val = val.toString().match(/^\d+(?:\.\d{0,2})?/);
      if (val) {
        this.airMaterialForm.arrivalDays = val[0];
        this.$refs.arrivalDays.setCurrentValue(val[0]);
      } else {
        this.airMaterialForm.arrivalDays = '';
        this.$refs.arrivalDays.setCurrentValue('')
      }
    },
    changeUnitPrice(val) {
      val = val.toString().match(/^\d+(?:\.\d{0,2})?/);
      if (val) {
        this.airMaterialForm.unitPrice = val[0];
        // this.$refs.unitPrice.setCurrentValue(val[0]);
        this.airMaterialForm.totalPrice = this.numFixed2(this.airMaterialForm.pieceNum * this.airMaterialForm.unitPrice);
      } else {
        this.airMaterialForm.unitPrice = '';
        // this.$refs.unitPrice.setCurrentValue('')
      }
    },
    changePieceNum(val) {

      val = val.toString().match(/^\d+(?:\.\d{0,2})?/);
      if (val) {
        this.airMaterialForm.pieceNum = val[0];
        // this.$refs.pieceNum.setCurrentValue(val[0]);
        this.airMaterialForm.totalPrice = this.numFixed2(this.airMaterialForm.pieceNum * this.airMaterialForm.unitPrice);
      } else {
        this.airMaterialForm.pieceNum = '';
        // this.$refs.pieceNum.setCurrentValue('')
      }
    },
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
        airMaterialTable: this.airMaterialTable,
        factoryTable: this.factoryTable,
        contractForm: this.contractForm,
      });
      this.$emit('saveMiddle', params);
    },
    getDraft(obj) {
      this.combineObj(this.contractForm, obj.contractForm, ['createTime']);
      this.contractForm.createTime = new Date(obj.contractForm.createTime);
      this.airMaterialTable = obj.airMaterialTable;
      this.factoryTable = obj.factoryTable;
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
      if (this.airMaterialTable.length == 0) {
        this.$message.warning('请填加预算项');
        this.$emit('submitMiddle', false);
        return false;
      }
      return true;
    },
    submitAll() {
      var contractType = this.contractCodeList.find(d => d.dictCode == this.contractForm.contractCode);
      var currency = this.currencyList.find(c => c.currencyCode === this.contractForm.currencyId);
      var that = this;
      var airmPosItems = {

        "airmPosItems": that.airMaterialTable.map(function(tabel) {
          return {
            "budgetDeptId": tabel.budgetDeptCode, //预算部门id
            "budgetDeptName": tabel.budgetDeptName, //预算部门名字
            "budgetItemName": tabel.budgetItemName, //-预算科目名字
            "budgetItemId": tabel.budgetItemId, //预算科目id
            "money": tabel.budgetMoney, //预算钱数
            "budgetYear": tabel.budgetYear, //预算年数
            "money": that.totalMoney || 0, //金额
            "accurencyName": currency.currencyCode, //币种
            "exchangeRateId": currency.exchangeId, //汇率
            "exchangeRate": currency.exchangeRate, //汇率id
            "rmb": that.totalRmb || 0, //人民币
            "airmaterialNameZn": tabel.airmaterialNameZn, //航材中文名称
            "pieceNo": tabel.pieceNo, //件号
            "pieceStatus": tabel.pieceState, //件状态
            "pieceNum": tabel.pieceNum, //合同中的件数量
            "unit": tabel.unit, //单位
            "unitPrice": tabel.unitPrice, //单价
            "totalPrice": tabel.totalPrice, //总价=单位*单价
            "airmaterialNameEn": tabel.airmaterialNameEn, //航材英文名称
            "claimMonth": tabel.claimMonth, //索赔期/月
            arrivalDays: tabel.arrivalDays //到货天数
          }
        })

      };

      var airmPos = {
        "budgetYear": that.year, //预算年度
         supplierName:that.supplierName,
        "supplierBank": that.supplierBank, //供应商开户银行
        "supplierBankAccountName": that.supplierBankAccountName, //供应商开户账号名
        "supplierBankAccountCode": that.accountCode, //供应商开户账号编号
        supplierId: that.supplierId, //  供应商id
        // supplierName: that.supplierInfo.supplierName, //  供应商名
        // supplierBank: that.supplierInfo.accountBank, //  供应商开户银行
        // supplierBankAccountName: that.supplierInfo.accountName, //  供应商开户账号名
        advancePaymentPercent: that.contractForm.advancePaymentPercent, //  预付款百分比
        "totalMoney": that.totalMoney || 0, //总金额
        "isAdvancePayment": that.contractForm.isAdvancePayment, //付款方式,1预付 0后付
        createTime: that.contractForm.createTime, //   填表日期（创建日期）（推送日期）
        contractNo: that.contractForm.contractNo, //  合同号
        "accurencyName": currency.currencyName, //币种
        "exchangeRateId": currency.exchangeId, //汇率
        "exchangeRate": currency.exchangeRate, //汇率id
        priority: that.contractForm.priority, //  优先级   
        "contractSubType": contractType.dictCode, //合同子类型
        "contractSubName": contractType.dictName, //合同子类型
        "rmb": that.totalRmb || 0, //人民币


      };
      console.log(airmPos)
      this.$emit('submitMiddle', { airmPos: airmPos, airmPosItems: airmPosItems.airmPosItems })
    },
    getContractCodeList() {
      this.$http.post('/api/getDict', { dictCode: 'DOC18' })
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
    getSupplier() {
      this.$store.dispatch('getSupplier');
    },
    getCurrencyList() {
      if (this.currencyList.length !== 0) {
        if (!this.isDraft) {

        }
      } else {
        this.$store.dispatch('getCurrency')
      }
    },
    supplierChange(val) {
      if(val&&val.bankinfo){
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
    isSupplierUniqueChange(val) {
      if (val === '1') {
        this.factoryTable.splice(1);
      }
    },
    currencyChange(val) {
      if (this.totalMoney) {
        this.getTotalRmb();
      }
      if (this.airMaterialTable.length != 0) {
        var currency = this.currencyList.find(c => c.currencyCode === this.contractForm.currencyId);
        this.airMaterialTable.forEach(b => {
          b.currencyName = currency.currencyName;
          b.exchangeRateId = currency.exchangeId; //汇率id
          b.exchangeRate = currency.exchangeRate; // 汇率
        })
      }
    },
    addFactory() {
      this.$refs.factoryForm.validate((valid) => {
        if (valid) {
          var currency = this.currencyList.find(c => c.currencyCode === this.factoryForm.currencyId);
          var item = {
            supplierName: this.$refs.factorySupplier.currentLabels[this.$refs.factorySupplier.currentLabels.length - 1], //厂家名
            offerPrice: this.factoryForm.offerPrice, //报价
            accurencyName: currency.currencyName, //币种名
            exchangeRateId: currency.exchangeId, //汇率id
            exchangeRate: currency.exchangeRate, // 汇率
          }
          this.factoryTable.push(item);
          this.factoryForm.supplierIds = [];
          this.factoryForm.currencyId = '';
          this.factoryForm.offerPrice = '';
        } else {}
      });
    },
    deleteFactory(index) {
      this.factoryTable.splice(index, 1);
    },
    getBudgetDeptList() {
      this.$http.post('/doc/getBudItemTreeList')
        .then(res => {
          if (res.status == 0) {
            res.data.forEach(i => i.isParent == 1 ? i.items = [] : i.items = null)
            this.budgetDeptList = res.data
          } else {
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
              this.airMaterialInfo = res.data;
            } else {

            }
          })
      } else {
        this.airMaterialInfo = '';
      }
    },
    addBudget() {
      this.$refs.airMaterialForm.validate((valid) => {
        if(this.contractForm.currencyId!=""){
          if (Number(this.totalMoney) + Number(this.airMaterialForm.totalPrice) < 1000000000000) {
          if (valid) {
            var dep = this.getBudgetDep();
            var temp = {};
            temp.budgetDeptCode = dep.budgetDeptCode;
            temp.budgetDept = this.$refs.budgetDept.currentLabels[0] + "/" + this.$refs.budgetDept.currentLabels[this.$refs.budgetDept.currentLabels.length - 1];
            temp.budgetDeptName = this.airMaterialForm.budgetDeptName;
            temp.execRateStr = this.airMaterialInfo.execRateStr;
            temp.airmaterialNameZn = this.airMaterialForm.airmaterialNameZn;
            temp.pieceNo = this.airMaterialForm.pieceNo;
            temp.pieceState = this.$refs.pieceState.selectedLabel;
            temp.pieceNum = this.airMaterialForm.pieceNum;

            temp.unit = this.airMaterialForm.unit;
            temp.claimMonth = this.airMaterialForm.claimMonth;
            temp.unitPrice = this.airMaterialForm.unitPrice;
            temp.totalPrice = this.airMaterialForm.totalPrice;
            temp.airmaterialNameEn = this.airMaterialForm.airmaterialNameEn;
            temp.arrivalDays = this.airMaterialForm.arrivalDays;

            temp.budgetDeptId = this.airMaterialForm.budgetDept[0];
            temp.budgetDeptName = this.$refs.budgetDept.currentLabels[0];
            temp.budgetItemId = this.airMaterialForm.budgetDept[this.airMaterialForm.budgetDept.length - 1];
            temp.budgetItemName = this.$refs.budgetDept.currentLabels[this.$refs.budgetDept.currentLabels.length - 1];
            temp.budgetYear = this.year;

            this.airMaterialTable.push(temp);
            this.airMaterialInfo = '';
            this.$refs.airMaterialForm.resetFields();

          } else {

          }
        } else {
          this.$message({
            message: '合同总金额超额',
            type: 'warning'
          });
        }

        }else{
           this.$message({
            message: '请先选择币种',
            type: 'warning'
          });
        }
        
      });
    },
    deleteBudget(index) {
      this.airMaterialTable.splice(index, 1);
    },
    getBudgetDep() {
      var len = this.airMaterialForm.budgetDept.length;
      var temp = this.budgetDeptList;
      for (var i = 0; i < len; i++) {
        temp = temp.find(dep => dep.budgetItemCode == this.airMaterialForm.budgetDept[i]);
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
.airmaterial {
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
  .airMaterialTable {
    .el-table__body-wrapper {
      overflow-x: auto;
    }
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
