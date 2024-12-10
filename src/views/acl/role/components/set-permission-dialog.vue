<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { ElMessage, ElTree } from 'element-plus'
import type { SetRoleDto } from '@/api/acl/user/type'
import { setRoleApi } from '@/api/acl/user'
import { getAllMenuApi, getMenuByRoleIdApi } from '@/api/acl/menu'
import type { MenuVo } from '@/api/acl/menu/type'
import { setMenuApi } from '@/api/acl/role'
import type { setMenuDto } from '@/api/acl/role/type'

const visible = ref(false)
const genderForm = (): setMenuDto => {
  return {
    roleId: '',
    menuIdList: []
  }
}
const form = ref(genderForm())

// 获取全部权限
const menuData = ref<MenuVo[]>([])
const getMenuList = async () => {
  const res = await getAllMenuApi()
  menuData.value = res.data
}
getMenuList()

// 角色已有权限
const selectPermissionIds = ref<string[]>([])
const open = async (id: string) => {
  form.value.roleId = id
  const res = await getMenuByRoleIdApi(id)
  selectPermissionIds.value = res.data
  visible.value = true
}

// 弹窗关闭的回调
const handleClose = () => {
  form.value = genderForm()
  selectPermissionIds.value = []
}

const treeRef = useTemplateRef<InstanceType<typeof ElTree> | null>('treeRef')
const handleSubmit = async () => {
  // 半选的节点
  const halfCheckedKeys = treeRef.value?.getHalfCheckedKeys() as string[]
  // 全选的节点
  const checkedKeys = treeRef.value?.getCheckedKeys() as string[]
  // 所有的节点
  form.value.menuIdList = halfCheckedKeys?.concat(checkedKeys)
  await setMenuApi(form.value)
  ElMessage.success('设置权限成功,2s后自动刷新页面')
  setTimeout(() => {
    window.location.reload()
  }, 2000)
  visible.value = false
}

defineExpose({
  open
})
</script>

<template>
  <el-dialog v-model="visible" title="设置权限" width="500" @close="handleClose">
    <el-tree
      ref="treeRef"
      :props="{ label: 'title', children: 'children' }"
      :data="menuData"
      node-key="id"
      show-checkbox
      check-strictly
      :default-checked-keys="selectPermissionIds"
    />
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss"></style>
