<template>
  <div class='descriptionBox'>
    <h4 class='doc-form_title'>详情信息</h4>
    <slot></slot>
    <el-form label-position="left" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="128px" class="clearBoth">
      <el-form-item label="请示内容" prop="des">
        <el-input type="textarea" :rows="16" resize='none' v-model="ruleForm.des"></el-input>
        <div class="tempBox"><span></span>
          <div><i class="iconfont icon-moban"></i>模板</div>
        </div>
      </el-form-item>
      <el-form-item class='form-box suggestPath' label="建议路径" prop="path">
        <div class="pathBox clearfix" v-html="pathHtml">
          <!-- <template v-for="(node,index) in ruleForm.path">
            <div class="nodeBox">
              <span v-if="node.nodeName=='sign'" class="signList">
                #<span v-for="child in node.children">{{child.typeIdName}}</span>#
              </span>
              <span v-else>{{node.typeIdName}}</span>
            </div>
            <i class="iconfont icon-jiantouyou"></i>
          </template> -->
        </div>
        <el-button size="small" type="text" @click="pathDialogVisible=true"><i class="iconfont icon-edit"></i>编辑</el-button>
      </el-form-item>
      <el-form-item label="附件">
        <el-upload class="myUpload" :auto-upload="false" :action="baseURL+'/doc/uploadDocFile'" :data="{docTypeCode:'DOC_ADM_APPROVAL'}" :on-success="handleAvatarSuccess" :on-error="handleAvatarError" :on-change="handleChange" ref="myUpload">
          <el-button size="small" type="primary">上传文件<i class="el-icon-upload el-icon--right"></i></el-button>
        </el-upload>
      </el-form-item>
      <el-form-item class='form-box' label="附加公文">
        <el-col :span='21' class="docs" style="left: -6px;position: relative;">
          <el-input class="search" :readonly="true" :value="doc.quoteDocTitle" v-for="(doc,index) in docs" icon="search" :key="doc.quoteDocTitle">
            <div slot="append">
              <el-button @click='showDialog(index)'>选择</el-button>
              <i class="el-icon-close" v-show="doc.quoteDocTitle||index>0" @click="clearDoc(index)"></i>
            </div>
          </el-input>
        </el-col>
        <el-col :span='3'>
          <el-button class="addButton" @click="addDoc"><i class="el-icon-plus"></i></el-button>
        </el-col>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="dialogTableVisible" size="large" class="docDialog">
      <div class="topSearch clearfix">
        <p class="tips">选择公文<span>请双击公文选择</span></p>
      </div>
      <search-options @search="setOptions"></search-options>
      <el-table :data="extraDocs" class="myTable searchRes" @row-dblclick="selectDoc" :height="250" :row-class-name="tableRowClassName" v-loading="searchLoading">
        <el-table-column prop="docTypeCode" label="公文类型" width="110"></el-table-column>
        <el-table-column prop="docTitle" label="标题" width="310"></el-table-column>
        <el-table-column prop="taskUser" label="呈报人" width="150"></el-table-column>
        <el-table-column prop="taskTime" label="呈报时间"></el-table-column>
      </el-table>
      <div class="pageBox" v-show="extraDocs.length>0">
        <el-pagination @current-change="handleCurrentChange" :current-page="params.pageNumber" :page-size="5" layout="total, prev, pager, next, jumper" :total="totalSize">
        </el-pagination>
      </div>
    </el-dialog>
    <path-dialog @updatePath="updatePath" :visible.sync="pathDialogVisible" :paths="ruleForm.path"></path-dialog>
  </div>
