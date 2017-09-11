<template>
    <div id='transport'>
      <h4 class='doc-form_title'>Transportation</h4>
      <el-form  label-position="left" :model="ruleForm" :rules="rules"  ref="ruleForm" label-width="128px">

        <el-form-item class='form-box' label="Required Transportation">
          <el-col :span='12'>
            <el-radio-group v-model="ruleForm.reqTrans"  class="myRadio">
              <el-radio-button label="Yes">Yes<i></i></el-radio-button>
              <el-radio-button label="No">No<i></i></el-radio-button>
            </el-radio-group>
          </el-col>
        </el-form-item>

        <el-row>
          <el-col :span='20'>
            <el-col :span='4' class='el-form-item__label'>Passenger Info</el-col>
            <el-col :span='9' class='passenger-add'>
              You can add 9 passengers at most
              <i class='iconfont icon-1' @click="handleAdd()"></i>
            </el-col>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span='20'>
            <el-table border :data="tableDates" border >
              <el-table-column v-for='item in tranTable' :prop="item.prop" :label="item.label" :width='item.width' v-bind:resizable="false">
              </el-table-column>
              <el-table-column  prop="Handle" label=" "  v-bind:resizable="false" :width='56.5'>
                <template scope="scope">
                  <div @click="handleDelete(scope.$index, scope.row)">
                    <i class='iconfont icon-lajitong'></i>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col class='note'>Note:Please make sure passenger name is the same with travel document name, only english allowed, no blank.</el-col>
        </el-row>

        <el-form-item class='form-box' label="Flt Info"></el-form-item>

        <el-form-item class='form-box' label="Issued By">
          <el-radio-group v-model="ruleForm.reqTrans"  class="myRadio">
            <el-radio-button label="Manual">Manual<i></i></el-radio-button>
            <el-radio-button label="Automatic">Automatic<i></i></el-radio-button>
          </el-radio-group>
          <el-col class='note'>
            Manual : 	Staff Travel will notify the next process after Department Heads approval. <br />
            Automatic : HX air-tickets will be issued automatically after Department Heads approval.
          </el-col>
          <el-col>
            <el-button class='addBtn' >Add HX Flight</el-button>
            <el-button class='addBtn' @click='addFlight'>Add Other Carrier</el-button>
          </el-col>
        </el-form-item>

        <el-row>
          <el-col v-for='(item,index) in flightDates' >
            <el-form-item class='form-box' label="Departure Date" prop='depart'>
              <el-col :span='4'>
                <el-input v-model="ruleForm.depart">
                </el-input>
              </el-col>
              <el-col :span='2' class='formTitle'>
                From
              </el-col>
              <el-col :span='3'>
                <el-input v-model="ruleForm.from">
                </el-input>
              </el-col>
              <el-col :span='2' class='formTitle'>
                TO
              </el-col>
              <el-col :span='3'>
                <el-input v-model="ruleForm.to">
                </el-input>
              </el-col>
              <el-col :span='3' class='formTitle'>
                  Flight No.
              </el-col>
              <el-col :span='3'>
                <el-input v-model="ruleForm.flightNum">
                </el-input>
              </el-col>
              <el-col :span='1'>
                <i class='iconfont icon-lajitong' @click="flightDel(index-1)"></i>
              </el-col>
            </el-form-item>
          </el-col>

        </el-row>







      </el-form>
    </div>
</template>
<style scoped lang='scss'>
  .passenger-add{
    float: right;
    font-size: 14px;
    line-height: 46px;
    text-align: right;
    color: #393939;
  }
  .iconfont{
    color: #7C5598;
  }
  .icon-lajitong{
    padding-left:12px;
    font-size: 18px;
    line-height: 46px;
  }
  .note{
    color: #E40516;
    font-size: 12px;
    line-height: 14px;
    margin-bottom:15px;
  }
  .addBtn{
    width:200px;
    font-size: 16px;
    line-height: 26px;
    border-radius: 3px;
    border:1px solid #7C5598;
    color: #7C5598;
  }
  .formTitle{
    font-size: 16px;
    line-height: 46px;
    text-align: center;
    color: #393939;
  }
</style>
<script>
    export default{
        data(){
            return{
                tranTable:[
                  {"prop":"Surname","label":"Surname","width":"130"},
                  {"prop":"FirstName","label":"FirstName","width":"140"},
                  {"prop":"DateOfJoin","label":"Date of Join","width":"130"},
                  {"prop":"Department","label":"Department","width":"120"},
                  {"prop":"Position","label":"Position","width":"150"},
                ],
                ruleForm:{
                  reqTrans:'',
                  depart:'',
                  from:'',
                  to:'',
                  flightNum:'',
                },
                rules:{
                  depart:[
                      { required: true, message: '请输入Recipient', trigger: 'blur' },
                    ],
                },
                tableDates: [{
                        Surname: 'Lui',
                        FirstName: 'Yue',
                        DateOfJoin: '2013-12-02',
                        Department:'IT',
                        Position:'IT officer',
                        Handle:'',
                },
                {
                        Surname: 'Yuan',
                        FirstName: 'Meng',
                        DateOfJoin: '2015-12-02',
                        Department:'CSS',
                        Position:'CSS officer',
                        Handle:'',
                },
                {
                        Surname: 'Peng',
                        FirstName: 'Lu',
                        DateOfJoin: '2015-12-02',
                        Department:'JS',
                        Position:'JS officer',
                        Handle:'',
                }],
                tableDate:{
                       Surname: '',
                        FirstName: '',
                        DateOfJoin: '',
                        Department:'',
                        Position:'',
                        Handle:'',
                },
                flightDates:[
                  {
                    depart:'',
                    from:'',
                    to:'',
                    flightNum:'',
                  }
                ],
                flightDate:{
                    depart:'',
                    from:'',
                    to:'',
                    flightNum:'',
                }
            }
        },
        components:{

        },
        methods:{
            handleDelete(index, row) {
                this.tableDates.splice(index,1);
            },
            handleAdd(){
                alert("弹出表格")
            },
            addFlight(){
                this.flightDates.push(this.flightDate);
            },
            flightDel(index){
                this.flightDates.splice(index,1);
            }
        }
    }
</script>
