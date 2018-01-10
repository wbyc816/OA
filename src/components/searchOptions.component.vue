<!-- 公文列表查询条件 -->
<template>
  <div class="searchOptions">
    <el-card class="borderCard">
      <div slot="header" v-if="title">
        <span>{{title}}</span>
        <span class="detailButton" @click="showDetail=!showDetail" v-if="isCollapse">{{!showDetail?'高级搜索':'收起'}}</span>
      </div>
      <el-collapse-transition>
        <div v-show="showDetail">
          <el-row :gutter="10">
            <el-col :span="6">
              <el-select v-model="params.docImportType" placeholder="重要程度" clearable>
                <el-option v-for="item in urgency" :label="item.dictName" :value="item.dictCode"></el-option>
              </el-select>
            </el-col>
            <el-col :span="6" v-if="!notype">
              <el-cascader :clearable="true" :options="typeTree" :props="defaultProp" v-model="docTypes" :show-all-levels="false" placeholder="公文类型" @change="docTypeChange"></el-cascader>
            </el-col>
            <el-col :span="6" v-if="!noPerson">
              <el-select v-model="params.taskUserId" filterable clearable remote placeholder="呈报人" :remote-method="remoteMethod" :loading="loading" style="width:100%">
                <el-option v-for="item in personList" :key="item.empId" :label="item.name" :value="item.empId">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="titleWidth">
              <el-input placeholder="公文标题" v-model.trim="params.keyWords" @keyup.enter.native="submitParam" :maxlength="50"></el-input>
            </el-col>
            <el-col :span="6">
              <el-input placeholder="公文编号" v-model="params.docNo" @keyup.enter.native="submitParam" :maxlength="25"></el-input>
            </el-col>
            <el-col :span="(hasOverTime||isPayStatus||hasArchive)?6:12">
              <el-date-picker v-model="params.startTime" @change="dateChange" type="date" :editable="false" placeholder="选择呈报日期">
              </el-date-picker>
            </el-col>
            <el-col :span="6" v-if="hasOverTime">
              <el-select v-model="isOverTime" placeholder="是否超时" clearable>
                <el-option label="全部" value="0"></el-option>
                <el-option label="超时" value="1"></el-option>
              </el-select>
            </el-col>
            <el-col :span="6" v-if="isPayStatus">
              <el-select v-model="isPay" placeholder="是否付款" clearable>
                <el-option label="已付款" value="1"></el-option>
                <el-option label="未付款" value="0"></el-option>
              </el-select>
            </el-col>
            <el-col :span="6" v-if="hasArchive">
              <el-select v-model="isArchive" placeholder="归档是否通过" clearable>
                <el-option label="归档通过" value="3"></el-option>
                <el-option label="归档不通过" value="4"></el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-button class="searchButton" @click="submitParam">搜索</el-button>
            </el-col>
            <el-collapse-transition>
              <el-col :span="8" v-if="hasSub" v-show="docCode&&Array.isArray(subCodeList[docCode])">
                <el-select v-model="subCode" placeholder="公文子类型" clearable v-if="Array.isArray(subCodeList[docCode])">
                  <el-option v-for="item in subCodeList[docCode]" :label="item.dictName" :value="item.dictCode"></el-option>
                </el-select>
              </el-col>
            </el-collapse-transition>
          </el-row>
        </div>
      </el-collapse-transition>
    </el-card>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