</template>
<script>
import SearchOptions from '../../../components/searchOptions.component'
import PathDialog from '../../../components/pathDialog.component'
import { mapGetters, mapMutations } from 'vuex'
const arrowHtml = '<i class="iconfont icon-jiantouyou"></i>'
export default {
  props: {
    options: {
      type: Object
    }
  },
  data() {
    return {
      ruleForm: {
        des: '',
        path: []
      },
      rules: {
        des: [
          { required: true, message: '请输入请示内容', trigger: 'blur,change' }
        ],
        path: [{ type: 'array', required: true, message: '请选择建议路径', trigger: 'blur,change' }],
      },
      dialogTableVisible: false,
      pathDialogVisible: false,
      docs: [{ quoteDocTitle: '', quoteDocId: '' }],
      activeDoc: '',
      attchment: [],
      uploadOver: false,
      fileIds: [],
      extraDocs: [],
      params: {
        "pageNumber": 1,
        "pageSize": 5
      },
      totalSize: 0,
      searchOptions: '',
      searchLoading: false
    }
  },
  computed: {
    pathHtml: function() {
      var html = '';
      if (this.ruleForm.path.length != 0) {
        this.ruleForm.path.forEach((node, index) => {
          if (node.nodeName == 'sign') {
            node.children.forEach((child,childIndex)=>{
              if(childIndex==0){
                html +='#'+child.typeIdName+' ';
              }else if(childIndex==node.children.length-1){
                html+=child.typeIdName+'# '+arrowHtml;
              }else{
                html+=child.typeIdName+' '
              }
            })
          } else {
            if (index != this.ruleForm.path.length - 1) {
              html += node.typeIdName + arrowHtml
            } else {
              html += node.typeIdName
            }
          }
        })
      }
      return html;
    },
    ...mapGetters([
      'baseURL',
      'docType',
      'userInfo'

    ])
  },
  components: {
    SearchOptions,
    PathDialog
  },
  methods: {
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.attchment.length != 0) {
            this.$refs.myUpload.submit();
          } else {
            this.$emit('submitEnd', {
              taskContent: this.ruleForm.des,
              qutoes: this.docs[0].quoteDocId ? this.docs : [],
              fileId: [],
              suggests: this.handlePath(this.ruleForm.path)
            });
          }
        } else {
          this.$message.warning('请检查填写字段')
          this.$emit('submitEnd', false);
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
      // this.$store.dispatch('selectDoc');
      this.params.pageNumber = 1;
      this.getData();
    },
    addDoc() {
      this.docs.push({ title: '', id: '' })
    },
    handleAvatarSuccess(res, file) {
      this.fileIds.push(res.data);
      if (this.fileIds.length == this.attchment.length) {
        var params = {
          fileId: this.fileIds,
          taskContent: this.ruleForm.des,
          qutoes: this.docs[0].quoteDocId ? this.docs : [],
          suggests: this.handlePath(this.ruleForm.path)
        }
        this.$emit('submitEnd', params);
      }
    },
    handleAvatarError(res, file) {
      console.log(5);
      this.$emit('submitEnd', false);
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
    },
    setOptions(options) {
      this.searchOptions = options;
      this.params.pageNumber = 1;
      this.getData();
    },
    handleCurrentChange(page) {
      this.params.pageNumber = page;
      this.getData()
    },
    getData() {
      var that = this;
      this.searchLoading = true;
      var params = Object.assign({ userId: this.userInfo.empId }, this.params, this.searchOptions);
      this.$http.post("/doc/selectDocList", params, { body: true }).then(res => {
        setTimeout(function() {
          that.searchLoading = false;
        }, 200)
        if (res.status == 0) {
          this.extraDocs = res.data.dList;
          this.totalSize = res.data.totalSize;
        } else {
          this.extraDocs = [];
          this.totalSize = 0;
        }
      }, res => {

      })
    },
    updatePath(list) {
      console.log(list)
      this.ruleForm.path = this.clone(list);
      this.pathDialogVisible = false;
    },
    handlePath(list) {
      var _list = [];
      list.forEach((item, index, arr) => {
        var nodeName = '';
        if (index == 0) {
          nodeName = 'start';
        } else if (index == arr.length - 1) {
          nodeName = 'end';
        } else {
          nodeName = 'task';
        }
        if (item.nodeName == 'sign') {
          nodeName = 'sign';
          item.children.forEach((child, i) => {
            _list.push({
              nodeId: index + 1 + '-' + i,
              nodeName: nodeName,
              typeId: child.typeId,
              typeIdName: child.typeIdName,
              type: child.type,
              docType: this.options.docType
            })
          })
        } else {

          _list.push({
            nodeId: index + 1,
            nodeName: nodeName,
            typeId: item.typeId,
            typeIdName: item.typeIdName,
            type: item.type,
            docType: this.options.docType
          })
        }
      })
      console.log(_list)
      return _list
    }
  }
}

</script>
<style lang='scss'>
$main:#0460AE;
$sub:#1465C0;
.descriptionBox {
  padding-right: 150px;
  .addButton {
    float: right;
    position: relative;
    right: -5px;
  }
  .textarea {
    height: 188px;
    margin-bottom: 27px;
    .el-textarea__inner {
      height: 188px;
    }
  }
  .pageBox {
    text-align: right;
    margin-top: 20px;
  }
  .suggestPath {
    .pathBox {
      width: 88%;
      float: left;
      line-height: 20px;
      padding-top: 12px;
      .nodeBox {
        float: left;
        padding-right: 10px;
        .signList {
          color: #main;
          span {
            padding-right: 5px;
            &:last-of-type {
              padding-right: 0;
            }
          }
        }
      }
      i {
        padding-right: 10px;
        color: $main;
      }
    }
    .el-button {
      width: 12%;
      float: right;
      border-left: 1px solid #95989A;
      line-height: 30px;
      padding: 0;
      font-size: 15px;
      margin-top: 7px;
      text-align: right;
      i {
        margin-right: 5px;
      }
    }
  }
  .tempBox {
    // background :$sub;
    position: absolute;
    right: 0;
    top: 0;
    height: 25px;
    color: $sub; // transform:rotate(45deg);
    cursor: pointer;
    &:before {
      content: '';
      position: absolute;
      right: 0;
      top: 0;
    }
    span {
      display: inline-block;
      border-left: 25px solid transparent;
      border-top: 25px solid $sub;
    }
    div {
      position: absolute;
      right: 0;
      top: 0;
      width: 25px;
      height: 25px;
      transition: all .3s;
      background: $sub;
      padding-left: 10px;
      line-height: 28px;
      color: #fff;
      border-bottom-left-radius: 15px;
      color: #fff;
      opacity: 0;
      &:hover {
        width: 65px;
        height: 28px;
        opacity: 1;
      }
    }
    i {
      margin-right: 3px;
      font-size: 12px;
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

  .docDialog {
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
    .searchOptions {
      .el-card {
        box-shadow: none;
        padding-bottom: 0;
        margin-bottom: 0;
      }
      .el-card__body .el-col {
        margin-bottom: 13px;
        margin-top: 0;
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
        cursor: pointer;
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
