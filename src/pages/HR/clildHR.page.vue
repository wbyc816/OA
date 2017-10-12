<template>
  <div id="homeChild">
    <el-carousel height="347px" arrow="always">
      <el-carousel-item v-for="o in 4" :key="o">
        <img src="../../assets/images/Intersection16.png">
      </el-carousel-item>
    </el-carousel>
    <el-card class="shareBox">
      <el-row>
        <el-col :span="12" class="shareWith">
          <p> <i class="iconfont icon-renmian"></i> 人事任免 <router-link to="#">更多</router-link> </p>
          <ul>
            <li>
              <p>关于行政部王莉的人事任命通告 <span class="new">NEW</span></p>
              <p>人力资源部<span>2016-12-22</span></p>
            </li>
            <li>
              <p>关于货运部物流线主任一职的招募公告</p>
              <p>人力资源部<span>2016-12-22</span></p>
            </li>
            <li>
              <p>关于运行部周鹤翔的人事任命通告</p>
              <p>人力资源部<span>2016-12-22</span></p>
            </li>
          </ul>
        </el-col>
        <el-col :span="12" class="shareWith myShare">
          <p> <i class="iconfont icon-hr"></i> HR政策  <router-link to="#">更多</router-link> </p>
          <ul>
            <li>
              <p>2017年绩效考核年中考核通知</p>
              <p>人力资源部<span>2016-12-22</span></p>
            </li>
            <li>
              <p>2017年飞跃新星奖评审开始公告</p>
              <p>行政部<span>2016-12-22</span></p>
            </li>
            <li>
              <p>年资考评新政策调研通知</p>
              <p>人力资源部<span>2016-12-22</span></p>
            </li>
          </ul>
        </el-col>
      </el-row>
    </el-card>
    <div class="imgBox">
      <img src="../../assets/images/Image88.jpg" alt="">
    </div>
    <el-card class="borderCard highLight">
      <p slot="header"><i class="iconfont icon-zhinan"></i>办事指南<router-link to="#" class="headRight">更多</router-link></p>
      <el-row>
        <template>
          <el-col :span="12">
            <div>
              <p>饭卡申请单表及申请指南</p>
              <p>行政部<span>2016-12-22</span></p>
            </div>
          </el-col>
          <el-col :span="12">
            <div>
              <p>公司制服申请流程</p>
              <p>行政部<span>2016-12-22</span></p>
            </div>
          </el-col>
          <el-col :span="12">
            <div>
              <p>东海E网系统使用指导手册</p>
              <p>信息科技部<span>2016-12-22</span></p>
            </div>
          </el-col>
          <el-col :span="12">
            <div>
              <p>办公室行政手册</p>
              <p>行政部<span>2016-12-22</span></p>
            </div>
          </el-col>
           <el-col :span="12">
            <div>
              <p>职位晋升申请流程</p>
              <p>人力资源部<span>2016-12-22</span></p>
            </div>
          </el-col>
          <el-col :span="12">
            <div>
              <p>公司宿舍申请及使用指导手册</p>
              <p>行政部<span>2016-12-22</span></p>
            </div>
          </el-col>
        </template>
      </el-row>
    </el-card>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {}
  }
}

</script>
<style lang="scss">
$main: #0460AE;
$brown: #985D55;

#homeChild {
  .el-carousel {
    margin-bottom: 20px;
  }
  .highLight {
    .el-card__header {
      margin: 0 12px;
      padding:0;
      line-height:45px;
      color:$main;
      i{
      	margin-right:10px;
      	font-size:20px;
      }
      .headRight {
        font-size: 14px;
        color: #676767;
      }
    }
    .el-card__body {
      padding: 12px 0;
      .el-col {
        padding: 12px 18px 0 14px;
        border-right: 1px solid #E9E9E9;
        div {
          padding: 14px 7px 10px;
          border-top: 1px solid #E9E9E9;
          color: #676767;
          cursor: pointer;
          p:first-child {
            font-size: 16px;
            line-height: 30px;
            img {
              vertical-align: sub;
              padding-right: 5px;
            }
          }
          p:last-child {
            margin-top: 10px;
            font-size: 12px;
            span {
              float: right;
            }
          }
        }
      }
      .el-col:nth-child(-n+2) {
        padding-top: 6px;
        div {
          padding-top: 0;
          border-top: none;
        }
      }
    }
  }
  .imgBox {
    width: 100%;
    margin-bottom: 20px;
    img {
      width: 100%;
    }
  }
  .shareBox {
  	.el-card__body{
  		padding:0 12px;
  	}
    .shareWith {
      border-right: 1px solid #E9E9E9;
      padding-right: 14px;
      &>p {
        font-size: 18px;
        color: $main;
        line-height: 45px;
        border-bottom: 1px solid #E9E9E9;
        padding: 0 15px 0 3px;
        i {
          font-size: 20px;
          vertical-align: middle;
          margin-right: 10px;
        }
        a:last-child {
          float: right;
          font-size: 14px;
          color: #676767;
          cursor: pointer;
        }
      }
      ul {
        li {
          padding: 18px 7px 18px;
          border-top: 1px solid #E9E9E9;
          color: #676767;
          cursor: pointer;
          p:first-child {
            font-size: 16px;
            line-height: 30px;
            img {
              vertical-align: sub;
              padding-right: 5px;
            }
            .new {
              font-size: 12px;
              font-weight: normal;
              background: #FF9300;
              color: #fff;
              border-radius: 2px;
              padding: 0 2px;
              vertical-align: top;
            }
          }
          p:last-child {
            margin-top: 10px;
            font-size: 12px;
            span {
              float: right;
            }
          }
        }
        li:first-child {
          border-top: none;
        }
      }
    }
    .myShare {
      border: none;
      padding-right: 0;
      padding-left: 14px;
      .purpleTip {
        background: $main;
        color: #fff;
        padding: 5px 10px;
        border-bottom-right-radius: 5px;
        border-top-right-radius: 5px;
      }
      .greyTip {
        background: #AAAAAA;
      }
    }
  }
}

</style>
