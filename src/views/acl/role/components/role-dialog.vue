<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import type { RoleDto } from '@/api/acl/role/type'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { addRoleApi, updateRoleApi } from '@/api/acl/role'

const emit = defineEmits<{
  (e: 'update'): void
}>()

const visible = ref(false)
const genderForm = () => {
  return {
    roleName: '',
    roleCode: '',
    description: ''
  }
}
const form = ref<RoleDto>(genderForm())
const formRef = useTemplateRef<FormInstance>('formRef')
const rules = ref<FormRules<RoleDto>>({
  roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  roleCode: [{ required: true, message: '请输入角色编码', trigger: 'blur' }]
})

const open = (data?: RoleDto) => {
  if (data) form.value = JSON.parse(JSON.stringify(data))
  visible.value = true
}

// 弹窗关闭的回调
const handleClose = () => {
  form.value = genderForm()
}

const handleSubmit = () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      form.value.id ? await updateRoleApi(form.value) : await addRoleApi(form.value)
      ElMessage.success(form.value.id ? '编辑角色成功' : '新增角色成功')
      emit('update')
      visible.value = false
    }
  })
}

defineExpose({
  open
})
</script>

<template>
  <el-dialog v-model="visible" :title="form?.id ? '编辑角色' : '新增角色'" width="500" @close="handleClose">
    <el-form :model="form" label-width="100" ref="formRef" :rules>
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="form.roleName" placeholder="请输入角色名称" />
      </el-form-item>
      <el-form-item label="角色编码" prop="roleCode">
        <el-input v-model="form.roleCode" placeholder="请输入角色编码" />
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="form.description" placeholder="请输入角色描述" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss"></style>
