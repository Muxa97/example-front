<template>
  <div>
    <el-row>
      <el-col :span="12"><div class="grid-content bg-purple">
        <el-card style="">
          <div slot="header" class="clearfix">
            <span>Status</span>
          </div>
          <div class="details-card-body">
            {{ tx.status }}
          </div>
        </el-card>
      </div></el-col>
      <el-col :span="12"><div class="grid-content bg-purple-light">
        <el-card style="">
          <div slot="header" class="clearfix">
            <span>Date</span>
          </div>
          <div class="details-card-body">
            {{ tx.updatedAt | parseApolloTime }}
          </div>
        </el-card>
      </div></el-col>
    </el-row>
    <el-row>
      <el-col :span="12"><div class="grid-content bg-purple">
        <el-card style="">
          <div slot="header" class="clearfix">
            <span>From</span>
          </div>
          <div class="details-card-body">
            {{ tx.amountSend }} {{ tx.fromCurrency }}
          </div>
        </el-card>
      </div></el-col>
      <el-col :span="12"><div class="grid-content bg-purple-light">
        <el-card style="">
          <div slot="header" class="clearfix">
            <span>To</span>
          </div>
          <div class="details-card-body">
            {{ tx.amountReceive }} {{ tx.toCurrency }}
          </div>
        </el-card>
      </div></el-col>
    </el-row>

    <el-row>
      <el-col :span="12"><div class="grid-content bg-purple">
        <el-card style="">
          <div slot="header" class="clearfix">
            <span>Send Hash</span>
          </div>
          <div class="details-card-body">
            {{ tx.payinHash }}
          </div>
        </el-card>
      </div></el-col>
      <el-col :span="12"><div class="grid-content bg-purple-light">
        <el-card style="">
          <div slot="header" class="clearfix">
            <span>Receive Hash</span>
          </div>
          <div class="details-card-body">
            {{ tx.payoutHash || '-' }}
          </div>
        </el-card>
      </div></el-col>
    </el-row>
    <el-row>
      <el-col :span="12"><div class="grid-content bg-purple-light">
        <el-card style="">
          <div slot="header" class="clearfix">
            <span>Cashbacback</span>
          </div>
          <div class="details-card-body">
            {{ tx.Cashbacks[0].expectedCashbackAmount }}
          </div>
        </el-card>
      </div></el-col>
      <el-col :span="12"><div class="grid-content bg-purple-light">
        <el-card style="">
          <div slot="header" class="clearfix">
            <span>OrderID</span>
          </div>
          <div class="details-card-body">
            {{ tx.orderId }}
          </div>
        </el-card>
      </div></el-col>
    </el-row>

    <el-row>
      <el-col :span="12"><div class="grid-content bg-purple-light">
        <el-card style="">
          <div slot="header" class="clearfix">
            <span>Atomic ID</span>
          </div>
          <div class="details-card-body">
            {{ tx.atomicId }}
          </div>
        </el-card>
      </div></el-col>
      <el-col :span="12"><div class="grid-content bg-purple-light">
        <el-card style="">
          <div slot="header" class="clearfix">
            <span>Errors</span>
          </div>
          <div class="details-card-body">
            -
          </div>
        </el-card>
      </div></el-col>
    </el-row>

  </div>
</template>

<script>
import { Component, Prop, Vue } from 'vue-property-decorator'

  @Component({
    name: 'TxDetails',
    props: {
      tx: {
        type: Object,
        default: function() {
          return {}
        }
      }
    }
  })
export default class extends Vue {

}
</script>

<style scoped>

</style>
