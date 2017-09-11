<template>
  <div id="forms">
    <el-row class="organBox">
      <el-col :span='7'>
        <organ-list></organ-list>
      </el-col>
      <el-col :span='17'>
        <el-card class="borderCard searchOptions">
          <el-row :gutter="12">
            <el-col :span="24">
              <el-input placeholder="Form Title"></el-input>
            </el-col>
            <el-col :span="10">
              <el-input placeholder="Last Update From"></el-input>
            </el-col>
            <el-col :span="14">
              <el-input class="search">
                <el-button slot="append">Search</el-button>
              </el-input>
            </el-col>
          </el-row>
        </el-card>
        <el-table :data="searchData" class="myTable">      
          <el-table-column label="Form Title" width="180" class-name="clickItem">
            <template scope="scope">
              <p v-goto="{path:'/generalInfo/formDetail'}">{{ scope.row.FormTitle }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="CategoryName" label="Category Name" width="120"></el-table-column>
          <el-table-column prop="Department" label="Department" width="100"></el-table-column>
          <el-table-column prop="LastUpdate" label="Last Update" width="100" >
            <template scope="scope">
              <p>{{ scope.row.date }}</p>
              <p>{{ scope.row.time }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="IssusBy" label="IssusBy"> 
          </el-table-column>
        </el-table>
        <p class="total">Total: 4 Record(s).</p>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import OrganList from '../../components/organlist.component'
  const searchData=[
  {
    'FormTitle':'LSS project application form (Individual) (2)',
    'CategoryName': 'Lean Six Sigma',
    Department: 'HR&Admin',
    date:'2017-02-12',
    time:'18:31:31',
    IssusBy: 'Mavis Mak',
  },
  {
    'FormTitle':'LSS project application form (Individual) (2)',
    'CategoryName': 'Lean Six Sigma',
    Department: 'HR&Admin',
    date:'2017-02-12',
    time:'18:31:31',
    IssusBy: 'Mavis Mak',
  },
  {
    'FormTitle':'LSS project application form (Individual) (2)',
    'CategoryName': 'Lean Six Sigma',
    Department: 'HR&Admin',
    date:'2017-02-12',
    time:'18:31:31',
    IssusBy: 'Mavis Mak',
  },
  {
    'FormTitle':'LSS project application form (Individual) (2)',
    'CategoryName': 'Lean Six Sigma',
    Department: 'HR&Admin',
    date:'2017-02-12',
    time:'18:31:31',
    IssusBy: 'Mavis Mak',
  },
  ]
  export default{
    data(){
      return{
        searchData,
        handledBy:'',
      }
    },
    components:{
      OrganList
    },
    methods:{
      showDialog(){
        this.paymentView=true;
      }
    }
  }
</script>
<style lang='scss'>
  $purple: #7C5598;
  #forms{
    &>.el-row{
      background: #fff;
      .el-col-17{
        position: relative;
        .searchOptions{
          box-shadow: none;
          .el-card__body{
            .el-col{
              margin-top:13px;
            }
            .el-select{
              width: 100%;
            }
          }
        }
      }
    }

    .myTable{
      .cell{
        padding-left: 15px;
      }
      td{
        height: 70px;
      }
      td.clickItem{
        color:$purple;
        cursor: pointer;
      }
      .el-table__body-wrapper{
        tr:nth-child(odd){
         
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


</style>
