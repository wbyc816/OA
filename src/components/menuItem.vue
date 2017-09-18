<template>
  <div class='menu-wrapper'>
    <template v-for="item in depts">
      <el-menu-item :index="item.name" v-if="item.childNode.length==0" @click.native.stop="selDep(item)" :class="{'active':queryDepId==item.id}">{{item.name}}</el-menu-item>
      <el-submenu :index="item.name" v-else @click.native.stop="selDep(item)" :class="{'active':queryDepId==item.id}">
        <template slot="title">{{item.name}}</template>
        <my-menu-item :depts="item.childNode" v-if="item.childNode&&item.childNode.length>0"></my-menu-item>
      </el-submenu>
    </template>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'MyMenuItem',
  props: {
    depts: {
      type: Array
    }
  },
  data(){
    return{
      selItem:''
    }
  },
  computed: {
    ...mapGetters([
      'queryDepId'
    ])
  },
  methods: {
    selDep(item) {
      // this.selItem=item;
      this.$store.dispatch('setQueryDepId',item.id);
      if(item.levelNum>=30){
        this.$store.dispatch('setQueryPage',1);
        this.$store.dispatch('queryEmpList',{})
      }
      // console.log(item.id,this.queryDepId)
    }
  }
}

</script>
<style lang='scss'>
.el-submenu.active {
  >.el-submenu__title {
    background-color: rgb(209, 218, 229);
  }
}
.el-menu-item.is-active{
  color:#393939;
}
.el-menu-item.active {
  background-color: rgb(209, 218, 229);
}

</style>
