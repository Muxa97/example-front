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
                  <span>Search</span>
                </div>
                <div class="details-card-body search-button">
                  <el-button
                    v-waves
                    class="filter-item"
                    type="default"
                    icon="el-icon-search"
                    :autofocus="false"
                    @click="getBuysByCoins"
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
      max-height="700"
      :default-sort="{prop: 'profitBtcTotal', order: 'descending'}"
      @row-click="redirectToPairsStats"
    >
      <el-table-column
        :label="$t('table.ticker')"
        width="110px"
        prop="ticker"
        sortable
        :sort-method="sortByTicker"
      >
        <template slot-scope="scope">
          <span
            class="link-type"
          >{{ scope.row.ticker }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.orders')"
        width="100px"
        align="left"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.orders }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.volume')"
        min-width="150px"
        prop="volume"
        sortable
        :sort-method="sortByVolume"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.volume }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.profitBtcTotal')"
        width="180px"
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
    name: 'BuyCoinsStatsTable',
    components: {
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
      this.getBuysByCoins().then(() => NProgress.done())
    }

    private onIntervalChange() {
      this.currentInterval = `${moment(this.searchTimestampTo).diff(moment(this.searchTimestampFrom), 'days')} Days`
      this.getBuysByCoins().catch(err => console.error(err))
    }

    private async getBuysByCoins() {
      NProgress.start()

      const { data } = await getSimplexBuy({ createdAtStart: this.searchTimestampFrom, createdAtEnd: this.searchTimestampTo })
      const tickers = new Set()
      const acc = data.reduce((acc: any, tx: any) => {
        const coin = tx.fromCurrency
        tickers.add(tx.toCurrency)
        if (!acc[coin]) {
          acc[coin] = {}
          acc[coin].orders = 0
          acc[coin].ticker = coin
          acc[coin].volume = 0
          acc[coin].profitBtcTotal = 0
          acc[coin].profitUsd = 0
        }

        if (tx.status === 'Finished') {
          acc[coin].orders++
          if (!Number.isNaN(+tx.amountReceive)) acc[coin].volume += +tx.amountSend
        }

        return acc
      }, {})
      const rates = await fetch(`https://owl.atomicwallet.io/pricemultifull?fsyms=${Array.from(tickers).join(',')},USD&tsyms=${Object.keys(acc).join(',')},BTC`)
      const { RAW } = await rates.json()
      this.list = Object.values(acc).map((coin: any) => {
        coin.profitBtcTotal = (coin.volume / RAW['BTC'][coin.ticker].PRICE / 100)
        coin.profitUsd = (coin.profitBtcTotal * RAW['BTC']['USD'].PRICE).toFixed(2)
        coin.volume = coin.volume.toFixed(2)
        coin.profitBtcTotal = coin.profitBtcTotal.toFixed(9)
        return coin
      }).sort((a: any, b: any) => +b.profitBtcTotal - +a.profitBtcTotal)
      NProgress.done()
    }

    private redirectToPairsStats(row: any) {
      this.$router.push({ name: 'buy-pairs', query: { coin: row.ticker } })
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

    private sortByTicker(a: any, b: any) {
      return a.ticker > b.ticker ? 1 : (a.ticker < b.ticker ? -1 : 0)
    }
}
</script>

<style scoped>

</style>
