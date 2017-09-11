<template>
    <div>
      <h4 class='doc-form_title'>Payment Information</h4>
      <el-form label-position="left" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="128px">

        <el-form-item  class='form-box' label="Payment" prop="payment">
          <el-col :span='18' >
            <el-input class="search"  v-model="ruleForm.payment">
              <el-button slot="append">Select</el-button>
            </el-input>
          </el-col>
        </el-form-item>

        <el-row>
          <el-col :span='10'>
            <el-form-item  class='form-box' label="Remittances" prop="remi">
              <el-col :span='20'>
                <el-input v-model="ruleForm.remi">
                </el-input>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span='10'>
            <el-form-item  class='form-box' label="Bank" prop="bank">
              <el-col :span='20'>
                <el-input v-model="ruleForm.bank">
                </el-input>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span='10'>
            <el-form-item  class='form-box' label="Due Date">
              <el-col :span='20'>
                <el-date-picker
                  v-model="ruleForm.budgetDate"
                  type="date"
                  :picker-options="pickerOptions0"
                  range-separator=","
                  format="dd/MM/yyyy"
                >
                </el-date-picker>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span='10'>
            <el-form-item  class='form-box' label="Company">
              <el-col :span='20'>
                <el-select v-model="ruleForm.company" placeholder="请选择">
                  <el-option v-for="item in companies" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item  class='form-box' label="User Organization" prop="userOrg">
          <el-col :span='18' >
            <el-input class="search" v-model="ruleForm.userOrg">
              <el-button slot="append">Select</el-button>
            </el-input>
          </el-col>
        </el-form-item>

        <el-form-item  class='form-box' label="Payment Type" prop="payType">
          <el-col :span='18' >
            <el-radio-group v-model="ruleForm.payType" class="myRadio">
              <el-radio-button label="installment">Installment Payment<i></i></el-radio-button>
              <el-radio-button label="final">Final Payment<i></i></el-radio-button>
            </el-radio-group>
          </el-col>
        </el-form-item>

        <el-form-item  class='form-box' label="Corresponding Contract" prop="corContract">
          <el-col :span='18' >
            <el-radio-group v-model="ruleForm.corContract" class="myRadio">
              <el-radio-button label="Yes">Yes<i></i></el-radio-button>
              <el-radio-button label="No">No<i></i></el-radio-button>
            </el-radio-group>
          </el-col>
        </el-form-item>

        <el-row>
          <el-col :span='11'>
            <el-form-item  class='form-box' label="CCN" prop="cnn">
              <el-col :span='20'>
                <el-input v-model="ruleForm.cnn">
                </el-input>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span='11'>
            <el-form-item  class='form-box' label="Contract Expiry Date" prop="contractDate">
              <el-col :span='20'>
                <el-date-picker
                  v-model="ruleForm.contractDate"
                  type="date"
                  :picker-options="pickerOptions0"
                  range-separator=","
                  format="dd/MM/yyyy"
                >
                </el-date-picker>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>

        <el-table border :data="budgetDates" border>
          <el-table-column v-for='item in budgetTable' :prop="item.prop" :label="item.label" :width='item.width' v-bind:resizable="false">
          </el-table-column>
        </el-table>

        <el-form-item  class='form-box' label="Budget Nature">
          <el-col :span='10'>
            <el-input class="search"  v-model="budgetDatesForm.budgetNature">
              <el-button slot="append">Select</el-button>
            </el-input>
          </el-col>
          <el-col :span='3' :offset='1' class='budget-tag'>
            Cost Center
          </el-col>
        </el-form-item>

        <el-row>
          <el-col :span='10'>
            <el-form-item  class='form-box' label="Budget Date">
              <el-col :span='20'>
                <el-date-picker
                  v-model="budgetDatesForm.budgetDate"
                  type="date"
                  :picker-options="pickerOptions0"
                  range-separator=","
                  format="dd/MM/yyyy"
                >
                </el-date-picker>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span='10'>
            <el-form-item  class='form-box' label="Invoice No" prop="invoiceNum">
              <el-col :span='20'>
                <el-input v-model="budgetDatesForm.invoiceNum">
                </el-input>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item  class='form-box' label="Payment Amount" prop='payAmount'>
          <el-col :span='14'>
            <el-input v-model="ruleForm.payAmount" >
            </el-input>
          </el-col>
          <el-col :span='4'  class='unit-price'>
            <el-select v-model="ruleForm.payMoneyType" placeholder="HKD">
              <el-option v-for="item in moneyType" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item  class='form-box' label="">
          <el-row>
            <el-col :span='14' class='price-color'>
              {{changeMoney}}
            </el-col>
            <el-col :span='4' class='unit-price'>
              HKD
            </el-col>
          </el-row>
        </el-form-item>

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
    color: #E40012;
    text-align: center;
  }
  .price-color{
    color: #E40012;
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
                ruleForm: {
                      payment: '',
                      remi: '',
                      bank: '',
                      dueDate: '',
                      company:'',
                      userOrg:'',
                      budgetDate:'',
                      payType:'',
                      corContract:'',
                      cnn:'',
                      contractDate:'',
                      payAmount:'',
                      payMoneyType:'',
                },
                rules:{
                    payment:[
                      { required: true, message: '请输入Recipient', trigger: 'blur' },
                    ],
                    remi:[
                      { required: true, message: '请输入Subject', trigger: 'blur' }
                    ],
                    bank:[
                      { required: true, message: '请选择一个级别', trigger: 'change' }
                    ],
                    userOrg:[
                      { required: true, message: '请选择一个级别', trigger: 'change' }
                    ],
                    payType:[
                      { required: true, message: '请选择一个级别', trigger: 'change' }
                    ],
                    corContract:[
                      { required: true, message: '请选择一个级别', trigger: 'change' }
                    ],
                    cnn:[
                      { required: true, message: '请选择一个级别', trigger: 'change' }
                    ],
                    contractDate:[
                      { required: true, message: '请选择一个级别', trigger: 'change' }
                    ],
                    invoiceNum:[
                      { required: true, message: '请选择一个级别', trigger: 'blur' }
                    ],
                    unitPrice:[
                      { required: true, message: '请选择一个级别', trigger: 'change' }
                    ],
                    payAmount:[
                      { required: true, message: '请选择一个级别', trigger: 'change' }
                    ],
                },
                pickerOptions0: {
                    disabledDate(time) {
                      return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                companies:[{
                    value: '选项1',
                    label: '黄金糕'
                  }, {
                    value: '选项2',
                    label: '双皮奶'
                  },],
                budgetTable:[
                    {"prop":"budgetNature","label":"Budget Nature","width":"142"},
                    {"prop":"costCenter","label":"Cost Center","width":"108"},
                    {"prop":"currency","label":"Currency","width":"94"},
                    {"prop":"amountReq","label":"Amount Requested","width":"140"},
                    {"prop":"amountHKD","label":"Amount in HKD","width":"92"},
                    {"prop":"refBudget","label":"Ref.Budget","width":"98"},
                    {"prop":"invoiceNum","label":"Invoice No","width":"88"},
                    {"prop":"operation","label":"Operation","width":"110"},
                ],
                budgetDates:[
                  {
                    budgetNature:"",
                    costCenter:"",
                    currency:"",
                    amountReq:"",
                    cashAdvance:'',
                    amountHKD:"",
                    operation:"",
                  },
                ],
                budgetDatesForm:{
                    budgetNature:"",
                    costCenter:"",
                    currency:"",
                    amountReq:"",
                    amountHKD:"",
                    operation:"",
                    budgetDate:'',
                    invoiceNum:'',
                },
                 moneyType:[{
                  value: '人民币',
                  label: 'RMB'
                },{
                  value: '美元',
                  label: 'Dollar'
                }, ],
                changeMoney:'0.00',
            }
        },
        components:{

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
          clearBtn:function(){},
        },
    }
</script>
