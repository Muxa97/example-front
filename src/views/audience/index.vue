<template>
  <div style="padding: 10px;">
    <el-row>
    <el-col :span="12">
      <el-row style="margin-top: 20px;">
        <el-col :span="22">
          <el-card v-loading="devicesLoading" :body-style="{padding: 0, height: '230px'}">
            <div
              slot="header"
              class="clearfix"
              style="border: none; padding: 10px;"
            >
              <span>Devices usage</span>
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
            </div>
            <div class="details-card-body">
              <VueEcharts :option="deviceUsage" :ei.sync="ei" style="height: 100%;"></VueEcharts>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row style="margin-top: 20px;">
        <el-col :span="22">
          <el-card v-loading="usersLoading" :body-style="{padding: 0, height: '230px'}">
            <div
              slot="header"
              class="clearfix"
              style="border: none; padding: 10px;"
            >
              <span>Unique users</span>
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
            </div>
            <div class="details-card-body">
              <VueEcharts :option="uniqueUsers" :ei.sync="eiUsers" style="height: 100%;"></VueEcharts>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-col>
    <el-col :span="12">
      <el-row style="margin-top: 20px;">
        <el-card v-loading="countLoading" :body-style="{padding: 0, height: '230px'}">
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
      </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import {getDeviceUsages, getUniqueUsers, getUsersCount} from "@/api/audience"
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
      series: [
        {
          type: "pie",
          id: "devices",
          radius: '50%',
          center: ['50%', '55%'],
          label: {
            formatter: '{b} ({d}%)'
          },
          data: [{ name: '', value: 0}]
        }
      ]
    };
    private uniqueUsers = {
      tooltip: {
        trigger: 'axis',
        formatter: function (params: any) {
          params = params[0];
          const date = new Date(+params.name);
          return date.toLocaleString() + ' : ' + params.value[1];
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
          data: [{name: '', value: ['', 0]}]
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
      this.updateUsersCount()
    }

    updateDeviceUsage() {
      this.devicesLoading = true
      getDeviceUsages({ from: this.devicesSearchTimestampFrom, to: this.devicesSearchTimestampTo })
        .then(({ data }) =>  {
          this.deviceUsage.series[0].data = data;
          this.ei.setOption(this.deviceUsage)
          this.devicesLoading = false
        })
    }

    updateUniqueUsers() {
      this.usersLoading = true
      getUniqueUsers({ from: this.devicesSearchTimestampFrom, to: this.devicesSearchTimestampTo })
        .then(({ data }) => {
          this.uniqueUsers.series[0].data = data
          this.eiUsers.setOption(this.uniqueUsers)
          this.usersLoading = false
        })
    }

    updateUsersCount() {
      this.countLoading = true
      getUsersCount({ from: this.devicesSearchTimestampFrom, to: this.devicesSearchTimestampTo })
        .then(({ lastDay, lastWeek, lastMonth }) => {
          this.lastDayUsers = lastDay
          this.lastWeekUsers = lastWeek
          this.lastMonthUsers = lastMonth
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
