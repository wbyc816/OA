<template>
  <div class="guestTicket">
    <el-form label-position="left" :model="guestTicketAppFormFirst" :rules="rules" ref="guestTicketAppFormFirst" label-width="128px" >
       
      <el-form-item label="乘机人公司" prop="flightCompany" class="flw50"> 
           <el-input v-model="guestTicketAppFormFirst.flightCompany" ></el-input>
      </el-form-item>

      <el-form-item label="联系电话" prop="contactPhone" class="flw50">
          <el-input v-model="guestTicketAppFormFirst.contactPhone" ></el-input>
      </el-form-item>
      <div class="clearBoth"></div>
      <el-form-item label="乘机人" prop="flightPerson" >
          <el-row>
            <el-col :span="17">
              <el-input class="w380" placeholder="请输入" v-model="guestTicketAppFormFirst.flightPerson" >
            <el-select  class="w100" ref="flightPersonTypeSelect" v-model="guestTicketAppFormFirst.flightPersonTypeSelect" slot="append" placeholder="请选择">
            <el-option  v-for="flightPersonType in flightPersonTypes"  :label="flightPersonType.dictName" :value="flightPersonType.dictCode">
            </el-option>
            </el-select>
          </el-input>
          
            </el-col>
            <el-col :span="7">
               <el-radio-group   v-model="guestTicketAppFormFirst.genger"  @input="updateCon" class="myRadio gender w153" >
                <el-radio-button :label="item.value"  v-for="item in genders">{{item.dictName}}<i></i></el-radio-button>
              </el-radio-group>
            </el-col>
          </el-row>
      </el-form-item>
      <div class="clearBoth"></div>
      <el-form-item label="证件信息" prop="documentType" class="documentType">
        <el-input placeholder="请输入内容" v-model="guestTicketAppFormFirst.documentType" class="input-with-select">
          <el-select v-model="guestTicketAppFormFirst.documentTypeSelect" ref="documentTypeSelect" slot="prepend" placeholder="请选择" class="w130">
           <el-option v-for="documentType in documentTypes"  :label="documentType.dictName" :value="documentType.dictCode">
          </el-option>
        </el-select>
        </el-input>

        <el-button  @click='addFlightPerson' type="primary" class="addbutton1 w135"><i class="el-icon-plus"></i> 添加</el-button>
        </el-form-item>
      
        <el-table :data="flightPersonTable" :stripe="true" highlight-current-row   class="appTable" >
          <el-table-column type="index" label=" " width="40"></el-table-column>
          <el-table-column property="flightPerson" label="乘机人"  width="70"></el-table-column>
          <el-table-column property="genger" label="性别" width="50"></el-table-column>
          <el-table-column property="flightPersonTypeSelect" label="类型" width="60"></el-table-column>
          <el-table-column property="documentTypeSelect" label="证件类型" ></el-table-column>
          <el-table-column property="documentType" label="证件号码" ></el-table-column>
          <el-table-column property="contactPhone" label="联系电话" width="120"></el-table-column>
          <el-table-column property="flightCompany" label="乘机人公司" width="100"></el-table-column>
          <el-table-column label="操作" width="55">
            <template scope="scope">
              <el-button @click.native.prevent="deleteRowfligh(scope.$index)" type="text" size="small" icon="delete">
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>

        <el-form label-position="left" :model="guestTicketAppFormSecond" :rules="rules" ref="guestTicketAppFormSecond" label-width="128px" >
        <el-form-item label="起始站" prop="start"  class="flw50">
          <el-input   v-model="guestTicketAppFormSecond.start">
            
            </el-input>
          </el-form-item>
        <el-form-item label="目的站" prop="end" class="flw50">
          <el-input   v-model="guestTicketAppFormSecond.end">
            
          </el-input>
        </el-form-item>
        <el-form-item label="出发日期" prop="departureDate" class="flw50"> 
          <div class="block">
            <el-date-picker
              v-model="guestTicketAppFormSecond.departureDate"
              type="date"
              placeholder="选择日期"
              :picker-options="pickerOptions0">
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="承运人" prop="carrier" class="flw50">
        
            <el-input placeholder="请输入内容"  v-model="guestTicketAppFormSecond.carrier" readonly>
              <el-select   v-model="guestTicketAppFormSecond.isBook"   slot="append" placeholder="状态" class="w80" ref="isBook">
                <el-option label="订座" value="1"></el-option>
                <el-option label="候补" value="0"></el-option>
              </el-select>
            </el-input>
            
        </el-form-item>

        <el-form-item label="航班号" prop="flightNumber" class="flw50">
            <el-input placeholder="请输入内容" v-model="guestTicketAppFormSecond.flightNumber"  >
               
            </el-input>
        </el-form-item>
        <el-form-item label="舱位等级" class="flw35" prop="classLevelsSelect">
          <el-select v-model="guestTicketAppFormSecond.classLevelsSelect"  ref="classLevelsSelect">
            <el-option v-for="level in classLevels"  :label="level.dictName" :value="level.dictCode">
            </el-option>
          </el-select>
          
      </el-form-item>
