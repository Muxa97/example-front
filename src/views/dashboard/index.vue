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
              <span>{{ currentUser.atomicId }}</span>
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
              <span>{{ currentUser.buyVolume }}</span>
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
              <span>Airdrop refferals</span>
            </div>
            <div class="details-card-body">
              <div
                v-for="(item, index) in currentUser.airdropsReferrals"
                :key="index"
              >
                {{ item }}
              </div>
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
                <el-table-column :label="$t('table.os')">
                  <template slot-scope="scope">
                    <span>{{ scope.row.platform }}</span>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('table.version')">
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
    <el-row style="margin-bottom: 20px;">
      <el-col :span="8">
        <router-link :to="`exchange?userId=${currentUser.atomicId}`">
          <div class="grid-content bg-purple linked-card__container">
            <el-card style="padding: 0;">
              <div
                class="details-card-body"
                style="text-align: center; vertical-align: middle;"
              >
                <span>Exchanges</span>
              </div>
            </el-card>
          </div>
        </router-link>
      </el-col>
      <el-col :span="8">
        <router-link :to="`buy?userId=${currentUser.atomicId}`">
          <div class="grid-content bg-purple linked-card__container">
            <el-card style="padding: 0;">
              <div
                class="details-card-body"
                style="text-align: center;"
              >
                <span>Buy</span>
              </div>
            </el-card>
          </div>
        </router-link>
      </el-col>
      <el-col :span="8">
        <router-link :to="`staking?userId=${currentUser.atomicId}`">
          <div class="grid-content bg-purple linked-card__container">
            <el-card style="padding: 0;">
              <div
                class="details-card-body"
                style="text-align: center;"
              >
                <span>Stakings</span>
              </div>
            </el-card>
          </div>
        </router-link>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <router-link :to="`errors?userId=${currentUser.atomicId}`">
          <div class="grid-content bg-purple linked-card__container">
            <el-card>
              <div
                class="details-card-body"
                style="text-align: center;"
              >
                <span>Errors</span>
              </div>
            </el-card>
          </div>
        </router-link>
      </el-col>
      <el-col :span="12">
        <router-link :to="`referrals?userId=${currentUser.atomicId}`">
          <div class="grid-content bg-purple linked-card__container">
            <el-card>
              <div
                class="details-card-body"
                style="text-align: center;"
              >
                <span>Referrals</span>
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
import { getUserInfo } from '@/api/users'

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
      getUserInfo({ atomicId: uid })
        .then((data) => {
          this.currentUser = data
          console.log(this.currentUser, data)
          this.devices = this.currentUser.devices
        })
    } else {
      this.currentUser = {
        atomicId: '',
        status: '',
        awcBalance: 0,
        devices: [],
        exchangeVolume: 0,
        buyVolume: 0,
        stakingVolume: 0,
        airdropsReferrals: []
      }
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

<style lang="scss">
.linked-card__container .el-card__body {
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}
</style>
