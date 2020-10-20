<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="search-container">
        <el-row>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-card shadow="never">
                <div
                  slot="header"
                  class="clearfix"
                >
                  <span>Select From Tx Created Date</span>
                </div>
                <div class="details-card-body">
                  <el-date-picker
                    v-model="searchTimestampFrom"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm:ss"
                    placeholder="Select From"
                    :picker-options="pickerOpts"
                    @change="onIntervalChange"
                  />
                </div>
              </el-card>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple-light">
              <el-card shadow="never">
                <div
                  slot="header"
                  class="clearfix"
                >
                  <span>Select To Tx Created Date</span>
                </div>
                <div class="details-card-body">
                  <el-date-picker
                    v-model="searchTimestampTo"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm:ss"
                    placeholder="Select To"
                    :picker-options="pickerOpts"
                    @change="onIntervalChange"
                  />
                </div>
              </el-card>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple-light">
              <el-card>
                <div
                  slot="header"
                  class="clearfix"
                >
                  <span>Enter coin name or pair name</span>
                </div>
                <div class="details-card-body search-button">
                  <el-input
                    v-model="searchString"
                    :placeholder="$t('table.filter')"
                    style="width: 250px;"
                    class="filter-item"
                    @keyup.enter.native="handleLocalFilter"
                  />
                </div>
              </el-card>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple-light">
              <el-card>
                <div
                  slot="header"
                  class="clearfix"
                >
                  <span>Search</span>
                </div>
                <div class="details-card-body search-button">
                  <el-button
                    v-waves
                    class="filter-item"
                    type="default"
                    icon="el-icon-search"
                    :autofocus="false"
                    @click="getSimplexByCoins"
                  >
                    {{ `${$t('table.searchFor')} ${currentInterval}` }}
                  </el-button>
                </div>
              </el-card>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <el-table
      :data="list"
      border
      fit
      highlight-current-row
      stripe
      style="width: 100%;"
      :default-sort="{prop: 'profitBtcTotal', order: 'descending'}"
      max-height="700"
    >
      <el-table-column
        :label="$t('table.pair')"
        width="200px"
        prop="pair"
        sortable
        :sort-method="sortByPair"
      >
        <template slot-scope="scope">
          <span
            class="link-type"
          >{{ scope.row.pair }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.volume') + ' (' + currencyVolume + ')'"
        min-width="200px"
        prop="volume"
        sortable
        :sort-method="sortByVolume"
      >
        <template slot-scope="scope">
          <span
            class="link-type"
          >{{ scope.row.volume }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.profitBtcTotal')"
        min-width="180px"
        prop="profitBtcTotal"
        sortable
        :sort-method="sortByBtcTotal"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.profitBtcTotal }} BTC</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.profitUsd')"
        width="180px"
        prop="profitUsd"
        sortable
        :sort-method="sortByUsd"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.profitUsd }} USD</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import NProgress from 'nprogress'
import Pagination from '@/components/Pagination/index.vue'
import 'nprogress/nprogress.css'
import * as Moment from 'moment'
import { extendMoment } from 'moment-range'
import { getSimplexBuy } from '@/api/simplex'

const moment = extendMoment(Moment)
const { split } = require('moment-range-split')
const pickerOptions = {
  shortcuts: [{
    text: 'Today',
    onClick(picker: any) {
      picker.$emit('pick', new Date())
    }
  }, {
    text: 'Yesterday',
    onClick(picker: any) {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24)
      picker.$emit('pick', date)
    }
  }, {
    text: 'A week ago',
    onClick(picker: any) {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
      picker.$emit('pick', date)
    }
  }]
}

  @Component({
    name: 'SimplexPairsStatsTable',
    components: {
      Pagination
    },
    filters: {
    }
  })
export default class extends Vue {
    private list: any[] = []
    private searchTimestampFrom: Date = moment().subtract(1, 'week').toDate();
    private searchTimestampTo: Date = new Date();
    private currentInterval: any = `${moment(this.searchTimestampTo).diff(moment(this.searchTimestampFrom), 'days')} Days`;
    private searchString: string = '';
    private currencyVolume = 'first coin'
    private searchQuery = {
      offset: 0,
      limit: 10000
    };
    private pickerOpts = pickerOptions
    constructor() {
      super()
      NProgress.configure({ showSpinner: true })
    }

