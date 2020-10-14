<template>
  <div style="padding: 10px;">
    <el-row>
      <el-col :span="12">
        <el-row style="margin-top: 20px;">
          <el-col :span="22">
            <el-card
              v-loading="countLoading"
              :body-style="{padding: 0, height: '230px'}"
            >
              <div
                slot="header"
                class="clearfix"
                style="border: none; padding: 10px;"
              >
                <span>New users</span>
              </div>
              <el-row>
                <el-col :span="8">
                  <el-card>
                    <div
                      slot="header"
                      class="clearfix"
                      style="border: none; padding: 10px;"
                    >
                      <span>Last day</span>
                    </div>
                    <div class="details-card-body">
                      <span>{{ lastDayUsers }}</span>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="8">
                  <el-card>
                    <div
                      slot="header"
                      class="clearfix"
                      style="border: none; padding: 10px;"
                    >
                      <span>Last week</span>
                    </div>
                    <div class="details-card-body">
                      <span>{{ lastWeekUsers }}</span>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="8">
                  <el-card>
                    <div
                      slot="header"
                      class="clearfix"
                      style="border: none; padding: 10px;"
                    >
                      <span>Last month</span>
                    </div>
                    <div class="details-card-body">
                      <span>{{ lastMonthUsers }}</span>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px;">
          <el-col :span="22">
            <el-card
              v-loading="usersLoading"
              :body-style="{padding: 0, height: '300px'}"
            >
              <div
                slot="header"
                class="clearfix"
                style="border: none; padding: 10px;"
              >
                <span>Unique users</span>
              </div>
              <div class="details-card-body">
                <el-row>
                  <el-col :span="12">
                    <div class="grid-content bg-purple">
                      <el-card shadow="never">
                        <div class="details-card-body">
                          <el-date-picker
                            v-model="usersSearchTimestampFrom"
                            type="datetime"
                            format="yyyy-MM-dd HH:mm:ss"
                            placeholder="Select From"
                            :picker-options="pickerOpts"
                            @change="updateUniqueUsers"
                          />
                        </div>
                      </el-card>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="grid-content bg-purple-light">
                      <el-card shadow="never">
                        <div class="details-card-body">
                          <el-date-picker
                            v-model="usersSearchTimestampTo"
                            type="datetime"
                            format="yyyy-MM-dd HH:mm:ss"
                            placeholder="Select To"
                            :picker-options="pickerOpts"
                            @change="updateUniqueUsers"
                          />
                        </div>
                      </el-card>
                    </div>
                  </el-col>
                </el-row>
                <el-row style="height: 200px;">
                  <VueEcharts
                    :option="uniqueUsers"
                    :ei.sync="eiUsers"
                    style="height: 100%;"
                  />
                </el-row>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="12">
        <el-row style="margin-top: 20px; height: 500px;">
          <el-col
            :span="22"
            style="height: 100%;"
          >
            <el-card
              v-loading="devicesLoading"
              :body-style="{padding: 0, height: '500px'}"
            >
              <div
                slot="header"
                class="clearfix"
                style="border: none; padding: 10px;"
              >
                <span>Devices usage</span>
              </div>
              <div class="details-card-body">
                <el-row>
                  <el-col :span="12">
                    <div class="grid-content bg-purple">
                      <el-card shadow="never">
                        <div class="details-card-body">
                          <el-date-picker
                            v-model="devicesSearchTimestampFrom"
                            type="date"
                            format="yyyy-MM-dd"
                            placeholder="Select From"
                            @change="updateDeviceUsage"
                          />
                        </div>
                      </el-card>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="grid-content bg-purple-light">
                      <el-card shadow="never">
                        <div class="details-card-body">
                          <el-date-picker
                            v-model="devicesSearchTimestampTo"
                            type="date"
                            format="yyyy-MM-dd"
                            placeholder="Select To"
                            @change="updateDeviceUsage"
                          />
                        </div>
                      </el-card>
                    </div>
                  </el-col>
                </el-row>
                <el-row style="height: 80%;">
                  <VueEcharts
                    :option="deviceUsage"
                    :ei.sync="ei"
                    style="height: 100%;"
                  />
                </el-row>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getUsersDevices, getHourData } from '@/api/users'
