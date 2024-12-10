<script setup lang="ts">
import SakuraCard from '@/components/sakura-card/index.vue'
import { ref, useTemplateRef } from 'vue'
import usePagination from '@/hooks/usePagination'
import SakuraPagination from '@/components/sakura-pagination/index.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useDateRange } from '@/hooks/useDateRange'
import UserDialog from '@/views/acl/user/components/user-dialog.vue'
import type { SysUserQueryDto, SysUserVo } from '@/api/acl/user/type'
import { delUserApi, getUserDataApi } from '@/api/acl/user'
import SetRoleDialog from '@/views/acl/user/components/set-role-dialog.vue'

defineOptions({ name: 'User' })

// 请求查询参数
const { time, timeRange } = useDateRange()
const queryParams = ref<SysUserQueryDto>({
  keywords: ''
})
const { pagination } = usePagination(() => getAllRoleData())
const tableData = ref<SysUserVo[]>([])
const getAllRoleData = async () => {
  const res = await getUserDataApi({
    keywords: queryParams.value.keywords,
    status: queryParams.value.status,
    createTimeBegin: timeRange.value.timeBegin,
    createTimeEnd: timeRange.value.timeEnd,
    currentPage: pagination.currentPage,
    pageSize: pagination.pageSize
  })
  tableData.value = res.data.list
  pagination.total = res.data.total
}
getAllRoleData()

// 新增用户
const userDialogRef = useTemplateRef<InstanceType<typeof UserDialog>>('userDialogRef')
const handleAdd = () => {
  userDialogRef.value?.open()
}

// 编辑用户
const handleUpdate = (row: SysUserVo) => {
  userDialogRef.value?.open(row)
}

// 删除角色
const handleDelete = (id: string) => {
  ElMessageBox.confirm('确定删除该用户？', '提示').then(async () => {
    await delUserApi(id)
    ElMessage.success('删除成功')
    pagination.search()
  })
}

// 设置角色
const setRoleDialogRef = useTemplateRef<InstanceType<typeof SetRoleDialog>>('setRoleDialogRef')
const handleSetRole = (id: string) => {
  setRoleDialogRef.value?.open(id)
}
</script>

<template>
  <sakura-card title="用户管理">
    <template #tools>
      <el-button type="primary" @click="handleAdd">添加用户</el-button>
      <div class="right">
        <div class="item">
          <div class="label">状态</div>
          <el-select
            placeholder="全部"
            clearable
            v-model="queryParams.status"
            @change="pagination.search()"
            style="width: 100px"
          >
            <el-option label="正常" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </div>
        <div class="item">
          <div class="label">创建时间</div>
          <el-date-picker
            :editable="false"
            v-model="time"
            type="daterange"
            range-separator="~"
            start-placeholder="开始时间"
            end-placeholder="截止时间"
            value-format="YYYY-MM-DD"
            @change="pagination.search()"
            style="width: 240px"
          />
        </div>
        <div class="item">
          <div class="label">关键字</div>
          <el-input
            placeholder="请输入用户名、姓名、手机号"
            v-model="queryParams.keywords"
            clearable
            style="width: 230px"
          />
        </div>
        <div class="item">
          <el-button type="primary" @click="pagination.search()">查询</el-button>
        </div>
      </div>
    </template>
    <el-table :data="tableData" style="width: 100%" max-height="100%">
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="avatar" label="头像">
        <template #default="{ row }">
          <img class="avatar" :src="row.avatar" alt="" />
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="手机号" />
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <el-tag :type="row.status == 1 ? 'success' : 'info'">
            {{ row.status == 1 ? '正常' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column prop="updateTime" label="更新时间" />
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleSetRole(row.id)">分配角色</el-button>
          <el-button type="primary" link @click="handleUpdate(row)">编辑</el-button>
          <el-button type="primary" link @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <sakura-pagination :pagination />
    <user-dialog ref="userDialogRef" @update="pagination.search" />
    <set-role-dialog ref="setRoleDialogRef" @update="pagination.search" />
  </sakura-card>
</template>

<style scoped lang="scss">
:deep(.avatar) {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}
</style>
