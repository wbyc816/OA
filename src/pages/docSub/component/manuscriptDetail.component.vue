<template>
  <div class="manuscriptDetail">
    <el-col :span="12" class="rightBorder">
      <h1 class="title">发文类型</h1>
      <p v-if="info" class="textContent">{{info[0].classify1}}</p>
    </el-col>
    <el-col :span="12">
      <h1 class="title">发文日期</h1>
      <p v-if="info" class="textContent">{{info[0].issueDate | time('date')}}</p>
    </el-col>
    <el-col :span="24">
      <h1 class="title">发文目录</h1>
      <p v-if="info" class="textContent">{{info[0].catalogueId}}</p>
    </el-col>
    <el-col :span="24">
      <h1 class="title">主送</h1>
      <p v-if="info" class="textContent">
        <el-tag key="all" type="primary" >
            {{'所有人('+0+'-'+90+')'}}
          </el-tag>
          <el-tag :key="dep.name"  type="primary" v-for="(dep,index) in depList">
            {{dep.name+'('+dep.min+'-'+dep.max+')'}}
          </el-tag>
          <el-tag :key="person.name"  type="primary" v-for="(person,index) in personList">
            {{person.name}}
          </el-tag>
      </p>
    </el-col>
    <el-col :span="12" class="rightBorder">
      <h1 class="title">签发人</h1>
      <p v-if="info" class="textContent">{{info[0].signId}}</p>
    </el-col>
    <el-col :span="12" class="rightBorder">
      <h1 class="title">校对人</h1>
      <p v-if="info" class="textContent">{{info[0].verifyId}}</p>
    </el-col>
    <el-col :span="24">
      <h1 class="title">正文</h1>
      <p v-if="info" class="textContent" style="color:#0460AE">{{info[0].classify1}}.pdf</p>
    </el-col>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
const depList=[{name:'综合部',max:10,min:90},{name:'后勤部',max:10,min:70},{name:'法律部',max:10,min:90}]
const personList=[{name:'王城',max:10,min:90},{name:'李健',max:10,min:70},{name:'孙浩',max:10,min:90}]
export default {
  props:{
    info:{
      type:Array
    }
  },
  data() {
    return {
      depList,
      personList,
      types:[]
    }
  },
  computed: {
    ...mapGetters([
      'sumitLoading'
    ])
  },
  created(){
    this.getType();
  },
  methods: {
    getType() {
      this.$http.post('/api/getDict', { dictCode: 'ADM04' })
        .then(res => {
          if (res.status == '0') {
            this.types = res.data;
          } else {
            console.log('获取发文类型失败')
          }
        }, res => {

        })
    },
  }
}

</script>
<style lang='scss'>
$main:#0460AE;
.manuscriptDetail {
  .el-input {
    width: 100%;
  }
}

</style>
