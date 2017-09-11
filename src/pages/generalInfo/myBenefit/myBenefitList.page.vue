<template>
  <div id='myBenefitList'>
    <el-card class="borderCard">
      <span slot="header">My Benifit<span class="headRight">Recommend</span></span>
      <el-row :gutter="40">
        <el-col :span="9" class="imageBox">
          <img src="../../../assets/images/brand1.png" alt="">
        </el-col>
        <el-col :span="15" v-goto="{name:'myBenefitDetail'}">
          <p>Staff Upsell to Business Class</p>
          <p>We are pleased to announce that there is a special price for staff, their nominees and travel partners upgrade to business class when travelling with</p>
          <p>Validity: Never Expires <span>2016-11-22 </span></p>
        </el-col>
      </el-row>
      <el-row :gutter="40">
        <el-col :span="9" class="imageBox">
          <img src="../../../assets/images/brand2.png" alt="">
        </el-col>
        <el-col :span="15" v-goto="{name:'myBenefitDetail'}">
          <p>Cityview Hotel, Yau Ma Tei, Hong Kong 城景國際酒店, 油麻地,香港 (1Jan- 28Feb 2017)</p>
          <p>Discount/free services, facilities, f&b may ONLY applicable for air crew duty travel. pls ask hotel.</p>
          <p>Validity: Never Expires <span>2016-11-22 </span></p>
        </el-col>
      </el-row>
      <el-row :gutter="40">
        <el-col :span="9" class="imageBox">
          <img src="../../../assets/images/brand3.png" alt="">
        </el-col>
        <el-col :span="15" v-goto="{name:'myBenefitDetail'}">
          <p>Room For Rental (The Beaumount) </p>
          <p>We are pleased to announce that there is a special price for staff, their nominees and travel partners upgrade to business class when travelling with</p>
          <p>Validity: Never Expires <span>2016-11-22 </span></p>
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


    },
    computed:{

    }
  }

</script>
<style lang='scss'>
  $purple:#7C5598;
  $brown: #985D55;
  #myBenefitList{
    .borderCard{
      padding-bottom: 0;
      .headRight {
       margin-right: 20%;
       color:$purple;
     }
   }
   li{
    line-height: 50px;
    border-bottom: 1px solid #f2f2f2;
    padding-left: 33px;
    font-size: 15px;
    span:first-child{
      display: inline-block;
      width: 180px;
      color:$purple;
    }
  }
  .el-card__body{
    padding: 15px 0 40px;
    .el-row{
      padding: 0 35px 20px 18px;
      border-bottom: 1px solid #f2f2f2;        
      .imageBox{
        text-align: center;
        img{
          text-align: center;
          max-width: 100%;
          height: auto;
        }
      }
      .el-col-15{
        cursor: pointer;
        p:first-child{
          font-size: 16px;
          line-height:25px;
          color: $purple;
          margin-bottom: 12px;
        }
        p:nth-child(2){
          font-size: 15px;
          min-height: 60px;
        }
        p:last-child{
          font-size: 15px;
          span{
            float: right;
          }
        }
      }
    }
    .el-row:not(:first-child){
      padding: 20px 35px 20px 18px;
    }
  }
  
}

</style>

