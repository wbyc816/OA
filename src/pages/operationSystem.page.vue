<template>
  <div id='os' ref='os'>
    <el-row :gutter='12'>
      <el-col :span='17' :xs="24">
        <router-view></router-view>
      </el-col>
      <el-col :span='7' class="sideBox">
        <side-Person-Search></side-Person-Search>
        <el-menu mode="vertical" v-bind:router="true" ref="emenu" class="mySideLink">
          <el-menu-item-group title="消息中心">
            <template v-for='(item,index) in navMenu'>
              <div class="badge" v-if="message[index]" :style="{'top': getTop(index)}">{{ message[index] }}</div>
              <el-menu-item v-if='item.path' :index='index.toString()' :route="{path:item.path}">
                <span>{{item.title}}</span>
                <i class="el-icon-arrow-right"></i>
              </el-menu-item>
            </template>
            </el-badge>
          </el-menu-item-group>
        </el-menu>
      </el-col>
    </el-row>
    <el-dialog title="流转详情" :visible.sync="processDialogView" size="large" class="myDialog processDialog" @close="close">
      <div class="stepswrap">
        <el-steps direction="vertical" :active="processData.length-1" finish-status="process" process-status="finish" :center="true">
          <el-step v-for="step in processData" :key="step.toString()"></el-step>
        </el-steps>
      </div>
      <el-table :data="processData" class="myTable">
        <el-table-column width="44"></el-table-column>s
        <el-table-column prop="taskUserName" label="审批人" width="155"></el-table-column>
        <el-table-column prop="isBack" label="审阅时间" width="155"></el-table-column>
        <el-table-column prop="startTime" label="审批时间" width="155"></el-table-column>
        <el-table-column prop="isBack" label="截至时间" width="150"></el-table-column>
        <el-table-column prop="isOvertime" label="时限" width="155"></el-table-column>
        <el-table-column prop="nodeName" label="状态" width="155" :formatter="formatter"></el-table-column>
        <el-table-column prop="taskDeptMajorName" label="部门"></el-table-column>
      </el-table>
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
        title: '待批公文',
        path: '/doc/docPending'
      },
      {
        title: '跟踪公文',
        path: '/doc/docTracking'
      },
      {
        title: '邮件通知',
        path: '#'
      },
      {
        title: '公文超时',
        path: '#'
      },
      {
        title: '生日提醒',
        path: '/BirthdayReminder'
      },
      {
        title: '会议通知',
        path: '#'
      }
      ],
      menuHeight: 0,
      processDialogView: false,
      message: []
    };
  },
  computed: {
    ...mapGetters([
      'reciver',
      'userInfo',
      'isAdmin',
      'processView',
      'processData'
    ]),
    menuItemHeight() {
      return this.menuHeight / (this.navMenu.length + 1)
    }
  },
  components: { SidePersonSearch },
  created() {
    this.$store.dispatch('getAdminStatus');
    this.$store.dispatch('getDocForm');
    this.$http.post("/doc/docTips", {
      empId: this.userInfo.empId
    }).then((res) => {
      if (res.status == 0) {
        this.message.push(res.data.pendingNum);
        this.message.push(res.data.trackingNum);
        this.message.push(res.data.toReadNum);
        this.message.push(res.data.overTimeNum);
        this.message.push(res.data.birthdayNum);
        this.message.push(0);

      }
    })
  },
  mounted: function() {
    this.breadcrumbItem = this.$route.meta.breadcrumb;
    this.menuHeight = document.querySelector('.el-menu.mySideLink').clientHeight
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
          return "转发";
          break;
        case 'end':
          return "归档";
          break;

        default:
          return cellValue;
      }
    },
    getTop(index) {
      let h = this.menuItemHeight
      let top = h * (index + 1) + 20
      return top + 'px'
    },
    changeProceesView(val) {

    },
    close() {
      this.$store.commit('SET_PROCESS_VIEW', false)
    }
  },
  watch: {
    '$route'(to, from) {
      if (to.meta) {
        this.breadcrumbItem = to.meta.breadcrumb;
      }
    },
    'processView'(newValue) {
      this.processDialogView = newValue;
    }
  },
}

</script>
<style lang='scss'>
#os {
  .mySideLink {
    margin-bottom: 20px;
    .badge {
      z-index: 2;
      display: block;
      position: absolute;
      padding-top: .6px;
      left: 95px;
      background-color: #BE3B7F;
      color:#fff;
      border-radius: 50%;
      text-align: center;
      width: 19px;
      height: 19px;
      line-height: 19px;
      font-size: 12px;
    }
  }
  .processDialog {

    .el-dialog__body {
      .el-table {
        td {
          height: 68px;
        }
      }
      .stepswrap {
        position: absolute;
        height: 100%;
        z-index: 1;
        padding-top: 28px;
        width: 45px;
        .el-steps {
          height: 100%;
          width: 32px;
          margin: 0 auto;
          padding: 18px 0 50px;
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
