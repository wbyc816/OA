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
      <el-upload ref="upload" :multiple="false" :on-success="uploadSuccess" :on-error="uploadError" action="http://apitest.donghaiair.com:8899/DonghaiAirAPI//onduty/excelInsert" :file-list="fileList" :auto-upload="false">
        <!-- <el-row :gutter="0"> -->
        <!-- <el-col :span="1"> -->
        <!-- <span class="accessory">附件</span> -->
        <!-- </el-col> -->
        <!-- <el-col :offset="17" :span="3"> -->
        <el-button slot="trigger" size="small" class="choosebtn">选择文件</el-button>
        <!-- </el-col> -->
        <!-- <el-col :span="14">
                                    <el-input></el-input>
                                  </el-col> -->
        <!-- <el-col :span="3"> -->
        <el-button type="primary" class="uploadbtn" @click="submitUpload">上传</el-button>
        <!-- </el-col> -->
        </el-row>
      </el-upload>
    </el-card>
    <el-card>
      <div slot="header">
        <el-row :gutter="23">
          <el-col class="titleLeft" :span="5">
            <span>值班信息上传结果</span>
          </el-col>
          <el-col :offset="13" :span="2" class="titleRight">
            <el-button icon="edit" @click="edit">编辑</el-button>
          </el-col>
          <el-col :span="2" style="margin-left: 15px" class="titleRight">
            <el-button type="primary" @click="saveAndSubmit" class="save">保存并提交</el-button>
          </el-col>
        </el-row>
      </div>
      <el-table :data="tableData" highlight-current-row style="width: 100%">
        <el-table-column v-if="editAble" type="selection" width="50">
        </el-table-column>
        <el-table-column type="index" width="50">
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
      editAble: false
    };
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  // watch: {
  //   submitDisable: function(newVal, oldVal) {
  //     console.log(1)
  //     console.log(newVal,oldVal)
  //   }
  // },
  methods: {
    submitUpload() {
      this.$refs.upload.submit();
    },
    edit() {
      this.editAble = !this.editAble
    },
    uploadSuccess(data) {
      // console.log(data.data.ondutylist, 'success')
      if (data.status == '0') {
        if(data.data.ondutylist.length){
        this.originData = data.data.ondutylist
        this.tableData = dataTransform(this.originData, fmts)
        }
        this.$message.success('上传成功')
      } else {
        this.$message.error('上传失败')
      }
    },
    uploadError(data) {
      this.$message.error('上传失败')
    },
    saveAndSubmit() {
      if (this.originData) {
        this.$http.post('/onduty/addOrUpdateDutyInfo', { ondutylist: this.originData, userId: this.userInfo.empId }, { body: true }).then((data) => {
          if (data.status == '0') {
            this.$message({
              message: '提交成功',
              type: 'success',
            })
          } else {
            this.$message.error('提交失败')
          }
        })
      }
    },
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
        font-size: 13px;
        transform: translateY(12px);
      }
      .titleRight {
        .el-button {
          font-size: 14px;
          border-radius: 2px;
        }
      }
    }
    .el-card__body {
      padding: 20px 0;
      .el-table .cell {
        font-size: 12px;
      }
      .el-upload {
        .el-button {
          font-size: 14px;
        }
      }
      .el-button {
        font-size: 14px;
        border-radius: 2px;
        height: 33px;
        box-sizing: border-box;
        &.uploadbtn {
          transform: translateY(1px);
          width: 80px;
        }
      }
    }
  }
}
</style>
