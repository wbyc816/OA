<template>
  <div class='historyAdvice commonBox'>
    <h4 class='doc-form_title'>历史审批意见</h4>
    <ul v-for="(task,index) in taskDetail" v-if="index!=0&&task.isFlag!=1" :class="{'hasSign':task.signInfo!=''}" v-show="index<(!moreFlag?showLenth:999)">
      <li class="personAdvice" :class="{disAgree:task.state==2}">
        <span class="isAgree"><i :class="task.state==2?'el-icon-circle-cross':'el-icon-circle-check'"></i></span>
        <span class="userName">{{task.taskUserName}}</span>
        <span class="taskContent">
        {{task.taskContent}}
        <p class="taskFile" v-for="item in task.taskFiles"><a :href="item.filePath">{{item.fileNameNew}}</a></p>
      </span>
        <span class="taskTime">{{task.startTime}}</span>
      </li>
      <ul class="signBox" v-if="task.signInfo.length!=0">
        <li class="signStart"><i class="el-icon-caret-right"></i>{{task.state==6?'承办':'会签'}}开始</li>
        <!-- 部门会签 -->
        <template v-if="task.signType==1">    
          <el-collapse class="depSignBox">
            <el-collapse-item v-for="signBox in task.signInfo">
              <template slot="title">
                <li class="personAdvice" :class="{disAgree:signBox.deptSigns[signBox.deptSigns.length-1].state==2}">
                  <span class="isAgree"><i :class="signBox.deptSigns[signBox.deptSigns.length-1].state==2?'el-icon-circle-cross':'el-icon-circle-check'"></i></span>
                  <span class="depName"><i class="el-icon-arrow-down"></i><span>{{signBox.deptName}}</span></span>
                  <span class="userName">{{signBox.deptSigns[signBox.deptSigns.length-1].signUserName}}</span>
                  <span class="taskContent">{{signBox.deptSigns[signBox.deptSigns.length-1].signContent}}</span>
                  <span class="taskTime">{{signBox.deptSigns[signBox.deptSigns.length-1].signTime}}</span>
                </li>
              </template>
              <li class="personAdvice" :class="{disAgree:sign.state==2}" v-for="sign in signBox.deptSigns">
                <span class="isAgree"><i :class="sign.state==2?'el-icon-circle-cross':'el-icon-circle-check'"></i></span>
                <span class="userName">{{sign.signUserName}}</span>
                <span class="taskContent">{{sign.signContent}}</span>
                <span class="taskTime">{{sign.signTime}}</span>
              </li>
            </el-collapse-item>
          </el-collapse>
        </template>
        <!-- 人员会签 -->
        <template v-if="task.signType==2" v-for="info in task.signInfo">  
          <li class="personAdvice" :class="{disAgree:sign.state==2}" v-for="sign in info.deptSigns">
            <span class="isAgree"><i :class="sign.state==2?'el-icon-circle-cross':'el-icon-circle-check'"></i></span>
            <span class="userName">{{sign.signUserName}}</span>
            <span class="taskContent">{{sign.signContent}}</span>
            <span class="taskTime">{{sign.signTime}}</span>
          </li>
        </template>
        <li class="signEnd"><i class="el-icon-caret-right"></i>{{task.state==6?'承办':'会签'}}结束</li>
      </ul>
    </ul>
    <div class="moreHistory" v-if="taskDetail.length>showLenth" :class="{isActive:moreFlag}" @click="moreFlag=!moreFlag">
      <i class="el-icon-arrow-down"></i> 查看更多审批意见
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    taskDetail: {
      type: Array
    }
  },
  data() {
    return {
      moreFlag: false,

    }
  },
  computed: {
    showLenth:function(){
      var num=4;
      if(this.taskDetail.length!=0){
        for(var i=1;i<4;i++){
          if(this.taskDetail[i]&&this.taskDetail[i].signInfo){
            num=i;
            break;
          }
        }
      }
      return num;
    },
    ...mapGetters([
      'submitLoading'
    ])
  },
  methods: {
  }
}

