<template>
  <el-dialog title="新增员工"
             :visible="showDialog"
             @close="cancle">
    <!-- 表单 -->
    <el-form ref="formData"
             :model="formData"
             :rules="rules"
             label-width="120px">
      <el-form-item label="姓名"
                    prop="username">
        <el-input v-model="formData.username"
                  style="width:50%"
                  placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机"
                    prop="mobile">
        <el-input v-model="formData.mobile"
                  style="width:50%"
                  placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间"
                    prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry"
                        style="width:50%"
                        placeholder="请选择日期" />
      </el-form-item>
      <el-form-item label="聘用形式"
                    prop="formOfEmployment">
        <el-select v-model.number="formData.formOfEmployment"
                   style="width:50%"
                   placeholder="请选择">
          <!-- 遍历只能遍历组件的数据 -->
          <el-option v-for="item in EmployeeEnum.hireType"
                     :key="item.id"
                     :label="item.value"
                     :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="工号"
                    prop="workNumber">
        <el-input v-model="formData.workNumber"
                  style="width:50%"
                  placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门"
                    prop="departmentName">
        <el-input v-model="formData.departmentName"
                  style="width:50%"
                  placeholder="请选择部门"
                  @focus="getPartList" />
        <el-tree v-if="showTree"
                 v-loading="loading"
                 :data="deptsList"
                 default-expand-all=""
                 :props="defaultProps"
                 @node-click="handleNodeClick" />
      </el-form-item>
      <el-form-item label="转正时间"
                    prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime"
                        style="width:50%"
                        placeholder="请选择日期" />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-row type="flex"
              justify="center">
        <el-col :span="6">
          <el-button size="small"
                     @click="cancle">取消</el-button>
          <el-button type="primary"
                     size="small"
                     @click="addEmployee">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import EmployeeEnum from '@/api/constant/employees'
import { arrToTree } from '@/utils/arrToTree'
import { addEmployee } from '@/api/employees'
import { getDepartmentsList } from '@/api/departments'

export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      EmployeeEnum, // 在data中定义数据
      // 表单数据
      treeData: [], // 定义数组接收树形数据
      showTree: false, // 控制树形的显示或者隐藏
      loading: false, // 控制树的显示或者隐藏进度条
      formData: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      deptsList: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      treeShow: false,
      rules: {
        username: [{ required: true, message: '用户姓名不能为空', trigger: 'blur' }, {
          min: 1, max: 4, message: '用户姓名为1-4位', trigger: 'blur'
        }],
        mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur' }, {
          pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur'
        }],
        formOfEmployment: [{ required: true, message: '聘用形式不能为空', trigger: 'blur' }],
        workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
        departmentName: [{ required: true, message: '部门不能为空', trigger: 'change' }],
        timeOfEntry: [{ required: true, message: '入职时间', trigger: 'blur' }]
      }
    }
  },
  methods: {
    async addEmployee () {
      try {
        await this.$refs.formData.validate()
        await addEmployee(this.formData)
        this.$message.success('增加成功')
        this.$parent.getEmployeeList()
        this.cancle()
      } catch (error) {
        console.log(error)
      }
    },
    cancle () {
      this.$refs.formData.resetFields()
      this.$emit('update:showDialog', false)
    },
    async getPartList () {
      this.showTree = true
      this.loading = true
      const { depts } = await getDepartmentsList()
      this.deptsList = arrToTree(depts)
      this.loading = false
    },
    handleNodeClick (data) {
      this.formData.departmentName = data.name
      this.showTree = false
    }
  }
}
</script>

<style>
</style>
