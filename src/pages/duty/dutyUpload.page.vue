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
        <el-upload ref="upload" accept=".xlsx" :multiple="false" :on-success="uploadSuccess" :on-error="uploadError" :action="actionUrl" :file-list="fileList" :auto-upload="false">
          <span class="accessory">附件</span>
          <span class="underline"></span>
          <el-button @click="fileList = []" slot="trigger" size="large">选择文件
            <i class="iconfont icon-jiantou"></i>
          </el-button>
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
          <el-col :offset="12" :span="2" class="titleRight">

            <el-button size="large" @click="edit">
              <i class="iconfont icon-xie"></i>
              {{msg}}</el-button>
          </el-col>
          <el-col :offset="1" :span="2" class="titleRight">
            <el-button type="primary" size="large" @click="saveAndSubmit" class="save">提交并发布</el-button>
          </el-col>
        </el-row>
      </div>
      <table cellspacing="0" class="editTable">
        <tr class="head">
          <td>日期</td>
          <td>部门</td>
          <td>值班人</td>
          <td>手机</td>
          <td>电话</td>
          <td v-if="editAble">操作</td>
        </tr>
        <tr v-for="(item, index) in tableData" :key="item.toString()">
          <td>
            <input :readonly="readonly" class="dutyDate" ref="dutyDate" v-model="item.dutyDate"></input>
          </td>
          <td>
            <input :readonly="readonly" v-model="item.deptName"></input>
          </td>
          <td>
            <input :readonly="readonly" v-model="item.empName"></input>
          </td>
          <td>
            <input :readonly="readonly" v-model="item.mobileNumber"></input>
          </td>
          <td>
            <input :readonly="readonly" v-model="item.phoneNumber"></input>
          </td>
          <td v-if="editAble">
            <el-button style="font-size: 13px" @click="deleteRow(index)" type="text" size="small">删除</el-button>
          </td>
        </tr>
      </table>
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
      sendData: [],
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
    ]),
    actionUrl() {  // 临时变量 解决两地开发 Url地址不同
      // return 'http://apitest.donghaiair.com:8899/DonghaiAirAPI/onduty/excelInsert'
      return this.baseURL+'/onduty/excelInsert'
    },
    readonly() {
      if (this.editAble) {
        return null
      }
      return 'readonly'
    },
    msg() {
      if (this.editAble) {
        return '取消'
      }
      return '编辑'
    }
  },
  filters: {
    one() {
      return 1
    }
  },
  methods: {
    submitUpload() {
      this.$refs.upload.submit();
    },
    edit() {
      if (this.tableData.length && !this.editAble) {
        this.editAble = true;
        let dom = document.querySelectorAll('.dutyDate')[0];
        setTimeout(function() {
          dom.focus();
        }, 100);
      } else {
        this.editAble = false;
      }
    },
    handleRemove() {
      this.noMore = false;
    },
    handleChange(file, fileList) {
      const isEXCEL = file.raw.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.raw.type === "application/vnd.ms-excel";
      const isLt20M = file.size / 1024 / 1024 < 20;
      if (!isEXCEL) {
        this.$message.error('上传文件只能是 EXCEL 格式!');
        this.$refs.upload.clearFiles();
      }
      if (!isLt20M) {
        this.$refs.upload.clearFiles();
        this.$message.error('上传文件大小不能超过 20MB!');
      }
      if (isEXCEL && isLt20M) {
        this.noMore = true;
      }

    },
    uploadSuccess(data) {
      if (data.status == '0') {
        if (data.data.ondutylist.length) {
          this.tableData = dataTransform(data.data.ondutylist, fmts)
          this.$message.success('上传成功')
        } else {
          this.fileList = []
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

      this.formatTableData()
      if (this.sendData.length) {
        this.$http.post('/onduty/addOrUpdateDutyInfo', { ondutylist: this.sendData, useId: this.userInfo.empId }, { body: true }).then((data) => {
          if (data.status == '0') {
            this.fileList = [];
            this.tableData = [];
            this.sendData = [];
            this.editAble = false;
            this.$message({
              message: '提交成功',
              type: 'success',
            })
            // this.$router.push('/duty/dutyDetail');
          } else {
            this.$message.error('提交失败')
          }
        })
      }
    },
    formatTableData() {
      for (let item of this.tableData) {
        let obj = {}
        Object.keys(item).forEach(function(key) {
          if (key === 'dutyDate') {
            obj[key] = new Date(item[key]).getTime()
          } else {
            if (item[key] === '空' || item[key] === '无') {
              obj[key] = ""
            } else {
              obj[key] = item[key]
            }
          }
        })
        this.sendData.push(obj)
      }
    },
    deleteRow(row) {
      this.tableData.splice(row, 1)
    }
  }
}

</script>
<style scope lang="scss">
@import '../../assets/scss/color.scss';

#dutyUpload {
  transition: all .5s;
  .el-card {
    overflow: hidden;
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
        font-size: 13px;
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
  .editTable {
    margin: 0 auto;
    width: 800px;
    tr {
      text-indent: 20px;
      background-color: #fff;
      color: $main;
      height: 45px;
      font-size: 13px;
      border-bottom: 1px solid #D5DADF;
      &.head {
        background-color: $main;
        color: white;
        td {
          color: #fff;
        }
      }
      td {
        border-bottom: 1px solid #D5DADF;
        font-size: 13px;
        color: #000; // position: relative;
        height: 30px;
        width: 18%;
        vertical-align: middle;
        padding: 0;
        input {
          text-indent: 20px;
          font-size: 13px;
          border: none;
          outline: none;
          height: 100%;
          line-height: 30px;
          transform: translateX(-20px);
          width: 100%;
          &:focus {
            border-bottom: 1px solid $main;
          }
        }
      }
    }
  }
}
</style>
