<template>
  <div>
    <header>
      <h1 style="text-align: center">
        Order details
      </h1>
    </header>
    <el-row>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <el-card
            shadow="never"
            style="border: none"
          >
            <div
              slot="header"
              class="clearfix"
              style="border: none"
            >
              <span>Status</span>
            </div>
            <div class="details-card-body">
              <span :class="getStatusBadgeClass(tx.status)">{{ tx.status }}</span>
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple-light">
          <el-card
            shadow="never"
            style="border: none"
          >
            <div
              slot="header"
              class="clearfix"
              style="border: none"
            >
              <span>Date</span>
            </div>
            <div class="details-card-body">
              {{ tx.updatedAt | parseApolloTime }}
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <el-card
            shadow="never"
            style="border: none"
          >
            <div
              slot="header"
              class="clearfix"
              style="border: none"
            >
              <span>From</span>
            </div>
            <div class="details-card-body">
              {{ tx.amountSend }} {{ tx.fromCurrency }}
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple-light">
          <el-card
            shadow="never"
            style="border: none"
          >
            <div
              slot="header"
              class="clearfix"
              style="border: none"
            >
              <span>To</span>
            </div>
            <div class="details-card-body">
              {{ tx.amountReceive }} {{ tx.toCurrency }}
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="6">
        <div class="grid-content bg-purple-light">
          <el-card
            shadow="never"
            style="border: none"
          >
            <div
              slot="header"
              class="clearfix"
              style="border: none"
            >
              <span>OS</span>
            </div>
            <div class="details-card-body">
              {{ tx.Cashbacks[0].platform }}
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple-light">
          <el-card
            shadow="never"
            style="border: none"
          >
            <div
              slot="header"
              class="clearfix"
              style="border: none"
            >
              <span>Wallet version</span>
            </div>
            <div class="details-card-body">
              {{ tx.Cashbacks[0].walletVersion }}
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple-light">
          <el-card
            shadow="never"
            style="border: none"
          >
            <div
              slot="header"
              class="clearfix"
              style="border: none"
            >
              <span>Payout address</span>
            </div>
            <div class="details-card-body">
              {{ tx.payoutAddress }}
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple-light">
          <el-card
            shadow="never"
            style="border: none"
          >
            <div
              slot="header"
              class="clearfix"
              style="border: none"
            >
              <span>Payout hash</span>
            </div>
            <div class="details-card-body">
              {{ tx.payoutHash || '-' }}
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="8">
        <div class="grid-content bg-purple-light">
          <el-card
            shadow="never"
            style="border: none"
          >
            <div
              slot="header"
              class="clearfix"
              style="border: none"
            >
              <span>Receive address</span>
            </div>
            <div class="details-card-body">
              {{ tx.payoutAddress }}
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple-light">
          <el-card
            shadow="never"
            style="border: none"
          >
            <div
              slot="header"
              class="clearfix"
              style="border: none"
            >
              <span>Payment ID</span>
            </div>
            <div class="details-card-body">
              {{ tx.paymentId }}
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple-light">
          <el-card
            shadow="never"
            style="border: none"
          >
            <div
              slot="header"
              class="clearfix"
              style="border: none"
            >
              <span>Quote ID</span>
            </div>
            <div class="details-card-body">
              {{ tx.quoteId }}
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="8">
        <div class="grid-content bg-purple-light">
          <el-card
            shadow="never"
            style="border: none"
          >
            <div
              slot="header"
              class="clearfix"
              style="border: none"
            >
              <span>ID</span>
            </div>
            <div class="details-card-body">
              {{ tx.id }}
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple-light">
          <el-card
            shadow="never"
            style="border: none"
          >
            <div
              slot="header"
              class="clearfix"
              style="border: none"
            >
              <span>Created</span>
            </div>
            <div class="details-card-body">
              {{ tx.createdAt | parseApolloTime }}
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple-light">
          <el-card
            shadow="never"
            style="border: none"
          >
            <div
              slot="header"
              class="clearfix"
              style="border: none"
            >
              <span>Updated</span>
            </div>
            <div class="details-card-body">
              {{ tx.updatedAt | parseApolloTime }}
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="6">
        <div class="grid-content bg-purple-light">
          <el-card
            shadow="never"
            style="border: none"
          >
            <div
              slot="header"
              class="clearfix"
              style="border: none"
            >
              <span>Cashback</span>
            </div>
            <div class="details-card-body">
              {{ tx.Cashbacks[0].expectedCashbackAmount }}
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="9">
        <div class="grid-content bg-purple-light">
          <el-card
            shadow="never"
            style="border: none"
          >
            <div
              slot="header"
              class="clearfix"
              style="border: none"
            >
              <span>BNB address</span>
            </div>
            <div class="details-card-body">
              {{ tx.Cashbacks[0].bnbAddress }}
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="9">
        <div class="grid-content bg-purple-light">
          <el-card
            shadow="never"
            style="border: none"
          >
            <div
              slot="header"
              class="clearfix"
              style="border: none"
            >
              <span>ETH address</span>
            </div>
            <div class="details-card-body">
              {{ tx.Cashbacks[0].ethAddress }}
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="6">
        <div class="grid-content bg-purple-light">
          <el-card
            shadow="never"
            style="border: none"
          >
            <div
              slot="header"
              class="clearfix"
              style="border: none"
            >
              <span>AWC balance</span>
            </div>
            <div class="details-card-body">
              {{ tx.Cashbacks[0].awcBep2Balance }}
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple-light">
          <el-card
            shadow="never"
            style="border: none"
          >
            <div
              slot="header"
              class="clearfix"
              style="border: none"
            >
              <span>AWC rate</span>
            </div>
            <div class="details-card-body">
              {{ tx.Cashbacks[0].awcBep2Rate }}
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content bg-purple-light">
          <el-card
            shadow="never"
            style="border: none"
          >
            <div
              slot="header"
              class="clearfix"
              style="border: none"
            >
              <span>Atomic ID</span>
            </div>
            <div class="details-card-body">
              <router-link :to="{ path: 'dashboard', query: { userId: tx.atomicId }}">{{ tx.atomicId }}</router-link>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'

  @Component({
    name: 'SimplexDetails',
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
    private created() {
      console.log(this.$props.tx)
    }

    private getStatusBadgeClass(status: string) {
      return {
        'md-square': true,
        'md-green': ['Finished', 'Refunded'].includes(status),
        'md-gray': ['Attempt', 'waiting'].includes(status),
        'md-lightblue': ['confirming', 'sending', 'exchanging'].includes(status),
        'md-red': ['Canceled'].includes(status)
      }
    }
  }
</script>

<style scoped>

</style>
