<template>
  <div>
    <el-table
      :data="transactions"
      border
      fit
      highlight-current-row
      stripe
      style="width: 100%;"
    >
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
        width="500px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.atomicId }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

  @Component({
    name: 'WaitingDetails',
    props: {
      txs: {
        type: Array,
        default: function() {
          return []
        }
      },
      ticker: {
        type: String,
        default: ''
      }
    }
  })
export default class extends Vue {
    private transactions: any[] = []

    private created() {
      this.transactions = this.$props.txs.filter((tx: any) =>
        tx.fromCurrency === this.$props.ticker && tx.status === 'waiting'
      )
    }
}
</script>

<style scoped>

</style>
