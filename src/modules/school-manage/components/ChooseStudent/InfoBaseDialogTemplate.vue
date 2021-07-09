<template>
  <BaseDialog
    :visible="visible"
    @cancel="cancelDialog"
    :title="title"
    @close="cancelDialog"
    @closed="resetDialog"
    @confirm="confirmDialog"
    @open="openDialog"
    :config="$attrs.config"
    append-to-body
  >
    <template #body>
      <div class="student-base-info">
        <FormOtherMaterial
          title="学生基本信息"
          type="newBlue"
        ></FormOtherMaterial>
        <div class="student-base-info__item">
          <div class="student-base-info__item__label">学校：</div>
          <div class="student-base-info__item__value">
            {{ baseInfo.schoolName }}
          </div>
        </div>
        <div class="student-base-info__item">
          <div class="student-base-info__item__label">年级：</div>
          <div class="student-base-info__item__value">
            {{ baseInfo.gradeName }}
          </div>
        </div>
        <div class="student-base-info__item">
          <div class="student-base-info__item__label">班级：</div>
          <div class="student-base-info__item__value">
            {{ baseInfo.className }}
          </div>
        </div>
        <div class="student-base-info__item">
          <div class="student-base-info__item__label">姓名：</div>
          <div class="student-base-info__item__value">
            {{ baseInfo.studentName }}
          </div>
        </div>
        <div class="student-base-info__item">
          <div class="student-base-info__item__label">性别：</div>
          <div class="student-base-info__item__value">
            {{ baseInfo.sexCodeName }}
          </div>
        </div>
        <div class="student-base-info__item">
          <div class="student-base-info__item__label">证件号码：</div>
          <div class="student-base-info__item__value">
            {{ baseInfo.certNo }}
          </div>
        </div>
      </div>
      <slot :baseInfo="baseInfo"></slot>
    </template>
  </BaseDialog>
</template>

<script>
import BaseDialog from '@/components/BaseDialog'
import FormOtherMaterial from '@/components/ConfigForm/FormOtherMaterial'
export default {
  name: 'InfoBaseDialogTemplate',
  components: {
    BaseDialog,
    FormOtherMaterial
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '编辑'
    },

    baseInfo: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    //**************************** 弹框相关 start *************
    openDialog() {
      console.log('first dialog open')
      this.$emit('open')
    },
    cancelDialog() {
      this.$emit('update:visible', false)
    },
    confirmDialog() {
      this.$emit('submitData', this.baseInfo)
    },
    resetDialog() {
      this.$emit('closed')
    }
    //**************************** 弹框相关 end *************
  }
}
</script>

<style lang="scss" scoped>
.student-base-info {
  margin-top: -16px;
  &__item {
    display: inline-block;
    height: 38px;
    line-height: 38px;
    width: 33%;
    &__label {
      display: inline-block;
      width: 30%;
      text-align: right;
    }
    &__value {
      display: inline-block;
      width: 70%;
    }
  }
}
</style>
