<template>
  <el-card>
    姓名：{{name}} 奖金：{{money}} 点赞：{{praise}} 采纳：{{adopt }}
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
        width="100">
      </el-table-column>
      <el-table-column
        prop="praiseCount"
        label="点赞"
        width="100">
      </el-table-column>
       <el-table-column
        prop="isAdopt"
        label="是否采纳"
        width="100">
        <template scope="scope">
            {{scope.row.isAdopt=="1"?"已采纳":"未采纳"}}
        </template>
      </el-table-column>
    </el-table>
    <div class="pageBox" v-if="totalSize>0">
      <el-pagination @current-change="handleCurrentChange" :current-page="pageNumber" :page-size="10" layout="total, prev, pager, next, jumper" :total="totalSize">
      </el-pagination>
    </div>
    <back-button></back-button>
  </el-card>
 
</template>

<style>
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
        this.adopt=this.$route.params.adopt;
        this.praise=this.$route.params.praise;
        this.$http.post("/forum/getEmpContributeInfo", {
        "type":4,
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