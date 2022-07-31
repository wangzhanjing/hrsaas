<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构头部 -->
      <el-card class="tree-card">
        <!-- 用了一个行列布局 -->
        <TreeTools :tree-node="company"
                   :is-root="true"
                   @addDept="addDept"
                   @reGetList="getDepartmentsList" />
        <el-tree :data="departs"
                 :props="defaultProps"
                 :default-expand-all="true"
                 @node-click="handleNodeClick">
          <!-- 自定义插槽内容 -->
          <TreeTools slot-scope="{data}"
                     :tree-node="data"
                     @reGetList="getDepartmentsList"
                     @addDept="addDept"
                     @editDept="editDept" />
        </el-tree>
      </el-card>
    </div>
    <AddDept ref="addDept"
             :show-dialog.sync="showDialog"
             :curr-depart="currDepart"
             @addDeptFinished="getDepartmentsList" />
  </div>
</template>

<script>
import TreeTools from './components/tree-tools.vue'
import AddDept from './components/add-dept.vue'
import { getDepartmentsList } from '@/api/departments'
import { arrToTree } from '@/utils/arrToTree'
export default {
  components: {
    TreeTools,
    AddDept
  },
  data () {
    return {
      departs: [],
      company: {},
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      showDialog: false,
      currDepart: {}
    }
  },
  created () {
    this.getDepartmentsList()
  },
  methods: {
    handleNodeClick (data) {
      console.log(data)
    },
    async getDepartmentsList () {
      const res = await getDepartmentsList()
      console.log(res)
      this.company = { name: res.companyName, manager: res.companyManage, id: '' }
      console.log(arrToTree(res.depts))
      this.departs = arrToTree(res.depts)
    },
    addDept (node) {
      this.showDialog = true
      this.currDepart = node
    },
    editDept (node) {
      this.showDialog = true
      this.currDepart = node
      this.$refs.addDept.getDeptDetail(node.id)
    }
  }

}
</script>

<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>

