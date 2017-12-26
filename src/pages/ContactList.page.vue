<template>
  <div id="contactList">
    <el-row>
      <el-col :span='5'>
        <organ-list @reset="reset1"></organ-list>
      </el-col>
      <el-col :span='19'>
        <el-card class="borderCard searchOptions">
          <el-row :gutter="18" class="inputBox">
            <el-form :model="searchForm" label-position="left" :rules="rules" ref="searchForm" label-width="100px" class="searchForm">
              <el-col :span="9">
                <el-form-item label="员工姓名" prop="name">
                  <el-input :maxlength="20" v-model.trim="searchForm.name"  @keyup.enter.native="submitForm">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item label="手机" prop="mobileNumber">
                  <el-input v-model="searchForm.mobileNumber" :maxlength="11"  @keyup.enter.native="submitForm">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item label="工号" prop="workNo">
                  <el-input v-model.trim="searchForm.workNo" :maxlength="10"  @keyup.enter.native="submitForm">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item label="办公电话" prop="phoneNumber">
                  <el-input v-model="searchForm.phoneNumber" :maxlength="20"  @keyup.enter.native="submitForm">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-button type="primary" :disabled="searchLoading" @click.native="submitForm">搜索</el-button>
              </el-col>
            </el-form>
          </el-row>
        </el-card>
        <el-table :data="searchRes.empVoList" class="myTable searchRes" v-loading.body="searchLoading" @row-click="showDetail">
          <el-table-column prop="name" label="姓名" width="110"></el-table-column>
          <el-table-column prop="workNo" label="工号" width="80"></el-table-column>
          <el-table-column prop="workPlace" label="所属公司" width="150"></el-table-column>
          <el-table-column prop="deptParentName" label="部门" width="150"></el-table-column>
          <el-table-column prop="jobtitle" label="职务" width="150"></el-table-column>
          <el-table-column prop="phoneNumber" label="办公电话"></el-table-column>
          <el-table-column prop="mobileNumber" label="手机"></el-table-column>
        </el-table>
        <div class="pageBox" v-show="searchRes.empVoList">
          <el-pagination @current-change="handleCurrentChange" :current-page="depPageNumber" :page-size="10" layout="total, prev, pager, next, jumper" :total="searchRes.totalSize">
          </el-pagination>
        </div>
      </el-col>
    </el-row>
    <el-dialog title="公司同仁详情" :visible.sync="dialogVisible" size="large" class="myDialog detailDialog" :lock-scroll="false">
      <el-row :gutter="20">
        <el-col :span="18">
          <h1 class="empName">{{empDetial.name}}</h1>
          <dl>
            <dt>基本信息</dt>
            <dd><span>工号：</span>
              <p>{{empDetial.workNo}}</p>
            </dd>
            <dd><span>所属公司：</span>
              <p>{{empDetial.workPlace}}</p>
            </dd>
            <dd><span>部门：</span>
              <p>{{empDetial.deptNames[0]}}</p>
            </dd>
            <dd><span>职务：</span>
              <p>{{empDetial.jobtitle}}</p>
            </dd>
            <dd><span>办公电话：</span>
              <p>{{empDetial.phoneNumber}}</p>
            </dd>
            <dd><span>手机：</span>
              <p>{{empDetial.mobileNumber}}</p>
            </dd>
            <dd><span>Email:</span>
              <p>{{empDetial.workEmail}}</p>
            </dd>
          </dl>
        </el-col>
        <el-col :span="6">
          <div class="photoBox">
            <img :src="empDetial.picUrl" alt="" @error="imgError=true" v-show="empDetial.picUrl&&!imgError">
            <img src="../assets/images/blankHead.png" alt="" v-show="!empDetial.picUrl&&!imgError">
            <img src="../assets/images/blankHead.png" alt="" v-show="imgError">
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import OrganList from '../components/organlist.component'
import { mapGetters } from 'vuex'
export default {
  data() {
    var validatePhone = (rule, value, callback) => {
      if (value && value.length != 0) {
        if (!(/^1[34578]\d{9}$/.test(value))) {
          callback(new Error("手机号码格式有误"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      searchForm: {
        name: '',
        mobileNumber: '',
        workNo: '',
        phoneNumber: '',
        allParams:''
      },
      rules: {
        mobileNumber: [{ validator: validatePhone, trigger: 'blur,change' }]

      },
      dialogVisible: false,
      empDetial: { deptNames: [] },
      searchButton: false,
      imgError:false,
    }
  },
  computed: {
    ...mapGetters([
      'depts',
      'userInfo',
      'searchRes',
      'queryDepId',
      'depPageNumber',
      'searchLoading',
      'organLoading',
      'isReady'
    ])
  },
  watch: {
    'isReady': function(newValue) {
      if (newValue) {
        this.$store.dispatch('setQueryDepId', this.userInfo.deptId)
        this.$store.dispatch('queryEmpList', {});
      }
    }
  },
  created() {
    this.$store.dispatch('getDeptList');

    if (this.$route.params.name) {
      this.$store.dispatch('setQueryDepId', '')
      this.searchForm.allParams = this.$route.params.name;
      this.searchButton = true;
      this.$store.dispatch('queryEmpList', this.searchForm);
    } else {
      if (this.isReady) {
        this.$store.dispatch('setQueryDepId', this.userInfo.deptId)
        this.$store.dispatch('queryEmpList', {});
      }

    }
  },
  beforeRouteLeave(to, from, next){
    this.$store.dispatch('setQueryPage', 1);
    next();
  },
  components: {
    OrganList
  },
  methods: {
    handleCurrentChange(page) {
      if (this.searchRes.empVoList) {
        this.$store.dispatch('setQueryPage', page);
        if (this.searchButton) {
          this.$store.dispatch('queryEmpList', this.searchForm);
        } else {
          this.$store.dispatch('queryEmpList', {});
        }
      }
    },
    submitForm() {
      this.$refs['searchForm'].validate((valid) => {
        if (valid) {
          this.searchForm.allParams='';
          this.searchButton = true;
          this.$store.dispatch('setQueryDepId', '')
          this.$store.dispatch('setQueryPage', 1);
          this.$store.dispatch('queryEmpList', this.searchForm);
        } else {
          return false;
        }
      });
    },
    showDetail(row) {
      this.dialogVisible = true;
      // this.$store.dispatch('getempDetial', row.empId);
      this.empDetial = row;
      this.imgError=false;
    },
    reset1() {
      this.searchButton = false;
      this.searchForm = {
        name: '',
        mobileNumber: '',
        workNo: '',
        phoneNumber: '',
        allParams:''
      }
    }
  }
}

</script>
<style lang='scss'>
$main: #0460AE;
#contactList {
  .searchRes {
    // min-height: 500px;
    &:before {
      display: none;
    }
  }
  .el-table tr:hover {
    background-color: #ccc;
    >td {
      background-color: #ccc;
    }
  }
  .pageBox {
    overflow: hidden;
    padding-right: 50px;
    padding-top: 20px;
    padding-bottom: 20px;
    .el-pagination {
      float: right;
    }
  }
  &>.el-row {
    background: #fff;
    margin-bottom: 50px;
    .el-col-19 {
      position: relative;
      padding-left: 15px;
      .searchOptions {
        box-shadow: none;
        margin-bottom: 45px;
        .el-card__body {
          .el-col {
            // margin-top: 13px;
          }
        }
      }
    }
  }
  .inputBox {
    padding-top: 20px;
    .el-input-group__prepend {
      width: 105px;
      box-sizing: border-box;
      color: #393939;
      border: none;
    }
    button {
      width: 100%;
      height: 46px;
    }
  }

  .myTable {
    .cell {
      padding-left: 15px;
    }
    td {
      height: 60px;
    }
    .el-table__row {
      cursor: pointer;
    }
  }
  .detailDialog {
    .el-dialog--large {
      width: 750px;
      .el-dialog__body {
        padding: 30px 35px 35px;
        .empName {
          font-size: 18px;
          color: $main;
          border-bottom: 1px solid #F2F2F2;
          padding-bottom: 12px;
        }
        dl {
          dt {
            font-size: 18px;
            color: $main;
            line-height: 45px;
            padding-left: 14px;
            position: relative;
            &:before {
              content: '';
              position: absolute;
              left: 0;
              width: 4px;
              height: 15px;
              top: 50%;
              margin-top: -8px;
              background-color: $main;
            }
          }
          dd {
            line-height: 45px;

            font-size: 15px;
            color: #676767;
            span {
              display: inline-block;
              width: 85px;
            }
            p {
              display: inline-block;
            }
          }
        }
        .photoBox {
          padding-top: 37px;
          text-align: right;
          font-size: 0;
          img {
            max-width: 100%;
          }
        }
      }
    }
  }
}

</style>
