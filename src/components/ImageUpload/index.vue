<template>
  <div>
    <el-upload :on-preview="preview"
               :on-remove="handleRemove"
               :on-change="changeFile"
               :before-upload="beforeUpload"
               :http-request="upload"
               :file-list="fileList"
               list-type="picture-card"
               action="#"
               :limit="1"
               :class="{ disabled: fileComputed }">
      <i class="el-icon-plus" />
    </el-upload>
    <el-progress v-if="showPercent"
                 style="width: 180px"
                 :percentage="percent" />
    <el-dialog title="图片预览"
               :visible.sync="showDialog">
      <img :src="imgUrl"
           style="width:100%"
           alt="">
    </el-dialog>
  </div>
</template>

<script>
import Cos from 'cos-js-sdk-v5'
const cos = new Cos({
  SecretId: 'AKID85mCLErDJ9i01lLfiUzECtIRJtCF1Vie',
  SecretKey: 'ghSv84j6C1ZqqZ1C5i49yd17wUlkSt3w'
})
export default {
  data () {
    return {
      fileList: [], // 图片地址设置为数组
      showDialog: false, // 控制显示弹层
      imgUrl: '',
      currentFileUid: null,
      showPercent: false,
      percent: 0
    }
  },
  computed: {
    // 设定一个计算属性 判断是否已经上传完了一张
    fileComputed () {
      return this.fileList.length === 1
    }
  },
  methods: {
    preview (file) {
      // 这里应该弹出一个层 层里是点击的图片地址
      this.imgUrl = file.url
      this.showDialog = true
    },
    handleRemove (file, fileList) {
      // file 要删除的文件   fileList删除过的list
      this.fileList = fileList
    },
    changeFile (file, fileList) {
      this.fileList = fileList.map(item => item)
    },
    beforeUpload (file) {
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(file.type)) {
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false
      }
      //  检查大小
      const maxSize = 5 * 1024 * 1024
      if (maxSize < file.size) {
        this.$message.error('图片大小最大不能超过5M')
        return false
      }
      this.currentFileUid = file.uid
      this.showPercent = true
      return true
    },
    upload (params) {
      //   console.log(params.file)
      if (params.file) {
        // 执行上传操作
        cos.putObject({
          Bucket: 'wzjavater-1311932158', // 存储桶
          Region: 'ap-beijing', // 地域
          Key: params.file.name, // 文件名
          Body: params.file, // 要上传的文件对象
          StorageClass: 'STANDARD', // 上传的模式类型 直接默认 标准模式即可
          onProgress: (params) => {
            this.percent = params.percent * 100
          }
          // 上传到腾讯云 =》 哪个存储桶 哪个地域的存储桶 文件  格式  名称 回调
        }, (err, data) => {
          // data返回数据之后 应该如何处理
          if (!err && data.statusCode === 200) {
            const url = `http://${data.Location}`
            this.fileList = this.fileList.map(item => {
              if (item.uid === this.currentFileUid) {
                return { url, upload: true }
              }
              return item
            })
            setTimeout(() => {
              this.showPercent = false
              this.percent = 0
            }, 1000)
          }
        })
      }
    }
  }
}
</script>

<style>
.disabled .el-upload--picture-card {
  display: none;
}
</style>
