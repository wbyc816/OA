<template>
  <div id='supplierApp' class="commonApp" v-loading.fullscreen="submitLoading">
    <el-card>
      <div slot="header" class='doc_title'>
        <span>新建客户</span>
      </div>
      <div class="docBaseBox doc-section">
        <h4 class='doc-form_title'>基本信息</h4>
        <el-form label-position="left" :model="appForm" :rules="rules" ref="appForm" label-width="128px">
          <el-form-item label="客户名称" prop="supplierName" class="deptArea">
            <el-input v-model.trim="appForm.supplierName"></el-input>
          </el-form-item>
          <el-form-item label="客户类型" prop="supplierTypeCode" class="arrArea">
            <el-select v-model="appForm.supplierTypeCode" style="width:100%" no-data-text="加载中..." @visible-change="getSupplierTypes" ref="supplierType">
              <el-option v-for="item in supplierTypes" :key="item.dictCode" :label="item.dictName" :value="item.dictCode">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客户简称" prop="supplierAbbreviation" class="deptArea">
            <el-input v-model="appForm.supplierAbbreviation"></el-input>
          </el-form-item>
          <el-form-item label="城市" prop="supplierCity" class="arrArea">
            <el-input v-model="appForm.supplierCity"></el-input>
          </el-form-item>
          <el-form-item label="地址" prop="supplierAddress" class="clearBoth">
            <el-input v-model="appForm.supplierAddress"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="supplierTelephone" class="deptArea">
            <el-input v-model="appForm.supplierTelephone"></el-input>
          </el-form-item>
          <el-form-item label="电子邮箱" prop="supplierEmail" class="arrArea">
            <el-input v-model="appForm.supplierEmail"></el-input>
          </el-form-item>
          <el-form-item label="网站" prop="supplierWebsite" class="deptArea">
            <el-input v-model="appForm.supplierWebsite"></el-input>
          </el-form-item>
          <el-form-item label="传真" prop="supplierFax" class="arrArea">
            <el-input v-model="appForm.supplierFax"></el-input>
          </el-form-item>
          <el-form-item label="介绍" prop="supplierIntroduction" class="clearBoth">
            <el-input type="textarea" :rows="4" resize="none" v-model="appForm.supplierIntroduction"></el-input>
          </el-form-item>
          <!-- 分类信息 -->
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
          <el-form-item label="客户经理" prop="classifyManagerEmpId" class="deptArea">
            <el-input class="search" v-model="classifyManagerName" :readonly="true">
              <el-button slot="append" @click='dialogTableVisible=true'>选择</el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="上级单位" prop="classifySuperiorCode" class="arrArea">
            <el-select v-model="appForm.classifySuperiorCode" ref="super" style="width:100%" @change="checkMe" remote placeholder="请输入关键词" :loading="superLoading" :remote-method="getSuperList" filterable>
              <el-option v-for="item in superList" :key="item.id" :label="item.supplierName" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="营业执照号码" prop="supplierLicenseNumber" class="deptArea">
            <el-input v-model="appForm.supplierLicenseNumber"></el-input>
          </el-form-item>
          <el-form-item label="信用代码" prop="supplierCreditCode" class="arrArea">
            <el-input v-model="appForm.supplierCreditCode"></el-input>
          </el-form-item>
          <h4 class='doc-form_title clearBoth'>账务</h4>
          <el-form-item label="信用额度" prop="accountLimit" class="deptArea">
            <el-input v-model="appForm.accountLimit"></el-input>
          </el-form-item>
          <el-form-item label="信用期间" prop="timeline" class="arrArea">
            <el-date-picker v-model="appForm.timeline" type="daterange">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="开户行" prop="accountBank" class="deptArea">
            <el-input v-model="appForm.accountBank"></el-input>
          </el-form-item>
          <el-form-item label="账户名称" prop="accountName" class="arrArea">
            <el-input v-model="appForm.accountName"></el-input>
          </el-form-item>
          <el-form-item label="银行账户" prop="accountCode" class="deptArea">
            <el-input v-model="appForm.accountCode"></el-input>
          </el-form-item>
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
              <el-upload class="myUpload" :action="baseURL+'/doc/uploadDocFile'" :data="{docTypeCode:'LicenseCard'}" :on-success="licenseSuccess" :on-remove="licenseRemove" :before-upload="beforeUpload">
                <el-button size="small" type="primary" :disabled="appForm.supplierLicense!=''">上传文件<i class="el-icon-upload el-icon--right"></i></el-button>
              </el-upload>
            </el-form-item>
            <el-form-item label="开户许可证" prop="accountLicense">
              <el-upload class="myUpload" :action="baseURL+'/doc/uploadDocFile'" :data="{docTypeCode:' AccountPermit'}" :on-success="permitsSuccess" :on-remove="permitsRemove" :before-upload="beforeUpload">
                <el-button size="small" type="primary" :disabled="appForm.accountLicense!=''">上传文件<i class="el-icon-upload el-icon--right"></i></el-button>
              </el-upload>
            </el-form-item>
          </template>
          <el-form-item label="身份证" prop="contactIdcards" v-else>
            <el-upload class="myUpload" :action="baseURL+'/doc/uploadDocFile'" :data="{docTypeCode:'Idcard'}" :on-success="IdcardSuccess" :on-remove="IdcardRemove" :before-upload="beforeUpload">
              <el-button size="small" type="primary" :disabled="appForm.contactIdcards!=''">上传文件<i class="el-icon-upload el-icon--right"></i></el-button>
            </el-upload>
          </el-form-item>
        </el-form>
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
export default {
  components: { PersonDialog },
  data() {
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
      if (value) {
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
      dialogTableVisible: false,
      appForm: {
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
        accountLimit: '',
        supplierLicenseNumber: '',
        supplierCreditCode: '',
        timeline: [],
        accountBank: '',
        accountName: '',
        accountCode: '',
        contactName: '',
        contactTitleCode: '',
        contactJobtitle: '',
        contactEmail: '',
        contactOfficePhone: '',
        contactMobilePhone: '',
        supplierLicense: '',
        accountLicense: '',
        contactIdcards: ''
      },
      rules: {
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
        supplierLicense: [{ required: true, message: '请上传营业执照' }, ],
        accountLicense: [{ required: true, message: '请上传开户许可证' }, ],
        contactIdcards: [{ required: true, message: '请上传身份证' }, ],
        classifyManagerEmpId: [{ required: true, message: '请选择客户经理' }, ],
        contactTitleCode: [{ required: true, message: '请选择称谓' }, ],
        contactName: [{ required: true, message: '请输入姓名' }, ],
        contactJobtitle: [{ required: true, message: '请输入岗位' }, ],
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
      meTimeout: null,
      superTimeout: null,
      mediumLoading: false,
      superLoading: false,
      industryProp: {
        label: 'fullname',
        value: 'id',
        children: 'trades'
      }
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
    this.getIndustryList(); //行业
    if (this.$route.params.id != 'all') {
      this.getSupplierTypes();
      this.getTitleList();
      this.getSupplierStatus();
      this.getSupplierScales();
      this.getCompanyTypes();
      this.getGains();
      this.getDetail();
    } else {
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
    submitApp() {
      this.$refs.appForm.validate((validate) => {
        if (validate) {
          this.submitLoading = true;
          var params = this.clone(this.appForm);
          params.supplierTypeName = this.$refs.supplierType.selectedLabel;
          params.classifyStatusName = this.$refs.supplierStatus.selectedLabel;
          params.classifyScaleName = this.$refs.supplierScale.selectedLabel;
          params.classifyCompanyName = this.$refs.supplierCompany.selectedLabel;
          params.classifyGainName = this.$refs.gain.selectedLabel;
          params.classifyIndustryCode = params.classifyIndustryCode[params.classifyIndustryCode.length - 1];
          params.classifyIndustryName = this.$refs.industry.currentLabels[this.$refs.industry.currentLabels.length - 1];
          params.classifyMediumName = this.$refs.medium.selectedLabel;
          params.classifySuperiorName = this.$refs.super.selectedLabel;
          params.classifyManagerName = this.classifyManagerName;
          if (params.timeline.length > 0) {
            params.accountFrom = +new Date(params.timeline[0]);
            params.accountTo = +new Date(params.timeline[1]);
          }
          params.contactTitleName = this.$refs.contactTitle.selectedLabel;
          params.createUser = this.userInfo.empId;
          delete params.timeline;
          this.$http.post('/Supplier/addSupplier', params, { body: true })
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
    getDetail(){
      this.$http.post('/Supplier/getSupplierInfo',{id:this.$route.params.id})
      .then(res=>{
        if(res.status==0){
          this.combineObj(this.appForm,res.data);
          this.classifyManagerName=res.data.classifyManagerName;
        }else{

        }
      })
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
        this.$message.error('上传文件大小不能超过 2MB!');
      }
      return isJPG && isLt10M;
    },
    updatePerson(reciver) {
      this.dialogTableVisible = false;
      this.appForm.classifyManagerEmpId = reciver.reciUserId;
      this.classifyManagerName = reciver.reciUserName;
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
    getIndustryList() { //行业
      this.$http.post('/Supplier/getSupplierTrade')
        .then(res => {
          if (res.status == 0) {
            res.data.forEach((r, index) => {
              r.fullname = r.tradeName;
              r.id = index.toString();
            })
            this.industryList = res.data;
          } else {

          }
        })
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
}

</style>
