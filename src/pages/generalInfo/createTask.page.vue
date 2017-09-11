<template>
    <div id='createTask'>
      <el-card>
        <div slot="header" class='doc_title'>
          <span v-text='docTitle'></span>
        </div>
        <div>
          <el-form label-position="left" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="128px">

            <el-form-item  class='form-box' label="Assign To" prop="assign">
              <el-col :span='18' >
                <el-input class="search"  v-model="ruleForm.assign">
                  <el-button slot="append" @click='selectPerson'>Select</el-button>
                </el-input>
              </el-col>
            </el-form-item>

            <el-form-item  class='form-box' label="Task Name" prop="taskName">
              <el-col :span='18'>
                <el-input v-model="ruleForm.taskName">
                </el-input>
              </el-col>
            </el-form-item>

            <el-form-item  class='form-box' label="Task Level">
              <el-col :span='18'>
                <el-radio-group v-model="ruleForm.level"  class="myRadio">
                  <el-radio-button label="General">General<i></i></el-radio-button>
                  <el-radio-button label="Emergency">Emergency<i></i></el-radio-button>
                </el-radio-group>
              </el-col>
            </el-form-item>

            <el-form-item  label="Description"  class="textarea">
              <el-col :span='18'>
                <el-input type="textarea" v-bind:resize='none' v-model="ruleForm.des"></el-input>
              </el-col>
            </el-form-item>

            <el-form-item  class='form-box' label="Deadline" prop="deadLine">
              <el-col :span='18'>
                <el-input v-model="ruleForm.deadLine">
                </el-input>
              </el-col>
            </el-form-item>

            <el-form-item  class='form-box' label="Feedback Time">
              <el-col :span='18'>
                <el-radio-group v-model="ruleForm.add"  class="myRadio">
                  <el-radio-button label="Add">Add<i></i></el-radio-button>
                </el-radio-group>
              </el-col>
            </el-form-item>

          </el-form>

          <div class='doc-form-submit_btn'>
            <el-button type="primary" >Submit</el-button>
          </div>

        </div>
      </el-card>
    </div>
</template>
<style lang='scss'>
  #createTask .textarea{
    height:188px;
    margin-bottom: 27px;
    .el-textarea__inner{
      height:188px;
    }
  }
</style>
<script>
    export default{
        data(){
            return{
                docTitle:"Create New Task",
                none:'none',
                ruleForm: {
                      assign: '',
                      taskName: '',
                      des:'',
                      level:'',
                      deadLine:'',
                      add:'',
                },
                rules:{
                    assign:[
                      { required: true, message: '请选择Staff Name', trigger: 'blur' },
                    ],
                    taskName:[
                      { required: true, message: '请输入Task Name', trigger: 'blur' },
                    ],
                    deadLine:[
                      { required: true, message: '请输入Task Name', trigger: 'blur' },
                    ],
                },
            }
        },
        components:{

        },
        methods:{
          selectPerson:function(){

          }
        }
    }
</script>
