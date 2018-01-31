<template>
  <div class="docReturn" @click="open">
    <slot></slot>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    docId: '',
    warnText: {
      type: String,
      default:'此操作將公文退回到上一节点'
    }
  },
  data() {
    return {

    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  mounted() {

  },
  methods: {
    open() {
      this.$confirm(this.warnText+'，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post('/doc/docReturn', { docId: this.docId, empId: this.userInfo.empId })
          .then(res => {
            if (res.status == 0) {
              this.$message({
                type: 'success',
                message: '退回成功!'
              });
              this.$emit('confirm');
            } else {
              this.$message({
                type: 'error',
                message: res.message
              });
            }
          })
      }).catch(() => {

      });
    }
  }
}

</script>
<style lang="scss">
$main:#0460AE;
.docReturn {
  display: inline-block;
}

</style>
