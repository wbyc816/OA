<template>
    <div id="budget-info">
      <h4 class='doc-form_title'>Budget Info</h4>
      <el-table border :data="budgetDates" border>
        <el-table-column v-for='item in budgetTable' :prop="item.prop" :label="item.label" :width='item.width' v-bind:resizable="false">
        </el-table-column>
        <el-table-column  prop="Handle" label=" " v-bind:resizable="false" :width='51'>
          <template scope="scope">
            <div @click="handleDelete(scope.$index, scope.row)">
              <i class='iconfont icon-1'></i>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-form  label-position="left" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="128px">
        <el-form-item class='form-box' label="Expense Item" prop="expense">
            <el-col :span='8'>
              <el-select class='item-select' v-model="ruleForm.expense" placeholder=" ">
                <el-option v-for="item in expenses" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-col>
          <span class='budgetExpense'>
            Budget Nature Business Trip & Accommodation & Allowance
          </span>
        </el-form-item>
        <el-row>
          <el-col :span='11'>
            <el-form-item   class='form-box' label="Date" prop='dateForm'>
              <el-col :span='22'>
                <el-input  v-model="ruleForm.dateForm">
                </el-input>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span='11'>
            <el-form-item   class='form-box' label="Description" prop='description'>
              <el-col :span='22'>
                <el-input  v-model="ruleForm.description">
                </el-input>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span='11'>
            <el-form-item   class='form-box' label="Days" prop='days'>
              <el-col :span='22'>
                <el-input  v-model.number="ruleForm.days">
                </el-input>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span='11'>
            <el-form-item   class='form-box' label="Unit Price" prop='unitPrice'>
              <el-col :span='13'>
                <el-input  v-model.number="ruleForm.unitPrice">
                </el-input>
              </el-col>
              <el-col :offset="1" :span='8'>
                <el-select v-model="ruleForm.curType" placeholder=" ">
                  <el-option v-for="item in curType" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="Total">
          <el-col class='price-num' :span='8' >{{totalPrice}}(HKD)</el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span='6' class='budget-btn add-btn'>
            <el-button @click="addBtn('ruleForm')">Add</el-button>
          </el-col>
          <el-col :span='4' :offset='1' class='budget-btn clear-btn'>
            <el-button @click="clearBtn()">Clear</el-button>
          </el-col>
        </el-form-item>
      </el-form>
    </div>
</template>
<style scoped lang='scss'>
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
                budgetTable:[
                  {"prop":"expense","label":"Expense Item","width":"126"},
                  {"prop":"dateForm","label":"Date Form","width":"106"},
                  {"prop":"to","label":"To","width":"51"},
                  {"prop":"description","label":"Description","width":"113"},
                  {"prop":"currency","label":"Currency","width":"96"},
                  {"prop":"unitPrice","label":"Unit Price","width":"71"},
                  {"prop":"days","label":"Days","width":"71"},
                  {"prop":"total","label":"Total","width":"93"},
                  {"prop":"amount","label":"Amount in HKD","width":"93"},
                ],
                budgetDates:[
                  {
                    expense:"",
                    dateForm:"",
                    to:"",
                    description:"",
                    currency:"",
                    unitPrice:"",
                    curType:"",
                    days:"",
                    total:"",
                    amount:"",
                    handle:"",
                  },
                ],
                ruleForm:{
                    expense:"",
                    dateForm:"",
                    to:"",
                    description:"",
                    currency:"",
                    unitPrice:"",
                    curType:"1",
                    days:"",
                    total:"",
                    amount:"",
                    handle:"",
                },
                rules:{
                    expense:[
                      { required: true, message: '请输入Expense Item', trigger: 'blur' },
                    ],
                    dateForm:[
                      { required: true, message: '请输入Date Form', trigger: 'blur' },
                    ],
                    description:[
                      { required: true, message: '请输入Description', trigger: 'blur' },
                    ],
                    unitPrice:[
                      { type:"number", message: '请输入Unit Price' },
                    ],
                    curType:[
                      { required: true, message: '请输入Currency Type', trigger: 'blur' },
                    ],
                    days:[
                      { type:"number", message: '请输入数字', trigger: 'change' },
                    ],
                },
                expenses:[
                    {
                        label:'Expense Item',
                        value:'expenseItem',
                    },
                    {
                        label:'Accommodation',
                        value:'accommodation',
                    },
                    {
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
        computed:{
          totalPrice:function(){
              var rate = this.curType[parseInt(this.ruleForm.curType)].exchange;
              var value =  this.ruleForm.days * this.ruleForm.unitPrice * rate;
              return Math.round(parseFloat(value)*100)/100;
          }
        },
        components:{

        },
        methods:{
            handleDelete(index, row) {
                this.budgetDates.splice(index,1);
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
                for(var index in this.ruleForm){
                    this.ruleForm[index] = "";
                }
            }

        }
    }
</script>
