<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="searchQuery"
        :placeholder="$t('table.search')"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="searchType"
        :placeholder="$t('table.searchType')"
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option
          v-for="item in searchTypeOptions"
          :key="item.key"
          :label="item.displayName+'('+item.key+')'"
          :value="item.key"
        />
      </el-select>
      <el-select
        v-model="sort"
        style="width: 140px"
        class="filter-item"
        :placeholder="$t('table.sortType')"
        @change="handleFilter"
      >
        <el-option
          v-for="item in sortOptions"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        />
      </el-select>
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
import { getExchanges } from '@/api/exchanges'
import { IExchangeData } from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'

const calendarTypeOptions = [
  { key: 'CN', displayName: 'China' },
  { key: 'US', displayName: 'USA' },
  { key: 'JP', displayName: 'Japan' },
  { key: 'EU', displayName: 'Eurozone' }
]
const searchTypeOptions = [
  { key: 'atomicId', displayName: 'AtomicId' },
  { key: 'orderId', displayName: 'Order ID' },
  { key: 'sendAddress', displayName: 'Send Address' },
  { key: 'receiveAddress', displayName: 'Receive Address' },
  { key: 'currency', displayName: 'Currency' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc: { [key: string]: string }, cur) => {
  acc[cur.key] = cur.displayName
  return acc
}, {}) as { [key: string]: string }

  @Component({
    name: 'ComplexTable',
    components: {
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
    private total = 2000
    private listLoading = true
    private searchQuery = ''
    private searchType = ''
    private listQuery = {
      offset: 1,
      limit: 200
    }
    private sort = ''

    private importanceOptions = [1, 2, 3]
    private calendarTypeOptions = calendarTypeOptions;
    private searchTypeOptions = searchTypeOptions;
    private sortOptions = [
      { label: 'ID Ascending', key: '+id' },
      { label: 'ID Descending', key: '-id' }
    ]

    created() {
      this.getList()
    }

    private async getList() {
      this.listLoading = true
      const data = await getExchanges(this.listQuery)
      this.list = data.data
      console.log(this.list)
      // this.total = data.total
      // Just to simulate the time of the request
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

    private getSortClass(key: string) {
      const sort = this.sort
      return sort === `+${key}` ? 'ascending' : sort === `-${key}` ? 'descending' : ''
    }
}

</script>
