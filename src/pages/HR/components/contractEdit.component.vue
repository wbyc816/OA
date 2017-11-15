<template>
  <div class="contractEdit">
    <el-form :model="contractForm" ref="contractForm" label-position="left" label-width="120px" class="editForm">
      <div class="header">
        <span class="title">合同信息</span>
        <el-button type="primary" icon="plus" size="small" @click="addContract">添加</el-button>
        <el-button type="primary" icon="close" size="small" @click="delContract(0)" v-if="contractForm.content.length!=0&&contractForm.content[0].isDel!=1">删除</el-button>
      </div>
      <template v-for="(contract,index) in contractForm.content" v-if="contract.isDel!=1">
        <div class="header" v-if="index!=0">
          <span class="title">合同信息</span>
          <el-button type="primary" icon="close" size="small" @click="delContract(index)">删除</el-button>
        </div>
        <el-form-item label="合同类型" :prop="'content.'+index+'.type'" :rules="{required: true, message: '合同类型不能为空', trigger: 'blur'}">
          <el-input v-model="contract.type" :maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="合同主体" :prop="'content.'+index+'.subject'" :rules="{required: true, message: '合同主体不能为空', trigger: 'blur'}">
          <el-input v-model="contract.subject" :maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="合同开始日期" :prop="'content.'+index+'.startDate'" :rules="{type:'date',required: true, message: '合同开始日期不能为空', trigger: 'blur'}">
          <el-date-picker type="date" v-model="contract.startDate" style="width: 100%;" :editable="false" :clearable="false" :picker-options="dateOptions[index].start"></el-date-picker>
        </el-form-item>
        <el-form-item label="合同结束日期" :prop="'content.'+index+'.endDate'" :rules="{type:'date',required: true, message: '合同结束日期不能为空', trigger: 'blur'}">
          <el-date-picker type="date" v-model="contract.endDate" style="width: 100%;" :editable="false" :clearable="false" :picker-options="dateOptions[index].end"></el-date-picker>
        </el-form-item>
        <div class="borderBox"></div>
      </template>
      <el-form-item class="opeartBox">
        <el-button type="primary" size="large" class="submitButton" @click="preClick" :disabled="submitLoading">上一步</el-button>
        <el-button type="primary" size="large" class="submitButton" @click="nextClick" :disabled="submitLoading">下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    getData: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      contractForm: {
        content: []
      },
      submitLoading: false,
      constTemp: { type: '', subject: '', endDate: '', startDate: '', createUser: '', empId: '', oldId: '', isDel: 0 },
      first: true
    }
  },
  computed: {
    dateOptions: function() {
      var options = []
      this.contractForm.content.forEach((c, index) => {
        var start = {
          disabledDate(time) {
            if (c.endDate != '') {
              return time.getTime() > c.endDate.getTime();
            } else {
              return false
            }
          }
        }
        var end = {
          disabledDate(time) {
            if (c.startDate != '') {
              return time.getTime() < c.startDate.getTime();
            } else {
              return false
            }
          }
        }
        options.push({ start: start, end: end })
      })
      return options
    },
    ...mapGetters([
      'resumeInfo',
      'userInfo',
      'baseURL'
    ])
  },
  watch: {
    resumeInfo: function(newVal) {
      if (newVal != undefined || newVal != null) {
        this.combineObj(this.contractForm, newVal);
      }
    },
    getData: function(newVal, oldVal) {
      this.getContract();
    }
  },
  created() {
    this.constTemp.empId = this.userInfo.empId;
    this.constTemp.createUser = this.userInfo.name;
  },
  // beforeRouteLeave(to, from, next) {
  //   // this.$store.dispatch('setEditStatus', false);
  //   // next()
  // },
  methods: {
    addContract() {
      if (this.contractForm.content.filter(c => c.id != undefined).every(c => c.isDel == 1)) {
        this.contractForm.content.unshift(this.clone(this.constTemp));
      } else {
        this.contractForm.content.push(this.clone(this.constTemp));
      }
    },
    delContract(index) {
      this.$confirm('确定删除此条信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.contractForm.content[index].id) {
          this.contractForm.content[index].isDel = 1;
          this.contractForm.content.push(this.contractForm.content.splice(index, 1)[0])
        } else {
          this.contractForm.content.splice(index, 1);
        }
      }).catch(() => {

      });
    },
    onSubmit() {
      this.$emit('submit', { contract: this.contractForm.content.map(c => this.changeTime(c)) });
    },
    getContract() {
      if (this.first) {
        this.$http.post('/resume/getContractInfo', { id: this.userInfo.empId })
          .then(res => {
            if (res.status == '0') {
              res.data.forEach(e => {
                e.startDate = new Date(e.startDate);
                e.endDate = new Date(e.endDate);
                this.contractForm.content.push(Object.assign(this.clone(this.constTemp), e))
              })
              this.first = false;
            }
          }, res => {

          })
      }

    },
    nextClick() {
      this.$refs['contractForm'].validate((valid) => {
        if (valid) {
          this.$emit('nextClick', 'edu')
        } else {
          this.$message.warning('请检查填写信息')
          return false;
        }
      });
    },
    preClick() {
      this.$emit('nextClick', 'person')
    }
  }
}

</script>
<style lang="scss">
$main:#0460AE;
$sub:#1465C0;
.contractEdit {}

</style>
