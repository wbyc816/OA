<template>
  <div class="queryPerson">
    <el-select v-model="personId" filterable remote placeholder="请输入关键词搜索人员" :remote-method="remoteMethod" :loading="loading" @change="changePerson" ref="person" style="width:100%">
      <el-option v-for="item in personList" :key="item.empId" :label="item.name" :value="item.empId">
      </el-option>
    </el-select>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    data:{
      type:Object
    }
  },
  data() {
    return {
      personList:[],
      personId:'',
      loading:false,
      meTimeout:null
    }
  },
  created() {
    // if(this.depts != '' || this.depts != undefined || this.depts != null){
    //   this.organLoading = false;
    // }
  },
  computed: {
     ...mapGetters([
      'submitLoading'
    ])
  },
  methods: {
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        clearTimeout(this.meTimeout);
        this.meTimeout = setTimeout(() => {
          this.$http.post('/emp/queryEmpDeptList', { name: query, deptId: this.data.signDeptMajorId, pageNumber: 1, pageSize: 50 })
            .then(res => {
              this.loading = false;
              if (res.status == 0) {
                this.personList = res.empVoList;
              } else {

              }
            })
        }, 300);
      } else {
        this.personList = [];
      }
    },
    changePerson(id){
      var temp=this.clone(this.data);
      temp.takeOverId=id;
      temp.takeOverName=this.$refs.person.selectedLabel;
      this.$emit('update:data', temp);
    }
  }
}

</script>
<style lang='scss'>
$main:#0460AE;
$sub:#1465C0;
.queryPerson {

  .el-input {
    .el-input-group__append,
    .el-input-group__prepend {
      display: none;
    }
  }
  .hasUnit {
    input {
      padding-right: 30px;
    }
    .el-input-group__append,
    .el-input-group__prepend {
      display: table-cell;
    }
    .el-input-group__append {
      border: none;
      position: absolute;
      top: 0;
      right: 10px;
      line-height: 46px;
      background: transparent;
      color: #393939;
      padding: 0;
      width: auto;
    }
  }
}

</style>
