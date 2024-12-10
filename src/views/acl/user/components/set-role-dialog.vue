<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { getAllRoleDataApi, getRoleByIdApi } from '@/api/acl/role'
import type { RoleVo } from '@/api/acl/role/type'
import type { SetRoleDto } from '@/api/acl/user/type'
import { setRoleApi } from '@/api/acl/user'

const emit = defineEmits<{
  (e: 'update'): void
}>()

const visible = ref(false)
const genderForm = (): SetRoleDto => {
  return {
    userId: '',
    roleIdList: []
  }
}
const form = ref(genderForm())

const checkAll = ref(false)
const isIndeterminate = ref(true)
const roles = ref<RoleVo[]>([])

// 获取全部角色
const getAllRoles = async () => {
  const res = await getAllRoleDataApi()
  roles.value = res.data
}
getAllRoles()

// 获取用户角色
const getUserRole = async () => {
  const res = await getRoleByIdApi(form.value.userId)
  form.value.roleIdList = res.data
}

const handleCheckAllChange = (val: boolean) => {
  form.value.roleIdList = val ? roles.value.map((role) => role.id) : []
  isIndeterminate.value = false
}
const handleCheckedRolesChange = (value: string[]) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === roles.value.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < roles.value.length
}

const open = (id: string) => {
  form.value.userId = id
  getUserRole()
  visible.value = true
}

// 弹窗关闭的回调
const handleClose = () => {
  form.value = genderForm()
}

const handleSubmit = async () => {
  await setRoleApi(form.value)
  ElMessage.success('设置角色成功,2s后自动刷新页面')
  setTimeout(() => {
    window.location.reload()
  }, 2000)
  emit('update')
  visible.value = false
}

defineExpose({
  open
})
</script>

<template>
  <el-dialog v-model="visible" title="设置角色" width="500" @close="handleClose">
    <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
    <el-checkbox-group v-model="form.roleIdList" @change="handleCheckedRolesChange">
      <el-checkbox v-for="role in roles" :key="role.id" :value="role.id">
        {{ role.roleName }}
      </el-checkbox>
    </el-checkbox-group>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss"></style>
