<template>
  <div class="contractApp">
    <el-form label-position="left" :model="contractForm" :rules="rules" ref="contractForm" label-width="128px">
      <el-form-item label="供应商" prop="supplierIds" class="clearBoth">
        <el-cascader expand-trigger="hover" :options="supplierList" :props="defaultProp" v-model="contractForm.supplierIds" style="width:100%" popper-class="myCascader" ref="supplier">
        </el-cascader>
      </el-form-item>
      <el-form-item label="合同类型" prop="contractCode" placeholder="" class="width60">
        <el-select v-model="contractForm.contractCode" style="width:100%" ref="contractType">
          <el-option v-for="item in types" :key="item.dictCode" :label="item.dictName" :value="item.dictCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="其它" label-width="100px" class="width40" v-show="contractForm.contractCode=='FIN0302'">
        <el-input v-model="contractForm.contractOthers">
        </el-input>
      </el-form-item>
      <el-form-item label="合同期限" prop="timeRange" placeholder="" class="width60">
        <el-date-picker v-model="contractForm.timeRange" type="daterange" :editable="false" :clearable="false" style="width:100%" :picker-options="pickerOptions0"></el-date-picker>
      </el-form-item>
      <el-form-item label="押金" label-width="100px" class="width40">
        <el-input v-model="contractForm.contractCashPledge" ref="contractCashPledge" @change="fomatMoney" :maxlength="10" class="hasUnit" @blur="blurInput">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="公司范本" prop="isContractModel" placeholder="" class="deptArea">
        <el-radio-group v-model="contractForm.isContractModel" class="myRadio">
          <el-radio-button label="1">是<i></i></el-radio-button>
          <el-radio-button label="0">否<i></i></el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="范文改动" prop="isContractModelModification" class="arrArea" v-if="contractForm.isContractModel==1">
        <el-radio-group v-model="contractForm.isContractModelModification" class="myRadio">
          <el-radio-button label="1">是<i></i></el-radio-button>
          <el-radio-button label="0">否<i></i></el-radio-button>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  components: {},
  data() {
    return {
      contractForm: {
        supplierIds: [],
        contractCode: '',
        contractOthers: '',
        timeRange: [],
        contractCashPledge: '',
        isContractModelModification: '1',
        isContractModel: '1'
      },
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      types: [],
      rules: {
        contractCode: [{ required: true, message: '请选择合同类型', trigger: 'blur' }],
        supplierIds: [{ type: 'array', required: true, message: '请选择发文目录', trigger: 'blur' }],
        timeRange: [{ type: 'array', required: true, message: '请选择合同期限', trigger: 'blur' }],
        isContractModelModification: [{ required: true, trigger: 'blur' }],
        isContractModel: [{ required: true, trigger: 'blur' }],
      },
      supplierList: [],
      params: '',
      defaultProp: {
        value: 'id',
        label: 'supplierName',
        children: 'supplier'
      },
    }
  },
  computed: {
    ...mapGetters([
      'submitLoading',
      'baseURL',
      'userInfo'
    ])
  },
  created() {
    this.getType();
    this.getFileCatalogue();
  },
  methods: {
    saveForm() {
      this.$emit('saveMiddle', JSON.stringify(this.contractForm));
    },
    getDraft(obj) {
      this.combineObj(this.contractForm, obj, ['timeRange']);
      obj.timeRange.forEach(t => {
        this.contractForm.timeRange.push(new Date(t));
      })
    },
    fomatMoney(val) {
      val = val.toString().match(/^\d+(?:\.\d{0,2})?/);
      if (val) {
        this.contractForm.contractCashPledge = val[0];
        this.$refs.contractCashPledge.setCurrentValue(val[0]);
      } else {
        this.contractForm.contractCashPledge = ''
        this.$refs.contractCashPledge.setCurrentValue('')
      }
    },
    blurInput(event) {
      var temp = event.target.value.split('.');
      if (temp.length == 2 && (temp[1] == undefined || temp[1] == '' || temp[1] == null)) {
        this.contractForm.contractCashPledge = temp[0];
        this.$refs.contractCashPledge.setCurrentValue(temp[0]);
      }
    },
    submitForm() {
      this.$refs.contractForm.validate((valid) => {
        if (valid) {
          var params = {
            "contract": {
              "supplierId": this.contractForm.supplierIds[this.contractForm.supplierIds.length - 1],
              "supplierName": this.$refs.supplier.currentLabels[this.$refs.supplier.currentLabels.length - 1],
              "contractCode": this.contractForm.contractCode,
              "contractTypeName":this.$refs.contractType.selectedLabel,
              "contractOthers": this.contractForm.contractOthers,
              "contractCashPledge": this.contractForm.contractCashPledge,
              "contractStartTime": this.contractForm.timeRange[0].getTime(),
              "contractEndTime": this.contractForm.timeRange[1].getTime(),
              "isContractModel": this.contractForm.isContractModel,
              "isContractModelModification": this.contractForm.isContractModelModification
            }
          }
          this.$emit('submitMiddle', params);
        } else {
          this.$message.warning('请检查填写字段')
          this.$emit('submitMiddle', false);
          return false;
        }
      });
    },
    getType() {
      this.$http.post('/api/getDict', { dictCode: 'FIN03' })
        .then(res => {
          if (res.status == '0') {
            this.types = res.data;
          } else {
            console.log('获取合同类型失败')
          }
        }, res => {

        })
    },
    getFileCatalogue() {
      this.$http.post('/doc/getSupplier',{empId:this.userInfo.empId})
        .then(res => {
          if (res.status == '0') {
            res.data.forEach((s, index) => {
              s.id = index;
            })
            this.supplierList = res.data;
          } else {
            console.log('获取供应商失败')
          }
        })
    }
  }
}

</script>
<style lang='scss'>
$main:#0460AE;
.contractApp {
  // .el-input {
  //   width: 100%;
  // }
  .myRadio {
    .el-radio-button__inner {
      width: 80px;
      line-height: 45px;
      height: 45px;
      padding: 0;
    }
  }
  .width60 {
    float: left;
    width: 60%;
  }
  .width40 {
    float: left;
    width: 40%;
    .el-form-item__label {
      padding-left: 30px;
    }
  }
}

</style>
