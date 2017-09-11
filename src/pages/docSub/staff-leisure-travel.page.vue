<template>
  <div id='leisure'>
    <el-card>
      <div slot="header" class='doc_title'>
        <span v-text='docTitile'></span>
      </div>
      <div>
        <el-row class='travel-info'>
          <el-col class='travel-info-tag'>Nomination Year</el-col>
          <el-col :span='3'>2017</el-col>
          <el-col class='travel-info-tag'>Service Start Date</el-col>
          <el-col :span='3'>2013-12-02</el-col>
        </el-row>
        <el-row  class='travel-info'>
          <el-col  class='travel-info-tag'>Position</el-col>
          <el-col :span='3'>IT Officer</el-col>
          <el-col class='travel-info-tag'>Working Location</el-col>
          <el-col :span='3'></el-col>
        </el-row>
        <el-row class='travel-info'>
          <el-col class='travel-info-tag'>Ticket Type</el-col>
          <el-col  :span="6">
            <el-select v-model="ticketType" placeholder=" ">
              <el-option v-for="item in travelType" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row class='travel-info'>
          <el-col class='travel-info-tag'>&nbsp;</el-col>
          <el-col :span="6">
            <el-button>Add Passenger</el-button>
          </el-col>
        </el-row>

        <el-table border :data="passDates" border>
          <el-table-column v-for='item in passTable' :prop="item.prop" :label="item.label" :width='item.width' v-bind:resizable="false">
          </el-table-column>
        </el-table>

        <el-row :gutter='15' class='travel-route'>

          <el-col  :md='10' :span='24'>
            <el-col class='travel-info-tag'>Flight Date</el-col>
            <el-col :span='12'>
              <el-date-picker
              v-model="value6"
              type="date"
              :picker-options="pickerOptions0"
              range-separator=","
              format="dd/MM/yyyy"
              @change="done">
            </el-date-picker>
          </el-col>
        </el-col>

        <el-col  :md='14' :span='24'>
          <el-col :span='6'>Routing From</el-col>
          <el-col :span='8'>
            <el-input></el-input>
          </el-col>
          <el-col :span='2'>To</el-col>
          <el-col :span='8'>
            <el-input></el-input>
          </el-col>
        </el-col>

      </el-row>
      
      <subject class='doc-section sub'></subject>
      <el-form label-position="left" :model="ruleForm1"  label-width="128px" class="addForm">
        <el-form-item  class='form-box' label="Contact No" prop="sub" required>
          <el-col :span='18'>
            <el-input v-model="ruleForm1.Contact">
            </el-input>
          </el-col>
        </el-form-item>
        <el-form-item  class='form-box' label="Email" prop="sub" required>
          <el-col :span='18'>
            <el-input v-model="ruleForm1.Email">
            </el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <description class='doc-section dec'></description>
      <div class='doc-form-submit_btn'>
        <el-button type="primary" >Submit</el-button>
      </div>
    </div>
  </el-card>


</div>
</template>
<style lang='scss'>
  #leisure{
    color:#393939;
    .sub{
      border-top: 1px dashed #D5DADF;
      padding-top: 30px;
      margin-bottom: 0;
    border-bottom: none;
      h4{
        display: none;
      }
      .el-form--label-left{
        .el-form-item:first-child{
          display: none;
        }
      }
    }
    .addForm{
      .el-form-item{
        margin-bottom: 32px;
      }
    }
    .dec{
      h4{
        display: none;
      }
      .el-form-item:nth-child(2){
        display: none;
      }
    }
  }
  #leisure .travel-info{
    margin:27px 0;
  }
  #leisure .travel-info-tag{
    width:138px;
  }
  #leisure .travel-info button{
    width:100%;
    height:46px;
    border-radius: 3px;
    color: #7c5598;
    border-color: #7c5598;
    line-height: 26px;
  }
  .travel-route{
    margin:28px 0;
    line-height: 46px;
  }
</style>
<script>
  import Subject from './component/subject.component.vue'
  import Description from './component/description.component.vue'
  import searchDate from'../../components/searchDate.vue'
  export default{
    data(){
      return{
        docTitile:"Staff Leisure Travel",
        ticketType:'',
        travelType:[
        {
          label:'FOC',
          value:'FOC',
        },
        {
          label:'ZED',
          value:'ZED',
        },
        {
          label:'HU',
          value:'HU',
        },
        ],
        passTable:[
        {"prop":"number","label":"No.","width":"72"},
        {"prop":"name","label":"Name of Passenger","width":"200"},
        {"prop":"year","label":"Nomination Year","width":"200"},
        {"prop":"rel","label":"Relationship","width":"200"},
        {"prop":"opr","label":"Operation","width":"200"},
        ],
        passDates:[
        {
          number:"",
          name:"",
          year:"",
          rel:"",
          opr:"",
        },
        ],
        tripType:'date',
        tripFrom:'',
        tripTo:'',
        value6: '',
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        ruleForm1:{
          Contact:'',
          Email:''
        }
      }
    },
    components:{
      Subject,
      Description,
      searchDate,
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
      }
    },
  }
</script>
