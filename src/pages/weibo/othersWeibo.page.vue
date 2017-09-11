<template>
  <div id='othersWeibo'>
    <el-row :gutter='12'>
      <el-col :span='16' >
        <el-card class="detail">
          <el-row>
            <el-col :span="3"><img src="../../assets/images/weibo.png"></el-col>
            <el-col :span="10">
              <p>Chan Lok Wun</p>
              <el-button type="primary" icon="icon-heart">Add Focus</el-button>
              <el-button type="primary" icon="icon-message">Send Message</el-button>
            </el-col>
            <el-col :span="11">
              <p><span>Status</span><span>On Duty <i class="iconfont icon-rili"></i></span></p>
              <p><span>Telphone</span><span></span></p>
              <p><span>Email</span><span>Chan.lokwun@hkairlines.com</span></p>
            </el-col>
          </el-row>
        </el-card>
        <router-view></router-view>
      </el-col>
      <el-col :span='8' class="sideBox">
        <el-card class="personal">
          <el-row>
            <el-col :span="16">
              <p><span>Name</span><span>Chan Lok Wun</span></p>
              <p><span>Stauts</span><span>On Duty<i class="iconfont icon-rili" :style="{'color':'#7C5598'}"></i></span></p>
              <p><span>Company</span><span>HKA</span></p>
              <p><span>Department</span><span>IT</span></p>
              <p><span>Position</span><span>IT Officer</span></p>
            </el-col>
            <el-col :span="8">
              <p v-goto="{name:'hisFocus'}"><i class="iconfont icon-heart"></i>Focus<span>26</span></p>
              <p><i class="iconfont icon-head"></i>Fans<span>6841</span></p>
              <p><i class="iconfont icon-message"></i>Weibo<span>39</span></p>
              <p><i class="iconfont icon-dengji"></i>Level<span>1</span></p>
            </el-col>
          </el-row>
          
        </el-card>
        <el-card class='borderCard specialFocus'>
          <p slot="header">His Fans<span class="headRight">More</span></p>
          <el-row>
            <el-col :span="12" v-for="o in 6">
              <el-row class="focusBox">
                <el-col :span="10">
                  <img src="../../assets/images/weibo.png">
                </el-col>
                <el-col :span="14">
                  <p>Chan Lok Wun</p>
                  <p>HKA</p>
                  <p>IT</p>
                  <p>IT Officer</p>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-card>
        <el-card class="borderCard topicRecommended">
          <span slot="header">Share File <span class="headRight">More</span></span>
          <ul>
            <li>No File</li>
          </ul>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>

  export default{

    mounted(){
    },
    data(){
      return{
        breadcrumbItem:'',
        navMenu:[
        {"title":"My Leisure Travel","path":"#"},
        {"title":"My Health Insurance","path":"#"},
        {"title":"My Staff Discount","path":"#"},
        {"title":"Staff Advertising Corner","path":"#"},
        {"title":"Hotel","path":"#"},
        ]

      }
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
  #othersWeibo{
    .doc-bar_title{
      font-size: 18px;
      line-height: 20px;
      border-bottom: 1px solid #f2f2f2;
      padding-bottom: 10px;
    }
    .detail{
      padding: 16px 15px 15px;
      position: relative;
      &:before{
        content: '';
        position: absolute;
        display: block;
        height: 100%;
        border-right: 1px dashed #D5DADF;
        top:0;
        left: 54.17%;
      }
      .el-col-3{
        img{
          height: 79px;
        }
      }
      .el-col-10{
        p{
          color:$purple;
          font-size: 20px;
          line-height: 30px;
          margin-top: 5px;
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
      .el-col-11{
        padding-left:35px;
        p{
          font-size: 15px;
          line-height: 28px;
          span:first-child{
            color:$purple;
            width: 80px;
            display: inline-block;
          }
          span:last-child{
            i{
              color:$purple;
              margin-left: 5px;
              font-size: 24px;
            }
          }
        }
      }
    }
    .sideBox{
      .personal{
        padding: 0;
        .el-col-16{
          padding: 15px 0 15px 16px;
          p{
            line-height:30px; 
            font-size:15px;
            span{
              width: 50%;
              float: left;
              display: inline-block;
              position: relative;
              i{
                color: rgb(124, 85, 152);
                font-size: 25px;
                position: absolute;
                left: 65px;
                top: -2px;
              }
            }
            span:first-child{
              color:$purple;

            }
          }
        }
        .el-col-8{
          padding: 16px 10px 16px 14px;
          background-color: $purple;
          background-image:url('../../assets/images/bg3.png');
          background-repeat:no-repeat;
          background-position:right;
          p{
            line-height: 37px;
            font-size: 15px;
            color:#fff;
            i{
              margin-right:5px;
            }
            span{
              float: right;
            }
          }
        }
      }
      .menus{
        padding: 4px 0;
        .el-col{
          line-height:50px;
          border-bottom: 1px solid #f2f2f2;
          font-size: 16px;
          cursor: pointer;
          span{
            display: inline-block;
            border-radius: 2px;
            margin:0 10px;
            height: 31px;
            width: 31px;
            background: $purple;
            line-height: 31px;
            text-align: center;
            i{
              font-size: 18px;
              color:#fff;
            }
          }
        }
        .el-col:nth-child(7),.el-col:nth-child(8){
          border-bottom: none;
        }
        $colors:(1:$purple,2:#2482AC,3:#985D55,4:#C4AB44,5:#555A98,6:#689F54,7:#557E98,8:#985593);
        @each $num,$color in $colors{
          .el-col:nth-child(#{$num}){
            span{
              background: $color;
            }
          }
        }
      }
      .specialFocus{
        .headRight{
          color:$purple;
        }
        .el-card__body{
          padding: 0;
          &>.el-row{
            padding: 0
          }
        }
        
        .focusBox{
          padding: 15px 5px 15px 15px;
          .el-col-10{
            img{
              width: 100%;
            }
          }
          .el-col-14{
            p{
              font-size: 15px;
              line-height: 19px;
            }
            button{
              width: 100%;
              padding: 4px;
              border-radius: 2px;
              font-size: 13px;
            }
          }
        }
      }
      .topicRecommended{
        padding-bottom: 0;
        .headRight{
          color:$purple;
        }
        .el-card__body{
          padding: 0;
        }
        ul{
          li{
            line-height: 50px;
            padding-left: 13px;
            font-size: 16px;
            color:#676767;
          }
          li:first-child{
            border-bottom:1px solid #f2f2f2;
          }
        }
      }
      .recentWeibo{
        padding-bottom: 0;
        .el-card__body{
          padding: 0;
        }
        li{
          font-size: 16px;
          padding-left: 13px;
          padding-right: 13px;
          cursor: pointer;
          p:first-child{
            line-height:40px;
            color:$purple;
          }
          p:last-child{
            color:#95989A;
            margin-bottom: 15px;
            font-size: 15px;
          }
        }
        li:first-child{
          border-bottom:1px solid #f2f2f2;
        }
      }
      .weiboRanking{
        padding-bottom: 0;
        .el-card__body{
          padding: 0;
        }
        ul{
          li{
            line-height: 50px;
            padding-left: 13px;
            padding-right: 30px;
            font-size: 16px;
            color:#676767;
            cursor: pointer;
            span:first-child{
              display:inline-block;
              width:20px;
              height: 20px;
              border-radius: 2px;
              line-height: 20px;
              margin-right:28px;
              text-align: center;
            }
            span:last-child{
              float: right;
              color:$purple;
            }
          }
          li:not(:last-child){
            border-bottom:1px solid #f2f2f2;
          }
          li:nth-child(-n+3){
            span:first-child{
              background:$purple;
              color:#fff;
            }
          }
        }
      }
    }
  } 

</style>

