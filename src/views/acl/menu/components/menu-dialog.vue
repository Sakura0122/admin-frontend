<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import type { MenuDto } from '@/api/acl/menu/type'
import { addMenuApi, updateMenuApi } from '@/api/acl/menu'

const emit = defineEmits<{
  (e: 'update'): void
}>()

const visible = ref(false)
const genderForm = (): MenuDto => {
  return {
    parentId: '',
    title: '',
    component: '',
    type: 0,
    sortValue: 0,
    status: 1
  }
}
const form = ref<MenuDto>(genderForm())
const formRef = useTemplateRef<FormInstance>('formRef')
const rules = ref<FormRules<MenuDto>>({
  title: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
  component: [{ required: true, message: '请输入权限值', trigger: 'blur' }]
})

const addOpen = (parentId: string, type: number) => {
  form.value.parentId = parentId
  form.value.type = type + 1
  visible.value = true
}

const editOpen = (data: MenuDto) => {
  form.value = JSON.parse(JSON.stringify(data))
  visible.value = true
}

// 弹窗关闭的回调
const handleClose = () => {
  form.value = genderForm()
}

const handleSubmit = () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      form.value.id ? await updateMenuApi(form.value) : await addMenuApi(form.value)
      ElMessage.success(form.value.id ? '编辑菜单成功' : '新增菜单成功')
      emit('update')
      visible.value = false
    }
  })
}

defineExpose({
  addOpen,
  editOpen
})
</script>

<template>
  <el-dialog v-model="visible" :title="form?.id ? '编辑菜单' : '新增菜单'" width="500" @close="handleClose">
    <el-form :model="form" label-width="100" ref="formRef" :rules>
      <el-form-item label="菜单名称" prop="title">
        <el-input v-model="form.title" placeholder="请输入角色名称" />
      </el-form-item>
      <el-form-item label="权限值" prop="component">
        <el-input v-model="form.component" placeholder="请输入权限值" />
      </el-form-item>
      <el-form-item label="排序">
        <el-input-number v-model="form.sortValue" controls-position="right" :min="0" />
      </el-form-item>
      <el-form-item label="状态">
        <el-switch
          v-model="form.status"
          active-text="启用"
          inactive-text="禁用"
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss"></style>
