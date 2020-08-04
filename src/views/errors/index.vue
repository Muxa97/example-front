<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="search-container">
        <el-row>
          <el-col :span="5"><div class="grid-content bg-purple">
            <el-card shadow="never">
              <div slot="header" class="clearfix">
                <span>Select From Date</span>
              </div>
              <div class="details-card-body">
                <el-date-picker
                  v-model="searchTimestampFrom"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm:ss"
                  placeholder="Select From"
                  :picker-options="pickerOpts"
                />
              </div>
            </el-card>
          </div></el-col>
          <el-col :span="5"><div class="grid-content bg-purple-light">
            <el-card shadow="never">
              <div slot="header" class="clearfix">
                <span>Select To Date</span>
              </div>
              <div class="details-card-body">
                <el-date-picker
                  v-model="searchTimestampTo"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm:ss"
                  placeholder="Select To"
                  :picker-options="pickerOpts"
                />
              </div>
            </el-card>
          </div></el-col>
          <el-col :span="3">
            <div class="grid-content bg-purple-light">
              <el-card>
                <div slot="header" class="clearfix">
                  <span>Currency</span>
                </div>
                <el-input
                  v-model="currency"
                  :placeholder="'Currency'"
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
                <div slot="header" class="clearfix">
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
        :label="$t('table.date')"
        width="150px"
        align="left"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.date }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.asset')"
        width="100px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.currency }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.type')"
        width="100px"
        align="left"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.errorType }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.version')"
        width="100px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.appVersion }}</span>
        </template>

      </el-table-column>

      <el-table-column
        :label="$t('table.os')"
        width="150px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.platform }}</span>
        </template>

      </el-table-column>
      <el-table-column
        :label="$t('table.errorMessage')"
        min-width="400px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.errorMessage }}</span>
        </template>

      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import DraggableDialog from '@/components/Dialog/index.vue'
import Pagination from '@/components/Pagination/index.vue'
import { IErrorData } from '@/api/types'
import axios from 'axios'
import * as Moment from 'moment'
import { extendMoment } from 'moment-range'

const moment = extendMoment(Moment)
const pickerOptions = {
  shortcuts: [{
    text: 'Today',
    onClick(picker: any) {
      picker.$emit('pick', new Date())
    }
  }, {
    text: 'Yesterday',
    onClick(picker: any) {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24)
      picker.$emit('pick', date)
    }
  }, {
    text: 'A week ago',
    onClick(picker: any) {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
      picker.$emit('pick', date)
    }
  }]
}

  @Component({
    name: 'ErrorTable',
    components: {
      DraggableDialog,
      Pagination
    },
    filters: {
    }
  })
  export default class extends Vue {
    private tableKey = 0
    private list: IErrorData[] = []
    private searchString = '';
    private currency = ''
    private total = 0
    private listLoading = true
    private searchTimestampFrom: Date = moment().subtract(1, 'week').toDate();
    private searchTimestampTo: Date = moment().toDate();
    private pickerOpts = pickerOptions

    private pagination = 100
    private listQuery = {
      offset: 0,
      limit: this.pagination
    }
    private page = 1
    private pages = 0

    created() {
      this.getList(false)
    }

    private handleFilter() {
      this.getList(false)
    }

    private async getList(params:any) {
      this.listLoading = true
      this.listQuery.offset = params ? (params.page - 1) * params.limit : 0
      let userId
      const currency = this.currency
      if (this.$route.query.userId && this.searchString.length === 0) {
        userId = this.$route.query.userId
      } else {
        userId = this.searchString
      }

      const dateFrom: string = moment(this.searchTimestampFrom).format()
      const dateTo: string = moment(this.searchTimestampTo).format()

      const data = {
        "query": {
          "bool": {
            "must": [{
              "range": {
                "date": {
                  "gte": dateFrom,
                  "lte": dateTo,
                  "boost": 2
                }
              },
            },
              {
                "match": {
                  "currency": {
                    "query": currency,
                    "zero_terms_query": "all"
                  }
                }
              },
              {
                "match": {
                  "userId": {
                    "query": userId,
                    "zero_terms_query": "all"
                  }
                }
              }
            ]
          }
        },
        "size": this.pagination,
        "from": this.listQuery.offset,
        "sort": {
          "date": {
            "order": "desc"
          }
        }
      }

      axios({
        method: 'post',
        url: 'https://ob.atomicwallet.io/get_user_errors',
        headers: {
          'Content-Type': 'application/json'
        },
        data: data
      })
        .then((response) => {
          const responseData = JSON.parse(response.data.result)
          this.list = responseData.hits.hits.map((hit:any) => {
            const error = hit._source
            error.date = new Date(error.date).toLocaleString()
            return error
          })
          this.total = responseData.hits.total.value

          if (this.pages === 0) {
            this.pages = Math.floor(responseData.hits.total / this.pagination)
          }
        })
        .catch(() =>{
          // this.error = error.toString()
        })
        .finally(() => {
          this.listLoading = false
        })
    }
  }
</script>

<style scoped>

</style>
