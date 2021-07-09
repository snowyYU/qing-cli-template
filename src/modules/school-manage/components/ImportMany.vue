<template>
  <BaseDialog
    :visible="visible"
    @cancel="cancelDialog"
    title="批量导入"
    @close="cancelDialog"
    @closed="resetDialog"
    :config="{ showCustomBtns: true }"
  >
    <template #body>
      <div class="btns-group">
        <el-upload
          ref="upload"
          action=""
          :http-request="submitFile"
          :on-remove="handleFileRemove"
          :on-success="handleFileSuccess"
          :on-error="handleFileError"
          :on-progress="handleFileProgress"
          :before-upload="handleFileBeforeUpload"
          :accept="accept"
          :file-list="fileList"
          :show-file-list="false"
        >
          <el-button
            type="primary"
            size="small"
            @click="
              fileList = []
              errors = ''
            "
          >
            批量导入
          </el-button>
        </el-upload>

        <el-button
          type="default"
          size="small"
          @click="download()"
          style="margin-left:16px"
          >下载模版</el-button
        >
      </div>
      <div class="file-name">
        {{ fileList[0] ? fileList[0].name : '' }}
      </div>
      <div class="description">
        <div class="description__item">
          1.仅伎持上传Excel格式文件，且大小不能超过2M;
        </div>
        <div class="description__item">
          2.为保证上传成功，请勿对模板中的单元格进行更改;
        </div>
        <div class="description__item">
          3.一次仅支持一份文件上传，多份文件上传将会替换原文件。
        </div>
      </div>
      <div class="upload-failure" v-if="errors">
        <i class="el-icon-error" style="color:red"></i>
        导入失败。 Excell内容存在以下几点错误，请修改后重新导入
      </div>
      <div class="error-reason" v-if="errors">
        <div class="error-reason__title">错误原因</div>
        <div class="error-reason__body">{{ errors }}</div>
      </div>
    </template>
    <template #footerBtns>
      <div class="footer">
        <div class="progress">
          <div class="progress__label">导入进度：</div>
          <el-progress
            v-if="
              fileList[0] &&
                (fileList[0].percentage === 0 || fileList[0].percentage)
            "
            class="progress__bar"
            :show-text="false"
            :stroke-width="6"
            :percentage="fileList[0].percentage"
            color="#4A81FE"
          ></el-progress>
          <div
            v-if="
              fileList[0] &&
                (fileList[0].percentage === 0 || fileList[0].percentage)
            "
            class="progress__percent"
          >
            {{ fileList[0].percentage }} %
          </div>
        </div>
        <el-button type="defualt" size="small" @click="cancelDialog"
          >取消</el-button
        >
      </div>
    </template>
  </BaseDialog>
</template>

<script>
import BaseDialog from '@/components/BaseDialog'
import { fileUpload, downloadClassTemplateExcel } from '../api/class-manage'
import * as studentFileApi from '../api/student-file-manage'
// import fileDownload from 'js-file-download'
export default {
  name: 'ImportMany',
  components: {
    BaseDialog
  },
  props: {
    importType: {
      type: String,
      default: 'class'
    },
    visible: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      // ********** 文件上传相关 ********
      fileList: [],
      accept: '.xls,.xlsx',
      errors: ''
    }
  },
  methods: {
    cancelDialog() {
      this.$emit('update:visible', false)
    },
    // ***************************************文件上传************************************
    handleFileBeforeUpload(file) {
      file.status = 'ready'
      this.$set(file, 'percentage', 0)
    },
    submitFile(content) {
      let formData = new FormData()
      formData.append('file', content.file)
      // formData.append('bizTypeEnum', this.bizType)
      // file类obj只能读，不能写所以复制一份使用,name不能枚举也要单独拿
      const copyFile = { ...content.file, name: content.file.name }
      this.$set(copyFile, 'percentage', 0)
      const onUploadProgress = progressEvent => {
        let percent = parseFloat(
          (progressEvent.loaded / progressEvent.total) * (100).toFixed(2)
        )
        copyFile.percentage = percent
      }
      this.$set(copyFile, 'disabled', false)
      this.$set(copyFile, 'isFocus', false)
      this.fileList.push(copyFile)
      // 判断

      if (this.importType === 'class') {
        fileUpload(formData, onUploadProgress)
          .then(res => {
            if (res.code === '200') {
              content.onSuccess('文件上传成功！')
            } else {
              this.errors = res.msg
            }
          })
          .catch(err => {
            this.errors = err.msg
            content.onError('文件上传失败' + err)
          })
      } else {
        studentFileApi
          .fileUpload(formData, onUploadProgress)
          .then(res => {
            if (res.code === '200') {
              content.onSuccess('文件上传成功！')
            } else {
              this.errors = res.msg
            }
          })
          .catch(err => {
            this.errors = err.msg
            content.onError('文件上传失败' + err)
          })
      }
    },
    handleFileRemove() {},
    handleFileProgress() {},
    handleFileSuccess() {},
    handleFileError(err, file) {
      // 使用自定义文件列表需要用到
      // 传入报错信息
      file.msg = err
    },
    handleFilePreview() {},

    /**
     * 下载文件
     */
    download() {
      if (this.importType === 'class') {
        window.open(downloadClassTemplateExcel())
      } else {
        window.open(studentFileApi.downloadTemplateExcel())
      }
      // downloadClassTemplateExcel().then(res => {
      //   console.log(res)
      //   // fileDownload(res, data.fileName)
      // })
    },
    resetDialog() {
      this.fileList = []
      this.errors = ''
    },
    resetFileList() {}
    // ***************************************文件上传 end************************************
  }
}
</script>

<style lang="scss" scoped>
.btns-group {
  display: flex;
  padding-bottom: 16px;
}
.file-name {
  height: 32px;
  width: 100%;
  line-height: 32px;
  padding-left: 16px;
  background: #ffffff;
  border-radius: 4px;
  border: 1px solid #e1e3e6;
}
.description {
  margin: 16px 0;
  &__item {
    height: 20px;
    line-height: 20px;
  }
}
.upload-failure {
  padding-left: 16px;
  height: 40px;
  line-height: 40px;
  background: #fff1f0;
  border-radius: 2px;
  border: 1px solid #ffa39e;
}
.error-reason {
  margin-top: 16px;
  padding-bottom: 16px;
  &__title {
    height: 22px;
    line-height: 22px;
    font-weight: 500;
    color: #232324;
  }
  &__body {
    margin-top: 16px;

    padding: 16px;
    width: 100%;
    height: 98px;
    background: #fafafa;
    border-radius: 4px;
  }
}
.footer {
  display: flex;
  justify-content: space-between;
  .progress {
    display: flex;
    align-items: center;
    &__label {
      height: 22px;
      font-size: 14px;
      font-weight: 400;
      color: #3a3a3d;
      line-height: 22px;
    }
    &__bar {
      width: 320px;
    }
    &__percent {
      margin-left: 10px;
    }
  }
}
</style>
