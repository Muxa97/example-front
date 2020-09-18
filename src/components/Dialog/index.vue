<template>
  <div class="components-container">
    <el-dialog
      v-el-draggable-dialog
      title="Terms for TX search"
      :visible.sync="dialogVisible"
      @onDialogDrag="handleDialogDrag"
    >
      <el-input
        v-model="searchQuery.atomicId"
        :placeholder="$t('table.atomicId')"
        style="width: 200px;"
        class="filter-item"
      />
      <el-input
        v-model="searchQuery.orderId"
        :placeholder="$t('searchDialog.orderId')"
        style="width: 200px;"
        class="filter-item"
      />
      <el-input
        v-model="searchQuery.payinAddress"
        :placeholder="$t('searchDialog.payinAddress')"
        style="width: 200px;"
        class="filter-item"
      />
      <el-input
        v-model="searchQuery.payoutAddress"
        :placeholder="$t('searchDialog.payoutAddress')"
        style="width: 200px;"
        class="filter-item"
      />
      <el-input
        v-model="searchQuery.fromCurrency"
        :placeholder="$t('searchDialog.fromCurrency')"
        style="width: 200px;"
        class="filter-item"
      />
      <el-input
        v-model="searchQuery.toCurrency"
        :placeholder="$t('searchDialog.toCurrency')"
        style="width: 200px;"
        class="filter-item"
      />
      <el-button
        type="primary"
        @click="search"
      >
        Search config
      </el-button>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Select } from 'element-ui'

  @Component({
    name: 'DraggableDialog'
  })
export default class extends Vue {
  private dialogVisible = false
  private searchQuery:any = {
    atomicId: '',
    orderId: '',
    payinAddress: '',
    payoutAddress: '',
    fromCurrency: '',
    toCurrency: ''
  }
  private search() {
    let str = ''
    for (const key in this.searchQuery) {
      if (this.searchQuery[key] === '') continue
      if (str !== '') {
        str += '&'
      }
      str += key + '=' + encodeURIComponent(this.searchQuery[key])
    }
    this.$emit('search', str)
    this.dialogVisible = false
  }

  // v-el-dialog-draggable onDialogDrag callback function
  private handleDialogDrag() {
    (this.$refs.select as Select).blur()
  }
  public showDialog() {
    this.dialogVisible = !this.dialogVisible
  }
}
</script>
