<template>
  <div id="taskList">
  <el-card class="borderCard searchResult">
    <span slot="header">My Completed Task</span>
    <el-table :data="searchData" class="myTable">      
      <el-table-column prop="TaskID" label="Task ID" width="110"></el-table-column>
      <el-table-column prop="TaskName" label="Task Name" width="130"></el-table-column>
      <el-table-column prop="AssignBy" label="Assign By" width="90"></el-table-column>
      <el-table-column prop="TaskLevel" label="Task Level" width="90"></el-table-column>
      <el-table-column  label="Deadline" width="105">
        <template scope="scope">
          <p>{{ scope.row.date }}</p>
          <p>{{ scope.row.time }}</p>
        </template>
      </el-table-column>      
      <el-table-column  label="Create Time" width="105">
        <template scope="scope">
          <p>{{ scope.row.date }}</p>
          <p>{{ scope.row.time }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="Summary" label="Summary" width="100"></el-table-column>
      <el-table-column prop="Evaluation" label="Evaluation" width="80"></el-table-column>
      <el-table-column label="" class-name="clickItem"> 
        <template scope="scope">
          <span>Detail</span>
        </template>
      </el-table-column>
    </el-table>
    <p class="total">Total: 3 Record(s).</p>
  </el-card>
</div>
</template>
<script>
  const searchData=[
  {
    'TaskID':'108471081',
    'TaskName': 'IT Service Request Sorting',
    AssignBy: 'So Group',
    TaskLevel: 'General',
    date:'2017-02-12',
    time:  '18:31:31',
    Summary: 'Completed',
    Evaluation: 'Yes'
  },
  {
    'TaskID':'108471081',
    'TaskName': 'IT Service Request Sorting',
    AssignBy: 'So Group',
    TaskLevel: 'General',
    date:'2017-02-12',
    time:  '18:31:31',
    Summary: 'Completed',
    Evaluation: 'Yes'
  },
  {
    'TaskID':'108471081',
    'TaskName': 'IT Service Request Sorting',
    AssignBy: 'So Group',
    TaskLevel: 'General',
    date:'2017-02-12',
    time:  '18:31:31',
    Summary: 'Completed',
    Evaluation: 'Yes'
  }
  ]

  export default{
    data(){
      return{
        searchData,
      }
    },
    components:{

    },
    methods:{
      
    }
  }
</script>
<style lang='scss'>
  $purple: #7C5598;
  #taskList{
    .searchResult{
      padding-bottom: 0;
      tr th:first-child .cell{           
              padding-left: 15px;           
          }
      .el-card__body{
        padding: 0;
        .el-table{
          tr td:first-child .cell{
            padding-left: 15px;
          }
          
          td{
            height: 70px;
          }
          td.clickItem{
            color:$purple;
            cursor: pointer;
          }
          td.timeItem{
            padding-right: 25px;
          }
        }
      }
      .total{
        height: 33px;
        line-height: 33px;
        padding-left: 15px;
        font-size: 14px;
        color: #95989A;
      }    
    }    
  }


</style>
