<template>
    <div>
      <h4 class='doc-form_title'>Budget Info</h4>
      <el-form  label-position="left" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="128px">

        <el-row>
          <el-col :span='10'>
            <el-form-item   class='form-box' label="Budget Date" >
              <el-col :span='21'>
                <el-input  v-model="ruleForm.dateForm">
                </el-input>
              </el-col>
            </el-form-item>
          </el-col>

          <el-col :span='10'>
            <el-form-item   class='form-box' label="Staff Name" prop='staffName'>
              <el-col :span='21'>
                <el-input placeholder="" class="search">
                  <el-button slot="append">Select</el-button>
                </el-input>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>

        <el-table border :data="budgetDates" border >
          <el-table-column v-for='item in budgetTable' :prop="item.prop" :label="item.label" :width='item.width' v-bind:resizable="false">
          </el-table-column>
          <el-table-column  prop="Handle" label=" " v-bind:resizable="false" :width='168'>
            <template scope="scope">
              <div @click="handleDelete(scope.$index, scope.row)">
                <i class='iconfont icon-wenjianfile'></i>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <el-form-item   class='form-box' label="Budget Nature" prop='budgetNature'>
          <el-col :span='18'>
            <el-input placeholder="" class="search" v-model='budgetTableForm.budgetNature'>
              <el-button slot="append">Select</el-button>
            </el-input>
          </el-col>
        </el-form-item>

        <el-form-item  class='form-box' label="Amount Requested" >
          <el-col :span='15'>
            <el-input v-model="budgetTableForm.amountReq" >
            </el-input>
          </el-col>
          <el-col :span='3'  class='unit-price'>
            <el-select v-model="budgetTableForm.budgetMoneyType" placeholder="HKD">
              <el-option v-for="item in moneyType" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="Total">
          <el-col class='price-num' :span='8' >{{ruleForm.totalPrice}}({{budgetTableForm.budgetMoneyType}})</el-col>
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
  .unit-price{
    margin-left:10px;
  }

</style>
<script>
    export default{
        data(){
            return{
                ruleForm:{
                    dateForm:"",
                    staffName:"",
                    totalPrice:'',
                },
                rules:{
                    staffName:[
                        { required: true, message: '请输入Staff Name', trigger: 'blur' },
                    ],
                    budgetNature:[
                        { required: true, message: '请输入Budget Nature', trigger: 'blur' },
                    ],
                },
                budgetTable:[
                {"prop":"budgetNature","label":"Budget Nature","width":"142"},
                {"prop":"costCenter","label":"Cost Center","width":"130"},
                {"prop":"currency","label":"Currency","width":"110"},
                {"prop":"amountReq","label":"Amount Requested","width":"170"},
                {"prop":"amountHKD","label":"Amount in HKD","width":"152"},
                ],
                budgetDates:[
                  {
                    budgetNature:"",
                    costCenter:"",
                    currency:"",
                    amountReq:"",
                    amountHKD:"",
                  },
                ],
                budgetTableForm:{
                    budgetNature:"",
                    costCenter:"",
                    currency:"",
                    amountReq:"",
                    amountHKD:"",
                    budgetMoneyType:'',
                },
                moneyType:[
                    {
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
                    },
                ]
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
                for(var index in this.budgetTableForm){
                    this.budgetTableForm[index] = "";
                }
            }

        }
    }
</script>
