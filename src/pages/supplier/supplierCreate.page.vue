<template>
  <div id='supplierApp' class="commonApp" v-loading.fullscreen="submitLoading">
    <el-card>
      <div slot="header" class='doc_title'>
        <span>{{$route.params.id == 'all'?'新建客户':'编辑客户'}}</span>
      </div>
      <div class="docBaseBox doc-section">
        <h4 class='doc-form_title'>基本信息</h4>
        <el-form label-position="left" :model="appForm" :rules="rules" ref="appForm" label-width="128px" class="clearfix">
          <el-form-item label="客户名称" prop="supplierName" class="deptArea">
            <el-input v-model.trim="appForm.supplierName"></el-input>
          </el-form-item>
          <el-form-item label="客户类型" prop="supplierTypeCode" class="arrArea">
            <el-select v-model="appForm.supplierTypeCode" style="width:100%" no-data-text="加载中..." @visible-change="getSupplierTypes" ref="supplierType" @change="typeChange">
              <el-option v-for="item in supplierTypes" :key="item.dictCode" :label="item.dictName" :value="item.dictCode">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客户简称" prop="supplierAbbreviation" class="deptArea" v-if="!isPersonal">
            <el-input v-model="appForm.supplierAbbreviation"></el-input>
          </el-form-item>
          <el-form-item label="城市" prop="supplierCity" :class="isPersonal?'deptArea':'arrArea'">
            <el-input v-model="appForm.supplierCity"></el-input>
          </el-form-item>
          <template v-if="isPersonal">
            <el-form-item label="称谓" prop="contactTitleCode" class="arrArea">
              <el-select v-model="appForm.contactTitleCode" ref="contactTitle" style="width:100%" no-data-text="加载中..." @visible-change="getTitleList">
                <el-option v-for="item in titleList" :key="item.dictCode" :label="item.dictName" :value="item.dictCode">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="岗位" prop="contactJobtitle" class="deptArea">
              <el-input v-model="appForm.contactJobtitle"></el-input>
            </el-form-item>
            <el-form-item label="电子邮件" prop="contactEmail" class="arrArea" :rules="[{type: 'email', required: isPersonal, message: '请输入正确的邮箱地址' }]">
              <el-input v-model="appForm.contactEmail"></el-input>
            </el-form-item>
            <el-form-item label="办公电话" prop="contactOfficePhone" class="deptArea">
              <el-input v-model="appForm.contactOfficePhone"></el-input>
            </el-form-item>
            <el-form-item label="移动电话" prop="contactMobilePhone" class="arrArea" :rules="[{ required: isPersonal, message: '请输入正确的手机号码' ,validator:validatePhone}]">
              <el-input v-model="appForm.contactMobilePhone" :maxlength="11"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="classifyStatusCode" class="deptArea">
              <el-select v-model="appForm.classifyStatusCode" ref="supplierStatus" style="width:100%" no-data-text="加载中..." @visible-change="getSupplierStatus">
                <el-option v-for="item in supplierStatus" :key="item.dictCode" :label="item.dictName" :value="item.dictCode">
                </el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="客户经理" prop="classifyManagerEmpId" class="arrArea Manager">
              <el-input class="search" v-model="classifyManagerName" :readonly="true">
                <el-button slot="append" @click='dialogTableVisible=true'>选择</el-button>
              </el-input>
            </el-form-item> -->
          </template>
          <el-form-item label="地址" prop="supplierAddress" class="clearBoth">
            <el-input v-model="appForm.supplierAddress"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="supplierTelephone" class="deptArea" v-if="!isPersonal">
            <el-input v-model="appForm.supplierTelephone"></el-input>
          </el-form-item>
          <el-form-item label="电子邮箱" prop="supplierEmail" class="arrArea" v-if="!isPersonal">
            <el-input v-model="appForm.supplierEmail"></el-input>
          </el-form-item>
          <el-form-item label="网站" prop="supplierWebsite" class="deptArea" v-if="!isPersonal">
            <el-input v-model="appForm.supplierWebsite"></el-input>
          </el-form-item>
          <el-form-item label="传真" prop="supplierFax" class="arrArea" v-if="!isPersonal">
            <el-input v-model="appForm.supplierFax"></el-input>
          </el-form-item>
          <!-- <el-form-item label="是否公开" prop="supplierFax" class="deptArea">
            <el-radio-group v-model="appForm.isOpen" class="myRadio">
              <el-radio-button :label="1">是<i></i></el-radio-button>
              <el-radio-button :label="0">否<i></i></el-radio-button>
            </el-radio-group>
          </el-form-item> -->

          <el-form-item label="发布范围" prop="fileSend" class="reciverWrap">
            <div class="reciverList">
              <el-tag key="all" :closable="true" v-show="appForm.fileSend.all.max" type="primary" @close="closeAll">
                {{'所有人('+appForm.fileSend.all.min+'-'+appForm.fileSend.all.max+')'}}
              </el-tag>
              <el-tag :key="dep.id" :closable="true" type="primary" @close="closeDep(index)" v-for="(dep,index) in appForm.fileSend.depList">
                {{dep.name+'('+dep.min+'-'+dep.max+')'}}
              </el-tag>
              <el-tag :key="person.id" :closable="true" type="primary" @close="closePerson(index)" v-for="(person,index) in appForm.fileSend.personList">
                {{person.name}}
              </el-tag>
            </div>
            <el-button class="addButton" @click="fileSendVisible=true"><i class="el-icon-plus"></i></el-button>
          </el-form-item>

          <el-form-item label="介绍" prop="supplierIntroduction" class="clearBoth">
            <el-input type="textarea" :rows="4" resize="none" v-model="appForm.supplierIntroduction"></el-input>
          </el-form-item>
          <!-- 分类信息 -->
          <template v-if="!isPersonal">
            <h4 class='doc-form_title'>分类信息</h4>
            <el-form-item label="状态" prop="classifyStatusCode" class="deptArea">
              <el-select v-model="appForm.classifyStatusCode" ref="supplierStatus" style="width:100%" no-data-text="加载中..." @visible-change="getSupplierStatus">
                <el-option v-for="item in supplierStatus" :key="item.dictCode" :label="item.dictName" :value="item.dictCode">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="规模" prop="classifyScaleCode" class="arrArea">
              <el-select v-model="appForm.classifyScaleCode" ref="supplierScale" style="width:100%" no-data-text="加载中..." @visible-change="getSupplierScales">
                <el-option v-for="item in supplierScales" :key="item.dictCode" :label="item.dictName" :value="item.dictCode">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="企业类型" prop="classifyCompanyCode" class="deptArea">
              <el-select v-model="appForm.classifyCompanyCode" ref="supplierCompany" style="width:100%" no-data-text="加载中..." @visible-change="getCompanyTypes">
                <el-option v-for="item in companyTypes" :key="item.dictCode" :label="item.dictName" :value="item.dictCode">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="获得途径" prop="classifyGainCode" class="arrArea">
              <el-select v-model="appForm.classifyGainCode" ref="gain" style="width:100%" no-data-text="加载中..." @visible-change="getGains">
                <el-option v-for="item in gains" :key="item.dictCode" :label="item.dictName" :value="item.dictCode">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="行业" prop="classifyIndustryCode" class="deptArea">
              <el-cascader :clearable="true" :options="industryList" :props="industryProp" v-model="appForm.classifyIndustryCode" :show-all-levels="false" ref="industry" popper-class="myCascader" style="width:100%"></el-cascader>
            </el-form-item>
            <el-form-item label="中介机构" prop="classifyMediumCode" class="arrArea">
              <el-select v-model="appForm.classifyMediumCode" style="width:100%" @change="checkMe" remote placeholder="请输入关键词" :loading="mediumLoading" ref="medium" :remote-method="getMediumList" filterable>
                <el-option v-for="item in mediumList" :key="item.id" :label="item.supplierName" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="客户经理" prop="classifyManagerEmpId" class="deptArea Manager">
              <el-input class="search" v-model="classifyManagerName" :readonly="true">
                <el-button slot="append" @click='dialogTableVisible=true'>选择</el-button>
              </el-input>
            </el-form-item> -->
            <el-form-item label="上级单位" prop="classifySuperiorCode" class="deptArea">
              <el-select v-model="appForm.classifySuperiorCode" ref="super" style="width:100%" @change="checkMe" remote placeholder="请输入关键词" :loading="superLoading" :remote-method="getSuperList" filterable>
                <el-option v-for="item in superList" :key="item.id" :label="item.supplierName" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="营业执照号码" prop="supplierLicenseNumber" class="arrArea">
              <el-input v-model="appForm.supplierLicenseNumber"></el-input>
            </el-form-item>
            <el-form-item label="信用代码" prop="supplierCreditCode" class="deptArea">
              <el-input v-model="appForm.supplierCreditCode"></el-input>
            </el-form-item>
          </template>
          <h4 class='doc-form_title clearBoth'>账务</h4>
          <el-form label-position="left" :model="appFormAccount" :rules="rules" ref="appForm" label-width="128px" class="clearfix">
          <el-form-item label="信用额度" prop="accountLimit" class="deptArea">
            <el-input v-model="appFormAccount.accountLimit"></el-input>
          </el-form-item>
          <el-form-item label="信用期间" prop="timeline" class="arrArea">
            <el-date-picker v-model="appFormAccount.timeline" type="daterange" style="width:100%">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="开户行" prop="accountBank" class="deptArea" ref="accountBank" :rules="[ { required: isPersonal, message: '请输入开户行' }]">
            <el-input v-model="appFormAccount.accountBank"></el-input>
          </el-form-item>
          <el-form-item label="账户名称" prop="accountName" class="arrArea" ref="accountName" :rules="[ { required: isPersonal, message: '请输入账户名称' }]">
            <el-input v-model="appFormAccount.accountName"></el-input>
          </el-form-item>
          <el-form-item label="银行账户" prop="accountCode" class="deptArea" ref="accountCode" :rules="[ { required: isPersonal, message: '请输入银行账户' }]">
            <el-input v-model="appFormAccount.accountCode"></el-input>
          </el-form-item>
            <el-button @click='addBudget' type="primary" style="width:100px" class="arrArea"><i class="el-icon-plus"></i> 添加</el-button>          
          </el-form>
            <div style="width:750px;margin-bottom:20px;" v-show="!appForm.type||appForm.type.dictCode!=='DOC2602'">
          <el-table :data="accountTable" :stripe="true" highlight-current-row class="appTable" >
          
            <el-table-column property="accountLimit" label="信用额度"></el-table-column>
            <el-table-column property="timeline" label="信用期间" width="200"></el-table-column>
            <el-table-column property="accountBank" label="开户行" width="100"></el-table-column>
            <el-table-column property="accountName" label="账户名称" width="150"></el-table-column>
             <el-table-column property="accountCode" label="银行账户" ></el-table-column>
            <el-table-column label="操作" width="55">
              <template scope="scope">
                <el-button @click.native.prevent="deleteRow(scope.$index)" type="text" size="small" icon="delete">
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
           <template v-if="!isPersonal">
            <h4 class='doc-form_title clearBoth'>联系人</h4>
            <el-form-item label="姓名" prop="contactName" class="deptArea">
              <el-input v-model="appForm.contactName"></el-input>
            </el-form-item>
            <el-form-item label="称谓" prop="contactTitleCode" class="arrArea">
              <el-select v-model="appForm.contactTitleCode" ref="contactTitle" style="width:100%" no-data-text="加载中..." @visible-change="getTitleList">
                <el-option v-for="item in titleList" :key="item.dictCode" :label="item.dictName" :value="item.dictCode">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="岗位" prop="contactJobtitle" class="deptArea">
              <el-input v-model="appForm.contactJobtitle"></el-input>
            </el-form-item>
            <el-form-item label="电子邮件" prop="contactEmail" class="arrArea">
              <el-input v-model="appForm.contactEmail"></el-input>
            </el-form-item>
            <el-form-item label="办公电话" prop="contactOfficePhone" class="deptArea">
              <el-input v-model="appForm.contactOfficePhone"></el-input>
            </el-form-item>
            <el-form-item label="移动电话" prop="contactMobilePhone" class="arrArea">
              <el-input v-model="appForm.contactMobilePhone" :maxlength="11"></el-input>
            </el-form-item>
            <h4 class='doc-form_title clearBoth'>证件信息</h4>
            <template v-if="appForm.classifyCompanyCode!='ADM1208'">
              <el-form-item label="营业执照" prop="supplierLicense">
                <el-upload class="myUpload" :action="baseURL+'/doc/uploadDocFile'" :data="{docTypeCode:'LicenseCard'}" :file-list="licenseList" :on-success="licenseSuccess" :on-remove="licenseRemove" :before-upload="beforeUpload" :on-preview="previewUpload" :on-progress="handleProgress">
                  <el-button size="small" type="primary" :disabled="appForm.supplierLicense!=''||disabledUpload"  v-show="!isIE()||(appForm.supplierLicense==''&&!disabledUpload)">上传执照<i class="el-icon-upload el-icon--right"></i></el-button>
                </el-upload>
              </el-form-item>
              <el-form-item label="开户许可证" prop="accountLicense">
                <el-upload class="myUpload" :action="baseURL+'/doc/uploadDocFile'" :data="{docTypeCode:'AccountPermit'}" :file-list="permitsList" :on-success="permitsSuccess" :on-remove="permitsRemove" :before-upload="beforeUpload" :on-preview="previewUpload" :on-progress="handleProgress">
                  <el-button size="small" type="primary" :disabled="appForm.accountLicense!=''||disabledUpload" v-show="!isIE()||(appForm.accountLicense==''&&!disabledUpload)">上传许可证<i class="el-icon-upload el-icon--right"></i></el-button>
                </el-upload>
              </el-form-item>
            </template>
            <el-form-item label="身份证" prop="contactIdcards" v-else>
              <el-upload class="myUpload" :action="baseURL+'/doc/uploadDocFile'" :data="{docTypeCode:'Idcard'}" :on-success="IdcardSuccess" :file-list="IdcardsList" :on-remove="IdcardRemove" :before-upload="beforeUpload" :on-preview="previewUpload" :on-progress="handleProgress">
                <el-button size="small" type="primary" :disabled="appForm.contactIdcards!=''||disabledUpload" v-show="!isIE()||(appForm.contactIdcards==''&&!disabledUpload)">上传身份证<i class="el-icon-upload el-icon--right"></i></el-button>
              </el-upload>
            </el-form-item>
          </template>
        </el-form>
        <major-dialog :params="appForm.fileSend" @updatePerson="updateFileSend" :visible.sync="fileSendVisible"></major-dialog>
        <div class='doc-form-submit_btn'>
          <el-button type="primary" @click="submitApp">提交</el-button>
        </div>
      </div>
    </el-card>
    <person-dialog @updatePerson="updatePerson" admin="1" :visible.sync="dialogTableVisible"></person-dialog>
  </div>
