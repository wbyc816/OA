<template>
  <div class="quitAdvice">
    <h4 class='doc-form_title'>工作交接登记</h4>
    <div class="boxWrap">
      <h4 class='doc-form_title'>{{currentDepName}}</h4>
      <table bgcolor="#fff" class="adviceList" width="100%" cellspacing="0" v-if="infoTable.length>0">
        <thead align="left">
          <tr>
            <th v-for="title in tableTitle">{{title}}</th>
          </tr>
        </thead>
        <tbody v-for="sign in infoTable">
          <tr>
            <td>{{sign.taskName}}</td>
            <td>{{sign.signContent}}</td>
            <td>{{sign.signUserName}}</td>
            <td>{{sign.remark}}</td>
          </tr>
        </tbody>
      </table>
      <el-row :gutter="60">
        <el-col :span="12" v-for="(sign,index) in submitInfo">
          <div class="adviceBox">
            <span class="title">{{sign.taskName}}</span>
            <el-input v-model="sign.signContent" type="textarea" resize="none" :rows="sign.isTaskNameOther==1?6:3"></el-input>
          </div>
          <div class="adviceBox">
            <span class="title">其他</span>
            <el-input v-model="sign.remark" :readonly="sign.isView==0"></el-input>
          </div>
          <div class="adviceBox" v-if="info.doc.isOwnDeptSign==1&&sign.isTaskNameOther!=1">
            <span class="title">交接人</span>
            <query-person :data.sync='submitInfo[index]'></query-person>
          </div>
        </el-col>
        <el-col :span='24' v-if="leaderAdvice">
          <div class="adviceBox">
            <span class="title">部门总经理意见</span>
            <el-input v-model="leaderAdvice.signContent" type="textarea" resize="none" :rows="3"></el-input>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-button type="primary" class="submitButton" @click="submit" :disabled="submitLoading">提交</el-button>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import QueryPerson from '../../../components/queryPerson.component'
export default {
  components: {
    QueryPerson
  },
  props: {
    info: {
      type: Object
    }
  },
  data() {
    return {
      submitInfo: [],
      infoTable: [],
      leaderAdvice: '',
      isLeader: false,
      currentDepName: '',
      tableTitle: ['项目', '移交情况', '交接人', '其他'],
      submitLoading:false
    }
  },
  created() {
    this.info.signs.forEach(s => {
      if (s.isDeptPrincipalEnd == 1) {
        this.leaderAdvice = s;
        this.isLeader = true;
        this.currentDepName = s.signDeptMajorName;
      } else if (s.isView == 0) {
        this.infoTable.push(s);
        this.currentDepName = s.signDeptMajorName;
      } else {
        this.submitInfo.push(s);
        this.currentDepName = s.signDeptMajorName;
      }
    })
    // this.submitInfo = this.info.signs;
  },
  computed: {
    ...mapGetters([
    ])
  },
  methods: {
    submit() {
      if (this.isLeader) {            //领导
        if (this.leaderAdvice.signContent !== '') {  
          this.doTask([this.leaderAdvice]);
        } else {
          this.$message.warning('请填写信息！');
        }
      }else if(this.info.doc.isOwnDeptSign==1){    //本部门
        if (this.submitInfo.every(s => s.signContent != '')&&this.submitInfo.filter(s=>s.isTaskNameOther!=1).every(s=>s.takeOverId!='')) {
          this.doTask(this.submitInfo);
        }else{
          this.$message.warning('请填写信息！');
        }
      }else {                                     //普通员工
        if (this.submitInfo.every(s => s.signContent != '')) {
          this.doTask(this.submitInfo);
        } else {
          this.$message.warning('请填写信息！');
        }
      }
    },
    doTask(params) {
      this.submitLoading=true;
      this.$http.post('/doc/docDimissionTask', { dimissionSign: params, submitType: 2 }, { body: true })
        .then(res => {
          this.submitLoading=false;
          if (res.status == 0) {
            this.$message.success('提交成功！');
            this.$router.push('/doc/docPending');
          } else {
            this.$message.error('提交失败！'+res.message);
          }
        })
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
  .boxWrap {
    padding-right: 20px;
    .el-col {
      margin-bottom: 20px;
      &:nth-child(even) {
        border-left: 1px solid #D5DADF;
      }
    }
  }
  .adviceBox {
    position: relative;
    padding-left: 90px; // padding-right: 20px;
    margin-bottom: 20px;
    .title {
      position: absolute;
      left: 0;
      top: 10px;
      font-size: 15px;
      width: 85px;
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
  .adviceList {
    table-layout: fixed;
    border: 1px solid #E7E7EB;
    margin-bottom: 30px;
    thead {
      background: $main;
      color: #fff;
      font-size: 13px;
      th {
        padding: 6px 13px;
      }
      $widths: (1: 15%, 2: 55%, 3: 10%, 4: 20%);
      @each $num,
      $width in $widths {
        th:nth-child(#{$num}) {
          width: $width;
        }
      }
    }
    tbody {
      background: #fff;
      td {
        padding: 4px 0 4px 13px;
        font-size: 15px;
        word-wrap: break-word;
        height: 55px;
        vertical-align: middle;
      }
    }
    tbody:nth-child(odd) {
      background: #F7F7F7;
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
