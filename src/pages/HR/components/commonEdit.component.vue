<template>
  <div class="eduEdit">
    <el-form :model="eduForm" ref="eduForm" label-position="left" label-width="110px" class="editForm">
      <template v-for="(edu,eduIndex) in dataList">
        <div class="header">
          <span class="title">{{edu.head}}</span>
          <el-button type="primary" icon="plus" size="small" @click="addItem(edu.enName)">添加</el-button>
          <el-button type="primary" icon="close" size="small" @click="showWarn(edu.enName,0)" v-show="eduForm[edu.enName].length!=0">删除</el-button>
        </div>
        <template v-for="(info,index) in eduForm[edu.enName]">
          <div class="header" v-if="index!=0">
            <span class="title">{{edu.head}}</span>
            <el-button type="primary" icon="close" size="small" @click="showWarn(edu.enName,index)">删除</el-button>
          </div>
          <el-form-item :label="item.label" :prop="edu.enName+'.'+index+'.'+item.name" :rules="{type:item.type,required: true, message:item.label+'不能为空', trigger: 'blur'}" v-for="item in edu.prop">
            <el-date-picker type="date" v-model="info[item.name]" style="width: 100%;" :editable="false" :clearable="false" v-if="item.type=='date'"></el-date-picker>
            <el-input v-model="info[item.name]" v-else></el-input>
          </el-form-item>
          <div class="borderBox"></div>
        </template>
        <div class="bgBorder"></div>
      </template>
      <el-form-item>
        <el-button type="primary" size="large" class="submitButton" @click.native="onSubmit" :disabled="submitLoading">提交</el-button>
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
    },
    dataList:{
      type:Array
    }
  },
  data() {
    return {
      eduForm: {
      },
      submitLoading: false,
      constTemp: {}
    }
  },
  computed: {
    ...mapGetters([
      'resumeInfo',
      'userInfo',
      'baseURL'
    ])
  },
  watch: {
    resumeInfo: function(newVal) {
      if (newVal != undefined || newVal != null) {
        this.combineObj(this.eduForm, newVal);
      }
    },
    getData: function(newVal, oldVal) {
      this.initConst();
      this.getDataList();
    }
  },
  created() {
    this.initConst();
  },
  // beforeRouteLeave(to, from, next) {
  //   // this.$store.dispatch('setEditStatus', false);
  //   // next()
  // },
  methods: {
    initConst() {
      this.dataList.forEach(e => {
        var temp = {
          oldId: '',
          empId: this.userInfo.empId,
          createUser: this.userInfo.name,
        }
        e.prop.forEach(c => {
          temp[c.name] = '';
        })
        this.constTemp[e.enName] = temp;
        this.$set(this.eduForm,e.enName,[])
      })      
    },
    getCheckId() {
      return this.$http.post('/resume/insertCheck', { empId: this.userInfo.empId }, { body: true })
    },
    addItem(name) {
      this.eduForm[name].push(this.clone(this.constTemp[name]));
    },
    showWarn(name, index) {
      this.$confirm('确定删除此条信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delItem(name, index);
      }).catch(() => {

      });
    },
    delItem(name, index) {
      this.eduForm[name].splice(index, 1);
    },
    onSubmit() {
      if (Object.keys(this.eduForm).some(name => this.eduForm[name].length > 0)) {
        this.$refs['eduForm'].validate((valid) => {
          if (valid) {
            if (!this.submitLoading) {
              this.submitLoading = true;
              this.handleSubmit();
            }
          } else {
            this.$message.warning('请检查填写信息')
            return false;
          }
        });
      }
    },
    handleSubmit() {
      this.$http.post('/resume/insertCheck', { empId: this.userInfo.empId }, { body: true })
        .then(res => {
          console.log(111)
          if (res.status == '0') {
            Object.keys(this.eduForm).forEach(name => {
              this.eduForm[name].forEach(c => c.checkID = res.data)
            })
            this.updateInfo();
          } else {
            console.log('获取checkId失败')
          }
        }, res => {

        })
    },
    updateInfo() {
      var requests = [];
      var nameList = []
      this.dataList.forEach(e => {
        if (this.eduForm[e.enName].length > 0) {
          var params=this.eduForm[e.enName].map(c=>this.changeTime(c));
          if(e.extraParams){
            Object.assign(params,e.extraParams)
          }
          requests.push(this.$http.post(e.postUrl,params, { body: true }));
          nameList.push(e.head);
        }
      })
      this.$http.all(requests)
        .then(res => {
          this.submitLoading = false;
          var successList = [];
          var failList = [];
          res.forEach((r,index) => {
            if (r.status == 0) {
              successList.push(nameList[index]);
            } else {
              failList.push(nameList[index]);
            }
          })
          if (successList.length != 0) {
            this.$notify.success('提交' + successList.join('、') + '申请成功,请等待后台审核!')
          }
          if (failList.length != 0) {
            this.$notify.error('提交' + failList.join('、') + '申请失败,请等待后台审核!')
          }
          this.$router.push('/HR/resume')
        })
    },
    getDataList() {
      this.dataList.forEach(e => {
        this.$http.post(e.url, { id: this.userInfo.empId })
          .then(res => {
            if (res.status == '0') {
              res.data.forEach(r => {
                e.prop.forEach(p => {
                  if (p.type == 'date') {
                    r[p.name] = new Date(r[p.name])
                  }
                })
                this.eduForm[e.enName].push(Object.assign(this.clone(this.constTemp[e.enName]), r))
              })
            } else {
              console.log('获取' + e.head + '失败')
            }
          }, res => {

          })
      })
      console.log(this.eduForm);
    }
  }
}

</script>
<style lang="scss">
$main:#0460AE;
$sub:#1465C0;
.eduEdit {}

</style>
