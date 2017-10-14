<template>
  <div class="osIndexPage">
    <el-card>
      <div slot="header">
        <span>运行生产</span>
      </div>
      <el-row :gutter='15'>
        <el-col :span="6" :xs='12' v-for="item in production" :key="item.toString()">
          <doc-list :data='item' :fontSize="fontSize"></doc-list>
        </el-col>
      </el-row>
    </el-card>
    <el-card class='os-block os-finance'>
      <div slot="header">
        <span>营销服务</span>
      </div>
      <el-row :gutter='15'>
        <el-col :span="6" :xs='12' v-for="item in saleService" :key="item.toString()">
          <doc-list :data='item' :fontSize="fontSize"></doc-list>
        </el-col>
      </el-row>
    </el-card>
    <el-card class='os-block os-contrast'>
      <div slot="header" class='doc_title'>
        <span>综合管理</span>
      </div>
      <el-row :gutter='15'>
        <el-col :span="6" :xs='12' v-for="item in management" :key="item.toString()">
          <doc-list :data='item' :fontSize="fontSize"></doc-list>
        </el-col>
      </el-row>
    </el-card>
    <el-card class='os-block os-contrast'>
      <div slot="header" class='doc_title'>
        <span>员工服务</span>
      </div>
      <el-row :gutter='15'>
        <el-col :span="6" :xs='12' v-for="item in staffService" :key="item.toString()">
          <doc-list :data='item' :fontSize="fontSize"></doc-list>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import DocList from '../../components/doc'
const production = [
  { 'logo': 'icon-FOC','font': '12px','color': '#FF754F', 'text': 'FOC系统', 'link': 'http://foc.donghaiair.cn/' },
  { 'logo': 'icon-SMs',  'font':'12px','color': '#FF5F88', 'text': 'SMS管理系统', 'link': 'http://sms.donghaiair.cn:8080/login.jsp' },
  { 'logo': 'icon-jingcha', 'font': '28px','color': '#A5A3FF', 'text': '飞行准备网', 'link': 'http://foc.donghaiair.cn/' },
  { 'logo': 'icon-nvchengwuyuan', 'font': '33px', 'color': '#9FD867', 'text': '乘务准备网', 'link': 'http://foc.donghaiair.cn:8011/SignIn.aspx' },
  { 'logo': 'icon-repair', 'color': '#FF5F88', 'text': 'ME机务维修信息管理系统', 'link': 'http://116.31.80.79/mis2' },
  { 'logo': 'icon-1144panzihecha-copy', 'color': '#5BB5FC', 'text': '机供品配餐管理系统', 'link': 'http://192.168.8.150:8090/base/themes/style4/login.jsp' },
  { 'logo': 'icon-chexianguanli','font': '26px', 'color': '#FF754F', 'text': '地面保障系统', 'link': 'http://192.168.8.147:8081/GroundWeb/ ' },
];
const saleService = [
  { 'logo': 'icon-BB', 'font': '12px', 'color': '#5BB5FC', 'text': 'B2B系统', 'link': 'http://dzb2b.travelsky.com/dzb2b/' },
  { 'logo': 'icon-msnui-network', 'font': '28px', 'color': '#FF754F', 'text': '服务信息网', 'link': 'http://192.168.8.23:8080/dzsis/mainMenu.html' },
  { 'logo': 'icon-user2',  'color': '#A5A3FF', 'text': '常旅客系统', 'link': 'http://ffp.donghaiair.com/' },
  { 'logo': 'icon-Cus-service', 'font': '28px','color': '#FF5F88', 'text': '呼叫中心系统', 'link': 'http://192.168.10.77:8080/DZCCOS/' },
];
const management = [
  { 'logo': 'icon-money', 'color': '#A5A3FF', 'text': '财务EBS系统', 'link': 'http://ebs01.donghaiair.cn:8000' },
  { 'logo': 'icon-tubiao01', 'color': '#FF5F88', 'text': '邮箱', 'link': 'http://mail.donghaiair.cn/' },
];
const staffService = [
  { 'logo': 'icon-zhifeiji-copy','font': '27px', 'color': '#FF754F', 'text': '中国民用航空网', 'link': 'http://www.ccaonline.cn/' },
  { 'logo': 'icon-icon3','font': '28px', 'color': '#FF5F88', 'text': '民航资源网', 'link': 'http://www.carnoc.com/' },
  { 'logo': 'icon-bz', 'color': '#FFE066', 'text': '深圳社保局', 'link': 'http://www.szsi.gov.cn/' },
  { 'logo': 'icon-gongjijin', 'font': '28px','color': '#5BB5FC', 'text': '深圳住房公积金管理中心', 'link': 'http://www.szzfgjj.com/' },
  { 'logo': 'icon-gonganju', 'color': '#9FD867', 'text': '深圳市公安局', 'link': 'http://www.szga.gov.cn/' },
  { 'logo': 'icon-gongshang', 'font': '36px','color': '#FF754F', 'text': '深圳市工商', 'link': 'http://www.szmqs.gov.cn/' }
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
  components: {
    DocList
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
