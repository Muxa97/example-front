<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="search-container">
        <el-row>
          <el-col :span="5">
            <div class="grid-content bg-purple">
              <el-card shadow="never">
                <div
                  slot="header"
                  class="clearfix"
                >
                  <span>Select From Date</span>
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
          <el-col :span="5">
            <div class="grid-content bg-purple-light">
              <el-card shadow="never">
                <div
                  slot="header"
                  class="clearfix"
                >
                  <span>Select To Date</span>
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
        </el-row>
        <el-row>
          <el-col :span="5">
            <div class="grid-content bg-purple-light">
              <el-card shadow="never">
                <div
                  slot="header"
                  class="clearfix"
                >
                  <span>Total USD</span>
                </div>
                <div class="details-card-body">
                  <span>{{ totalUsd }}</span>
                </div>
              </el-card>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="grid-content bg-purple-light">
              <el-card shadow="never">
                <div
                  slot="header"
                  class="clearfix"
                >
                  <span>Total stakes</span>
                </div>
                <div class="details-card-body">
                  <span>{{ totalStakes }}</span>
                </div>
              </el-card>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      stripe
      style="width: 100%;"
    >
      <el-table-column
        :label="$t('table.coin')"
        width="150px"
        align="left"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.coin }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.staked')"
        min-width="100px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.amount }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.stakedUsd')"
        min-width="150px"
        align="left"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.stakedUsd }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import * as Moment from 'moment'
import { extendMoment } from 'moment-range'
import { getStakings } from '@/api/staking'

const moment = extendMoment(Moment)
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
    name: 'StakingStatsTable',
    components: {},
    filters: {
    }
  })
export default class extends Vue {
    private tableKey = 0
    private list: any[] = []
    private currency = ''
    private listLoading = true
    private searchTimestampFrom: Date = moment().subtract(1, 'week').toDate();
    private searchTimestampTo: Date = moment().toDate();
    private pickerOpts = pickerOptions
    private totalUsd = 0
    private totalStakes = 0

    created() {
      this.getList(false)
    }

    private handleFilter() {
      this.getList(false)
    }

    private onIntervalChange() {
      this.getList(false)
    }

    private async getList(params:any) {
      this.listLoading = true

      const stakings = (await getStakings({ createdAtStart: this.searchTimestampFrom, createdAtEnd: this.searchTimestampTo})).data.stakes
      let total = 0
      const agregated = stakings.reduce((acc: any, stake: any) => {
        const coin = stake.currency
        if (!acc[coin]) {
          acc[coin] = {}
          acc[coin].coin = coin
          acc[coin].amount = 0
          acc[coin].stakedUsd = 0
        }

        acc[coin].amount += +stake.amount
        total++
        return acc
      }, {})
      const response = await fetch(`https://owl.atomicwallet.io/assetData?fiat=USD&tickers=${Object.keys(agregated).join(',')}`)
      const prices = await response.json()

      this.list = Object.values(agregated).map((row: any) => {
        row.stakedUsd = row.amount * prices[row.coin].PRICE
        return row
      }).sort((a: any, b: any) => b.stakedUsd - a.stakedUsd)

      this.totalStakes = total
      this.totalUsd = this.list.reduce((acc: number, row: any) => {
        return acc + row.stakedUsd
      }, 0)
      this.listLoading = false
    }
}
</script>

<style scoped>
  .error-message-wrapper {
    max-height: 25px;
    word-break: keep-all;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
