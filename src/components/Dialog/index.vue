<template>
  <div class="components-container">
    <el-dialog
      v-el-draggable-dialog
      title="Terms for TX search"
      :visible.sync="dialogVisible"
      width="90%"
      @onDialogDrag="handleDialogDrag"
    >
      <el-row
        style="margin-bottom: 10px;"
      >
        <el-col :span="6">
          <el-input
            v-model="searchQuery.atomicId"
            :placeholder="$t('table.atomicId')"
            style="width: 200px;"
            class="filter-item"
          />
        </el-col>
        <el-col :span="6">
          <el-input
            v-model="searchQuery.orderId"
            :placeholder="$t('searchDialog.orderId')"
            style="width: 200px;"
            class="filter-item"
          />
        </el-col>
        <el-col :span="6">
          <el-input
            v-model="searchQuery.payinAddress"
            :placeholder="$t('searchDialog.payinAddress')"
            style="width: 200px;"
            class="filter-item"
          />
        </el-col>
        <el-col :span="6">
          <el-input
            v-model="searchQuery.payoutAddress"
            :placeholder="$t('searchDialog.payoutAddress')"
            style="width: 200px;"
            class="filter-item"
          />
        </el-col>
      </el-row>
      <el-row
        style="padding-bottom: 10px;"
      >
        <el-col :span="6">
          <el-input
            v-model="searchQuery.fromCurrency"
            :placeholder="$t('searchDialog.fromCurrency')"
            style="width: 200px;"
            class="filter-item"
          />
        </el-col>
        <el-col :span="6">
          <el-input
            v-model="searchQuery.toCurrency"
            :placeholder="$t('searchDialog.toCurrency')"
            style="width: 200px;"
            class="filter-item"
          />
        </el-col>
        <el-col :span="6">
          <el-button
            type="primary"
            @click="search"
          >
            Search config
          </el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Select } from 'element-ui'

  @Component({
    name: 'DraggableDialog',
    props: {
      atomicId: String
    }
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

  created() {
    this.searchQuery.atomicId = this.$props.atomicId
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
