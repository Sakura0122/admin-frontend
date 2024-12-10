<script setup lang="ts">
import SakuraCard from '@/components/sakura-card/index.vue'
import { ref, useTemplateRef } from 'vue'
import type { RoleQueryDto, RoleVo } from '@/api/acl/role/type'
import { delRoleApi, getRoleDataApi } from '@/api/acl/role'
import usePagination from '@/hooks/usePagination'
import SakuraPagination from '@/components/sakura-pagination/index.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import RoleDialog from '@/views/acl/role/components/role-dialog.vue'
import SetPermissionDialog from '@/views/acl/role/components/set-permission-dialog.vue'

defineOptions({ name: 'Role' })

// 请求查询参数
const queryParams = ref<RoleQueryDto>({
  roleName: ''
})
const { pagination } = usePagination(() => getAllRoleData())
const tableData = ref<RoleVo[]>([])
const getAllRoleData = async () => {
  const res = await getRoleDataApi({
    ...queryParams.value,
    currentPage: pagination.currentPage,
    pageSize: pagination.pageSize
  })
  tableData.value = res.data.list
  pagination.total = res.data.total
}
getAllRoleData()

// 新增角色
const roleDialogRef = useTemplateRef<InstanceType<typeof RoleDialog>>('roleDialogRef')
const handleAdd = () => {
  roleDialogRef.value?.open()
}

// 编辑角色
const handleUpdate = (row: RoleVo) => {
  roleDialogRef.value?.open(row)
}

// 删除角色
const handleDelete = (id: string) => {
  ElMessageBox.confirm('确定删除该角色？', '提示').then(async () => {
    await delRoleApi(id)
    ElMessage.success('删除成功')
    pagination.search()
  })
}

// 分配权限
const setPermissionDialogRef = useTemplateRef<InstanceType<typeof SetPermissionDialog>>('setPermissionDialogRef')
const handleSetPermission = (id: string) => {
  setPermissionDialogRef.value?.open(id)
}
</script>

<template>
  <sakura-card title="角色管理">
    <template #tools>
      <el-button type="primary" @click="handleAdd">添加角色</el-button>
      <div class="right">
        <div class="item">
          <div class="label">角色名称</div>
          <el-input placeholder="请输入角色名称" v-model="queryParams.roleName" clearable />
        </div>
        <div class="item">
          <el-button type="primary" @click="pagination.search()">查询</el-button>
        </div>
      </div>
    </template>
    <el-table :data="tableData" style="width: 100%" max-height="100%">
      <el-table-column label="序号" type="index" width="70" />
      <el-table-column prop="roleName" label="角色名称" />
      <el-table-column prop="roleCode" label="角色编码" />
      <el-table-column prop="description" label="角色描述" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column prop="updateTime" label="更新时间" />
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleSetPermission(row.id)">分配权限</el-button>
          <el-button type="primary" link @click="handleUpdate(row)">编辑</el-button>
          <el-button type="primary" link @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <sakura-pagination :pagination />
    <role-dialog ref="roleDialogRef" @update="pagination.search" />
    <set-permission-dialog ref="setPermissionDialogRef" />
  </sakura-card>
</template>

<style scoped lang="scss"></style>
