<template>
  <div id='reservationBooking'>
    <el-card class="borderCard">
      <span slot="header">Booking</span>
      <ul>
        <li><span>Staff</span><span>Chan Lok Wun</span></li>
        <li><span>Date</span><span>2017-01-07</span></li>
        <li><span>Start Time</span><span>09:00</span></li>
        <li><span>End Time</span><span>17:00</span></li>
        <li><span>Location</span><span>AFFC 10/F Training Rooms</span></li>
        <li><span>Room</span><span>Training Room A</span></li>
        <li><span>Subject</span><span>BIT-G</span></li>
      </ul>
    </el-card>
  </div>
</template>
<script>
  
  export default{

    mounted(){
    },
    data(){
      return{
        
      };
    },

    methods:{


    },
    computed:{

    }
  }

</script>
<style lang='scss'>
  $purple:#7C5598;
  $brown: #985D55;
  #reservationBooking{
    .borderCard{
      padding-bottom: 0;
    }
    li{
      line-height: 50px;
      border-bottom: 1px solid #f2f2f2;
      padding-left: 33px;
      font-size: 15px;
      span:first-child{
        display: inline-block;
        width: 180px;
        color:$purple;
      }
    }
  }

</style>

