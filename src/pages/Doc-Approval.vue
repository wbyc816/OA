<template>
  <div id='doc-approval'>
    <el-row :gutter='12'>
      <el-col :span='17'>
        <router-view></router-view>
      </el-col>
      <el-col :span='7' class="sideBox">
        <side-Person-Search></side-Person-Search>
        <el-menu mode="vertical" v-bind:router="true" class="mySideLink" v-if="!/Statistics/.test($route.path)">
          <el-menu-item-group title="公文流转">
            <template v-for='(item,index) in navMenu'>
              <el-menu-item v-if='item.path' :index='index.toString()' :route="{path:item.path}">{{item.title}}
                <el-badge class="mark" :value="tips[index]" />
                <i class="el-icon-arrow-right"></i>
              </el-menu-item>
            </template>
          </el-menu-item-group>
        </el-menu>
        <el-menu mode="vertical" v-bind:router="true" class="mySideLink" v-if="/Statistics/.test($route.path)&&staticsPower">
          <el-menu-item-group title="公文流转">
            <el-menu-item index='/doc/macroStatistics' v-if="staticsPower==1">宏观统计<i class="el-icon-arrow-right"></i>
            </el-menu-item>
            <el-menu-item index='/doc/normalStatistics'>公文统计<i class="el-icon-arrow-right"></i>
            </el-menu-item>
            <el-menu-item index='/doc/approveStatistics'>审批者统计<i class="el-icon-arrow-right"></i>
            </el-menu-item>
          </el-menu-item-group>
        </el-menu>
      </el-col>
    </el-row>
    <el-dialog title="流转详情" :visible.sync="processDialogView" size="large" class="myDialog processDialog" @close="close">
      <table bgcolor="#fff" class="myTableList" width="100%" cellspacing="0">
        <thead align="left">
          <tr>
            <th v-for="title in tableTitle">{{title}}</th>
          </tr>
        </thead>
      </table>
      <div class="tableWrap">
        <div class="stepswrap">
          <el-steps direction="vertical" :active="processData.length-1" finish-status="process" process-status="finish">
            <el-step v-for="(step,index) in processData" :style="{height:stepHeight[index]+'px'}"></el-step>
          </el-steps>
        </div>
        <table bgcolor="#fff" class="myTableList" width="100%" cellspacing="0">
          <tbody v-for="doc in processData" ref="task" :class="{signBox:doc.signInfo.length!=0}">
            <tr>
              <td></td>
              <td>{{doc.taskUserName}}</td>
              <td>{{doc.readTime}}</td>
              <td>{{doc.startTime}}</td>
              <td>{{doc.endTime}}</td>
              <td :class="{overTime:doc.isOvertime==1}"><template v-if="doc.isOvertime!=2">{{doc.isOvertime==0?'准时':'超时'}}</template></td>
              <td>{{doc.nodeName}}</td>
              <td>{{doc.taskDeptMajorName}}</td>
            </tr>
            <template v-if="doc.signInfo.length!=0">
              <tr class="tips start">
                <td></td>
                <td><i class="el-icon-caret-right"></i>公文会签开始</td>
                <td v-for="o in 6"></td>
              </tr>
              <template v-for="depBox in doc.signInfo">
                <tr class="signTr" v-for="sign in depBox.deptSigns">
                  <td></td>
                  <td>{{sign.signUserName}}</td>
                  <td>{{sign.readTime}}</td>
                  <td>{{sign.signTime}}</td>
                  <td>{{sign.endTime}}</td>
                  <td :class="{overTime:sign.isOverTime==1}">{{sign.isOverTime==0?'准时':'超时'}}</td>
                  <td>{{sign.docState}}</td>
                  <td>{{sign.signDeptMajorName}}</td>
                </tr>
              </template>
              <tr class="tips">
                <td></td>
                <td><i class="el-icon-caret-right"></i>公文会签结束</td>
                <td v-for="o in 6"></td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import SidePersonSearch from '../components/sidePersonSearch.component'
