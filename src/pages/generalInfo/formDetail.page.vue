<template>
  <div id='formDetail'>
    <el-card class="formDown">
      <el-row>
        <el-col :span='3'>
          <img src="../../assets/images/excelImg.png">
        </el-col >
        <el-col class="formInfo" :span='18'>
          <p>Ticket Refund Application Form</p>
          <div>
            <p>2017-01-18 15:19:57</p>
            <p>HR & ADMIN</p>
            <p>LeanSixSigmaProjectApplicationForm_Dept_Name_YYYYMMDD (Individual)_R5.xlsx </p>
          </div>
        </el-col>
        <el-col :span='3'>
          <el-button type="primary">Download</el-button>
        </el-col>     
    </el-row>
    </el-card>
    <el-row :gutter='12'>
      <el-col :span='18'>
        <el-card class="showBox">
          <div class="commentBox">
            <img src="../../assets/images/Image198.png">
            <el-input type="textarea" placeholder="Any Comment?"></el-input>
            <el-checkbox v-model="checked">Share to SO Weibo</el-checkbox>
            <div class="submitBox">
              <i class="iconfont icon-smile"></i>
              <el-button type="primary">Submit</el-button>
            </div>
          </div>
          <weibo :weibo='weibo'></weibo>
        </el-card>
      </el-col>
      <el-col :span='6' >
        <ul class="sideBox">
          <li v-for="o in 4">
            <p>Corporate PPT Template_TC</p>
            <div class="bottom">
              <p>Lean Six Sigma</p>
              <p>HR&Admin<span>Date：2016-12-22</span></p>
            </div>

          </li>
        </ul>
      </el-col>
    </el-row>
    
  </div>
</template>
<style lang='scss'>
  $purple: #7C5598;
  #formDetail{
    .formDown{
      padding:20px 35px;
      box-shadow: none;
      .el-row{
        .el-col:first-child{
          img{
            height:100%;
          }
        }
        .formInfo{
          padding-left: 30px;
          &>p{
            color:$purple;
            font-size: 18px;
          }
          &>div{
            position: absolute;
            bottom: 0;
            p{
              color:#676767;
              font-size: 15px;
            }
          }
        }
        .el-col:last-child{
          position: absolute;
          right: 0;
          height: 45px;
          margin: auto;
          top: 0;
          bottom: 0;
          button{
            width: 100%;
            height: 100%;
            font-size: 20px;
          }
        }
      }
    }
    .showBox{
      padding:0;
      box-shadow: none;
      height: 400px;
      .commentBox{
        height: 220px;
        box-sizing: border-box;
        padding:25px 20px 25px 80px;
        border-bottom: 2px dashed #f2f2f2;
        position: relative;
        &>img{
          position: absolute;
          top: 25px;
          left: 20px;
          width: 47px;
        }
        .el-textarea{
          height: 100%;
          width: 78%;
          textarea{
            height: 100%;
            background: #F2F2F2;
            font-size: 15px;
            padding: 10px 15px;
            border: none;
            border-radius: 2px;
          }
        }
        .el-checkbox{
          float: right;
          padding-right: 10px;
          .el-checkbox__inner{
            border-radius:0;
            border-color: $purple;
            box-shadow: 0px 0px 1px 1px rgb(223, 209, 229);
          }
          .el-checkbox__label{
            font-size: 15px;
            color:#676767;
          }
        }
        .submitBox{
          position: absolute;
          bottom: 25px;
          right: 20px;
          height: 38px;
          width: 158px;
          i{
            color:$purple;
            font-size: 30px;
            line-height: 38px;
          }
          button{
            height: 100%;
            width: 117px;
            float: right;
          }
        }
      }
      .weibo{
        padding-top:10px;
        padding-right: 20px;
      }
    }
    .sideBox{
      padding:0 8px;
      background: #fff;
      li{
        position: relative;
        height: 100px;
        padding:22px 9px 6px 0;
        border-bottom: 1px solid #f2f2f2;
        box-sizing: border-box;
        &>p:first-child{
          color:$purple;
          font-size: 14px;
        }
        .bottom{
          position:absolute;
          bottom: 6px;
          left: 0;
          width: 100%;

          p{
            color:#676767;
            padding-right: 9px;
            font-size: 12px;
            span{
              float: right;
            }
          }
        }
      }
      li:last-child{
        border-bottom: none;
      }
    }
  } 
</style>
<script>
  import Weibo from'../../components/weibo'
  export default{
    data(){
      return{
        checked:false,
        weibo:{'author':'HR Group',
        'text':'公司的進步實在有賴每位員工的寶貴意見，而CONNECT就是其中一個直達公司管理層的有效渠道。在跟進期間，您的身份將會被保密。 您可將意見寫信至connect@hkairlines.com。一經刊登，您將有機會獲得價值港幣500元的超市禮券。',
        
        'time':'1213213233'}
      }
    },
    components:{
      Weibo
    }

  }

</script>
