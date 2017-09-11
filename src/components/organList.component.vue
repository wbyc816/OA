<template>
  <div class="organlist">
    <el-menu mode="vertical"  v-bind:router="false">
      <el-submenu index="1">
        <template slot="title">HKA</template>
        <el-submenu index="1-1">
          <template slot="title">MGT OFFICE</template>
          <el-menu-item index="1-1-1">Management Office</el-menu-item>
          <el-menu-item index="1-1-2">Innovations Projects</el-menu-item>
        </el-submenu>
        <el-submenu index="1-2">
          <template slot="title">CABIN (HKA)</template>
        </el-submenu>
        <el-submenu index="1-3">
          <template slot="title">CABIN (HKE)</template>
        </el-submenu>
        <el-submenu index="1-4">
          <template slot="title">COCKPIT (HKA)</template>
        </el-submenu>
        <el-submenu index="1-5">
          <template slot="title">COCKPIT (HKE)</template>
        </el-submenu>
        <el-submenu index="1-6">
          <template slot="title">CARGO</template>
        </el-submenu>
        <el-submenu index="1-7">
          <template slot="title">COMMERCIAL</template>
        </el-submenu> 
      </el-submenu>
      <el-submenu index="2">
        <template slot="title">Other Company</template>
        <el-submenu index="2-1">
          <template slot="title">选项4</template>
          <el-menu-item index="2-1-1">选项1</el-menu-item>
        </el-submenu>
      </el-submenu>
      <el-submenu index="3" class="longTitle">
        <template slot="title">Organization &<br/>Employee Development</template>
        <el-submenu index="3-1">
          <template slot="title">选项4</template>
          <el-menu-item index="3-1-1">选项1</el-menu-item>
        </el-submenu>
      </el-submenu>
      <el-submenu index="4">
        <template slot="title">HKC</template>
        <el-submenu index="4-1">
          <template slot="title">选项4</template>
          <el-menu-item index="4-1-1">选项1</el-menu-item>
        </el-submenu>
      </el-submenu>
      <el-submenu index="5">
        <template slot="title">HKE</template>
        <el-submenu index="5-1">
          <template slot="title">选项4</template>
          <el-menu-item index="5-1-1">选项1</el-menu-item>
        </el-submenu>
      </el-submenu>
      <el-submenu index="6">
        <template slot="title">HAGSL</template>
        <el-submenu index="6-1">
          <template slot="title">选项4</template>
          <el-menu-item index="6-1-1">选项1</el-menu-item>
        </el-submenu>
      </el-submenu>
    </el-menu>
  </div>
</template>
<style lang='scss'>
  $purple:#7C5598;

  .organlist{


    position: relative;

    &:before{
      content:'';
      position: absolute;
      top: 10px;
      right: -1px;
      height: 990px;
      background: #D8D8D8;
      border-right:1px solid #F2F2F2;
      z-index: 5;
      }
      
    &>.el-menu{
      position: relative;
      padding: 0 8px;
      box-shadow:none;      
      height: 1000px;
      overflow-y: auto;
      overflow-x: hidden;
          &::-webkit-scrollbar-track
      {
        border-radius: 10px;
        background-color: transparent;
      }

      &::-webkit-scrollbar
      {
        position: absolute;
        width: 5px;
        background-color: transparent;
        height: 10px;
        
      }

      &::-webkit-scrollbar-thumb
      {
        border-radius: 10px;
        background-color: #D8D8D8;
      }


      .el-submenu__title{
        padding: 0 10px !important;
      }
      .is-opened{
        &>.el-submenu__title{
/*          color:$purple;*/
        }       
      }
      &>.el-submenu{
        &>.el-menu{
          padding: 0;
          .el-submenu__title{
            border-bottom: none;
            color:$purple;
          }
          &>.el-submenu{
            .el-menu{
              border-bottom: none;
              .el-menu-item{
                padding-left: 30px !important;
                color:#909090;
              }
            }
          }
        }
      }
      .longTitle{
        &>.el-submenu__title{
          line-height: initial;
          padding-top: 7px !important;
        }
      }
    }
  }
</style>
<script>
  export default{
    data(){
      return{
      }
    },
    components:{
    },
    watch: {
    },
  }

</script>
