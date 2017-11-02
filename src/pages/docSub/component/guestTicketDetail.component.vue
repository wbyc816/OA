<template>
  <div class="travelReimbDetail clearfix">
   <el-table :data="flightPersonTable" :stripe="true" highlight-current-row   class="appTable" >
    <el-table-column property="reciptName" label="乘机人"  width="70"></el-table-column>
    <el-table-column property="reciptSex" label="性别" width="50">
      <template scope="scope">
          {{scope.row.reciptSex=="M"?"男":"女"}}
        </template>
    </el-table-column>
    <el-table-column property="reciptTypeName" label="类型" ></el-table-column>
    <el-table-column property="reciptCredentialsTypeName" label="证件类型" ></el-table-column>
    <el-table-column property="reciptCredentialsAccount" label="证件号码" width="200"></el-table-column>
    <el-table-column property="reciptContact" label="联系电话" ></el-table-column>
    <el-table-column property="reciptCompany" label="乘机人公司" ></el-table-column>
  </el-table>

  <el-table :data="TripTable" :stripe="true" highlight-current-row   class="appTable">
    <el-table-column property="flightFrom" label="始发"  ></el-table-column>
    <el-table-column property="flightTo" label="到达" ></el-table-column>
    <el-table-column property="flightNo" label="航班号" ></el-table-column>
    <el-table-column property="carriageName" label="承运人" >></el-table-column>
    <el-table-column property="seatsClassName" label="等级" ></el-table-column>
    <el-table-column property="isBookingSeats" label="座位状态" >
      <template scope="scope">
          {{scope.row.isBookingSeats=="1"?"订座":"候补"}}
      </template>
    </el-table-column>
    <el-table-column property="flightDate" label="出发日期" width="140">
       <template scope="scope">
          {{scope.row.flightDate | time("ch")}}
        </template>
    </el-table-column>
  </el-table>
  <el-col :span="24" >
      <h1 class="title">申请票种</h1>
      <p class="textContent">{{info[0].ticGuest.ticTypeName}}</p>
    </el-col>
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
      typeName:"",
      flightPersonTable: [],
      TripTable:[],
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
    this.handleInfo();
    // this.handleBudget();
  },
  methods: {
    formatMoney(row, column, cellValue) {
      return this.toThousands(cellValue)

    },
    // handleBudget(){
    //   console.log( this.info[0])
    //   console.log(6666)
    //   this.info[0].travelpayItemList.forEach((item,i)=>{
    //     this.budgetTable.push(Object.assign(item,this.info[0].budgetExeststisVoList[i]))
    //   })
    // },
    handleInfo() {
      var list = this.info[0];
     console.log(list)
   



 
      // if (list.travlepayStayList.length != 0) {//票种
      //   list.travlepayStayList.forEach(i => {
      //     var item = {
      //       flightPerson: i.flightPerson,
      //       genger: i.genger,
      //       flightPersonTypeSelect: i.flightPersonTypeSelect,
      //       documentTypeSelect: i.documentTypeSelect,
      //       documentType: i.documentType,
      //       contactPhone: i.contactPhone,
      //     }
      //     this.flightPersonTable.push(item);
      //   })
      // }
      if (list.ticGuestFlights.length != 0) {//表格2
        list.ticGuestFlights.forEach(i => {
          var item = {
            carriageCode: i.carriageCode,
            carriageName: i.carriageName,
            docId: i.docId,
            employeeId: i.employeeId,
            flightDate: i.flightDate,
            flightFrom: i.flightFrom,
            flightTo: i.flightTo,
            flightNo: i.flightNo,
            id: i.id,
            isBookingSeats: i.isBookingSeats,
            seatsClassCode: i.seatsClassCode,
            seatsClassName: i.seatsClassName
          }
          this.TripTable.push(item);
        })

    
      }
      if (list.ticGuestRecipts.length != 0) {//表格1
        list.ticGuestRecipts.forEach(i => {
          var item = {
            reciptCompany:i.reciptCompany,
            reciptContact: i.reciptContact,
            reciptCredentialsAccount: i.reciptCredentialsAccount,
            reciptCredentialsTypeCode: i.reciptCredentialsTypeCode,
            reciptCredentialsTypeName: i.reciptCredentialsTypeName,            
            reciptName: i.reciptName,

            reciptSex: i.reciptSex,
            reciptTypeCode: i.reciptTypeCode,
            reciptTypeName: i.reciptTypeName,

          }

          this.flightPersonTable.push(item);
        })
      }
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
