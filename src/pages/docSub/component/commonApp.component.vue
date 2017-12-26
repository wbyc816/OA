<template>
  <div>
    <el-form label-position="left" :model="paymentForm" :rules="paymentRule" ref="paymentForm" label-width="128px">
      <el-form-item label="呈批单类型" prop="docCommonTypeCode">
        <el-select v-model="paymentForm.docCommonTypeCode" style="width:100%" ref="docCommonTypeCode" @change="childChange" filterable>
          <el-option v-for="item in childTypeList" :key="item.dictCode" :label="item.dictName" :value="item.dictCode">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      paymentForm: {
        docCommonTypeCode: ''
      },
      paymentRule: {
        docCommonTypeCode: [{ required: true, message: '请选择呈批单类型', trigger: 'blur' }],
      },
      childTypeList: [],
      isDrafFirst: false
    }
  },
  computed: {
    ...mapGetters([
      'submitLoading',
      'baseURL',
      'userInfo',
    ])
  },
  created() {
    this.getChildTypeList();
  },
  methods: {
    saveForm() {
      var params = JSON.stringify({
        paymentForm: this.paymentForm,
      });

      this.$emit('saveMiddle', params);
    },
    getDraft(obj) {
      if (obj.paymentForm.docCommonTypeCode) {
        this.isDrafFirst = true;
      }
      this.paymentForm = obj.paymentForm;
    },
    submitForm() {
      this.$refs.paymentForm.validate((valid) => {
        if (valid) {
          var params = {
            docCommon: {
              "docCommonTypeCode": this.paymentForm.docCommonTypeCode, //公文子类型code
              "docCommonTypeName": this.$refs.docCommonTypeCode.selectedLabel, //公文子类型名称
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
    getChildTypeList() {
      this.$http.post('/api/getDict', { dictCode: 'DOC23' })
        .then(res => {
          if (res.status == '0') {
            this.childTypeList = res.data;
          } else {
            console.log('获取公文子类型失败')
          }
        }, res => {

        })
    },
    childChange(val){
      if (!this.isDrafFirst) {    
        this.$emit('updateSuggest', val);
      } else {           //草稿箱第一次
        this.isDrafFirst = false;
      }
    }
  }
}

</script>
<style lang='scss'>
$main:#0460AE;

</style>
