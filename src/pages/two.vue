<template>
  <div class="two">

  <ul class="list-group" v-sortable="options">
    <li class="list-group-item">1 <i class="iconfont icon-drag handle"></i></li>
    <li class="list-group-item">2 <i class="iconfont icon-drag handle"></i></li>
    <li class="list-group-item">3 <i class="iconfont icon-drag handle"></i></li>
  </ul>



</div>

</template>

<script>
  import MyPie from '../components/myPie'
  import MyPolarArea from '../components/myPolarArea'
  import SearchDate from '../components/searchDate'
  import MessageCenter from'../components/message'
  import Weibo from'../components/weibo'
  import DocList from'../components/doc'
  const piedata = {
    labels: ['Airport Services', 'Cockpit', 'Cabin', 'HQ Staff', 'Outport Others', 'Outport China', 'MRO'],
    datasets: [
    {
      backgroundColor: [
      '#97BBCD',
      '#7ED0CF',
      '#DCDCDC',
      '#F7464A',
      '#FDB45C',
      '#DCDCDC',
      '#FAD2A2'
      ],
      data: [2, 688, 1732, 996,110,163,231]
    }
    ]
  };
  const pieoption ={
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display:false
    }
  } ;
  const polarAreaData={
    labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding'],
    datasets: [
    {
      label: 'My Second dataset',
      backgroundColor: [
      "#FF6384",
      "#4BC0C0",
      "#FFCE56",
      "#E7E9ED",
      "#36A2EB"
      ],
      pointBackgroundColor: 'rgba(255,99,132,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(255,99,132,1)',
      data: [300,500,100,50,100]
    }
    ]
  };
  const polarAreaOption= {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display: false,
    },title: {
      display: true,
      text: ''
    },
    scale:{
      ticks: {
        min: 0,
        max: 500,
        stepSize: 100,
        backdropPaddingX:0,
        fontSize:8
      }
    }
  };
  const options= [{
    value: '选项1',
    label: '黄金糕'
  }, {
    value: '选项2',
    label: '双皮奶'
  }, {
    value: '选项3',
    label: '蚵仔煎'
  }, {
    value: '选项4',
    label: '龙须面'
  }, {
    value: '选项5',
    label: '北京烤鸭'
  }];
  const msgData =[
  {"type":"work","color":"#7C5598" , "text":"ActionList:21" ,"font":"icon-wenjianfile"},
  {"type":"message","color":"#985D55" , "text":"ActionList:31" ,"font":"icon-liaotian"},
  {"type":"work","color":"#7C5598" , "text": "ActionList:41" ,"font":"icon-wenjianfile"},
  {"type":"work","color":"#7C5598" , "text": "ActionList:51" ,"font":"icon-wenjianfile"},
  {"type":"message","color":"#985D55" , "text": "ActionList:61" ,"font":"icon-liaotian"}
  ];
  const  weiboData=[
  {'author':'HR Group',
  'text':'公司的進步實在有賴每位員工的寶貴意見，而CONNECT就是其中一個直達公司管理層的有效渠道。在跟進期間，您的身份將會被保密。 您可將意見寫信至connect@hkairlines.com。一經刊登，您將有機會獲得價值港幣500元的超市禮券。',
  'forword':'1','favorite':'2','comment':'3',
  'time':'1213213233'},
  {'author':'HR Group',
  'text':'CONNECT is a great way to express your idea. Your comments are essential to HKA’s growth and your identity will be protected. Send us your opinion to connect@hkairlines.com and win a HKD500 coupon!',
  'forword':'3','favorite':'5','comment':'9',
  'time':'2213789323'},
  ];
  const  items=[
  {'logo':'icon-liaotian','color':'#FF754F','text':'Approval Form'},
  {'logo':'icon-wenjianfile','color':'#FF5F88','text':'Staff Leisure Travel'},
  {'logo':'icon-liaotian','color':'#FF754F','text':'Approval Form'},
  {'logo':'icon-wenjianfile','color':'#5BB5FC','text':'Staff Leisure Travel'},
  ];
  const tableData= [{
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }, {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄'
          }, {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }, {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          }];
  const tableData3= [{
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }, {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄'
          }, {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }, {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          }];
  export default {
    components: { MyPie,MyPolarArea,SearchDate,MessageCenter,DocList,Weibo },
    data() {
      return {
        piedata,
        pieoption,
        polarAreaData,
        polarAreaOption,
        tableData,
        tableData3,

        radio2: 'date',
        radio3: '上海',
        value6: '',
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        DepartDate:'',
        ReturnDate:'',
        fileList:[] ,
        options,
        value: '',
        activeName: 'second',
        weiboData,
        msgData,
        items,
        options: {
                    handle: '.handle',
                    filter: '.disabled',
                    animation:300,
                }
      };
    },
    methods: {
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(this.fileList);
      },
      handleSucess(response, file, fileList){

      },

      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },

      handleClick(tab, event) {
        console.log(tab, event);
      }
    }
  }
</script>

<style scoped lang='scss'>
  .el-table tr .el-table_1_column_2{
    font-size: 16px;
    color:green;
  }
</style>

