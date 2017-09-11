<template>
  <div id='staffCenter'>
    <el-row :gutter='12'>
      <el-col :span='18' >
        <router-view></router-view>
      </el-col>
      <el-col :span='6' class="sideNav">
        <el-card>
          <div slot="header" class='doc-bar_title'>
            <span>Contact List</span>
          </div>
          <el-input placeholder="Staff Name" class="search">
            <el-button slot="append">Search</el-button>
          </el-input>
        </el-card>

        <el-menu mode="vertical" v-bind:router="true">
          <el-menu-item-group title="Staff Center">
            <template v-for='(item,index) in navMenu'>
              <el-menu-item v-if='!item.child' :index='index.toString()'  :route="{'path':item.path}">
              {{item.title}}
                <i class="el-icon-arrow-right"></i>
              </el-menu-item>
              <el-submenu v-if='item.child' :index='index.toString()' >
                <template slot="title">{{item.title}}</template>
                <el-menu-item v-for='(i,key) in item.child' :index='index.toString()+key.toString()' :route="{'path':i.path}" v-text="i.title"></el-menu-item>
              </el-submenu>
            </template>
          </el-menu-item-group>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>
<style lang='scss'>

  #staffCenter{
    .doc-bar_title{
      font-size: 18px;
      line-height: 20px;
    }
  }
</style>
<script>
  export default{
    data(){
      return{
        breadcrumbItem:'',
        navMenu:[
          {"title":"My Account","path":"#"},
          {"title":"Public Mailbox","path":"#"},
          {"title":"IT Service","path":"#",'child':[
            {"title":"Job Request & Problem","path":"/staffCenter/jobRequest"},
            {"title":"My Request","path":"/staffCenter/myRequest"},
            {"title":"User Account Request","path":"#"}
          ]},
          {"title":"Flight Information","path":"/staffCenter/flightSearch"},
          {"title":"Booking Hotel","path":"#"},
          {"title":"Sign Dest","path":"#"},
          {"title":"My Attendance","path":"#"},
          {"title":"Contract Budget Info","path":"#"},
          {"title":"Budget Monitor","path":"#"},
          {"title":"Egress Apply","path":"#"},
        ]

      };
    },
    components:{
    },
    watch: {
      '$route'(to, from) {
        console.log(to);
        if(to.meta){
          this.breadcrumbItem = to.meta.breadcrumb;
        }
      }
    },
  }

</script>
