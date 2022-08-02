<template>
  <div>
    <UploadExcel :on-success="success" />
  </div>
</template>

<script>
import { importEmployee } from '@/api/employees'
export default {
  data () {
    return {
      // formData: {
      //   username: '',
      //   mobile: '',
      //   formOfEmployment: '',
      //   workNumber: '',
      //   departmentName: '',
      //   timeOfEntry: '',
      //   correctionTime: ''
      // }
    }
  },
  methods: {
    async success ({ header, results }) {
      // header和results中的数据都是中文，需要修改成相应字段
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      const list = results.map(item => {
        const newObj = {}
        Object.keys(item).forEach(key => {
          if (userRelations[key] === 'timeOfEntry' || userRelations[key] === 'correctionTime') {
            newObj[userRelations[key]] = new Date(this.formatDate(item[key], '/'))
          } else {
            newObj[userRelations[key]] = item[key]
          }
        })
        return newObj
      })
      console.log(list)
      await importEmployee(list)
      this.$message.success('导入成功')
      this.$router.back()
    },
    formatDate (numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>

<style>
</style>
