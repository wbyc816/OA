<template>
  <div id='meetingApp' class="commonApp" v-loading.fullscreen="submitLoading">
    <el-card>
      <div slot="header" class='doc_title'>
        <span>预订会议室</span>
      </div>
      <div class="docBaseBox doc-section">
        <h4 class='doc-form_title'>预订信息填写</h4>
        <el-form label-position="left" :model="appForm" :rules="rules" ref="appForm" label-width="128px">
          <el-form-item label="位置" prop="floor" placeholder="" class="deptArea">
            <el-select v-model="appForm.floor" style="width:100%" @change="changeFloor">
              <el-option v-for="item in roomList" :key="item.roomPosition" :label="item.roomPosition" :value="item.roomPosition">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="房间" prop="roomId" placeholder="" class="arrArea">
            <el-select v-model="appForm.roomId" style="width:100%" @visible-change="checkFloor" no-data-text="请先选择位置">
              <el-option v-for="item in rooms" :key="item.id" :label="item.roomName" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="预订日期" prop="reserveDate" class="clearBoth">
            <el-date-picker v-model="appForm.reserveDate" type="date" :editable="false" :clearable="false" style="width:100%" :picker-options="pickerOptions0"></el-date-picker>
          </el-form-item>
          <el-form-item label="开始时间" prop="beginTime" class="deptArea">
            <el-time-picker v-model="appForm.beginTime" :picker-options="timeOption" placeholder="选择时间" @change="beginTimeChange" :editable="false">
            </el-time-picker>
          </el-form-item>
          <el-form-item label="结束时间" prop="endTime" class="arrArea">
            <el-time-picker v-model="appForm.endTime" :picker-options="{format:'HH:mm',selectableRange:endOption+' - 22:00:00'}" placeholder="选择时间" @change="endTimeChange" :editable="false">
            </el-time-picker>
          </el-form-item>
          <el-form-item label="会议名称" prop="conferenceTitle" class="clearBoth">
            <el-input v-model="appForm.conferenceTitle" :maxlength="50">
            </el-input>
          </el-form-item>
          <el-form-item label="会议类型" prop="type" class="deptArea">
            <el-select v-model="appForm.type" style="width:100%">
              <el-option v-for="item in conferenceType" :key="item.id" :label="item.typeName" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="是否内部会议" prop="isInside" class="arrArea inside">
            <el-radio-group v-model="appForm.isInside" class="myRadio">
              <el-radio-button label="1">内部<i></i></el-radio-button>
              <el-radio-button label="0">外部<i></i></el-radio-button>
            </el-radio-group>
          </el-form-item> -->
          <el-form-item label="参会人员" prop="person" class="reciverWrap clearBoth">
            <div class="reciverList">
              <el-tag :key="person.id" :closable="true" type="primary" @close="closePerson(index)" v-for="(person,index) in appForm.person">
                {{person.name}}
              </el-tag>
            </div>
            <el-button class="addButton" @click="signDialogVisible=true"><i class="el-icon-plus"></i></el-button>
          </el-form-item>
          <el-form-item label="短信会议通知">
            <el-radio-group v-model="appForm.isMessage" class="myRadio">
              <!-- <el-radio-button label="1">发放<i></i></el-radio-button> -->
              <el-radio-button label="0">不发放<i></i></el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="通知内容" prop="messageContent" v-show="appForm.isMessage==1">
            <el-input type="textarea" :rows="8" resize='none' v-model="appForm.messageContent"  :maxlength="100"></el-input>
          </el-form-item>
        </el-form>
        <div class='doc-form-submit_btn'>
          <el-button type="primary" @click="submitApp">提交</el-button>
        </div>
      </div>
    </el-card>
    <person-dialog @updatePerson="updatePerson" :data="appForm.person" dialogType="multi" admin="1" :visible.sync="signDialogVisible"></person-dialog>
  </div>
