<template>
  <!-- 新增部门的弹层 -->
  <el-dialog :title="showItem"
             :visible="showDialog"
             @close="cancle">
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form ref="deptForm"
             label-width="120px"
             :model="formData"
             :rules="rules">
      <el-form-item label="部门名称"
                    prop="name">
        <el-input v-model="formData.name"
                  style="width:80%"
                  placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码"
                    prop="code">
        <el-input v-model="formData.code"
                  style="width:80%"
                  placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人"
                    prop="manager">
        <el-select v-model="formData.manager"
                   style="width:80%"
                   placeholder="请选择"
                   @focus="getList">
          <el-option v-for="item in people"
                     :key="item.id"
                     :label="item.username"
                     :value="item.username"
                     @change="selected(item)" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍"
                    prop="introduce">
        <el-input v-model="formData.introduce"
                  style="width:80%"
                  placeholder="1-300个字符"
                  type="textarea"
                  :rows="3" />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer"
            type="flex"
            justify="center"
            align="center">
      <!-- 列被分为24 -->
      <el-col :span="5">
        <el-button size="small"
                   @click="cancle">取消</el-button>
        <el-button type="primary"
                   size="small"
                   @click="btnOk">确定</el-button>

      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
import { getDepartmentsList, addDepartments, getDepartDetail, updateDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'
export default {
  // 需要传入一个props变量来控制 显示或者隐藏
  props: {
    showDialog: {
      type: Boolean,
      default: true
    },
    currDepart: {
      type: Object, // 对象类型
      required: true // 要求对方使用您的组件的时候 必须传treeNode属性 如果不传 就会报错
    }
  },
  data () {
    const checkNameRepeat = async (rule, value, callback) => {
      const { depts } = await getDepartmentsList()
      let isRepeat = false
      if (this.formData.id) {
        isRepeat = depts.filter(item => item.id !== this.formData.id && item.pid === this.currDepart.pid).some(item => item.name === value)
      } else {
        isRepeat = depts.filter(item => item.pid === this.currDepart.id).some(item => item.name === value)
      }
      isRepeat ? callback(new Error(`同级别部门下已经有${value}部门`)) : callback()
    }
    const checkCodeRepeat = async (rule, value, callback) => {
      const { depts } = await getDepartmentsList()
      let isRepeat = false
      if (this.formData.id) {
        isRepeat = depts.some(item => item.id !== this.formData.id && item.code === value && value)
      } else {
        isRepeat = depts.some(item => item.code === value && value)
      }

      isRepeat ? callback(new Error(`已经有${value}编码的部门`)) : callback()
    }
    return {
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍

      },
      people: [],
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: 'blur' },
          { validator: checkNameRepeat, trigger: 'blur' }],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur' },
          { validator: checkCodeRepeat, trigger: 'blur' }],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: 'blur' }],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { trigger: 'blur', min: 1, max: 300, message: '部门介绍要求1-50个字符' }]
      }
    }
  },
  computed: {
    showItem () {
      return this.formData.id ? '编辑部门' : '新增部门'
    }
  },
  methods: {
    async getList () {
      const res = await getEmployeeSimple()
      console.log(res)
      this.people = res
    },
    selected (item) {
      console.log(item)
    },
    btnOk () {
      this.$refs.deptForm.validate(async valid => {
        if (valid) {
          if (this.formData.id) {
            const res = await updateDepartments(this.formData)
            this.$message({
              message: '编辑成功',
              type: 'success'
            })
            console.log(res)
          } else {
            const data = { ...this.formData, pid: this.currDepart.id }
            await addDepartments(data)
            this.$message({
              message: '新增部门成功',
              type: 'success'
            })
          }
          this.$emit('addDeptFinished')
          // this.$refs.deptForm.resetFields()  //对话框关闭时候自动调用close方法
          this.$emit('update:showDialog', false)
        }
      })
    },
    cancle () {
      this.formData = {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      }
      this.$refs.deptForm.resetFields()
      this.$emit('update:showDialog', false)
    },
    async getDeptDetail (id) {
      const res = await getDepartDetail(id)
      this.formData = res
    }

  }
}
</script>
