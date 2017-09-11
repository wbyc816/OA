<template>
    <div id='description'>
      <h4 class='doc-form_title'>Description</h4>
      <el-form label-position="left" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="128px">

        <el-form-item  label="Description" prop="des"  class="textarea">
          <el-col :span='18'>
            <el-input type="textarea" v-bind:resize='none' v-model="ruleForm.des"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item  class='form-box' label="Approval Path" prop="path">
          <el-col :span='18'>
            <el-input  v-model="ruleForm.path">
            </el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="Attachment">
          <el-col :span='18'>
            <el-upload
              action="//jsonplaceholder.typicode.com/posts/"
              class="myUpload">
              <el-button size="small" type="primary">Select File<i class="el-icon-upload el-icon--right"></i></el-button>
            </el-upload>
          </el-col>
        </el-form-item>


        <el-form-item  class='form-box' label="Reference Document">
          <el-col :span='18' >
            <el-input class="search"  v-model="ruleForm.rec">
              <el-button slot="append" @click='submitRefdoc'>Select</el-button>
            </el-input>
          </el-col>
        </el-form-item>

        <el-row v-if='note'>
          <el-col class='note'>
            Remarks: <br />
            1. After obtaining the Department Heads approval,please foward the form to Human Resources & <br />
            Administration Depatment (7/F,Citygate) for verification and approval. <br />
            2. Please allow 7 working days (counted from after confirmation of all the relevant information in <br />
            the name card) for the Human Resources & Administration Depatment to process ths application. <br />
          </el-col>
        </el-row>
      </el-form>
    </div>
</template>
<style lang='scss'>
  #description .textarea{
    height:188px;
    margin-bottom: 27px;
    .el-textarea__inner{
      height:188px;
    }
  }
  #description .note{
    padding-left:6px;
    font-size: 16px;
    color: #E40012;

  }
</style>
<script>
    export default{
        data(){
            return{
                msg:'hello vue',
                none:"none",
                ruleForm: {
                    des:'',
                    path:'',
                  },
                rules:{
                  des:[
                    { required: true, message: '请输入描述', trigger: 'blur'}
                  ],
                  path:[
                    { required: true, message: '请输入路径', trigger: 'blur'},
                    { min: 3, max: 500, message: '长度在 2 到 500 个字符之间', trigger: 'change' }
                  ],
                },
            }
        },
        props:['note'],
        components:{

        },
        methods:{
          submitRefdoc:function(){

          }
        }
    }
</script>
