<template>
  <div class="app-container">
    <DraggableDialog
                     ref="dialogVisible"
                     @search="refreshTableSearch"
    ></DraggableDialog>

    <div class="filter-container">
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="page"
        :limit.sync="listQuery.limit"
        @pagination="getList"
      />
      <div class="search-container">
        <el-input
          v-model="searchString"
          :placeholder="$t('table.filter')"
          style="width: 200px;"
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
      style="width: 100%;"
      @sort-change="sortChange"
      @row-click="showDetails"
    >
      <el-table-column
        :label="$t('table.number')"
        width="80"
      >
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.status')"
        prop="status"
        sortable="custom"
        align="center"
        width="120"
        :class-name="getSortClass('id')"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.date')"
        width="250px"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.createdAt | parseApolloTime}}</span>
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
        align="center"
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
    <el-dialog
      :title="detailsTx.title"
      :visible.sync="detailsTx"
    >
      <TxDetails v-if="detailsTx" :tx="detailsTx"></TxDetails>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { getExchanges, getExchangesByTerms, getExchangesCount } from '@/api/exchanges'
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
    private async getList(params:any) {
      this.listLoading = true
      this.listQuery.offset = params ? params.page * params.limit : 0
      try {
        const data = await getExchanges(this.listQuery)
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
    private async refreshTableSearch(searchString:string) {
      this.listLoading = true
      const { data } = await getExchangesByTerms(searchString)
      this.list = data
      this.total = data.length
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
    position: absolute;
    top: 99px;
    right: 22px;
  }
</style>
