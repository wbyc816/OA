<template>
  <div class="vehicleApp">
    <el-form label-position="left" :model="vehicleForm" :rules="rules" ref="vehicleForm" label-width="128px">
      <el-form-item label="申请类型" prop="type" class="deptArea">
        <el-select v-model="vehicleForm.type" value-key="dictCode">
          <el-option v-for="item in types"  :label="item.dictName" :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否过夜" prop="isPassNight" class="arrArea">
        <el-radio-group v-model="vehicleForm.isPassNight" class="myRadio">
          <el-radio-button label="1">是<i></i></el-radio-button>
          <el-radio-button label="0">否<i></i></el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="联系人" prop="contactUserName" class="clearBoth">
        <el-input class="search" v-model="vehicleForm.contactUserName" :readonly="true">
          <el-button slot="append" @click='selectPerson'>选择</el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="contactPhone">
        <el-input v-model="vehicleForm.contactPhone" :maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="用车部门" prop="contactDeptName">
        <el-input class="search" :readonly="true" :value="vehicleForm.contactDeptName">
          <el-button slot="append" @click='depDialogVisible=true'>选择</el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="用车时间" prop="timeLine">
        <el-date-picker v-model="vehicleForm.timeLine" type="datetimerange" :editable="false" :clearable="false" style="width:100%" format="yyyy-MM-dd HH:mm"></el-date-picker>
      </el-form-item>
    </el-form>
    <person-dialog @updatePerson="updatePerson" :selfDisable="false" :visible.sync="personDialogVisible"></person-dialog>
    <dep-dialog :dialogVisible.sync="depDialogVisible" @updateDep="updateDep"></dep-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import PersonDialog from '../../../components/personDialog.component'
import DepDialog from '../../../components/depDialog.component'
export default {
  components: { PersonDialog, DepDialog },
  data() {
    var checkDate = (rule, value, callback) => {
      if (value.every(val => val != null)) {
        callback();
      } else {
        callback(new Error('请选择用车时间'))
      }
    };
    var checkTel = (rule, value, callback) => {
      var isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
      var isMob = /^((\+?86)|(\(\+86\)))?(1[34578]\d{9})$/;
      if (value && value.length != 0) {
        if (isMob.test(value) || isPhone.test(value)) {
          callback();
        } else {
          callback(new Error("电话号码格式有误"));
        }
      } else {
        callback();
      }
    }
    return {
      depDialogVisible: false,
      vehicleForm: {
        contactUserName: '',
        contactPhone: '',
        contactDeptName: '',
        timeLine: [],
        type: null,
        isPassNight:'1'
      },
      types: [],
      rules: {
        contactUserName: [{ required: true, message: '请选择联系人', trigger: 'blur' }],
        type: [{ type: 'object', required: true, message: '申请类型', trigger: 'blur' }],
        contactPhone: [{ required: true, message: '请输入联系电话', trigger: 'blur' },
          { validator: checkTel, trigger: 'blur,change' }
        ],
        contactDeptName: [{ required: true, message: '请选择用车部门', trigger: 'blur' }],
        timeLine: [{ type: 'array', required: true, message: '请选择用车时间', trigger: 'blur' }],
      },
      personDialogVisible: false,
      selDep: { name: '', id: '' },
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
        format: 'HH:mm',
      }
    }
  },
  computed: {
    ...mapGetters([
      'submitLoading'
    ])
  },
  created() {
    this.getTypes();
  },
  methods: {
    selectPerson: function() {
      this.personDialogVisible = true;
    },
    updatePerson(reciver) {
      this.vehicleForm.contactUserName = reciver.name;
      this.vehicleForm.contactPhone = reciver.mobileNumber;
      this.selDep = { name: reciver.deptParentName || reciver.depts, id: reciver.deptParentId || reciver.deptId };
      this.vehicleForm.contactDeptName = reciver.deptParentName || reciver.depts;
      this.personDialogVisible = false;
    },
    updateDep(dep) {
      this.selDep = dep;
      this.vehicleForm.contactDeptName = dep.name;
    },
    submitForm() {
      this.$refs.vehicleForm.validate((valid) => {
        if (valid) {
          var params = {
            startTime: this.vehicleForm.timeLine[0].getTime(),
            endTime: this.vehicleForm.timeLine[1].getTime(),
            contactUserName: this.vehicleForm.contactUserName,
            contactPhone: this.vehicleForm.contactPhone,
            contactDeptName: this.selDep.name,
            contactDeptId: this.selDep.id,
            subtypeCode: this.vehicleForm.type.dictCode,
            subtypeName: this.vehicleForm.type.dictName,
            isPassNight:this.vehicleForm.isPassNight
          }
          this.$emit('submitMiddle', params);
        } else {
          this.$message.warning('请检查填写字段')
          this.$emit('submitMiddle', false);
          return false;
        }
      });
    },
    saveForm() {
      // console.log(this.vehicleForm)
      var params = JSON.stringify(Object.assign(this.vehicleForm, this.selDep));
      this.$emit('saveMiddle', params);
    },
    getDraft(obj) {
      console.log(obj)
      this.combineObj(this.vehicleForm, obj);
      this.combineObj(this.selDep, obj);
      this.vehicleForm.timeLine = [];
      obj.timeLine.forEach(t => {
        this.vehicleForm.timeLine.push(new Date(t));
      })
    },
    getTypes() {
      this.$http.post('/api/getDict', { dictCode: 'DOC25' })
        .then(res => {
          if (res.status == 0) {
            this.types = res.data;
          } else {
            console.log(res)
          }
        }, res => {})
    }
  }
}

</script>
<style lang='scss'>
$main:#0460AE;
.vehicleApp {
  .el-input {
    width: 100%;
  }
  .myRadio {
    .el-radio-button__inner {
      width: 80px;
      line-height: 45px;
      height: 45px;
      padding: 0;
    }
  }
}

</style>
