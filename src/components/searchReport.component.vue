<template>
  <div class="searchReport" v-loading="reportLoading">
    <el-card class="borderCard">
      <div slot="header" v-if="title">
        <span>{{title}}</span>
        <!-- <i class="iconfont icon-shuaxin"></i> -->
      </div>
      <el-row :gutter="10">
        <el-col :span="6">
          <el-select v-model="params.departureAirport" ref="takeOffData"  filterable placeholder="起飞四字码">
             <el-option
              v-for="item in takeOffData"
              :key="item.airCode"
              :label="item.airCode+'-'+item.airCodeName"
              :value="item.airCode">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6" v-if="!notype">
          <el-select v-model="params.arrivalAirport" ref="achieve"  filterable placeholder="到达四字码">
            <el-option
              v-for="item in achieve"
              :key="item.airCode"
              :label="item.airCode+'-'+item.airCodeName"
              :value="item.airCode">
            </el-option>
          </el-select>    
        </el-col>
         <el-col :span="6" v-if="!notype">
            <el-select v-model="params.leftPersonName" filterable placeholder="左座姓名">
            <el-option label="全部左座姓名" value=""></el-option>
            <el-option
              v-for="item in leftPerson"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>  
        </el-col>
         <el-col :span="6" v-if="!notype">
           <el-select v-model="params.rightPersonName" filterable placeholder="右座姓名">
            <el-option label="全部右座姓名" value=""></el-option>
            <el-option
              v-for="item in rightPerson"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>  
        </el-col>
         <el-col :span="6" v-if="!notype">
           <el-select v-model="params.controlPersonName" filterable placeholder="操作者">
            <el-option label="全部操作者" value=""></el-option>
            <el-option
              v-for="item in controllerPerson"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>  
        </el-col>

        <!-- <el-col :span="(hasOverTime||isPayStatus)?6:12">
          <el-date-picker v-model="params.beginTime" @change="begintime" type="date" :editable="false" placeholder="开始日期">
          </el-date-picker>
        </el-col>
        <el-col :span="(hasOverTime||isPayStatus)?6:12">
          <el-date-picker v-model="params.endTime" @change="endtime" type="date" :editable="false" placeholder="结束日期">
          </el-date-picker>
        </el-col> -->
        <el-col :span="(hasOverTime||isPayStatus)?6:12" >
        <div class="block">
          <el-date-picker
            v-model="time"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions2" 
            placeholder="日期"
            @change="changeDate">
          </el-date-picker>
        </div>
       </el-col>
        <el-col :span="6">
          <el-button class="searchButton" @click="submitParam">搜索</el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import util from '../common/util'
const payDoc = ['FKS', 'BXS', 'YFK', 'CLB']
export default {
  props: {
    title: {
      type: String
    },
    notype: {
      type: Boolean,
      default: false
    },
    hasOverTime: {
      type: Boolean,
      default: false
    },
    payStatus: {
      type: Boolean,
      default: false
    }
  },
  data() {
    var validateFourChar = (rule, value, callback) => {
    if (value && value.length != 0) {
      if (!(/^1[34578]\d{9}$/.test(value))) {
        callback(new Error("请填写完整四字码"));
      } else {
        callback();
      }
      } else {
        callback();
      }
    };
    return {
      rules: {
        takeOffData: [{ required: true, message: '请填写完整四字码', trigger: 'blur' },{ validator: this.validateFourChar, trigger: 'blur,change' }],
      },
      reportLoading:"",
       pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        time:"",
      params: {
        "beginTime":"",
        "endTime": "",
        "departureAirport": "ZGSZ",
        "arrivalAirport": "ZBHD",
        "leftPersonName": "",
        "rightPersonName": "",
        "controlPersonName": "",
    },
      isPay: "",
      reportDatas: [],
      defaultProp: {
        label: 'dictName',
        value: 'dictCode',
        children: 'childDict'
      },
      takeOffData:[],
      achieve:[],
      controllerPerson:[],
      rightPerson:[],
      leftPerson:[],
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'confidentiality',
      'typeTree'
    ])
  },
  created() {

    this.$store.dispatch('getConfident');
    this.$store.dispatch('getUrgency');
    this.$store.dispatch('getDocForm');
    this.getData();
    this.getDate()
  },
  methods: {
    getDate(){
      this.params.endTime=util.formatTime((new Date()).getTime(), 'yyyy-MM-dd');
      this.params.beginTime= util.formatTime((new Date()).getTime() - 3600 * 1000 * 24 * 30, 'yyyy-MM-dd');
    },
    changeDate(){
       if(this.time[0]){
        this.params.beginTime=util.formatTime(this.time[0], 'yyyy-MM-dd');
        this.params.endTime=util.formatTime(this.time[1], 'yyyy-MM-dd');
      }else{
        this.params.endTime=util.formatTime((new Date()).getTime(), 'yyyy-MM-dd');
        this.params.beginTime= util.formatTime((new Date()).getTime() - 3600 * 1000 * 24 * 30, 'yyyy-MM-dd');
      }
    },
    // begintime(val){
    //     this.params.beginTime=val;
    // },
    // endtime(val){
    //     this.params.endTime=val;
    // },
    getData() {
        this.$http.post('/foc/getAirCode', {
            position: 1 ,
        }).then(res => {
            if (res.status == 0) {
              this.takeOffData = res.list
              console.log(this.takeOffData)
            } else {

            }
          }, res => {

          }
        )
        this.$http.post('/foc/getAirCode', {
            position:"" ,
        }).then(res => {
            if (res.status == 0) {
              this.achieve = res.list
            } else {

            }
          }, res => {

          }
        )
          this.$http.post('/foc/getFocName', {
            role: "controller" ,
        }).then(res => {
            if (res.status == 0) {
              this.controllerPerson = res.list
            } else {

            }
          }, res => {

          }
        )
        this.$http.post('/foc/getFocName', {
            role:"left" ,
        }).then(res => {
            if (res.status == 0) {
              this.leftPerson = res.list
            } else {

            }
          }, res => {

          }
        )
          this.$http.post('/foc/getFocName', {
            role: "right" ,
        }).then(res => {
            if (res.status == 0) {
              this.rightPerson = res.list
            } else {
            }
          }, res => {
          }
        )
    },
    submitParam() {
      if(this.params.departureAirport!=""&&this.params.arrivalAirport!=""||this.params.departureAirport==""&&this.params.arrivalAirport==""){
         this.$emit('search', this.params)
      }else {
        this.$notify({
          title: '提示',
          message: '请选择完整四字码或都不选则',
          duration: 5000,
          type: 'warning'
        });
      }
     
    },
  }
}

</script>
<style lang='scss'>
$main:#0460AE;
$sub:#1465C0;
.searchReport {
  .el-card {
    padding-bottom: 10px;
  }
  .el-card__body {
    .el-col {
      margin-top: 13px;
    }
    .el-select {
      width: 100%;
    }
  }
}

.el-cascader__label {
  line-height: 46px;
}

.el-date-editor.el-input {
  width: 100%;
}

</style>