    async created(): Promise<any> {
      NProgress.start()
      if (this.$route.query.coin && this.$route.query.coin.length) this.searchString = this.$route.query.coin.toString()
      this.getSimplexByCoins().then(() => NProgress.done())
    }
    private onIntervalChange() {
      this.currentInterval = `${moment(this.searchTimestampTo).diff(moment(this.searchTimestampFrom), 'days')} Days`
      this.getSimplexByCoins().catch(err => console.error(err))
    }

    private async getSimplexByCoins() {
      NProgress.start()

      const { data } = await getSimplexBuy({ createdAtStart: this.searchTimestampFrom, createdAtEnd: this.searchTimestampTo })
      let volumeCoin = 'first coin'
      const fiats = new Set()
      const coins = new Set()
      const acc = data.reduce((acc: any, tx: any) => {
        const currencyFrom = tx.fromCurrency
        const currencyTo = tx.toCurrency
        fiats.add(currencyFrom)
        coins.add(currencyTo)
        const pairName = `${currencyFrom}/${currencyTo}`
        if (!acc[pairName]) {
          acc[pairName] = {}
          acc[pairName].pair = pairName
          acc[pairName].fiat = currencyFrom
          acc[pairName].coin = currencyTo
          acc[pairName].volume = 0
          acc[pairName].profitBtcTotal = 0
          acc[pairName].profitUsd = 0
        }

        if (tx.status === 'Finished') {
          if (this.searchString.length && !this.searchString.includes('/')) {
            acc[pairName].volume += tx.fromCurrency.startsWith(this.searchString.toUpperCase())
              ? +tx.amountSend : (tx.toCurrency.startsWith(this.searchString.toUpperCase()) ? +tx.amountReceive : 0)

            volumeCoin = tx.fromCurrency.startsWith(this.searchString.toUpperCase())
              ? tx.fromCurrency : tx.toCurrency.startsWith(this.searchString.toUpperCase()) ? tx.toCurrency : volumeCoin
          } else {
            acc[pairName].volume += +tx.amountSend
          }
        }

        return acc
      }, {})
      this.currencyVolume = volumeCoin

      const filtered = Object.values(acc).filter((pair: any) => {
        if (!this.searchString.length) {
          return true
        }

        const coins: string[] = pair.pair.split('/')
        const search = this.searchString.toUpperCase()
        return coins[0].startsWith(search) || coins[1].startsWith(search) || pair.pair.startsWith(search.toUpperCase())
      })

      const rates = await fetch(`https://owl.atomicwallet.io/pricemultifull?fsyms=${Array.from(coins).join(',')},BTC&tsyms=${Array.from(fiats).join(',')}`)
      const { RAW } = await rates.json()

      this.list = filtered.map((pair: any) => {
        const profit = pair.volume / 100
        pair.volume = fiats.has(volumeCoin) ? pair.volume.toFixed(2) : pair.volume.toFixed(7)
        if (volumeCoin === 'first coin') {
          pair.profitUsd = profit / RAW[pair.coin][pair.fiat].PRICE * RAW[pair.coin]['USD'].PRICE
          pair.profitBtcTotal = pair.profitUsd / RAW['BTC']['USD'].PRICE
        } else if (volumeCoin === pair.fiat) {
          pair.profitUsd = profit / RAW[pair.coin][pair.fiat].PRICE * RAW[pair.coin]['USD'].PRICE
          pair.profitBtcTotal = pair.profitUsd / RAW['BTC']['USD'].PRICE
        } else if (volumeCoin === pair.coin) {
          pair.profitUsd = profit * RAW[pair.coin]['USD'].PRICE
          pair.profitBtcTotal = pair.profitUsd / RAW['BTC']['USD'].PRICE
        }
        pair.profitUsd = pair.profitUsd.toFixed(2)
        pair.profitBtcTotal = pair.profitBtcTotal.toFixed(9)
        return pair
      }).sort((a: any, b: any) =>
        a.profitBtcTotal > b.profitBtcTotal ? -1 : (
          a.profitBtcTotal < b.profitBtcTotal ? 1 : 0
        )
      )
      NProgress.done()
    }

    private sortByUsd(a: any, b: any) {
      return +a.profitUsd - +b.profitUsd
    }

    private sortByBtcTotal(a: any, b: any) {
      return +a.profitBtcTotal - +b.profitBtcTotal
    }

    private sortByVolume(a: any, b: any) {
      return +a.volume - +b.volume
    }

    private sortByPair(a: any, b: any) {
      return a.pair > b.pair ? 1 : (a.pair < b.pair ? -1 : 0)
    }
}
</script>

<style scoped>

</style>
