<template>
    <div>
      <h4 class='doc-form_title'>Budget Information</h4>
      <el-form label-position="left" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="128px">
        <el-row>
          <el-col :span='10'>
            <el-form-item  class='form-box' label="Budget Date">
              <el-col :span='18' >
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
            <el-form-item  class='form-box' label="User Organization" prop="userOrg">
              <el-col :span='18' >
                <el-input class="search"  v-model="ruleForm.userOrg">
                  <el-button slot="append">Select</el-button>
                </el-input>
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
            <el-input class="search"  v-model="ruleForm.rec">
              <el-button slot="append">Select</el-button>
            </el-input>
          </el-col>
          <el-col :span='3' :offset='1' class='budget-tag'>
            Cost Center
          </el-col>
        </el-form-item>

        <el-form-item  class='form-box' label="Amount Request">
          <el-col :span='14'>
            <el-input v-model="budgetDates.amountReq" >
            </el-input>
          </el-col>
          <el-col :span='3'  class='unit-price'>
            <el-select v-model="budgetType" placeholder="HKD">
              <el-option v-for="item in moneyType" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-col>
        </el-form-item>

        <el-form-item  class='form-box' label="Cash Advance">
          <el-col :span='6'>
            <el-radio-group v-model="ruleForm.cashAdvance"  class="myRadio">
              <el-radio-button label="Yes">Yes<i></i></el-radio-button>
              <el-radio-button label="No">No<i></i></el-radio-button>
            </el-radio-group>
          </el-col>
          <el-col :span='13' v-if='ruleForm.cashAdvance =="Yes"'>
            <el-col :span='4'><span>Amount</span></el-col>
            <el-col :span='17'><el-input v-model='ruleForm.Amount'></el-input></el-col>
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
  .unit-price{
    margin-left:10px;
  }
  .price-num{
    font-size: 16px;
    color: #E72332;
  }
  .budget-tag{
    line-height: 46px;
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
                budgetType:'',
                ruleForm: {
                      userOrg: '',
                      budgetDate:'',
                      cashAdvance:'',
                      Amount:'',
                },
                rules:{
                    userOrg:[
                      { required: true, message: '请输入User', trigger: 'blur' },
                    ],
                },
                pickerOptions0: {
                    disabledDate(time) {
                      return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                budgetTable:[
                    {"prop":"budgetNature","label":"Budget Nature","width":"117"},
                    {"prop":"costCenter","label":"Cost Center","width":"100"},
                    {"prop":"currency","label":"Currency","width":"82"},
                    {"prop":"amountReq","label":"Amount Request","width":"147"},
                    {"prop":"cashAdvance","label":"Cash Advance","width":"120"},
                    {"prop":"amountHKD","label":"Amount in HKD","width":"145"},
                    {"prop":"operation","label":"Operation","width":"160"},
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
                    budgetDate:"",
                    budgetNature:"",
                    costCenter:"",
                    currency:"",
                    amountReq:"",
                    amountHKD:"",
                    operation:"",
                },
                moneyType:[{
                        label:'Dollar',
                        value:'Dollar',
                    },
                    {
                        label:'RMB',
                        value:'RMB',
                    },
                    {
                        label:'Pound',
                        value:'Pound',
              },]
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
        }
    }
</script>
