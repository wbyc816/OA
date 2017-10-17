<template>
  <div class="empChangeApp">
    <el-form label-position="left" :model="changeForm" :rules="rules" ref="changeForm" label-width="128px">
      <el-form-item label="拟调入部门/处室" prop="deps">
        <el-cascader expand-trigger="hover" :options="depList" :props="defaultProp" v-model="changeForm.deps"  style="width:100%" popper-class="myCascader">
        </el-cascader>
      </el-form-item>
      <el-form-item label="拟调入岗位" prop="jobtitle">
        <el-input v-model="changeForm.jobtitle">
        </el-input>
      </el-form-item>
      <el-form-item label="工作经历" prop="workExperience">
        <el-input type="textarea" :rows="8" resize='none' v-model="changeForm.workExperience"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
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
        workExperience: '',
        jobtitle: '',
        deps:[],
      },
      rules: {
        workExperience: [{ required: true, message: '请填写工作经历', trigger: 'blur' }],
        jobtitle: [{  required: true, message: '请输入拟调入岗位', trigger: 'blur' }],
        deps: [{ type: 'array', required: true, validator: checkDept, trigger: 'blur' }],
      },
      params: '',
      depList:[],
      defaultProp:{
        value:'id',
        label:'name',
        children:'childNode'
      }
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
  },
  methods: {
    submitForm() {
      this.$refs.changeForm.validate((valid) => {
        if (valid) {
          this.params = {
            "palnDeptMajorId": this.changeForm.deps[0], //第一级部门id
            "planDeptId": this.changeForm.deps[this.changeForm.deps.length-1], //最后一级部门id
            "palnJobtitle":this.changeForm.jobtitle, //拟调入岗位
            "workExperience":this.changeForm.workExperience //工作经历
          }
          this.$emit('submitMiddle', this.params);
        } else {
          this.$message.warning('请检查填写字段')
          this.$emit('submitMiddle', false);
          return false;
        }
      });
    },
    getDepList(){
      function loopMap(arr){
        arr.forEach(function(dep){
          if(dep.childNode.length==0){
              dep.childNode=null
            }else{
              loopMap(dep.childNode)
            }
        })
      }
      this.$http.post('/dept/selectDeptOrgByDeptId',{deptId:this.DHId})  //东航ID
      .then(res=>{
        if(res.status==0){
          loopMap(res.data.deptList[0].childNode)
          this.depList=res.data.deptList[0].childNode
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
}

</style>
