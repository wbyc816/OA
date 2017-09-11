<template>
  <div id='myBenefit'>
    <el-row :gutter='12'>
      <el-col :span='18' >
        <router-view></router-view>
      </el-col>
      <el-col :span='6' class="sideNav">
        <el-card>
          <div slot="header" class='doc-bar_title'>
            <span>Benifit Search</span>
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
<script>

  export default{

    mounted(){
    },
    data(){
      return{
        breadcrumbItem:'',
        navMenu:[
          {"title":"My Leisure Travel","path":"#"},
          {"title":"My Health Insurance","path":"#"},
          {"title":"My Staff Discount","path":"#"},
          {"title":"Staff Advertising Corner","path":"#"},
          {"title":"Hotel","path":"#"},
        ]

      }
    },

    methods:{


    },
    computed:{

    }
  }

</script>
<style lang='scss'>
  $purple:#7C5598;
  $brown: #985D55;
   #myBenefit{
    .doc-bar_title{
      font-size: 18px;
      line-height: 20px;
      border-bottom: 1px solid #f2f2f2;
      padding-bottom: 10px;
    }
  } 

</style>

