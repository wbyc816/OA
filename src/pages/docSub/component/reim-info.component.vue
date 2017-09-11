<template>
    <div>
      <h4 class='doc-form_title'>Reimbursement Info</h4>
      <el-form label-position="left" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="128px">

        <el-form-item  class='form-box' label="User Organization" prop='userOrg'>
          <el-col :span='18'>
            <el-input v-model="ruleForm.userOrg" class='search' >
              <el-button slot="append">Select</el-button>
            </el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="Urgency">
          <el-col :span='6'>
            <el-radio-group v-model="ruleForm.urgency"  class="myRadio">
              <el-radio-button label="Yes">Yes<i></i></el-radio-button>
              <el-radio-button label="No">No<i></i></el-radio-button>
            </el-radio-group>
          </el-col>
          <el-col :span='10' v-if='ruleForm.urgency === "Yes"'>
            <el-upload
              action="//jsonplaceholder.typicode.com/posts/"
              class="myUpload">
              <el-button size="small" type="primary">Select File<i class="el-icon-upload el-icon--right"></i></el-button>
            </el-upload>
          </el-col>
        </el-form-item>

        <el-form-item  label="Budget Type">
          <el-col :span='18'>
            <el-radio-group v-model="ruleForm.urgency"  class="myRadio budgetType">
              <el-radio-button label="1">Budget-Business Travel<i></i></el-radio-button>
              <el-radio-button label="2">Budget-Base Subject<i></i></el-radio-button>
              <el-radio-button label="3">Budget-Special Subject<br/>(Training,Aircraft Delivery,Audit Fee)<i></i></el-radio-button>
              <el-radio-button label="4">Non Budget-Fees<br/>(Small Amount)<i></i></el-radio-button>
            </el-radio-group>
          </el-col>
        </el-form-item>

        <el-form-item  class='form-box' label="Reference Document(Travel)" prop='refDoc'>
          <el-col :span='18'>
            <el-input v-model="ruleForm.refDoc" class='search' >
              <el-button slot="append">Select</el-button>
            </el-input>
          </el-col>
        </el-form-item>

        <el-row><el-col class='table-title'>Budget Info </el-col></el-row>
        <el-table border :data="budgetInfo" border>
          <el-table-column v-for='item in budgetTable' :prop="item.prop" :label="item.label" :width='item.width' v-bind:resizable="false">
          </el-table-column>
        </el-table>

        <el-row><el-col class='table-title'>Budget Info Detail</el-col></el-row>
        <el-table border :data="budgetDetail" border>
          <el-table-column v-for='item in budgetDetailTable' :prop="item.prop" :label="item.label" :width='item.width' v-bind:resizable="false">
          </el-table-column>
        </el-table>

        <el-form-item class='form-box' label="Expense Item" prop="expense">
          <el-col :span='12'>
            <el-select class='item-select' v-model="budgetDetailForm.expenseItem" placeholder=" ">
              <el-option v-for="item in expenses" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-col>
          <span class='budgetExpense'>
            Cost Center &nbsp;&nbsp;&nbsp;{{budgetDetailForm.expenseItem}}
          </span>
        </el-form-item>

        <el-row>
          <el-col :span='11'>
            <el-form-item  class='form-box' label="Date" prop='date'>
              <el-col :span='18'>
                <el-input v-model="ruleForm.date">
                </el-input>
              </el-col>
            </el-form-item>
          </el-col>

          <el-col :span='11'>
            <el-form-item  class='form-box' label="Description" prop='description'>
              <el-col :span='18'>
                <el-input v-model="ruleForm.description">
                </el-input>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span='11'>
            <el-form-item  class='form-box' label="Days" prop='days'>
              <el-col :span='18'>
                <el-input v-model="ruleForm.days">
                </el-input>
              </el-col>
            </el-form-item>
          </el-col>

          <el-col :span='11'>
            <el-form-item   class='form-box' label="Unit Price" prop='unitPrice'>
              <el-col :span='10'>
                <el-input  v-model="ruleForm.unitPrice">
                </el-input>
              </el-col>
              <el-col :offset="1" :span='7'>
                <el-select v-model="ruleForm.curType" placeholder=" ">
                  <el-option v-for="item in curType" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-col>
            </el-form-item>
          </el-col>

        </el-row>

        <el-form-item  class='form-box' label="Total" >
          <el-col :span='18' class='price-num'>
            {{totalPrice}}(HKD)
          </el-col>
        </el-form-item>

        <el-form-item>
          <el-col :span='6' class='budget-btn add-btn'>
            <el-button @click="addBtn(ruleForm)">Add</el-button>
          </el-col>
          <el-col :span='4' :offset='1' class='budget-btn clear-btn'>
            <el-button @click="clearBtn()">Clear</el-button>
          </el-col>
        </el-form-item>

      </el-form>
    </div>
