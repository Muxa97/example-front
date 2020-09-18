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
            <div class="grid-content bg-purple-light statistics">
              <el-row>
                <el-col :span="12">
                  <div class="grid-content bg-purple">
                    <el-card shadow="never">
                      <div
                        slot="header"
                        class="clearfix"
                      >
                        <span class="header">Analyzed Until</span>
                      </div>
                      <div class="details-card-body">
                        <el-tag type="info">
                          {{ lastAnalyzedTime }}
                        </el-tag>
                      </div>
                    </el-card>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="grid-content bg-purple">
                    <el-card shadow="never">
                      <div
                        slot="header"
                        class="clearfix"
                      >
                        <span class="header">{{ totalOrAnalyzed }}</span>
                      </div>
                      <div class="details-card-body">
                        <el-tag type="info">
                          {{ analyzedExchangesCount }}
                        </el-tag>
                      </div>
                    </el-card>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple-light">
              <el-card>
                <div class="details-card-body search-button">
                  <el-button
                    v-waves
                    class="filter-item"
                    type="default"
                    icon="el-icon-search"
                    :autofocus="false"
                    @click="analyzeExchangesByInterval"
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
      :data="analyzedExchangeDayGroups"
      border
      fit
      highlight-current-row
      stripe
      style="width: 100%;"
      @row-click="redirectToWaitingExchanges"
    >
      <el-table-column
        :label="$t('table.date')"
        width="250px"
        align="left"
      >
        <template slot-scope="scope">
          <span>{{ new Date(scope.row.date).toDateString() }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.created')"
        min-width="150px"
      >
        <template slot-scope="scope">
          <span
            class="link-type"
          >{{ scope.row.created }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.waiting')"
        width="180px"
        align="left"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.waiting }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.finished')"
        width="125px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.finished }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.volumeBTC')"
        width="200px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.volumeBTC }} BTC</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.profitBTC')"
        width="200px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.profitBTC }} BTC</span>
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
    name: 'ExchangeStatsTable',
    components: {
      Pagination
    },
    filters: {
    }
  })
  export default class extends Vue {
    private statisticTable:any = [];
    private totalExchangesCount:any = [];
    private analyzedExchangeDayGroups:any = [];
    private lastAnalyzedTime: string = new Date().toLocaleString();
    private analyzedExchangesCount: number = 0;
    private TotalExchanges: number = 0;
    private searchTimestampFrom: Date = moment().subtract(1, 'week').toDate();
    private searchTimestampTo: Date = new Date();
    private currentInterval: any = `${moment(this.searchTimestampTo).diff(moment(this.searchTimestampFrom), 'days')} Days`;
    private searchString: string = '';
    private totalOrAnalyzed: string = 'Total Count';
    private searchQuery = {
      offset: 0,
      limit: 1000
    };
    private page: number = 0;
    private pickerOpts = pickerOptions
    constructor() {
      super()
      NProgress.configure({ showSpinner: true })
    }

    async created(): Promise<any> {
      NProgress.start()
      this.analyzedExchangesCount = (await getExchangesCount()).data.count
      this.analyzeExchangesByInterval().then(() => NProgress.done())
    }
    private onIntervalChange() {
      this.currentInterval = `${moment(this.searchTimestampTo).diff(moment(this.searchTimestampFrom), 'days')} Days`
    }
    private handleFilter(el: any) {
      console.log(el)
    }
    private handleLocalFilter(el: any) {
      console.log(el)
      console.log(this.searchString)
    }

    private async analyzeExchangesByInterval() {
      NProgress.start()
      this.totalOrAnalyzed = 'Analyzed'
      this.analyzedExchangeDayGroups = []
      this.searchQuery.limit = 10000
      this.analyzedExchangesCount = 0

      const range = moment.range(this.searchTimestampFrom, this.searchTimestampTo)
      const ranges = split(range, 'days').reverse()
      const response = await fetch(`https://owl.atomicwallet.io/assetData?fiat=USD&tickers=BTC`)
      const { BTC } = (await response.json())
      for (const range of ranges) {
        const { data } = await getExchangesByTerms(constructQuery(this.searchQuery), `createdAtStart=${new Date(range.start).toUTCString()}&createdAtEnd=${new Date(range.end).toUTCString()}`)
        this.analyzedExchangeDayGroups.push(
          {
            date: range.start.format('YYYY-MM-DD HH:mm:ss'),
            created: data.transactions.length,
            waiting: data.transactions.filter((element:any) => element.status === 'waiting').length,
            finished: data.transactions.filter((element:any) => element.status === 'finished').length,
            volumeBTC: (data.transactions.reduce((acc: number, tx: any) => acc + +tx.usdValue, 0) / BTC.PRICE).toFixed(9),
            profitBTC: (data.transactions.reduce((acc: number, tx: any) => acc + (tx.status === 'finished' ? +tx.usdValue : 0), 0) / BTC.PRICE).toFixed(9)
          }
        )
        this.lastAnalyzedTime = new Date(range.end).toLocaleDateString()
        this.analyzedExchangesCount += data.count
      }
      NProgress.done()
    }

    private async updateTableByDailyTransactions() {
      try {
        let { data } = await getExchanges(this.searchQuery)
        for (const tx of data) {
          this.statisticTable.push({ ...tx, createdAt: Number(new Date(tx.createdAt)), updatedAt: Number(new Date(tx.updatedAt)) })
          this.lastAnalyzedTime = new Date(tx.updatedAt).toLocaleTimeString()
          this.analyzedExchangesCount += 1

          if ((moment().diff(moment(tx.createdAt), 'days') > 14)) {
            NProgress.done()
            return
          }
        }
        const groups = _.groupBy(this.statisticTable, (date:any) => moment(date.updatedAt).startOf('day').format())
        for (const group in groups) {
          const finished = groups[group].filter((element:any) => element.status === 'finished')
          const waiting = groups[group].filter((element:any) => element.status === 'waiting')
          this.analyzedExchangeDayGroups.push(
            {
              date: group,
              created: groups[group].length,
              waiting: waiting.length,
              finished: finished.length
            }
          )
        }
        this.searchQuery.offset += this.searchQuery.limit
        await this.updateTableByDailyTransactions()
      } catch (e) {
        this.$notify({
          title: 'get exchanges',
          message: e.toString(),
          type: 'error',
          duration: 2000
        })
      }
      NProgress.done()
    }

    private redirectToWaitingExchanges(row: any) {
      this.$router.push({ name: 'waiting', query: { date: row.date }})
    }
  }
</script>

<style scoped>
  .search-button {
    position: absolute;
    right: 20px;
    top: 16px;
  }
</style>
