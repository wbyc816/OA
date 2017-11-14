<template>
  <div class="searchOptions">
    <el-card class="borderCard">
      <div slot="header" v-if="title">
        <span>{{title}}</span>
        <!-- <i class="iconfont icon-shuaxin"></i> -->
      </div>
      <el-row :gutter="10">
        <el-col :span="6">
          <el-select v-model="params.docImportType" placeholder="重要程度">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="item in urgency" :label="item.dictName" :value="item.dictCode"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6" v-if="!notype">
          <el-cascader :clearable="true" :options="docTypeOptions" :props="defaultProp" v-model="docTypes" :show-all-levels="false" placeholder="公文类型"></el-cascader>
        </el-col>
        <el-col :span="notype?18:12">
          <el-input placeholder="公文标题" v-model.trim="params.keyWords" @keyup.enter.native="submitParam"  :maxlength="50"></el-input>
        </el-col>
        <el-col :span="6">
          <el-input placeholder="公文编号" v-model="params.docNo" @keyup.enter.native="submitParam" :maxlength="25"></el-input>
        </el-col>
        <el-col :span="hasOverTime?6:12">
          <el-date-picker v-model="params.startTime" @change="dateChange" type="date" :editable="false" placeholder="选择呈报日期">
          </el-date-picker>
        </el-col>
        <el-col :span="6" v-if="hasOverTime">
          <el-select v-model="isOverTime" placeholder="是否超时" clearable>
            <el-option label="全部" value="0"></el-option>
            <el-option label="超时" value="1"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-button class="searchButton" @click="submitParam">搜索</el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    title: {
      type: String
    },
    notype: {
      type: Boolean,
      default: false
    },
    hasOverTime: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      params: {
        "keyWords": "",
        "docImportType": "",
        "docNo": "",
        "docType": "",
        "startTime": "",
      },
      isOverTime: "",
      docTypes: [],
      docTypeOptions: [],
      defaultProp: {
        label: 'dictName',
        value: 'dictCode',
        children: 'childDict'
      }
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'confidentiality',
      'docType',
      'urgency'
    ])
  },
  created() {
    if (this.$route.params.isOverTime) {
      this.isOverTime='1';
    }
    this.$store.dispatch('getConfident');
    this.$store.dispatch('getUrgency');
    this.$store.dispatch('getDocForm');
    if (!this.notype) {
      this.getTypes();
    }
  },
  methods: {
    dateChange(val) {
      this.params.startTime = val;
    },
    submitParam() {
      if (this.docTypes.length != 0) {
        this.params.docType = this.docTypes[this.docTypes.length - 1]
      } else {
        this.params.docType = '';
      }
      if (this.hasOverTime) {
        this.params.isOverTime = this.isOverTime;
      }
      this.$emit('search', this.params)
    },
    getTypes() {
      this.$http.post('/doc/getDocTypeTreeList')
        .then(res => {
          if (res.status == 0) {
            this.docTypeOptions = res.data
          } else {

          }
        })
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
