<template>
  <div id="docSearch">
    <el-card class="borderCard searchOptions">
      <div slot="header">
        <span>公文查询</span>
        <i class="iconfont icon-shuaxin"></i>
      </div>
      <el-row :gutter="10">
        <el-col :span="6">
          <el-select v-model="urgencyValue" placeholder="重要程度">
            <el-option label="全部" value="0"></el-option>
            <el-option v-for="item in urgency" :label="item.dictName" :value="item.dictCode"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-select v-model="params.type" placeholder="公文类型">
            <el-option v-for="item in typeOptions" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
        <el-col :span="12">
          <el-input placeholder="公文标题" v-model="params.keyWords"></el-input>
        </el-col>
        <el-col :span="6">
          <el-input placeholder="公文编号" v-model="params.docNo"></el-input>
        </el-col>
        <el-col :span="12">
          <el-date-picker
            v-model="params.startTime"
            type="date"
            placeholder="选择呈报日期">
          </el-date-picker>
        </el-col>
        <el-col :span="6">
          <el-button class="searchButton" @click="getDate">搜索</el-button>
        </el-col>
      </el-row>
    </el-card>
    <table bgcolor="#fff" class="myTableList" width="100%" cellspacing="0"  v-loading.body="searchLoading" >
      <caption>
      </caption>
      <thead align="left">
        <tr>
          <th v-for="title in tableTitle">{{title}}</th>
        </tr>
      </thead>
      <tbody v-for="doc in docData">
        <tr>
          <td>{{doc.docNo}}</td>
          <td>{{doc.docTitle}}</td>
          <td>{{doc.docTypeCode}}</td>
          <td>{{doc.taskTime}}</td>
          <td>{{doc.taskUser}}</td>
          <td>{{doc.nodeName | nodeNameFormatter}}</td>
          <td><router-link :to="'/doc/docDetail/'+doc.id">查看</router-link></td>
        </tr>
      </tbody>
    </table>
    <div class="pageBox" v-if="totalSize>0">
      <el-pagination @current-change="handleCurrentChange" :current-page="params.pageNumber" :page-size="10" layout="total, prev, pager, next, jumper" :total="totalSize">
      </el-pagination>
    </div>
 <el-dialog title="流转详情" v-model="processView" size="large" class="myDialog processDialog">
      <div class="stepswrap">
        <el-steps direction="vertical" :active="processData.length-1" finish-status="process" process-status="finish" :center="true">
          <el-step v-for="step in processData"></el-step>
        </el-steps>
      </div>
      <el-table :data="processData"  class="myTable">      
        <el-table-column  width="44"></el-table-column>s
        <el-table-column prop="taskUserName" label="审批人" width="100"></el-table-column>
        <el-table-column prop="startTime" label="审批时间" width="155"></el-table-column>
        <el-table-column prop="截至时间" label="截至时间" width="150"></el-table-column>
        <el-table-column prop="时限" label="时限" width="75"></el-table-column>
        <el-table-column prop="nodeName" label="状态" width="90"  :formatter="formatter"></el-table-column>
        <el-table-column prop="taskDeptMajorName" label="部门"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  const typeOptions=[{
    value: '1',
    label: 'Contract Approval(New)'
  }]
  const handledCategoriesOptions=[{
    value: '1',
    label: 'Contract Approval(New)'
  }
  ]
  const tableTitle=['公文号','标题','类型','呈报时间','呈报人','状态','操作']
  export default{
    data(){
      return{
        urgencyValue:"",
        typeOptions,
        type:'',
        proposer:'',
        handledBy:'',
        handledCategoriesOptions,
        handledCategories:'',
        tableTitle,
        processView:false,
        detailView:false,
        contractView:false,
        params:{
          "keyWords": "",
          "docNo": "",
          "taskUserName": "",
          "taskDeptName": "",
          "taskDeptId": "",
          "docType": "",
          "startTime": "",
          "userId": "",
          "pageNumber":1,
          "pageSize":5
        },
        processData:[],
        docData:[],
        totalSize:0,
        searchLoading:false
      }
    },
    computed: {
      ...mapGetters([
        'userInfo',
        'confidentiality',
        'urgency'
      ])
    },
    components:{

    },
    created() {
      this.$store.dispatch('getConfident');
      this.$store.dispatch('getUrgency');
      this.params.userId=this.userInfo.empId;
      this.getDate();
    },
    methods:{
      getDate(){
        this.searchLoading=true;
        this.$http.post("/doc/selectDocList",this.params,{body:true}).then(res=>{
          this.searchLoading=false;
          if(res.data.status==0){
            this.docData=res.data.data.dList;
            this.totalSize=res.data.data.totalSize;
          }
        },res=>{

        })
      },
      getProcess(id){
        this.processView=true;
        this.$http.post("/doc/getTaskDetail",{id:id}).then(res=>{
          this.processData=res.data.data;
        },res=>{

        })
      },
      formatter(row, column, cellValue) {
        switch (cellValue) {
          case "start":
            return "发起";
            break;
          case 'task':
            return "批核";
            break;
          case 'trans':
            return "转发";
            break;
          case 'end':
            return "归档";
            break;

          default:
            return cellValue;
        }
      },
      handleCurrentChange(page) {
        this.params.pageNumber=page;
        this.getDate()
      }
    }
  }
</script>
<style lang='scss'>
  $purple: #0460AE;
  #docSearch{
    .pageBox{
      text-align: right;
      margin-top:20px;
    }
    margin-bottom:30px;
    .searchOptions{
      .el-card__body{
        .el-col{
          margin-top:13px;
        }
        .el-select{
          width: 100%;
        }
      }
      padding-bottom:10px;
    }
    .el-date-editor.el-input{
      width:100%;
    }
    &>table{
      thead{
        background: $purple;
        color: #fff;
        font-size: 13px;  
        th{
          padding:6px 13px;
        }
        $widths: (1: 15%, 2: 25%, 3: 15%,4: 15%,5: 10%,6: 10%,7:10%); 
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
