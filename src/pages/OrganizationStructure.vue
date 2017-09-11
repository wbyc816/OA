<template>
  <div id='organizationStructure'>
    <el-row :gutter='12'>
      <el-col :span='18' >
        <el-row class="organBox">
          <el-col :span='7'>
            <organ-list></organ-list>
          </el-col>
          <el-col :span='17'>

            <ul class="organDetail">
              <li><span>Type  </span><span>Department</span></li>
              <li><span>Name EN</span><span>Management Office</span></li>
              <li><span>Name CN</span><span>Management Office</span></li>
              <li><span>ShortName</span><span></span></li>
              <li><span>Office Tel</span><span></span></li>
              <li><span>Fax</span><span></span></li>
              <li><span>Email </span><span></span></li>
              <li><span>Address</span><span>11/F One Citygate, 20 Tat Tung Road,Tung Chung, Lantau, Hong Kong</span></li>
              <li><span>Description</span><span></span></li>
            </ul>
          </el-col>
        </el-row>
      </el-col>

      <el-col :span='6'>
        <el-card>
          <div slot="header" class='doc-bar_title'>
            <span>Contact List</span>
          </div>
          <el-input placeholder="Staff Name" class="search">
            <el-button slot="append">Search</el-button>
          </el-input>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<style lang='scss'>
  $purple:#7C5598;
  #organizationStructure{
    .doc-bar_title{
      font-size: 18px;
      line-height: 20px;
    }
    .organBox{
      background: #fff;
      .el-col-17{
        position: relative;
      }
    }
    .organDetail{
      box-sizing: border-box;
      background: #fff;
      font-size: 15px;
      padding: 0 10px;
      width: 100%;    
      li{
        display: table;
        height: 52px;
        border-bottom: 1px solid #F2F2F2;
        width: 100%;
        span{
          display: table-cell;
          width: 50%;
          vertical-align: middle;
          
        }
        span:first-child{
          padding-left: 16px;
          color:$purple;
        }
        
      }
    }
  }

</style>
<script>
  import OrganList from '../components/organlist.component'
  export default{
    data(){
      return{
        breadcrumbItem:'',
        navMenu:[
        {
          type:'menu',index:'1',text:'Doc Submission',
        },
        {
         type:'submenu',
         text:'Reimbursement Summary',
         list:[{index:'1-1',text:'Reimbursement Summary'},{index:'1-2',text:'Outstanding Payment'},],
       },
       ]
     };
   },
   components:{
      OrganList
   },
   watch: {
    '$route'(to, from) {
      console.log(to);
      if(to.meta){
        this.breadcrumbItem = to.meta.breadcrumb;
      }
    }
  },
}

</script>
