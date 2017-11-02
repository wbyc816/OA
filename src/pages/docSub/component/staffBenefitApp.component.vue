<template>
  <div class="staffBenefitApp">
    <div class="vacationInfo clearfix">
      <div class="infoBox">年度免票<span>{{freeTicket.ticketNumsTotal}}</span></div>
      <div class="infoBox remain">剩余<span>{{freeTicket.ticketNumsLave}}</span></div>
      <div class="infoBox">年度二五折<span>{{discountTicket.ticketNumsTotal}}</span></div>
      <div class="infoBox remain">剩余<span>{{discountTicket.ticketNumsLave}}</span></div>
      <div class="infoBox">协议票<span>{{agreementTicket.ticketNumsTotal}}</span></div>
      <div class="infoBox remain">剩余<span>{{agreementTicket.ticketNumsLave}}</span></div>
    </div>

    <el-form label-position="left" :model="staffBenefitAppFormFirst" :rules="rules" ref="staffBenefitAppFormFirst" label-width="128px" >

      <el-form-item label="联系电话" prop="contactPhone" class="contactPhone">
          <el-input v-model="staffBenefitAppFormFirst.contactPhone" ></el-input>
      </el-form-item>
      <div class="clearBoth"></div>
      <el-form-item label="乘机人" prop="flightPersonSelect">
          <el-row>
            <el-col :span="12">
             <el-select  v-model="staffBenefitAppFormFirst.flightPersonSelect"  ref="flightPersonSelect" placeholder="请选择">
            <el-option v-for="flightPerson in flightPersonSelects"  :label="flightPerson.name" :value="flightPerson.name">
            </el-option>
          </el-select>
          </el-col>
          <el-col :span="5">
            <el-select class="w100" ref="flightPersonTypeSelect" v-model="staffBenefitAppFormFirst.flightPersonTypeSelect"  placeholder="请选择">
            <el-option  v-for="flightPersonType in flightPersonTypes"  :label="flightPersonType.dictName" :value="flightPersonType.dictCode">
            </el-option>
            </el-select>
          
            </el-col>
            <el-col :span="7">
               <el-radio-group   v-model="staffBenefitAppFormFirst.genger"  @input="updateCon" class="myRadio gender w153" >
                <el-radio-button :label="item.value"  v-for="item in genders">{{item.dictName}}<i></i></el-radio-button>
              </el-radio-group>
            </el-col>
          </el-row>
      </el-form-item>


      <div class="clearBoth"></div>
      <el-form-item label="证件信息" prop="documentType"  class="documentType">
        <el-input placeholder="请输入内容" v-model="staffBenefitAppFormFirst.documentType" class="input-with-select " >
          <el-select v-model="staffBenefitAppFormFirst.documentTypeSelect" ref="documentTypeSelect" slot="prepend" placeholder="请选择" class="w130">
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
          <el-table-column label="操作" width="55">
            <template scope="scope">
              <el-button @click.native.prevent="deleteRowfligh(scope.$index)" type="text" size="small" icon="delete">
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>

        <el-form label-position="left" :model="staffBenefitAppFormSecond" :rules="rules" ref="staffBenefitAppFormSecond" label-width="128px" >
        <el-form-item label="起始站" prop="start"  class="flw50">
          <el-input   v-model="staffBenefitAppFormSecond.start">
            
            </el-input>
          </el-form-item>
        <el-form-item label="目的站" prop="end" class="flw50">
          <el-input   v-model="staffBenefitAppFormSecond.end">
            
          </el-input>
        </el-form-item>
        <el-form-item label="出发日期" prop="departureDate" class="flw50"> 
          <div class="block">
            <el-date-picker
              v-model="staffBenefitAppFormSecond.departureDate"
              type="date"
              placeholder="选择日期"
              :picker-options="pickerOptions0">
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="承运人" prop="carrier" class="flw50">
        
            <el-input placeholder="请输入内容"  v-model="staffBenefitAppFormSecond.carrier" readonly>
              <el-select   v-model="staffBenefitAppFormSecond.isBook"   slot="append" placeholder="状态" class="w80" ref="isBook">
                <el-option label="订座" value="1"></el-option>
                <el-option label="候补" value="0"></el-option>
              </el-select>
            </el-input>
            
        </el-form-item>

        <el-form-item label="航班号" prop="flightNumber" class="flw50">
            <el-input placeholder="请输入内容" v-model="staffBenefitAppFormSecond.flightNumber"  >
               
            </el-input>
        </el-form-item>
        <el-form-item label="舱位等级" class="flw35" prop="classLevelsSelect">
          <el-select v-model="staffBenefitAppFormSecond.classLevelsSelect"  ref="classLevelsSelect">
            <el-option v-for="level in classLevels"  :label="level.dictName" :value="level.dictCode">
            </el-option>
          </el-select>
          
      </el-form-item>
