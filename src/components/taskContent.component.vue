<template>
  <div class="taskContentInput">
    <el-input type="textarea" :value="value" @change="fomat" ref="input" resize="none" :rows="8" :maxlength="maxlength">
    </el-input>
    <div class="tempBox">
      <span class="bgBox"></span>
      <el-dropdown trigger="click" class="dropdownBox" :class="{'active':showBox}" @visible-change="dropdownvisibleChange" @command="handleItemClick" :hide-on-click="false" menu-align="start">
        <span class="el-dropdown-link" @click="showBox=!showBox">
          <!-- <i class="iconfont icon-moban"></i> -->
        常用语
      </span>
        <el-dropdown-menu class="contentItemBox" slot="dropdown">
          <div class="itemWrap">
            <el-dropdown-item v-for="item in contentListAll" :command="item">{{item.templateAlias}}</el-dropdown-item>
            <el-dropdown-item class="emptyText" command="empty" v-if="contentListAll.length==0" disabled>未添加常用语</el-dropdown-item>
          </div>
          <el-dropdown-item class="editButton" divided command="edit"><i class="el-icon-setting"></i>设置</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog :visible.sync="dialogTableVisible" title="常用语列表" size="large" class="contentTableDialog" @open="pageNum=1;getContentList()" @close="getContentAll">
      <p class="buttonBox">
        <el-button type="primary" size="small" icon="plus" @click="dialogContentVisible=true">新增</el-button>
        <el-button type="primary" size="small" @click="dulDelete">删除<i class="el-icon-delete el-icon--right"></i></el-button>
      </p>
      <el-table :data="contentList" class="myTable searchRes" v-loading="searchLoading" @selection-change="handleSelectionChange" ref="dialogTable" empty-text="未添加常用语">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="templateAlias" label="短语" width="170"></el-table-column>
        <el-table-column prop="taskContent" label="内容" class-name="contentColum"></el-table-column>
        <el-table-column label="操作" width="90">
          <template scope="scope">
            <el-button type="text" size="small" icon="edit" @click="editContent(scope.row)"></el-button>
            <el-button type="text" size="small" icon="delete" @click="deleteContent([scope.row.id])"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pageBox">
        <el-pagination @current-change="handleCurrentChange" :current-page="pageNumber" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="totalSize" v-show="contentList.length>0">
        </el-pagination>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogContentVisible" title="编辑常用语" size="large" class="contentEditDialog" @close="clearSel">
      <el-form :model="contentForm" :rules="contentFormRule" ref="contentForm" label-width="80px">
        <el-form-item label="短语" prop="templateAlias">
          <el-input v-model="contentForm.templateAlias" :maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="taskContent">
          <el-input v-model="contentForm.taskContent" type="textarea" resize="none" :rows="8" :maxlength="maxlength"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm" class="submitButton">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    value: '',
    maxlength: { //最大长度，默认10
      type: Number,
      default: 500,
    },

  },
  data() {
    return {
      showBox: false,
      dialogTableVisible: false,
      dialogContentVisible: false,
      contentList: [],
      contentListAll: [],
      searchLoading: false,
      selContents: [],
      totalSize: 0,
      pageNumber: 1,
      pageSize: 5,
      contentForm: {
        templateAlias: '',
        taskContent: ''
      },
      contentFormRule: {
        templateAlias: [{ required: true, message: '请输入短语', trigger: 'blur' }],
        taskContent: [{ required: true, message: '请输入内容', trigger: 'blur' }],
      },
      selContent: ''
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  created() {
    this.getContentAll();
  },
  methods: {
    fomat(val) {
      this.$emit('input', val);
      this.$emit('change', val);
      this.$refs.input.setCurrentValue(val)
    },
    dropdownvisibleChange(val) {
      if (!val) {
        this.showBox = val;
      }
    },
    handleSelectionChange(val) {
      this.selContents = val;
    },
    handleCurrentChange(val) {
      this.pageNumber = val;
      this.getContentList();
    },
    handleItemClick(val) {
      if (val === 'edit') {
        this.dialogTableVisible = true;
      } else {
        if (this.value.length < 500 && val.taskContent) {
          var temp = (this.value + (this.value.length == 0 ? '' : '\n') + val.taskContent).substr(0, 500);
          this.fomat(temp);
        }
      }
    },
    dulDelete() {
      if (this.selContents.length != 0) {
        this.deleteContent(this.selContents.map(c => c.id));
      }
    },
    submitForm() {
      this.$refs.contentForm.validate((valid) => {
        if (valid) {
          var params = {
            empId: this.userInfo.empId,
            taskContent: this.contentForm.taskContent,
            templateAlias: this.contentForm.templateAlias,
            // id: this.selContent ? this.selContent.id : ''
          }
          this.$http.post('/doc/updateTaskTemplte', params, { body: true })
            .then(res => {
              if (res.status == 0) {
                this.dialogContentVisible = false;
                this.pageNumber = 1;
                this.getContentList();
                if (this.selContent) {
                  this.$message.success('保存成功!');
                } else {
                  this.$message.success('新增成功!');
                }
              } else {
                this.$message.error(res.message);
              }
            })
        } else {
          return false;
        }
      });
    },
    clearSel() {
      this.selContent = '';
      this.contentForm.taskContent = '';
      this.contentForm.templateAlias = '';
    },
    getContentList() {
      this.searchLoading = true;
      this.$http.post('/doc/getTaskTemplte', { empId: this.userInfo.empId, pageNumber: this.pageNumber, pageSize: this.pageSize })
        .then(res => {
          this.searchLoading = false;
          if (res.status == 0 && res.data) {
            this.totalSize = res.data.total;
            this.contentList = res.data.records;
          } else {
            this.$message.error(res.message);
          }
        })
    },
    getContentAll() {
      this.pageNumber = 1;
      this.$http.post('/doc/getTaskTemplte', { empId: this.userInfo.empId, pageNumber: 1, pageSize: 9999 })
        .then(res => {
          if (res.status == 0 && res.data) {
            this.contentListAll = res.data.records;
          } else {
            this.$message.error(res.message);
          }
        })
    },
    deleteContent(ids) {
      this.searchLoading = true;
      this.$http.post('/doc/deleteTaskTemplte', { ids: ids }, { body: true })
        .then(res => {
          this.searchLoading = false;
          if (res.status == 0) {
            this.getContentList();
            this.$message.success('删除成功!');
          } else {
            this.$message.error(res.message);
          }
        })
    },
    editContent(content) {
      this.selContent = content;
      this.contentForm.taskContent = content.taskContent;
      this.contentForm.templateAlias = content.templateAlias;
      this.dialogContentVisible = true;
    }
  }
}

</script>
<style lang='scss'>
$main:#0460AE;
$sub:#1465C0;
.taskContentInput {
  position: relative;
  .el-textarea {
    border: 1px solid rgb(191, 202, 217);
    padding-top: 24px;
    .el-textarea__inner {
      border: none;
      padding-top: 3px;
    }
  }

  .tempBox {
    position: absolute;
    right: 0;
    top: 0;
    height: 25px;
    color: $sub;
    cursor: pointer;
    &:before {
      content: '';
      position: absolute;
      right: 0;
      top: 0;
    }
    .bgBox {
      display: inline-block;
      border-left: 25px solid transparent;
      border-top: 25px solid $sub;
    }
    .dropdownBox {
      position: absolute;
      right: 0;
      top: 0;
      width: 65px;
      height: 28px;
      opacity: 1;
      transition: all .3s;
      background: $sub; // padding-left: 10px;
      line-height: 28px;
      color: #fff;
      border-bottom-left-radius: 15px; // opacity: 0;
      &:hover,
      &.active {
        width: 65px;
        height: 28px;
        opacity: 1;
      }
      .el-dropdown-link {
        display: inline-block;
        width: 100%;
        padding-left: 10px;
        i {
          margin-right: 3px;
          font-size: 12px;
        }
      }
    }
  }
  .contentTableDialog {
    .el-dialog {
      width: 900px;
      .el-dialog__header {
        line-height: 1;
      }
      .el-dialog__body {
        padding: 0;
        .myTable {
          min-height: 25px;
          .contentColum {
            .cell {

              overflow: hidden;
              white-space: nowrap;
            }
          }
        }
        .buttonBox {
          padding: 10px 20px;
          text-align: right;
          button {
            border-radius: 3px;
            font-size: 14px;
          }
        }
        .pageBox {
          text-align: right;
          padding: 10px 0;
        }
      }
    }
  }
  .contentEditDialog {
    .el-dialog {
      width: 700px;
      .el-dialog__header {
        line-height: 1;
      }
      .el-dialog__body {
        .el-form-item {
          margin-bottom: 20px;
        }
      }
    }
  }
}

.contentItemBox {
  .itemWrap {
    max-height: 210px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .el-dropdown-menu__item {
    line-height: 25px;
    &.editButton {
      text-align: center;
      color: $main;
      line-height: 18px;
      i {
        margin-right: 5px;
      }
    }
    &.emptyText {
      text-align: center;
      line-height: 38px; // color: rgb(94, 113, 130);
    }
  }
}

</style>
