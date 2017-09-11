<template>
    <div>
      <h4 class='doc-form_title'>Name Card Information</h4>
      <el-form label-position="left" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px">

        <el-form-item  class='form-box' label="Staff Name" prop="sub">
          <el-col :span='18'>
            <el-input v-model="ruleForm.sub" class='search' prop='sub'>
              <el-button slot="append" @click='selectPerson'>Select</el-button>
            </el-input>
          </el-col>
        </el-form-item>

        <el-row v-for='item in nameInfo'>
          <template v-if='item.type=="input"'>
            <el-col :span='10'>
              <el-form-item  class='form-box' :label="item.text1">
                <el-col :span='21'>
                  <el-input :v-model="item.bind1" >
                  </el-input>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span='10'>
              <el-form-item  class='form-box' :label="item.text2">
                <el-col :span='20'>
                  <el-input :v-model="item.bind2" >
                  </el-input>
                </el-col>
              </el-form-item>
            </el-col>
          </template>
          <template v-if='item.type=="select"'>
            <el-col :span='10'>
              <el-form-item  class='form-box' :label="item.text1">
                <el-col :span='21'>
                  <el-select :v-model="item.bind1" placeholder="">
                    <el-option v-for="i in addressDate" :label="i.label" :value="i.value"></el-option>
                  </el-select>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span='10'>
              <el-form-item  class='form-box' :label="item.text2">
                <el-col :span='20'>
                  <el-select :v-model="item.bind2" placeholder="">
                    <el-option v-for="i in logoDate" :label="i.label" :value="i.value"></el-option>
                  </el-select>
                </el-col>
              </el-form-item>
            </el-col>
          </template>

        </el-row>


      </el-form>
    </div>
</template>
<style scoped lang='scss'>

</style>
<script>
    export default{
        data(){
            return{
                nameInfo:[
                  {type:'input',text1:'Staff Name (English)',bind1:'ruleForm.staffEn',text2:'Staff Name (Chinese)',bind1:'ruleForm.staffCh'},
                  {type:'input',text1:'Title&Department (English)',bind1:'ruleForm.titleEn',text2:'Title&Department (Chinese)',bind1:'ruleForm.titleCh'},
                  {type:'input',text1:'Telephone',bind1:'ruleForm.telephone',text2:'Direct Line',bind1:'ruleForm.direct'},
                  {type:'input',text1:'Mobile(Optional)',bind1:'ruleForm.mobOp',text2:'Fax',bind1:'ruleForm.fax'},
                  {type:'select',text1:'Address',bind1:'ruleForm.address',text2:'Logo',bind1:'ruleForm.logo'},
                  {type:'input',text1:'Website',bind1:'ruleForm.website',text2:'Email',bind1:'ruleForm.email'},
                ],
                ruleForm: {
                      rec: '',
                      staffEn: '',
                      staffCh: '',
                      titleEn: '',
                      titleCh:'',
                      telephone:'',
                      direct:'',
                      mobOp:'',
                      fax:'',
                      address:'',
                      logo:'',
                      website:'',
                      email:'',

                },
                rules:{
                    rec:[
                      { required: true, message: '请输入Name', trigger: 'blur' },
                      { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
                    ],
                    sub:[
                      { required: true, message: '请输入Staff Name', trigger: 'change' },
                    ]
                },
                addressDate:[{
                  value: '选项1',
                  label: 'AFC'
                }, {
                  value: '选项2',
                  label: 'AIRPORT'
                },  {
                  value: '选项3',
                  label: 'ABO'
                }, ],
                logoDate:[{
                  value: '选项1',
                  label: 'HX'
                }, {
                  value: '选项2',
                  label: 'UO'
                }, {
                  value: '选项2',
                  label: 'HX&UO'
                }, ],
            }
        },
        components:{

        },
        methods:{
          selectPerson:function(){
             alert('弹出职员选择框');
          }
        }

    }
</script>
