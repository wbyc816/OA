<template>
  <div id="myBooking">
    <el-card class="borderCard searchOptions">
      <div slot="header">
        <span>My Booking</span>
        <i class="iconfont icon-shuaxin"></i>
      </div>
      <el-row :gutter="12">
        <el-col :span="6">
          <el-input placeholder="Date&Time"></el-input>
        </el-col>
        <el-col :span="6">
          <el-select v-model="value1" placeholder="Location">
            <el-option
            v-for="item in options"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-input placeholder="Room"></el-input>
      </el-col>
      <el-col :span="8">
        <el-select v-model="value" placeholder="Room Type">
          <el-option
          v-for="item in options"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button type="primary">Search</el-button>
    </el-col>
  </el-row>
</el-card>
<el-card class="borderCard searchResult">
  <el-table :data="searchData" class="myTable">      
    <el-table-column prop="ItemNo" label="Item No." width="130"></el-table-column>
    <el-table-column prop="Date" label="Date" width="150"></el-table-column>
    <el-table-column prop="StartTime" label="Start Time" width="110"></el-table-column>
    <el-table-column prop="EndTime" label="End Time" width="110"></el-table-column>
    <el-table-column prop="Room" label="Room" width="110"></el-table-column>
    <el-table-column prop="Location" label="Location" width="180"></el-table-column>
    <el-table-column label="Operation" class-name="clickItem"> 
      <template scope="scope">
        <span>Cancel</span>
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
    'ItemNo':'108471081',
    'Date': '2017-01-03',
    StartTime: '09:00',
    EndTime: '11:00',
    Room:'RoomA',
    Location:  '11F',
  },
  {
    'ItemNo':'108471081',
    'Date': '2017-01-03',
    StartTime: '10:00',
    EndTime: '11:00',
    Room:'RoomA',
    Location:  '9F',
  },
  {
    'ItemNo':'108471081',
    'Date': '2017-01-03',
    StartTime: '09:00',
    EndTime: '11:00',
    Room:'RoomB',
    Location:  '11F',
  },
  ]
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
        searchData,
        value: '',
        value1:'',
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
  #myBooking{
    .searchOptions{
      .el-card__body{
        .el-col{
          margin-top:13px;
        }
        .el-col-6{
          .el-select{
            width: 100%;
          }
        }
        .el-col-8{
          .el-select{
            width: 60%;
          }
        }
        
        button{
          height: 46px;
          width: 40%;
          float: right;
          font-size: 18px;
        }
      }
    }
    .searchResult{
      padding: 0;
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
