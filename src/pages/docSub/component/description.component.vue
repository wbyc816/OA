<template>
  <div class='descriptionBox'>
    <h4 class='doc-form_title'>详情信息</h4>
    <slot></slot>
    <el-form label-position="left" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="128px" class="clearBoth">
      <el-form-item :label="options.desTitle||'请示内容'" prop="des" :rules="[{ required: true,validator:checkDes,trigger: 'blur,change' }]">
        <!-- <el-input type="textarea" :rows="16" resize='none' v-model="ruleForm.des" :maxlength="5000"></el-input> -->
        <!-- <div class="tempBox" @click="ruleForm.des=tempText"><span></span>
          <div><i class="iconfont icon-moban"></i>模板</div>
        </div> -->
        <editor @input="desChange" @updateLen="updateLen" :data="ruleForm.des" ref="editor"></editor>
      </el-form-item>
      <el-form-item class='form-box suggestPath' label="建议路径" prop="path">
        <div class="pathBox clearfix" v-html="pathHtml">
        </div>
        <el-button size="small" type="text" @click="pathDialogVisible=true" :disabled="disableEditSuggest"><i class="iconfont icon-edit"></i>编辑</el-button>
      </el-form-item>
      <el-form-item label="附件" prop="attchment">
        <el-upload class="myUpload" :auto-upload="false" :action="baseURL+'/doc/uploadDocFile'" :data="{docTypeCode:$route.params.code}" :multiple="false" :on-success="handleAvatarSuccess" :on-error="handleAvatarError" :on-change="handleChange" :file-list="successUps" :on-remove="handleRemove" ref="myUpload">
          <el-button size="small" type="primary" :disabled="ruleForm.attchment.length>4">上传附件<i class="el-icon-upload el-icon--right"></i></el-button>
        </el-upload>
        <p class="uploadInfo">单个附件不能超过10MB</br>最多上传5个附件</p>
      </el-form-item>
      <el-form-item class='form-box' label="附加公文">
        <el-col :span='21' class="docs" style="left: -6px;position: relative;">
          <transition-group name="el-zoom-in-top" tag="div">
            <el-input class="search" :readonly="true" :value="doc.quoteDocTitle" v-for="(doc,index) in docs" icon="search" :key="doc.quoteDocTitle">
              <div slot="append">
                <el-button @click='showDialog(index)'>选择</el-button>
                <i class="el-icon-close" v-show="doc.quoteDocTitle||index>0" @click="clearDoc(index)"></i>
              </div>
            </el-input>
          </transition-group>
        </el-col>
        <el-col :span='3'>
          <el-button class="addButton" @click="addDoc" :disabled="docs.length>4"><i class="el-icon-plus"></i></el-button>
        </el-col>
        <p class="extraDoc">最多添加5个附加公文</p>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="dialogTableVisible" size="large" class="docDialog">
      <div class="topSearch clearfix">
        <p class="tips">选择公文<span>请双击公文选择</span></p>
      </div>
      <search-options @search="setOptions"></search-options>
      <el-table :data="extraDocs" class="myTable searchRes" @row-dblclick="selectDoc" :height="250" :row-class-name="tableRowClassName" v-loading="searchLoading">
        <el-table-column prop="docNo" label="公文编号" width="200"></el-table-column>
        <el-table-column prop="docTypeName" label="公文类型" width="110"></el-table-column>
        <el-table-column prop="docTitle" label="标题"></el-table-column>
        <el-table-column prop="taskUser" label="呈报人" width="120"></el-table-column>
        <el-table-column prop="taskTime" label="呈报时间" width="175"></el-table-column>
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
import Editor from '../../../components/editor.component'
import { mapGetters, mapMutations } from 'vuex'
const arrowHtml = '<i class="iconfont icon-jiantouyou"></i>'
export default {
  components: {
    SearchOptions,
    PathDialog,
    Editor
  },
  props: {
    options: {
      type: Object
    }
  },
  data() {
    return {
      ruleForm: {
        des: '',
        attchment: [],
        path: []
      },
      rules: {
        path: [{ type: 'array', required: true, message: '请选择建议路径', trigger: 'blur,change' }],
        attchment: []
      },
      dialogTableVisible: false,
      pathDialogVisible: false,
      docs: [{ quoteDocTitle: '', quoteDocId: '' }],
      activeDoc: '',
      uploadOver: false,
      fileIds: [],
      extraDocs: [],
      params: {
        "pageNumber": 1,
        "pageSize": 5
      },
      totalSize: 0,
      searchOptions: '',
      searchLoading: false,
      desLenth: 0,
      successUps: [],
      difLength: 0,
      upCount: 0,
      isSaveForm: false,
      disableEditSuggest: false,
      isfirst: true
    }
  },
  computed: {
    pathHtml: function() {
      var html = '起草' + arrowHtml + ' ';
      if (this.ruleForm.path.length != 0) {
        this.ruleForm.path.forEach((node, index) => {
          if (node.nodeName == 'sign' || node.nodeName == 'trans') {
            if (!node.children || node.children.length == 0) {
              html += node.typeIdName + ' ' + arrowHtml
            } else {
              node.children.forEach((child, childIndex) => {
                if (childIndex == 0) {
                  html += '#' + child.typeIdName + ' ';
                } else if (childIndex == node.children.length - 1) {
                  html += child.typeIdName + '# ' + arrowHtml;
                } else {
                  html += child.typeIdName + ' '
                }
              })
            }
          } else {
            if (index != this.ruleForm.path.length - 1) {
              html += node.typeIdName + arrowHtml
            } else {
              html += node.typeIdName
            }
          }
        })
      }
      html += '归档'
      return html;
    },
    ...mapGetters([
      'baseURL',
      'docType',
      'userInfo',
      'isSubmit',
      'taskUser'
    ])
  },
  created() {
    // this.getSuggestTemp();
    if (this.$route.params.code == 'LZS') {
      this.rules.attchment.push({ type: 'array', required: true, message: '请提交本人签字的辞职报告', trigger: 'blur,change' })
    }
  },
  watch: {
    taskUser: function(newval) {
      if (newval) {
        if (!this.$route.query.id || !this.isfirst) {   //草稿箱第一次不调用建议路径模板
          this.getSuggestTemp();
        }
      }
    }
  },
  methods: {
    initAttchment(list) {
      this.successUps = list;
      this.ruleForm.attchment = this.successUps;
    },
    desChange(html) {
      this.ruleForm.des = html;
    },
    updateLen(num) {
      this.desLenth = num;
      this.$refs.ruleForm.validateField('des')
    },
    checkDes(rule, value, callback) {
      if (this.desLenth == 0) {
        callback(new Error('请输入' + (this.options.desTitle || '请示内容')))
      } else if (this.desLenth > 5000) {
        callback(new Error('超出最大输入长度'))
      } else {
        callback();
      }
    },
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        this.isSaveForm = false;
        if (valid) {
          if (this.checkSuggest()) {
            this.checkAttchment(); //检查是否需要上传
            if (this.difLength != 0) {
              this.$refs.myUpload.submit();
            } else {
              this.$emit('submitEnd', {
                taskContent: this.ruleForm.des,
                qutoes: this.docs[0].quoteDocId ? this.docs : [],
                fileId: this.ruleForm.attchment.map(f => f.response.data),
                suggests: this.handlePath(this.ruleForm.path)
              });
            }
          } else {
            this.$emit('submitEnd', false);
          }
        } else {
          this.$message.warning('请检查填写字段')
          this.$emit('submitEnd', false);
          return false;
        }
      });
    },
    checkAttchment() { //检查是否需要上传
      this.difLength = this.ruleForm.attchment.length;
      this.ruleForm.attchment.forEach(f => {
        if (this.successUps.find(s => s.uid == f.uid)) {
          this.difLength--;
        }
      })
    },
    checkSuggest() {
      var success = true;
      if (!this.disableEditSuggest) {
        this.ruleForm.path.forEach((p, i, arr) => {
          if (p.type == 4 || p.type == 5) { //判断会签不能为空
            if (!p.children || p.children.length == 0) {
              this.$message.warning('建议路径内会签列表不能为空！');
              success = false
            } else if (i == 0) {
              this.$message.warning('建议路径不能以会签开始！');
              success = false
            } else if (i == arr.length - 1) {
              this.$message.warning('建议路径不能以会签结束！');
              success = false
            }
          } else {
            if (p.state && p.state == 1 && p.type != 7) {
              this.$message.warning(p.typeIdName + '需替换！');
              success = false
            }
          }
        })
      }
      return success
    },
    saveForm() {
      this.isSaveForm = true;
      this.checkAttchment(); //检查是否需要上传
      if (this.difLength != 0 && !this.isSubmit) {
        this.$refs.myUpload.submit();
      } else {
        if (this.checkSuggest()) {
          var params = {
            taskContent: this.ruleForm.des, //请示内容
            qutoes: this.docs[0].quoteDocId ? this.docs : [],
            suggests: this.handlePath(this.ruleForm.path),
            files: JSON.stringify(this.ruleForm.attchment)
          }
          this.$emit('saveEnd', params);
        } else {
          this.$emit('saveEnd', false);
        }
      }

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
      this.docs.push({ quoteDocTitle: '', quoteDocId: '' })
    },
    handleAvatarSuccess(res, file, fileList) {
      this.fileIds = fileList;
      this.upCount++;
      if (this.upCount == this.difLength) {
        var params = {
          taskContent: this.ruleForm.des,
          qutoes: this.docs[0].quoteDocId ? this.docs : [],
          suggests: this.handlePath(this.ruleForm.path)
        }
        if (this.isSaveForm) {
          params.files = JSON.stringify(this.fileIds);
          this.$emit('saveEnd', params);
        } else {
          params.fileId = this.fileIds.map(f => f.response.data);
          this.$emit('submitEnd', params);
        }
      }
    },
    handleAvatarError(res, file) {
      this.$emit('submitEnd', false);
      this.$message.error('附件上传失败，请重试');
    },
    handleChange(file, fileList) {
      // const isPDF = file.raw.type === 'application/pdf';
      const isLt10M = file.size / 1024 / 1024 < 10;
      // if (!isPDF) {
      //   this.$message.error('上传附件只能是 PDF 格式!');
      // }
      if (!isLt10M) {
        this.$message.error('上传附件大小不能超过 10MB!');
      }
      if (isLt10M) {
        this.ruleForm.attchment = fileList;
      } else {
        this.$refs.myUpload.uploadFiles.splice(this.$refs.myUpload.uploadFiles.length - 1, 1)
      }
    },
    handleRemove(file, fileList) {
      this.ruleForm.attchment = fileList;
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
          if (item.type == 4) {
            nodeName = 'trans';
          }
          item.children.forEach((child, i) => {
            _list.push({
              nodeId: index + 1 + '-' + i,
              nodeName: nodeName,
              typeId: child.typeId,
              typeIdName: child.typeIdName,
              type: child.type,
              docType: this.$route.params.code
            })
          })
        } else {
          _list.push({
            nodeId: index + 1,
            nodeName: nodeName,
            typeId: item.typeId,
            typeIdName: item.typeIdName,
            type: item.type,
            docType: this.$route.params.code
          })
        }
      })
      return _list
    },
    getSuggestTemp(param) {
      this.$http.post('/doc/suggestTemplate', { docTypeCode: this.$route.params.code, userId: this.taskUser.empId, deptId: this.taskUser.deptParentId, docTypeSubCode: param })
        .then(res => {
          this.isfirst=false;
          if (res.status == 0) {
            this.disableEditSuggest = res.data.isEdit == 0 ? false : true;
            this.handleSuggestTemp(res.data.paths);
          } else {

          }
        })
    },
    handleSuggestTemp(arr) {
      var temp = [];
      var start;
      arr.forEach((s, index) => {
        if (s.type == 4 || s.type == 5) {
          s.nodeName = 'sign';
          s.children = [];
          temp.push(s);
        } else if (s.type == 7) {
          if (start) {
            start = 0;
          } else {
            start = index;
            s.nodeName = 'sign';
            s.children = [];
            temp.push(s);
          }
        } else {
          if (start) {
            temp[start].children.push(s);
          } else {
            temp.push(s);
          }
        }
      })
      this.ruleForm.path = temp;
    },
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
  } // .tempBox {
  //   // background :$sub;
  //   position: absolute;
  //   right: 0;
  //   top: 0;
  //   height: 25px;
  //   color: $sub; // transform:rotate(45deg);
  //   cursor: pointer;
  //   &:before {
  //     content: '';
  //     position: absolute;
  //     right: 0;
  //     top: 0;
  //   }
  //   span {
  //     display: inline-block;
  //     border-left: 25px solid transparent;
  //     border-top: 25px solid $sub;
  //   }
  //   div {
  //     position: absolute;
  //     right: 0;
  //     top: 0;
  //     width: 25px;
  //     height: 25px;
  //     transition: all .3s;
  //     background: $sub;
  //     padding-left: 10px;
  //     line-height: 28px;
  //     color: #fff;
  //     border-bottom-left-radius: 15px;
  //     color: #fff;
  //     opacity: 0;
  //     &:hover {
  //       width: 65px;
  //       height: 28px;
  //       opacity: 1;
  //     }
  //   }
  //   i {
  //     margin-right: 3px;
  //     font-size: 12px;
  //   }
  // }
  .remainNum {
    position: absolute;
    right: -121px;
    bottom: 0;
    color: #9a9a9a;
    font-size: 14px;
    span {
      color: $main;
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
      width: 900px;
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
