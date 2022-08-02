<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <span slot="before">共{{ page.total }}条记录</span>
        <template slot="after">
          <el-button size="small"
                     type="warning"
                     @click="$router.push('/import')">Excel导入</el-button>
          <el-button size="small"
                     type="danger"
                     @click="exportData">Excel导出</el-button>
          <el-button size="small"
                     type="primary"
                     @click="addEmployee">新增员工</el-button>
        </template>
      </page-tools>
      <!-- 放置表格和分页 -->
      <el-card v-loading="loading">
        <el-table border
                  :data="list">
          <el-table-column label="序号"
                           sortable=""
                           type="index" />
          <el-table-column label="姓名"
                           sortable=""
                           prop="username" />
          <el-table-column label="姓名"
                           sortable=""
                           prop="staffPhoto">
            <template slot-scope="scoped">
              <img v-imageerror="require('@/assets/common/bigUserHeader.png')"
                   :src="scoped.row.staffPhoto"
                   alt=""
                   style="border-radius: 50%; width: 100px; height: 100px; padding: 10px">
            </template>
          </el-table-column>
          <el-table-column label="工号"
                           sortable=""
                           prop="workNumber" />
          <el-table-column label="聘用形式"
                           sortable=""
                           :formatter="formatEmployment"
                           prop="formOfEmployment" />
          <el-table-column label="部门"
                           sortable=""
                           prop="departmentName" />
          <el-table-column label="入职时间"
                           sortable=""
                           align="center">
            <!-- 作用域插槽 -->
            <template slot-scope="{ row }">{{ row.timeOfEntry | formatDate }}</template>
          </el-table-column>
          <!-- 没有返回值 -->
          <el-table-column label="账户状态"
                           align="center"
                           sortable=""
                           prop="enableState">
            <template slot-scope="{ row }">
              <!-- 根据当前状态来确定 是否打开开关 -->
              <el-switch :value="row.formOfEmployment === 1" />
            </template>
          </el-table-column>
          <el-table-column label="操作"
                           sortable=""
                           fixed="right"
                           width="280">
            <template slot-scope="scoped">
              <el-button type="text"
                         size="small"
                         @click="$router.push(`/employees/detial/${scoped.row.id}`)">查看</el-button>
              <el-button type="text"
                         size="small">转正</el-button>
              <el-button type="text"
                         size="small">调岗</el-button>
              <el-button type="text"
                         size="small">离职</el-button>
              <el-button type="text"
                         size="small"
                         @click="editRole(scoped.row.id)">角色</el-button>
              <el-button type="text"
                         size="small"
                         @click="delEmployee(scoped.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex"
                justify="center"
                align="middle"
                style="height: 60px">
          <el-pagination layout="prev, pager, next"
                         :page-size="page.size"
                         :current-page="page.page"
                         :total="page.total"
                         @current-change="changePage" />
        </el-row>
      </el-card>
    </div>
    <AddEmployee :show-dialog.sync="showDialog" />
    <AssignRole ref="assignRole"
                :show-role-dialog.sync="showRoleDialog"
                :user-id="userId" />
  </div>
</template>
<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees' // 引入员工枚举对象
import AddEmployee from './components/add-employee'
import { formatDate } from '@/filters'
import AssignRole from './components/assign-role.vue'
export default {
  components: {
    AddEmployee,
    AssignRole
  },
  data () {
    return {
      loading: false,
      list: [], // 接数据的
      page: {
        page: 1, // 当前页码
        size: 10,
        total: 0 // 总数
      },
      showDialog: false,
      showRoleDialog: false,
      userId: ''
    }
  },
  created () {
    this.getEmployeeList()
  },
  methods: {
    changePage (newPage) {
      this.page.page = newPage
      this.getEmployeeList()
    },
    async getEmployeeList () {
      this.loading = true
      const { total, rows } = await getEmployeeList(this.page)
      this.page.total = total
      this.list = rows
      console.log(rows)
      this.loading = false
    },
    // 格式化聘用形式
    formatEmployment (row, column, cellValue, index) {
      const obj = EmployeeEnum.hireType.find(item => item.id === parseInt(cellValue))
      return obj ? obj.value : '未知'
    },
    async delEmployee (id) {
      try {
        await this.$confirm('确认删除该员工嘛?')
        await delEmployee(id)
        this.$message.success('删除成功')
        this.getEmployeeList()
      } catch (error) {
        console.log(error)
      }
    },
    addEmployee () {
      this.showDialog = true
    },
    async exportData () {
      // 表头
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      const tHeader = Object.keys(headers)
      const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
      const data = this.formatJson(headers, rows)
      import('@/vendor/Export2Excel').then(excel => {
        excel.export_json_to_excel({
          multiHeader: [['姓名', '主要信息', '', '', '', '', '部门']],
          merges: ['A1: A2', 'B1:F1', 'G1:G2'],
          header: tHeader, // 表头 必填
          data, // 具体数据 必填
          filename: 'excel-list', // 非必填
          autoWidth: true, // 非必填
          bookType: 'xlsx' // 非必填
        })
      })
    },
    formatJson (headers, rows) {
      // [{}] => [[]]
      // 第一种方法
      // return rows.map(item => {
      //   // item 数据对象
      //   const arrItem = []
      //   Object.keys(headers).forEach(key => {
      //     arrItem.push(item[headers[key]])
      //   })
      //   return arrItem
      // })
      // 第二种双map方法
      return rows.map(item => {
        return Object.keys(headers).map(key => {
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            return formatDate(item[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            const obj = EmployeeEnum.hireType.find(obj => {
              obj.id === parseInt(item[headers[key]])
            })
            return obj ? obj.value : '未知'
          }
          return item[headers[key]]
        })
      })
    },
    editRole (id) {
      this.userId = id
      this.$refs.assignRole.getUserDetailById(id)
      this.showRoleDialog = true
    }
  }
}
</script>
