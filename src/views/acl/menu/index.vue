<script setup lang="ts">
import SakuraCard from '@/components/sakura-card/index.vue'
import { ref, useTemplateRef } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { MenuDto, MenuVo } from '@/api/acl/menu/type'
import { delMenuApi, getAllMenuApi } from '@/api/acl/menu'
import MenuDialog from '@/views/acl/menu/components/menu-dialog.vue'

const tableData = ref<MenuVo[]>([])
const getMenuData = async () => {
  const res = await getAllMenuApi()
  tableData.value = res.data
}
getMenuData()

// 新增菜单
const menuDialogRef = useTemplateRef<InstanceType<typeof MenuDialog>>('menuDialogRef')
const handleAdd = (parentId: string, type: number) => {
  menuDialogRef.value?.addOpen(parentId, type)
}

// 编辑菜单
const handleUpdate = (row: MenuDto) => {
  menuDialogRef.value?.editOpen(row)
}

// 删除菜单
const handleDelete = (id: string) => {
  ElMessageBox.confirm('确定删除？', '提示').then(async () => {
    await delMenuApi(id)
    ElMessage.success('删除成功')
    getMenuData()
  })
}
</script>

<template>
  <sakura-card title="菜单管理">
    <template #tools>
      <el-button type="primary" @click="handleAdd('0', 0)">添加菜单</el-button>
    </template>
    <el-table :data="tableData" style="width: 100%" row-key="id" max-height="100%">
      <el-table-column prop="title" label="菜单名称" />
      <el-table-column prop="component" label="权限值" />
      <el-table-column prop="sortValue" label="排序" />
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <el-tag :type="row.status == 1 ? 'success' : 'info'">
            {{ row.status == 1 ? '正常' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column prop="updateTime" label="更新时间" />
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleAdd(row.id, row.type)" :disabled="row.type === 3">
            {{ row.type == 3 ? '添加功能' : '添加菜单' }}
          </el-button>
          <el-button type="primary" link @click="handleUpdate(row)">编辑</el-button>
          <el-button type="primary" link @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <menu-dialog ref="menuDialogRef" @update="getMenuData" />
  </sakura-card>
</template>

<style scoped lang="scss"></style>
