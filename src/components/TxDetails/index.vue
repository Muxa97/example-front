<template>
  <div>
    <el-row>
      <el-col :span="6"><div class="grid-content bg-purple">
        <el-card style="margin-bottom:20px;">
          <div slot="header" class="clearfix">
            <span>Status</span>
          </div>
        </el-card>
      </div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple-light">
        Date
      </div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple">
        From
      </div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple-light">
        To
      </div></el-col>
    </el-row>

    <el-row>
      <el-col :span="6"><div class="grid-content bg-purple">
        SendHash
      </div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple-light">
      </div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple">
        Receive Hash
      </div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple-light">
        Cashback
      </div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple-light">
        OrderId
      </div></el-col>
    </el-row>

    <el-row>
      <el-col :span="12"><div class="grid-content bg-purple-light">
        Atomic ID
      </div></el-col>
      <el-col :span="12"><div class="grid-content bg-purple-light">
        Errors
      </div></el-col>
    </el-row>

  </div>
</template>

<script>
import { Component, Prop, Vue } from 'vue-property-decorator'

  @Component({
    name: 'TxDetails',
    props: {
      tx: {
        type: Object,
        default: function() {
          return {}
        }
      }
    }
  })
export default class extends Vue {

}
</script>

<style scoped>

</style>
