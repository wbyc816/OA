<template>
  <div id='doc-approval'>
    <el-row :gutter='12'>
      <el-col :span='17' :xs="24">
        <router-view></router-view>
      </el-col>
      <el-col :span='7' class="sideBox">
        <side-Person-Search></side-Person-Search>
        <el-menu mode="vertical" v-bind:router="true" class="mySideLink">
          <el-menu-item-group title="公文流转">
            <template v-for='(item,index) in navMenu'>
              <el-menu-item v-if='item.path' :index='index.toString()' :route="{path:item.path}">{{item.title}}
                <i class="el-icon-arrow-right"></i>
              </el-menu-item>
              <!-- <el-submenu v-if='item.child' :index='index.toString()' >
                    <template slot="title" >{{item.title}}</template>
                    <el-menu-item v-for='(i,key) in item.child' :index='index.toString()+key.toString()' :route="{path:i.path}">&nbsp;{{i.title}}</el-menu-item>
                </el-submenu> -->
            </template>
          </el-menu-item-group>
        </el-menu>
      </el-col>
    </el-row>
    <el-dialog title="流转详情" :visible.sync="processDialogView" size="large" class="myDialog processDialog" @close="close">
      <div class="stepswrap">
        <el-steps direction="vertical" :active="processData.length-1" finish-status="process" process-status="finish" :center="true">
          <el-step v-for="step in processData"></el-step>
        </el-steps>
      </div>
      <el-table :data="processData" class="myTable">
        <el-table-column width="44"></el-table-column>s
        <el-table-column prop="taskUserName" label="审批人" width="100"></el-table-column>
        <el-table-column prop="startTime" label="审批时间" width="155"></el-table-column>
        <el-table-column prop="截至时间" label="截至时间" width="150"></el-table-column>
        <el-table-column prop="时限" label="时限" width="75"></el-table-column>
        <el-table-column prop="nodeName" label="状态" width="90" :formatter="formatter"></el-table-column>
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
          title: '公文呈报',
          path: '/doc/docSub'
        },
        {
          title: '公文跟踪',
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
          path: '#'
        },
        {
          title: '公文统计',
          path: '#'
        }
      ],
      processDialogView: false
    };
  },
  computed: {
    ...mapGetters([
      'reciver',
      'userInfo',
      'isAdmin',
      'processView',
      'processData'
    ])
  },
  components: {SidePersonSearch},
  created() {
    this.$store.dispatch('getAdminStatus');
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
          return "转发";
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
    }
  },
  watch: {
    '$route' (to, from) {
      if (to.meta) {
        this.breadcrumbItem = to.meta.breadcrumb;
      }
    },
    'processView' (newValue) {
      this.processDialogView = newValue;
    }
  },
}

</script>
<style lang='scss'>
#doc-approval {
  .mySideLink {
    margin-bottom: 20px;
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
