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
        <el-col :span="6">
          <el-select v-model="params.docType" placeholder="公文类型">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="item in docType" :label="item.docName" :value="item.docTypeCode"></el-option>
          </el-select>
        </el-col>
        <el-col :span="12">
          <el-input placeholder="公文标题" v-model="params.keyWords"></el-input>
        </el-col>
        <el-col :span="6">
          <el-input placeholder="公文编号" v-model="params.docNo"></el-input>
        </el-col>
        <el-col :span="12">
          <el-date-picker v-model="params.startTime" @change="dateChange" type="date" :editable="false" placeholder="选择呈报日期">
          </el-date-picker>
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
    this.$store.dispatch('getConfident');
    this.$store.dispatch('getUrgency');
    this.$store.dispatch('getDocForm');
  },
  methods: {
    dateChange(val) {
      this.params.startTime = val;
    },
    submitParam() {
      this.$emit('search', this.params)
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

.el-date-editor.el-input {
  width: 100%;
}

</style>
