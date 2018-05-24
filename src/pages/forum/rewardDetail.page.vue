<template>
  <el-card>
     <span class="title">姓名:{{name}} <span>奖金：{{money}}</span></span>
      <el-table
      :data="rewardDatas"
      style="width: 100%"
      :row-class-name="tableRowClassName"
      @row-click="showDetail">
      <el-table-column
        prop="forumTitle"
        label="标题"
        >
      </el-table-column>
      <el-table-column
        prop="taskContent"
        label="回复"
        >
      </el-table-column>
     
      <el-table-column
        prop="taskTime"
        label="时间">
      </el-table-column>
      <el-table-column
        prop="money"
        label="奖金" 
        width="80">
      </el-table-column>
    </el-table>
   
      <back-button></back-button>
       <div class="pageBox" v-if="totalSize>0">
      <el-pagination @current-change="handleCurrentChange" :current-page="pageNumber" :page-size="10" layout="total, prev, pager, next, jumper" :total="totalSize">
      </el-pagination>
    </div>
  </el-card>

</template>

<style>
  .title{
    font-size: 16px;
  }
  .title span{
      margin-left:20px;
  }
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>

<script>
import BackButton from '../../components/backButtonAll.component.vue'
  export default {
    created() {
      this.getData();
    },
    components:{
      BackButton
    },
    methods: {
      showDetail(row){
        this.$router.push('/forumDetail/'+row.forumId)
      },
      tableRowClassName({row, rowIndex}) {
        if (rowIndex === 1) {
          return 'warning-row';
        } else if (rowIndex === 3) {
          return 'success-row';
        }
        return '';
      },
      getData(){
        this.money=this.$route.params.money;
        this.$http.post("/forum/getEmpContributeInfo", {
        "type":1,
        "pageNumber": this.pageNumber,
        "pageSize": 10,
        "empId":this.$route.params.id,
        }).then(res => {
          if (res.status == 0) {
            this.totalSize = res.data.total;
            this.rewardDatas = res.data.records;
          } else {
            this.tableData = [];
            this.total = 0;
          }
        }, res => {

        })

         this.$http.post("/emp/getEmpInfoById", {
            "id":this.$route.params.id,
        }).then(res => {
          if (res.status == 0) {
          
            this.name = res.data.name;
          } else {
            
          }
        }, res => {

        })
      },
      handleCurrentChange(page) {
        this.pageNumber = page;
        this.getData()
      },
    },
    data() {
      return {
        rewardDatas:[],
        pageNumber:1,
        totalSize:0,
        money:"",
        name:"",
      }
    }
  }
</script>