<template>
  <div class='menu-wrapper'>
    <template v-for="item in depts" v-if="itemType=='dep'?item.levelNum<30:true">
      <el-menu-item :index="item.name" v-if="itemType=='dep'?item.levelNum==20:item.childNode.length==0" @click.native.stop="selDep(item)" :class="{'active':queryDepId==item.id}">{{item.name}}</el-menu-item>
      <el-submenu :index="item.id" v-if="itemType=='dep'?item.levelNum<20:item.childNode.length!=0" @click.native.stop="selDep(item)" :class="{'active':queryDepId==item.id}">
        <template slot="title">{{item.name}}</template>
        <my-menu-item v-on:reset="reset2" :itemType="itemType" @depChange="depChange1" :depts="item.childNode" v-if="item.childNode&&item.childNode.length>0"></my-menu-item>
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
    },
    itemType: {
      type: String,
      default: 'person'
    }
  },
  data() {
    return {
      selItem: ''
    }
  },
  computed: {
    ...mapGetters([
      'queryDepId',
      'secretaryInfo'
    ])
  },
  methods: {
    selDep(item) {
      if (this.itemType == 'person') {
        if (item.id == 'JYMS') {
          this.$store.commit('QUERY_EMP_LIST', {
            pageNumber: 1,
            totalSize: 1,
            empVoList:this.secretaryInfo.empVoList
          })
        } else {
          // this.$store.dispatch('queryEmpList', {})
          this.$store.dispatch('setQueryDepId', item.id);
          if (item.levelNum >= 30) {
            this.$store.dispatch('setQueryPage', 1);
            this.$store.dispatch('queryEmpList', {})
          }
        }
      } else {
        this.$emit('depChange', item.id);
      }
      this.$emit('reset');
    },
    reset2() {
      this.$emit('reset');
    },
    depChange1(id) {
      this.$emit('depChange', id);
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

.el-menu-item.is-active {
  color: #393939;
}

.el-menu-item.active {
  background-color: rgb(209, 218, 229);
}

</style>