export default {
  data() {
    return {
      breadcrumbItem: '',
      navMenu: [{
          title: '公文呈报',
          path: '/doc/docSub'
        },
        {
          title: '公文追踪',
          path: '/doc/docTracking'
        },
        {
          title: '公文签批',
          path: '/doc/docPending'
        },
        {
          title: '公文查询',
          path: '/doc/docSearch'
        },
        {
          title: '公文待阅',
          path: '/doc/docToRead'
        },
        {
          title: '公文草稿箱',
          path: '/doc/docDraft'
        }
      ],
      processDialogView: false,
      tips: [],
      tableTitle: ['', '审批人', '审阅时间', '审批时间', '截至时间', '时限', '状态', '部门'],
      stepHeight: []
    };
  },
  computed: {

    ...mapGetters([
      'reciver',
      'userInfo',
      'isAdmin',
      'processView',
      'processData',
      'docTips',
      'staticsPower'
    ])
  },
  components: { SidePersonSearch },
  created() {
    this.$store.dispatch('getAdminStatus');
    this.$store.dispatch('getDocTips');
    this.$store.dispatch('getDocForm');
    this.getPower();
  },
  mounted: function() {
    this.breadcrumbItem = this.$route.meta.breadcrumb;
  },
  methods: {
    formatter(row, column, cellValue) {
      switch (cellValue) {
        case "start":
          return "发起";
          break;
        case 'task':
          return "批核";
          break;
        case 'trans':
          return "会签";
          break;
        case 'end':
          return "归档";
          break;

        default:
          return cellValue;
      }
    },
    changeProceesView(val) {

    },
    close() {
      this.$store.commit('SET_PROCESS_VIEW', false)
    },
    getStepH() {
      this.stepHeight = [];
      for (var i = 0; i < this.processData.length; i++) {
        var h = 0;
        if (i != this.processData.length - 1) {
          h = this.$refs.task[i].clientHeight / 2 + this.$refs.task[i + 1].clientHeight / 2;
        } else {
          h = 28;
        }
        this.stepHeight.push(h)
      }
      console.log(this.stepHeight)
    },
    getPower() {
      if (this.staticsPower === '') {
        this.$http.post('/doc/checkStatisticsPower', { userId: this.userInfo.empId })
          .then(res => {
            if (res.status == 0) {
              this.$store.commit('setStaticsPower', res.data);
              if (res.data != 0) {
                this.navMenu.push({
                  title: '公文统计',
                  path: '/doc/normalStatistics'
                })
              }
            } else {

            }
          })
      }
    }
  },
  watch: {
    '$route' (to, from) {
      this.$store.dispatch('getDocTips');
      if (to.meta) {
        this.breadcrumbItem = to.meta.breadcrumb;
      }
    },
    'processView' (newValue) {
      this.processDialogView = newValue;

    },
    docTips(newVal) {
      this.tips = [];
      this.tips.push(0);
      this.tips.push(newVal.trackingNum);
      this.tips.push(newVal.pendingNum);
      this.tips.push(0);
      this.tips.push(newVal.toReadNum);
    },
    'processData' (newValue) {
      this.$nextTick(() => {
        this.getStepH();
      })
    }
  },
}

</script>
<style lang='scss'>
$main: #0460AE;
#doc-approval {
  .mySideLink {
    margin-bottom: 20px;
    .el-badge__content {
      margin-bottom: 5px;
      background: #BE3B7F;
      margin-left: 5px;
    }
  }

  .processDialog {
    .tableWrap {
      max-height: 500px;
      overflow: auto;
      position: relative;
    }
    .el-dialog__body {
      .myTableList {
        $widths: (1: 5%, 2: 12%, 3: 15%, 4: 15%, 5: 15%, 6: 6%, 7:10%, 8:18%);
        thead {
          background: $main;
          color: #fff;
          font-size: 13px;
          th {
            padding: 6px 13px;
          }
          @each $num,
          $width in $widths {
            th:nth-child(#{$num}) {
              width: $width;
            }
          }
          td {
            font-size: 14px;
          }
        }
        @each $num,
        $width in $widths {
          td:nth-child(#{$num}) {
            width: $width;
            padding: 4px 13px;
          }
        }
        .overTime {
          color: #BE3B7F;
        }
        tbody {
          background: #fff;
          border-bottom: 1px solid #D5DADF;
          tr {
            height: 55px;
            td {
              vertical-align: middle;
              border-bottom: 1px solid #D5DADF;
            }
            &:first-child {
              td {}
            }
          }
          &:nth-child(even) {
            background: #F7F7F7;
          }
          &.signBox {
            tr:first-child {
              td {
                border-bottom: none;
              }
            }
            td {
              background: #EAECF7;
            }
            tr:nth-last-child(2) {
              td {
                border-bottom: none;
              }
            }
          }
          .signTr {
            height: 40px;
          }
          .tips {
            height: 28px;
            td {
              border-bottom: 2px dashed #D5DADF;
              color: $main;
            }
          }
          .start {
            td {
              border-top: 2px dashed #D5DADF;
              border-bottom: none;
            }
          }
        }
        tfoot {
          td {
            color: #95989A;
          }
        }
      }
      .stepswrap {
        position: absolute;
        height: 100%;
        z-index: 1;
        width: 45px;
        .el-steps {
          height: 100%;
          width: 32px;
          margin: 0 auto;
          padding: 13px 0 50px;
          box-sizing: border-box;
          .el-step__head.is-text.is-process {
            background-color: #777777;
            border-color: #777777;
          }
          .is-process {
            .el-step__line {
              background: #777777;
              top: 27px;
              left: 13px;
            }
          }
        }
      }
    }
  }
}

</style>
