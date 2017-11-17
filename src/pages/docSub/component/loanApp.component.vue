<template>
  <div class="loanApp">
    <el-form label-position="left" :model="loanAppForm" :rules="rules" ref="loanAppForm" label-width="128px" >
       
      <el-form-item label="申请金额" prop="appMoney" class="flw50"> 
          <div>
            <el-input   v-model="loanAppForm.appMoney" :maxlength="10" @change="fomatMoney" @blur="blurInput" ref="appMoney">
              <el-select v-model="loanAppForm.selectMoney" slot="prepend" placeholder="请选择" class="selectMoney" @change="chooseCurrency" ref="accurency" >
                <el-option v-for="currency in currencys" :label="currency.currencyName" :value="currency.currencyCode"></el-option>
                
              </el-select>
            </el-input>
          </div>
        </el-form-item>



      <el-form-item label="付款方式" prop="choosePayType" class="flw50" >
        <el-select v-model="loanAppForm.choosePayType" @change="isCashType"  ref="paymentMethod">
          <el-option v-for="payType in payTypes"  :label="payType.dictName" :value="payType.dictCode">
          </el-option>
        </el-select>
      </el-form-item>
      <div v-show="collectionInformation==1">
      <el-form-item label="收款人" prop="payee" class="flw50 " >
        <el-autocomplete
           v-model="loanAppForm.payee"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入内容"
            @select="handleSelect"
            :props="testprops"
             ref="payee"
            class="payee"></el-autocomplete>
      </el-form-item>

      <el-form-item label="收款账户" prop="bankAccount" class="flw50" >
         <el-input v-model="loanAppForm.bankAccount" ref="bankAccount" :maxlength="50" @change="changeBankAccount"></el-input>
      </el-form-item>
      </div>
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
        callback(new Error('请选择预算年份'))
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
      payType:"",
      select:"",
      currencys:[],
      currencyLabel:"",
      currencyValue:"",
      appMoney: '',
      payTypes:[],
      choosePayType:'',
      bankAccount:"",
      timeout:  null,
      payee:"",
      testprops:{
        value:"name",
        label:"name"
      },
      payees:[],
      collectionInformation:1,

      signDialogVisible: false,
      bookTypes:[],
      budgetTable:[],
      budgetDate:{},
      showData:0,
      yearBudget:0,
      useBudget:0,
      cExecRate:"0%",
      isDisable:true,
      loanAppForm: {
        appMoney  :"",
        choosePayType:"",
        timeout:  null,
        isBookFlight: '1',
        bankAccount:"",
        payee:"",
        deptArea: '',
        arrArea: '',
        bookType: '',
        timeRange: "",
        year:"",
        appMoney: '',
        person: [],
        // budgetDept: [],
        budgetDate:{},
        selectMoney:"人民币",

      
      },
      rules: {
        // isBookFlight: [{ required: true, trigger: 'blur' }],
        // person: [{ type: 'array', required: true, message: '请选择出差人', trigger: 'blur' }],
        // deptArea: [{ required: true, message: '请输入出发地', trigger: 'blur' }],

        payee: [{ required: true, message: '请选择收款人', trigger: 'blur,change' }],
        bankAccount: [{ required: true, message: '请输入收款账户', trigger: 'blur,change' }],

        // arrArea: [{ required: true, message: '请输入目的地', trigger: 'blur' }],
        appMoney: [{ required: true, message: '请输入申请金额', trigger: 'blur,change' }],
        // year: [{  required: true, validator: checkDate, trigger: 'blur' }],
        // budgetDept: [{ type: 'array', required: true, validator: checkDept, trigger: 'blur' }],
        choosePayType:  [{ required: true, message: '请选择付款方式', trigger: 'blur' }],
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
      "userInfo"
    ])
  },
  created() {
    // this.getBookType();
    this.chooseCurrency();
    this.changePayType();
    this.loadCollectionInformation();
  },
  methods: {
    fomatMoney(val) {
      val = val.toString().match(/^\d+(?:\.\d{0,2})?/);
      if (val) {
        this.loanAppForm.appMoney = val[0];
        this.$refs.appMoney.setCurrentValue(val[0]);
      } else {
        this.loanAppForm.appMoney = ''
        this.$refs.appMoney.setCurrentValue('')
      }
    },
    changeBankAccount(val) {
      val = val.toString().match(/^\d+(?:\.\d{0,2})?/);
      if (val) {
        this.loanAppForm.bankAccount = val[0];
        this.$refs.bankAccount.setCurrentValue(val[0]);
      } else {
        this.loanAppForm.bankAccount = ''
        this.$refs.bankAccount.setCurrentValue('')
      }
    },
     changePayee(){
        var that = this;
        document.getElementsByClassName("el-input__inner")[5].addEventListener("keyup",function(){
             that.loanAppForm.bankAccount="";
        })
      },
      loadCollectionInformation(){
        this.loanAppForm.payee=this.userInfo.name;
        this.getEmpBankAccount(this.userInfo.empId);
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
      querySearchAsync(queryString, cb) {
          // console.log(this.restaurants);
          //  var that = this;
         
         this.$http.post('/emp/queryEmpDeptList', { 
            name:this.loanAppForm.payee,
            pageSize:100,
         })
        .then(res => {
          if (res.status == 0) {
          if(res.empVoList)
            for(var i=0;i<res.empVoList.length;i++){
              this.payees[i]=res.empVoList[i];
            }
          }
        })
        this.restaurants=this.payees;
        var restaurants = this.restaurants;
       

        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          cb( queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants);
        }, 500);
        
        
      },
      createStateFilter(queryString) {
        return (state) => {
          return (state.name.indexOf(queryString.toLowerCase()) >-1 );
        };
      },
       handleSelect(item) {
        this.getEmpBankAccount(item.empId);
      },

    chooseCurrency(val){
      this.$http.post('/doc/getCurrency', { 
       })
      .then(res => {
        if (res.status == 0) {
         this.currencys=res.data;
        }
      })
    },
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
     

    saveForm(){
      // console.log(this.vehicleForm)
      var param= {"loanAppForm":this.loanAppForm}
      var params=JSON.stringify(param);
      this.$emit('saveMiddle',params);
    },
    getDraft(obj){
      this.loanAppForm=obj.loanAppForm;

    },
    submitForm() {
      // var that = this;
      this.$refs.loanAppForm.validate((valid) => {
        if (valid) {
          // var dep=this.getBudgetDep();
          this.params = {
            docFinBorrow: {
              "money":this.loanAppForm.appMoney,//金额
              "accurencyName": this.$refs.accurency.selectedLabel, //货币名字
              "paymentMethodName": this.$refs.paymentMethod.selectedLabel, //付款方式名字
              "paymentMethodCode": this.$refs.paymentMethod.value, //付款方式编号
              "gatherName": this.loanAppForm.payee, //收款人
              "gatherAccount": this.loanAppForm.bankAccount, // 收款人账户
            }

          }
          this.$emit('submitMiddle', this.params);
        } else {
          this.$message.warning('请检查填写字段')
          this.$emit('submitMiddle', false);
          return false;
        }
      });
    },
    closePerson(index) {
      this.budgetForm.person.splice(index, 1);
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
      this.changePayee();

    }
}

</script>
<style lang='scss'>
$main:#0460AE;
  .flw50{
    width:50%;
    float:left;
    height:50px;
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
 .payee{
    width:200px;
   }
.loanApplication {

  .budgetMoney{
   
    .btn{
      margin-left:5px;
    }
    
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
