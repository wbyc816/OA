<template>
  <div id='breakDownApp' class="commonApp" v-loading.fullscreen="submitLoading">
    <el-card>
      <div slot="header" class='doc_title'>
        <span>详情</span>
      </div>

      <el-row>
        <el-col :span="12" class="clearfix right">
          <span class="title">日期</span>
          <p class="text">{{breakDownForm.createDate}}</p>
        </el-col>
        <el-col :span="12" class="clearfix">
          <span class="title">时间</span>
          <p class="text">{{breakDownForm.createTime}}</p>
        </el-col>
        <el-col :span="12" class="clearfix right">
          <span class="title">接线人</span>
          <p class="text">{{breakDownForm.operatorName}}</p>
        </el-col>
        <el-col :span="12" class="clearfix">
          <span class="title">30分钟反馈状态</span>
          <p class="text">{{breakDownForm.isFeedback=="1"?"已反馈":"未反馈"}}</p>
        </el-col>
        <el-col :span="12" class="clearfix right">
          <span class="title">白班/夜班</span>
          <p class="text">{{breakDownForm.isNightWork=="0"?"白班":"夜班"}}</p>
        </el-col>
        <el-col :span="12" class="clearfix">
          <span class="title">备注1</span>
          <p class="text">{{breakDownForm.remark1}}</p>
        </el-col>
        <el-col :span="12" class="clearfix right">
          <span class="title">备注2</span>
          <p class="text">{{breakDownForm.remark2}}</p>
        </el-col>
        <el-col :span="12" class="clearfix">
          <span class="title">备注3</span>
          <p class="text">{{breakDownForm.remark3}}</p>
        </el-col>
      </el-row>

      <div class="docBaseBox doc-section mt20">
        <!-- <h4 class='doc-form_title'>信息填写</h4> -->
        <el-form label-position="left" :model="breakDownForm" :rules="rules" ref="breakDownForm" label-width="128px">

        
        
          <!-- <el-form-item label="是否30分钟反馈"  prop="faultType" class="arrArea">
            <el-select v-model="breakDownForm.isFeedback" style="width:100%" placeholder="是否30分钟反馈" clearable>
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>
          </el-form-item> -->

        
           <!-- <el-form-item label="白班/夜班"  prop="isNightWork" class="deptArea">
            <el-select v-model="breakDownForm.isNightWork" style="width:100%" placeholder="白班/夜班" clearable>
              <el-option label="夜班" value="1"></el-option>
              <el-option label="白班" value="0"></el-option>
            </el-select>
          </el-form-item> -->

           <!-- <el-form-item label="接线人" prop="operatorName" class="arrArea" >
          <el-autocomplete
            style="width:100%"
            v-model="breakDownForm.operatorName"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入接线人"
              @select="handleSelectOperator"
              :props="testprops"
              ref="operatorName"
              class="operatorName"></el-autocomplete>
        </el-form-item> -->

      

           <!-- <el-form-item label="备注1" prop="remark1" class="clearBoth">
            <el-input type="textarea" :rows="8" resize='none' v-model="breakDownForm.remark1" :maxlength="990"></el-input>
            <p class="maxText">内容最多为200个字</p>
          </el-form-item>
          <el-form-item label="备注2" prop="remark2">
            <el-input type="textarea" :rows="8" resize='none' v-model="breakDownForm.remark2" :maxlength="990"></el-input>
            <p class="maxText">内容最多为200个字</p>
          </el-form-item>
          <el-form-item label="备注3" prop="remark3">
            <el-input type="textarea" :rows="8" resize='none' v-model="breakDownForm.remark3" :maxlength="990"></el-input>
            <p class="maxText">内容最多为200个字</p>
          </el-form-item> -->





          <el-form-item label="反馈状态"  prop="isFeedback1"  class="arrArea">
            <el-select v-model="breakDownForm.isFeedback1" style="width:100%" placeholder="反馈状态" clearable>
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="解决状态"  prop="isSolve" class="deptArea">
            <el-select v-model="breakDownForm.isSolve" style="width:100%" placeholder="解决状态" clearable>
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>
          </el-form-item>
       

          <el-form-item label="故障系统"  prop="faultSystem" class="arrArea">
            <el-select v-model="breakDownForm.faultSystem" placeholder="故障系统" ref="faultSystem" style="width:100%" clearable>
              <el-option v-for="item in faultSystems" :label="item.dictName" :value="item.dictCode"></el-option>
            </el-select>
         </el-form-item>
         
          <el-form-item label="故障类别"  prop="faultType" class="deptArea">
            <el-select v-model="breakDownForm.faultType" placeholder="故障类别" ref="faultType" style="width:100%" clearable>
              <el-option v-for="item in faultTypes" :label="item.dictName" :value="item.dictCode"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="报障部门"  prop="deptMajorId" class="arrArea">
            <el-select v-model="breakDownForm.deptMajorId" style="width:100%"  ref="deptMajorId" clearable>
              <el-option v-for="item in budgetDeptList" :label="item.budgetDeptName" placeholder="报障部门" :value="item.budgetDeptCode" ></el-option>
              <el-option  label="其他" value="其他"></el-option>
            </el-select>
          </el-form-item>
       

        <el-form-item label="报障人" prop="empName" class="deptArea" >
          <el-autocomplete
            style="width:100%"
            v-model="breakDownForm.empName"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入报障人"
              @select="handleSelect"
              :props="testprops"
              ref="empName"
              class="empName"></el-autocomplete>
        </el-form-item>

          <el-form-item label="报障人联系电话" prop="empPhone"  class="arrArea">
            <money-input v-model="breakDownForm.empPhone" type="bankCode" :prepend="false" placeholder="请输入报障人联系电话" :append="false" ref="empPhone" :maxlength="11"></money-input>
          </el-form-item>


        <el-form-item label="接障人" prop="faultDealEmpName" class="arrArea" >
          <el-autocomplete
            style="width:100%"
            v-model="breakDownForm.faultDealEmpName"
              :fetch-suggestions="querySearchAsyncDeal"
              placeholder="请输入接障人"
              @select="handleSelectDeal"
              :props="faultDeal"
              ref="faultDealEmpName"
              class="faultDealEmpName"></el-autocomplete>
        </el-form-item>

       
          <el-form-item label="报障方式"  prop="barrierMethodCode" class="deptArea">
            <el-select v-model="breakDownForm.barrierMethodCode" placeholder="报障方式" ref="barrierMethodCode" style="width:100%"  clearable>
              <el-option v-for="item in faultMethods" :label="item.dictName" :value="item.dictCode"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="故障简单描述" prop="faultDescribe" class="clearBoth">
            <el-input type="textarea" :rows="8" resize='none' v-model="breakDownForm.faultDescribe" :maxlength="990"></el-input>
            <p class="maxText">内容最多为200个字</p>
          </el-form-item>
         
        </el-form>
        <div class='doc-form-submit_btn'>
          <el-button type="primary" @click="submit">提交</el-button>
        </div>
        </div>
    </el-card>

  </div>