import * as Moment from 'moment'
import { extendMoment } from 'moment-range'

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
    name: 'Audience',
    components: {

    },
    filters: {}
  })
export default class Audience extends Vue {
    private devicesLoading = true
    private usersLoading = true
    private countLoading = true

    private devicesSearchTimestampFrom: Date = moment().subtract(1, 'month').toDate();
    private devicesSearchTimestampTo: Date = new Date();
    private usersSearchTimestampFrom: Date = moment().subtract(1, 'week').toDate();
    private usersSearchTimestampTo: Date = new Date();
    private pickerOpts = pickerOptions

    private deviceUsage = {
      legend: {
        type: 'scroll',
        orient: 'vertical',
        right: 10,
        top: 20,
        bottom: 20,
        data: {},
        selected: {}
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}'
      },
      series: [
        {
          type: 'pie',
          id: 'devices',
          radius: '50%',
          center: ['25%', '50%'],
          label: null,
          data: [{ name: '', value: 0 }]
        }
      ]
    };
    private uniqueUsers = {
      tooltip: {
        trigger: 'axis',
        formatter: function(params: any) {
          params = params[0]
          const date = new Date(params.name)
          return date.toLocaleString() + ' : ' + params.value[1]
        },
        axisPointer: {
          animation: false
        }
      },
      xAxis: {
        type: 'time',
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          type: 'line',
          id: 'users',
          showSymbol: false,
          hoverAnimation: false,
          data: [{ name: '', value: ['', 0] }]
        }
      ]
    }
    private ei: any = {}
    private eiUsers: any = {}

    private lastDayUsers = 0
    private lastWeekUsers = 0
    private lastMonthUsers = 0

    created() {
      this.updateDeviceUsage()
      this.updateUniqueUsers()
    }

    updateDeviceUsage() {
      this.devicesLoading = true
      getUsersDevices({ from: this.devicesSearchTimestampFrom, to: this.devicesSearchTimestampTo })
        .then(({ data }) => {
          let total = 0
          const selected: any = {}
          this.deviceUsage.series[0].data = Object.entries(data
            .reduce((acc: any, device: any) => {
              if (!acc[device.platform]) acc[device.platform] = { users_count: 0 }

              acc[device.platform].users_count += Number(device.users_count)
              total += Number(device.users_count)
              return acc
            }, {}))
            .sort((a: any, b: any) => b[1].users_count - a[1].users_count)
            .map((e: any) => {
              const part = e[1].users_count / total * 100
              selected[e[0] + ' (' + part.toFixed(2) + '%)'] = part >= 1

              return {
                name: e[0] + ' (' + part.toFixed(2) + '%)',
                value: e[1].users_count
              }
            })
          this.deviceUsage.legend.data = this.deviceUsage.series[0].data
          this.deviceUsage.legend.selected = selected

          this.ei.setOption(this.deviceUsage)
          this.devicesLoading = false
        })
    }

    updateUniqueUsers() {
      this.usersLoading = true
      this.countLoading = true
      getHourData({ from: moment().subtract(1, 'month').toDate(), to: new Date() })
        .then((data) => {
          this.uniqueUsers.series[0].data = data.filter((date: any) => {
            return date.currentDate >= this.usersSearchTimestampFrom.toISOString() && date.currentDate <= this.usersSearchTimestampTo.toISOString()
          }).map((date: any) => {
            return {
              name: date.currentDate,
              value: [new Date(date.currentDate), date.uniqueUserCount]
            }
          })
          this.eiUsers.setOption(this.uniqueUsers)
          const acc = data.reduce((acc: any, date: any) => {
            if (date.currentDate >= moment().subtract(1, 'day').toISOString()) acc.lastDay += date.uniqueUserCount
            if (date.currentDate >= moment().subtract(1, 'week').toISOString()) acc.lastWeek += date.uniqueUserCount
            acc.lastMonth += date.uniqueUserCount

            return acc
          }, { lastDay: 0, lastWeek: 0, lastMonth: 0 })
          this.lastDayUsers = acc.lastDay
          this.lastWeekUsers = acc.lastWeek
          this.lastMonthUsers = acc.lastMonth
          this.usersLoading = false
          this.countLoading = false
        })
    }
}
</script>

<style>
  .details-card-body {
    height: 100%;
  }
</style>
