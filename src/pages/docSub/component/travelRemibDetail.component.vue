<template>
  <div class="travelReimbDetail clearfix">
    <el-table :data="tableData" :stripe="true" highlight-current-row style="width: 100%" class="expandTable">
      <el-table-column type="expand">
        <template scope="props">
          <el-form label-position="left" label-width="90px" inline>
            <el-form-item label="逗留城市" v-if="props.row.city">
              <span>{{ props.row.city}}</span>
            </el-form-item>
            <el-form-item label="住宿天数" v-if="props.row.dayNum">
              <span>{{ props.row.dayNum }}天</span>
            </el-form-item>
            <el-form-item label="房间类型" v-if="props.row.roomType">
              <span>{{ props.row.roomType==1?'单人间':'双人间' }}</span>
            </el-form-item>
            <el-form-item label="房价" v-if="props.row.price">
              <span>{{ props.row.price }}元/天</span>
            </el-form-item>
            <el-form-item label="高铁动车" v-if="props.row.highTrain">
              <span>{{ props.row.highTrain }}元</span>
            </el-form-item>
            <el-form-item label="火车" v-if="props.row.train">
              <span>{{ props.row.train }}元</span>
            </el-form-item>
            <el-form-item label="的士" v-if="props.row.taxi">
              <span>{{ props.row.taxi }}元</span>
            </el-form-item>
            <el-form-item label="其他" v-if="props.row.other">
              <span>{{ props.row.other }}元</span>
            </el-form-item>
            <el-form-item label="开始时间" v-if="props.row.startTime">
              <span>{{ props.row.startDate+' '+props.row.startTime }}</span>
            </el-form-item>
            <el-form-item label="结束时间" v-if="props.row.endTime">
              <span>{{ props.row.endDate+' '+props.row.endTime }}</span>
            </el-form-item>
            <el-form-item label="是否派车" v-if="props.row.isSend==='1'||props.row.isSend==='0'">
              <span>{{ props.row.isSend==1?'是':'否' }}</span>
            </el-form-item>
            <el-form-item label="说明">
              <span>{{ props.row.des }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column property="typeName" label="费用项目"></el-table-column>
      <el-table-column property="startDate" label="日期" width="210">
        <template scope="scope">
          {{scope.row.startDate}} ~ {{scope.row.endDate}}
        </template>
      </el-table-column>
      <!-- <el-table-column property="des" label="说明"></el-table-column> -->
      <el-table-column property="money" label="报销金额(元)" width="130"></el-table-column>
      <el-table-column property="acurrencyName" label="币种" width="85"></el-table-column>
      <el-table-column property="rmb" label="人民币(元)" width="125">
      </el-table-column>
    </el-table>
    <p class="totalMoney">合计金额 人民币 <span>{{info[0].travelpay.totalMoney | toThousands}} 元</span></p>
    <el-table :data="budgetTable" :stripe="true" highlight-current-row style="width: 100%" class="appTable budgetTable ">
      <el-table-column label="预算年度" property="budgetYear" width="80"></el-table-column>
      <el-table-column property="budgetDeptName" label="预算机构/科目">
        <template scope="scope">
          {{scope.row.budgetDeptName+'/'+scope.row.budgetItemName}}
        </template>
      </el-table-column>
      <el-table-column property="receiptTicket" label="发票类型/票号" width="130">
        <template scope="scope">
          <el-tooltip effect="dark" :content="scope.row.receiptTicket" placement="top">
            <div>
              <p v-for="(code,index) in scope.row.receiptTicket.split(',')" v-if="index<3" class="invoiceNum">{{index==2?'...':code}}</p>
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column property="budgetInit" label="年度预算(元)" :formatter="formatMoney" width="130"></el-table-column>
      <el-table-column property="availableMoney" label="可用额度(元)" :formatter="formatMoney" width="130"></el-table-column>
      <el-table-column property="cExecRate" label="执行比例" width="80"></el-table-column>
      <el-table-column property="rmb" label="报销金额人民币(元)" width="100"></el-table-column>
    </el-table>
    <p class="totalMoney">合计金额 人民币 <span>{{info[0].travelpay.totalMoney | toThousands}} 元</span></p>
    <p class="borderBox clearBoth"></p>
    <el-row>
      <el-col :span="12" class="rightBorder">
        <h1 class="title">报销申请人</h1>
        <p v-if="info" class="textContent">{{info[0].travelpay.travelpayUser}}</p>
      </el-col>
      <el-col :span="12">
        <h1 class="title">申请金额</h1>
        <p v-if="info" class="textContent">人民币 {{info[0].travelpay.totalMoney | toThousands}}元</p>
      </el-col>
      <el-col :span="12" class="rightBorder">
        <h1 class="title">收款人</h1>
        <p v-if="info" class="textContent">{{info[0].travelpay.payeeUser}}</p>
      </el-col>
      <el-col :span="12">
        <h1 class="title">付款方式</h1>
        <p v-if="info[0].travelpay.paymentMethodCode!='FIN0104'" class="textContent">{{info[0].travelpay.paymentMethodName}}</p>
        <p class="textContent" v-else>{{info[0].travelpay.paymentOthers}}</p>
      </el-col>
      <el-col :span="24">
        <h1 class="title">收款账户</h1>
        <p v-if="info" class="textContent">{{info[0].travelpay.payeeAccount}}</p>
      </el-col>
      <el-col :span="24">
        <h1 class="title">发票</h1>
        <p v-if="info" class="textContent attch">
          <a :href="vo.fileUrl" v-if="vo.classify==2" v-for="vo in info[0].finFiles" target="_blank">{{vo.fileName+vo.fileTypeName}}</a>
        </p>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    info: {
      type: Array
    }
  },
  data() {
    return {
      tableData: [],
      budgetTable: [],
    }
  },
  computed: {
    totalPrice: function() {
      if (this.info.length != 0) {
        var num = 0;
        this.info.forEach(m => {
          num += m.plannedUnitPrice * m.quantity
        })
        return num
      } else {
        return 0
      }
    },
    ...mapGetters([
      'submitLoading'
    ])
  },
  created() {
    this.handleBudget();
    this.handleInfo();
  },
  methods: {
    formatMoney(row, column, cellValue) {
      return this.toThousands(cellValue)
    },
    handleBudget() {
      console.log(this.info[0]);
      console.log(6666);
      this.info[0].travelpayItemList.forEach((item, i) => {
        this.budgetTable.push(Object.assign(item, this.info[0].budgetExeststisVoList[i]))
      })
    },
    handleInfo() {
      var list = this.info[0];
      if (list.travlepayStayList.length != 0) {
        list.travlepayStayList.forEach(i => {
          var item = {
            startDate: i.startDate,
            endDate: i.endDate,
            typeName: i.dictTravelName,
            acurrencyName: i.acurrencyName,
            money: i.reimburseRoomPrice,
            rmb: i.reimburseRoomPrice,
            dayNum: i.accommodationDays,
            roomType: i.roomType,
            city: i.cityName,
            price: i.roomPrice,
            des: i.remark
          }
          this.tableData.push(item);
        })
      }
      if (list.travelpayTrafficList.length != 0) {
        list.travelpayTrafficList.forEach(i => {
          var item = {
            startDate: i.startDate,
            endDate: i.endDate,
            typeName: i.dictTravelName,
            acurrencyName: i.acurrencyName,
            money: i.totalMoney,
            rmb: i.totalMoney,
            highTrain: i.highTrain,
            train: i.trainFare,
            taxi: i.taxiFare,
            other: i.otherFare,
            des: i.remark
          }
          this.tableData.push(item);
        })
      }
      if (list.travelpayAllowanceList.length != 0) {
        list.travelpayAllowanceList.forEach(i => {
          var item = {
            startDate: i.startDate,
            endDate: i.endDate,
            typeName: i.dictTravelName,
            acurrencyName: i.acurrencyName,
            des: i.remark
          }
          if (i.dictTravelId == 'FIN0603') {
            item.city = i.stayCity;
            item.money = i.allowanceTotalMoney;
            item.rmb = i.allowanceMoney;
            item.allowanceDays = i.allowanceDays;
          } else {
            item.money = i.allowanceMoney;
            item.rmb = i.allowanceMoney;
            item.isSendCar = i.isSendCar;
            item.startTime = i.startTime;
            item.endTime = i.endTime;
          }
          this.tableData.push(item);
        })
      }
      console.log(this.tableData)
    }
  }
}

</script>
<style lang='scss'>
$main:#0460AE;
.travelReimbDetail {
  padding: 20px 0 0;
  clear: both; // border-bottom: 1px solid #D5DADF;
  .totalPrice {
    line-height: 40px;
    padding-left: 15px;
    border: 1px solid #D5DADF;
    border-top: none;
    font-size: 15px;
    span {
      margin-left: 5px;
      color: $main;
    }
  }
  .invoiceNum {
    line-height: 15px;
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
  .borderBox {
    padding-bottom: 20px;
    border-bottom: 1px solid #D5DADF;
  }
  .budgetTable {
    margin-top: 20px; // padding-bottom:20px;
    // border-bottom: 1px solid #D5DADF;
    .el-table__header th {
      background: #939393;
    }
    .el-table__header-wrapper thead div,
    .el-table__footer-wrapper thead div {
      background: #939393;
    }
  }
}

</style>
