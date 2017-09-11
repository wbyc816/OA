<template>
  <div id='taskAssignment'>
    <el-card class="borderCard">
      <span slot="header">Task Assignment</span>
      <el-row :gutter="20">
        <el-col :span="12">
          <ul>
            <li>Task Assign & Rating</li>
            <li><span>UnCompleted: 0</span><span>Tasks Assigned</span></li>
            <li><span>Completed: 1</span><span>Task Completed & Rated</span></li>
            <li><span>Recent: 0</span><span>You Have 0 Task Need Follow</span></li>
            <li><el-button type="primary">Search</el-button> <el-button type="primary" @click="createTask">Create New Task</el-button></li>
          </ul>
        </el-col>
        <el-col :span="12">
          <ul>
            <li>My Task</li>
            <li><span>Upcoming</span><span>UnCompleted</span></li>
            <li><span>Completed: 4</span><span v-goto="{name:'taskList'}">Task Completed & Rated</span></li>
            <li><span>Recent: 0</span><span>You Have 0 New Tasks</span></li>
            <li><el-button type="primary">Search</el-button></li>
          </ul>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>

  export default{

    mounted(){
    },
    data(){
      return{

      };
    },

    methods:{
      createTask:function(){
        this.$router.push('/generalInfo/createTask')
      }
    },
    computed:{

    }
  }

</script>
<style lang='scss'>
  $purple:#7C5598;
  $brown: #985D55;
  #taskAssignment{
    .borderCard{
      padding-bottom: 0;
      .el-card__body{
        padding: 22px 20px 30px;
      }
    }
    ul{
      border-radius:5px;
      background: #EFEFEF;
      li:first-child{
        line-height:48px;
        font-size: 18px;
        color:#fff;
        background: $purple;
        padding: 0 15px;
        box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.16);
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
      }
      li:nth-child(n+2){
        line-height: 55px;
        font-size: 17px;
        border-bottom: 1px solid #E2E2E2;
        padding: 0 15px;
        margin-left: 5px;
        &>span:last-child{
          color:$purple;
          font-size: 15px;
          float: right;
          cursor: pointer;
        }
        button{
          color:#fff;
          font-size: 18px;
          border-radius: 2px;
          height: 46px;
          padding: 10px 20px;
        }
        button:nth-child(2){
          float: right;
          position: relative;
          top: 14px;
        }
      }
    }
    li:last-child{
      line-height: 74px !important;
      border-bottom: none !important;
    }
  }

</style>

