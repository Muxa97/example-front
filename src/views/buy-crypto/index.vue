<template>
  <div class="app-container">
    <DraggableDialog
      ref="dialogVisible"
      @search="refreshTableSearch"
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
          <router-link :to="{path: 'dashboard', query: {userId: scope.row.atomicId}}">
            <span>{{ scope.row.atomicId | formatAtomicId }}</span>
          </router-link>
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
      width="90%"
    >
      <SimplexDetails
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
import SimplexDetails from '@/components/SimplexDetails/index.vue'
import DraggableDialog from '@/components/Dialog/index.vue'
import { getSimplexBuy, getSimplexUser } from '@/api/simplex'

  @Component({
    name: 'ComplexTable',
    components: {
      DraggableDialog,
      Pagination,
      SimplexDetails
    },
    filters: {
    }
  })

export default class extends Vue {
    private tableKey = 0
    private list: any[] = []
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
        'md-green': ['Finished', 'Refunded'].includes(status),
        'md-gray': ['Attempt', 'waiting'].includes(status),
        'md-lightblue': ['confirming', 'sending', 'exchanging'].includes(status),
        'md-red': ['Canceled'].includes(status)
      }
    }

    private async getList(params:any) {
      this.listLoading = true
      this.listQuery.offset = params ? (params.page - 1) * params.limit : 0
      const atomicId = this.$route.query.userId
      try {
        if (atomicId) {
          const { data } = await getSimplexUser({ atomicId, ...this.listQuery })
          this.list = data.purchases
          this.total = data.total
        } else {
          const { data } = await getSimplexBuy({ ...this.listQuery })
          this.list = data.purchases
          this.total = data.total
        }
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
