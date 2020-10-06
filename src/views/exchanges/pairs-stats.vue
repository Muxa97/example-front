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
        :label="$t('table.waiting')"
        width="200px"
      >
        <template slot-scope="scope">
          <span
            class="link-type"
          >{{ scope.row.waiting }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.finished')"
        width="200px"
      >
        <template slot-scope="scope">
          <span
            class="link-type"
          >{{ scope.row.finished }}</span>
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

      <el-table-column
        :label="$t('table.percentage')"
        width="180px"
        prop="percentage"
        sortable
        :sort-method="sortByPercentage"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.percentage }} %</span>
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
    name: 'PairsStatsTable',
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
      let volumeCoin = 'first coin'

      const acc = data.transactions.reduce((acc: any, tx: any) => {
        const currencyFrom = tx.fromCurrency
        const currencyTo = tx.toCurrency
        const pairName = `${currencyFrom}/${currencyTo}`
        const reversePairName = `${currencyTo}/${currencyFrom}`
        if (!acc[pairName]) {
          acc[pairName] = {}
          acc[pairName].pair = pairName
          acc[pairName].waiting = 0
          acc[pairName].finished = 0
          acc[pairName].volume = 0
          acc[pairName].profitBtcTotal = 0
          acc[pairName].profitUsd = 0
        }
        if (!acc[reversePairName]) {
          acc[reversePairName] = {}
          acc[reversePairName].pair = reversePairName
          acc[reversePairName].waiting = 0
          acc[reversePairName].finished = 0
          acc[reversePairName].volume = 0
          acc[reversePairName].profitBtcTotal = 0
          acc[reversePairName].profitUsd = 0
        }

        if (tx.status === 'finished') {
          acc[pairName].finished++
          if (this.searchString.length && !this.searchString.includes('/')) {
            acc[pairName].volume += tx.fromCurrency.startsWith(this.searchString.toUpperCase())
              ? +tx.amountSend : (tx.toCurrency.startsWith(this.searchString.toUpperCase()) ? +tx.amountReceive : 0)

            volumeCoin = tx.fromCurrency.startsWith(this.searchString.toUpperCase())
              ? tx.fromCurrency : tx.toCurrency.startsWith(this.searchString.toUpperCase()) ? tx.toCurrency : volumeCoin
          } else {
            acc[pairName].volume += +tx.amountSend
          }
          if (!Number.isNaN(+tx.usdValue)) acc[pairName].profitUsd += +tx.usdValue
        }
        if (tx.status === 'waiting') acc[pairName].waiting++

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
      this.list = filtered.map((pair: any) => {
        pair.percentage = ((pair.finished + pair.waiting) * 100 / filtered.length).toFixed(4)
        pair.volume = pair.volume.toFixed(7)
        pair.profitUsd = pair.profitUsd.toFixed(2)
        pair.profitBtcTotal = (pair.profitUsd / BTC.PRICE).toFixed(9)
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

    private sortByPercentage(a: any, b: any) {
      return +a.percentage - +b.percentage
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
