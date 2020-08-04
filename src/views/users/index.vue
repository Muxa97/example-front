<template>
  <div class="app-container">
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
  </div>
</template>

<script>
export default {
name: "index"
}
</script>

<style scoped>

</style>