<el-button @click='addTrip' type="primary" class="addbutton1 flw15" ><i class="el-icon-plus"></i> 添加</el-button>
         

         <el-table :data="TripTable" :stripe="true" highlight-current-row   class="appTable">
          <el-table-column type="index" label=" " width="30"></el-table-column>
          <el-table-column property="start" label="始发"  width="80"></el-table-column>
          <el-table-column property="end" label="到达" width="80"></el-table-column>
          <el-table-column property="flightNumber" label="航班号"  width="80"></el-table-column>
          <el-table-column property="carrier" label="承运人" width="85">></el-table-column>
          <el-table-column property="classLevelsSelect" label="等级" width="70"></el-table-column>
          <el-table-column property="isBook" label="座位状态" ></el-table-column>
          <el-table-column property="departureDate" label="出发日期" width="100"></el-table-column>
          <el-table-column label="操作" width="55">
            <template scope="scope">
              <el-button @click.native.prevent="deleteRow(scope.$index)" type="text" size="small" icon="delete">
              </el-button>
            </template>
          </el-table-column>
        </el-table>
    </el-form>
    <el-form label-position="left" :model="guestTicketAppFormThird" :rules="rules" ref="guestTicketAppFormThird" label-width="128px" >

       <el-form-item label="申请票种" prop="ticketType" class="flw50">
            <el-input placeholder="请输入内容" v-model="guestTicketAppFormThird.ticketType"  >
               
            </el-input>
        </el-form-item>

        <el-form-item label="出票方式" prop="ticketWays" class="flw50">
        <el-select v-model="guestTicketAppFormThird.ticketWays"  ref="ticketWays">
          <el-option v-for="ticketWay in ticketWays"  :label="ticketWay.dictName" :value="ticketWay.dictCode">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
  <!--   <person-dialog @updatePerson="updatePerson" dialogType="multi" :visible.sync="signDialogVisible"></person-dialog> -->
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import PersonDialog from '../../../components/personDialog.component'
  import util from '../../../common/util'
