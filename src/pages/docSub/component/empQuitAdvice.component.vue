<template>
  <div class="quitAdvice">
    <h4 class='doc-form_title'>工作交接登记</h4>
    <div class="boxWrap">
      <h4 class='doc-form_title' v-if="submitInfo[0]">{{submitInfo[0].signDeptMajorName}}</h4>
      <el-row :gutter="60">
        <el-col :span="12" v-for="info in submitInfo">
          <div class="adviceBox">
            <span class="title">{{info.taskName}}</span>
            <el-input v-model="info.signContent" type="textarea" resize="none" :rows="3" :readonly="info.isView==0"></el-input>
          </div>
          <div class="adviceBox">
            <span class="title">其他</span>
            <el-input v-model="info.remark" :readonly="info.isView==0"></el-input>
          </div>
        </el-col>
      </el-row>
      <el-button type="primary" class="submitButton" @click="submit">提交</el-button>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    info: {
      type: Object
    }
  },
  data() {
    return {
      submitInfo: []
    }
  },
  created() {
    this.submitInfo = this.info.signs;
  },
  computed: {

    ...mapGetters([
      'submitLoading'
    ])
  },
  methods: {
    submit() {
      if (this.submitInfo.every(s => s.signContent != '')) {
        this.$http.post('/doc/docDimissionTask', { dimissionSign: this.submitInfo, submitType: 2 },{body:true})
          .then(res => {
            if (res.status == 0) {
              this.$message.success('提交成功！');
              this.$router.push('/doc/docPending');
            } else {

            }
          })
      } else {
        this.$message.warning('请填写信息！');
      }
    }
  }
}

</script>
<style lang='scss'>
$main:#0460AE;
.quitAdvice {
  padding-bottom: 30px;
  >h4 {
    border-bottom: 1px solid #D5DADF;
    padding-bottom: 15px!important;
    margin-bottom: 15px;
  }
  .boxWrap{
    padding-right:20px;
    .el-col{
      margin-bottom:20px;
      &:nth-child(even){
        border-left:1px solid #D5DADF;
      }
    }
  
  }
  .adviceBox {
    position: relative;
    padding-left: 90px;
    // padding-right: 20px;
    margin-bottom: 20px;
    .title {
      position: absolute;
      left: 0;
      top: 10px;
      font-size: 15px;
      width: 85px;
    }
    &:last-child{
      margin-bottom:0;
    }
  }
  .submitButton {
    width: 150px;
    border-radius: 3px;
    margin-top: 20px;
    margin-left: 90px;
  }
}

</style>
