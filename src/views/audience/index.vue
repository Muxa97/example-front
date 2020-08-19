<template>
  <div style="padding: 10px;">
    <el-row style="margin-top: 20px;">
      <el-col :span="12">
        <el-card :body-style="{padding: 0, height: '230px'}">
          <div
            slot="header"
            class="clearfix"
            style="border: none; padding: 10px;"
          >
            <span>Devices usage</span>
          </div>
          <div class="details-card-body">
            <VueEcharts :option="deviceUsage" :ei.sync="ei" style="height: 100%;"></VueEcharts>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-card :body-style="{padding: 0, height: '230px'}">
          <div
            slot="header"
            class="clearfix"
            style="border: none; padding: 10px;"
          >
            <span>Unique users</span>
          </div>
          <div class="details-card-body">
            <VueEcharts :option="deviceUsage" :ei.sync="ei" style="height: 100%;"></VueEcharts>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        <el-card :body-style="{padding: 0, height: '230px'}">
          <div
            slot="header"
            class="clearfix"
            style="border: none; padding: 10px;"
          >
            <span>Users count</span>
          </div>
          <div class="details-card-body">
            <VueEcharts :option="deviceUsage" :ei.sync="ei" style="height: 100%;"></VueEcharts>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import { getDeviceUsages } from "@/api/audience"

  @Component({
    name: 'Audience',
    components: {

    },
    filters: {}
  })
  export default class Audience extends Vue {
    private deviceStats: any = [{ name: '', value: 0}]
    private unique: any[] = []

    private deviceUsage = {
      series: [
        {
          type: "pie",
          id: "pie",
          radius: '50%',
          center: ['50%', '55%'],
          label: {
            formatter: '{b} ({d}%)'
          },
          data: this.deviceStats
        }
      ]
    };
    private uniqueUsers = {
      series: {

      }
    }
    private ei: any   = {};

    mounted() {
      getDeviceUsages(null)
        .then(({ data }) =>  {
          this.updateDeviceUsage(data)
        })
    }

    updateDeviceUsage(data: any) {
      this.deviceStats = data.data
    }
  }
</script>

<style>
  .details-card-body {
    height: 100%;
  }
</style>
