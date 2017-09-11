<template>
  <div id="docTracking">
    <el-card class="borderCard searchOptions">
      <div slot="header">
        <span>Doc Tracking</span>
        <i class="iconfont icon-shuaxin"></i>
      </div>
      <el-row :gutter="10">
        <el-col :span="6">
          <el-select v-model="urgency" placeholder="Urgency">
            <el-option v-for="item in urgencyOptions" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-select v-model="type" placeholder="Type">
            <el-option v-for="item in typeOptions" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-input placeholder="Proposer" icon="icon-jiantou" v-model="proposer"></el-input>
        </el-col>
        <el-col :span="6">
          <el-input placeholder="Handled By" icon="icon-jiantou" v-model="handledBy"></el-input>
        </el-col>
        <el-col :span="12">
          <el-select v-model="handledCategories" placeholder="Handled Categories">
            <el-option v-for="item in handledCategoriesOptions" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
        <el-col :span="12">
          <el-input placeholder="Subject"></el-input>
        </el-col>
        <el-col :span="6">
          <el-input placeholder="Doc ID"></el-input>
        </el-col>
        <el-col :span="12">
          <el-input placeholder="Apply Date "></el-input>
        </el-col>
        <el-col :span="6">
          <el-button class="searchButton">Search</el-button>
        </el-col>
      </el-row>
    </el-card>
    <table bgcolor="#fff" class="myTableList" width="100%" cellspacing="0">
      <caption>
      </caption>
      <thead align="left">
        <tr>
          <th v-for="title in tableTitle">{{title}}</th>
        </tr>
      </thead>
      <tbody v-for="doc in processData">
        <tr>
          <td>{{doc.Confidentiality}}</td>
          <td>{{doc.Urgency}}</td>
          <td>{{doc.Type}}</td>
          <td>{{doc.SubmitTime}}</td>
          <td>{{doc.Submitby}}</td>
          <td>{{doc.Proposer}}</td>
        </tr>
        <tr>
          <td>{{doc.No}}</td>
          <td colspan="3">{{doc.title}}</td>
          <td>
            <span v-if="doc.detail">
              <span @click="detailView = true">Detail</span> 
              <span>Withdraw</span>
              <span @click="contractView = true">Delete</span>
            </span>
          </td>
          <td @click="processView = true">View</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="3">Total: 4 Record(s).</td>
        </tr>
      </tfoot>
    </table>
    <el-dialog title="Doc Tracking Process" v-model="processView" size="large" class="myDialog processDialog">
      <div class="stepswrap">
        <el-steps direction="vertical" :active="processData.length-1" finish-status="process" process-status="finish" :center="true">
          <el-step></el-step>
          <el-step></el-step>
          <el-step></el-step>         
          <el-step></el-step>
          <el-step></el-step>
        </el-steps>
      </div>
      <el-table :data="processData"  class="myTable">      
        <el-table-column  width="44"></el-table-column>
        <el-table-column prop="Confidentiality" label="Confidentiality" width="100"></el-table-column>
        <el-table-column prop="Urgency" label="Urgency" width="75"></el-table-column>
        <el-table-column prop="HandledBy" label="Handled By" width="100"></el-table-column>
        <el-table-column prop="ViewingTime" label="Viewing Time" width="155"></el-table-column>
        <el-table-column prop="ProcessingTime" label="Processing Time" width="155"></el-table-column>
        <el-table-column prop="Deadline" label="Deadline" width="150"></el-table-column>
        <el-table-column prop="Overdue" label="Overdue" width="75"></el-table-column>
        <el-table-column prop="Status" label="Status" width="90"></el-table-column>
        <el-table-column prop="DepartmentTitle" label="Department/Title"></el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog title="Budget Form" v-model="detailView" size="large" class="myDialog detailDialog">
      <div class="information">
        <ul class="base">
          <li><span>Staff Information</span></li>
          <li><span>Proposer</span><span>Lei Ling Jin</span></li>
          <li><span>Doc ID</span><span>411032</span></li>
          <li><span>Staff No.</span><span>1000324713</span></li>
          <li><span>Staff HK No.</span><span>10037</span></li>
          <li><span>Company</span><span>HKA</span></li>
          <li><span>Department</span><span>IT</span></li>
          <li><span>Subject</span><span>Budget Form</span></li>
          <li><span>Reimbursement Staff</span><span>Alex Hu</span></li>
          <li><span>Contact No.</span><span>3014 0841</span></li>
          <li><span>Email</span><span>Alex.hu@hkairlines.com</span></li>
        </ul>
        <div class="description">
          <p>description</p>
          <p></p>
          <ul class="attachment">
            <li><span>Approval Path</span><span>IT</span></li>
            <li><span>Attachment</span><span>form.jpg</span></li>
          </ul>
        </div>
      </div>
      <el-table :data="budgetData" class="myTable">      
        <el-table-column prop="BudgetYear" label="Budget Year" width="120"></el-table-column>
        <el-table-column prop="UserOrganization" label="User Organization" width="150"></el-table-column>
        <el-table-column prop="BudgetNature" label="Budget Nature" width="140"></el-table-column>
        <el-table-column prop="CostCenter" label="Cost Center " width="130"></el-table-column>
        <el-table-column prop="Currency" label="Currency" width="120"></el-table-column>
        <el-table-column prop="AmountRequested" label="Amount Requested" width="150"></el-table-column>
        <el-table-column prop="AmountinHKD" label="Amount in HKD" width="150"></el-table-column>
        <el-table-column prop="CashAdvance" label="Cash Advance"></el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog title="Contract Doc" v-model="contractView" size="large" class="myDialog contractDialog">
      <div class="topButtons">     
        <el-button type="primary">Distribute</el-button>
        <el-button type="primary">Signed Distribute</el-button>
        <el-button type="primary">Restore</el-button>
        <el-button type="primary">Save as PDF</el-button>
        <el-button type="primary">Archive Doc</el-button>
      </div>
      <div class="information">
        <ul class="base">
          <li><span>Staff Information</span></li>
          <li><span>Proposer</span><span>Lei Ling Jin</span></li>
          <li><span>Doc ID</span><span>411032</span></li>
          <li><span>Staff No.</span><span>1000324713</span></li>
          <li><span>Staff HK No.</span><span>10037</span></li>
          <li><span>Company</span><span>HKA</span></li>
          <li><span>Department</span><span>IT</span></li>
          <li><span>Subject</span><span>Budget Form</span></li>
        </ul>
        <div class="description">
          <p>description</p>
          <p></p>
          <ul class="attachment">
            <li><span>Approval Path</span><span>IT</span></li>
            <li><span>Attachment</span><span>form.jpg</span></li>
          </ul>
        </div>
      </div>
      <div class="information infoBottom">
        <ul class="base">
          <li><span>Comments</span></li>
          <li><span>Agreed.</span><span>Alan LAI  2016-12-30 17:26:43</span></li>
          <li><span>Suggest to agree.</span><span>Alan LAI  2016-12-30 17:26:43</span></li>
        </ul>
        <ul class="base">
          <li><span>Distribution information</span></li>
          <li>
            <span><span>Distribution Process: Elaine HAU —> Jimmy WONG </span><span>Description</span></span>
            <span>Read Time:2016-12-31 10:58:47</span>
          </li>
          <li>
            <span><span>Distribution Process: Elaine HAU —> Jimmy WONG </span><span>Description</span></span>
            <span>Read Time:2016-12-31 10:58:47</span>
          </li>
        </ul>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  const urgencyOptions=[
  {
    value: '1',
    label: 'Normal'
  },{
    value: '2',
    label: 'Secret'
  },{
    value: '3',
    label: 'Top Secret'
  }]
  const typeOptions=[{
    value: '1',
    label: 'Contract Approval(New)'
  }]
  const handledCategoriesOptions=[{
    value: '1',
    label: 'Contract Approval(New)'
  }
  ]
  const tableTitle=['Confidentiality','Urgency','Type','Submit Time','Submit by','Proposer']
  const processData=
  [
  {
    Confidentiality: 'normal',
    Urgency: 'normal',
    Type: 'Contract Approval(New)',
    SubmitTime:'2016/12/10 23:12:34',
    ViewingTime:'2016/12/10 23:12:34',
    ProcessingTime:'2016/12/10 23:12:34',
    Deadline:'2016/12/10 23:12:34',
    Status:'Proposing',
    Overdue:'In time',
    DepartmentTitle:'IT/Manager,Project Management',
    Submitby:'Leo Jing',
    HandledBy:'Leo Jing',
    Proposer:'Rayo LEUNG',
    No:'401307',
    title:'Statement of work for WCAG - Beyondsoft',
    detail:false,
  }, {
    Confidentiality: 'normal',
    Urgency: 'normal',
    Type: 'Contract Approval(New)',
    SubmitTime:'2016/12/10 23:12:34',
    ViewingTime:'2016/12/10 23:12:34',
    ProcessingTime:'2016/12/10 23:12:34',
    Deadline:'2016/12/10 23:12:34',
    Status:'Proposing',
    Overdue:'In time',
    DepartmentTitle:'IT/Manager,Project Management',
    Submitby:'Leo Jing',
    HandledBy:'Leo Jing',
    Proposer:'Rayo LEUNG',
    No:'401307',
    title:'Statement of work for WCAG - Beyondsoft',
    detail:false,
  },{
    Confidentiality: 'normal',
    Urgency: 'normal',
    Type: 'Contract Approval(New)',
    SubmitTime:'2016/12/10 23:12:34',
    ViewingTime:'2016/12/10 23:12:34',
    ProcessingTime:'2016/12/10 23:12:34',
    Deadline:'2016/12/10 23:12:34',
    Status:'Proposing',
    Overdue:'In time',
    DepartmentTitle:'IT/Manager,Project Management',
    Submitby:'Leo Jing',
    HandledBy:'Leo Jing',
    Proposer:'Rayo LEUNG',
    No:'401307',
    title:'Statement of work for WCAG - Beyondsoft',
    detail:true,
  },{
    Confidentiality: 'normal',
    Urgency: 'normal',
    Type: 'Contract Approval(New)',
    SubmitTime:'2016/12/10 23:12:34',
    ViewingTime:'2016/12/10 23:12:34',
    ProcessingTime:'2016/12/10 23:12:34',
    Deadline:'2016/12/10 23:12:34',
    Status:'Proposing',
    Overdue:'In time',
    DepartmentTitle:'IT/Manager,Project Management',
    Submitby:'Leo Jing',
    HandledBy:'Leo Jing',
    Proposer:'Rayo LEUNG',
    No:'401307',
    title:'Statement of work for WCAG - Beyondsoft',
    detail:false,
  },{
    Confidentiality: 'normal',
    Urgency: 'normal',
    Type: 'Contract Approval(New)',
    SubmitTime:'2016/12/10 23:12:34',
    ViewingTime:'2016/12/10 23:12:34',
    ProcessingTime:'2016/12/10 23:12:34',
    Deadline:'2016/12/10 23:12:34',
    Status:'Proposing',
    Overdue:'In time',
    DepartmentTitle:'IT/Manager,Project Management',
    Submitby:'Leo Jing',
    HandledBy:'Leo Jing',
    Proposer:'Rayo LEUNG',
    No:'401307',
    title:'Statement of work for WCAG - Beyondsoft',
    detail:false, 
  }
  ]
  const budgetData=[
  {
    BudgetYear:'2017-01',
    UserOrganization: 'IT',
    BudgetNature: 'IT Activities',
    CostCenter: 'IT',
    Currency: 'CNY',
    AmountRequested: '8,500.00',
    AmountinHKD: '8,500.00',
    CashAdvance: 'No'

  }
  ]
  export default{
    data(){
      return{
        urgencyOptions,
        urgency:'',
        typeOptions,
        type:'',
        proposer:'',
        handledBy:'',
        handledCategoriesOptions,
        handledCategories:'',
        processData,
        tableTitle,
        processView:false,
        detailView:false,
        contractView:false,
        budgetData,
      }
    },
    components:{

    }
  }
