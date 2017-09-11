<template>
  <div id='doc-approval'>
    <el-row :gutter='12'>
      <el-col :span='18' :xs="24">
        <router-view></router-view>
      </el-col>

      <el-col :span='6' class="sideBox">
        <el-card class='doc-search-card'>
          <div slot="header" class='doc-bar_title'>
            <span>Contact List</span>
          </div>
          <el-input placeholder="Staff Name" class="search ">
            <el-button slot="append">Search</el-button>
          </el-input>
        </el-card>

          <el-menu mode="vertical" v-bind:router="true">
            <el-menu-item-group title="Doc Approval System">
              <template v-for='(item,index) in navMenu'>
                <el-menu-item v-if='item.path' :index='index.toString()'  :route="{path:item.path}">{{item.title}}
                    <i class="el-icon-arrow-right"></i>
                </el-menu-item>
                <el-submenu v-if='item.child' :index='index.toString()' >
                    <template slot="title" >{{item.title}}</template>
                    <el-menu-item v-for='(i,key) in item.child' :index='index.toString()+key.toString()' :route="{path:i.path}">&nbsp;{{i.title}}</el-menu-item>
                </el-submenu>
              </template>
            </el-menu-item-group>
          </el-menu>

      </el-col>
    </el-row>
  </div>
</template>
<style lang='scss'>

  #doc-approval .doc-bar_title{
    font-size: 18px;
    line-height: 20px;
  }

  #doc-approval .el-menu .el-menu-item{
    font-size: 15px;
  }

</style>
<script>
    export default{
        data(){
            return{
              breadcrumbItem:'',
              navMenu:[
                {
                    title:'Doc Submission',path:'/doc/docSub'
                },
                {
                    title:'Doc Tracking',path:'/doc/docTracking'
                },
                {
                    title:'Batch Approval',path:'#'
                },
                {
                    title:'Action List',path:'#'
                },
                {
                    title:'Follow Up List',path:'#'
                },
                {
                   title:'Doc Searching',
                   child:[
                     {title:'Doc Searching',path:'#'},
                     ],
                },
                {
                    title:'Payment Searching',path:'/doc/paymentSearch'
                },
                {
                   title:'Reimbursement Summary',
                   child:[
                     {title:'Reimbursement Summary',path:'/doc'},
                     ],
                },
                {
                   title:'Outstanding Payment',
                   child:[
                     {title:'Outstanding Payment',path:'/doc'},
                     ],
                },
              ]
            };
        },
        components:{
        },
        mounted:function(){
          this.breadcrumbItem = this.$route.meta.breadcrumb;
        },
        watch: {
          '$route'(to, from) {
            if(to.meta){
              this.breadcrumbItem = to.meta.breadcrumb;
            }
          }
        },
    }

</script>
