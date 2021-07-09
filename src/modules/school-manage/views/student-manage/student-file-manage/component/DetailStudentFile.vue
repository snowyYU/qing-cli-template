<template>
  <BaseDialog
    :visible="visible"
    @cancel="cancelDialog"
    title="查看档案"
    @close="cancelDialog"
    @closed="resetDialog"
    @open="openDialog"
    :config="{ loading: loading, cancelText: '关闭', isShowConfirm: false }"
  >
    <template #body>
      <FormOtherMaterial
        title="学生基本信息"
        type="newBlue"
      ></FormOtherMaterial>
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
        <div class="student-base-info__item__label">证件类型：</div>
        <div class="student-base-info__item__value">
          {{ baseInfo.certTypeName }}
        </div>
      </div>
      <div class="student-base-info__item">
        <div class="student-base-info__item__label">证件号码：</div>
        <div class="student-base-info__item__value">
          {{ baseInfo.certNo }}
        </div>
      </div>
      <div class="student-base-info__item">
        <div class="student-base-info__item__label">出生日期：</div>
        <div class="student-base-info__item__value">
          {{ baseInfo.birthday }}
        </div>
      </div>
      <div class="student-base-info__item">
        <div class="student-base-info__item__label">学籍号：</div>
        <div class="student-base-info__item__value">
          {{ baseInfo.studentNumber }}
        </div>
      </div>
      <div class="student-base-info__item">
        <div class="student-base-info__item__label">学号：</div>
        <div class="student-base-info__item__value">
          {{ baseInfo.studentNo }}
        </div>
      </div>
      <div class="student-base-info__item">
        <div class="student-base-info__item__label">宿舍号：</div>
        <div class="student-base-info__item__value">
          {{ baseInfo.bedroomNo }}
        </div>
      </div>
      <div class="student-base-info__item">
        <div class="student-base-info__item__label">国籍：</div>
        <div class="student-base-info__item__value">
          {{ baseInfo.countryCodeName }}
        </div>
      </div>

      <div class="student-base-info__item">
        <div class="student-base-info__item__label">民族：</div>
        <div class="student-base-info__item__value">
          {{ baseInfo.nationCodeName }}
        </div>
      </div>
      <FormOtherMaterial title="学习经历" type="newBlue"></FormOtherMaterial>
      <BaseTable
        row-key="id"
        style="width: 100%;margin-bottom:10px"
        :columns="columns"
        :data="tableData"
      ></BaseTable>
    </template>
  </BaseDialog>
</template>

<script>
import BaseDialog from '@/components/BaseDialog'
import FormOtherMaterial from '@/components/ConfigForm/FormOtherMaterial'
import BaseTable from '@/components/BaseTable'
import { queryStudentDetail } from '../../../../api/student-file-manage'
export default {
  name: 'DetailStudentFile',
  components: {
    BaseDialog,
    FormOtherMaterial,
    BaseTable
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      baseInfo: {},
      columns: [
        {
          prop: 'schoolName',
          label: '学校'
        },
        {
          prop: 'gradeName',
          label: '年级'
        },
        {
          prop: 'className',
          label: '班级'
        },
        {
          prop: 'studentNo',
          label: '学号'
        },
        {
          prop: 'bedroomNo',
          label: '宿舍号'
        }
      ],
      tableData: []
    }
  },
  mounted() {},
  methods: {
    //**************************** 弹框相关 start *************
    openDialog() {
      this.queryStudentDetail()
      this.$emit('open')
    },
    cancelDialog() {
      this.$emit('update:visible', false)
    },
    resetDialog() {
      this.$emit('closed')
    },
    //**************************** 弹框相关 end *************
    queryStudentDetail() {
      this.loading = true
      queryStudentDetail({ id: this.id })
        .then(res => {
          this.baseInfo = res.data
          this.tableData = res.data.schoolStudentClassroomList
        })
        .finally(() => {
          this.loading = false
        })
    }
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
