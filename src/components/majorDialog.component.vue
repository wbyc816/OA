<template>
  <div class="majorDialog">
    <el-dialog size="large" class="personDialog" :visible.sync="dialogVisible" @close="close">
      <el-row>
        <el-col :span='6' class="leftOption">
          <el-menu class="menuBox" :default-openeds="['2']">
            <el-menu-item index="1" @click.native="selAll" v-if="hasAll">所有人</el-menu-item>
            <el-submenu index="2">
              <template slot="title">共享类型</template>
              <el-menu-item index="2-1" @click.native="selPerson">人员</el-menu-item>
              <el-menu-item index="2-2" @click.native="selDep">部门</el-menu-item>
            </el-submenu>
            <el-menu-item index="3" v-if="hasLevel">
              安全级别
              <el-select v-model="min" style="display:inline-block">
                <el-option v-for="item in levels" :key="item" :label="item" :value="item" :disabled="item>max">
                </el-option>
              </el-select>
              -
              <el-select v-model="max" style="display:inline-block">
                <el-option v-for="item in levels" :key="item" :label="item" :value="item" :disabled="item<min" v-if="item!=0">
                </el-option>
              </el-select>
            </el-menu-item>
            <el-menu-item index="4" v-if="hasOutSend" class="outSendInput">
              <el-autocomplete v-model.trim="outSendText" :fetch-suggestions="querySearchAsync" placeholder="对外发文">
                <el-button slot="append" type="primary" @click="addOutSend" :disabled="outSendText.length===0">添加</el-button>
              </el-autocomplete>
            </el-menu-item>
          </el-menu>
        </el-col>
        <el-col :span='18' class="rightBox">
          <div class="topSearch clearfix">
            <p class="tips">请选择<span v-show="isAll&&hasLevel">所有人安全级别</span>
              <span v-show="type=='dep'&&!isAll">部门{{hasLevel?'安全级别':''}}</span><span v-show="type=='person'&&!isAll">人员</span>
            </p>
            <el-input class="search" v-model.trim="name" v-show="type=='person'">
              <el-button slot="append" @click="search">搜索</el-button>
            </el-input>
          </div>
          <div class="rightContent">
            <div v-show="type=='dep'">
              <el-tree :data="depts" :props="defaultProps" node-key="id" :expand-on-click-node="true" :default-expanded-keys="defaultExpand" :render-content="renderContent">
              </el-tree>
            </div>
            <div v-show="type=='person'" style="height:100%;">
              <el-col :span="8">
                <organ-list @reset="reset1"></organ-list>
              </el-col>
              <el-col :span="16">
                <el-table :data="searchRes.empVoList" class="myTable searchRes" v-loading.body="searchLoading" @row-click="selectPerson" @selection-change="handleSelectionChange" :row-key="rowKey" :height="430" ref='multipleTable'>
                  <el-table-column type="selection" width="55" :reserve-selection="true">
                  </el-table-column>
                  <el-table-column prop="name" label="姓名" width="110"></el-table-column>
                  <el-table-column prop="depts" label="部门" width="170"></el-table-column>
                  <el-table-column prop="jobtitle" label="职务"></el-table-column>
                </el-table>
                <div class="pageBox" :style="{visibility:searchRes.empVoList ? 'visible' : 'hidden'}">
                  <el-pagination @current-change="handleCurrentChange" :current-page="depPageNumber" :page-size="10" layout="total, prev, pager, next, jumper" :total="searchRes.totalSize">
                  </el-pagination>
                </div>
              </el-col>
            </div>
          </div>
          <div class="selInfoBox">
            <p>已选择条件</p>
            <div class="clearfix selInfo">
              <el-tag key="all" :closable="true" type="primary" v-show="hasLevel?all.max:all" @close="closeAll">
                <template v-if="hasLevel">
                  {{'所有人('+all.min+'-'+all.max+')'}}
                </template>
                <template v-else>
                  所有人
                </template>
              </el-tag>              
              <el-tag :key="dep.id" :closable="true" type="primary" @close="closeDep(index)" v-for="(dep,index) in depList">
                <template v-if="hasLevel">
                {{dep.name+'('+dep.min+'-'+dep.max+')'}}
                </template>
                <template v-else>
                  {{dep.name}}
                </template>
              </el-tag>
              <el-tag :key="person.id" :closable="true" type="primary" @close="closePerson(index)" v-for="(person,index) in personList">
                {{person.name}}
              </el-tag>
              <el-tag :key="item" :closable="true" type="primary" @close="closeOutSend(index)" v-for="(item,index) in outList">
                {{item}}(对外)
              </el-tag>
              <el-button type="primary" size="large" @click="submitPerson">选中</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<style lang='scss'>
  $main:#0460AE;
  $sub:#1465C0;


  .majorDialog {
    .el-tree {
      border-bottom: none;
      border-left: none;
    }
    .el-dialog__wrapper{
      overflow-x:hidden;
    }
    .el-table__body-wrapper {
      overflow: hidden;
    }
    .el-tag {
      margin-right: 5px;
    }
    .outSendInput{
      border-bottom:none!important;
      background:#fff;
      input{
        border-right: none;
      }
      .el-input-group__append{
        background: $main;
        border: none;
        overflow: hidden;
        border-radius: 0;
        button{
          background:$main;
          color:#fff;
          height:47px;
          // border:none;
          &.is-disabled, &.is-disabled:focus, &.is-disabled:hover{
            color: #bfcbd9;
            cursor: not-allowed;
            background-image: none;
            background-color: #eef1f6;
            border-color: #eef1f6
            ;
          }
        }
      }
    }
    .topSearch {
      padding: 10px;
      line-height: 47px;
      .tips {
        float: left;
        font-size: 16px;
      }
      .search {
        float: right;
        width:inherit;
        width: initial;
      }
    }
    .el-tree-node__content {
      position: relative;
      .depAdd {
        font-size: 14px;
        display: none;
      }
      &:hover {
        .depAdd {
          display: inline-block;
        }
      }
    }
    .menuBox {
      >.el-menu-item {
        border-bottom: 1px solid #F2F2F2;
        .el-select {
          width: 75px;
          .el-input__inner {
            border-width: 0 0 1px 0;
            border-color: $main;
            color: $main;
            padding: 0;
            text-align: center;
          }
          i {
            display: none;
          }
        }
      }
      .el-submenu {
        border-bottom: 1px solid #F2F2F2;
        .el-submenu__title {
          border-bottom: 1px solid #F2F2F2;
        }
        .el-menu {
          padding: 10px 0;
        }
        .el-menu-item {
          height: 35px;
          line-height: 35px;
          color: $sub;
        }
      }
    }
    .organlist {
      border-top: 1px solid #D5DADF;
      border-bottom: 1px solid #D5DADF;
      .topMenu {
        height: 490px;
        padding-bottom: 50px;
      }
    }
    .rightBox {
      border-left: 1px solid #D5DADF;
      .rightContent {
        height: 493px;
        overflow: auto;
      }
    }
    .myTable {
      &:before {
        display: none;
      }
    }
    .pageBox {
      overflow: hidden;
      padding-right: 10px;
      padding-top: 5px;
      padding-bottom: 5px;
      border-bottom: 1px solid #D5DADF;
      .el-pagination {
        float: right;
      }
    }
    .selInfoBox {
      p {
        font-size: 16px;
        padding-left: 15px;
        line-height: 40px;
        height: 40px;
      }
      .selInfo {
        background-color: #E5E7EF;
        padding-left: 15px;
        padding-top: 10px;
        line-height: 30px;
        font-size: 15px;
        position: relative;
        padding-right: 110px;
        min-height: 50px;
        padding-bottom: 10px; // >span {
        //   color: $main;
        //   margin-right: 10px;
        //   display: inline-block;
        //   padding-top: 14px;
        // }
        // .nameBox {}
        button {
          height: 100%;
          width: 100px;
          position: absolute;
          right: 0;
          top: 0;
        }
      }
    }
    .el-table tr:hover {
      background-color: #ccc;
      cursor: pointer;
      >td {
        background-color: #ccc;
      }
    }
  }
