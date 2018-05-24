<template>
  <div class="osIndexPage">
    <el-card>
      <div slot="header">
        <span>运行生产</span>
      </div>
      <el-row :gutter='15'>
        <el-col :span="6" v-for="item in production" :key="item.toString()">
          <doc-list :data='item' :fontSize="fontSize"></doc-list>
        </el-col>
      </el-row>
    </el-card>
    <el-card class='os-block os-finance'>
      <div slot="header">
        <span>营销服务</span>
      </div>
      <el-row :gutter='15'>
        <el-col :span="6" v-for="item in saleService" :key="item.toString()">
          <doc-list :data='item' :fontSize="fontSize"></doc-list>
        </el-col>
      </el-row>
    </el-card>
    <el-card class='os-block os-contrast'>
      <div slot="header" class='doc_title'>
        <span>综合管理</span>
      </div>
      <el-row :gutter='15'>
        <el-col :span="6" v-for="item in management" :key="item.toString()">
          <doc-list :data='item' :fontSize="fontSize"></doc-list>
        </el-col>
      </el-row>
    </el-card>
    <el-card class='os-block os-contrast'>
      <div slot="header" class='doc_title'>
        <span>员工服务</span>
      </div>
      <el-row :gutter='15'>
        <el-col :span="6" v-for="item in staffService" :key="item.toString()">
          <doc-list :data='item' :fontSize="fontSize"></doc-list>
        </el-col>
      </el-row>
    </el-card>
  </div>
  
</template>
<script>
import { mapGetters } from 'vuex'
import DocList from '../../components/doc'
const production = [
  { 'logo': 'icon-Group12', 'font': '12px', 'color': '#FF754F', 'text': 'FOC系统', 'link': 'http://flight.donghaiair.cn/' },
  { 'logo': 'icon-Group', 'font': '12px', 'color': '#9FD867', 'text': 'SMS管理系统', 'link': 'http://sms.donghaiair.cn:8080/login.jsp' },
  { 'logo': 'icon-Group1', 'font': '12px', 'color': '#A5A3FF', 'text': '飞行准备网', 'link': 'http://foc.donghaiair.cn/' },
  { 'logo': 'icon-Path1', 'font': '26px', 'color': '#FF5F88', 'text': '乘务准备网', 'link': 'http://prep.donghaiair.cn:82/' },
  { 'logo': 'icon-Group10', 'font': '24px', 'color': '#FF5F88', 'text': 'ME机务维修信息管理系统', 'link': 'http://192.168.8.154/mis2/' },
  // { 'logo': 'icon-Group22', 'color': '#5BB5FC', 'text': '排班系统', 'link': '#' },
  // { 'logo': 'icon-Path2', 'color': '#FF754F', 'text': '飞行排班系统', 'link': '#' },
  { 'logo': 'icon-Group7', 'font': '22px','color': '#FFE066', 'text': '机供品配餐管理系统', 'link': 'http://192.168.8.150:8090/base/themes/style4/login.jsp' },
  { 'logo': 'icon-Group9', 'font': '24px', 'color': '#5BB5FC', 'text': '地面保障系统', 'link': 'http://192.168.8.147:8081/GroundWeb/' },
  // { 'logo': 'icon-Group8', 'color': '#FF754F', 'text': '飞行计划系统', 'link': '#' }
];
const saleService = [
  { 'logo': 'icon-Group3', 'font': '12px', 'color': '#5BB5FC', 'text': 'B2B系统', 'link': 'http://dzb2b.travelsky.com/dzb2b/' },
  { 'logo': 'icon-Group5', 'font': '26px', 'color': '#FF754F', 'text': '服务信息网', 'link': 'http://sis.donghaiair.cn' },
  { 'logo': 'icon-Path', 'font': '26px','color': '#A5A3FF', 'text': '常旅客系统', 'link': 'http://ffp.donghaiair.com/' },
  // { 'logo': 'icon-Group6', 'color': '#FF5F88', 'text': '运价系统', 'link': '#' },
  { 'logo': 'icon-Group2', 'font': '24px', 'color': '#FFE066', 'text': '呼叫中心系统', 'link': 'http://192.168.10.77:8080/DZCCOS/' },
  // { 'logo': 'icon-shouyi', 'color': '#5BB5FC', 'text': '收益辅助系统', 'link': '#' },
];
const management = [
  { 'logo': 'icon-jinbi-qian','font': '19px', 'color': '#A5A3FF', 'text': '财务EBS系统', 'link': 'http://ebs01.donghaiair.cn:8000' },
  // { 'logo': 'icon-Group11', 'color': '#FF5F88', 'text': '收入管理系统', 'link': '#' },
  // { 'logo': 'icon-Group13', 'color': '#9FD867', 'text': '财务预算系统', 'link': '#' },
  // { 'logo': 'icon-Group16', 'color': '#FF5F88', 'text': '食堂管理系统', 'link': '#' },
  { 'logo': 'icon-Group15', 'font': '19px','color': '#5BB5FC', 'text': '邮箱', 'link': 'http://mail.donghaiair.cn/' },
   { 'logo': 'icon-gongwen', 'font': '34px','color': '#FFE066', 'text': '泛微OA', 'link': 'http://fwoa.donghaiair.cn' },
  // { 'logo': 'icon-Group18', 'color': '#FF754F', 'text': '短信平台', 'link': '#' }
];
const staffService = [
  { 'logo': 'icon-Group17', 'padding': '0 1px 0 0','font': '23px', 'color': '#FF754F', 'text': '中国民用航空网', 'link': 'http://www.ccaonline.cn/' },
  { 'logo': 'icon-Group19', 'font': '24px', 'color': '#FF5F88', 'text': '民航资源网', 'link': 'http://www.carnoc.com/' },
  { 'logo': 'icon-Group21', 'font': '27px','color': '#FFE066', 'text': '深圳社保局', 'link': 'http://www.szsi.gov.cn/' },
  { 'logo': 'icon-gongjijin1', 'font': '24px', 'color': '#9FD867', 'text': '深圳住房公积金管理中心', 'link': 'http://www.szzfgjj.com/' },
  { 'logo': 'icon-Path3', 'font': '28px','color': '#FFE066', 'text': '深圳市公安局', 'link': 'http://www.szga.gov.cn/' },
  { 'logo': 'icon-Group20', 'font': '28px', 'color': '#9FD867', 'text': '深圳市工商', 'link': 'http://www.szmqs.gov.cn/' }
];
export default {
  data() {
    return {
      production,
      saleService,
      management,
      staffService,
      fontSize: '30px'
    };
  },
  computed: {
    ...mapGetters([
      'userInfo',
    ])
  },
  components: {
    DocList
  },
  mounted() {
   this.pushProduction();
  },
  methods:{
    pushProduction(){
      if(this.userInfo.workNo&&this.production.length<8){
        this.$http.post('/index/fuelLogin', { workNo:this.userInfo.workNo})
        .then(res => {
          if (res.status == 0) {
            console.log(res.data)
            this.production.push(  { 'logo': 'icon-jiayouzhan', 'font': '24px', 'color': '#9FD867', 'text': '节油系统', 'link': res.data})
          } else {

          }
        })
      }
      
      
    }
  }
}

</script>
<style lang='scss'>
.osIndexPage {
  .el-card {
    padding: 0 20px;
    .el-card__header {
      padding-left: 0;
      padding-right: 0;
    }
    .el-card__body {
      padding: 20px 0;
    }
  }



  .el-col {
    margin: 12px 0;
  }

  .doc_small-title {
    font-size: 14px;
  }
}
</style>
