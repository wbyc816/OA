<template>
  <div class="travelRemibApp">
    <el-form label-position="left" :model="paymentForm" :rules="paymentRule" ref="paymentForm" label-width="128px">
      <el-form-item label="报销申请人" prop="appUserName">
        <el-input class="search" v-model="paymentForm.appUserName" :readonly="true">
          <el-button slot="append" @click='selectPerson'>选择</el-button>
        </el-input>
      </el-form-item>
      <el-form label-position="left" :model="feeForm" :rules="feeRule" ref="feeForm" label-width="128px" class="clearBoth">
        <el-form-item label="费用项目" placeholder="" class="deptArea">
          <el-select v-model="feeTypeCode" style="width:100%" ref="contractType" @change="changeFeeType">
            <el-option v-for="item in feeTypes" :key="item.dictCode" :label="item.dictName" :value="item.dictCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期" label-width="90px" class="arrArea" prop="timeLine" key="timeLine" v-if="feeTypeCode!='FIN0604'">
          <el-date-picker v-model="feeForm.timeLine" type="daterange" @change="topDateChange" :picker-options="dateOptions" :editable="false"></el-date-picker>
        </el-form-item>
        <!-- 住宿 -->
        <el-form-item label="逗留城市" prop="city" class="clearBoth" key="city" v-if="feeTypeCode=='FIN0601'||feeTypeCode=='FIN0603'">
          <el-input v-model="feeForm.city" :maxlength="25">
            <el-select v-model="feeForm.area" slot="prepend" style="width:130px" v-if="feeTypeCode=='FIN0601'" @change="areaChange">
              <el-option v-for="item in areaList" :key="item.dictCode" :label="item.dictName" :value="item.dictCode"></el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item label="住宿天数" class="deptArea" prop="dayNum" key="dayNum1" v-if="feeTypeCode=='FIN0601'">
          <money-input v-model="feeForm.dayNum" class="hasUnit" :maxlength="4" :readonly="true">
            <el-select v-model="roomType" slot="prepend" style="width:90px" @change="roomTypeChange">
              <el-option label="单人间" value="1"></el-option>
              <el-option label="双人间" value="2"></el-option>
            </el-select>
            <template slot="append">晚</template>
          </money-input>
        </el-form-item>
        <el-form-item label="房价" class="arrArea roomPrice" label-width="100px" key="price" prop="price" v-if="feeTypeCode=='FIN0601'">
          <money-input v-model="feeForm.price" :prepend="false" class="hasUnit" :maxlength="7" @change="priceChange">
            <template slot="append">元/天</template>
          </money-input>
          <p class="warnInfo" v-show="suggestPrice">最高{{suggestPrice}}元/天</p>
        </el-form-item>
        <!-- 国际差旅 -->
        <el-form-item label="币种" class="deptArea" prop="currency" key="currency" v-if="feeTypeCode=='FIN0603'">
          <el-select v-model="feeForm.currency">
            <el-option :label="item.currencyName" :value="item.currencyCode" v-for="item in currencyList"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="补助天数" class="arrArea" label-width="100px" key="assPrice" prop="dayNum" v-if="feeTypeCode=='FIN0603'">
          <el-input class="hasUnit" v-model="feeForm.dayNum" :readonly="true">
            <template slot="append">天</template>
          </el-input>
        </el-form-item>
        <!-- 交通费 -->
        <el-form-item label="高铁动车" class="deptArea" prop="highTrain" key="highTrain" v-if="feeTypeCode=='FIN0602'">
          <money-input v-model="feeForm.highTrain" :prepend="false" class="hasUnit" @change="calcTotalFee1">
            <template slot="append">元</template>
          </money-input>
        </el-form-item>
        <el-form-item label="火车" class="arrArea" label-width="100px" key="train" prop="train" v-if="feeTypeCode=='FIN0602'">
          <money-input v-model="feeForm.train" :prepend="false" class="hasUnit" @change="calcTotalFee1">
            <template slot="append">元</template>
          </money-input>
        </el-form-item>
        <el-form-item label="的士" class="deptArea" prop="taxi" key="taxi" v-if="feeTypeCode=='FIN0602'">
          <money-input v-model="feeForm.taxi" :prepend="false" class="hasUnit" @change="calcTotalFee1">
            <template slot="append">元</template>
          </money-input>
        </el-form-item>
        <el-form-item label="其他" class="arrArea" label-width="100px" key="other" prop="other" v-if="feeTypeCode=='FIN0602'">
          <money-input v-model="feeForm.other" :prepend="false" class="hasUnit" @change="calcTotalFee1">
            <template slot="append">元</template>
          </money-input>
        </el-form-item>
        <!-- 补助 -->
        <template v-if="feeTypeCode=='FIN0604'">
          <el-form-item label="是否派车" prop="isSend" class="deptArea" key="isSend" label-width="100px">
            <el-radio-group v-model="feeForm.isSend" class="myRadio" @change="calcTotalFee2">
              <el-radio-button label="1">是<i></i></el-radio-button>
              <el-radio-button label="0">否<i></i></el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="日期" prop="timeLine" class="clearBoth" key="timeLine1">
            <el-date-picker v-model="feeForm.timeLine" type="datetimerange" @change="calcTotalFee2"></el-date-picker>
          </el-form-item>
        </template>
        <!-- 培训及会议差旅补助 -->
        <template v-if="feeTypeCode=='FIN0605'">
          <el-form-item label="是否提供餐食" prop="isSupplyFood" class="deptArea" key="isSupplyFood">
            <el-radio-group v-model="feeForm.isSupplyFood" class="myRadio" @change="calcTotalFee3">
              <el-radio-button label="1">是<i></i></el-radio-button>
              <el-radio-button label="0">否<i></i></el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否提供交通" prop="isSupplyTraffic" class="deptArea" key="isSupplyTraffic">
            <el-radio-group v-model="feeForm.isSupplyTraffic" class="myRadio" @change="calcTotalFee3">
              <el-radio-button label="1">是<i></i></el-radio-button>
              <el-radio-button label="0">否<i></i></el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="补助天数" class="deptArea" key="assPrice" prop="dayNum">
            <el-input class="hasUnit" v-model="feeForm.dayNum" :readonly="true">
              <template slot="append">天</template>
            </el-input>
          </el-form-item>
        </template>
        <!--   -->
        <el-form-item label="说明" prop="des" class="clearBoth" key="des">
          <el-input v-model="feeForm.des" :maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="报销金额" prop="totalFee" key="totalFee" class="clearBoth totalFee">
          <money-input v-model="feeForm.totalFee" :readonly="feeTypeCode=='FIN0602'||feeTypeCode=='FIN0604'||feeTypeCode=='FIN0605'" :prepend="false" class="hasUnit">
            <template slot="append">元</template>
          </money-input>
          <p class="warnInfo" v-show="suggestPrice&&feeForm.dayNum&&feeTypeCode=='FIN0601'">最高报销{{numFixed2(suggestPrice*feeForm.dayNum)}}元</p>
          <el-button type="primary" @click="addFee"><i class="el-icon-plus"></i> 添加</el-button>
        </el-form-item>
      </el-form>
      <!-- 费用表格 -->
      <div class="appTable">
        <el-table :data="feeTable" :stripe="true" highlight-current-row style="width: 100%" empty-text="未添加报销项" class="expandTable">
          <el-table-column type="expand">
            <template scope="props">
              <el-form label-position="left" label-width="100px" inline>
                <el-form-item label="逗留城市" v-if="props.row.cityName||props.row.stayCity">
                  <span>{{ props.row.cityName||props.row.stayCity }}</span>
                </el-form-item>
                <el-form-item label="住宿天数" v-if="props.row.accommodationDays">
                  <span>{{ props.row.accommodationDays }}天</span>
                </el-form-item>
                <el-form-item label="房间类型" v-if="props.row.accommodationTypeName">
                  <span>{{ props.row.accommodationTypeName}}</span>
                </el-form-item>
                <el-form-item label="房价" v-if="props.row.price">
                  <span>{{ props.row.price }}元/天</span>
                </el-form-item>
                <el-form-item label="高铁动车" v-if="props.row.highSpeedTrainFare">
                  <span>{{ props.row.highSpeedTrainFare }}元</span>
                </el-form-item>
                <el-form-item label="火车" v-if="props.row.trainFare">
                  <span>{{ props.row.trainFare }}元</span>
                </el-form-item>
                <el-form-item label="的士" v-if="props.row.taxiFare">
                  <span>{{ props.row.taxiFare }}元</span>
                </el-form-item>
                <el-form-item label="其他" v-if="props.row.otherFare">
                  <span>{{ props.row.otherFare }}元</span>
                </el-form-item>
                <template v-if="props.row.feeTypeCode == 'FIN0604'">
                  <el-form-item label="开始时间">
                    <span>{{ props.row.startDate | time('all')}}</span>
                  </el-form-item>
                  <el-form-item label="结束时间">
                    <span>{{ props.row.endDate | time('all')}}</span>
                  </el-form-item>
                </template>
                <el-form-item label="是否派车" v-if="props.row.isSendCar==='1'||props.row.isSendCar==='0'">
                  <span>{{ props.row.isSendCar==1?'是':'否' }}</span>
                </el-form-item>
                allowanceDays
                <el-form-item label="补助天数" v-if="props.row.allowanceDays">
                  <span>{{ props.row.allowanceDays }}天</span>
                </el-form-item>
                <template v-if="props.row.feeTypeCode == 'FIN0605'">
                  <el-form-item label="是否提供餐食">
                    <span>{{ props.row.isSupplyFood==1?'是':'否' }}</span>
                  </el-form-item>
                  <el-form-item label="是否提供交通">
                    <span>{{ props.row.isSupplyTraffic==1?'是':'否' }}</span>
                  </el-form-item>
                </template>
                <el-form-item label="说明">
                  <span>{{ props.row.des }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column property="feeTypeName" label="费用项目"></el-table-column>
          <el-table-column property="startDate" label="日期" width="200">
            <template scope="scope">
              {{scope.row.startDate | time('date')}} ~ {{scope.row.endDate | time('date')}}
            </template>
          </el-table-column>
          <!-- <el-table-column property="des" label="说明"></el-table-column> -->
          <el-table-column property="totalFee" label="报销金额(元)" width="130"></el-table-column>
          <el-table-column property="currencyName" label="币种" width="75"></el-table-column>
          <el-table-column property="rmb" label="人民币(元)" width="125">
          </el-table-column>
          <el-table-column label=" " width="55">
            <template scope="scope">
              <el-button @click.native.prevent="deleteFee(scope.$index)" type="text" size="small" icon="delete">
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <p class="totalMoney">合计金额 人民币 <span>{{totalFee}}元 {{totalFee | moneyCh}}</span></p>
      </div>
      <!-- 预算 -->
      <el-form label-position="left" :model="budgetForm" :rules="budgetRule" ref="budgetForm" label-width="128px">
        <el-form-item label="预算年份" class="widthLeft40 year">
          {{year}}
        </el-form-item>
        <el-form-item label="预算机构/科目" prop="budgetDept" class="widthRight60">
          <el-cascader :clearable="true" :options="budgetDeptList" :props="budgetProp" v-model="budgetForm.budgetDept" :show-all-levels="false" @active-item-change="handleItemChange" @change="depChange" popper-class="myCascader" style="width:100%" :disabled="budgetTable.length>0"></el-cascader>
        </el-form-item>
        <ul class="budgetInfo clearfix clearBoth" v-show="budgetInfo">
          <li>年度预算{{budgetInfo.budgetTotal | toThousands}}元</li>
          <li>可用预算{{budgetInfo.budgetRemain | toThousands}}元</li>
          <li>预算执行比例{{budgetInfo.execRateStr}}</li>
        </ul>
        <el-form-item label="发票类型" prop="invoiceNum" placeholder="" class="clearBoth">
          <money-input v-model="budgetForm.invoiceNum" :disabled="activeInvoice!='FIN0201'||budgetTable.length>0" placeholder="用 , 分割多个票号" :append="false" type="invoice" :maxlength="1000">
            <el-select v-model="activeInvoice" slot="prepend" style="width:160px" @change="invoiceTypeChange" :disabled="budgetTable.length>0">
              <el-option v-for="item in invoiceList" :key="item.dictCode" :label="item.dictName" :value="item.dictCode"></el-option>
            </el-select>
          </money-input>
        </el-form-item>
        <el-form-item label="增值税税费总额" prop="taxMoney" v-if="activeInvoice=='FIN0201'" class="taxMoney">
          <money-input v-model="budgetForm.taxMoney" style="width:50%" class="hasUnit" :maxlength="10" @change="tranMoney" :disabled="budgetTable.length>0">
            <el-select v-model="activeCurrency" style="width:100px" slot="prepend" @change="tranMoney" :disabled="budgetTable.length>0">
              <el-option :label="item.currencyName" :value="item.currencyCode" v-for="item in currencyList"></el-option>
            </el-select>
            <template slot="append">元</template>
          </money-input>
          <p class="warnInfo" v-show="taxRmb!=0">人民币{{taxRmb}}元</p>
        </el-form-item>
        <el-form-item label="" class="clearBoth">
          <el-button type="primary" @click="addBudget" class="addBudget" :disabled="budgetTable.length>0"><i class="el-icon-plus"></i> 添加</el-button>
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
          <el-table-column property="money" label="报销金额(元)" width="130">
          </el-table-column>
          <el-table-column property="accurencyName" label="币种" width="75"></el-table-column>
          <el-table-column property="rmb" label="人民币(元)" width="125">
          </el-table-column>
          <el-table-column label=" " width="55">
            <template scope="scope">
              <el-button @click.native.prevent="deleteBudget(scope.$index)" type="text" size="small" icon="delete" v-if="scope.$index==0">
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
        <el-form-item label="收款账户" prop="bankAccount" class="arrArea" label-width="100px" style="width:49%">
          <money-input v-model="paymentForm.bankAccount" :maxlength="50" :prepend="false" :append="false" type="bankCode"></money-input>
        </el-form-item>
      </template>
      <el-form-item label="上传发票" prop="invoiceAttach" class="clearBoth">
        <el-upload class="myUpload" :action="baseURL+'/doc/uploadDocFinFile'" :data="{docTypeCode:'CLB',finType:2,classify:2}" :on-success="handleInvoiceSuccess" :on-error="handleInvoiceError" :before-upload="beforeInvoiceUpload" :file-list="paymentForm.invoiceAttach" ref="invoiceUpload" :on-remove="handleInvoiceRemove">
          <el-button size="small" type="primary">上传发票<i class="el-icon-upload el-icon--right"></i></el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <person-dialog @updatePerson="updatePerson" :selfDisable="false" :visible.sync="personDialogVisible" hasLeaderDep></person-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import PersonDialog from '../../../components/personDialog.component'
import MoneyInput from '../../../components/moneyInput.component'
import _ from 'lodash'

export default {
  components: { MoneyInput, PersonDialog },
  data() {
    var checkNum = (rule, value, callback) => {
      if (this.activeInvoice != 'FIN0201') {
        callback();
      } else {
        if (!value) {
          callback(new Error('请输入发票号'))
        } else {
          callback();
        }
      }
    };
    var checkTotalFee = (rule, value, callback) => {
      if (this.feeTypeCode == 'FIN0601' && this.maxMoney != 0) {

        if (parseFloat(value) > this.maxMoney) {
          callback(new Error('报销金额不能大于最高报销金额'))
        } else {
          callback();
        }
      } else {
        callback();

      }
    };
    var checkTaxMoney = (rule, value, callback) => {
      if (this.activeInvoice == 'FIN0201' && this.totalFee != 0) {

        if (this.taxRmb >= this.totalFee) {
          callback(new Error('增值税税费总额必须小于报销金额总和'))
        } else if (this.taxRmb > this.addTax.remainMoney) {
          callback(new Error('增值税税费总额必须小于增值税税费可用预算'))
        } else {
          callback();
        }
      } else {
        callback();

      }
    };
    var checkTimeline = (rule, value, callback) => {
      if (value.length > 0 && value[0] && value[0].getTime() == value[1].getTime() && this.feeTypeCode === 'FIN0604') {
        callback(new Error('开始时间不能等于结束时间'))
      } else {
        callback();
      }
    };
    return {
      personDialogVisible: false,
      budgetForm: {
        budgetDept: [],
        invoiceNum: '',
        taxMoney: '',
      },
      budgetRule: {
        budgetDept: [{ type: 'array', required: true, message: '请选择预算机构/科目', trigger: 'blur' }],
        invoiceNum: [{ required: true, message: '请输入发票号', validator: checkNum, trigger: 'blur' }],
        taxMoney: [{ required: true, message: '请输入增值税税费总额', trigger: 'blur' },
          { validator: checkTaxMoney, trigger: 'blur' }
        ],
      },
      feeForm: {
        timeLine: [],
        price: '',
        dayNum: '',
        totalFee: '',
        area: '',
        city: '',
        des: '',
        currency: '',
        highTrain: '',
        train: '',
        taxi: '',
        other: '',
        isSend: '1',
        isSupplyFood: '0',
        isSupplyTraffic: '0'
      },
      feeTypeCode: '',
      feeRule: {
        timeLine: [{ type: 'array', required: true, message: '请选择日期', trigger: 'blur' }, { validator: checkTimeline, trigger: 'blur,change' }],
        price: [{ required: true, message: '请输入金额', trigger: 'blur' }],
        city: [{ required: true, message: '请输入城市', trigger: 'blur' }],
        // des: [{ required: true, message: '请输入说明', trigger: 'blur' }],
        totalFee: [{ required: true, message: '请输入金额', trigger: 'blur' },
          { validator: checkTotalFee, trigger: 'blur,change' }
        ],
        dayNum: [{ type: 'number', required: true, message: '请选择住宿日期', trigger: 'change' }],
        currency: [{ required: true, message: '请选择币种', trigger: 'change' }],
        isSend: [{ required: true, message: '请选择是否派车', trigger: 'change' }],
      },
      roomType: '1',
      feeTable: [],
      // year: new Date().getFullYear(),
      budgetDeptList: [],
      budgetInfo: '',
      feeTypes: [],
      areaList: [],
      currencyList: [],
      invoiceList: [],
      activeCurrency: '',
      activeInvoice: '',
      budgetTable: [],
      timeout: null,
      paymentForm: {
        payMthodCode: '',
        paymentOthers: '',
        invoiceAttach: [],
        payee: '',
        bankAccount: '',
        empId: '',
        appUserName: ''
      },
      paymentRule: {
        payMthodCode: [{ required: true, message: '请选择付款方式', trigger: 'blur' }],
        paymentOthers: [{ required: true, trigger: 'blur', message: '请输入付款方式' }],
        contractAttach: [{ type: 'array', required: true, trigger: 'blur', message: '请选择合同' }],
        // invoiceAttach: [{ type: 'array', required: true, trigger: 'blur', message: '请选择发票' }],
        bankAccount: [{ required: true, trigger: 'blur', message: '请输入收款账户' }],
        payee: [{ required: true, trigger: 'blur', message: '请选择收款人' }],
        appUserName: [{ required: true, message: '请选择报销申请人', trigger: 'blur' }],

      },
      payMthods: [],
      types: [],
      payMthod: '',
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
      suggestPrice: '',
      appPerson: '',
      addTax: '',
      taxRmb: '',
      isDraft: false,
      minDate: '',
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
    totalFee() {
      var num = 0;
      if (this.feeTable.length != 0) {
        this.feeTable.forEach(b => {
          if (b.rmb) {
            num += b.rmb;
          }
        })
      }
      return parseFloat(this.numFixed2(num))
    },
    maxMoney() {
      var num = 0;
      if (this.feeForm.dayNum && this.suggestPrice) {
        num = parseFloat(this.numFixed2(this.feeForm.dayNum * this.suggestPrice))
      }
      return num
    },
    dateOptions: function() {
      var minDate = '';
      var options = {};
      if (this.feeTypeCode == 'FIN0601') {
        options = {
          onPick(obj) {
            if (obj.maxDate) {
              minDate = ''
            } else if (obj.minDate) {
              minDate = obj.minDate;
            }
          },
          disabledDate(time) {
            if (minDate != '') {
              return time.getTime() <= minDate.getTime();
            } else {
              return false
            }
          }
        }
      } else {
        options = {
          onPick(obj) {},
          disabledDate(time) {
            return false
          }
        }
      }
      return options
    },
    ...mapGetters([
      'submitLoading',
      'baseURL',
      'userInfo',
      'year'
    ])
  },
  created() {
    this.getFeeType(); //费用项目
    this.getBudgetDeptList(); //预算机构
    this.getInvoiceList(); //发票类型
    this.getCurrencyList(); //币种
    this.getPayMthod(); //付款方式
    this.getArea(); //逗留城市
    this.getAddTax() //增值税进项税额
    this.appPerson = {
      name: this.userInfo.name,
      empId: this.userInfo.empId
    }
    this.paymentForm.appUserName = this.userInfo.name;

  },
  mounted() {
    // this.$emit('updateSuggest', 'DOC0601');

  },
  methods: {
    saveForm() {
      var params = JSON.stringify({
        budgetTable: this.budgetTable,
        paymentForm: this.paymentForm,
        feeTable: this.feeTable,
        appPerson: this.appPerson
      });
      this.$emit('saveMiddle', params);
    },
    getDraft(obj) {
      if (obj.paymentForm.payMthodCode == 'FIN0101') {
        this.isDraft = true;
      }
      this.paymentForm = obj.paymentForm;
      this.budgetTable = obj.budgetTable;
      this.feeTable = obj.feeTable;
      this.appPerson = obj.appPerson;
    },
    addFee() {
      this.$refs.feeForm.validate(valid => {
        if (valid) {
          var feeType = this.feeTypes.find(i => i.dictCode == this.feeTypeCode);
          var item = {
            feeTypeName: feeType.dictName,
            feeTypeCode: feeType.dictCode,
            des: this.feeForm.des,
            totalFee: this.feeForm.totalFee,
            currencyName: this.currencyList[0].currencyName,
            currencyCode: this.currencyList[0].currencyCode,
            startDate: this.feeForm.timeLine[0].getTime(),
            endDate: this.feeForm.timeLine[1].getTime()
          }
          if (this.feeTypeCode == 'FIN0601') { //住宿
            item.cityCode = this.feeForm.area;
            item.cityName = this.feeForm.city;
            item.roomPrice = this.feeForm.price,
              item.accommodationDays = this.feeForm.dayNum;
            item.accommodationTypeCode = this.roomType;
            item.accommodationTypeName = this.roomType == 1 ? '单人间' : '双人间';
          } else if (this.feeTypeCode == 'FIN0602') { //交通
            item.highSpeedTrainFare = this.feeForm.highTrain;
            item.trainFare = this.feeForm.train;
            item.taxiFare = this.feeForm.taxi;
            item.otherFare = this.feeForm.other;
          } else if (this.feeTypeCode == 'FIN0603') { //国际差旅
            var currency = this.currencyList.find(c => c.currencyCode == this.feeForm.currency);
            item.allowanceDays = this.feeForm.dayNum;
            item.currencyName = currency.currencyName;
            item.currencyCode = currency.currencyCode;
            item.stayCity = this.feeForm.city;
          } else if (this.feeTypeCode == 'FIN0604') { //补助
            item.isSendCar = this.feeForm.isSend;
          } else if (this.feeTypeCode == 'FIN0605') { //培训及会议差旅补助
            item.isSupplyFood = this.feeForm.isSupplyFood;
            item.isSupplyTraffic = this.feeForm.isSupplyTraffic;
            item.allowanceDays = this.feeForm.dayNum;
          }
          this.$http.post('/doc/getRmbByExchangeRate', { currencyId: item.currencyCode, amount: item.totalFee })
            .then(res => {
              if (res.status == 0) {
                if (this.budgetTable.length == 0) {
                  item.rmb = res.data.amount;
                  item.exchangeRateId = res.data.rateId;
                  item.exchangeRate = res.data.rateReverse;
                  this.feeTable.push(item);
                  this.clearFeeForm();
                } else {
                  var temp = parseFloat(this.budgetTable[0].rmb) + res.data.amount;
                  if (temp > this.budgetInfo.budgetRemain) {
                    this.$message.warning('报销金额不能大于可用预算');
                  } else {
                    item.rmb = res.data.amount;
                    item.exchangeRateId = res.data.rateId;
                    item.exchangeRate = res.data.rateReverse;
                    this.feeTable.push(item);
                    this.clearFeeForm();
                    this.budgetTable[0].rmb = temp;
                    this.budgetTable[0].money = temp + '';
                  }
                }
              } else {
                console.log('货币兑换失败')
              }
            })
        } else {

        }
      })
    },
    clearFeeForm(val) {
      this.$refs.feeForm.resetFields();
      this.feeForm.price = '';
      this.feeForm.timeLine = [];
      this.feeForm.highTrain = '';
      this.feeForm.train = '';
      this.feeForm.taxi = '';
      this.feeForm.other = '';
      this.getRoomPrice();
    },
    changeFeeType(val) {
      this.clearFeeForm();
    },
    topDateChange(val) {
      if (this.feeForm.timeLine.length > 0 && this.feeForm.timeLine[0]) {
        var num = parseInt((this.feeForm.timeLine[1].getTime() - this.feeForm.timeLine[0].getTime()) / 86400000);
        if (this.feeTypeCode === 'FIN0603' || this.feeTypeCode === 'FIN0605') {
          num += 1
        }
        this.feeForm.dayNum = num;
        if (this.feeTypeCode === 'FIN0605') {
          this.calcTotalFee3();
        }
        this.calcTotalFee();
      } else {
        this.feeForm.dayNum = '';
        if (this.feeTypeCode === 'FIN0605') {
          this.calcTotalFee3();
        }
        this.calcTotalFee();
      }
      this.getRoomPrice();
    },
    roomTypeChange(val) {
      this.getRoomPrice();
    },
    areaChange(val) {
      this.getRoomPrice();
    },
    selectPerson() {
      this.$confirm('重新选择报销申请人将清除已添加信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.personDialogVisible = true;
      }).catch(() => {});
    },
    updatePerson(reciver) {
      this.paymentForm.appUserName = reciver.name;
      this.appPerson = reciver;
      this.personDialogVisible = false;
      this.clearFeeForm();
      this.budgetTable = [];
      this.feeTable = [];
      this.getRoomPrice();
    },
    priceChange() {
      this.calcTotalFee();
    },
    calcTotalFee() {
      if (this.feeTypeCode == 'FIN0601') {
        if (this.feeForm.dayNum && this.feeForm.price) {
          this.feeForm.totalFee = this.numFixed2(this.feeForm.dayNum * this.feeForm.price)
        } else {
          this.feeForm.totalFee = '';
        }
      }
    },
    calcTotalFee1() {
      if (this.feeTypeCode == 'FIN0602') {
        this.feeForm.totalFee =this.numFixed2(parseFloat(this.feeForm.highTrain || 0) + parseFloat(this.feeForm.train || 0) + parseFloat(this.feeForm.taxi || 0) + parseFloat(this.feeForm.other || 0));
      }
    },
    calcTotalFee2() {
      if (this.feeTypeCode == 'FIN0604') {
        if (this.feeForm.isSend != '' && this.appPerson && this.feeForm.timeLine.length > 0 && this.feeForm.timeLine[0]) {
          var params = {
            empId: this.appPerson.empId,
            travelType: this.feeTypeCode,
            startDate: this.timeFilter(this.feeForm.timeLine[0].getTime(), 'date'),
            endDate: this.timeFilter(this.feeForm.timeLine[1].getTime(), 'date'),
            startTime: this.timeFilter(this.feeForm.timeLine[0].getTime(), 'hours'),
            endTime: this.timeFilter(this.feeForm.timeLine[1].getTime(), 'hours'),
            isSendCar: this.feeForm.isSend
          }
          this.$http.post('/doc/docFinTravelpayRule', params)
            .then(res => {
              if (res.status == 0) {
                this.feeForm.totalFee = res.data.toString();
              } else {

              }
            })
        } else {
          this.feeForm.totalFee = '';
        }
      }
    },
    calcTotalFee3() {
      if (this.feeTypeCode == 'FIN0605') {
        if (this.feeForm.timeLine.length > 0 && this.feeForm.timeLine[0]) {
          var params = {
            empId: this.appPerson.empId,
            travelType: this.feeTypeCode,
            startDate: this.timeFilter(this.feeForm.timeLine[0].getTime(), 'date'),
            endDate: this.timeFilter(this.feeForm.timeLine[1].getTime(), 'date'),
            isSupplyFood: this.feeForm.isSupplyFood,
            isSupplyTraffic: this.feeForm.isSupplyTraffic,
          }
          this.$http.post('/doc/docFinTravelpayRule', params)
            .then(res => {
              if (res.status == 0) {
                this.feeForm.totalFee = res.data.toString();
              } else {

              }
            })
        } else {
          this.feeForm.totalFee = '';
        }
      }
    },
    deleteFee(index) {
      this.feeTable.splice(index, 1);
      this.budgetTable = [];
    },
    getRoomPrice() {
      if (this.feeForm.area && this.appPerson && this.roomType && this.feeTypeCode == 'FIN0601' && this.feeForm.timeLine.length > 0 && this.feeForm.timeLine[0]) {
        var params = {
          empId: this.appPerson.empId,
          cityCode: this.feeForm.area,
          roomType: this.roomType,
          travelType: this.feeTypeCode,
        }
        this.$http.post('/doc/docFinTravelpayRule', params)
          .then(res => {
            if (res.status == 0) {
              this.suggestPrice = res.data;
            } else {

            }
          })
      } else {
        this.suggestPrice = ''
      }
    },
    submitForm() {
      if (this.budgetTable.length != 0) {
        this.$refs.paymentForm.validate((valid) => {
          if (valid) {
            this.submitAll();
          } else {
            this.$message.warning('请检查填写字段')
            this.$emit('submitMiddle', false);
            return false;
          }
        });
      } else {
        this.$emit('submitMiddle', false);
        this.$message.warning('未添加付款项');
      }
    },
    submitAll() {
      var payMthod = this.payMthods.find(i => i.dictCode == this.paymentForm.payMthodCode);
      var travelpayItemList = this.clone(this.budgetTable).map(function(b) {
        delete b.currencyCode;
        b.receiptTicket = b.invoiceCode.join();
        delete b.invoiceCode;
        return b;
      });
      var travelpay = {
        "budgetYear": this.year,
        "paymentMethodCode": payMthod.dictCode, //付款方式code 
        "paymentMethodName": payMthod.dictName, //付款方式名
        "paymentMethodOthers": this.paymentForm.paymentOthers, //其他付款方式名
        "payeeUserId": this.paymentForm.empId,
        "payeeUser": this.paymentForm.payee,
        "payeeAccount": this.paymentForm.bankAccount,
        "travelpayUser": this.appPerson.name,
        "travelpayUserId": this.appPerson.empId
      }
      var paramsList = {
        travlepayStayList: [],
        travelpayTrafficList: [],
        travelpayAllowanceList: [],
        trainAllowanceList: []
      }
      this.clone(this.feeTable).forEach(f => {
        f.remark = f.des;

        f.acurrencyName = f.currencyName;
        f.dictTravelName = f.feeTypeName;
        delete(f.feeTypeName);
        delete(f.currencyName);
        delete(f.des);
        delete(f.currencyCode);
        if (f.feeTypeCode == 'FIN0601') { //住宿
          f.reimburseRoomPrice = f.rmb;
          f.startDate = this.timeFilter(f.startDate, 'date');
          f.endDate = this.timeFilter(f.endDate, 'date');
          delete(f.feeTypeCode);
          delete(f.totalFee);
          delete(f.rmb);
          paramsList.travlepayStayList.push(f);
        } else if (f.feeTypeCode == 'FIN0602') { //交通
          f.startDate = this.timeFilter(f.startDate, 'date');
          f.endDate = this.timeFilter(f.endDate, 'date');
          delete(f.rmb);
          delete(f.totalFee);
          delete(f.feeTypeCode);
          paramsList.travelpayTrafficList.push(f);
        } else if (f.feeTypeCode == 'FIN0603') { //国际差旅
          f.startDate = this.timeFilter(f.startDate, 'date');
          f.endDate = this.timeFilter(f.endDate, 'date');
          f.allowanceMoney = f.rmb;
          f.dictTravelId = f.feeTypeCode;
          f.allowanceTotalMoney = f.totalFee
          delete(f.feeTypeCode);
          delete(f.totalFee);
          delete(f.rmb);
          paramsList.travelpayAllowanceList.push(f);
        } else if (f.feeTypeCode == 'FIN0604') { //补助
          f.allowanceMoney = f.rmb;
          f.dictTravelId = f.feeTypeCode;
          f.startTime = this.timeFilter(f.startDate, 'hours');
          f.endTime = this.timeFilter(f.endDate, 'hours');
          f.startDate = this.timeFilter(f.startDate, 'date');
          f.endDate = this.timeFilter(f.endDate, 'date');
          delete(f.feeTypeCode);
          delete(f.totalFee);
          delete(f.rmb);
          paramsList.travelpayAllowanceList.push(f);

        } else if (f.feeTypeCode == 'FIN0605') {
          f.startDate = this.timeFilter(f.startDate, 'date');
          f.endDate = this.timeFilter(f.endDate, 'date');
          f.dictTravelId = f.feeTypeCode;
          f.allowanceMoney = f.rmb;
          f.allowanceRmb = f.rmb;
          delete(f.feeTypeCode);
          delete(f.totalFee);
          delete(f.rmb);
          paramsList.trainAllowanceList.push(f);
        }
      })
      var finFileIds = this.paymentForm.invoiceAttach.map(c => c.response.data);
      this.$emit('submitMiddle', Object.assign({ travelpay: travelpay, travelpayItemList: travelpayItemList, finFileIds: finFileIds }, paramsList))
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
      console.log(file)
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
      if (this.feeTable.length != 0) {
        this.$refs.budgetForm.validate((valid) => {
          if (valid) {
            var dep = this.getBudgetDep();
            var invoice = this.invoiceList.find(i => i.dictCode == this.activeInvoice);

            var item = {
              "budgetDeptId": dep.budgetDeptCode, //预算部门id
              "budgetDeptName": dep.budgetDeptName, //预算部门名
              "budgetItemId": dep.budgetItemCode, //预算科目id
              "budgetItemName": dep.budgetItemName, //预算科目名
              "money": this.totalFee, //申报金额
              "receiptTypeCode": invoice.dictCode, //发票类型code, FIN02中
              "receiptTypeName": invoice.dictName, //发票类型名
              "accurencyName": this.currencyList[0].currencyName, //币种
              "currencyCode": this.currencyList[0].currencyCode,
              "invoiceCode": [], //发票票号, 可以为多个, 用英文逗号分隔
              "rmb": "", //对应的人民币
              "budgetYear": this.year,
              "exchangeRateId": "", //汇率id
              "exchangeRate": "", //汇率
            }
            if (this.activeInvoice == 'FIN0201') {
              var currency = this.currencyList.find(i => i.currencyCode == this.activeCurrency)
              var taxItem = {
                "budgetDeptId": this.addTax.deptId, //预算部门id
                "budgetDeptName": this.addTax.budgetDeptName, //预算部门名
                "budgetItemId": this.addTax.budgetItemId, //预算科目id
                "budgetItemName": this.addTax.budgetName, //预算科目名
                "money": this.budgetForm.taxMoney, //申报金额
                "receiptTypeCode": invoice.dictCode, //发票类型code, FIN02中
                "receiptTypeName": invoice.dictName, //发票类型名
                "accurencyName": currency.currencyName, //币种
                "currencyCode": currency.currencyCode,
                "invoiceCode": this.budgetForm.invoiceNum.split(','), //发票票号, 可以为多个, 用英文逗号分隔
                "rmb": "", //对应的人民币
                "budgetYear": this.year,
                "exchangeRateId": "", //汇率id
                "exchangeRate": "", //汇率
              }
              this.$http.post('/doc/getRmbByExchangeRate', { currencyId: taxItem.currencyCode, amount: taxItem.money })
                .then(res => {
                  if (res.status == 0) {
                    taxItem.rmb = res.data.amount;
                    taxItem.exchangeRateId = res.data.rateId;
                    taxItem.exchangeRate = res.data.rateReverse;
                    if (item.money - taxItem.rmb > 0) {
                      this.budgetTable.push(taxItem);
                      item.money = (item.money - taxItem.rmb).toFixed(2);
                      this.$http.post('/doc/getRmbByExchangeRate', { currencyId: this.currencyList[0].currencyCode, amount: item.money })
                        .then(res => {
                          if (res.status == 0) {
                            item.rmb = res.data.amount;
                            item.exchangeRateId = res.data.rateId;
                            item.exchangeRate = res.data.rateReverse;
                            if (!this.budgetInfo||this.budgetInfo.budgetRemain <= 0 || item.rmb > this.budgetInfo.budgetRemain) {
                              this.$message.warning('报销金额不能大于可用预算');
                              this.budgetTable = [];
                            } else {
                              this.budgetTable.unshift(item);
                            }
                          }
                        })
                    } else {
                      this.$refs.budgetForm.validateField('taxMoney');
                    }

                  } else {
                    console.log('货币兑换失败')
                  }
                })
            } else {
              this.$http.post('/doc/getRmbByExchangeRate', { currencyId: this.currencyList[0].currencyCode, amount: item.money })
                .then(res => {
                  if (res.status == 0) {
                    item.rmb = res.data.amount;
                    item.exchangeRateId = res.data.rateId;
                    item.exchangeRate = res.data.rateReverse;
                    this.budgetTable.push(item);
                  } else {
                    console.log('货币兑换失败')
                  }
                })
            }
          } else {

          }
        })
      } else {
        this.$message.warning('请先添加报销项！')
      }
    },
    tranMoney: _.debounce(function() {
      if (this.activeCurrency != 'CNY') {
        this.$http.post('/doc/getRmbByExchangeRate', { currencyId: this.activeCurrency, amount: this.budgetForm.taxMoney })
          .then(res => {
            if (res.status == 0) {
              this.taxRmb = res.data.amount;
              this.$refs.budgetForm.validateField('taxMoney');
            } else {
              console.log('货币兑换失败')
            }
          })
      } else {
        this.taxRmb = this.budgetForm.taxMoney;
      }
    }, 500),
    deleteBudget(index) {
      this.budgetTable = [];
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
    getFeeType() {
      this.$http.post('/api/getDict', { dictCode: 'FIN06' })
        .then(res => {
          if (res.status == '0') {
            this.feeTypes = res.data;
            this.feeTypeCode = res.data[0].dictCode;
          } else {
            console.log('获取报销类型失败')
          }
        }, res => {

        })
    },
    getArea() {
      this.$http.post('/api/getDict', { dictCode: 'FIN07' })
        .then(res => {
          if (res.status == '0') {
            this.areaList = res.data;
            this.feeForm.area = res.data[0].dictCode;
          } else {
            console.log('获取区域类型失败')
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
            this.feeForm.currency = res.data[0].currencyCode;
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
.travelRemibApp {
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
  .innerInput {
    .el-input-group__prepend {
      padding: 0 1px;
      .el-input {
        width: 100px;
        input {
          border: none;
          height: 44px;
        }
      }
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
  .totalFee {
    .moenyInput {
      float: left;
      width: 170px;
    }
    .warnInfo {
      color: $main;
      float: left;
      margin-left: 10px;
      line-height: 46px;
    }
    .el-button {
      width: 100px;
      float: right;
      height: 46px;
    }
  }
  .roomPrice {
    .moenyInput {
      float: left;
      width: 130px;
    }
    .warnInfo {
      color: $main;
      float: right;
      line-height: 46px;
      position: absolute;
      left: 60%;
      white-space: nowrap;
    }
  }
  .taxMoney {
    .moenyInput {
      float: left;
    }
    .warnInfo {
      color: $main;
      float: left;
      margin-left: 10px;
      line-height: 46px;
    }
  }
  .addBudget {
    width: 100px;
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
