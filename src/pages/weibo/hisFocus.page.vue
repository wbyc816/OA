<template>
  <div id="hisFocus">
    <el-card class="borderCard StaffList">
      <div slot="header">
        His Focus
      </div>
      <el-row class="box">
        <template v-for="o in 5">
          <el-col :span="12">
            <el-row class="focusBox" :gutter="10">
              <el-col :span="6">
                <img src="../../assets/images/weibo.png">
                <i class="iconfont icon-heart"></i><span>36</span>
              </el-col>
              <el-col :span="18" v-goto="{name:'othersWeibo'}">
                <p>Chan Lok Wun</p>
                <p>HKA | IT</p>
                <p>Deputy General Manager </p>
                <p>Research and Development </p>
                <el-button type="primary" icon="icon-heart">Add Focus</el-button>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row class="focusBox" :gutter="10">
              <el-col :span="6">
                <img src="../../assets/images/weibo.png">
                <i class="iconfont icon-heart"></i><span>36</span>
              </el-col>
              <el-col :span="18">
                <p>Chan Lok Wun</p>
                <p>HKA | IT</p>
                <p>IT</p>
                <p>Business Analysis</p>
                <el-button type="primary" icon="check">Focused</el-button>
              </el-col>
            </el-row>
          </el-col>
        </template>
      </el-row>
    </el-card>
  </div>
</template>
<script>

  export default{
    data(){
      return{

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
  #hisFocus{
    .searchOptions{
      .el-card__body{
        .el-col{
          margin-top:25px;
          button{
            font-size: 16px;
            width: 100%;
            height: 46px;
          }
        }
        
      }
    }
    .StaffList{
      padding-bottom: 0;
      .headRight{
        color:$purple;
        i{
          margin-right: 15px;
        }
      }
      .el-card__body{
        padding:0;
      }
      .box{
        .el-col-12{
          padding: 45px 25px 25px;
          border-bottom: 1px solid #f2f2f2;
        }
        .el-col-12:nth-child(odd){
          border-right: 2px dashed #D5DADF;
        }
      }
      .focusBox{
        .el-col-6{
          img{
            width: 100%;
          }
          color:$purple;
          i{
            margin:0 10px;
          }
        }
        .el-col-18{
          p{
            font-size: 15px;
            line-height: 19px;
          }
          button{
            margin-top: 10px;
            padding: 4px 10px;
            border-radius: 2px;
            font-size: 13px;
            i{
              margin-right: 5px;
            }
          }
        }
      }
    }

  }


</style>
