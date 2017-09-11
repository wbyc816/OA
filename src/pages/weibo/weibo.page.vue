<template>
  <div id='weibo'>
    <el-row :gutter='12'>
      <el-col :xs='24' :sm='16'>
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
              <p><i class="iconfont icon-heart"></i>Focus<span>26</span></p>
              <p><i class="iconfont icon-head"></i>Fans<span>6841</span></p>
              <p><i class="iconfont icon-message"></i>Weibo<span>39</span></p>
              <p><i class="iconfont icon-dengji"></i>Level<span>1</span></p>
            </el-col>
          </el-row>
          
        </el-card>
        <el-card class="menus">
          <el-row>
          <el-col :span="12"><span><i class="iconfont icon-home"></i></span>My Home</el-col>
            <el-col :span="12"><span><i class="iconfont icon-memo"></i></span>My Memo</el-col>
            <el-col :span="12"><span><i class="iconfont icon-message"></i></span>My Message</el-col>
            <el-col :span="12"><span><i class="iconfont icon-birthday"></i></span>Birthday Greetings</el-col>
            <el-col :span="12"><span><i class="iconfont icon-shoucang"></i></span>My Favorite</el-col>
            <el-col :span="12"><span><i class="iconfont icon-toupiao"></i></span>Vote & Survey</el-col>
            <el-col :span="12"><span><i class="iconfont icon-share"></i></span>My Sharing</el-col>
            <el-col :span="12"><span><i class="iconfont icon-huati"></i></span>Weibo Topic</el-col>
          </el-row>
        </el-card>
        <el-card class='borderCard specialFocus'>
          <p slot="header">Special Focus <span class="headRight">More</span></p>
          <el-row :gutter="10">
            <el-col :span="12" v-for="o in 2">
              <el-row class="focusBox" :gutter="10" v-goto="{name:'othersWeibo'}">
                <el-col :span="10">
                  <img src="../../assets/images/weibo.png">
                </el-col>
                <el-col :span="14">
                  <p>Chan Lok Wun</p>
                  <p>HKA</p>
                  <p>IT</p>
                  <p>IT Officer</p>
                  <el-button type="primary" icon="icon-heart">Add Focus</el-button>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-card>
        <el-card class="borderCard topicRecommended">
          <span slot="header">Topic Recommended</span>
          <ul>
            <li>舌尖上的世界 Tasting the World</li>
            <li>更数字，很香港</li>
          </ul>
        </el-card>
        <el-card class="borderCard recentWeibo">
          <span slot="header">Recent Weibo</span>
          <ul>
            <li v-for="o in 2">
              <p>Chen Yuan(11:32)</p>
              <p>公司各部門的年間費用、希望各部門向SDD学習、把2017年的部門向SDD学習習...</p>
            </li>
          </ul>
        </el-card>
        <el-card class="borderCard weiboRanking">
          <span slot="header">Weibo Ranking</span>
          <ul>
            <li><span>1</span>Stanly Miu <span>231</span></li>
            <li><span>2</span>Jeffery Zhou <span>31</span></li>
            <li><span>3</span>Alex Wongs <span>30</span></li>
            <li><span>4</span>Robin Duan <span>21</span></li>
            <li><span>5</span>Terry Zhangs <span>14</span></li>
            <li><span>6</span>Liu Zhi Jian <span>10</span></li>
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
  #weibo{
    .doc-bar_title{
      font-size: 18px;
      line-height: 20px;
      border-bottom: 1px solid #f2f2f2;
      padding-bottom: 10px;
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
        .el-card__body>.el-row{
          padding: 15px 0 10px;
        }
        .focusBox{
          .el-col-10{
            img{
              width: 100%;
            }
          }
          .el-col-14{
            p:first-child{
              color:$purple;
            }
            p{
              font-size: 15px;
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