export default {
  components: { PersonDialog },
  data() {
    var checkDate = (rule, value, callback) => {
      if (value) {
        callback();
      } else {
        callback(new Error('请选择出发日期'))
      }
    };
    var checkDept = (rule, value, callback) => {
      if (value[0]) {
        callback();
      } else {
        callback(new Error('请选择预算机构/科目'))
      }
    };
    return {
      classLevels:[],
      flightPersonTypes:[],
      flightPersonTypeSelect:"",
      documentTypes:[],
      departureDate:"",
      TripTable:[],
      ticketType:"",
      ticketWays:[],
      flightPersonTypeCode:"DOC0801",
      genders:[{dictName:"男",value:"M"},{dictName:"女",value:"F"}],
      flightPersonTable:[],
      guestTicketAppFormFirst: {
        flightCompany:"",
        classLevels:[],
        flightPerson:"",
        documentType:"",
        flightPersonTypeSelect:"",
        contactPhone:"",
        documentTypeSelect:"",
        genger:"M"
      },
       guestTicketAppFormSecond: {
        carrier:"东海航空",
        flightNumber:"",
        isBook:"1",
        departureDate:"",
        start:"",
        end:"",
        classLevelsSelect:"经济舱",
      },
      guestTicketAppFormThird:{
        ticketType:"",
        ticketWays:[],
      },



   
      
      rules: {
        contactPhone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
        ticketWays: [{ required: true, message: '请选择出票方式', trigger: 'blur' }],
        flightPerson: [{ required: true, message: '请输入乘机人', trigger: 'blur' }],
        flightPersonTypeSelect: [{ required: true, message: '请选择乘机人类型', trigger: 'blur' }],
        genger: [{ required: true, message: '请选择性别', trigger: 'blur' }],
        documentTypeSelect: [{ required: true, message: '请选择证件类型', trigger: 'blur' }],
        documentType: [{ required: true, message: '请输入证件内容', trigger: 'blur' }],

        carrier: [{ required: true, message: '请输入承运人', trigger: 'blur' }],
        start: [{ required: true, message: '请输入起始站', trigger: 'blur' }],
        end: [{ required: true, message: '请输入目的站', trigger: 'blur' }],
        flightNumber: [{ required: true, message: '请输入航班号', trigger: 'blur' }],
        classLevelsSelect: [{ required: true, message: '请选择舱位等级', trigger: 'blur' }],
        departureDate: [{ type: 'date', required: true, validator: checkDate, trigger: 'blur' }],
        ticketType: [{ required: true, message: '请输入申请票种', trigger: 'blur' }],
        
      },
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      budgetDeptList: [],
      params: '',
      defaultProp: {
        label: 'budgetItemName',
        value: 'budgetItemCode',
        children: 'items'
      },

    }
  },
  computed: {
    ...mapGetters([
      'submitLoading',
      'baseURL',
      'selConfident',
      "userInfo"
    ])
  },
  created() {

    this.classLevel();
    this.flightPersonType();
    this.documentType();
 
  },
  methods: {
    classLevel(){
      this.$http.post('/api/getDict', { //出票方式
          dictCode:"DOC14",
       })
      .then(res => {
        if (res.status == 0) {
         this.ticketWays=res.data;
        }
      })

        this.$http.post('api/getDict', { 
          dictCode:"DOC09",
       })
      .then(res => {
        if (res.status == 0) {
         this.classLevels=res.data;
         this.guestTicketAppFormThird.classLevelsSelect=res.data[0].dictCode;
        }
      })

    },
    flightPersonType(){
        this.$http.post('api/getDict', { 
          dictCode:"DOC08",
       })
      .then(res => {
        if (res.status == 0) {
         this.flightPersonTypes=res.data;
         this.guestTicketAppFormFirst.flightPersonTypeSelect=res.data[0].dictCode;
        }
      })

    },
    documentType(){
        this.$http.post('api/getDict', { 
          dictCode:"EMP08",
       })
      .then(res => {
        if (res.status == 0) {
         this.documentTypes=res.data;
           this.guestTicketAppFormFirst.documentTypeSelect=res.data[0].dictCode;

        }
      })

    },

 updateCon(val) {
      var confident= this.genders.find(ele => ele.value == val);
      this.genger=confident.value;
      this.$store.commit('setConfident', { docDenseType: confident.dictName, value: confident.value });
    },










  
      // loadAll() {
      //  var that = this;
      //  that.$http.post('/emp/queryEmpDeptList', { 
      //   name:that.loanAppForm.payee,
      //  })
      // .then(res => {
      //   if (res.status == 0) {
      //   if(res.empVoList)
      //     for(var i=0;i<res.empVoList.length;i++){
      //       that.payees[i]=res.empVoList[i];
      //     }
      //   }
      // })
      //   that.restaurants=that.payees;
      //   return true;
      // },
    
    changePayType(){
      this.$http.post('/api/getDict', { 
        dictCode:"FIN01"
       })
      .then(res => {
        if (res.status == 0) {
         this.payTypes=res.data;
        }
      })
    },
    isCashType(val){
      // this.paymentMethodName="";
      if(val=="FIN0103"){
        this.collectionInformation=0;
      }else{
        this.collectionInformation=1;
      }
    },
    getEmpBankAccount(Id){
      var that=this;
      that.$http.post('/doc/getEmpBankAccount', { 
        empId:Id
       })
      .then(res => {
        if (res.status == 0) {
         that.loanAppForm.bankAccount=res.data.data.bankAccount;
        }
      })
    },
     

    addFlightPerson() {
      this.$refs.guestTicketAppFormFirst.validate((valid) => {
        if (valid) {
          var temp={};
          if(this.guestTicketAppFormFirst.genger=="M"){
            temp.genger="男";
          }else{
            temp.genger="女";
          }
          temp.flightCompany=this.guestTicketAppFormFirst.flightCompany;
          temp.contactPhone=this.guestTicketAppFormFirst.contactPhone;
          temp.flightPerson=this.guestTicketAppFormFirst.flightPerson;
          temp.flightPersonTypeSelect=this.$refs.flightPersonTypeSelect.selectedLabel;

          temp.documentTypeSelect=this.$refs.documentTypeSelect.selectedLabel;
          temp.documentType=this.guestTicketAppFormFirst.documentType;
          ;
          temp.flightPersonTypeCode=this.guestTicketAppFormFirst.flightPersonTypeSelect;
          temp.documentTypeCode=this.guestTicketAppFormFirst.documentTypeSelect;

      
          this.flightPersonTable.push(temp);
          this.$refs.guestTicketAppFormFirst.resetFields();
          this.showData=0;
        } else {
          return false;
        }
      });
    },
    deleteRowfligh(index) {
      this.flightPersonTable.splice(index,1)
    },
    fomatFloat(src, pos) {
      return Math.round(src * Math.pow(10, pos)) / Math.pow(10, pos);
    },
    checkEmpty(){
      if(this.flightPersonTable.length!=0){
        this.$emit('submitMiddle',{flightPersonTable:this.flightPersonTable});
      }else{
        this.$message.warning('请添加信息')
        this.$emit('submitMiddle',false);
      }

    },
    updatePerson(list) {
      this.budgetForm.person = list
      this.signDialogVisible = false;
    },

    addTrip() {
      this.$refs.guestTicketAppFormSecond.validate((valid) => {
        if (valid) {
          var temp={};
          temp.start=this.guestTicketAppFormSecond.start;
          temp.end=this.guestTicketAppFormSecond.end;
         
          temp.carrier=this.guestTicketAppFormSecond.carrier;
          temp.isBook=this.$refs.isBook.selectedLabel;
          temp.carrier=this.guestTicketAppFormSecond.carrier;
          temp.flightNumber=this.guestTicketAppFormSecond.flightNumber;
          temp.classLevelsSelect=this.$refs.classLevelsSelect.selectedLabel;
          temp.classLevelsCode=this.guestTicketAppFormSecond.classLevelsSelect;
          temp.isBookcCode=this.guestTicketAppFormSecond.isBook;
          temp.departureDate=util.formatTime(this.guestTicketAppFormSecond.departureDate.getTime(), 'yyyy-MM-dd');
          this.TripTable.push(temp);
          this.$refs.guestTicketAppFormSecond.resetFields();
          this.showData=0;
           this.classLevel();
        } else {
          return false;
        }
      });
    },
      deleteRow(index) {
      this.TripTable.splice(index,1)
    },
    fomatFloat(src, pos) {
      return Math.round(src * Math.pow(10, pos)) / Math.pow(10, pos);
    },
    checkEmpty(){
      if(this.TripTable.length!=0){
        this.$emit('submitMiddle',{TripTable:this.TripTable});
      }else{
        this.$message.warning('请添加信息')
        this.$emit('submitMiddle',false);
      }
    },
    updatePerson(list) {
      this.budgetForm.person = list
      this.signDialogVisible = false;
    },
    saveForm(){
      // console.log(this.vehicleForm)
      var param= {"guestTicketAppFormThird":this.guestTicketAppFormThird,"flightPersonTable":this.flightPersonTable,"TripTable":this.TripTable}
      var params=JSON.stringify(param);
      this.$emit('saveMiddle',params);
    },
    getDraft(obj){
      console.log(obj)
      this.TripTable=obj.TripTable;
      this.flightPersonTable=obj.flightPersonTable;
      this.guestTicketAppFormThird.ticketType=obj.guestTicketAppFormThird.ticketType;
      this.guestTicketAppFormThird.ticketWays=obj.guestTicketAppFormThird.ticketWays;
    },
    submitForm() {
      // var that = this;
              if (this.flightPersonTable.length!=0&&this.TripTable.length!=0) {
                // var dep=this.getBudgetDep();
                this.params = {
                    "ticketWayCode":this.guestTicketAppFormThird.ticketWays,
                    "ticketWayName":this.$refs.ticketWays.selectedLabel,
                    "ticTypeName": this.guestTicketAppFormThird.ticketType,
                    "ticGuestRecipts": this.flightPersonTable.map(function(tabel) {
                      if (tabel.genger=="男"){
                        tabel.genger="M"
                      }else{
                        tabel.genger="F"
                      }
                      return {
                        "id": "",//客机票身份信息表ID     
                        "docId": "",//公文ID                
                        "guestId": "",//宾客机票主表ID
                        "reciptName": tabel.flightPerson,//优惠人姓名（必填）
                        "reciptTypeCode": tabel.flightPersonTypeCode,//优惠人类型code 成人，儿童（必填） DOC08
                        "reciptTypeName":tabel.flightPersonTypeSelect,//优惠人类型名
                        "reciptCompany": tabel.flightCompany,//优惠人公司（手填）
                        "reciptCredentialsTypeCode":tabel.documentTypeSelectCode,//优惠人证件类型code   EMP08
                        "reciptCredentialsTypeName": tabel.documentTypeSelect,//优惠人证件类型名
                        "reciptCredentialsAccount":tabel.documentType,//优惠人证件号
                        "reciptContact": tabel.contactPhone,//联系电话
                        "reciptSex": tabel.genger // 性别 M男 F 女
                      }
                    }),
                    "ticGuestFlights": this.TripTable.map(function(tabel) {

                      return {
                        "id": "",//客机票身份信息表ID     
                        "docId": "",//公文ID                
                        "guestId": "",//宾客机票主表ID
                        "priceOpen": "",
                        "priceActual": "",
                        "seatsClassCode": tabel.classLevelsCode,//舱位级别code    DOC09
                        "seatsClassName": tabel.classLevelsSelect,//仓位级别名
                        "flightNo": tabel.flightNumber,//航班号
                        "flightFrom": tabel.start,//航段始发
                        "flightTo": tabel.end,//航段到达
                        "carriageCode": "EMP0701",//承运人code（默认 东海航空 EMP0701） 
                        "carriageName": tabel.carrier,//承运人名
                        "flightDate": tabel.departureDate,//航班日期
                        "isBookingSeats": tabel.isBookcCode //是否订座 0 候补 1 订座（看规则填）
                      }
                    })

             
          
            

          }
          this.$emit('submitMiddle', this.params);
        } else {
          this.$message.warning('请检查填写字段')
          this.$emit('submitMiddle', false);
          return false;
          
        }
    },
    closePerson(index) {
      this.budgetForm.person.splice(index, 1);
    },
    fomatMoney(val) {
      val = val.toString().match(/^\d+(?:\.\d{0,2})?/);
      if (val) {
        this.budgetForm.budgetMoney = val[0];
        this.$refs.budgetMoney.setCurrentValue(val[0]);
      } else {
        this.budgetForm.budgetMoney = ''
        this.$refs.budgetMoney.setCurrentValue('')
      }
    },
    getBudgetDeptList() {
      if(this.budgetForm.year){
         this.isDisable=false;
      this.showData="0";
      this.$http.post('/doc/getItemTreeListofYear',{
        year:util.formatTime(this.budgetForm.year.getTime(), 'yyyy'),
      })
        .then(res => {
          if (res.status == 0) {
            res.data.forEach(i => i.isParent == 1 ? i.items = [] : i.items = null)
            this.budgetDeptList = res.data
          } else {
          }
        }, res => {})
      }
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
    // getBookType(){
    //   this.$http.post('/api/getDict',{dictCode:'ADM05'})
    //   .then(res=>{
    //     if(res.status==0){
    //       this.bookTypes=res.data;
    //       this.budgetForm.bookType=this.bookTypes[0].dictCode
    //     }
    //   })
    // },
    // getBudgetDep(){
    //   var len=this.budgetForm.budgetDept.length;
    //   var temp=this.budgetDeptList;
    //   for(var i=0;i<len;i++){
    //     temp=temp.find(dep=>dep.budgetItemCode==this.budgetForm.budgetDept[i]);
    //     if(temp.items&&temp.items.length!=0){
    //       temp=temp.items;
    //     }
    //   }
    //   return temp;
    // },
    blurInput(event){
      var temp=event.target.value.split('.');
      if(temp.length==2&&(temp[1]==undefined||temp[1]==''||temp[1]==null)){
        this.budgetForm.budgetMoney = temp[0];
        this.$refs.budgetMoney.setCurrentValue(temp[0]);
      }
    },

    // changeDept(){
    //   this.$http.post('/doc/getExecStatisofItemId', { 
    //     budgetItemCode:this.budgetForm.budgetDept[this.budgetForm.budgetDept.length-1],
    //     year:util.formatTime(this.budgetForm.year.getTime(), 'yyyy'),
    //      })
    //     .then(res => {
    //       if (res.status == 0) {
    //       this.showData=1;
    //       this.cExecRate=res.data.cExecRate;
    //       this.yearBudget=res.data.budgetYear;
    //       this.useBudget=res.data.budgetInit;
    //       }
    //     })
    // }
  },
   mounted() {

    }
}

</script>
<style lang='scss'>
$main:#0460AE;
 .flw50{
    width:50%;
    float:left;
  }
  .flw15{
    width:15%;
    float:left;
  }
   .flw35{
    width:35%;
    float:left;
  }

  




  .selectMoney{
    width: 95px;
  }

  .el-input-group__append{
    background-color:white;
  }
 .change_data{
    width:calc(100% - 18px);
    height:54px;
    margin:0px 0 20px 18px;
    background:#F7F7F7;
    color:#0460AE;

    ul li{
      font-size:15px;
      border:1px solid transparent;
      width:33.3%;
      float:left;
      height:54px;
      line-height:54px;
      text-align:center;
    }
    ul li:first-child{
       border-right:1px solid #D5DADF;
    }
     ul li:last-child{
       border-left:1px solid #D5DADF;
    }
  }
  .clearPadding{
      padding:0 !important;
    }

.guestTicket {
  .contactPhone{
    width:100%;float:left;
  }
  .clearBoth{
    clear:both
  }
  .w100{
    width:100px
  }
  .w153{
    width:153px
  }
  .w130{
    width:130px
  }
  .documentType .input-with-select{
    width:380px
  }
  .w135{
    width:135px
  }
  .appTable{
    margin-bottom:20px;
  }
  .w80{
    width:80px
  }


  .reciverWrap {
    clear: both;
    .el-form-item__content {
      display: flex;
    }
    .reciverList {
      flex: 1;
      .el-tag {
        margin-right: 5px;
      }
    }
    .addButton {
      right: 0;
    }
  }
  .deptArea,
  .arrArea {
    float: left;
    width: 100%;
  }
  .arrArea {
    .el-form-item__label {
      padding-left: 36px;
    }
  }
  .myRadio {
    .el-radio-button__inner {
      padding: 0;
      line-height: 45px;
      width: 99px;
    }

  }
  .gender{
    .el-radio-button__inner {
      padding: 0;
      line-height: 45px;
      width: 60px;
    }
    .el-radio-button{
      margin-right:0;
      margin-left:15px 
    }
  }
  .usge {
    color: $main;
    vertical-align: text-top;
  }
  .bookType {
    float: right;
    .el-radio-button__inner {
      width: 140px;
    }
    .el-radio-button {
      margin-right: 0;
      &:nth-child(2) {
        margin-left: 15px;
      }
    }
  }

}

</style>