<el-button @click='addTrip' type="primary" class="addbutton1 flw15" ><i class="el-icon-plus"></i> 添加</el-button>
         

         <el-table :data="TripTable" :stripe="true" highlight-current-row   class="appTable" >
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
    <el-form label-position="left" :model="staffBenefitAppFormThird" :rules="rules" ref="staffBenefitAppFormThird" label-width="128px" >

       <el-form-item label="申请票种" prop="ticketTypes">
          <el-select v-model="staffBenefitAppFormThird.ticketTypes" @change="ticketTypeChange" ref="ticketType">
            <el-option v-for="ticketType in ticketTypes"  :label="ticketType.dictName" :value="ticketType.dictCode">
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
      empVacation: {
        "preQuarterdDays": 0,
        "currentSeasonDays": 0,
        "annual1Days": 0,
        "annualDays": 0
      },
      isEnough:false,
      classLevels:[],
      flightPersonTypes:[],
      flightPersonTypeSelect:"",
      documentTypes:[],
      departureDate:"",
      TripTable:[],
      ticketTypes:[],
      flightPersonSelects:[],
      flightPersonTypeCode:"DOC0801",
      genders:[{dictName:"男",value:"M"},{dictName:"女",value:"F"}],
      flightPersonTable:[],
      staffBenefitAppFormFirst: {
        flightCompany:"",
        classLevels:[],
        flightPerson:"",
        documentType:"",
        flightPersonSelect:"",
        flightPersonTypeSelect:"",
        contactPhone:"",
        documentTypeSelect:"",
        genger:"M",
      },
       staffBenefitAppFormSecond: {
        carrier:"东海航空",
        flightNumber:"",
        isBook:"1",
        departureDate:"",
        start:"",
        end:"",
        classLevelsSelect:"经济舱",
        flightPersonSelect:"",
      },
      staffBenefitAppFormThird:{
        ticketTypes:[],
      },
      discountTicket:{
        "ticketNumsTotal": 0,
        "ticketNumsLave": 0,
      },
      freeTicket:{
        "ticketNumsTotal": 0,
        "ticketNumsLave": 0,
      },
      agreementTicket:{
        "ticketNumsTotal": 0,
        "ticketNumsLave": 0,
      },



   
      
      rules: {
        flightPersonSelect: [{ required: true, message: '请选择乘机人', trigger: 'blur' }],
        flightPersonTypeSelect: [{ required: true, message: '请选择乘机人类型', trigger: 'blur' }],
        genger: [{ required: true, message: '请选择性别', trigger: 'blur' }],
        documentTypeSelect: [{ required: true, message: '请选择证件类型', trigger: 'blur' }],
        documentType: [{ required: true, message: '请输入证件内容', trigger: 'blur' }],

        carrier: [{ required: true, message: '请输入承运人', trigger: 'blur' }],
        start: [{ required: true, message: '请输入起始站', trigger: 'blur' }],
        end: [{ required: true, message: '请输入目的站', trigger: 'blur' }],
        flightNumber: [{ required: true, message: '请输入航班号', trigger: 'blur' }],
        classLevelsSelect: [{ required: true, message: '请选择舱位等级', trigger: 'blur,change' }],
        departureDate: [{ type: 'date', required: true, validator: checkDate, trigger: 'blur' }],
        ticketTypes: [{ required: true, message: '请选择申请票种', trigger: 'blur' }],
        
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
    this.default();


    this.classLevel();
    this.flightPersonType();
    this.documentType();
 
  },
  methods: {
    default(){
       this.$http.post('/emp/selectEmpTicket', { //二五折
          typeId:"EMP0301",
          empId: this.userInfo.empId ,                               
          annual :util.formatTime(new Date().getTime(), 'yyyy'),
       })
      .then(res => {
        if (res.status == 0) {
         this.discountTicket=res.data;
        }
      })
       this.$http.post('/emp/selectEmpTicket', { //免票
          typeId:"EMP0302",
          empId: this.userInfo.empId ,                               
          annual :util.formatTime(new Date().getTime(), 'yyyy'),
       })
      .then(res => {
        if (res.status == 0) {
         this.freeTicket=res.data;
        }
      })
       this.$http.post('/emp/selectEmpTicket', { //协议票
          typeId:"EMP0303",
          empId: this.userInfo.empId ,                               
          annual :util.formatTime(new Date().getTime(), 'yyyy'),
       })
      .then(res => {
        if (res.status == 0) {
         this.agreementTicket=res.data;
        }
      })
       this.$http.post('/api/getDict', { //票种
          dictCode:"EMP03",
       })
      .then(res => {
        if (res.status == 0) {
         this.ticketTypes=res.data;
        }
      })
       this.$http.post('/emp/selectEmpExpFamily', { //乘机人名字
          empId:this.userInfo.empId,
       })
      .then(res => {
        var that=this;
        if (res.status == 0) {
          var user={
            name:that.userInfo.name
          }
          res.data.splice(0,0,user);
        that.flightPersonSelects=res.data;
        that.staffBenefitAppFormFirst.flightPersonSelect=res.data[0].name;

        }
      })

    },

    classLevel(){
        this.$http.post('api/getDict', { 
          dictCode:"DOC09",
       })
      .then(res => {
        if (res.status == 0) {
         this.classLevels=res.data;
         this.staffBenefitAppFormSecond.classLevelsSelect=res.data[0].dictCode;
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
         this.staffBenefitAppFormFirst.flightPersonTypeSelect=res.data[0].dictCode;
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
           this.staffBenefitAppFormFirst.documentTypeSelect=res.data[0].dictCode;

        }
      })

    },

 updateCon(val) {
      var confident= this.genders.find(ele => ele.value == val);
      this.genger=confident.value;
      this.$store.commit('setConfident', { docDenseType: confident.dictName, value: confident.value });
          },
  ticketTypeChange(){
    
    if(this.staffBenefitAppFormThird.ticketTypes){
        this.$http.post('/emp/selectEmpTicket', { //二五折
        typeId:this.staffBenefitAppFormThird.ticketTypes,
        empId: this.userInfo.empId ,                               
        annual :util.formatTime(new Date().getTime(), 'yyyy'),
     })
    .then(res => {
      if (res.status == 0) {
       if(this.flightPersonTable.length*this.TripTable.length>res.data.ticketNumsLave){
           this.$message.warning("申请票种剩余数量不足，请重新选择票种");
           this.isEnough=0;
       }else{
          this.isEnough=1;
       }
      }
    })
    }
  



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
      console.log(this.$refs.paymentMethod);
      if(val=="FIN0103"){
        this.collectionInformation=0;
      }else{
        this.collectionInformation=1;
      }
    },
    getEmpBankAccount(Id){
      var that=this;
      console.log(Id)
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
      this.$refs.staffBenefitAppFormFirst.validate((valid) => {
        if (valid) {
          var temp={};
          if(this.staffBenefitAppFormFirst.genger=="M"){
            temp.genger="男";
          }else{
            temp.genger="女";
          }
          temp.contactPhone=this.staffBenefitAppFormFirst.contactPhone;
          temp.flightPerson=this.staffBenefitAppFormFirst.flightPersonSelect;
          temp.flightPersonTypeSelect=this.$refs.flightPersonTypeSelect.selectedLabel;

          temp.documentTypeSelect=this.$refs.documentTypeSelect.selectedLabel;
          temp.documentType=this.staffBenefitAppFormFirst.documentType;

          temp.flightPersonTypeCode=this.staffBenefitAppFormFirst.flightPersonTypeSelect;
          temp.documentTypeCode=this.staffBenefitAppFormFirst.documentTypeSelect;
          console.log(temp);

      
          this.flightPersonTable.push(temp);
          this.$refs.staffBenefitAppFormFirst.resetFields();
          this.showData=0;
          this.ticketTypeChange();
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
      this.$refs.staffBenefitAppFormSecond.validate((valid) => {
        if (valid) {
          var temp={};
          temp.start=this.staffBenefitAppFormSecond.start;
          temp.end=this.staffBenefitAppFormSecond.end;

          console.log(this.staffBenefitAppFormSecond.end)
          temp.carrier=this.staffBenefitAppFormSecond.carrier;
          temp.isBook=this.$refs.isBook.selectedLabel;
          temp.carrier=this.staffBenefitAppFormSecond.carrier;
          temp.flightNumber=this.staffBenefitAppFormSecond.flightNumber;
          temp.classLevelsSelect=this.$refs.classLevelsSelect.selectedLabel;
         
          temp.classLevelsCode=this.staffBenefitAppFormSecond.classLevelsSelect;
          temp.isBookcCode=this.staffBenefitAppFormSecond.isBook;
          temp.departureDate=util.formatTime(this.staffBenefitAppFormSecond.departureDate.getTime(), 'yyyy-MM-dd');
          console.log(temp)
          this.TripTable.push(temp);
          this.$refs.staffBenefitAppFormSecond.resetFields();
          this.showData=0;
          this.classLevel();
          this.ticketTypeChange();

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
      var param= {"staffBenefitAppFormThird":this.staffBenefitAppFormThird.ticketTypes,"flightPersonTable":this.flightPersonTable,"TripTable":this.TripTable}
      var params=JSON.stringify(param);
      this.$emit('saveMiddle',params);
    },
    getDraft(obj){
      console.log(obj)
      this.flightPersonTable=obj.flightPersonTable;
      this.TripTable=obj.TripTable;
      this.staffBenefitAppFormThird.ticketTypes=obj.staffBenefitAppFormThird
    },
    submitForm() {
      // var that = this;
              var that=this;
              if (that.flightPersonTable.length!=0&&that.TripTable.length!=0) {
                if(that.isEnough){
                    console.log(that.staffBenefitAppFormThird.ticketTypes);
                // var dep=this.getBudgetDep();
                that.params = {

                    "isSubmit": 1,
                    "typeId":that.staffBenefitAppFormThird.ticketTypes,
                    "annual": util.formatTime(new Date().getTime(), 'yyyy'),
                    "docTicEmployeeRecipts": that.flightPersonTable.map(function(tabel) {
                      if(tabel.genger=="男"){
                        tabel.genger="M";
                      }else{
                        tabel.genger="F";
                      }
                      return {
                        "id": "",//客机票身份信息表ID     
                        "docId": "",//公文ID
                        "employeeId": "",                
                        "reciptName": tabel.flightPerson,//优惠人姓名（必填）
                        "reciptTypeCode": tabel.flightPersonTypeCode,//优惠人类型code 成人，儿童（必填） DOC08
                        "reciptTypeName":tabel.flightPersonTypeSelect,//优惠人类型名
                        "reciptCredentialsTypeCode":tabel.documentTypeCode,//优惠人证件类型code   EMP08
                        "reciptCredentialsTypeName": tabel.documentTypeSelect,//优惠人证件类型名
                        "reciptCredentialsAccount":tabel.documentType,//优惠人证件号
                        "reciptContact": tabel.contactPhone,//联系电话
                        "reciptSex": tabel.genger, // 性别 M男 F "女":,
                        "ticTypeCode":that.staffBenefitAppFormThird.ticketTypes,//机票Code

                        "ticTypeName": that.$refs.ticketType.selectedLabel,//机票名称
                      }
                    }),
                    "docTicEmployeeFlights": this.TripTable.map(function(tabel) {
                      return {
                        "id": "",//客机票身份信息表ID     
                        "docId": "",//公文ID                
                        "employeeId":"",//员工机票主表ID
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
          console.log(this.params);
           this.$emit('submitMiddle', this.params);
           } else {
          this.$message.warning('请检查票数信息')
          this.$emit('submitMiddle', false);
          return false;
         
        }
              
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
            console.log(res)
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
      console.log(event)
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

.staffBenefitApp {
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



  .vacationInfo {
    line-height: 54px;
    background: #F7F7F7;
    font-size: 15px;
    position: relative;
    margin-bottom: 30px;
    &:before {
      display: block;
      content: '';
      height: 100%;
      left: 50%;
      top: 0;
      position: absolute;
      border-left: 1px solid #D5DADF;
    }
    .infoBox {
      float: left;
      width: 27%;
      padding-left: 20px;
      span {
        padding-left: 20px;
      }
      &.remain {
        color: $main;
        width: 23%;
        position: relative;
        &:before {
          content: '';
          height: 27px;
          left: 0;
          top: 50%;
          margin-top: -14px;
          position: absolute;
          border-left: 1px solid #D5DADF;
        }
      }
    }
  }
  .el-input {
    width: 100%;
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
