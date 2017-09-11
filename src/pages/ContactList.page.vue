<template>
  <div id="contactList">
    <el-row>
      <el-col :span='5'>
        <organ-list></organ-list>
      </el-col>
      <el-col :span='19'>
        <el-card class="borderCard searchOptions">
          <el-row :gutter="12" class="inputBox">
            <el-col :span="7">
              <el-input>
                <template slot="prepend">Staff Name</template>
              </el-input>
            </el-col>
            <el-col :span="7">
              <el-input>
                <template slot="prepend">Mobile No.</template>
              </el-input>
            </el-col>
            <el-col :span="7">
              <el-input>
                <template slot="prepend">Fax No.</template>
              </el-input>
            </el-col>
            <el-col :span="7">
              <el-input>
                <template slot="prepend">Direct Line</template>
              </el-input>
            </el-col>
            <el-col :span="7">
              <el-input>
                <template slot="prepend">Email</template>
              </el-input>
            </el-col>
            <el-col :span="3">
              <el-button type="primary">Search</el-button>
            </el-col>
            <el-col :span="4">
              <el-button type="primary">Group Contact</el-button>
            </el-col>
          </el-row>
        </el-card>
        <el-table :data="searchData" class="myTable">      
          <el-table-column prop="StaffName" label="Staff Name" width="110"></el-table-column>
          <el-table-column prop="Company" label="Company" width="80"></el-table-column>
          <el-table-column prop="Department" label="Department" width="100"></el-table-column>
          <el-table-column prop="Position" label="Position" width="80"></el-table-column>
          <el-table-column prop="DirectLine" label="Direct Line" width="125"></el-table-column>
          <el-table-column prop="FaxNo" label="Fax No." width="100"></el-table-column>
          <el-table-column prop="MobileNo" label="Mobile No." width="125"></el-table-column>
          <el-table-column prop="Email" label="Email" width="140"></el-table-column>
          <el-table-column prop="Location" label="Location"></el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import OrganList from '../components/organlist.component'
  const searchData=[
  {
    'StaffName':'Sandy Wong',
    'Company': 'HKA',
    Department: 'HR&Admin',
    Position:'Officer',
    DirectLine:'(852)3467 6541',
    FaxNo: '',
    MobileNo: '(852)3467 6541',
    Email: 'Sandy.wong@hkairlines.com',
    Location: '',
  },
  {
    'StaffName':'Mavis Mak',
    'Company': 'HKA',
    Department: 'HR&Admin',
    Position:'Officer',
    DirectLine:'(852)3467 6541',
    FaxNo: '',
    MobileNo: '(852)3467 6541',
    Email: 'Sandy.wong@hkairlines.com',
    Location: '',
  },
  {
    'StaffName':'Luke Liu',
    'Company': 'HKA',
    Department: 'HR&Admin',
    Position:'—',
    DirectLine:'(852)3467 6541',
    FaxNo: '',
    MobileNo: '(852)3467 6541',
    Email: 'Sandy.wong@hkairlines.com',
    Location: '',
  },
  {
    'StaffName':'Sandy Wong',
    'Company': 'HKA',
    Department: 'HR&Admin',
    Position:'Officer',
    DirectLine:'(852)3467 6541',
    FaxNo: '',
    MobileNo: '(852)3467 6541',
    Email: 'Sandy.wong@hkairlines.com',
    Location: '',
  },
  ]
  export default{
    data(){
      return{
        searchData,
        
      }
    },
    components:{
      OrganList
    },
    methods:{
     
    }
  }
</script>
<style lang='scss'>
  $purple: #7C5598;
  #contactList{
    &>.el-row{
      background: #fff;
      .el-col-19{
        position: relative;
        .searchOptions{
          box-shadow: none;
          .el-card__body{
            .el-col{
              margin-top:13px;
            }
          }
        }
      }
    }
    .inputBox{
      .el-input-group__prepend{
        width: 90px;
        box-sizing: border-box;
        color: #393939;
        border: none;
      }
      button{
        width: 100%;
        height: 46px;
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
    }
    
  }


</style>
