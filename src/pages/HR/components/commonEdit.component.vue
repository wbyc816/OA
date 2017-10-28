<template>
  <div class="eduEdit">
    <el-form :model="eduForm" ref="eduForm" label-position="left" label-width="130px" class="editForm">
      <template v-for="(edu,eduIndex) in dataList">
        <div class="header">
          <span class="title">{{edu.head}}</span>
          <el-button type="primary" icon="plus" size="small" @click="addItem(edu.enName)">添加</el-button>
          <el-button type="primary" icon="close" size="small" @click="showWarn(edu.enName,0)" v-if="eduForm[edu.enName].length!=0&&eduForm[edu.enName][0].isDel!=1">删除</el-button>
        </div>
        <template v-for="(info,index) in eduForm[edu.enName]" v-if="info.isDel!=1">
          <div class="header" v-if="index!=0">
            <span class="title">{{edu.head}}</span>
            <el-button type="primary" icon="close" size="small" @click="showWarn(edu.enName,index)">删除</el-button>
          </div>
          <el-form-item :label="item.label" :prop="edu.enName+'.'+index+'.'+item.name" :rules="creatRule(item)" v-for="item in edu.prop" :style="{marginBottom:item.name=='postCompany'?'19px':'20px'}">
            <el-date-picker type="date" v-model="info[item.name]" style="width: 100%;" :editable="false" :clearable="false" v-if="item.type=='date'" :default-value="new Date(parseInt(info[item.name]))"></el-date-picker>
            <el-radio-group v-model="info[item.name]" class="myRadio" v-else-if="item.type=='boolean'">
              <el-radio-button :label="1">是<i></i></el-radio-button>
              <el-radio-button :label="0">否<i></i></el-radio-button>
            </el-radio-group>
            <el-input v-model="info[item.name]" v-else :maxlength="item.maxlength||99"></el-input>
          </el-form-item>
          <div class="borderBox"></div>
        </template>
        <div class="bgBorder"></div>
      </template>
      <el-form-item>
        <el-button type="primary" size="large" class="submitButton" @click="nextClick" :disabled="submitLoading">{{nextTabName=='last'?'提交':'下一步'}}</el-button>
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
    dataList: {
      type: Array
    },
    nextTabName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      eduForm: {},
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
          isDel:0
        }
        e.prop.forEach(c => {
          temp[c.name] = '';
        })
        this.constTemp[e.enName] = temp;
        this.$set(this.eduForm, e.enName, [])
      })
    },
    creatRule(item) {
      var rules = [{ type: item.type == 'boolean' ? 'number' : item.type, required: true, message: item.label + '不能为空', trigger: 'blur' }];
      if (item.rule) {
        rules.push(item.rule)
      }
      return rules
    },
    addItem(name) {
      if (this.eduForm[name].filter(c => c.id != undefined).every(c => c.isDel == 1)) {
      this.eduForm[name].unshift(this.clone(this.constTemp[name]));
      } else {
      this.eduForm[name].push(this.clone(this.constTemp[name]));
      }
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
      if (this.eduForm[name][index].id) {
          this.eduForm[name][index].isDel = 1;
          this.eduForm[name].push(this.eduForm[name].splice(index, 1)[0])
        } else {
          this.eduForm[name].splice(index, 1);
        }
    },
    onSubmit() {
      var paramList = {};
      this.dataList.forEach(e => {
        paramList[e.postName] = [];
        if (this.eduForm[e.enName].length > 0) {
          var params = this.eduForm[e.enName].map(c => this.changeTime(c));
          paramList[e.postName] = params;
        }
      })
      this.$emit('submit', paramList);
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
    },
    nextClick() {
      this.$refs['eduForm'].validate((valid) => {
        if (valid) {
          this.$emit('nextClick', this.nextTabName);
        } else {
          this.$message.warning('请检查填写信息')
          return false;
        }
      });
    }
  }
}

</script>
<style lang="scss">
$main:#0460AE;
$sub:#1465C0;
.eduEdit {}

</style>
