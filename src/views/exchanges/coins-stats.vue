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
                    @click="getExchangesByCoins"
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
        :label="$t('table.waiting')"
        width="100px"
        align="left"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.waiting }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.finished')"
        width="100px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.finished }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.volumeBuy')"
        min-width="150px"
        prop="volumeBuy"
        sortable
        :sort-method="sortByVolumeBuy"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.volumeBuy }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.volumeSels')"
        min-width="150px"
        prop="volumeSels"
        sortable
        :sort-method="sortByVolumeSels"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.volumeSels }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.volume')"
        min-width="150px"
        prop="volumeSels"
        sortable
        :sort-method="sortByVolume"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.volume }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.profitBtcBuy')"
        width="180px"
        prop="profitBtcBuy"
        sortable
        :sort-method="sortByBtcBuy"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.profitBtcBuy }} BTC</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.profitBtcSels')"
        width="180px"
        prop="profitBtcSels"
        sortable
        :sort-method="sortByBtcSels"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.profitBtcSels }} BTC</span>
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
import { getExchanges, getExchangesByTerms, getExchangesCount, getExchangesByTermsCount } from '@/api/exchanges'
import _ from 'underscore'
import NProgress from 'nprogress'
import Pagination from '@/components/Pagination/index.vue'
import 'nprogress/nprogress.css'
import { constructQuery } from '@/utils/query'
import * as Moment from 'moment'
import { extendMoment } from 'moment-range'

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
    name: 'CoinsStatsTable',
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
      this.getExchangesByCoins().then(() => NProgress.done())
    }
    private onIntervalChange() {
      this.currentInterval = `${moment(this.searchTimestampTo).diff(moment(this.searchTimestampFrom), 'days')} Days`
      this.getExchangesByCoins().catch(err => console.error(err))
    }
    private handleFilter(el: any) {
      console.log(el)
    }
    private handleLocalFilter(el: any) {
      console.log(el)
      console.log(this.searchString)
    }

    private async getExchangesByCoins() {
      NProgress.start()

      const range = moment.range(this.searchTimestampFrom, this.searchTimestampTo)
      const response = await fetch(`https://owl.atomicwallet.io/assetData?fiat=USD&tickers=BTC`)
      const { BTC } = (await response.json())
      const { data } = await getExchangesByTerms(
        constructQuery(this.searchQuery),
        `createdAtStart=${new Date(range.start.toDate()).toUTCString()}&createdAtEnd=${new Date(range.end.toDate()).toUTCString()}`
      )

      const acc = data.transactions.reduce((acc: any, tx: any) => {
        const currencyFrom = tx.fromCurrency
        const currencyTo = tx.toCurrency
        if (!acc[currencyFrom]) {
          acc[currencyFrom] = {}
          acc[currencyFrom].finished = 0
          acc[currencyFrom].waiting = 0
          acc[currencyFrom].ticker = currencyFrom
          acc[currencyFrom].volumeBuy = 0
          acc[currencyFrom].volumeSels = 0
          acc[currencyFrom].profitBtcBuy = 0
          acc[currencyFrom].profitBtcSels = 0
          acc[currencyFrom].profitBtcTotal = 0
          acc[currencyFrom].profitUsd = 0
        }
        if (!acc[currencyTo]) {
          acc[currencyTo] = {}
          acc[currencyTo].finished = 0
          acc[currencyTo].waiting = 0
          acc[currencyTo].ticker = currencyTo
          acc[currencyTo].volumeBuy = 0
          acc[currencyTo].volumeSels = 0
          acc[currencyTo].profitBtcBuy = 0
          acc[currencyTo].profitBtcSels = 0
          acc[currencyTo].profitBtcTotal = 0
          acc[currencyTo].profitUsd = 0
        }

        if (tx.status === 'finished') {
          acc[currencyFrom].finished++
          if (!Number.isNaN(+tx.usdValue)) {
            acc[currencyFrom].profitUsd += +tx.usdValue
            acc[currencyTo].profitUsd += +tx.usdValue
            acc[currencyTo].profitBtcBuy += +tx.usdValue
            acc[currencyFrom].profitBtcSels += +tx.usdValue
          }
          if (!Number.isNaN(+tx.amountSend)) acc[currencyFrom].volumeSels += +tx.amountSend
          if (!Number.isNaN(+tx.amountReceive)) acc[currencyTo].volumeBuy += +tx.amountReceive
        }
        if (tx.status === 'waiting') acc[currencyFrom].waiting++

        return acc
      }, {})

      this.list = Object.values(acc).map((coin: any) => {
        coin.volume = (coin.volumeSels + coin.volumeBuy).toFixed(7)
        coin.volumeSels = coin.volumeSels.toFixed(7)
        coin.volumeBuy = coin.volumeBuy.toFixed(7)
        coin.profitBtcTotal = (coin.profitUsd / BTC.PRICE).toFixed(9)
        coin.profitBtcBuy = (coin.profitBtcBuy / BTC.PRICE).toFixed(9)
        coin.profitBtcSels = (coin.profitBtcSels / BTC.PRICE).toFixed(9)
        coin.profitUsd = coin.profitUsd.toFixed(2)
        return coin
      }).sort((a: any, b: any) => b.profitBtcTotal - a.profitBtcTotal)
      NProgress.done()
    }

    private redirectToPairsStats(row: any) {
      this.$router.push({ name: 'pairs', query: { coin: row.ticker } })
    }

    private sortByUsd(a: any, b: any) {
      return +a.profitUsd - +b.profitUsd
    }

    private sortByBtcTotal(a: any, b: any) {
      return +a.profitBtcTotal - +b.profitBtcTotal
    }

    private sortByBtcSels(a: any, b: any) {
      return +a.profitBtcSels - +b.profitBtcSels
    }

    private sortByBtcBuy(a: any, b: any) {
      return +a.profitBtcBuy - +b.profitBtcBuy
    }

    private sortByVolumeSels(a: any, b: any) {
      return +a.volumeSels - +b.volumeSels
    }

    private sortByVolumeBuy(a: any, b: any) {
      return +a.volumeBuy - +b.volumeBuy
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