</script>
<style lang='scss'>
  $purple: #7C5598;
  #docTracking{
    .searchOptions{
      .el-card__body{
        .el-col{
          margin-top:13px;
        }
        .el-select{
          width: 100%;
        }
      }
    }
    &>table{
      thead{
        background: $purple;
        color: #fff;
        font-size: 13px;  
        th{
          padding:6px 13px;
        }
        $widths: (1: 15%, 2: 10%, 3: 25%,4: 22%,5: 12%,6: 16%); 
        @each $num, $width in $widths {
          th:nth-child(#{$num}) {
            width: $width;
          }
        }      
      }
      td{
        padding:4px 13px;
        font-size: 14px;
      }
      tbody{
        tr:first-child{
          td{
            border-bottom:1px dashed #D5DADF;
          }
          
        }
        tr:last-child{
          td{
            border-bottom:1px solid #D5DADF;
            vertical-align: middle;
          }
          height: 76px;
          td{
            font-size: 15px;
          }
          td:nth-child(2){
            color: #151515;
          }
          td:nth-child(3),td:last-child{
            color:$purple;
            span{

              cursor: pointer;
            }
          }
          td:last-child{
            cursor: pointer;
          }
        }
      }
      tbody:nth-child(even){
        background: #F7F7F7;
      }
      tfoot{
        td{
          color:#95989A;
        }
      }
    }
    .myDialog{
      .el-dialog--large{ 
        display: table;       
        width: 1200px;
        top: 0 !important;
        bottom: 0;
        margin: auto !important;
        left: 0;
        right: 0;
        transform:none;
      }
      .el-dialog__body{
        padding: 0;
        position: relative;
      }
      .el-dialog__header{
        padding:13px 12px;
        border-bottom: 1px solid #F2F2F2;
        .el-dialog__title{
          color: #393939;
          font-size: 18px;
          font-weight: normal;
        }
        .el-dialog__close{
          color:#676767;
        }
      }
    }
    .myTable{
      border: none;
      &:after{
        width:0;
      }
      tr:hover > td{
        background:#fff;
      }
      tr:nth-child(even){
        td{
          background: #F7F7F7;
        }
      }
      th{
        height: 26px;
      }
      td{
        border: none;
      }
      .cell{
        padding-left: 5px;
        padding-right: 5px;
      }
    }
    @mixin base-ul{
      display: flex;
      width: 100%;
      .base{
        width: 38%;
        border-right: 1px solid #F2F2F2;
        margin:18px 0;
        padding-right: 25px;
        li{
          height: 50px;
          line-height: 50px;
          border-bottom: 1px solid #F2F2F2;
          padding-left: 24px;
          span{
            display: inline-block;
            position: relative;
            width: 50%;
            font-size: 15px;
            color: #393939;
          }
        }
        li:first-child{
          height: 35px;
          line-height: 15px;
        }
        li:last-child{
          border:none;
        }
      }
    }
    .description{
      width: 61%;
      font-size: 15px;
      position: relative;
      color:#393939;
      padding-left: 28px;
      p:first-child{
        color:$purple;
        height: 53px;
        line-height: 53px;
      }
      .attachment{  
        position: absolute;
        left: 0;
        bottom: 18px;
        width: 100%;
        box-sizing: border-box;
        padding-left: 28px;
        padding-right: 25px;
        li{
          height: 50px;
          line-height: 50px;
          border-bottom: 1px solid #f2f2f2;
          span{
            display: inline-block;
            
          }
          span:first-child{
            color:$purple;
            width: 20%;
          }
        }
        li:first-child{
          border-top: 1px solid #f2f2f2;
        }
        li:last-child{
          span:last-child{
            text-decoration: underline;
          }
        }
      }
    }    
    .processDialog{

      .el-dialog__body{
        .el-table{
          td{
            height: 68px;
          }
        }

        .stepswrap{
          position:absolute; 
          height:-moz-calc(100% - 28px);
          height:-webkit-calc(100% - 28px);
          height: calc(100% - 28px);
          z-index: 1;
          padding-top: 28px;
          width: 45px;
          .el-steps{
            height: 100%;   
            width: 32px;
            margin: 0 auto;
            padding: 18px 0 50px;
            box-sizing: border-box;
            .el-step__head.is-text.is-process{
              background-color: #777777;
              border-color: #777777;
            }
            .is-process{
              .el-step__line{
                background: #777777;
              }
            }
          }
        }

      }
    }
    .detailDialog{
      .information{
        @include base-ul;
        
      }
      .el-table{
        td{
          height: 54px;
        }
        .cell{
          padding-left: 20px;
          padding-right: 20px;
        }
      }
    }
    .paymentDialog{
      .el-dialog__body{
        position: static;
      }
      .savePdf{
        position: absolute;
        top: 4px;
        right: 50px;
        height: 35px;
        border-radius: 2px;
        width: 152px;
        border: none;
        font-size: 16px;
      }
      .staff{
        @include base-ul;
        .base{
          li span:first-child{
            color:$purple;
          }
        }
        .payment{
          width: 61%;
          border:none;
          padding-left:25px;
          li{
            padding-left: 14px;
            span:first-child{
              width:30%;
            }
          }
        }       
      }
      .el-table{
        td{
          height: 54px;
        }
        tr th:first-child .cell,tr td:first-child .cell{
          padding-left: 20px;
        }
        .cell{
          padding-left: 5px;
          padding-right: 5px;
        }
      }
    }
    .contractDialog{
      .el-dialog__body{
        position: static;
      }
      .topButtons{
        position: absolute;
        top: 4px;
        left:467px;
        button{
          border-radius: 2px;
          border: none;
          font-size: 16px;
          padding: 10px 20px;
        }
      }
      .information{
        @include base-ul;
        .base{
          margin-bottom: 0;
          li:first-child{
            span{
              color:$purple;
            }
            
          }
        }
      }
      .information:nth-child(2){
        padding-bottom: 8px;
        border-bottom: 10px solid $purple;
        .base{
          border-right: 2px solid #CECECE;
        }
      }
      .infoBottom{
        margin-bottom: 15px;
        .base{
          margin:0;
          li{
            height: 55px !important;
            line-height: 55px !important;
          }
        }
        .base:first-child{
          border-right: 2px solid #CECECE;
          li:not(:first-child){
            span:first-child{              
              top: -10px;
            }
            span:last-child{
              top:10px;
            }
          }
        }
        .base:last-child{
          padding-left: 28px;
          padding-right: 0;
          width: 61%;
          li{
            padding: 0;
            margin-right:25px;
          }
          li:not(:first-child){
            &>span:first-child{
              width:60%;
              top:9px;
              span{
                display: block;
                width: 100%;
                line-height: initial;
              }
            }
            &>span:last-child{
              width: 39%;
            }
          }
        }
      }
    }

  }


</style>
