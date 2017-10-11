<template>
  <div class="empTrainingApp">
    <el-form label-position="left" :model="trainingForm" :rules="rules" ref="trainingForm" label-width="128px">
      <el-form-item label="参训部门/处室" prop="deps">
        <el-cascader expand-trigger="hover" :options="depList" :props="defaultProp" v-model="trainingForm.deps"  style="width:100%" popper-class="myCascader">
        </el-cascader>
      </el-form-item>
      <el-form-item label="参训人" prop="person" class="reciverWrap">
        <div class="reciverList">
          <el-tag :key="person.id" :closable="true" type="primary" @close="closePerson(index)" v-for="(person,index) in trainingForm.person">
            {{person.name}}
          </el-tag>
        </div>
        <el-button class="addButton" @click="signDialogVisible=true"><i class="el-icon-plus"></i></el-button>
      </el-form-item>
      <el-form-item label="参训日期" prop="days" class="deptArea">
        <el-date-picker v-model="trainingForm.timeRange" type="daterange" :editable="false" :clearable="false" style="width:100%" :picker-options="pickerOptions0"></el-date-picker>
      </el-form-item>
      <el-form-item label="培训科目" prop="jobtitle" class="arrArea">
        <el-input v-model="trainingForm.jobtitle">
        </el-input>
      </el-form-item>
      <el-form-item label="休假天数" prop="days" class="deptArea">
        <el-input v-model="trainingForm.days" ref="days" @change="fomatDays" :maxlength="6" class="hasUnit" @blur="blurInput">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="休假天数" prop="days" class="arrArea">
        <el-input v-model="trainingForm.days" ref="days" @change="fomatDays" :maxlength="6" class="hasUnit" @blur="blurInput">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
    </el-form>
    <person-dialog @updatePerson="updatePerson" dialogType="multi" :visible.sync="dialogVisible"></person-dialog>
  </div>
</template>
<script>
import PersonDialog from '../../../components/personDialog.component'
import { mapGetters } from 'vuex'
export default {
  components: {PersonDialog},
  data() {
    var checkDept = (rule, value, callback) => {
      if (value[0]) {
        callback();
      } else {
        callback(new Error('请选择拟调入部门/处室'))
      }
    };
    return {
      dialogVisible:false,
      trainingForm: {
        person:[],
        workExperience: '',
        jobtitle: '',
        deps:[],
      },
      rules: {
        workExperience: [{ required: true, message: '请填写工作经历', trigger: 'blur' }],
        person: [{ type: 'array', required: true, message: '请选择培训人', trigger: 'blur' }],
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
      'sumitLoading',
      'baseURL',
      'userInfo',
      'DHId'
    ])
  },
  created() {
    this.getDepList();
  },
  methods: {
    updatePerson(list) {
      // console.log(list)
      this.trainingForm.person = list
      this.dialogVisible = false;
    },
    submitForm() {
      this.$refs.trainingForm.validate((valid) => {
        if (valid) {
          this.params = {
            "palnDeptMajorId": this.trainingForm.deps[0], //第一级部门id
            "planDeptId": this.trainingForm.deps[this.trainingForm.deps.length-1], //最后一级部门id
            "palnJobtitle":this.trainingForm.jobtitle, //拟调入岗位
            "workExperience":this.trainingForm.workExperience //工作经历
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
.empTrainingApp {
  .el-input {
    width: 100%;
  }
  .reciverWrap {
    clear: both;
    .el-form-item__content {
      display: flex;
    }
    .reciverList {
      flex: 1;
      .el-tag {
        margin-right: 5px;
      }
    }
    .addButton {
      right: 0;
    }
  }
}

</style>
