<template>
  <div class="empChangeApp">
    <div class="empBox">
      <div class="imgBox">
        <img :src="empInfo.picUrl" @error="empInfo.picUrl=blankHead" alt="" v-if="empInfo.picUrl">
      </div>
      <ul class="clearfix">
        <li><span class="itemTitle">姓名</span><span class="text">{{empInfo.empName}}</span></li>
        <li><span class="itemTitle">毕业学校</span><span class="text">{{empInfo.graduationSchool}}</span></li>
        <li><span class="itemTitle">性别</span><span class="text">{{empInfo.empGender | sex}}</span></li>
        <li><span class="itemTitle">学历</span><span class="text">{{empInfo.eduBackground}}</span></li>
        <li><span class="itemTitle">年龄</span><span class="text">{{empInfo.empAge}}</span></li>
        <li><span class="itemTitle">专业</span><span class="text">{{empInfo.major}}</span></li>
        <li><span class="itemTitle">入公司时间</span><span class="text">{{empInfo.joinDate | time('ch')}}</span></li>
        <li><span class="itemTitle">外语水平</span><span class="text">{{empInfo.language}}</span></li>
      </ul>
    </div>
    <el-form label-position="left" :model="changeForm" :rules="rules" ref="changeForm" label-width="128px">
      <el-form-item label="拟调入部门/处室" prop="deps">
        <el-cascader expand-trigger="hover" :options="depList" :props="defaultProp" v-model="changeForm.deps" style="width:100%" popper-class="myCascader">
        </el-cascader>
      </el-form-item>
      <el-form-item label="拟调入岗位" prop="jobtitle">
        <el-input v-model="changeForm.jobtitle" :maxlength="50">
        </el-input>
      </el-form-item>
      <el-form-item label="工作经历" prop="workExperience">
        <el-input type="textarea" :rows="8" resize='none' v-model="changeForm.workExperience" :maxlength="500"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import blankHead from '../../../assets/images/blankHead.png'
export default {
  components: {},
  data() {
    var checkDept = (rule, value, callback) => {
      if (value[0]) {
        callback();
      } else {
        callback(new Error('请选择拟调入部门/处室'))
      }
    };
    return {
      changeForm: {
        workExperience: 'XXXX年XX月XX日    于XXXX公司任职   XXX岗位    从事XXX工作\nXXXX年XX月XX日    于XXXX公司任职   XXX岗位    从事XXX工作',
        jobtitle: '',
        deps: [],
      },
      rules: {
        workExperience: [{ required: true, message: '请填写工作经历', trigger: 'blur' }],
        jobtitle: [{ required: true, message: '请输入拟调入岗位', trigger: 'blur' }],
        deps: [{ type: 'array', required: true, validator: checkDept, trigger: 'blur' }],
      },
      params: '',
      depList: [],
      defaultProp: {
        value: 'id',
        label: 'name',
        children: 'childNode'
      },
      blankHead,
      empInfo:''
    }
  },
  computed: {
    ...mapGetters([
      'submitLoading',
      'baseURL',
      'userInfo',
      'DHId'
    ])
  },
  created() {
    this.getDepList();
    this.getEmp();
  },
  methods: {
    saveForm() {
      this.$emit('saveMiddle', JSON.stringify(this.changeForm));
    },
    getDraft(obj) {
      this.changeForm = obj;
    },
    submitForm() {
      this.$refs.changeForm.validate((valid) => {
        if (valid) {
          this.params = {
            "palnDeptMajorId": this.changeForm.deps[0], //第一级部门id
            "planDeptId": this.changeForm.deps[this.changeForm.deps.length - 1], //最后一级部门id
            "palnJobtitle": this.changeForm.jobtitle, //拟调入岗位
            "workExperience": this.changeForm.workExperience //工作经历
          }
          this.$emit('submitMiddle', this.params);
        } else {
          this.$message.warning('请检查填写字段')
          this.$emit('submitMiddle', false);
          return false;
        }
      });
    },
    getDepList() {
      function loopMap(arr) {
        arr.forEach(function(dep) {
          if (dep.childNode.length == 0) {
            dep.childNode = null
          } else {
            loopMap(dep.childNode)
          }
        })
      }
      this.$http.post('/dept/selectDeptOrgByDeptId', { deptId: this.DHId }) //东航ID
        .then(res => {
          if (res.status == 0) {
            loopMap(res.data.deptList[0].childNode)
            this.depList = res.data.deptList[0].childNode
          }
        })
    },
    getEmp(){
      this.$http.post('/doc/empChangeInfo',{empId:this.userInfo.empId})
      .then(res=>{
        if(res.status==0){
          this.empInfo=res.data;
        }else{

        }
      })
    }
  }
}

</script>
<style lang='scss'>
$main:#0460AE;
.empChangeApp {
  .el-input {
    width: 100%;
  }
  .empBox {
    width: 760px;
    position: relative;
    padding: 0 0 20px 176px;
    .imgBox {
      position: absolute;
      left: 16px;
      top: 15px;
      width: 120px;
      img{
        width:100%;
      }
    }
    ul {
      li {
        width: 50%;
        float: left;
        line-height: 50px;
        font-size: 15px;
        .itemTitle {
          display: inline-block;
          color: $main;
          width: 150px;
        }
        &:nth-child(odd) {
          width: 40%;
          .itemTitle {
            width: 110px;
          }
        }
      }
    }
  }
}

</style>
