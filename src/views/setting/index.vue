<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 放置页签 -->
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <el-row style="height:60px">
              <el-button icon="el-icon-plus"
                         size="small"
                         type="primary"
                         @click="showDialog = true">新增角色</el-button>
            </el-row>
            <!-- 表格 -->
            <el-table border=""
                      :data="list">
              <el-table-column label="序号"
                               align="center"
                               type="index"
                               width="120" />
              <el-table-column label="角色名称"
                               align="center"
                               prop="name"
                               width="240" />
              <el-table-column label="描述"
                               align="center"
                               prop="description" />
              <el-table-column label="操作"
                               align="center">
                <template slot-scope="scoped">
                  <el-button size="small"
                             type="success"
                             @click="assignPrem(scoped.row.id)">分配权限</el-button>
                  <el-button size="small"
                             type="primary"
                             @click="editRole(scoped.row.id)">编辑</el-button>
                  <el-button size="small"
                             type="danger"
                             @click="delRole(scoped.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row type="flex"
                    justify="center"
                    align="middle"
                    style="height: 60px">
              <!-- 分页组件 -->
              <el-pagination layout="prev,pager,next"
                             :total="page.total"
                             :page-size="page.pagesize"
                             :current-page="page.page"
                             @current-change="changePage" />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <el-alert title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
                      type="info"
                      show-icon
                      :closable="false" />
            <el-form label-width="120px"
                     style="margin-top:50px"
                     :model="formData">
              <el-form-item label="公司名称">
                <el-input v-model="formData.name"
                          disabled
                          style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress"
                          disabled
                          style="width:400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox"
                          disabled
                          style="width:400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.remarks"
                          type="textarea"
                          :rows="3"
                          disabled
                          style="width:400px" />
              </el-form-item>
            </el-form>
          </el-tab-pane>

        </el-tabs>
      </el-card>
    </div>
    <el-dialog title="编辑弹层"
               :visible="showDialog"
               @close="btnCancel">
      <el-form ref="roleForm"
               :model="roleForm"
               :rules="rules"
               label-width="120px">
        <el-form-item label="角色名称"
                      prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <el-row slot="footer"
              type="flex"
              justify="center">
        <el-col :span="5">
          <el-button size="small"
                     @click="btnCancel">取消</el-button>
          <el-button size="small"
                     type="primary"
                     @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog title="分配权限"
               :visible="showPermDialog"
               @close="btnPermCancel">
      <!-- 权限是一颗树 -->
      <!-- 将数据绑定到组件上 -->
      <!-- check-strictly 如果为true 那表示父子勾选时  不互相关联 如果为false就互相关联 -->
      <!-- id作为唯一标识 -->
      <el-tree ref="permTree"
               :data="permData"
               :props="defaultProps"
               :show-checkbox="true"
               :check-strictly="true"
               :default-expand-all="true"
               :default-checked-keys="selectCheck"
               node-key="id"
               @close="btnPermCancel" />
      <!-- 确定 取消 -->
      <el-row slot="footer"
              type="flex"
              justify="center">
        <el-col :span="6">
          <el-button type="primary"
                     size="small"
                     @click="btnPermOK">确定</el-button>
          <el-button size="small"
                     @click="btnPermCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { getRoleList, getCompanyInfo, deleteRole, getRoleDetail, updateRole, addRole, assignPerm } from '@/api/setting'
import { getPermissionList } from '@/api/permission'
export default {
  data () {
    return {
      list: [], // 承接数组
      page: {
        // 放置页码及相关数据
        page: 1,
        pagesize: 10,
        total: 0 // 记录总数
      },
      formData: {},
      roleForm: {
        name: '',
        description: ''
      },
      showDialog: false,
      showPermDialog: false,
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      },
      defaultProps: {
        label: 'name'
      },
      permData: [], // 专门用来接收权限数据 树形数据
      selectCheck: [], // 定义一个数组来接收 已经选中的节点
      roleId: null // 用来记录分配角色的id
    }
  },
  created () {
    this.getRoleList() // 获取角色列表
    this.getCompanyInfo() // 获取角色列表
  },
  methods: {
    async getRoleList () {
      const { total, rows } = await getRoleList(this.page)
      this.page.total = total
      this.list = rows
      console.log(rows)
    },
    changePage (newPage) {
      // newPage是当前点击的页码
      this.page.page = newPage // 将当前页码赋值给当前的最新页码
      this.getRoleList()
    },
    async getCompanyInfo () {
      const companyId = this.$store.getters.companyId
      const res = await getCompanyInfo(companyId)
      console.log(res)
      this.formData = res
    },
    delRole (id) {
      console.log(id)
      this.$confirm('确认删除该角色嘛').then(async () => {
        await deleteRole(id)
        this.$message.success('删除成功！')
        this.getRoleList() // 获取角色列表
      })
    },
    btnOK () {
      this.$refs.roleForm.validate(async valid => {
        if (valid) {
          if (this.roleForm.id) {
            // 编辑
            await updateRole(this.roleForm)
            this.$message.success('修改成功')
          } else {
            // 新增
            await addRole(this.roleForm)
            this.$message.success('增加成功')
          }
          this.showDialog = false
          this.getRoleList()
        }
      })
    },
    btnCancel () {
      this.showDialog = false
      this.roleForm = {
        name: '',
        description: ''
      }
      this.$refs.roleForm.resetFields()
    },
    async editRole (id) {
      this.roleForm = await getRoleDetail(id)
      this.showDialog = true
    },
    btnPermCancel () {
      this.selectCheck = []
      this.showPermDialog = false
    },
    async btnPermOK () {
      const permIds = this.$refs.permTree.getCheckedKeys()
      await assignPerm({ id: this.roleId, permIds })
      this.$message.success('修改成功')
      this.showPermDialog = false
    },
    async assignPrem (id) {
      this.permData = await getPermissionList()
      this.permData = this.permData.filter(item => {
        item.children = this.permData.filter(item2 => {
          return item.id === item2.pid
        })
        return item.pid === '0'
      })
      const { permIds } = await getRoleDetail(id)
      this.selectCheck = permIds
      this.roleId = id
      this.showPermDialog = true
    }
  }
}
</script>