</style>
<script>
import OrganList from './organlist.component'
import { mapGetters, mapMutations } from 'vuex'
const levels = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
const defaultExpand = ['CFCD208495D565EF66E7DFF9F98764DA']    //默认展开部门ID
export default {
  components: {
    OrganList
  },
  data() {
    return {
      defaultExpand,
      levels,
      name: '',
      type: 'person',
      personList: [],
      initialReady: true,
      searchButton: false,
      dialogVisible: false,
      depList: [],
      min: 0,
      max: 100,
      all: '',
      outSendText:'',
      defaultProps: {
        children: 'childNode',
        label: 'name'
      },
      isAll: false,
      outSendList:[],
      outList:[]
    }
  },
  props: {
    dialogType: {   //单选或多选，默认单选
      type: String,
      default: 'radio'
    },
    visible: {
      type: Boolean,
      default: false
    },
    params: {    //其他参数
      type: Object
    },
    hasLevel: {
      type: Boolean,
      default: true
    },
    hasOutSend: {
      type: Boolean,
      default: false
    },
    hasAll: {
      type: Boolean,
      default: true
    },
  },
  watch: {
    'visible': function(newVal) {
      this.dialogVisible = newVal;
      if (newVal) {
        this.$store.dispatch('getDeptList');
        this.$store.dispatch('setQueryPage', 1);
        this.$store.dispatch('queryEmpList', {});
        this.checkParams();
      }
    },
    searchRes(newVal) {
        if(this.$refs.multipleTable&&this.initialReady){
          this.initialReady=false;
          this.$refs.multipleTable.store.states.selection=this.params.personList;
        }
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'searchLoading',
      'searchRes',
      'depts',
      'depPageNumber',
      'isAdmin'
    ])
  },
  created() {
    if(this.hasOutSend){
      this.getOutSendList();      
    }
  },
  methods: {
    checkParams() {
      if (this.params.all) {
        this.all = this.params.all;
      }
      if (this.params.personList.length != 0) {
        this.personList = this.params.personList;
      }
      if (this.params.depList.length != 0) {
        this.depList = this.params.depList;
      }
    },
    selAll() {
      this.isAll = true;
      var tip='';
      if(this.hasLevel){
        tip='是否选择安全级别为' + this.min + '-' + this.max + '的所有人?'
      }else{
        tip='是否选择所有人?'
      }
      this.$confirm(tip, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if(this.hasLevel){
          this.all = {
            min: this.min,
            max: this.max
          }
          if (this.max == 100 && this.min == 0) {
            this.depList = [];
            this.personList = [];
          }
        }else{
          this.depList = [];
          this.personList = [];
          this.all=true;          
        }          
      }).catch(() => {

      });
    },
    addOutSend(){
      if(this.outList.find(o=>o===this.outSendText)===undefined){
        this.outList.push(this.outSendText);
        this.outSendText='';
      }else{
        this.$message.warning('不能添加重复的对外发文！')
      }
    },
    closeAll() {
      this.all = '';
    },
    closeOutSend(index){
      this.outList.splice(index,1);
    },
    selPerson() {
      this.type = 'person';
      this.isAll = false;
    },
    closePerson(index) {
      this.personList.splice(index, 1);
    },
    selDep() {
      this.type = 'dep';
      this.isAll = false;
    },
    closeDep(index) {
      this.depList.splice(index, 1);
    },
    addDep(store, data) {
      var temp = this.depList.find((dep, index) => dep.id == data.id);
      this.all='';
      
      if (temp) {
        var index = this.depList.indexOf(temp)
        if(this.hasLevel){
          temp.min = this.min;
          temp.max = this.max;
        }        
        this.depList.splice(index, 1, temp)
      } else {
        if(this.hasLevel){
          this.depList.push({ id: data.id, name: data.name, min: this.min, max: this.max })
        }else{
          this.depList.push({ id: data.id, name: data.name})
        }
      }      
    },
    querySearchAsync(queryString, cb) {
      this.outSendText=queryString=queryString.substr(0,10);
      var outSendList = this.outSendList;
      var results = queryString ? outSendList.filter(this.createStateFilter(queryString)) : outSendList;
      cb(results);
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.indexOf(queryString.toLowerCase()) === 0);
      };
    },
    getOutSendList(){
      this.$http.post('/doc/getOutSend',{taskUserName:this.userInfo.name})
      .then(res=>{
        if(res.status==0){
          res.data.forEach(r=>{
            this.outSendList.push({value:r})
          });
        }else{

        }
      })
    },
    handleCurrentChange(page) {
      if (this.searchRes.empVoList) {
        this.$store.dispatch('setQueryPage', page);
        if (this.searchButton) {
          this.$store.dispatch('queryEmpList', { name: this.name })
        } else {
          this.$store.dispatch('queryEmpList', {})
        }
      }
    },
    search() {
      this.searchButton = true;
      this.$store.dispatch('setQueryDepId', '');
      this.$store.dispatch('setQueryPage', 1);
      this.$store.dispatch('queryEmpList', { name: this.name })
    },
    selectPerson(row) {
      this.$refs.multipleTable.toggleRowSelection(row);

    },
    rowKey(row) {
      return row.empId+row.postId
    },
    submitPerson() {
      this.$emit('updatePerson', { depList: this.depList, all: this.all, personList: this.personList,outList:this.outList })
      this.$emit('update:visible', false)
    },
    handleSelectionChange(val) {
      this.personList = val;
      this.all='';
    },
    reset1() {
      this.searchButton = false;
      this.name = '';
    },
    close() {
      this.$emit('update:visible', false)
    },
    renderContent(h, { node, data, store }) {
      if(data.name!='东海航空有限公司'){
        return ( <span >
          <span >
          <span > { data.name } < /span> < /span > <span style = "position:absolute;top:0; right: 20px" >
          <el-button class = "depAdd"
          type = "primary"
          icon = "plus"
          size = "mini"
          on-click = {
            () => this.addDep(store, data)
          } > 添加 < /el-button> < /span > </span>);
        }else{
          return (<span >
          <span >
          <span > { data.name } < /span> < /span ></span>)
        }
      }
    }
  }
</script>

