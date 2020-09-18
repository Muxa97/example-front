<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="search-container">
        <el-input
          v-model="searchString"
          :placeholder="$t('table.filter')"
          style="width: 500px; margin-right: 5px;"
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
      @row-click="redirectToUserPage"
    >
      <el-table-column
        :label="$t('table.userId')"
        prop="status"
        align="left"
        width="250px"
      >
        <template slot-scope="scope">
          <span style="font-weight: 600">{{ `${scope.row.atomicId.slice(0, 6)}...${scope.row.atomicId.slice(scope.row.atomicId.length - 6)}` }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.status')"
        width="250px"
        align="left"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.devices')"
        min-width="150px"
      >
        <template slot-scope="scope">
          <el-table
            :key="devicesTableKey"
            :data="scope.row.devices"
            border
            fit
            highlight-current-row
            stripe
            style="width: 100%;"
          >
            <el-table-column
              :label="$t('table.os')"
            >
              <template slot-scope="scope1">
                <span>{{ scope1.row.platform }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('table.version')"
            >
              <template slot-scope="scope1">
                <span>{{ scope1.row.appVersion }}</span>
              </template>
            </el-table-column>
          </el-table>
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
import { getUsers } from '@/api/users'

@Component({
  name: 'UsersTable',
  components: {
    Pagination
  },
  filters: {
  }
})
export default class extends Vue {
  private tableKey = 0
  private devicesTableKey = 0
  private list: any[] = []
  private searchString = '';
  private total = 0
  private listLoading = true

  private pagination = 100
  private listQuery = {
    offset: 0,
    limit: this.pagination,
    atomicId: ''
  }
  private page = 1
  private pages = 0

  created() {
    this.getList(false)
  }

  private redirectToUserPage(row: any): void {
    this.$router.push({ path: 'dashboard', query: { userId: row.atomicId } })
  }

  private handleFilter() {
    this.getList(false)
  }

  private async getList(params:any) {
    this.listLoading = true
    this.listQuery.offset = params ? (params.page - 1) * params.limit : 0

    if (this.$route.query.userId && this.searchString.length === 0) {
      this.listQuery.atomicId = this.$route.query.userId
    } else {
      this.listQuery.atomicId = this.searchString
    }

    getUsers(this.listQuery)
      .then((data) => {
        this.list = data.users
        this.total = data.total
        if (this.pages === 0) {
          this.pages = Math.floor(this.total / this.pagination)
        }
      })
      .catch(() => {
        // this.error = error.toString()
      })
      .finally(() => {
        this.listLoading = false
      })
  }
}
</script>

<style scoped>
  .search-container{
    display: block;
    float: right;
    margin-bottom: 5px;
    /*position: absolute;*/
    /*top: 99px;*/
    /*right: 22px;*/
  }
</style>
