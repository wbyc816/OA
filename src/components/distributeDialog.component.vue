<template>
  <div class="distributeDialog">
    <el-dialog :visible.sync="dialogVisible" size="small" class="myDialog" custom-class="archiveSubmitDialog" @close="close" v-loading="submitLoading">
      <span slot="title">公文分发</span>
      <el-form label-position="left" :model="distributeForm" :rules="distributeFormRule" ref="distributeForm" label-width="75px">
        <el-form-item class='reciverWrap' label="收件人">
          <div class="reciverList">
            <el-tag key="all" :closable="true" v-show="distributeForm.all" type="primary" @close="removeAll">
              所有人
            </el-tag>
            <el-tag :key="dep.id" :closable="true" type="primary" @close="removeDep(index)" v-for="(dep,index) in distributeForm.depList">
              {{dep.name}}
            </el-tag>
            <el-tag :key="person.id" :closable="true" type="primary" @close="removePerson(index)" v-for="(person,index) in distributeForm.personList">
              {{person.name}}
            </el-tag>
          </div>
          <el-button class="addButton" @click="personVisible = true"><i class="el-icon-plus"></i></el-button>
        </el-form-item>
        <el-form-item label="分发意见" prop="res">
          <el-input type="textarea" :rows="6" resize='none' v-model="distributeForm.res" :maxlength="100"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="dialogSubmitButton" @click="dialogSubmit">分发</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <major-dialog :params="distributeForm" @updatePerson="updatePerson" :visible.sync="personVisible" :hasLevel="false"></major-dialog>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import MajorDialog from './majorDialog.component'
export default {
  components: {
    MajorDialog
  },
  data() {
    return {
      dialogVisible: false,
      personVisible: false,
      submitLoading: false,
      distributeForm: {
        res: '',
        all: '',
        personList: [],
        depList: []
      },
      distributeFormRule: {},
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    docId: ''
  },
  watch: {
    'visible': function(newVal) {
      this.dialogVisible = newVal;
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
    close() {
      this.$emit('update:visible', false);
      this.$emit('close');
    },
    dialogSubmit() {
      if (this.distributeForm.personList.length > 0 || this.distributeForm.depList.length > 0 || this.distributeForm.all) {
        this.docDistribution();
      } else {
        this.$message.warning('请选择收件人！');
      }
    },
    docDistribution() {
      this.submitLoading = true;
      var params = {
        "distDeptMajorId": this.userInfo.deptVo.fatherDeptId,
        "distDeptMajorName": this.userInfo.deptVo.fatherDept,
        "distDeptId": this.userInfo.deptVo.deptId,
        "distDeptName": this.userInfo.deptVo.dept,
        "distUserId": this.userInfo.empId,
        "distUserName": this.userInfo.name,
        "content": this.distributeForm.res,
        "docId": this.docId,
        "operateType": '1',
        "empIds": [],
        "deptIds": this.distributeForm.depList.map(d => d.id),
        "disType": this.distributeForm.all ? 'all' : ''
      }
      this.distributeForm.personList.forEach(person => {
        var temp = {
          "reciveDeptMajorId": person.deptParentId,
          "reciveDeptId": person.deptId,
          "reciveDeptName": person.deptParentName,
          "reciveUserId": person.empId,
          "reciveUserName": person.name,
        }
        params.empIds.push(temp);
      })
      // console.log(params);
      this.$http.post('/doc/docDistribution', params, { body: true })
        .then(res => {
          this.submitLoading = false;
          if (res.status == 0) {
            this.$message.success('分发成功！');
            this.dialogVisible = false;
            this.distributeForm.all = '';
            this.distributeForm.res = '';
            this.distributeForm.personList = [];
            this.distributeForm.depList = [];
          } else {
            this.$message.error(res.message)
          }
        })
    },
    updatePerson(payLoad) {
      this.personVisible = false;
      this.distributeForm = payLoad;
    },
    removePerson(index) {
      this.distributeForm.personList.splice(index, 1);
    },
    removeDep(index) {
      this.distributeForm.depList.splice(index, 1);
    },
    removeAll() {
      this.distributeForm.all = '';
    },
  }
}

</script>
<style lang='scss'>
.distributeDialog {
  .archiveSubmitDialog {
    width: 600px;
    .el-dialog__body {
      padding: 25px 25px 25px 8px;
    }
    .reciverWrap {
      .el-form-item__content {
        display: flex;
      }
      .reciverList {
        flex: 1;
        .el-tag {
          margin-right: 5px;
        }
      }
    }
    .dialogSubmitButton {
      width: 180px;
      border-radius: 3px;
    }
  }
}

</style>
