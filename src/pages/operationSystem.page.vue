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
          </el-menu-item-group>
        </el-menu>
      </el-col>
    </el-row>
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
          path: '/doc/docPending'
        },
        {
          title: '生日提醒',
          path: '/BirthdayReminder'
        },
        {
          title: '会议通知',
          path: '/meeting/meetingSearch/1'
        }
      ],
      menuHeight: 0,
      message: []
    };
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'docTips'
    ]),
    menuItemHeight() {
      return this.menuHeight / (this.navMenu.length + 1)
    }
  },
  components: { SidePersonSearch },
  created() {
    this.$store.dispatch('getAdminStatus');
    this.$store.dispatch('getDocForm');
  },
  mounted: function() {
    this.menuHeight = document.querySelector('.el-menu.mySideLink').clientHeight
  },
  methods: {
    getTop(index) {
      let h = this.menuItemHeight
      let top = h * (index + 1) + 20
      return top + 'px'
    },
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$store.dispatch('getDocTips');
    })
  },
  watch: {
    docTips(newVal) {
      this.message = [];
      this.message.push(newVal.pendingNum);
      this.message.push(newVal.trackingNum);
      this.message.push(newVal.toReadNum);
      this.message.push(newVal.overTimeNum);
      this.message.push(newVal.birthdayNum);
      this.message.push(newVal.conferenceNum);
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
      color: #fff;
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