</script>
<style lang='scss'>
$main:#0460AE;
.historyAdvice {
  padding-bottom: 0;
  border-bottom: none;
  li {
    min-height: 50px;
    padding: 0 20px;
  }
  .hasSign {
    border-bottom: none;
  }
  >ul {
    border-bottom: 1px solid #D5DADF;
    &:first-of-type {
      border-top: 1px solid #D5DADF;
    }
    .personAdvice {
      display: table;
      span {
        display: table-cell;
        vertical-align: middle;
            word-break: break-word;
      }
      $widths: (1: 4%, 2: 12%, 3: 72%, 4: 12%);
      @each $num,
      $width in $widths {
        span:nth-child(#{$num}) {
          width: $width;
        }
      }
      .taskContent{
        padding: 5px 0;
        line-height:18px;
      }
      .isAgree {
        i {
          color: #00A0DC;
          font-size: 20px;
          vertical-align: middle;
        }
      }
      &.disAgree {
        background: #FFF0F0;
        .isAgree {
          i {
            color: #F06666;
          }
        }
      }
      .userName {
        color: $main;
      }
      .taskTime {
        color: #9B9B9B;
      }
      .taskFile{
        padding-bottom:5px;
        a{
          color:$main;
        }
      }
    }
    .depSignBox {
      .el-collapse-item__header {
        padding-left: 0;
        min-height: 50px;
        height: auto;
        line-height: 1;
        font-size: 15px;
        background: #EAECF7;
        .el-collapse-item__header__arrow {
          display: none;
        }
        .personAdvice {
          width: 100%;
          $widths: (1: 4%, 2:24%, 3: 12%, 4: 48%, 5: 12%);
          @each $num,
          $width in $widths {
            span:nth-child(#{$num}) {
              width: $width;
            }
          }
          .depName {
            font-size: 15px;
            color: $main;
            span {
              display: inline-block;
              width: auto;
              padding-left: 10px;
              max-width: 80%;
            }
            i {
              font-size: 18px;
              vertical-align: middle;
              transition: transform .3s;
            }
          }
        }
      }
      .el-collapse-item.is-active {
        .el-collapse-item__header .personAdvice .depName i {
          transform: rotate(180deg);
        }
      }
      .el-collapse-item__wrap {
        background: #EAECF7;
        .el-collapse-item__content {
          padding: 0;
          font-size: 15px;
          line-height: 1;
        }
      }
    }
    &.isAgree {
      background: #FFF0F0;
      position: relative;
      &:before {
        font-weight: normal;
        content: "\e743";
        font-family: "iconfont" !important;
        font-size: 70px;
        font-style: normal;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        position: absolute;
        top: 9px;
        right: 16px;
        color: #F4B8B2;
      }
      li {
        position: relative;
        z-index: 2;
      }
    }
  }
  .moreHistory {
    padding-left: 20px;
    line-height: 40px;
    color: $main;
    border-bottom: 1px dashed #D5DADF;
    cursor: pointer;
    i {
      transition: transform .3s;
    }
    &.isActive {
      i {
        transform: rotate(180deg);
      }
    }
  }
  .signBox {
    background: #EAECF7;
    .personAdvice{
      border-bottom: 1px solid #D5DADF;      
    }
    .signStart,
    .signEnd {
      color: #fff;
      padding: 0 20px;
      min-height: 25px;
      line-height: 25px;
      background: $main;
      i {
        padding-right: 10px;
      }
    } // .signStart {
    //   border-bottom: 1px solid #D5DADF;
    //   border-top: 1px dashed #D5DADF;
    // }
    // .signEnd {
    //   border-bottom: 1px dashed #D5DADF;
    // }
    .depTip {
      color: $main;
    }
    .childSign {
      border-bottom: 1px solid #D5DADF;
    }
  }
}

</style>
