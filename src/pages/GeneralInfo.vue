<template>
  <div id='generalInfo'>
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
          <el-menu-item-group title="General Info">
            <template v-for='(item,index) in navMenu'>
              <el-menu-item v-if='!item.child' :index='index.toString()'  :route="{'path':item.path}">
              {{item.title}}
                <i class="el-icon-arrow-right"></i>
              </el-menu-item>
              <el-submenu v-if='item.child' :index='index.toString()' >
                <template slot="title" v-text='item.title'></template>
                <el-menu-item v-for='(i,key) in item.child' :index='index.toString()+key.toString()' :route='i.path'>&nbsp;{{i.title}}</el-menu-item>
              </el-submenu>
            </template>
          </el-menu-item-group>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>
<style lang='scss'>

  #generalInfo{
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
          {"title":"Forms","path":"/generalInfo/forms"},
          {"title":"Policies","path":"#"},
          {"title":"Training","path":"#"},
          {"title":"Contact List","path":"/generalInfo/contactList"},
          {"title":"Company News","path":"/generalInfo/news"},
          {"title":"E-School","path":"#"},
          {"title":"Daily News & Ads Update","path":"#"},
          {"title":"Department News","path":"#"},
          {"title":"Notice","path":"#"},
          {"title":"Meeting Reservation","path":"/generalInfo/MeetingReservation"},
          {"title":"Crew Evaluation","path":"#"},
          {"title":"Task Assignment","path":"/generalInfo/taskAssignment"},
          {"title":"Duty List","path":"#"},
          {"title":"Leave & Duty Trip","path":"/generalInfo/leaveDutyTrip"},
          {"title":"Staff Movement","path":"#"},
          {"title":"MyBenefit","path":"/generalInfo/myBenefit"}
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
