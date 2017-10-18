<template>
  <div id='set'>
    <el-row :gutter='12'>
      <el-col :span='17' :xs="24">
        <router-view></router-view>
      </el-col>
      <el-col :span='7' class="sideBox">
        <set-nav></set-nav>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import SetNav from '../../components/setNav.component'
export default {
  components: {
    SetNav
  }
}
</script>

<style>

</style>
