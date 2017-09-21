<template>
  <div class='descriptionBox'>
    <el-form label-position="left" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="128px">
      <el-form-item label="请示内容" prop="des">
        <el-col :span='18'>
          <el-input type="textarea" :rows="8" resize='none' v-model="ruleForm.des"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item class='form-box' label="建议路径" prop="path">
        <el-col :span='18' class="suggestPath">
          <img src="../../../assets/images/suggestPath.png" alt="">
        </el-col>
      </el-form-item>
      <el-form-item label="附件">
        <el-col :span='18'>
          <el-upload class="myUpload" :auto-upload="false" :action="baseURL+'/doc/uploadDocFile'" :data="{docTypeCode:'DOC_ADM_APPROVAL'}" :on-success="handleAvatarSuccess" :on-error="handleAvatarError" :on-change="handleChange" ref="myUpload">
            <el-button size="small" type="primary">上传文件<i class="el-icon-upload el-icon--right"></i></el-button>
          </el-upload>
        </el-col>
      </el-form-item>
      <el-form-item class='form-box' label="附加公文">
        <el-col :span='18' class="docs">
          <el-input class="search" :readonly="true" :value="doc.quoteDocTitle" v-for="(doc,index) in docs" icon="search" :key="doc.quoteDocTitle">
            <div slot="append">
              <el-button @click='showDialog(index)'>选择</el-button>
              <i class="el-icon-close" v-show="doc.quoteDocTitle" @click="clearDoc(index)"></i>
            </div>
          </el-input>
        </el-col>
        <!-- <el-col :span='1'>
          <el-button class="addButton" @click="addDoc">+</el-button>
        </el-col> -->
      </el-form-item>
    </el-form>
    <!-- <el-dialog :visible.sync="dialogTableVisible" size="large" class="personDialog">
      <div class="topSearch clearfix">
        <p class="tips">选择公文<span>请双击公文选择</span></p>
      </div>
      <el-table :data="extraDocs" class="myTable searchRes" @row-dblclick="selectDoc" :height="300">
        <el-table-column prop="docDenseType" label="密级程度" width="110"></el-table-column>
        <el-table-column prop="docImportType" label="重要程度" width="110"></el-table-column>
        <el-table-column prop="docTypeCode" label="公文类型" width="150"></el-table-column>
        <el-table-column prop="docTitle" label="标题"></el-table-column>
        <el-table-column prop="taskDeptId" label="呈报时间"></el-table-column>
        <el-table-column prop="taskUserName" label="呈报人"></el-table-column>
      </el-table>
    </el-dialog> -->
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  data() {
    return {
     
    }
  },
  computed: {
    ...mapGetters([
      'extraDocs',
      'baseURL'
    ])
  },
  components: {
    
  },
  methods: {
    
  }
}

</script>
<style lang='scss'>
$main:#0460AE;


</style>
