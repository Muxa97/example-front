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
                  <span>Select Date</span>
                </div>
                <div class="details-card-body">
                  <el-date-picker
                    v-model="searchTimestampFrom"
                    type="date"
                    format="yyyy-MM-dd"
                    placeholder="Select Date"
                    :picker-options="pickerOpts"
                    @change="onIntervalChange"
                  />
                </div>
              </el-card>
            </div>
          </el-col>
          <el-col :span="8">
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
                    @click="analyzeExchangesByInterval"
                  >
                    {{ `${$t('table.searchFor')} waiting exchanges` }}
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
      @row-click="showDetails"
    >
      <el-table-column
        :label="$t('table.ticker')"
        width="250px"
        align="left"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.fromCurrency }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.waiting')"
        align="left"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.waiting }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.users')"
        align="left"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.usersCount }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="details.title"
      :visible.sync="details"
      width="90%"
    >
      <WaitingDetails
        v-if="details"
        :txs="transactions"
        :ticker="details.ticker"
      />
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getExchangesByTerms, getExchangesByTermsCount, getExchangesCount } from '@/api/exchanges'
import NProgress from 'nprogress'
import Pagination from '@/components/Pagination/index.vue'
import 'nprogress/nprogress.css'
import { constructQuery } from '@/utils/query'
import * as Moment from 'moment'
import { extendMoment } from 'moment-range'
import WaitingDetails from '@/components/WaitingDetails/index.vue'
import DraggableDialog from '@/components/Dialog/index.vue'

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
  }]
}

  @Component({
    name: 'WaitingExchanges',
    components: {
      Pagination,
      DraggableDialog,
      WaitingDetails
    },
    filters: {
    }
  })
export default class extends Vue {
    private list: any[] = []
    private totalExchanges: number = 0;
    private transactions: any[] = []
    private searchTimestampFrom: Date = new Date(new Date().setHours(0, 0, 0, 0));
    private searchTimestampTo: Date = new Date(new Date().setHours(23, 59, 59, 999));
    private searchQuery = {
      offset: 0,
      limit: 10000
    };
    private pagination = 200
    private page: number = 0;
    private pickerOpts = pickerOptions
    private details:any = false

    constructor() {
      super()
      NProgress.configure({ showSpinner: true })
    }

    async created(): Promise<any> {
      if (this.$route.query.date) {
        this.searchTimestampFrom = new Date(new Date(this.$route.query.date.toString()).setHours(0, 0, 0, 0))
        this.searchTimestampTo = new Date(new Date(this.searchTimestampFrom).setHours(23, 59, 59, 999))
      }
      this.analyzeExchangesByInterval().then(() => NProgress.done())
    }

    private async onIntervalChange() {
      this.searchTimestampFrom = new Date(new Date(this.searchTimestampFrom).setHours(0, 0, 0, 0))
      this.searchTimestampTo = new Date(new Date(this.searchTimestampFrom).setHours(23, 59, 59, 999))
      await this.analyzeExchangesByInterval()
    }

    private async analyzeExchangesByInterval() {
      NProgress.start()
      this.searchQuery.limit = 10000
      this.searchQuery.offset = this.page > 0 ? (this.page - 1) * this.pagination : 0

      const { data } = await getExchangesByTerms(
        constructQuery(this.searchQuery),
        `createdAtStart=${this.searchTimestampFrom.toUTCString()}&createdAtEnd=${this.searchTimestampTo.toUTCString()}`
      )
      this.transactions = data.transactions
      const txs = this.transactions.reduce((acc: any, tx: any) => {
        if (tx.status === 'waiting') {
          if (!acc[tx.fromCurrency]) {
            acc[tx.fromCurrency] = {}
            acc[tx.fromCurrency].fromCurrency = tx.fromCurrency
            acc[tx.fromCurrency].waiting = 0
            acc[tx.fromCurrency].users = new Set()
          }

          acc[tx.fromCurrency].waiting++
          acc[tx.fromCurrency].users.add(tx.atomicId)
        }
        return acc
      }, {})
      this.list = Object.values(txs).map((tx: any) => {
        tx.usersCount = tx.users.size
        return tx
      }).sort((a: any, b: any) =>
        a.fromCurrency > b.fromCurrency ? 1
          : a.fromCurrency < b.fromCurrency ? -1 : 0
      )
      this.totalExchanges = this.list.length

      NProgress.done()
    }

    private showDetails(row:any) {
      this.details = {}
      this.details.title = `Waiting exchanges for ${row.fromCurrency}`
      this.details.ticker = row.fromCurrency
    }
}
</script>

<style lang="scss">
</style>