</template>
<script>
import PersonDialog from '../../components/personDialog.component'
import { mapGetters, mapMutations } from 'vuex'
export default {
  components: {
    PersonDialog
  },
  data() {
    return {
      signDialogVisible: false,
      appForm: {
        floor: '',
        roomId: '',
        reserveDate: '',
        beginTime: '',
        endTime: '',
        conferenceTitle: '',
        isInside: '1',
        isMessage: '0',
        messageContent: '',
        person: [],
        type: ''
      },
      searchForm: {
        name: ''
      },
      rules: {
        floor: [{ required: true, message: '请选择位置' }, ],
        roomId: [{ required: true, message: '请选择房间' }, ],
        isInside: [{ required: true, message: '请选择房间' }, ],
        type: [{ required: true, message: '请选择会议类型' }, ],
        reserveDate: [{ type: 'date', required: true, message: '请选择预订日期' }, ],
        beginTime: [{ type: 'date', required: true, message: '请选择开始时间' }, ],
        endTime: [{ type: 'date', required: true, message: '请选择结束时间' }, ],
        person: [{ type: 'array', required: true, message: '请选择参会人员' }, ],
        conferenceTitle: [{ required: true, message: '请输入会议名称', trigger: 'blur,change' }, ]
      },
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      timeOption: {
        format: 'HH:mm',
        selectableRange: '08:00:00 - 22:00:00'
      },
      endOption: '08:00:00',
      submitLoading: false
    }
  },
  computed: {
    rooms() {
      var temp = [];
      if (this.appForm.floor) {
        temp = this.roomList.find(r => r.roomPosition == this.appForm.floor).rooms
      }
      return temp;
    },
    ...mapGetters([
      'userInfo',
      'roomList',
      'conferenceType'
    ])
  },
  created() {

  },
  methods: {
    updatePerson(list) {
      // console.log(list)
      this.appForm.person = list
      this.signDialogVisible = false;
    },
    changeFloor() {
      this.appForm.roomId = '';
    },
    checkFloor(val) {
      console.log(val)
      if (val) {
        this.$refs.appForm.validateField('floor');
      }
    },
    beginTimeChange(val) {
      if (this.appForm.beginTime) {
        this.appForm.beginTime = new Date(this.appForm.beginTime.setSeconds(0));
        this.endOption = this.timeFilter(this.appForm.beginTime.setSeconds(0)+60*1000,'second');
      }
      this.appForm.endTime = '';
    },
    endTimeChange() {
      if (this.appForm.endTime) {
        this.appForm.endTime = new Date(this.appForm.endTime.setSeconds(0));
      }
    },
    closePerson(index) {
      this.appForm.person.splice(index, 1);
    },
    submitApp() {
      this.$refs.appForm.validate((valid) => {
        if (valid) {
          this.checkApp();
        } else {
          this.$message.warning('请检查填写字段')
          return false;
        }
      });
    },
    checkApp() {
      var m = this.appForm.reserveDate.getMonth();
      var d = this.appForm.reserveDate.getDate();
      var params = {
        "beginTime": new Date(new Date(this.appForm.beginTime.setMonth(m))).setDate(d), //开始时间
        "endTime": new Date(new Date(this.appForm.endTime.setMonth(m))).setDate(d), //结束时间
        "roomId": this.appForm.roomId, //房间ID
        "reserveDate": this.appForm.reserveDate.getTime() //预定日期
      }
      this.submitLoading = true;
      this.$http.post('/conference/checkConferenceReserve', params, { body: true })
        .then(res => {
          if (res.status == 0) {
            if (res.data == 1) {
              this.postApp(params)
            } else {
              this.submitLoading = false;
              this.$message.warning('此房间该时间段不可预定，请重新选择');
            }
          } else {
            this.submitLoading = false;
          }
        })
    },
    postApp(p) {
      var room = this.rooms.find(r => r.id == this.appForm.roomId);
      var type = this.conferenceType.find(r => r.id == this.appForm.type);
      var params = {
        "roomId": room.id, //房间id
        "roomPlace": room.roomPlace, //会议室位置
        "roomCode": room.roomCode, //会议室门牌号   
        "roomName": room.roomName, //会议室名
        "reserveDate": this.appForm.reserveDate.getTime(), //预定日期
        "reserveEmpId": this.userInfo.empId, //预定者id
        "reserveName": this.userInfo.name, //预定者名
        "convenerEmpId": this.userInfo.empId, //召集人id
        "convenerName": this.userInfo.name, //召集人
        "conferenceTitle": this.appForm.conferenceTitle, //会议名称
        // "conferenceContent": "11", //会议内容
        "conferenceTypeId": type.id, //会议类型ID
        "conferenceTypeName": type.typeName, //会议类型
        "isInside": this.appForm.isInside, //是否是内部会议
        "isMessage": this.appForm.isMessage, //是否短信通知
        "messageContent": this.appForm.messageContent, //通知内容
        "persons": this.appForm.person.map(function(person) {
          return {
            "personEmpName": person.name, //人员姓名
            "personEmpId": person.empId, //人员id
          }
        })
      }
      this.$http.post('/conference/conferenceReserve', Object.assign(params, p), { body: true })
        .then(res => {
          this.submitLoading = false;
          if (res.status == 0) {
            this.$message.success('预订成功！');
            this.$router.push('/meeting/myBooking');
          } else {
            this.$message.warning('预订失败，请稍后重试');

          }
        })
    }
  }


}

</script>
<style lang='scss'>
#meetingApp {
  .docBaseBox {
    padding-right: 150px;
    border-bottom:none;
    .el-form-item__error {
      padding-left: 6px;
    }
    .el-radio-button__inner{
      width:100px;
      height:45px;
      line-height: 45px;
      padding:0;
    }
  }
  .doc-form-submit_btn {
    button {
      margin-left: 128px;
      width: 160px;
      height:50px;
    }
  }
  .inside{
    .el-radio-button__inner{
      width:90px;
    }
  }
}

</style>
