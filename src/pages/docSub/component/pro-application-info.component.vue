<template>
    <div>
      <h4 class='doc-form_title'>Application Information</h4>

      <el-form label-position="left" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px">
        <el-row>

          <el-col :span='10'>
            <el-form-item  class='form-box' label="Staff Name" prop="staffName">
              <el-col :span='21'>
                <el-input v-model="ruleForm.staffName" >
                </el-input>
              </el-col>
            </el-form-item>
          </el-col>

          <el-col :span='10'>
            <el-form-item  class='form-box' label="Contact No." prop="contact">
              <el-col :span='21'>
                <el-input v-model.number="ruleForm.contact" >
                </el-input>
              </el-col>
            </el-form-item>
          </el-col>

          <el-col :span='10'>
            <el-form-item  class='form-box' label="Email" prop="email">
              <el-col :span='21'>
                <el-input v-model="ruleForm.email" >
                </el-input>
              </el-col>
            </el-form-item>
          </el-col>

          <el-col :span='10'>
            <el-form-item  class='form-box' label="Expected Delivery" prop="expected">
              <el-col :span='21'>
                <el-input v-model="ruleForm.expected" >
                </el-input>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>

        <el-table border :data="appDates" border >
          <el-table-column v-for='item in appTable' :prop="item.prop" :label="item.label" :width='item.width' v-bind:resizable="false">
          </el-table-column>
          <el-table-column  prop="Handle" label=" " v-bind:resizable="false" :width='140'>
            <template scope="scope">
              <div @click="handleDelete(scope.$index, scope.row)">
                <i class='iconfont icon-wenjianfile'></i>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <el-row>
          <el-col :span='10' v-for='item in appInput'>
            <el-form-item  class='form-box' :label="item.title" >
              <el-col :span='21'>
                <el-input :v-model="item.bind" >
                </el-input>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item  class='form-box' label="Unit Price" >
          <el-col :span='15'>
            <el-input v-model="appTableForm.unitPrice" >
            </el-input>
          </el-col>
          <el-col :span='3'  class='unit-price'>
            <el-select v-model="appTableForm.appMoneyType" placeholder="HKD">
              <el-option v-for="item in moneyType" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-col>
        </el-form-item>

        <el-row>
          <el-col :span='10'>
            <el-form-item  class='form-box' label="Inventory Quantity">
              <el-col :span='21'>
                <el-input v-model="appTableForm.inventory" >
                </el-input>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span='10'>
            <el-form-item  class='form-box' label="Suggest Procurement Quantity">
              <el-col :span='21'>
                <el-input v-model="appTableForm.suggest" >
                </el-input>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item>
          <el-col :span='6' class='budget-btn add-btn'>
            <el-button @click="addBtn(ruleForm)">Add</el-button>
          </el-col>
          <el-col :span='4' :offset='1' class='budget-btn clear-btn'>
            <el-button @click="clearBtn">Clear</el-button>
          </el-col>
        </el-form-item>

      </el-form>
    </div>
</template>
<style scoped lang='scss'>
  .unit-price{
    margin-left:10px;
  }
  .budget-btn button{
    width:100%;
    height:46px;
    font-size: 20px;
    border-radius: 3px;
  }
  .add-btn button{
    color: #7C5598;
    border-color: #7C5598;

  }
  .clear-btn button {
    color: #393939;
    border: 1px solid #777;
  }
</style>
<script>
    export default{
        data(){
            return{
                appTable:[
                    {"prop":"commodity","label":"Commodity Name","width":"93"},
                    {"prop":"specification","label":"Specification","width":"103"},
                    {"prop":"unit","label":"Unit","width":"51"},
                    {"prop":"requested","label":"Requested Quantity","width":"93"},
                    {"prop":"unitPrice","label":"Unit Price","width":"86"},
                    {"prop":"inventory","label":"Inventory Quantity","width":"83"},
                    {"prop":"suggest","label":"Suggest Procurement","width":"165"},
                    {"prop":"total","label":"Total Value","width":"58"},
                ],
                appDates:[
                    {
                        commodity:"",
                        specification:"",
                        unit:"",
                        requested:"",
                        unitPrice:"",
                        appMoneyType:'',
                        inventory:"",
                        suggest:"",
                        total:"",
                        handle:"",
                    },
                ],
                appTableForm:{
                    commodity:'',
                    specification:'',
                    unit:'',
                    requested:'',
                    unitPrice:'',
                    appMoneyType:'',
                    inventory:'',
                    suggest:'',
                    total:"",
                    handle:"",
                },
                appInput:[
                    {title:'Commodity Name',bind:'appTableForm.commodity'},
                    {title:'Specficate',bind:'appTableForm.specification'},
                    {title:'Unit',bind:'appTableForm.unit'},
                    {title:'Requested Quantity',bind:'appTableForm.requested'},
                ],
                ruleForm: {
                      staffName: '',
                      contact: '',
                      email: '',
                      expected: '',
                },
                rules:{
                    staffName:[
                      { required: true, message: '请输入Name', trigger: 'blur' },
                    ],
                    contact:[
                      { required: true, message: '输入错误', trigger: 'blur' },
                      { type:'number', message:'请输入数字',trigger: 'blur'},
                      { min:2, max:19 ,message:'长度在1-19之间',trigger: 'blur' }
                    ],
                    email:[
                      { required: true, message: '请输入有效的邮件格式', trigger: 'blur' },
                    ],
                    expected:[
                      { required: true, message: '请输入expected', trigger: 'blur' },
                    ],
                },
                moneyType:[{
                  value: '人民币',
                  label: 'RMB'
                },{
                  value: '美元',
                  label: 'Dollar'
                }, ],
            }
        },
        components:{

        },
        methods:{
            handleDelete(index, row) {
                this.appDates.splice(index,1);
            },
            addBtn(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                      let copyForm = Object.assign({},this.ruleForm)
                      this.budgetDates.push(copyForm);
                      this.clearBtn();
                      alert('submit!');
                    } else {
                      console.log('error submit!!');
                      return false;
                    }
                });
            },
            clearBtn(){
                console.log("clear");
                for(var index in this.appTableForm){
                    this.appTableForm[index] = "";
                }
            }

        }
    }
</script>
