<template>
  <el-dialog title="分配角色"
             :visible="showRoleDialog"
             :close="cancle">
    <!-- el-checkbox-group选中的是 当前用户所拥有的角色  需要绑定 当前用户拥有的角色-->
    <!-- 分配角色 -->
    <el-checkbox-group v-model="roleIds"
                       v-loading="loading">
      <el-checkbox v-for="item in list"
                   :key="item.id"
                   :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <el-row slot="footer"
            type="flex"
            justify="center">
      <el-col :span="6">
        <el-button type="primary"
                   size="small"
                   @click="editRole">确定</el-button>
        <el-button size="small"
                   @click="cancle">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { assignRoles } from '@/api/employees'
import { getUserDetailById } from '@/api/user'
export default {
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    // 用户的id 用来查询当前用户的角色信息
    userId: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      list: [],
      roleIds: [],
      loading: true
    }
  },
  created () {
    this.getRoleList()
  },
  methods: {
    cancle () {
      this.$emit('update:showRoleDialog', false)
      this.roleIds = []
      this.loading = true
    },
    async editRole () {
      await assignRoles({ id: this.userId, roleIds: this.roleIds })
      this.$message.success('分配权限成功')
      this.cancle()
    },
    async getRoleList () {
      const { rows } = await getRoleList({ page: 1, pagesize: 20 })
      this.list = rows
    },
    async getUserDetailById (id) {
      const { roleIds } = await getUserDetailById(id)
      this.roleIds = roleIds // 赋值本用户的角色
      this.loading = false
    }
  }

}
</script>

