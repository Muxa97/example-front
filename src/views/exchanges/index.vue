<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column
        align="center"
        label="ID"
        width="95"
      >
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="Title">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column
        label="Author"
        width="180"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="Pageviews"
        width="110"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.pageviews }}
        </template>
      </el-table-column>
      <el-table-column
        class-name="status-col"
        label="Status"
        width="110"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="created_at"
        label="Created at"
        width="250"
      >
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.timestamp | parseTime }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<template>
  <div class="app-container">
    <DraggableDialog
      ref="dialogVisible"
      @search="refreshTableSearch"
    />

    <div class="filter-container">
      <div class="search-container">
        <el-input
          v-model="searchString"
          :placeholder="$t('table.filter')"
          style="width: 250px;"
          class="filter-item"
          @keyup.enter.native="handleLocalFilter"
        />

        <el-button
          type="primary"
          @click="showDialog"
        >
          Search config
        </el-button>
        <el-button
          v-waves
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="handleFilter"
        >
          {{ $t('table.search') }}
        </el-button>
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
      @sort-change="sortChange"
      @row-click="showDetails"
    >
      <el-table-column
        :label="$t('table.status')"
        prop="status"
        sortable="custom"
        align="left"
        width="120"
        :class-name="getSortClass('id')"
      >
        <template slot-scope="scope">
          <el-badge
            :value="scope.row.status | uppercaseFirstChar"
            :class="getStatusBadgeClass(scope.row.status)"
          />
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.date')"
        width="250px"
        align="left"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.createdAt | parseApolloTime }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.from')"
        min-width="150px"
      >
        <template slot-scope="scope">
          <span
            class="link-type"
          >{{ scope.row.amountSend }} {{ scope.row.fromCurrency }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.to')"
        width="180px"
        align="left"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.amountReceive }} {{ scope.row.toCurrency }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.atomicId')"
        width="125px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.atomicId | formatAtomicId }}</span>
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
    <el-dialog
      :title="detailsTx.title"
      :visible.sync="detailsTx"
    >
      <TxDetails
        v-if="detailsTx"
        :tx="detailsTx"
      />
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { getExchanges, getExchangesByTerms, getExchangesCount, getExchangesByTermsCount } from '@/api/exchanges'
import { IExchangeData } from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'
import TxDetails from '@/components/TxDetails/index.vue'
import DraggableDialog from '@/components/Dialog/index.vue'

  @Component({
    name: 'ComplexTable',
    components: {
      DraggableDialog,
      Pagination,
      TxDetails
    },
    filters: {
    }
  })

export default class extends Vue {
    private tableKey = 0
    private list: IExchangeData[] = []
    private searchString = '';
    private total = 0
    private listLoading = true

    private dialogTableVisible = false

    private sort = ''

    private pagination = 100
    private listQuery = {
      offset: 0,
      limit: this.pagination
    }
    private page = 1
    private detailsTx:any = false
    private tableByTerms = ''

    created() {
      this.getCount()
      this.getList(false)
    }
    private showDialog() {
      (this.$refs.dialogVisible as any).showDialog()
    }
    private showDetails(row:any) {
      this.detailsTx = { ...row }
    }
    private handleLocalFilter() {
      this.list = this.list.filter((item:any) => {
        return item.fromCurrency.includes(this.searchString) || item.toCurrency.includes(this.searchString) ||
          item.status.includes(this.searchString) || item.atomicId.includes(this.searchString) ||
          item.payinAddress.includes(this.searchString) || item.payoutAddress.includes(this.searchString) ||
          item.refundAddress.includes(this.searchString)
      })
      this.total = this.list.length
    }
    private async getCount() {
      const data:any = await getExchangesCount()

      this.total = data.data.count
    }

    private handleFilter() {
      this.getList(false)
    }

    private sortChange(data: any) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    }

    private sortByID(order: string) {
      if (order === 'ascending') {
        this.sort = '+id'
      } else {
        this.sort = '-id'
      }
      this.handleFilter()
    }

    private getStatusBadgeClass(status: string) {
      return {
        'md-square': true,
        'md-green': ['finished', 'refunded'].includes(status),
        'md-gray': ['waiting', 'expired', 'failed'].includes(status),
        'md-lightblue': ['confirming', 'sending', 'exchanging'].includes(status),
        'md-red': ['verifying'].includes(status)
      }
    }

    private async refreshTableSearch(searchString:string) {
      this.listLoading = true
      try {
        const response = await getExchangesByTermsCount(searchString)
        this.total = response.data.count
        const { data } = await getExchangesByTerms(searchString, `offset=${this.listQuery.offset}&limit=${this.listQuery.limit}`)
        this.tableByTerms = searchString
        this.list = data
      } catch (e) {
        this.$notify({
          title: 'error',
          message: e.toString(),
          type: 'error',
          duration: 2000
        })
      }
      this.listLoading = false
    }

    private async getList(params:any) {
      let data
      this.listLoading = true
      this.listQuery.offset = params ? (params.page - 1) * params.limit : 0
      try {
        if (this.tableByTerms) {
          data = await getExchangesByTerms(this.tableByTerms, `offset=${this.listQuery.offset}&limit=${this.listQuery.limit}`)
        } else {
          data = await getExchanges(this.listQuery)
        }
        this.list = data.data
        this.page = params.page
      } catch (e) {
        this.$notify({
          title: 'error',
          message: e.toString(),
          type: 'error',
          duration: 2000
        })
      }
      this.listLoading = false
    }

    private getSortClass(key: string) {
      const sort = this.sort
      return sort === `+${key}` ? 'ascending' : sort === `-${key}` ? 'descending' : ''
    }
}

</script>

<style lang="scss" scoped>
  .search-container{
    display: block;
    float: right;
    /*position: absolute;*/
    /*top: 99px;*/
    /*right: 22px;*/
  }
  .filter-item {
    margin: 5px 5px;
  }
</style>
