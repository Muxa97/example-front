<template>
  <div class="dashboard-container">
    <el-row>
      <el-col :span="24">
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
              <span>{{ currentUser.userId }}</span>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
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
              <span>Membership status</span>
            </div>
            <div class="details-card-body">
              <span>{{ currentUser.status }}</span>
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="8">
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
              <span>AWC balance</span>
            </div>
            <div class="details-card-body">
              <span>{{ currentUser.awcBalance }}</span>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
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
              <span>Exchange volume</span>
            </div>
            <div class="details-card-body">
              <span>{{ currentUser.exchangeVolume }}</span>
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="8">
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
              <span>Buying volume</span>
            </div>
            <div class="details-card-body">
              <span>{{ currentUser.buyingVolume }}</span>
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="8">
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
              <span>Staking volume</span>
            </div>
            <div class="details-card-body">
              <span>{{ currentUser.stakingVolume }}</span>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
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
              <span>Devices</span>
            </div>
            <div class="details-card-body">
              <el-table
                :key="0"
                :data="devices"
                border
                fit
                highlight-current-row
                stripe
                style="width: 100%;"
              >
                <el-table-column :label="$t('table.platform')">
                  <template slot-scope="scope">
                    <span>{{ scope.row.platform }}</span>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('table.appVersion')">
                  <template slot-scope="scope">
                    <span>{{ scope.row.appVersion }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <router-link :to="`exchanges?userId=${currentUser.userId}`">
          <div class="grid-content bg-purple linked-card__container">
            <el-card style="padding: 0;">
              <div class="details-card-body" style="text-align: center; vertical-align: middle;">
                <span>Exchanges</span>
              </div>
            </el-card>
          </div>
        </router-link>
      </el-col>
      <el-col :span="12">
        <router-link :to="`exchanges?userId=${currentUser.userId}`">
          <div class="grid-content bg-purple linked-card__container">
            <el-card style="padding: 0;">
              <div class="details-card-body" style="text-align: center;">
                <span>Buy</span>
              </div>
            </el-card>
          </div>
        </router-link>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <router-link :to="`exchanges?userId=${currentUser.userId}`">
          <div class="grid-content bg-purple linked-card__container">
            <el-card style="padding: 0;">
              <div class="details-card-body" style="text-align: center;">
                <span>Stakings</span>
              </div>
            </el-card>
          </div>
        </router-link>
      </el-col>
      <el-col :span="12">
        <router-link :to="`errors?userId=${currentUser.userId}`">
          <div class="grid-content bg-purple linked-card__container">
            <el-card>
              <div class="details-card-body" style="text-align: center;">
                <span>Errors</span>
              </div>
            </el-card>
          </div>
        </router-link>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { getUserInfo } from "@/api/users";

@Component({
  name: 'Dashboard',
  components: {},
  filters: {}
})
export default class extends Vue {
  private currentUser: any = null
  private devices: any[] = []

  created() {
    const uid = this.$route.query.userId
    if (uid) {
      this.currentUser = getUserInfo(uid)
    } else {
      this.currentUser = {
        userId: 'asdcrsearhgafdeq5rulgbJHgbjhligfbnyILYFVGibnh,byLjhbkv,jhvYJdwaacdsan',
        status: 'Member',
        awcBalance: 0.17,
        devices: [{ platform: 'win32 X64 10.28.17.0392', appVersion: '2.18.2'}],
        exchangeVolume: 0,
        buyingVolume: 0,
        stakingVolume: 0,
        airdropsReferrals: []
      }
      this.devices = this.currentUser.devices
    }
  }

  get name() {
    return UserModule.name
  }

  get roles() {
    return UserModule.roles
  }
}
</script>

<style lang="scss" scoped>
.linked-card__container .el-card__body {
  padding: 10px 10px 10px 10px;
  vertical-align: middle;
}
</style>
