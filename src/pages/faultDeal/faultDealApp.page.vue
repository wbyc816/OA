<template>
  <div id='faultDealApp' class="commonApp" v-loading.fullscreen="submitLoading">
    <el-card>
      <div slot="header" class='doc_title'>
        <span>新建接障</span>
      </div>
      <div class="docBaseBox doc-section">
        <el-form label-position="left" :model="faultDealForm" :rules="rules" ref="faultDealForm" label-width="128px">

          <el-form-item label="反馈状态"  prop="isFeedback1"  class="deptArea">
            <el-select v-model="faultDealForm.isFeedback1" style="width:100%" placeholder="反馈状态" clearable>
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="解决状态"  prop="isSolve" class="arrArea">
            <el-select v-model="faultDealForm.isSolve" style="width:100%" placeholder="解决状态" clearable>
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>
          </el-form-item>

          <!-- <el-form-item label="白班/夜班"  prop="isNightWork" class="deptArea">
            <el-select v-model="faultDealForm.isNightWork" style="width:100%" placeholder="白班/夜班" clearable>
              <el-option label="夜班" value="1"></el-option>
              <el-option label="白班" value="0"></el-option>
            </el-select>
          </el-form-item> -->

          <el-form-item label="故障系统"  prop="faultSystem" class="deptArea">
            <el-select v-model="faultDealForm.faultSystem" placeholder="故障系统" ref="faultSystem" style="width:100%" clearable>
              <el-option v-for="item in faultSystems" :label="item.dictName" :value="item.dictCode"></el-option>
            </el-select>
         </el-form-item>
         
          <el-form-item label="故障类别"  prop="faultType" class="arrArea">
            <el-select v-model="faultDealForm.faultType" placeholder="故障类别" ref="faultType" style="width:100%" clearable>
              <el-option v-for="item in faultTypes" :label="item.dictName" :value="item.dictCode"></el-option>
            </el-select>
          </el-form-item>

         

          <el-form-item label="报障部门"  prop="deptMajorId" class="deptArea">
            <el-select v-model="faultDealForm.deptMajorId" style="width:100%"  ref="deptMajorId" clearable>
              <el-option v-for="item in budgetDeptList" :label="item.budgetDeptName" placeholder="报障部门" :value="item.budgetDeptCode" ></el-option>
              <el-option  label="其他" value="其他"></el-option>
            </el-select>
          </el-form-item>
       
          <!-- <el-form-item label="自定义号码">
            <div class="customNumBox">
              <el-tag :key="num" type="primary" :closable="true" @close="closeCustomNum(index)" v-for="(num,index) in customNums">{{num}}</el-tag>
              <el-form :model="inputForm" :rules="inputRules" v-if="inputVisible" ref="inputForm" label-width="0px">
                <el-form-item prop="inputValue">
                  <el-input class="input-new-tag" v-model="inputForm.inputValue" ref="saveTagInput" size="mini" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm" :maxlength="11">
                  </el-input>
                </el-form-item>
              </el-form>
              <el-button v-else class="button-new-tag" size="small" @click="showInput" icon="plus">添加</el-button>
            </div>
          </el-form-item> -->

        <el-form-item label="接障人" prop="operatorName" class="arrArea" >
          <el-autocomplete
            style="width:100%"
            v-model="faultDealForm.operatorName"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入接障人"
              @select="handleSelectOperator"
              :props="testprops"
              ref="operatorName"
              class="operatorName"></el-autocomplete>
        </el-form-item>

        <el-form-item label="报障人" prop="empName" class="deptArea" >
          <el-autocomplete
            style="width:100%"
            v-model="faultDealForm.empName"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入报障人"
              @select="handleSelect"
              :props="testprops"
              ref="empName"
              class="empName"></el-autocomplete>
        </el-form-item>

        <el-form-item label="报障人联系电话" prop="empPhone"  class="arrArea">
          <money-input v-model="faultDealForm.empPhone" type="bankCode" :prepend="false" placeholder="请输入报障人联系电话" :append="false" ref="empPhone" :maxlength="11"></money-input>
        </el-form-item>

         <el-form-item label="报障方式"  prop="faultMethod" class="deptArea">
            <el-select v-model="faultDealForm.faultMethod" placeholder="报障方式" ref="faultMethod" style="width:100%" clearable>
              <el-option v-for="item in faultMethods" :label="item.dictName" :value="item.dictCode"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="接障人" prop="faultDealEmpName" class="arrArea" >
          <el-autocomplete
            style="width:100%"
            v-model="faultDealForm.faultDealEmpName"
              :fetch-suggestions="querySearchAsyncDeal"
              placeholder="请输入接障人"
              @select="handleSelectDeal"
              :props="testprops"
              ref="faultDealEmpName"
              class="faultDealEmpName"></el-autocomplete>
        </el-form-item>

          <el-form-item label="故障简单描述" prop="faultDescribe" class="clearBoth">
            <el-input type="textarea" :rows="8" resize='none' v-model="faultDealForm.faultDescribe" :maxlength="990"></el-input>
            <p class="maxText">内容最多为200个字</p>
          </el-form-item>
          <el-form-item label="备注1" prop="remark1" class="clearBoth">
            <el-input type="textarea" :rows="8" resize='none' v-model="faultDealForm.remark1" :maxlength="990"></el-input>
            <p class="maxText">内容最多为200个字</p>
          </el-form-item>
          <el-form-item label="备注2" prop="remark2">
            <el-input type="textarea" :rows="8" resize='none' v-model="faultDealForm.remark2" :maxlength="990"></el-input>
            <p class="maxText">内容最多为200个字</p>
          </el-form-item>
          <el-form-item label="备注3" prop="remark3">
            <el-input type="textarea" :rows="8" resize='none' v-model="faultDealForm.remark3" :maxlength="990"></el-input>
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
  name: 'faultDealApp',
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
      deptMajorId:"",
      faultDealForm:{
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
        operatorName: [{ required: true, message: '请输入接障人', trigger: 'blur,change' }],
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
      inputValue: ''
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
    ])
  },
  created() {
    this.getBudgetDeptList();
    this.faultType();
    this.faultSystem();
    this.faultMethod();
    this.setDefault();
  },
  methods: {
     setDefault(){
       this.faultDealForm.faultDealEmpName=this.userInfo.name;
       this.faultDealForm.operatorName=this.userInfo.name;
       this.faultDealForm.faultDealEmpId=this.userInfo.empId;
       this.faultDealForm.operatorId=this.userInfo.empId;
     },
     handleSelect(item) {
        // this.getEmpBankAccount(item.empId);
        // console.log(item)
        this.faultDealForm.empId=item.empId;
        this.faultDealForm.empPhone=item.mobileNumber;
      },
     handleSelectOperator(item) {
        // this.getEmpBankAccount(item.empId);
        this.faultDealForm.operatorId=item.empId;
      },
     handleSelectDeal(item) {
        // this.getEmpBankAccount(item.empId);
        this.faultDealForm.faultDealEmpId=item.empId;
      },
     querySearchAsync(queryString, cb) {
          // console.log(this.restaurants);
          //  var that = this;
         
         this.$http.post('/emp/queryEmpDeptList', { 
            name:this.faultDealForm.empName,
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
            name:this.faultDealForm.operatorName,
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
            name:this.faultDealForm.faultDealEmpName,
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
              "operatorId": this.faultDealForm.operatorId,
              "operatorName": this.faultDealForm.operatorName,
              "empId": this.faultDealForm.empId,
              "empName": this.faultDealForm.empName,
              "deptMajorId": this.faultDealForm.deptMajorId,
              "deptMajorName": this.$refs.deptMajorId.selectedLabel,
              "empPhone":this.faultDealForm.empPhone,
              "barrierMethod": this.$refs.faultMethod.selectedLabel,
              "faultType": this.$refs.faultType.selectedLabel,
              "faultSystem": this.$refs.faultSystem.selectedLabel,
              "faultDealEmpId": this.faultDealForm.faultDealEmpId,
              "faultDealEmpName":this.faultDealForm.faultDealEmpName,
              "faultDescribe": this.faultDealForm.faultDescribe,
              // "isFeedback": this.faultDealForm.operatorId,
              "isFeedback1":this.faultDealForm.isFeedback1,
              "isSolve": this.faultDealForm.isSolve,
              "remark1": this.faultDealForm.remark1,
              "remark2":this.faultDealForm.remark2,
              "remark3": this.faultDealForm.remark3,
              "barrierMethodCode": this.faultDealForm.faultMethod,
              "faultTypeCode": this.faultDealForm.faultType,
              "faultSystemCode": this.faultDealForm.faultSystem
           
      }
      this.$http.post('/fault/addFaultInfo', params, { body: true })
        .then(res => {
          this.submitLoading = false;
          if (res.status == 0) {
            this.$message.success('提交成功！');
            this.$router.push('/faultDeal/myfaultDeal');
          } else {
            this.$message.error(res.message);
          }
        })
    }
  }
}

</script>
<style lang='scss'>
#faultDealApp {
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
}

</style>
