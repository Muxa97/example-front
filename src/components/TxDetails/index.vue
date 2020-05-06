<template>
  <div>
    <header>
      <h1 style="text-align: center">OrderID {{ tx.orderId }}</h1>
    </header>
    <el-row>
      <el-col :span="12"><div class="grid-content bg-purple">
        <el-card shadow="never" style="border: none">
          <div slot="header" class="clearfix" style="border: none">
            <span>Status</span>
          </div>
          <div class="details-card-body">
            <span :class="getStatusBadgeClass(tx.status)">{{ tx.status }}</span>
          </div>
        </el-card>
      </div></el-col>
      <el-col :span="12"><div class="grid-content bg-purple-light">
        <el-card shadow="never" style="border: none">
          <div slot="header" class="clearfix" style="border: none">
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
        <el-card shadow="never" style="border: none">
          <div slot="header" class="clearfix" style="border: none">
            <span>From</span>
          </div>
          <div class="details-card-body">
            {{ tx.amountSend }} {{ tx.fromCurrency }}
          </div>
        </el-card>
      </div></el-col>
      <el-col :span="12"><div class="grid-content bg-purple-light">
        <el-card shadow="never" style="border: none">
          <div slot="header" class="clearfix" style="border: none">
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
        <el-card shadow="never" style="border: none">
          <div slot="header" class="clearfix" style="border: none">
            <span>Send Hash</span>
          </div>
          <div class="details-card-body">
            {{ tx.payinHash }}
          </div>
        </el-card>
      </div></el-col>
      <el-col :span="12"><div class="grid-content bg-purple-light">
        <el-card shadow="never" style="border: none">
          <div slot="header" class="clearfix" style="border: none">
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
        <el-card shadow="never" style="border: none">
          <div slot="header" class="clearfix" style="border: none">
            <span>Cashbacback</span>
          </div>
          <div class="details-card-body">
            {{ tx.Cashbacks[0].expectedCashbackAmount }}
          </div>
        </el-card>
      </div></el-col>
      <el-col :span="12"><div class="grid-content bg-purple-light">
        <el-card shadow="never" style="border: none">
          <div slot="header" class="clearfix" style="border: none">
            <span>Atomic ID</span>
          </div>
          <div class="details-card-body">
            {{ tx.atomicId }}
          </div>
        </el-card>
      </div></el-col>
    </el-row>

    <el-row>
      <el-col :span="12"><div class="grid-content bg-purple-light">
        <el-card shadow="never" style="border: none">
          <div slot="header" class="clearfix" style="border: none">
            <span>Address From</span>
          </div>
          <div class="details-card-body">
            {{ tx.payinAddress }}
          </div>
        </el-card>
      </div></el-col>
      <el-col :span="12"><div class="grid-content bg-purple-light">
        <el-card shadow="never" style="border: none">
          <div slot="header" class="clearfix" style="border: none">
            <span>Address To</span>
          </div>
          <div class="details-card-body">
            {{ tx.payoutAddress }}
          </div>
        </el-card>
      </div></el-col>
    </el-row>

    <el-row>

      <el-col :span="12"><div class="grid-content bg-purple-light">
        <el-card shadow="never" style="border: none">
          <div slot="header" class="clearfix" style="border: none">
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

<script lang="ts">
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
  private getStatusBadgeClass(status: string) {
    return {
      'md-square el-badge__content': true,
      'md-green': ['finished', 'refunded'].includes(status),
      'md-gray': ['waiting', 'expired', 'failed'].includes(status),
      'md-lightblue': ['confirming', 'sending', 'exchanging'].includes(status),
      'md-red': ['verifying'].includes(status)
    }
  }

}
</script>

<style scoped>

</style>
