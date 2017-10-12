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
  { 'logo': 'icon-foc', 'color': '#fff', 'fontColor': 'green', 'text': 'FOC系统', 'link': 'http://foc.donghaiair.cn/' },
  { 'logo': 'icon-sms1', 'color': '#F48842', 'text': 'SMS管理系统', 'link': 'http://sms.donghaiair.cn:8080/login.jsp' },
  { 'logo': 'icon-jingcha', 'color': '#8ACCB8', 'text': '飞行准备网', 'link': 'http://foc.donghaiair.cn/' },
  { 'logo': 'icon-nvchengwuyuan', 'color': '#6693A5', 'text': '乘务准备网', 'link': 'http://foc.donghaiair.cn:8011/SignIn.aspx' },
  { 'logo': 'icon-repair', 'color': '#7956A5', 'text': 'ME机务维修信息管理系统', 'link': 'http://116.31.80.79/mis2' },
  { 'logo': 'icon-clock', 'color': '#7F70B0', 'text': '排班系统', 'link': '#' },
  { 'logo': 'icon-yqf-feiji', 'color': '#9A73A9', 'text': '飞行排班系统', 'link': '#' },
  { 'logo': 'icon-1144panzihecha-copy', 'color': '#B7C565', 'text': '机供品配餐管理系统', 'link': '#' },
  { 'logo': 'icon-chexianguanli', 'color': '#FAAC19', 'text': '地面保障系统', 'link': 'http://192.168.8.147:8081/GroundWeb/ ' },
  { 'logo': 'icon-99', 'color': '#F88634', 'text': '飞行计划系统', 'link': '#' },
  { 'logo': 'icon-feihangpaiban', 'color': '#FA5C26', 'text': '飞行排班系统', 'link': '#' }
];
const saleService = [
  { 'logo': 'icon-b2b', 'color': '#FF6036', 'text': 'B2B系统', 'link': 'http://dzb2b.travelsky.com/dzb2b/' },
  { 'logo': 'icon-msnui-network', 'color': '#75BF90', 'text': '服务信息网', 'link': 'http://192.168.8.23:8080/dzsis/mainMenu.html' },
  { 'logo': 'icon-user2', 'color': '#B9EE99', 'text': '常旅客系统', 'link': 'http://ffp.donghaiair.com/' },
  { 'logo': 'icon-yusuankongzhi', 'color': '#01D1AD', 'text': '运价系统', 'link': '#' },
  { 'logo': 'icon-Cus-service', 'color': '#7956A7', 'text': '呼叫中心系统', 'link': 'http://192.168.10.77:8080/DZCCOS/' },
  { 'logo': 'icon-chiyoushouyiyuan', 'color': '#FF8435', 'text': '收益辅助系统', 'link': '#' },
];
const management = [
  { 'logo': 'icon-money', 'color': '#FDAB8B', 'text': '财务EBS系统', 'link': 'http://ebs01.donghaiair.cn:8000' },
  { 'logo': 'icon-caiwu', 'color': '#FDB82E', 'text': '收入管理系统', 'link': '#' },
  { 'logo': 'icon-caiwutouzi', 'color': '#CDCD2E', 'text': '财务预算系统', 'link': '#' },
  { 'logo': 'icon-stgl', 'color': '#B77DBA', 'text': '食堂管理系统', 'link': '#' },
  { 'logo': 'icon-tubiao01', 'color': '#7953A8', 'text': '邮箱', 'link': 'http://mail.donghaiair.cn/' },
  { 'logo': 'icon-duanxin', 'color': '#F98837', 'text': '短信平台', 'link': '#' }
];
const staffService = [
  { 'logo': 'icon-zhifeiji-copy', 'color': '#7BB36A', 'text': '中国民用航空网', 'link': 'http://www.ccaonline.cn/' },
  { 'logo': 'icon-icon3', 'color': '#F48835', 'text': '民航资源网', 'link': 'http://www.carnoc.com/' },
  { 'logo': 'icon-bz', 'color': '#8ACEBB', 'text': '深圳社保局', 'link': 'http://www.szsi.gov.cn/' },
  { 'logo': 'icon-gongjijin', 'color': '#6292A0', 'text': '深圳住房公积金管理中心', 'link': 'http://www.szzfgjj.com/' },
  { 'logo': 'icon-gonganju', 'color': '#C5C482', 'text': '深圳市公安局', 'link': 'http://www.szga.gov.cn/' },
  { 'logo': 'icon-gongshang', 'color': '#F68931', 'text': '深圳市工商', 'link': 'http://www.szmqs.gov.cn/' }
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
