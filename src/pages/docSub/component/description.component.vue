<template>
  <div class='descriptionBox'>
    <h4 class='doc-form_title'>详情信息</h4>
    <!-- <component v-bind:is="currentView">
      组件在 vm.currentview 变化时改变！
    </component> -->
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
              <i class="el-icon-close" v-show="doc.quoteDocTitle||index>0" @click="clearDoc(index)"></i>
            </div>
          </el-input>
        </el-col>
        <el-col :span='1'>
          <el-button class="addButton" @click="addDoc">+</el-button>
        </el-col>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="dialogTableVisible" size="large" class="personDialog">
      <div class="topSearch clearfix">
        <p class="tips">选择公文<span>请双击公文选择</span></p>
      </div>
      <el-table :data="extraDocs" class="myTable searchRes" @row-dblclick="selectDoc" :height="300" :row-class-name="tableRowClassName">
        <el-table-column prop="docTypeCode" label="公文类型" :formatter="formatterDocType" width="110"></el-table-column>
        <el-table-column prop="docTitle" label="标题" width="310"></el-table-column>
        <el-table-column prop="taskUserName" label="呈报人" width="150"></el-table-column>
        <el-table-column prop="taskTime" label="呈报时间"></el-table-column>
      </el-table>
      <!-- <div class="pageBox" v-show="searchRes.empVoList">
        <el-pagination @current-change="handleCurrentChange" :current-page="depPageNumber" :page-size="10" layout="total, prev, pager, next, jumper" :total="searchRes.totalSize">
        </el-pagination>
      </div> -->
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  data() {
    return {
      msg: 'hello vue',
      none: "none",
      ruleForm: {
        des: '',
      },
      rules: {
        des: [
          { required: true, message: '请输入请示内容', trigger: 'blur,change' }
        ],
        path: [],
      },
      dialogTableVisible: false,
      docs: [{ quoteDocTitle: '', quoteDocId: '' }],
      activeDoc: '',
      attchment: [],
      uploadOver: false,
      fileIds: []
    }
  },
  computed: {
    ...mapGetters([
      'extraDocs',
      'baseURL',
      'docType'
    ])
  },
  components: {

  },
  methods: {
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.attchment.length != 0) {
            this.$refs.myUpload.submit();
          } else {
            this.$emit('submitDes', {
              taskContent: this.ruleForm.des,
              qutoes: this.docs[0].quoteDocId ? this.docs : []
            });
          }
        } else {
          this.$emit('submitDes', false);
          return false;
        }
      });
    },
    clearDoc(index) {
      if (this.docs.length == 1) {
        this.docs.splice(index, 1, { quoteDocTitle: '', quoteDocId: '' });
      } else {
        this.docs.splice(index, 1)
      }
    },
    selectDoc(row) {
      if (!this.docs.find(doc => doc.quoteDocId == row.id)) {
        this.docs[this.activeDoc].quoteDocTitle = row.docTitle;
        this.docs[this.activeDoc].quoteDocId = row.id;
        this.dialogTableVisible = false;
      }

    },
    showDialog(index) {
      this.dialogTableVisible = true;
      this.activeDoc = index;
      this.$store.dispatch('selectDoc');
    },
    addDoc() {
      this.docs.push({ title: '', id: '' })
    },
    handleAvatarSuccess(res, file) {
      // this.updateInfo(res.data);
      this.fileIds.push(res.data);
      if (this.fileIds.length == this.attchment.length) {
        var params = {
          fileId: this.fileIds,
          taskContent: this.ruleForm.des,
          quoteDocTitle: this.docs[0].quoteDocTitle,
          quoteDocId: this.docs[0].quoteDocId
        }
        this.$emit('submitDes', params);
      }
    },
    handleAvatarError(res, file) {
      console.log(5);
      this.$emit('submitDes', false);
      this.$message.error('附件上传失败，请重试');
    },
    handleChange(file, fileList) {
      this.attchment = fileList;
    },
    tableRowClassName(row, index) {
      if (this.docs.find(doc => doc.quoteDocId == row.id)) {
        return 'selDoc';
      }
      return '';
    },
    formatterDocType(row, column, cellValue) {
      if (this.docType.length != 0) {
        return this.docType.find(type => type.docTypeCode == cellValue).docName
      }
    }
  }
}

</script>
<style lang='scss'>
$main:#0460AE;
.descriptionBox {
  .textarea {
    height: 188px;
    margin-bottom: 27px;
    .el-textarea__inner {
      height: 188px;
    }
  }
  .suggestPath {
    line-height: 45px;
    img {
      vertical-align: middle;
    }
  }
  .el-form-item__error {
    padding-left: 6px;
  }
  .docs {
    height: auto!important;
    .search {
      margin-bottom: 10px;
      .el-icon-close {
        cursor: pointer;
        right: 110px;
        position: absolute;
        width: 35px;
        height: 100%;
        top: 0;
        text-align: center;
        color: rgb(191, 202, 217);
        transition: all .3s;
        line-height: 46px;
        &:hover {
          color: $main;
        }
      }
    }
  }

  .personDialog {
    .el-dialog--large {
      width: 800px;
      top: 50%!important;
      transform: translate(-50%, -50%);
      margin-top: 0;
      .el-dialog__header {
        display: none;
      }
      .el-dialog__body {
        padding: 0;
      }
    }
    .topSearch {
      padding: 10px;
      line-height: 47px;
      .tips {
        float: left;
        font-size: 18px;
        span {
          font-size: 14px;
          margin-left: 5px;
        }
      }
    }
    .myTable {
      &:before {
        display: none;
      }
      .selDoc {
        cursor: not-allowed;
        background-color: #eef1f6;
        .cell {
          color: #bfcbd9;
        }
      }
      tr {
        cursor:pointer;
      }
    }
    .pageBox {
      overflow: hidden;
      padding-right: 10px;
      padding-top: 5px;
      padding-bottom: 5px;
      border-bottom: 1px solid #D5DADF;
      .el-pagination {
        float: right;
      }
    }
  } // .personDialogBox {
  // .selInfoBox {
  //   p {
  //     font-size: 16px;
  //     padding-left: 15px;
  //     line-height: 40px;
  //   }
  //   .selInfo {
  //     background-color: #E5E7EF;
  //     line-height: 50px; // line-height
  //     padding-left: 15px;
  //     font-size: 15px;
  //     >span {
  //       color: $main;
  //     }
  //     button {
  //       float: right;
  //       height: 50px;
  //       width: 100px;
  //     }
  //   }
  // }
  // }
}

</style>