</template>
<script>
import MoneyInput from '../../components/moneyInput.component'
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'breakDownApp',
  components: {
    MoneyInput
  },
  data() {
    var checkNum = (rule, value, callback) => {
      if (this.customNums.indexOf(value) === -1) {
        callback();
      } else {
        callback(new Error('不能添加相同的号码'))
      }
    };
    return {
      signDialogVisible: false,
      budgetDeptList:[],
      operatorNames:[],
      faultDealEmpNames:[],
      empNames:[],
      // empNames:[],
      deptMajorId:"",
      breakDownForm:{
        remark1:"",
        remark2:"",
        remark3:"",
        faultType:"",
        faultSystem:"",
        deptMajorId:"",
        isFeedback:"",
        isFeedback1:"",
        isSolve:"",
        isNightWork:"",
        operatorName:"",
        operatorId:"",
        empName:"",
        empId:"",
        empPhone:"",
        barrierMethodCode:"",
        faultDescribe:"",
        faultDealEmpName:"",
        // faultDealEmpId:"",
      },
      faultTypes:[],
      faultSystems:[],
      faultMethods:[],
       testprops:{
        value:"name",
        label:"name"
      },
       faultDeal:{
        value:"empName",
        label:"empName"
      },



      appForm: {
        messageContent: '',
        person: [],
      },
      inputForm: {
        inputValue: ''
      },
      inputRules: {
        inputValue: [{ validator: this.validatePhone, trigger: 'blur' }, { validator: checkNum, trigger: 'blur' }]
      },
      rules: {
        // person: [{ type: 'array', required: true, message: '请选择人员' }, ],
        // messageContent: [{ required: true, message: '请输入短信内容', trigger: 'blur,change' }]
        isFeedback1: [{ required: true, message: '请选择反馈状态', trigger: 'blur,change' }],
        isSolve: [{ required: true, message: '请选择反馈状态', trigger: 'blur,change' }],
        operatorName: [{ required: true, message: '请输入接线人', trigger: 'blur,change' }],
        empName: [{ required: true, message: '请输入报障人', trigger: 'blur,change' }],
        barrierMethodCode: [{ required: true, message: '请选择报障方式', trigger: 'blur,change' }],
        deptMajorId: [{ required: true, message: '请选择报障部门', trigger: 'blur,change' }],
        faultType: [{ required: true, message: '请选择故障类别', trigger: 'blur,change' }],
        faultSystem: [{ required: true, message: '请选择故障系统', trigger: 'blur,change' }],
        faultDescribe: [{ required: true, message: '请输入内容', trigger: 'blur,change' }],
        faultDealEmpName: [{ required: true, message: '请输入接障人', trigger: 'blur,change' }],
      },
      submitLoading: false,
      customNums: [],
      inputVisible: false,
      inputValue: '',
      id:"",
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
    ])
  },
  created() {
     console.log(this.$route.params.id)
    this.getBudgetDeptList();
    this.faultType();
    this.faultSystem();
    this.faultMethod();
    this.getDetail();
    // this.setDefault();
  },
  methods: {
    
    //  setDefault(){
    //    this.breakDownForm.faultDealEmpName=this.userInfo.name;
    //    this.breakDownForm.operatorName=this.userInfo.name;
    //    this.breakDownForm.faultDealEmpId=this.userInfo.empId;
    //    this.breakDownForm.operatorId=this.userInfo.empId;
    //  },
      getDetail() {
      this.$http.post('/fault/getFaultById', { id: this.$route.params.id })
        .then(res => {
          if (res.status == 0) {
            this.breakDownForm = res.data;
            this.operatorId = this.breakDownForm.operatorName;
            this.deptMajorIdValue = this.breakDownForm.deptMajorName;
            this.faultDealEmpName = this.breakDownForm.empName;
            // this.breakDownForm.faultMethod = res.data.barrierMethodCode;
            this.id=res.data.id
          } else {

          }
        })
      },
     handleSelect(item) {
        // this.getEmpBankAccount(item.empId);
        // console.log(item)
        this.breakDownForm.empId=item.empId;
        this.breakDownForm.empPhone=item.mobileNumber;
      },
     handleSelectOperator(item) {
        // this.getEmpBankAccount(item.empId);
        this.breakDownForm.operatorId=item.empId;
      },
     handleSelectDeal(item) {
        // this.getEmpBankAccount(item.empId);
        // this.breakDownForm.faultDealEmpId=item.empId;
      },
     querySearchAsync(queryString, cb) {
          // console.log(this.restaurants);
          //  var that = this;
         this.$http.post('/emp/queryEmpDeptList', { 
            name:this.breakDownForm.empName,
            pageSize:100,
         })
        .then(res => {
          if (res.status == 0) {
          if(res.empVoList)
            for(var i=0;i<res.empVoList.length;i++){
              this.empNames[i]=res.empVoList[i];
            }
          }
        })
        this.restaurants=this.empNames;
        var restaurants = this.restaurants;
       

        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          cb( queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants);
        }, 500);
        
        
      },
     querySearchAsyncOperator(queryString, cb) {
          // console.log(this.restaurants);
          //  var that = this;
         
         this.$http.post('/emp/queryEmpDeptList', { 
            name:this.breakDownForm.operatorName,
            pageSize:100,
         })
        .then(res => {
          if (res.status == 0) {
          if(res.empVoList)
            for(var i=0;i<res.empVoList.length;i++){
              this.operatorNames[i]=res.empVoList[i];
            }
          }
        })
        this.restaurants=this.operatorNames;
        var restaurants = this.restaurants;
       

        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          cb( queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants);
        }, 500);
        
        
      },
     querySearchAsyncDeal(queryString, cb) {
          // console.log(this.restaurants);
          //  var that = this;
         
         this.$http.post('/fault/getfaultDealEmpNames', { 
            // name:this.breakDownForm.faultDealEmpName,
            // pageSize:100,
         })
        .then(res => {
          if (res.status == 0) {
          if(res.data)
            for(var i=0;i<res.data.length;i++){
              this.faultDealEmpNames[i]=res.data[i];
            }
          }
        })
        this.restaurantDeal=this.faultDealEmpNames;
        var restaurantDeal = this.restaurantDeal;
       

        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          cb( queryString ? restaurantDeal.filter(this.createStateFilterDeal(queryString)) : restaurantDeal);
        }, 500);
        
        
      },
       createStateFilterDeal(queryString) {
        return (state) => {
          return (state.empName.indexOf(queryString.toLowerCase()) >-1 );
        };
      },
       createStateFilter(queryString) {
        return (state) => {
          return (state.name.indexOf(queryString.toLowerCase()) >-1 );
        };
      },
    faultMethod(){
       this.$http.post('/api/getDict', { dictCode: 'FAU01' })
        .then(res => {
          if (res.status == '0') {
            this.faultMethods = res.data;
          } else {

          }
        }, res => {

        })
    },
    faultType(){
       this.$http.post('/api/getDict', { dictCode: 'FAU02' })
        .then(res => {
          if (res.status == '0') {
            this.faultTypes = res.data;
          } else {

          }
        }, res => {

        })
    },
    faultSystem(){
       this.$http.post('/api/getDict', { dictCode: 'FAU03' })
        .then(res => {
          if (res.status == '0') {
            this.faultSystems = res.data;
          } else {

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
   
    updatePerson(list) {
      // console.log(list)
      this.appForm.person = this.clone(list);
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      if (this.inputForm.inputValue && this.inputForm.inputValue.length !== 0) {
        this.$refs.inputForm.validate((valid) => {
          if (valid) {
            this.customNums.push(this.inputForm.inputValue);
            this.inputVisible = false;
            this.inputForm.inputValue = '';
          }
        })
      } else {
        this.inputVisible = false;
      }
    },
    closePerson(index) {
      this.appForm.person.splice(index, 1);
    },
    closeCustomNum(index) {
      this.customNums.splice(index, 1);
    },
    submit() {
      // this.submitLoading = true;
        this.$refs.breakDownForm.validate((valid) => {
          if (valid) {
             var params = {
              id:this.id,
              "operatorId": this.breakDownForm.operatorId,
              "operatorName": this.breakDownForm.operatorName,
              "empId": this.breakDownForm.empId,
              "empName": this.breakDownForm.empName,
              "deptMajorId": this.breakDownForm.deptMajorId,
              "deptMajorName": this.$refs.deptMajorId.selectedLabel,
              "empPhone":this.breakDownForm.empPhone,
              "barrierMethod": this.$refs.barrierMethodCode.selectedLabel,
              "faultType": this.$refs.faultType.selectedLabel,
              "faultSystem": this.$refs.faultSystem.selectedLabel,
              // "faultDealEmpId": this.breakDownForm.faultDealEmpId,
              "faultDealEmpName":this.breakDownForm.faultDealEmpName,
              "faultDescribe": this.breakDownForm.faultDescribe,
              // "isFeedback": this.breakDownForm.operatorId,
              "isFeedback1":this.breakDownForm.isFeedback1,
              "isSolve": this.breakDownForm.isSolve,
              // "remark1": this.breakDownForm.operatorId,
              // "remark2":this.breakDownForm.operatorId,
              // "remark3": "",
              "barrierMethodCode": this.breakDownForm.barrierMethodCode,
              "faultTypeCode": this.breakDownForm.faultTypeCode,
              "faultSystemCode": this.breakDownForm.faultSystemCode
           
            }
            this.$http.post('/fault/updateFaultInfo', params, { body: true })
              .then(res => {
                this.submitLoading = false;
                if (res.status == 0) {
                  this.$message.success('提交成功！');
                  this.$router.push('/breakDown/myBreakDown');
                } else {
                  this.$message.error(res.message);
                }
              })

          }else{
            this.$message.warning('请检查填写字段')
            this.$emit('submitMiddle', false);
            return false;
          }})
     
    }
  }
}

</script>
<style lang='scss'>
#breakDownApp {
  .mt20{
    margin-top: 20px;
  }
  .docBaseBox {
    padding-right: 150px;
    border-bottom: none;
    .el-form-item__error {
      padding-left: 6px;
    }
    .el-radio-button__inner {
      width: 100px;
      height: 45px;
      line-height: 45px;
      padding: 0;
    }
    .reciverList {
      max-height: 250px;
      overflow-y: auto;
    }
  }
  .customNumBox {
    padding-top: 4px;
    .button-new-tag {
      height: 24px;
      line-height: 22px;
      padding-top: 0;
      padding-bottom: 0;
      font-size: 13px;
      border-radius: 3px;
      .el-icon-plus {
        font-size: 12px;
      }
    }
    .el-form {
      display: inline-block;
      .input-new-tag {
        width: 125px;
        line-height: 24px;
        input {
          border-radius: 3px;
          height: 24px;
        }
      }
    }
  }
  .doc-form-submit_btn {
    button {
      margin-left: 128px;
      width: 160px;
      height: 50px;
    }
  }
  .maxText {
    position: absolute;
    right:0;
    font-size: 13px;
    color: #9a9a9a;
    line-height: 15px;
    bottom: -15px;
    white-space: nowrap;
  }
    .doc-form-submit_btn {
    button {
      
      margin:20px 0 0 128px;
      width: 160px;
      height: 50px;
    }
  }
  .borderCard {
    padding-bottom: 0;
    min-height:500px;
    .el-card__header{
      padding:12px;
    }
    .el-card__body{
      padding-bottom:10px;
    }
  }
  .el-col {
    position: relative;
    font-size: 15px;
    border-bottom: 1px solid #F2F2F2;
    padding: 15px 15px 15px 190px;
    min-height: 51px;
    .title {
      position: absolute;
      color: #0460AE;
      left: 30px;
      top: 15px;
    }
  }
}

</style>
