<template>
  <div id='doc-approval'>
    <el-row :gutter='12'>
      <el-col :span='17' :xs="24">
        <router-view></router-view>
      </el-col>

      <el-col :span='7' class="sideBox">
        <el-card class='doc-search-card'>
          <div slot="header" class='doc-bar_title'>
            <span>公司同仁</span>
          </div>
          <el-input placeholder="请输入员工姓名" class="search ">
            <el-button slot="append">搜索</el-button>
          </el-input>
        </el-card>

          <el-menu mode="vertical" v-bind:router="true" class="mySideLink">
            <el-menu-item-group title="公文流转">
              <template v-for='(item,index) in navMenu'>
                <el-menu-item v-if='item.path' :index='index.toString()'  :route="{path:item.path}">{{item.title}}
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
  </div>
</template>
<style lang='scss'>

  #doc-approval .doc-bar_title{
    font-size: 18px;
    line-height: 20px;
  }


</style>
<script>
    export default{
        data(){
            return{
              breadcrumbItem:'',
              navMenu:[
                {
                    title:'公文呈报',path:'/doc/docSub'
                },
                {
                    title:'公文跟踪',path:'#'
                },
                {
                    title:'公文签批',path:'#'
                },
                {
                    title:'公文查询',path:'/doc/docSearch'
                },
                {
                    title:'公文待阅',path:'#'
                },
                {
                    title:'公文统计',path:'#'
                }
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
