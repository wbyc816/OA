<template>
  <div  class="searchDate">
    <div>
      <el-date-picker
      v-model="value6"
      type="date"
      :picker-options="pickerOptions0"
      range-separator=","
      format="dd/MM/yyyy"
      @change="done"
      v-show="type=='date'">
    </el-date-picker>
    <el-date-picker
    v-model="value6"
    type="daterange"
    :picker-options="pickerOptions0"
    range-separator=","
    format="dd/MM/yyyy"
    @change="done"
    v-show="type=='daterange'">
  </el-date-picker>
  <div class="showDate">
    <div>
      <P>{{tip}}</P>
      <P>{{DepartDate}}</P>
    </div>
    <i class="iconfont icon-plane1" v-show="type=='daterange'"></i>
    <div v-show="type=='daterange'">
      <P>Return</P>
      <P>{{ReturnDate}}</P>
    </div>
  </div>
</div>
<el-button v-if="button">Search</el-button>
</div>
</template>

<script>
  export default {
    props:{
      type: String,
      button:{
        type: Boolean,
        default: true
      },
      tip:{
        type: String,
        default:'Depart'
      }
    },
    mounted(){
      let temp=new Date();
      let month=temp.getMonth()+1;
      if(month<10){
        month='0'+month;
      }
      this.DepartDate=this.ReturnDate=temp.getDate()+'/'+month+'/'+temp.getFullYear();
    },
    data () {
      return {
        value6: '',
        value5: '',
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        DepartDate:'',
        ReturnDate:''
      }
    },
    methods: {
      done(val){
        console.log(val);
        if(!val){return};
        this.DepartDate=val.split(",")[0];
        if(this.type=='daterange'){
          this.ReturnDate=val.split(",")[1];
        }else{
          this.ReturnDate=this.DepartDate;
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .searchDate{
    display:flex;
    &>div{
      position: relative;
      flex:1;
      .el-date-editor{
        opacity:0;
        z-index: 10;
        width:100%;
        height:46px;
        .el-input__icon{
          display:none;
        }
        input{
          height:46px;
        }
      }
      .showDate{
        position:absolute;
        top: 0;
        left: 0;
        width: 100%;
        z-index:2;
        display:flex;
        align-items:center;
        border:1px solid #b7b7b7;
        border-right: none;
        height:44px;
        &>div{
          display:inline-block;
          flex:1;
          color:#676767;
          p{
            margin: 0;
          }
          p:first-child{
            font-size:13px;
          }
          p:last-child{
            font-size:15px;
            color:#393939;
          }
        }
        &>div{
          padding-left: 5px;
        }
        &>i{
          flex:0.5;
          color:#7C5598;
          font-size: 30px;
        }
      }
    }
    .el-button{
      font-size: 18px;
      width: 102px;
      height: 46px;
      color:#fff;
      background:#7C5598;
      border-color:#7C5598;
      margin-left: 1px;
    }
  }
</style>