</template>
<script>
import PersonDialog from '../../components/personDialog.component'
import { mapGetters, mapMutations } from 'vuex'
import MajorDialog from '../../components/majorDialog.component'
import util from '../../common/util'

export default {
  components: { PersonDialog , MajorDialog},
  data() {
    var checkFileSend = (rule, value, callback) => {
      if (value.all.max || value.personList.length != 0 || value.depList != 0) {
        callback();
      } else {
        callback(new Error('请选择发布范围'))
      }
    };
    var checkMedium = (rule, value, callback) => {
      if (value && value == this.appForm.classifySuperiorCode) {
        callback(new Error('中介机构与上级单位不能相同'))
      } else {
        callback();
      }
    };
    var checkSuperior = (rule, value, callback) => {
      if (value && value == this.appForm.classifyMediumCode) {
        callback(new Error('中介机构与上级单位不能相同'))
      } else {
        callback();
      }
    };
    var checkName = (rule, value, callback) => {
      if (value && value != this.oldName) {
        this.$http.post('/Supplier/checkSupplierName', { supplierName: value })
          .then(res => {
            if (res.status == 0) {
              callback();
            } else {
              callback(new Error(res.message))
            }
          })
      } else {
        callback();
      }
    };
    return {
      param:{},
      dialogTableVisible: false,
      fileSendVisible: false,
      appFormAccount:{
        timeline:"",
        accountLimit:"",
        accountBank:"",
        accountName:"",
        accountCode:"",
          
      },
      appForm: {
        fileSend: {
          personList: [],
          all: '',
          depList: []
        },
        supplierBankId:"",
        supplierTypeCode: '',
        supplierName: '',
        supplierAbbreviation: '',
        supplierTelephone: '',
        supplierEmail: '',
        supplierAddress: '',
        supplierZipcode: '',
        supplierCity: '',
        supplierFax: '',
        supplierWebsite: '',
        supplierIntroduction: '',
        classifyStatusCode: '',
        classifyScaleCode: '',
        classifyCompanyCode: '',
        classifyGainCode: '',
        classifyIndustryCode: [],
        classifyMediumCode: '',
        classifySuperiorCode: '',
        classifyManagerEmpId: '',
        // accountLimit: '',
        supplierLicenseNumber: '',
        supplierCreditCode: '',
        // timeline: [],
        // accountBank: '',
        // accountName: '',
        // accountCode: '',
        

        contactName: '',
        contactTitleCode: '',
        contactJobtitle: '',
        contactEmail: '',
        contactOfficePhone: '',
        contactMobilePhone: '',
        supplierLicense: '',
        accountLicense: '',
        contactIdcards: '',
        isOpen: 0,
        
      },
      rules: {
        fileSend: [{ type: 'object', required: true, validator: checkFileSend, trigger: 'blur' }],
        supplierName: [{ required: true, message: '请输入客户名称' }, { validator: checkName, trigger: 'blur' }],
        supplierAbbreviation: [{ required: true, message: '请输入客户简称' }, ],
        supplierAddress: [{ required: true, message: '请输入地址' }, ],
        supplierEmail: [{ type: 'email', required: true, message: '请输入正确的邮箱地址' }, ],
        contactEmail: [{ type: 'email', message: '请输入正确的邮箱地址' }, ],
        supplierWebsite: [{ type: 'url', message: '请输入正确网址' }, ],
        classifyStatusCode: [{ required: true, message: '请选择状态' }, ],
        classifyScaleCode: [{ required: true, message: '请选择规模' }, ],
        supplierTypeCode: [{ required: true, message: '请选择客户类型' }, ],
        classifyCompanyCode: [{ required: true, message: '请选择企业类型' }, ],
        classifyGainCode: [{ required: true, message: '请选择获得途径' }, ],
        classifyIndustryCode: [{ type: 'array', required: true, message: '请选择行业' }, ],
        // supplierLicense: [{ required: true, message: '请上传营业执照' }, ],
        // accountLicense: [{ required: true, message: '请上传开户许可证' }, ],
        // contactIdcards: [{ required: true, message: '请上传身份证' }, ],
        classifyManagerEmpId: [{ required: true, message: '请选择客户经理' }, ],
        contactTitleCode: [{ required: true, message: '请选择称谓' }, ],
        contactName: [{ required: true, message: '请输入姓名' }, ],
        contactJobtitle: [{ required: true, message: '请输入岗位' }, ],
        accountBank: [{ message: '请输入开户行' }, ],
        accountName: [{ message: '请输入账户名称' }, ],
        accountCode: [{ message: '请输入银行账户' }, ],
        classifyMediumCode: [{ validator: checkMedium }],
        classifySuperiorCode: [{ validator: checkSuperior }],
        contactMobilePhone: [{ validator: this.validatePhone }],
      },
      classifyManagerName: '',
      submitLoading: false,
      supplierTypes: [],
      supplierStatus: [],
      supplierScales: [],
      companyTypes: [],
      gains: [],
      industryList: [],
      mediumList: [],
      superList: [],
      titleList: [],
      licenseList: [],
      permitsList: [],
      IdcardsList: [],
      meTimeout: null,
      superTimeout: null,
      mediumLoading: false,
      superLoading: false,
      industryProp: {
        label: 'fullname',
        value: 'id',
        children: 'trades'
      },
      supplierId: '',
      oldName: '',
      isPersonal: false,
      disabledUpload: false,
      accountTable:[],
      sendTypes: [],
      id:"",

    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'roomList',
      'conferenceType',
      'baseURL',
      'isReady'
    ])
  },
  created() {
    this.getSendType();
    if (this.$route.params.id != 'all') {
      this.getTitleList();
      this.getSupplierStatus();
      this.getSupplierScales();
      this.getCompanyTypes();
      this.getGains();
      this.getDetail();
      this.getSupplierTypes();
    } else {
      this.getSendType();
      this.getIndustryList(); //行业      
      this.appForm.classifyManagerEmpId = this.userInfo.empId;
      this.classifyManagerName = this.userInfo.name;
    }
  },
  watch: {
    isReady: function(newVal) {
      if (newVal) {
        this.classifyManagerName = this.userInfo.name;
      }
    }
  },
  methods: {
    closeAll() {
      this.appForm.fileSend.all = '';
    },
    updateFileSend(params) {
      this.appForm.fileSend = params;
    },
    submitMiddle() {

      var that=this;
      this.params = {
        "supplierSendBean": {
          "sendTypeAll": {
            "sendType": this.sendTypes.find(type => type.dictEname == 'all').dictCode, //发布范围i人类型
            "max": this.appForm.fileSend.all.max, //最大
            "min": this.appForm.fileSend.all.min //最小
          },
          "sendTypeDept": [],
          "sendTypeEmp": {
            "sendType": this.sendTypes.find(type => type.dictEname == 'person').dictCode,
            "ids": this.appForm.fileSend.personList.map(person => person.empId),
            "empPostId": this.appForm.fileSend.personList.map(person => person.postId)
          }
        },
      }
      
      this.params.supplierSendBean.sendTypeDept = this.appForm.fileSend.depList.map(function(dep) {
        return {
          sendType: that.sendTypes.find(type => type.dictEname == 'department').dictCode,
          id: dep.id,
          max: dep.max,
          min: dep.min
        }
      });
      this.param=this.params;
    },
    closeDep(index) {
      this.appForm.fileSend.depList.splice(index, 1);
    },
      closePerson(index) {
      this.appForm.fileSend.personList.splice(index, 1);
    },
    addBudget() {
          if((this.appFormAccount.accountLimit!=""||this.appFormAccount.timeline!=""||this.appFormAccount.accountBank!=""||this.appFormAccount.accountName!=""||this.appFormAccount.accountCode!="")){
          if(this.isPersonal==false||(this.isPersonal==true&&this.appFormAccount.accountBank!=""&&this.appFormAccount.accountName!=""&&this.appFormAccount.accountCode!="")){
            var temp = {};
            temp.accountLimit = this.appFormAccount.accountLimit;
            if(this.appFormAccount.timeline[0])
            temp.timeline = util.formatTime(this.appFormAccount.timeline[0].getTime(), 'yyyy-MM-dd')+"/"+util.formatTime(this.appFormAccount.timeline[1].getTime(), 'yyyy-MM-dd');
            temp.sort= this.accountTable.length+1;
            temp.accountBank = this.appFormAccount.accountBank;
            temp.accountName = this.appFormAccount.accountName;
            temp.accountCode = this.appFormAccount.accountCode;
            this.accountTable.push(temp);
            this.appFormAccount.accountLimit="";
            this.appFormAccount.accountBank="";
            this.appFormAccount.accountName="";
            this.appFormAccount.accountCode="";
            this.appFormAccount.timeline=[];
            this.showData = 0;
          }else{
          this.$message.warning('请检查账务未填写字段！')
        }
          
        }else{
          this.$message.warning('请检查账务未填写字段！')
        }
    
    },
    deleteRow(index) {
      this.accountTable.splice(index, 1)
    },
     getSendType() {
      this.$http.post('/api/getDict', { dictCode: 'FIL01' })
        .then(res => {
          if (res.status == '0') {
            this.sendTypes = res.data;
          } else {
            console.log('获取主送类型失败')
          }
        })
    },



    submitApp() {
      var that=this;
      this.$refs.appForm.validate((validate) => {
        if (validate) {
          that.submitMiddle();
          this.submitLoading = true;
          var params = this.clone(this.appForm);
          params.supplierSendBean=that.param.supplierSendBean;
          params.supplierBanks= this.accountTable.map(function(tabel) {
              return {
                sort: tabel.sort,
                "accountBank": tabel.accountBank,  //开户银行
                "accountName": tabel.accountName,  //账号名称
                "accountCode": tabel.accountCode,  //银行账户
                "createUser": tabel.PersonDialogcreateUser,   //创建人
                "accountLimit": tabel.accountLimit,  //信用额度
                "accountFrom": tabel.timeline?tabel.timeline.split("/")[0]:"",  //信用开始时间
                "accountTo": tabel.timeline?tabel.timeline.split("/")[1]:""  //信用结束时间
              }
          }),
          params.supplierBankId = this.supplierBankId;
          params.supplierName = this.appForm.supplierName;
          params.supplierBankAccountName = this.appForm.supplierBankAccountName;
          params.supplierTypeName = this.$refs.supplierType.selectedLabel;
          params.classifyStatusName = this.$refs.supplierStatus.selectedLabel;
          if (!this.isPersonal) {
            params.classifyScaleName = this.$refs.supplierScale.selectedLabel;
            params.classifyCompanyName = this.$refs.supplierCompany.selectedLabel;
            params.classifyGainName = this.$refs.gain.selectedLabel;
            params.classifyIndustryCode = params.classifyIndustryCode[params.classifyIndustryCode.length - 1];
            params.classifyIndustryName = this.$refs.industry.currentLabels[this.$refs.industry.currentLabels.length - 1];
            params.classifyMediumName = this.$refs.medium.selectedLabel;
            params.classifySuperiorName = this.$refs.super.selectedLabel;
          }
          params.classifyManagerName = this.classifyManagerName;
          if (params.timeline) {
            console.log(params.timeline)
            params.accountFrom = +new Date(params.timeline[0]);
            params.accountTo = +new Date(params.timeline[1]);
          }
          params.contactTitleName = this.$refs.contactTitle.selectedLabel;
          params.createUser = this.userInfo.empId;
          // console.log(params)
          delete params.timeline;
          if (this.isPersonal) {
            delete params.supplierAbbreviation;
            delete params.supplierTelephone;
            delete params.supplierEmail;
            delete params.supplierWebsite;
            delete params.supplierFax;
            delete params.classifyScaleCode;
            delete params.classifyCompanyCode;
            delete params.classifyGainCode;
            delete params.classifyIndustryCode;
            delete params.classifyIndustryCode;
            delete params.classifyMediumCode;
            delete params.classifySuperiorCode;
            delete params.supplierLicenseNumber;
            delete params.supplierCreditCode;
            delete params.contactName;
          }
          var postPath = "/Supplier/addSupplier"
          if (this.$route.params.id != 'all') {
            params.id = this.$route.params.id;
            params.updateUser = this.userInfo.empId;
            postPath = "/Supplier/updateSupplier";
          }
          
          var par={
            supplier:{
              supplierTypeCode:params.supplierTypeCode,
              supplierTypeName:params.supplierTypeName,
              supplierName:params.supplierName,
              supplierAbbreviation:params.supplierAbbreviation,
              supplierTelephone:params.supplierTelephone,
              supplierEmail:params.supplierEmail,
              supplierAddress:params.supplierAddress,
              supplierZipcode:params.supplierZipcode,
              supplierCity:params.supplierCity,
              supplierWebsite:params.supplierWebsite,
              supplierIntroduction:params.supplierIntroduction,
              accountBank:params.accountBank,
              classifyStatusCode:params.classifyStatusCode,
              classifyStatusName:params.classifyStatusName,
              classifyScaleCode:params.classifyScaleCode,
              classifyScaleName:params.classifyScaleName,
              classifyCompanyCode:params.classifyCompanyCode,
              classifyCompanyName:params.classifyCompanyName,
              classifyGainCode:params.classifyGainCode,
              classifyGainName:params.classifyGainName,
              classifyIndustryCode:params.classifyIndustryCode,
              classifyIndustryName:params.classifyIndustryName,
              classifyMediumCode:params.classifyMediumCode,
              classifyMediumName:params.classifyMediumName,
              classifySuperiorCode:params.classifySuperiorCode,
              classifySuperiorName:params.classifySuperiorName,
              classifyManagerEmpId:params.classifyManagerEmpId,
              classifyManagerName:params.classifyManagerName,
              accountLimit:params.accountLimit,
              accountFrom:params.accountFrom,
              accountTo:params.accountTo,
              accountBank:params.accountBank,
              accountName:params.accountName,
              accountCode:params.accountCode,
              contactName:params.contactName,
              contactTitleName:params.contactTitleName,
              contactJobtitle:params.contactJobtitle,
              contactEmail:params.contactEmail,
              contactOfficePhone:params.contactOfficePhone,
              contactMobilePhone:params.contactMobilePhone,
              remark:params.remark,
              createTime:params.createTime,
              createUser:params.createUser,
              updateTime:params.updateTime,
              updateUser:params.updateUser,
              sts:params.sts,
              isOpen:params.isOpen,
              supplierNo:params.supplierNo,
              supplierFax:params.supplierFax,
              supplierLicenseNumber:params.supplierLicenseNumber,
              supplierCreditCode:params.supplierCreditCode,
              supplierLicense:params.supplierLicense,
              supplierLicenseFileName:params.supplierLicenseFileName,
              accountLicense:params.accountLicense,
              accountLicenseFileName:params.accountLicenseFileName,
              contactIdcards:params.contactIdcards,
              contactIdcardsFileName:params.contactIdcardsFileName,
              supplierBankId:params.supplierBankId,
              supplierLicensePath:params.supplierLicensePath,
              accountLicensePath:params.accountLicensePath,
              contactIdcardsPath:params.contactIdcardsPath,
              supplierSendBean:params.supplierSendBean,
              contactTitleCode:params.contactTitleCode,
              contactTitleCode:params.contactTitleCode,
              contactTitleCode:params.contactTitleCode,
              id:this.id,
            },
            supplierBanks:params.supplierBanks
          };
          console.log(par)
          this.$http.post(postPath, par, { body: true })
            .then(res => {
              this.submitLoading = false;
              if (res.status == 0) {
                this.$message.success('提交成功！');
                this.$router.push('/supplier/mySupplier')
              } else {
                this.$message.error('提交失败，请重试!')
              }
            })
        } else {
          this.$message.warning('请检查未填写字段！')
        }
      })
    },
    getDetail() {
      this.submitLoading = true;
      this.$http.post('/Supplier/getSupplierInfo', { id: this.$route.params.id })
        .then(res => {
          if (res.status == 0) {
            this.suplierId=res.data.supplier.supplierId;
            this.supplierBankId=res.data.supplier.supplierBankId;
            this.isPersonal = res.data.supplier.supplierTypeCode == 'ADM0111';
            
            this.combineObj(this.appForm, res.data.supplier, ['classifyIndustryCode']);

            this.classifyManagerName = res.data.supplier.classifyManagerName;
            this.appForm.supplierTypeCode=res.data.supplier.supplierTypeCode;
            this.oldName = res.data.supplier.supplierName;
            for(var i=0;i<res.data.supplierBanks.length;i++){
              res.data.supplierBanks[i].timeline=util.formatTime(res.data.supplierBanks[i].accountFrom, 'yyyy-MM-dd')+"/"+util.formatTime(res.data.supplierBanks[i].accountTo, 'yyyy-MM-dd');
              console.log( res.data.supplierBanks[i].timeline)
           }
            this.accountTable = res.data.supplierBanks?res.data.supplierBanks:[];
            if (res.data.supplierBanks.accountFrom) {
              this.appForm.timeline.push(new Date(res.data.supplier.accountFrom));
              this.appForm.timeline.push(new Date(res.data.supplier.accountTo));
            }
            if (res.data.supplier.classifyMediumCode) {
              this.mediumList = [{ id: res.data.supplier.classifyMediumCode, supplierName: res.data.supplier.classifyMediumName }]
            }
            if (res.data.supplier.classifySuperiorCode) {
              this.superList = [{ id: res.data.supplier.classifySuperiorCode, supplierName: res.data.supplier.classifySuperiorName }]
            }
            if (res.data.supplier.accountLicense) {
              this.permitsList.push({ name: res.data.supplier.accountLicenseFileName, url: res.data.supplier.accountLicensePath })
            }
            if (res.data.supplier.supplierLicense) {
              this.licenseList.push({ name: res.data.supplier.supplierLicenseFileName, url: res.data.supplier.supplierLicensePath })
            }
            if (res.data.supplier.contactIdcards) {
              this.IdcardsList.push({ name: res.data.supplier.contactIdcardsFileName, url: res.data.supplier.contactIdcardsPath })
            }

            this.getIndustryList(res.data.supplier.classifyIndustryCode); //行业
            var perlist=[];
            var deplist=[];
            for(var i=0;i<res.data.supplierSendInfoBeans.length;i++){
              if(res.data.supplierSendInfoBeans[i].type=="FIL0101"){
                perlist.push(
                   {
                   name:res.data.supplierSendInfoBeans[i].name,
                   postId:res.data.supplierSendInfoBeans[i].empPostId,
                   empId:res.data.supplierSendInfoBeans[i].sendId,
                   name:res.data.supplierSendInfoBeans[i].name,
                   deptParentName:res.data.supplierSendInfoBeans[i].majorDept,
                   
                }
                )
              }
              if(res.data.supplierSendInfoBeans[i].type=="FIL0102"){
                deplist.push(
                   {
                   name:res.data.supplierSendInfoBeans[i].name,
                   postId:res.data.supplierSendInfoBeans[i].empPostId,
                   empId:res.data.supplierSendInfoBeans[i].sendId,
                   name:res.data.supplierSendInfoBeans[i].name,
                   deptParentName:res.data.supplierSendInfoBeans[i].majorDept,
                   max:100,
                   min:0
                }
                )
              }
              if(res.data.supplierSendInfoBeans[i].type=="FIL0104"){
                this.appForm.fileSend.all={
                  max:100,
                  min:0
                }
              }
            }
            this.appForm.fileSend.personList=perlist;
            this.appForm.fileSend.depList=deplist;

            this.id=res.data.supplier.id;
            // this.submitMiddle();
          } else {

          }
          this.submitLoading = false;
        })
    },
    typeChange(val) {
      if(this.isPersonal = val == 'ADM0111'){
        this.accountTable=[];
      }
      
    },
    licenseSuccess(response, file, fileList) {
      this.appForm.supplierLicense = response.data
    },
    licenseRemove() {
      this.appForm.supplierLicense = '';
    },
    permitsSuccess(response, file, fileList) {
      this.appForm.accountLicense = response.data
    },
    permitsRemove() {
      this.appForm.accountLicense = '';
    },
    IdcardSuccess(response, file, fileList) {
      this.appForm.contactIdcards = response.data
    },
    IdcardRemove() {
      this.appForm.contactIdcards = '';
    },
    beforeUpload(file) {
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
    previewUpload(file) {
      window.open(file.url);
    },
    updatePerson(reciver) {
      this.dialogTableVisible = false;
      this.appForm.classifyManagerEmpId = reciver.empId;
      this.classifyManagerName = reciver.name;
    },
    checkMe() {

    },
    getMediumList(query) {
      if (query !== '') {
        this.mediumLoading = true;
        clearTimeout(this.meTimeout);
        this.meTimeout = setTimeout(() => {
          this.$http.post('/Supplier/getCliassify', { supplierName: query })
            .then(res => {
              this.mediumLoading = false;
              if (res.status == 0) {
                this.mediumList = res.data;
              } else {

              }
            })
        }, 600);
      } else {
        this.mediumList = [];
      }
    },
    getSuperList(query) {
      if (query !== '') {
        clearTimeout(this.superTimeout);
        this.superLoading = true;
        // var that = this;
        this.superTimeout = setTimeout(() => {
          this.$http.post('/Supplier/getCliassify', { supplierName: query })
            .then(res => {
              this.superLoading = false;
              if (res.status == 0) {
                this.superList = res.data;
              } else {

              }
            })
        }, 600);
      } else {
        this.superList = [];
      }
    },
    getSupplierTypes() { //客户类型
      if (this.supplierTypes.length == 0) {
        this.$http.post('/api/getDict', { dictCode: 'ADM01' })
          .then(res => {
            if (res.status == 0) {
              this.supplierTypes = res.data
            } else {

            }
          })
      }
    },
    getTitleList() { //称谓
      if (this.titleList.length == 0) {
        this.$http.post('/api/getDict', { dictCode: 'ADM15' })
          .then(res => {
            if (res.status == 0) {
              this.titleList = res.data
            } else {

            }
          })
      }
    },
    getSupplierStatus() { //状态
      if (this.supplierStatus.length == 0) {
        this.$http.post('/api/getDict', { dictCode: 'ADM02' })
          .then(res => {
            if (res.status == 0) {
              this.supplierStatus = res.data
            } else {

            }
          })
      }
    },
    getSupplierScales() { //规模
      if (this.supplierScales.length == 0) {
        this.$http.post('/api/getDict', { dictCode: 'ADM14' })
          .then(res => {
            if (res.status == 0) {
              this.supplierScales = res.data
            } else {

            }
          })
      }
    },
    getCompanyTypes() { //企业类型
      if (this.companyTypes.length == 0) {
        this.$http.post('/api/getDict', { dictCode: 'ADM12' })
          .then(res => {
            if (res.status == 0) {
              this.companyTypes = res.data
            } else {

            }
          })
      }
    },
    getGains() { //获得途径
      if (this.gains.length == 0) {
        this.$http.post('/api/getDict', { dictCode: 'ADM13' })
          .then(res => {
            if (res.status == 0) {
              this.gains = res.data
            } else {

            }
          })
      }
    },
    getIndustryList(val) { //行业
      this.$http.post('/Supplier/getSupplierTrade')
        .then(res => {
          if (res.status == 0) {
            res.data.forEach((r, index) => {
              r.fullname = r.tradeName;
              r.id = index.toString();
            })
            delete res.data[1].trades
            this.industryList = res.data;
            console.log(this.industryList)
            if (this.$route.params.id != 'all') {
              this.handIndustry(val);
            }
          } else {

          }
        })
    },
    handIndustry(val) {
      var arr = [];
      this.industryList.forEach(item => {
        if(item.trades)
        item.trades.forEach(child => {

          if (child.id == val) {
            arr.push(item.id);
            arr.push(child.id);
            this.appForm.classifyIndustryCode = arr;
            return
          }
        })
      })
    },
    handleProgress(event, file, fileList) {
      this.disabledUpload = true;
      if (event.percent == 100) {
        setTimeout(() => {
          this.disabledUpload = false;
        }, 2000)
      }
    }
  }


}

</script>
<style lang='scss'>
#supplierApp {
  .docBaseBox {
    padding-right: 50px;
    border-bottom: none;
    .el-form-item__error {
      padding-left: 6px;
    }
  }
  .doc-form-submit_btn {
    button {
      margin-left: 128px;
      width: 160px;
      height: 50px;
    }
  }
  .inside {
    .el-radio-button__inner {
      width: 90px;
    }
  }
  .arrArea {
    .el-form-item__label {
      padding-left: 30px;
      &:before {
        left: 20px;
      }
    }
  }
  .el-form-item__label {
    position: relative;
    &:before {
      position: absolute;
      left: 0;
      top: 16px;
    }
  }
  .Manager {
    height:46px;
    .el-form-item__content {
      line-height: 0;
    }
  }
  .myRadio {
    .el-radio-button__inner {
      width: 60px;
      line-height: 45px;
      height: 45px;
      padding: 0;
    }
  }
}

</style>
