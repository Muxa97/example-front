<template>
  <div class="app-container">
    <DraggableDialog
                     ref="dialogVisible"
                     @search="refreshTableSearch"
    ></DraggableDialog>

    <div class="filter-container">
      <el-input
        v-model="searchString"
        :placeholder="$t('table.filter')"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
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
      <el-select
        v-model="pagination"
        :placeholder="$t('table.items')"
        clearable
        class="filter-item"
        style="width: 100px"
      >
        <el-option
          v-for="item in paginationTypeOptions"
          :key="item.key"
          :label="item.key"
          :value="item.key"
        />
      </el-select>
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
    >
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

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.offset"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { cloneDeep } from 'lodash'
import { getExchanges, getExchangesByTerms, getExchangesCount } from '@/api/exchanges'
import { IExchangeData } from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'
import DraggableDialog from '@/components/Dialog/index.vue'

const calendarTypeOptions = [
  { key: 'CN', displayName: 'China' },
  { key: 'US', displayName: 'USA' },
  { key: 'JP', displayName: 'Japan' },
  { key: 'EU', displayName: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc: { [key: string]: string }, cur) => {
  acc[cur.key] = cur.displayName
  return acc
}, {}) as { [key: string]: string }

  @Component({
    name: 'ComplexTable',
    components: {
      DraggableDialog,
      Pagination
    },
    filters: {
      typeFilter: (type: string) => {
        return calendarTypeKeyValue[type]
      }
    }
  })

export default class extends Vue {
    private tableKey = 0
    private list: IExchangeData[] = []
    private searchString = '';
    private total = 0
    private listLoading = true
    private displayBy = 200

    private dialogTableVisible = false
    private searchType = ''
    private sort = ''

    private importanceOptions = [1, 2, 3]
    private calendarTypeOptions = calendarTypeOptions;
    private paginationTypeOptions = [
      { key: 30 },
      { key: 100 },
      { key: 300 }
    ];
    private pagination = this.paginationTypeOptions[0].key
    private listQuery = {
      offset: 1,
      limit: this.pagination
    }

    created() {
      this.getCount()
      this.getList()
    }
    private showDialog() {
      (this.$refs.dialogVisible as any).showDialog()
    }
    private async getCount() {
      const data:any = await getExchangesCount()

      this.total = data.count
    }
    private async getList() {
      this.listLoading = true
      const data = await getExchanges(this.listQuery)
      this.list = data.data
      // this.total = data.total
      this.listLoading = false
    }

    private handleFilter() {
      this.listQuery.offset = 1
      this.getList()
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
      this.listLoading = false
    }

    private getSortClass(key: string) {
      const sort = this.sort
      return sort === `+${key}` ? 'ascending' : sort === `-${key}` ? 'descending' : ''
    }
}

</script>
