<template>
  <div id="news">
    <el-card class="borderCard searchOptions">
      <div slot="header">
        <span>Company News</span>
        <i class="iconfont icon-shuaxin"></i>
      </div>
      <el-row :gutter="12">
        <el-col :span="6">
         <el-select v-model="value" placeholder="Company">
          <el-option v-for="item in options" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="8">
        <el-input placeholder="Last Update"></el-input>
      </el-col>
      <el-col :span="10">      
        <el-input class="search" placeholder="Title">
          <el-button slot="append">Search</el-button>
        </el-input>
      </el-col>
    </el-row>
  </el-card>
  <el-card class="borderCard searchResult">
    <ul>
      <li v-for="o in 4" v-goto="{path:'/generalInfo/newsDetail'}">
        <p>Hong Kong Airlines Celebrates Flight to Seoul</p>
        <p><span>HKA</span>General<span><i class="iconfont icon-eye"></i><span>215</span>2016/12/16</span></p>
      </li>
    </ul>
    <p class="total">Total: 4 Record(s).</p>
  </el-card>
</div>
</template>
<script>

  const options= [{
    value: '选项1',
    label: '黄金糕'
  }, {
    value: '选项2',
    label: '双皮奶'
  }, {
    value: '选项3',
    label: '蚵仔煎'
  }, {
    value: '选项4',
    label: '龙须面'
  }, {
    value: '选项5',
    label: '北京烤鸭'
  }]

  export default{
    data(){
      return{
        handledBy:'',
        value: '',
        options,
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
  #news{
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

    
    .searchResult{
      padding: 0;
      .el-card__body{
        padding: 0;
        ul{
          li{
            padding:16px 20px 12px 15px;
            border-bottom: 1px solid #F2F2F2;
            cursor: pointer;
            p:first-child{
              font-size: 15px;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              margin-bottom: 11px;
            }
            p:last-child{
              font-size:12px;
              color:#676767;
              &>span:first-child{
                margin-right: 7px;
                padding-right: 7px;
                border-right: 1px solid #BFBFBF;
              }
              &>span:last-child{
                float:right;
                i{
                  color:$purple;
                }
                span{
                  padding: 0 7px 0 5px;
                  margin-right: 7px;
                  border-right: 1px solid #BFBFBF;
                }
              }
            }
          }
          li:nth-child(even){
            background: #F7F7F7;
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
