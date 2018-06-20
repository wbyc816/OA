<template>
  <div id='breakDownApp' class="commonApp" v-loading.fullscreen="submitLoading">
    <el-card>
      <div slot="header" class='doc_title'>
        <span>详情</span>
      </div>

      <el-row>
        <el-col :span="12" class=" rightBorder">
          <span class="title">日期</span>
          <p class="text">{{breakDownForm.createDate}}</p>
        </el-col>
        <el-col :span="12" class="rightBorder ">
          <span class="title">时间</span>
          <p class="text">{{breakDownForm.createTime}}</p>
        </el-col>
        <el-col :span="12" class="">
          <span class="title">接线人</span>
          <p class="text">{{breakDownForm.operatorName}}</p>
        </el-col>
        <el-col :span="12" class="">
          <span class="title">30分钟反馈状态</span>
          <p class="text">{{breakDownForm.isFeedback=="1"?"已反馈":"未反馈"}}</p>
        </el-col>
        <el-col :span="12" class="clearfix">
          <span class="title">白班/夜班</span>
          <p class="text">{{breakDownForm.isNightWork=="0"?"白班":"夜班"}}</p>
        </el-col>
        <el-col :span="12" class="clearfix">
          <span class="title">故障系统</span>
          <p class="text">{{breakDownForm.faultSystem}}</p>
        </el-col>
        <el-col :span="12" class="clearfix">
          <span class="title">故障类别</span>
          <p class="text">{{breakDownForm.faultType}}</p>
        </el-col>
        <el-col :span="12" class="clearfix">
          <span class="title">报障部门</span>
          <p class="text">{{breakDownForm.deptMajorName}}</p>
        </el-col>
        <el-col :span="12" class="clearfix">
          <span class="title">报障人</span>
          <p class="text">{{breakDownForm.empName}}</p>
        </el-col>
        <el-col :span="12" class="clearfix">
          <span class="title">报障人联系电话</span>
          <p class="text">{{breakDownForm.empPhone}}</p>
        </el-col>
        <el-col :span="12" class="clearfix">
          <span class="title">报障方式</span>
          <p class="text">{{breakDownForm.faultMethod}}</p>
        </el-col>
        <el-col :span="12" class="clearfix">
          <span class="title">接障人</span>
          <p class="text">{{breakDownForm.faultDealEmpName}}</p>
        </el-col>
        <el-col :span="12" class="clearfix">
          <span class="title">故障简单描述</span>
          <p class="text">{{breakDownForm.faultDescribe}}</p>
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

          <el-form-item label="反馈状态"  prop="isFeedback1"  class="deptArea" ref="isFeedback1">
            <el-select v-model="breakDownForm.isFeedback1" style="width:100%" placeholder="反馈状态" clearable>
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="解决状态"  prop="isSolve" class="arrArea" ref="isSolve">
            <el-select v-model="breakDownForm.isSolve" style="width:100%" placeholder="解决状态" clearable>
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>
          </el-form-item>
        
          <el-form-item label="备注1" prop="remark1" class="clearBoth">
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
          </el-form-item>
        </el-form>
        <div class='doc-form-submit_btn'>
          <el-button type="primary" @click="submit">提交</el-button>
        </div>
        </div>
    </el-card>
    <transfer-dialog :visible.sync="signDialogVisible" @update="updatePerson" :data="appForm.person"></transfer-dialog>

  </div>
</template>
<script>
import TransferDialog from '../../components/transferDialog.component'
import MoneyInput from '../../components/moneyInput.component'
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'breakDownApp',
  components: {
    TransferDialog,MoneyInput
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
        faultMethod:"",
        faultDescribe:"",
        faultDealEmpName:"",
        faultDealEmpId:"",
      },
      faultTypes:[],
      faultSystems:[],
      faultMethods:[],
       testprops:{
        value:"name",
        label:"name"
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
        faultMethod: [{ required: true, message: '请选择报障方式', trigger: 'blur,change' }],
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
    
    this.getDetail();
    this.getBudgetDeptList();
    this.faultType();
    this.faultSystem();
    this.faultMethod();
    // this.setDefault();
  },
 watch: {
    '$route' (to, from) {
      if(to.params.id){
         this.getDetail();
        this.getBudgetDeptList();
        this.faultType();
        this.faultSystem();
        this.faultMethod();
      }
    },
  },
  methods: {
    
    //  setDefault(){
    //    this.breakDownForm.faultDealEmpName=this.userInfo.name;
    //    this.breakDownForm.operatorName=this.userInfo.name;
    //    this.breakDownForm.faultDealEmpId=this.userInfo.empId;
    //    this.breakDownForm.operatorId=this.userInfo.empId;
    //  },
      getDetail() {
        console.log(5555)
      this.$http.post('/fault/getFaultById', { id: this.$route.params.id })
        .then(res => {
          if (res.status == 0) {
            this.breakDownForm = res.data;
            this.operatorId = this.breakDownForm.operatorName;
            this.deptMajorIdValue = this.breakDownForm.deptMajorName;
            this.faultDealEmpName = this.breakDownForm.empName;
            this.breakDownForm.faultMethod = res.data.barrierMethod;
            this.id=res.data.id;
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
        this.breakDownForm.faultDealEmpId=item.empId;
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
         
         this.$http.post('/emp/queryEmpDeptList', { 
            name:this.breakDownForm.faultDealEmpName,
            pageSize:100,
         })
        .then(res => {
          if (res.status == 0) {
          if(res.empVoList)
            for(var i=0;i<res.empVoList.length;i++){
              this.faultDealEmpNames[i]=res.empVoList[i];
            }
          }
        })
        this.restaurants=this.faultDealEmpNames;
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
      this.submitLoading = true;
      console.log(this.$refs.deptMajorId)
      var params = {
               id:this.id,
              "operatorId": this.breakDownForm.operatorId,
              "operatorName": this.breakDownForm.operatorName,
              "empId": this.breakDownForm.empId,
              "empName": this.breakDownForm.empName,
              "deptMajorId": this.breakDownForm.deptMajorId,
              "deptMajorName": this.breakDownForm.deptMajorName,
              "empPhone":this.breakDownForm.empPhone,
              "barrierMethod": this.breakDownForm.barrierMethod,
              "faultType": this.breakDownForm.faultType,
              "faultSystem": this.breakDownForm.faultSystem,
              "faultDealEmpId": this.breakDownForm.faultDealEmpId,
              "faultDealEmpName":this.breakDownForm.faultDealEmpName,
              "faultDescribe": this.breakDownForm.faultDescribe,
              // "isFeedback": this.breakDownForm.operatorId,
              "isFeedback1":this.breakDownForm.isFeedback1,
              "isSolve": this.breakDownForm.isSolve,
              "remark1": this.breakDownForm.remark1,
              "remark2":this.breakDownForm.remark2,
              "remark3": this.breakDownForm.remark3,
              "barrierMethodCode": this.breakDownForm.faultMethod,
              "faultTypeCode": this.breakDownForm.faultTypeCode,
              "faultSystemCode": this.breakDownForm.faultSystemCode
           
      }
      this.$http.post('/fault/updateFaultInfo', params, { body: true })
        .then(res => {
          this.submitLoading = false;
          if (res.status == 0) {
            this.$message.success('提交成功！');
            this.$router.push('/faultDeal/myFaultDeal');
          } else {
            this.$message.error(res.message);
          }
        })
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
