<template>
  <div class="repairApp">
    <h4 class='doc-form_title'>合同信息</h4>
    <el-form label-position="left" :model="contractForm" :rules="contractRule" ref="contractForm" label-width="128px">
      <el-form-item label="合同子类型" prop="contractCode" placeholder="" class="deptArea">
        <el-select v-model="contractForm.contractCode" style="width:100%">
          <el-option v-for="item in contractCodeList" :key="item.dictCode" ref="contractCode" :label="item.dictName" :value="item.dictCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="填表时间" prop="createTime" class="arrArea">
        <el-date-picker v-model="contractForm.createTime" type="date" :editable="false" :clearable="false" style="width:100%" :picker-options="pickerOptions0"></el-date-picker>
      </el-form-item>
      <el-form-item label="合同号" prop="contractNo" class="deptArea">
        <el-input v-model="contractForm.contractNo" :maxlength="20">
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
      <ul class="supplierInfo clearfix" v-show="supplierInfo" style="width: 750px;">
        <li>开户银行 {{supplierInfo.accountBank}}</li>
        <li>收款账户 {{supplierInfo.accountName}}</li>
      </ul>
      <!-- <el-form-item label="送修合同" prop="repairContract">
        <el-col :span='21' class="repairContract" style="left: -6px;position: relative;">
          <div class="docsBox">
            <el-tag type="gray" :closable="true" @close="clearDoc(index)">{{repairContractDoc.docTitle}}</el-tag>
          </div>
        </el-col>
        <el-col :span='3'>
          <el-button class="addButton" @click="addDoc"> <i class="el-icon-plus"></i></el-button>
        </el-col>
      </el-form-item> -->
      <el-form-item label="选择供应商是否为独家修理厂家" prop="isSupplierUnique" label-width="280px" placeholder="" class="clearBoth">
        <el-radio-group v-model="contractForm.isSupplierUnique" class="myRadio" @change="isSupplierUniqueChange">
          <el-radio-button label="1">是<i></i></el-radio-button>
          <el-radio-button label="0">否<i></i></el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="选择供应商是否为协议供应商" prop="isSupplierProtocol" label-width="280px" placeholder="">
        <el-radio-group v-model="contractForm.isSupplierProtocol" class="myRadio">
          <el-radio-button label="1">是<i></i></el-radio-button>
          <el-radio-button label="0">否<i></i></el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="选择供应商是否为我公司已审核修理厂家" prop="isSupplierCheck" label-width="280px" placeholder="">
        <el-radio-group v-model="contractForm.isSupplierCheck" class="myRadio">
          <el-radio-button label="1">是<i></i></el-radio-button>
          <el-radio-button label="0">否<i></i></el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="新件参考价格" class="deptArea" prop="newReferencePrice">
        <money-input v-model="contractForm.newReferencePrice" :prepend="false">
          <template slot="append">元</template>
        </money-input>
      </el-form-item>
      <el-form-item label="购买该送修件参考价格" class="arrArea fixLabel" prop="purchaseReferencePrice">
        <money-input v-model="contractForm.purchaseReferencePrice" :prepend="false">
          <template slot="append">元</template>
        </money-input>
      </el-form-item>
      <el-form-item label="修理费与购件费比例" class="deptArea fixLabel" prop="repairPurchasePriceRate">
        <el-input v-model="contractForm.repairPurchasePriceRate">
        </el-input>
      </el-form-item>
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
    <h4 class='doc-form_title clearBoth'>厂家信息</h4>
    <el-form label-position="left" :model="factoryForm" :rules="factoryRule" ref="factoryForm" label-width="128px">
      <el-form-item label="选择厂家" prop="supplierIds">
        <el-cascader expand-trigger="hover" :options="supplierList" filterable :props="supplierProp" v-model="factoryForm.supplierIds" style="width:100%" popper-class="myCascader" ref="factorySupplier">
        </el-cascader>
      </el-form-item>
      <el-form-item label="币种" prop="currencyId">
        <el-select v-model="factoryForm.currencyId">
          <el-option :label="currency.currencyName" :value="currency.currencyCode" v-for="currency in currencyList"></el-option>
        </el-select>
        <p class="uniqueInfo" v-show="contractForm.isSupplierUnique==='1'">供应商为独家修理厂家时只能添加一个厂家</p>
      </el-form-item>
      <el-form-item label="报价" prop="offerPrice" class="offerPrice clearfix">
        <money-input v-model="factoryForm.offerPrice" :prepend="false">
          <template slot="append">元</template>
        </money-input>
        <el-button type="primary" @click="addFactory" :disabled="contractForm.isSupplierUnique==='1'&&factoryTable.length>0"><i class="el-icon-plus"></i> 添加</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="factoryTable" :stripe="true" highlight-current-row style="width: 100%" empty-text="未添加厂家" class="factoryTable">
      <el-table-column type="index" label="序号" width="65"></el-table-column>
      <el-table-column property="supplierName" label="厂家名称"></el-table-column>
      <el-table-column property="accurencyName" label="币种" width="120"></el-table-column>
      <el-table-column property="offerPrice" label="报价" width="120"></el-table-column>
      <el-table-column label=" " width="55">
        <template scope="scope">
          <el-button @click.native.prevent="deleteFactory(scope.$index)" type="text" size="small" icon="delete">
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <h4 class='doc-form_title'>详细信息</h4>
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
      <el-form-item label="器材中文名称" prop="materialNameZn">
        <el-input v-model="budgetForm.materialNameZn">
        </el-input>
      </el-form-item>
      <el-form-item label="件号" prop="pieceNo" class="deptArea">
        <el-input v-model="budgetForm.pieceNo">
        </el-input>
      </el-form-item>
      <el-form-item label="序号" prop="sequenceNo" class="arrArea">
        <el-input v-model="budgetForm.sequenceNo">
        </el-input>
      </el-form-item>
      <el-form-item label="合同数量" prop="pieceNum" class="deptArea">
        <el-input v-model="budgetForm.pieceNum">
        </el-input>
      </el-form-item>
      <el-form-item label="单位" prop="unit" class="arrArea">
        <el-input v-model="budgetForm.unit">
        </el-input>
      </el-form-item>
      <el-form-item label="工时费" prop="timePrice" class="deptArea">
        <el-input v-model="budgetForm.timePrice">
        </el-input>
      </el-form-item>
      <el-form-item label="材料费" prop="materialPrice" class="arrArea">
        <el-input v-model="budgetForm.materialPrice">
        </el-input>
      </el-form-item>
      <el-form-item label="合计金额" prop="totalItemMoney" class="offerPrice clearfix clearBoth">
        <money-input v-model="budgetForm.totalItemMoney" :prepend="false">
          <template slot="append">元</template>
        </money-input>
        <el-button type="primary" @click="addBudget"><i class="el-icon-plus"></i> 添加</el-button>
      </el-form-item>
      <div class="appTable clearBoth" style="width:750px">
        <el-table :data="budgetTable" :stripe="true" highlight-current-row style="width:100%" empty-text="未添预算项" class="budgetTable">
          <el-table-column property="budgetDeptName" label="预算机构/科目" width="200">
            <template scope="scope">
              {{scope.row.budgetDeptName}}/{{scope.row.budgetItemName}}
            </template>
          </el-table-column>
          <el-table-column property="executeRate" label="执行比例" width="90"></el-table-column>
          <el-table-column property="materialNameZn" label="器材中文名称" width="200"></el-table-column>
          <el-table-column property="pieceNo" label="件号" width="90"></el-table-column>
          <el-table-column property="sequenceNo" label="序号" width="90"></el-table-column>
          <el-table-column property="pieceNum" label="合同数量" width="90"></el-table-column>
          <el-table-column property="unit" label="单位" width="90"></el-table-column>
          <el-table-column property="timePrice" label="工时费" width="90"></el-table-column>
          <el-table-column property="materialPrice" label="材料费" width="90"></el-table-column>
          <el-table-column property="totalItemMoney" label="合计金额" width="110"></el-table-column>
          <el-table-column label="操作" width="55" fixed="right">
            <template scope="scope">
              <el-button @click.native.prevent="deleteBudget(scope.$index)" type="text" size="small" icon="delete">
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <p class="totalMoney">合计金额 人民币 <span>{{totalRmb | toThousands}}元 {{totalRmb | moneyCh}}</span></p>
      </div>
      <el-form-item label="金额总计" class="deptArea">
        <el-input v-model="totalMoney" readonly>
        </el-input>
      </el-form-item>
      <el-form-item label="人民币" class="arrArea">
        <el-input v-model="totalRmb" readonly>
        </el-input>
      </el-form-item>
    </el-form>
    <el-dialog title="选择合同子类型" :visible.sync="dialogVisible" size="small" custom-class="repairContractDialog" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
      <el-form label-position="left" :model="dialogForm" :rules="dialogRule" ref="dialogForm" label-width="128px">
        <el-form-item label="合同子类型" prop="contractCode" placeholder="">
          <el-select v-model="dialogForm.contractCode">
            <el-option v-for="item in contractCodeList" :key="item.dictCode" ref="contractCode" :label="item.dictName" :value="item.dictCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="送修合同" prop="repairContract" v-if="dialogForm.contractCode==='DOC2102'">
          <el-col :span='18' class="repairContract" style="left: -6px;position: relative;">
            <div class="docsBox">
              <el-tag type="gray" v-show="dialogForm.repairContract">{{dialogForm.repairContract}}</el-tag>
            </div>
          </el-col>
          <el-col :span='6'>
            <el-button class="repairContractButton" @click="dialogTableVisible=true">选择</el-button>
          </el-col>
        </el-form-item>
      </el-form>
      <div class="confirmBox">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </div>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="dialogTableVisible" size="large" class="docDialog">
      <div class="topSearch clearfix">
        <p class="tips">选择公文<span>请双击公文选择</span></p>
      </div>
      <search-options @search="setOptions" notype noPerson></search-options>
      <el-table :data="extraDocs" class="myTable searchRes" @row-dblclick="selectDoc" :height="250" :row-class-name="tableRowClassName" v-loading="searchLoading">
        <el-table-column prop="docNo" label="公文编号" width="200"></el-table-column>
        <el-table-column prop="docTitle" label="标题"></el-table-column>
        <el-table-column prop="taskTime" label="呈报时间" width="175">
          <template scope="scope">
            {{scope.row.createTime | time('all')}}
          </template>
        </el-table-column>
      </el-table>
      <div class="pageBox" v-show="extraDocs.length>0">
        <el-pagination @current-change="handleCurrentChange" :current-page="params.pageNumber" :page-size="5" layout="total, prev, pager, next, jumper" :total="totalSize">
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import MoneyInput from '../../../components/moneyInput.component'
import SearchOptions from '../../../components/searchOptions.component'
import { mapGetters } from 'vuex'
export default {
  components: { MoneyInput,SearchOptions },
  data() {
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
        advancePaymentPercent: ''
      },
      contractRule: {
        contractCode: [{ required: true, message: '请选择合同子类型', trigger: 'blur' }],
        priority: [{ required: true, message: '请选择优先级', trigger: 'blur' }],
        advancePaymentPercent: [{ required: true, message: '请输入预付款百分比', trigger: 'blur' }],
        supplierIds: [{ type: 'array', required: true, message: '请选择供应商', trigger: 'blur' }],
      },
      dialogForm: {
        contractCode: '',
        repairContract: ''
      },
      dialogRule: {
        contractCode: [{ required: true, message: '请选择合同子类型', trigger: 'blur' }],
        repairContract: [{ required: true, message: '请选择送修合同', trigger: 'blur' }],
      },
      repairContractDoc: '',
      factoryForm: {
        supplierIds: [],
        currencyId: '',
        offerPrice: ''
      },
      factoryRule: {
        supplierIds: [{ type: 'array', required: true, message: '请选择厂家', trigger: 'blur' }],
        currencyId: [{ required: true, message: '请选择币种', trigger: 'blur' }],
        offerPrice: [{ required: true, message: '请输入报价', trigger: 'blur' }],
      },
      budgetForm: {
        budgetDept: [],
        pieceNo: '', //   件号
        sequenceNo: '', //   序号
        pieceNum: '', //   合同数量 即合同里的件数量
        unit: '', //   单位
        materialNameZn: '', //   器材中文名称
        materialPrice: '', //   材料费
        timePrice: '', // 
        totalItemMoney: ''
      },
      budgetRule: {
        pieceNo: [{ required: true, message: '请输入件号', trigger: 'blur' }],
        pieceNum: [{ required: true, message: '请输入合同数量', trigger: 'blur' }],
        budgetDept: [{ type: 'array', required: true, message: '请选择预算机构', trigger: 'blur' }],
      },
      factoryTable: [],
      budgetTable: [],
      supplierInfo: '',
      budgetInfo: '',
      contractCodeList: [],
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
      isfirst: true,
      totalRmb: '',
      dialogVisible: false,
      dialogTableVisible: false,
      searchOptions:'',
      searchLoading:false,
      extraDocs:[],
      params: {
        "pageNumber": 1,
        "pageSize": 5
      },
      totalSize: 0,
    }

  },
  created() {
    if (this.$route.query.id) {
      this.isDraft = true;
    } else {
      this.dialogVisible = true;
    }
    this.getContractCodeList();
    this.getPriorityList();
    if (!this.isDraft) {
      this.getSupplier(); //收款供应商
    }
    this.getCurrencyList();
    this.getBudgetDeptList();
  },
  computed: {
    totalMoney() {
      var num = 0;
      if (this.budgetTable.length != 0) {
        this.budgetTable.forEach(b => {
          if (b.totalItemMoney) {
            num += parseFloat(b.totalItemMoney);
          }
        })
      }
      return num || ''
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
        budgetTable: this.budgetTable,
        factoryTable: this.factoryTable,
        contractForm: this.contractForm,
      });

      this.$emit('saveMiddle', params);
    },
    getDraft(obj) {
      this.combineObj(this.contractForm, obj.contractForm, ['createTime']);
      this.contractForm.createTime = new Date(obj.contractForm.createTime);
      this.budgetTable = obj.budgetTable;
      this.factoryTable = obj.factoryTable;
      if (this.contractForm.supplierIds.length != 0) {
        if (this.supplierList.length == 0) {
          this.getSupplier();
        } else {
          this.supplierChange();
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
      if (this.factoryTable.length == 0) {
        this.$message.warning('请填加厂家信息');
        this.$emit('submitMiddle', false);
        return false;
      }
      if (this.budgetTable.length == 0) {
        this.$message.warning('请填加预算项');
        this.$emit('submitMiddle', false);
        return false;
      }
      return true;
    },
    submitAll() {
      var contractType = this.contractCodeList.find(d => d.dictCode == this.contractForm.contractCode);
      var currency = this.currencyList.find(c => c.currencyCode === this.contractForm.currencyId);
      var airmRor = {
        docTypeCode: contractType.dictCode, // 合同子类型
        docTypeName: contractType.dictName, // 合同子类型
        priority: this.contractForm.priority, //  优先级   
        currencyId: currency.currencyCode, //   币种id
        supplierId: this.supplierInfo.id, //  供应商id
        supplierName: this.supplierInfo.supplierName, //  供应商名
        supplierBank: this.supplierInfo.accountBank, //  供应商开户银行
        supplierBankAccountName: this.supplierInfo.accountName, //  供应商开户账号名
        advancePaymentPercent: this.contractForm.advancePaymentPercent, //  预付款百分比
        contractNo: this.contractForm.contractNo, //  合同号
        createTime: +this.contractForm.createTime, //   填表日期（创建日期）（推送日期）
        isSupplierUnique: this.contractForm.isSupplierUnique, //  选择供应商是否为独家修理厂家
        accurencyName: currency.currencyName, // 币种名
        isSupplierProtocol: this.contractForm.isSupplierProtocol, //  选择供应商是否为协议供应商
        isSupplierCheck: this.contractForm.isSupplierCheck, //  选择供应商是否为我公司已审
        totalMoney: this.totalMoney || 0, //  总合计金额
        rmb: this.totalRmb || 0, //   金额总计根据币种汇率换算出人民币
        newReferencePrice: this.contractForm.newReferencePrice, //  新件参考价格
        purchaseReferencePrice: this.contractForm.purchaseReferencePrice, //   购买该送修件参考价格
        repairPurchasePriceRate: this.contractForm.repairPurchasePriceRate, //   修理费与购件费比例
        isAdvancePayment: this.contractForm.isAdvancePayment, //   付款方式,1预付 0后付
        // isVerification: this.contractForm.code, //   航材类合同的情况, 是否付款, 1是已付款, 0未付款
        exchangeRateId: currency.exchangeId, //   汇率id
        exchangeRate: currency.exchangeRate, //    汇率
        // repairContract: this.contractForm.code, //   送修合同
      }
      this.$emit('submitMiddle', { airmRor: airmRor, airmRorItems: this.budgetTable, airmRorRepairs: this.factoryTable })
    },
    addDoc() {

    },
    getContractCodeList() {
      this.$http.post('/api/getDict', { dictCode: 'DOC21' })
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
          this.contractForm.currencyId = this.currencyList[0].currencyCode;
        }
      } else {
        this.$store.dispatch('getCurrency')
      }
    },
    supplierChange(val) {
      var len = this.contractForm.supplierIds.length;
      var temp = this.supplierList;
      for (var i = 0; i < len; i++) {
        temp = temp.find(s => s.id == this.contractForm.supplierIds[i]);
        if (temp.supplier && temp.supplier.length != 0) {
          temp = temp.supplier;
        }
      }
      this.supplierInfo = temp;
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
      if (this.budgetTable.length != 0) {
        var currency = this.currencyList.find(c => c.currencyCode === this.contractForm.currencyId);
        this.budgetTable.forEach(b => {
          b.accurencyName = currency.currencyName;
          b.exchangeRateId = currency.exchangeId; //汇率id
          b.exchangeRate = currency.exchangeRate; // 汇率
        })
      }
    },
    addFactory() {
      this.$refs.factoryForm.validate((valid) => {
        if (valid) {
          var currency = this.currencyList.find(c => c.currencyCode === this.factoryForm.currencyId);
          console.log(currency)
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
          var currency = this.currencyList.find(c => c.currencyCode === this.contractForm.currencyId);
          var dep = this.getBudgetDep();
          var item = {
            budgetItemId: dep.budgetItemCode, // 预算科目id
            budgetItemName: dep.budgetItemName, //  预算科目名
            budgetDeptId: dep.budgetDeptCode, //   预算部门id
            budgetDeptName: dep.budgetDeptName, //   预算部门名
            budgetYear: this.year, //   预算年份
            pieceNo: this.budgetForm.pieceNo, //   件号
            sequenceNo: this.budgetForm.sequenceNo, //   序号
            pieceNum: this.budgetForm.pieceNum, //   合同数量 即合同里的件数量
            unit: this.budgetForm.unit, //   单位
            materialNameZn: this.budgetForm.materialNameZn, //   器材中文名称
            materialPrice: this.budgetForm.materialPrice, //   材料费
            timePrice: this.budgetForm.timePrice, //   工时费
            executeRate: this.budgetInfo.execRateStr, //   执行比例
            accurencyName: currency.currencyName, //  币种名
            exchangeRateId: currency.exchangeId, //   汇率id
            exchangeRate: currency.exchangeRate, //   汇率
            totalItemMoney: this.budgetForm.totalItemMoney, //  项次合计金额
          }
          this.budgetTable.push(item);
          this.budgetForm.budgetDept = [];
          this.budgetForm.pieceNo = ''; //   件号
          this.budgetForm.sequenceNo = ''; //   序号
          this.budgetForm.pieceNum = ''; //   合同数量 即合同里的件数量
          this.budgetForm.unit = ''; //   单位
          this.budgetForm.materialNameZn = ''; //   器材中文名称
          this.budgetForm.materialPrice = ''; //   材料费
          this.budgetForm.timePrice = ''; // 
          this.budgetForm.totalItemMoney = '';
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
    },
    tableRowClassName(row, index) {
      return this.repairContractDoc.id===row.id?'selDoc':'';
    },
    selectDoc(row) {
      this.dialogForm.repairContract=row.docTitle;
      this.repairContractDoc=row;
      this.dialogTableVisible = false;
    },
    setOptions(options) {
      this.searchOptions = options;
      this.params.pageNumber = 1;
      this.getData();
    },
    handleCurrentChange(page) {
      this.params.pageNumber = page;
      this.getData()
    },
    getData() {
      this.searchLoading = true;
      var params = Object.assign({ userId: this.userInfo.empId }, this.params, this.searchOptions);
      this.$http.post("/doc/getAirmRorList", params, { body: true }).then(res => {
        setTimeout(()=> {
          this.searchLoading = false;
        }, 200)
        if (res.status == 0) {
          this.extraDocs = res.data.pagedList;
          this.totalSize = res.data.totalSize;
        } else {
          this.extraDocs = [];
          this.totalSize = 0;
        }
      }, res => {

      })
    },
  }
}

</script>
<style lang='scss'>
$main:#0460AE;
$sub:#1465C0;
.repairApp {
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
  .budgetTable {
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
  .repairContractDialog {
    width: 600px;
    .el-form {
      min-height: 130px;
    }
    .repairContractButton {
      width: 100%;
      height: 45px;
    }
    .confirmBox {
      text-align: center;
      button {
        width: 100px;
        border-radius: 3px;
        height: 45px;
      }
    }
  }
  .docDialog {
    .el-dialog--large {
      width: 900px;
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
        float: right;
      }
    }
  }
}

</style>
