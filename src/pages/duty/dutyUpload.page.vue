<template>
  <div id="dutyUpload">
    <el-card>
      <div slot="header">
        <el-row>
          <el-col :span="4">
            上传值班信息
          </el-col>
        </el-row>
      </div>
      <div class="rlt">
        <el-upload ref="upload" :multiple="false" :on-success="uploadSuccess" :on-error="uploadError" :action="baseURL+'/onduty/excelInsert'" :file-list="fileList" :auto-upload="false" :on-change="handleChange" :on-remove="handleRemove">
          <span class="accessory">附件</span>
          <span class="underline"></span>
          <el-button slot="trigger" size="large"  :disabled="noMore">选择文件 <i class="iconfont icon-jiantou"></i></el-button>
          <el-button type="primary" size="large" class="uploadbtn" @click="submitUpload">上传</el-button>
        </el-upload>
      </div>
    </el-card>
    <el-card>
      <div slot="header">
        <el-row :gutter="30">
          <el-col class="titleLeft" :span="5">
            <span>值班信息上传结果</span>
          </el-col>
          <!-- <el-col :offset="12" :span="2" class="titleRight">
            <el-button icon="edit" size="large" @click="edit">编辑</el-button>
          </el-col> -->
          <el-col :offset="15" :span="2" class="titleRight">
            <el-button type="primary" size="large" @click="saveAndSubmit" class="save">提交并发布</el-button>
          </el-col>
        </el-row>
      </div>
      <el-table :data="tableData" stripe highlight-current-row style="width: 100%">
        <el-table-column label="序号" type="index" width="60">
        </el-table-column>
        <el-table-column property="dutyDate" sortable label="日期" width="120">
        </el-table-column>
        <el-table-column property="deptName" label="部门" width="120">
        </el-table-column>
        <el-table-column property="empName" label="值班人">
        </el-table-column>
        <el-table-column property="mobileNumber" label="手机">
        </el-table-column>
        <el-table-column property="phoneNumber" label="电话">
        </el-table-column>
        <el-table-column v-if="editAble" fixed="right">
          <template scope="scope">
            <el-button @click.native.prevent="deleteRow(scope.$index)" type="text" size="small">
              移除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import util from '../../common/util'
import api from '../../fetch/api'
import dataTransform from '../../common/dataTransform'
import { fmts } from '../../common/dutyConfig'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      fileList: [],
      tableData: [],
      originData: [],
      currentRow: null,
      paginate: {
        pageSizes: [5, 10, 12, 36],
        currentSize: 5,
        currentPage: 1,
        layout: "total, sizes, prev, pager, next, jumper",
        total: 4
      },
      editAble: false,
      noMore: false
    };
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'baseURL'
    ])
  },
  methods: {
    submitUpload() {
      this.$refs.upload.submit();
    },
    edit() {
      this.editAble = !this.editAble
    },
    handleRemove(){
      this.noMore = false;
    },
    handleChange(file, fileList) {
      const isEXCEL = file.raw.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.raw.type === "application/vnd.ms-excel";
      const isLt15M = file.size / 1024 / 1024 < 15;
      if (!isEXCEL) {
        this.$message.error('上传文件只能是 EXCEL 格式!');
        this.$refs.upload.clearFiles();
      }
      if (!isLt15M) {
        this.$refs.upload.clearFiles();
        this.$message.error('上传文件大小不能超过 15MB!');
      }
      if (isEXCEL && isLt15M) {
        this.noMore = true;
      }

    },
    uploadSuccess(data) {
      console.log(this.fileList);
      if (data.status == '0') {
        if (data.data.ondutylist.length != 0) {
          this.originData = data.data.ondutylist
          this.tableData = dataTransform(this.originData, fmts)

          this.$message.success('上传成功')
        } else {
          this.$refs.upload.clearFiles();
          this.$message.error('上传失败,请检查上传文件')
        }
      } else {
        this.$message.error('上传失败')
      }
    },
    uploadError(data) {
      this.$message.error('上传失败')
    },
    saveAndSubmit() {
      console.log(this.originData)
      if (this.originData.length != 0) {
        this.$http.post('/onduty/addOrUpdateDutyInfo', { ondutylist: this.originData, userId: this.userInfo.empId }, { body: true }).then((data) => {
          if (data.status == '0') {
            this.$message({
              message: '提交成功',
              type: 'success',
            })
            this.$router.push('/duty/dutyDetail');
          } else {
            this.$message.error('提交失败')
          }
        })
      }
    },
    deleteRow(row) {
      this.tableData.splice(row, 1)
      this.originData.splice(row, 1)
    }
  }
}

</script>
<style scope lang="scss">
#dutyUpload {
  .el-card {
    padding: 0 20px;
    .el-card__header {
      padding-left: 0;
      padding-right: 0;
      .titleLeft {
        padding-top: 7px;
        font-size: 17px;
      }
      .titleRight {
        .el-button {
          font-size: 14px;
          border-radius: 4px;
        }
      }
    }
    .el-card__body {
      padding: 20px 0;
      .el-table .cell {
        font-size: 12px;
      }
      .rlt {
        position: relative;
        .accessory {
          position: absolute;
          left: 10px;
          transform: translateY(9px);
          font-size: 15px;
        }
        .underline {
          display: block;
          width: 58%;
          position: absolute;
          right: 13%;
          bottom: 3px;
          border-bottom: 1px solid #D5DADF
        }
        .el-upload {
          .el-button {
            margin-left: 120px;
            padding: 11px;
            span {
              font-size: 13px;
            }
          }
        }
        .uploadbtn {
          width: 101px;
        }
        .el-button {
          float: right;
          font-size: 15px;
          border-radius: 4px;
        }
        .el-upload-list {
          width: 55%;
          margin-left: 10px;
          display: inline-block;
          text-indent: 30px;
          transform: translateY(-6px);
        }
      }
    }
  }
}

</style>
