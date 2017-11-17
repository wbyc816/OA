<template>
  <div class="materialApp clearfix">
    <el-form label-position="left" :model="materialForm" :rules="rules" ref="materialForm" label-width="128px">
      <el-form-item label="品名" class="inlinItem" prop="productName">
        <el-input v-model="materialForm.productName" :maxlength="25"></el-input>
      </el-form-item>
      <el-form-item label="规格" class="inlinItem" prop="specification">
        <el-input v-model="materialForm.specification" :maxlength="25"></el-input>
      </el-form-item>
      <el-form-item label="计划单价" class="inlinItem" prop="plannedUnitPrice">
        <money-input v-model="materialForm.plannedUnitPrice" :prepend="false">
          <template slot="append">元</template>
        </money-input>
      </el-form-item>
      <el-form-item label="数量" class="inlinItem" prop="quantity">
        <money-input v-model="materialForm.quantity" :maxlength="5" :prepend="false" :append="false" type="int"></money-input>
      </el-form-item>
      <el-form-item label="备注" class="clearBoth">
        <el-col :span="19">
          <el-input v-model="materialForm.remark" class="fixF5" :maxlength="100">
          </el-input>
        </el-col>
        <el-col :span="5">
          <el-button @click='addMaterial' type="primary" class="addbutton1"><i class="el-icon-plus"></i> 添加</el-button>
        </el-col>
      </el-form-item>
    </el-form>
    <el-table :data="materials" :stripe="true" highlight-current-row style="width: 100%" empty-text="未添加材料" class="appTable">
      <el-table-column type="index" label=" " width="40"></el-table-column>
      <el-table-column property="productName" label="品名" width="160"></el-table-column>
      <el-table-column property="specification" label="规格" width="65"></el-table-column>
      <el-table-column property="plannedUnitPrice" label="计划单价" width="110"></el-table-column>
      <el-table-column property="quantity" label="数量" width="100"></el-table-column>
      <el-table-column property="remark" label="备注"></el-table-column>
      <el-table-column label="操作" width="55">
        <template scope="scope">
          <el-button @click.native.prevent="deleteRow(scope.$index)" type="text" size="small" icon="delete">
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <p class="totalPrice" v-show="totalPrice!=0">合计金额<span>{{totalPrice | toThousands}}元</span></p>
  </div>
</template>
<script>
import MoneyInput from '../../../components/moneyInput.component'
import { mapGetters } from 'vuex'
export default {
  components: { MoneyInput },
  data() {
    return {
      materialForm: {
        productName: '',
        specification: '',
        quantity: '',
        plannedUnitPrice: '',
        remark: ''
      },
      rules: {
        productName: [{ required: true, message: '请输入品名', trigger: 'blur' }],
        specification: [{ required: true, message: '请输入规格', trigger: 'blur' }],
        quantity: [{ required: true, message: '请输入数量' }],
        plannedUnitPrice: [{ required: true, message: '请输入单价' }],
      },
      materials: []
    }
  },
  computed: {
    totalPrice: function() {
      if (this.materials.length != 0) {
        var num = 0;
        this.materials.forEach(m => {
          num += m.plannedUnitPrice * m.quantity
        })
        return num
      } else {
        return 0
      }
    },
    ...mapGetters([
      'submitLoading'
    ])
  },
  mounted() {
    this.$emit('updateSuggest','DOC1101');
  },
  methods: {
    saveForm() {
      this.$emit('saveMiddle', JSON.stringify(this.materials));
    },
    getDraft(obj) {
      this.materials=obj;
    },
    addMaterial() {
      this.$refs.materialForm.validate((valid) => {
        if (valid) {
          var temp = this.clone(this.materialForm);
          temp.plannedUnitPrice = this.fomatFloat(temp.plannedUnitPrice, 1);
          temp.quantity = parseInt(temp.quantity);
          this.materials.push(temp);
          this.$refs.materialForm.resetFields();
          this.materialForm.remark = '';
        } else {
          return false;
        }
      });
    },
    deleteRow(index) {
      this.materials.splice(index, 1)
    },
    fomatFloat(src, pos) {
      return Math.round(src * Math.pow(10, pos)) / Math.pow(10, pos);
    },
    submitForm() {
      if (this.materials.length != 0) {
        this.$emit('submitMiddle', { materials: this.materials });
      } else {
        this.$message.warning('请添加材料')
        this.$emit('submitMiddle', false);
      }
    }
  }
}

</script>
<style lang='scss'>
$main:#0460AE;
.materialApp {
  margin-bottom: 30px;
  .inlinItem {
    display: inline-block;
    width: 50%;
    float: left;
    &:nth-child(even) {
      .el-form-item__label {
        text-indent: 30px;
      }
    }
  }
  .totalPrice {
    line-height: 40px;
    padding-left: 15px;
    border: 1px solid #D5DADF;
    border-top: none;
    font-size: 15px;
    span {
      margin-left: 5px;
      color: $main;
    }
  }
}

</style>
