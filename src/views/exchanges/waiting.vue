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
        :label="$t('table.amount')"
        align="left"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.amountSend }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="totalExchanges>0"
      :total="totalExchanges"
      :page.sync="page"
      :limit.sync="searchQuery.limit"
      @pagination="analyzeExchangesByInterval"
    />
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import {getExchangesByTerms, getExchangesByTermsCount, getExchangesCount} from '@/api/exchanges'
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
    }]
  }

  @Component({
    name: 'WaitingExchanges',
    components: {
      Pagination
    },
    filters: {
    }
  })
  export default class extends Vue {
    private list: any[] = []
    private totalExchanges: number = 0;
    private searchTimestampFrom: Date = new Date(new Date().setHours(0, 0, 0, 0));
    private searchTimestampTo: Date = new Date(new Date().setHours(23, 59, 59, 999));
    private searchQuery = {
      offset: 0,
      limit: 10000
    };
    private pagination = 200
    private page: number = 0;
    private pickerOpts = pickerOptions
    constructor() {
      super()
      NProgress.configure({ showSpinner: true })
    }

    async created(): Promise<any> {
      NProgress.start()

      if (this.$route.query.date) {
        this.searchTimestampFrom = new Date(new Date(this.$route.query.date).setHours(0, 0, 0, 0))
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

      const range = moment.range(this.searchTimestampFrom, this.searchTimestampTo)

      const { data } = await getExchangesByTerms(
        constructQuery(this.searchQuery),
        `createdAtStart=${new Date(range.start.toDate()).toUTCString()}&createdAtEnd=${new Date(range.end.toDate()).toUTCString()}`
      )

      this.list = data.transactions.filter((tx: any) => {
        tx.amountSend = +tx.amountSend
        return tx.status === 'waiting'
      })
      this.totalExchanges = this.list.length

      NProgress.done()
    }
  }
</script>

<style scoped>

</style>
