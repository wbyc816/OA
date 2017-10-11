<template>
  <div class="salaryDialog">
    <el-dialog title="输入个人密码" size="large" class="personDialog" :visible.sync="salaryDialogVisible">
		  <el-form>
		    <el-form-item label="活动名称">
		      <el-input auto-complete="off"></el-input>
		    </el-form-item>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button @click="salaryDialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="salaryDialogVisible = false">确 定</el-button>
		  </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  data() {
    return {
      salaryDialogVisible:false
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  created() {

  },
  methods: {

  }
}
</script>
<style lang='scss'>

</style>