<template>
  <div>
    <el-row>
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <el-card
            shadow="never"
            style="border: none"
          >
            <div
              slot="header"
              class="clearfix"
              style="border: none"
            >
              <span>Date and time</span>
            </div>
            <div class="details-card-body">
              <span>{{ err.date }}</span>
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content bg-purple-light">
          <el-card
            shadow="never"
            style="border: none"
          >
            <div
              slot="header"
              class="clearfix"
              style="border: none"
            >
              <span>Type</span>
            </div>
            <div class="details-card-body">
              {{ err.errorType || 'Unknown' }}
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <el-card
            shadow="never"
            style="border: none"
          >
            <div
              slot="header"
              class="clearfix"
              style="border: none"
            >
              <span>User ID</span>
            </div>
            <div class="details-card-body">
              {{ err.userId }}
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content bg-purple-light">
          <el-card
            shadow="never"
            style="border: none"
          >
            <div
              slot="header"
              class="clearfix"
              style="border: none"
            >
              <span>Currency</span>
            </div>
            <div class="details-card-body">
              {{ err.currency }}
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="12">
        <div class="grid-content bg-purple-light">
          <el-card
            shadow="never"
            style="border: none"
          >
            <div
              slot="header"
              class="clearfix"
              style="border: none"
            >
              <span>System</span>
            </div>
            <div class="details-card-body">
              {{ err.platform }}
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content bg-purple-light">
          <el-card
            shadow="never"
            style="border: none"
          >
            <div
              slot="header"
              class="clearfix"
              style="border: none"
            >
              <span>App version</span>
            </div>
            <div class="details-card-body">
              {{ err.appVersion }}
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <div class="grid-content bg-purple-light">
          <el-card
            shadow="never"
            style="border: none"
          >
            <div
              slot="header"
              class="clearfix"
              style="border: none"
            >
              <span>Message</span>
            </div>
            <div class="details-card-body">
              <code>{{ err.errorMessage }}</code>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'ErrorDetails',
  props: {
    err: {
      type: Object,
      default: function() {
        return {}
      }
    }
  }
})
export default class extends Vue {}
</script>

<style scoped>

</style>
