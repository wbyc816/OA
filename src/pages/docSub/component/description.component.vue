<template>
  <div class='descriptionBox'>
    <h4 class='doc-form_title'>详情信息</h4>
    <el-form label-position="left" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="128px">
      <el-form-item label="请示内容" prop="des" class="textarea">
        <el-col :span='18'>
          <el-input type="textarea" v-bind:resize='none' v-model="ruleForm.des"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item class='form-box' label="建议路径" prop="path">
        <el-col :span='18' class="suggestPath">
          <img src="../../../assets/images/suggestPath.png" alt="">
        </el-col>
      </el-form-item>
      <el-form-item label="附件">
        <el-col :span='18'>
          <el-upload action="//jsonplaceholder.typicode.com/posts/" class="myUpload">
            <el-button size="small" type="primary">上传文件<i class="el-icon-upload el-icon--right"></i></el-button>
          </el-upload>
        </el-col>
      </el-form-item>
      <el-form-item class='form-box' label="附加公文">
        <el-col :span='18' class="docs">
          <el-input class="search" :readonly="true" :value="doc.quoteDocTitle" v-for="(doc,index) in docs" icon="search">
            <div slot="append">
              <el-button @click='showDialog(index)'>选择</el-button>
              <i class="el-icon-close" v-show="doc.quoteDocTitle"></i>
            </div>
          </el-input>
        </el-col>
        <!-- <el-col :span='1'>
          <el-button class="addButton" @click="addDoc">+</el-button>
        </el-col> -->
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="dialogTableVisible" size="large" class="personDialog">
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
        path: '',
      },
      rules: {
        des: [
          { required: true, message: '请输入请示内容', trigger: 'blur,change' }
        ],
        path: [],
      },
      dialogTableVisible: false,
      docs: [{ quoteDocTitle: '', quoteDocId: '' }],
      activeDoc: ''
    }
  },
  computed: {
    ...mapGetters([
      'extraDocs'
    ])
  },
  components: {

  },
  methods: {
    submitRefdoc: function() {

    },
    handleIconClick(index) {
      console.log(index);
    },
    selectDoc(row) {
      this.docs[this.activeDoc].quoteDocTitle = row.docTitle;
      this.docs[this.activeDoc].quoteDocId = row.id;
      this.dialogTableVisible = false;
    },
    showDialog(index) {
      this.dialogTableVisible = true;
      this.activeDoc = index;
      this.$store.dispatch('selectDoc');
    },
    addDoc() {
      this.docs.push({ title: '', id: '' })
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
          color:$main;
        }
      }
    }
  }
  .addButton {
    font-size: 45px;
    line-height: 48px;
    height: 48px;
    padding: 0;
    width: 48px;
    color: $main;
    border-color: $main;
    border-radius: 5px;
  }
  .personDialog {
    .el-dialog--large {
      width: 800px;
      top: 50%!important;
      transform: translate(-50%, -50%);
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
        font-size: 16px;
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