const payDoc = ['FKS', 'BXS', 'YFK', 'CLB']
export default {
  props: {
    title: {
      type: String
    },
    notype: { //是否显示公文类型
      type: Boolean,
      default: false
    },
    noPerson: { //是否显示呈报人
      type: Boolean,
      default: false
    },
    hasOverTime: { //是否显示超时
      type: Boolean,
      default: false
    },
    payStatus: {
      type: Boolean,
      default: false
    },
    hasArchive: {
      type: Boolean,
      default: false
    },
    isCollapse: {
      type: Boolean,
      default: false
    },
    hasSub: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      params: {
        "keyWords": "",
        "docImportType": "",
        "docNo": "",
        "docType": "",
        "startTime": "",
        "taskUserId": ""
      },
      isOverTime: "",
      isPay: "",
      isArchive: "",
      docTypes: [],
      defaultProp: {
        label: 'dictName',
        value: 'dictCode',
        children: 'childDict'
      },
      loading: false,
      meTimeout: null,
      personList: [],
      showDetail: false,
      subCodeList: {},
      subCode: ''
    }
  },
  computed: {
    isPayStatus: function() {
      if (this.docTypes.length != 0) {
        var docCode = this.docTypes[this.docTypes.length - 1];
        // return payDoc.find(p=>p==docCode)!=undefined&&this.payStatus
        return false
      } else {
        return false
      }
    },
    docCode: function() {
      var code = '';
      if (this.docTypes.length != 0) {
        code = this.docTypes[this.docTypes.length - 1];
      }
      return code
    },
    titleWidth: function() {
      var width = 6;
      if (this.notype) {
        width += 6;
      }
      if (this.noPerson) {
        width += 6;
      }
      return width
    },
    ...mapGetters([
      'userInfo',
      'confidentiality',
      'docType',
      'urgency',
      'typeTree'
    ])
  },
  created() {
    if (!this.isCollapse) {
      this.showDetail = true;
    }
    if (this.$route.params.isOverTime) {
      this.isOverTime = '1';
    }
    this.$store.dispatch('getConfident');
    this.$store.dispatch('getUrgency');
    this.$store.dispatch('getDocForm');
    if (!this.notype) {
      this.$store.dispatch('getDocTree');
    }
  },
  methods: {
    dateChange(val) {
      this.params.startTime = val;
    },
    submitParam() {
      if (this.docTypes.length != 0) {
        this.params.docType = this.docTypes[this.docTypes.length - 1];
        if(this.subCode){
          this.params.docType=this.subCode;
        }
      } else {
        this.params.docType = '';
      }
      if (this.hasOverTime) {
        this.params.isOverTime = this.isOverTime;
      }
      if (this.isPayStatus) {
        this.params.isPay = this.isPay;
      }
      if (this.hasArchive) {
        this.params.isAgree = this.isArchive;
      }
      this.$emit('search', this.params)
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        clearTimeout(this.meTimeout);
        this.meTimeout = setTimeout(() => {
          this.$http.post('/emp/queryEmpDeptList', { name: query, pageNumber: 1, pageSize: 50 })
            .then(res => {
              this.loading = false;
              if (res.status == 0) {
                this.personList = res.empVoList;
              } else {

              }
            })
        }, 300);
      } else {
        this.personList = [];
      }
    },
    getSubCode() {
      if (this.docTypes.length != 0) {
        var docCode = this.docTypes[this.docTypes.length - 1];
        if (!this.subCodeList[docCode]) {
          this.$http.post('/doc/getDocSubCode', { docTypeCode: docCode })
            .then(res => {
              if (res.status == 0) {
                this.$set(this.subCodeList, docCode, res.data);
              } else {
                this.$set(this.subCodeList, docCode, 'none');
              }
            })
        }
      }
    },
    docTypeChange() {
      if (this.hasSub) {
        this.subCode = '';
        this.getSubCode();
      }
    }
  }
}

</script>
<style lang='scss'>
$main:#0460AE;
$sub:#1465C0;
.searchOptions {
  .el-card {
    padding-bottom: 10px;
    .detailButton {
      float: right;
      color: $main;
      cursor: pointer;
    }
  }
  .el-card__body {
    .el-col {
      margin-top: 13px;
    }
    .el-select {
      width: 100%;
    }
  }
}

.el-cascader__label {
  line-height: 46px;
}

.el-date-editor.el-input {
  width: 100%;
}

</style>