</template>
<style scoped lang='scss'>
  .budgetType label{
    margin-bottom:18px;
  }
  .table-title{
    margin-bottom:15px;
    font-size: 16px;
    color: #393939;
    padding-left:6px;
  }
  .budgetExpense{
    padding-left:10px;
    line-height:46px;
    font-size: 16px;
    color: #393939;
  }
  .item-select{
    width:100%;
  }
  .price-num{
    font-size: 16px;
    color: #E72332;
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
  .clear-btn button{
    color: #393939;
    border:1px solid #777;
  }
</style>
<script>
    export default{
        data(){
            return{
                ruleForm: {
                      userOrg: '',
                      urgency:'',
                      refDoc:'',
                      date:'',
                      description:'',
                      days:'',
                      unitPrice:'',
                      curType:'1',
                },
                rules:{
                    userOrg:[
                      { required: true, message: '请输入appInfot', trigger: 'blur' },
                    ],
                    date:[
                      { required: true, message: '请输入appInfot', trigger: 'blur' },
                    ],
                    description:[
                      { required: true, message: '请输入appInfot', trigger: 'blur' },
                    ],
                    days:[
                      { required: true, message: '请输入appInfot', trigger: 'blur' },
                    ],
                    unitPrice:[
                      { required: true, message: '请输入appInfot', trigger: 'blur' },
                    ],

                },
                budgetTable:[
                    {"prop":"budgetNature","label":"Budget Nature","width":"142"},
                    {"prop":"budgetDate","label":"Budget Date","width":"108"},
                    {"prop":"costCenter","label":"Cost Center","width":"107"},
                    {"prop":"currency","label":"Currency","width":"88"},
                    {"prop":"amountHKD","label":"Amount in HKD","width":"130"},
                    {"prop":"cashAdvance","label":"Cash Advance","width":"130"},
                    {"prop":"operation","label":"Operation","width":"167"},
                ],
                budgetInfo:[
                  {
                    budgetNature:"",
                    budgetDate:"",
                    costCenter:"",
                    currency:"",
                    amountHKD:'',
                    cashAdvance:"",
                    operation:"",
                  },
                ],
                budgetInfoForm:{
                    budgetNature:"",
                    budgetDate:"",
                    costCenter:"",
                    currency:"",
                    amountHKD:'',
                    cashAdvance:"",
                    operation:"",
                },
                budgetDetailTable:[
                    {"prop":"expenseItem","label":"Expense Item","width":"107"},
                    {"prop":"dateFrom","label":"Date From","width":"87"},
                    {"prop":"to","label":"To","width":"40"},
                    {"prop":"description","label":"Description","width":"92"},
                    {"prop":"currency","label":"Currency","width":"85"},
                    {"prop":"unitPrice","label":"Unit Price","width":"85"},
                    {"prop":"days","label":"Days","width":"52"},
                    {"prop":"total","label":"Total","width":"52"},
                    {"prop":"amountHKD","label":"Amount in HKD","width":"142"},
                    {"prop":"operation","label":"Operation","width":"130"},
                ],
                budgetDetail:[
                  {
                    expenseItem:"",
                    dateFrom:"",
                    to:"",
                    description:"",
                    unitPrice:'',
                    days:"",
                    total:"",
                    amountHKD:'',
                    operation:'',
                  },
                ],
                budgetDetailForm:{
                    expenseItem:"",
                    dateFrom:"",
                    to:"",
                    description:"",
                    unitPrice:'',
                    days:"",
                    total:"",
                    amountHKD:'',
                    operation:'',
                },
                expenses:[
                    {
                        label:'Per-Diem',
                        value:'perDiem',
                    },{
                        label:'Accommodation',
                        value:'accommodation',
                    },{
                        label:'Transportation',
                        value:'transportation',
                    },{
                        label:'Visa',
                        value:'visa',
                    },{
                        label:'Other',
                        value:'other',
                    },
                ],
                curType:[
                    {
                        label:'HKD',
                        value:'0',
                        exchange:1,
                    },
                    {
                        label:'RMB',
                        value:'1',
                        exchange:1.12,
                    },
                    {
                        label:'USD',
                        value:'2',
                        exchange:7.76,
                    },
                ]
            }
        },
        components:{

        },
        computed:{
          totalPrice:function(){
              var rate = this.curType[parseInt(this.ruleForm.curType)].exchange;
              var value =  this.ruleForm.days * this.ruleForm.unitPrice * rate;
              return Math.round(parseFloat(value)*100)/100;
          }
        },
        methods:{
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
        }
    }
</script>
