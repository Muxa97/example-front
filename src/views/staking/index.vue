<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="search-container">
        <el-row>
          <el-col :span="3">
            <div class="grid-content bg-purple-light">
              <el-card>
                <div
                  slot="header"
                  class="clearfix"
                >
                  <span>Provider</span>
                </div>
                <el-input
                  v-model="provider"
                  :placeholder="'Provider'"
                  style="width: auto;"
                  class="filter-item"
                  @keyup.enter.native="handleFilter"
                />
              </el-card>
            </div>
          </el-col>
          <el-col :span="11">
            <div class="grid-content bg-purple-light">
              <el-card>
                <div
                  slot="header"
                  class="clearfix"
                >
                  <span>Search</span>
                </div>
                <el-input
                  v-model="searchString"
                  :placeholder="'Atomic ID'"
                  style="width: 250px;"
                  class="filter-item"
                  @keyup.enter.native="handleFilter"
                />
                <el-button
                  v-waves
                  class="filter-item"
                  type="primary"
                  icon="el-icon-search"
                  @click="handleFilter"
                >
                  {{ $t('table.search') }}
                </el-button>
              </el-card>
            </div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content bg-purple-light">
              <el-card>
                <div
                  slot="header"
                  class="clearfix"
                >
                  <span>Currency</span>
                </div>
                <el-input
                  v-model="currency"
                  :placeholder="'Currency filter'"
                  style="width: 250px;"
                  class="filter-item"
                  @keyup.enter.native="handleFilter"
                />
                <el-button
                  v-waves
                  class="filter-item"
                  type="primary"
                  icon="el-icon-search"
                  @click="handleFilter"
                >
                  {{ $t('table.filter') }}
                </el-button>
              </el-card>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
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
        :label="$t('table.id')"
        width="100px"
        align="left"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.atomicId')"
        min-width="250px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.atomicId }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.provider')"
        width="200px"
        align="left"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.provider }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.currency')"
        width="100px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.currency }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.amount')"
        width="120px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.amount }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.yearlyIncome')"
        min-width="80px"
      >
        <template
          slot-scope="scope"
          style="word-break: normal; max-height: 25px;"
        >
          <div class="error-message-wrapper">
            {{ scope.row.yearlyIncome }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.platform')"
        width="100px"
      >
        <template
          slot-scope="scope"
          style="word-break: normal; max-height: 25px;"
        >
          <div class="error-message-wrapper">
            {{ scope.row.platform }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.walletVersion')"
        min-width="100px"
      >
        <template
          slot-scope="scope"
          style="word-break: normal; max-height: 25px;"
        >
          <div class="error-message-wrapper">
            {{ scope.row.walletVersion }}
          </div>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Pagination from '@/components/Pagination/index.vue'
import { getStakings, getStakingsByUser, getStakingsCount } from '@/api/staking'

  @Component({
    name: 'StakingTable',
    components: {
      Pagination
    },
    filters: {
    }
  })
export default class extends Vue {
    private tableKey = 0
    private list: any[] = []
    private searchString = '';
    private provider = ''
    private total = 0
    private listLoading = true
    private currency = ''

    private pagination = 100
    private listQuery = {
      offset: 0,
      limit: this.pagination
    }
    private page = 1

    created() {
      if (this.$route.query.userId) {
        this.searchString = this.$route.query.userId.toString()
      }
      this.getList(false)
    }

    private handleFilter() {
      this.getList(false)
    }

    private async getList(params:any) {
      this.listLoading = true
      this.listQuery.offset = params ? (params.page - 1) * params.limit : 0
      const atomicId = this.searchString
      const provider = this.provider

      try {
        if (atomicId.length) {
          const stakings = await getStakingsByUser({ ...this.listQuery, atomicId, provider, currency: this.currency })
          this.list = stakings.data
          this.total = (await getStakingsCount({ atomicId, provider, currency: this.currency })).data.count
        } else {
          const stakings = await getStakings({ ...this.listQuery, provider, currency: this.currency })
          this.list = await stakings.data
          this.total = (await getStakingsCount({ provider, currency: this.currency })).data.count
        }
      } catch (error) {
        this.$notify({
          title: 'error',
          message: error.toString(),
          type: 'error',
          duration: 2000
        })
      }
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
