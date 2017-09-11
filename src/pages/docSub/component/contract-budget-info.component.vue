<template>
    <div>
      <h4 class='doc-form_title'>Subject Information</h4>
      <el-form label-position="left" :model="budgetDatesForm" ref="budgetDatesForm" label-width="128px">
        <el-form-item  class='form-box' label="User Organization">
          <el-col :span='18'>
            <el-input v-model="userOg">
            </el-input>
          </el-col>
        </el-form-item>

        <el-table border :data="budgetDates" border>
          <el-table-column v-for='item in budgetTable' :prop="item.prop" :label="item.label" :width='item.width' v-bind:resizable="false">
          </el-table-column>
        </el-table>

        <el-row>
          <el-col :span='10'>
            <el-form-item  class='form-box' label="Budget Date">
              <el-col :span='18'>
                <el-date-picker
                  v-model="budgetDate"
                  type="date"
                  :picker-options="pickerOptions0"
                  range-separator=","
                  format="dd/MM/yyyy"
                  @change="done"
                >
                </el-date-picker>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span='10'>
            <el-form-item  class='form-box' label="Budget Nature">
              <el-col :span='19'>
                <el-input v-model="userOg" class='search'>
                  <el-button slot="append">Select</el-button>
                </el-input>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item  class='form-box' label="Amount Request">

          <el-col :span='6'>
            <el-input v-model="budgetDates.amountReq" >
            </el-input>
          </el-col>
          <el-col :span='3'  class='unit-price'>
            <el-select v-model="amountType" placeholder="HKD">
              <el-option v-for="item in moneyType" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-col>
        </el-form-item>

        <el-form-item label="Total">
          <el-col class='price-num' :span='8' >{{totalPrice}}({{amountType}})</el-col>
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
              userOg:'',
              amountType:'',
              budgetDate:'',
              totalPrice:'',
              budgetTable:[
                    {"prop":"budgetDate","label":"Budget Date","width":"110"},
                    {"prop":"budgetNature","label":"Budget Nature","width":"110"},
                    {"prop":"costCenter","label":"Cost Center","width":"110"},
                    {"prop":"currency","label":"Currency","width":"85"},
                    {"prop":"amountReq","label":"Amount Request","width":"165"},
                    {"prop":"amountHKD","label":"Amount in HKD","width":"145"},
                    {"prop":"operation","label":"Operation","width":"146"},
                  ],
              budgetDates:[
                {
                  budgetDate:"",
                  budgetNature:"",
                  costCenter:"",
                  currency:"",
                  amountReq:"",
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
              pickerOptions0: {
                disabledDate(time) {
                  return time.getTime() < Date.now() - 8.64e7;
                }
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
        methods: {
            done(val){
                console.log(val);
                if(!val){return};
                this.DepartDate=val.split(",")[0];
                if(this.type=='daterange'){
                  this.ReturnDate=val.split(",")[1];
                }else{
                  this.ReturnDate=this.DepartDate;
                }
            },
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
                for(var index in this.appTableForm){
                    this.appTableForm[index] = "";
                }
            }
        }
    }
</script>
