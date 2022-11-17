<template>
  <div class="app-container">

    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="80px"
    >

      <el-form-item label="账号：" prop="account">
        <el-input
          v-model="queryParams.account"
          placeholder="请输入账号"
          style="width: 250px"
          clearable
          size="mini"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="姓名：" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入姓名"
          style="width: 250px"
          clearable
          size="mini"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="性别:" prop="sex">
        <el-select
          v-model="queryParams.sex"
          style="width: 250px"
          size="mini"
          clearable
          collapse-tags
          placeholder="请选择性别"
        >
          <el-option
            v-for="item in sexOption"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
        >搜索
        </el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
        >重置
        </el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增
        </el-button>
      </el-col>
    </el-row>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
    <!-- <el-table-column type="selection" width="55"></el-table-column> -->
    <el-table-column align="center" label="序号" width="95" sortable>
      <template slot-scope="scope">
        {{ scope.$index }}
      </template>
    </el-table-column>
      <el-table-column align="center" label="ID" width="95" sortable>
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="账号">
        <template slot-scope="scope">
          {{ scope.row.account }}
        </template>
      </el-table-column>
      <el-table-column label="姓名" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系电话" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>

      <el-table-column label="性别" width="110" align="center" :formatter="formatSex" prop="sex" sortable></el-table-column>
      <el-table-column label="创建时间" width="200" align="center" :formatter="formatCreateTime" prop="createTime" sortable></el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" >修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

<!--    <el-pagination-->
<!--      :current-page="queryParams.pageNum"-->
<!--      :page-size="queryParams.pageSize"-->
<!--      :total="queryParams.total"-->
<!--      @current-change="fetchData"-->
<!--      background-->
<!--      layout="prev, pager, next"-->
<!--    />-->

    <div class="pagination">
      <!-- <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :current-page="queryParams.pageNum"
        :page-size="queryParams.pageSize"
        :page-sizes="[20, 40, 60, 80, 100]"
        :total="queryParams.total"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      /> -->

      <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryParams.pageNum"
            :page-sizes="[10, 20, 30, 40,50]"
            :page-size="queryParams.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
    </div>

    <!-- 添加对话框 -->
    <el-dialog :title="title" :visible.sync="open" :close-on-click-modal="false" width="820px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="16">
            <el-input v-model="form.id" type="hidden" />
            <el-form-item label="账号：" prop="account">
              <el-input v-model="form.account" placeholder="请输入账号" style="width: 400px"/>
            </el-form-item>
            <el-form-item label="密码：" prop="password" v-if="showPassword">
              <el-input v-model="form.password" placeholder="请输入密码" style="width: 400px"/>
            </el-form-item>
            <el-form-item label="姓名：" prop="name">
              <el-input v-model="form.name" placeholder="请输入姓名" style="width: 400px"/>
            </el-form-item>
            <el-form-item label="联系电话：" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入联系电话" style="width: 400px"/>
            </el-form-item>
            <el-form-item label="性别:" prop="sex">
              <el-select v-model="form.sex" style="width: 400px" size="mini" clearable collapse-tags placeholder="请选择性别">
                <el-option v-for="item in sexOption" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getList } from '@/api/userInfo';
import { formatTime } from '@/api/userInfo';
import { getUserInfo } from '@/api/userInfo';
import { saveUser } from '@/api/userInfo';
import { delUser } from '@/api/userInfo';



export default {
  name: '',
  components: {

  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: 'success',
        1: 'gray',
        2: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      // 显示搜索条件
      showSearch: true,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        account: undefined,
        name: undefined,
        sex: undefined
      },
      // 是否显示弹出层
      open: false,
      showPassword: false,
      // 弹出框标题
      title: "",
      // 表单参数
      form: {},
      sexOption: [
        {id: 0, name: "未知"},
        {id: 1, name: "男"},
        {id: 2, name: "女"},
      ],
      list: null,
      listLoading: true,
      // 总条数
      total: 0,
      rules: {
        account: [
          {required: true, message: "账号不能为空", trigger: "blur"}
        ],
        password: [
          {required: true, message: "密码不能为空", trigger: "blur"}
        ],
        name: [
          {required: true, message: "姓名不能为空", trigger: "blur"}
        ],
        phone: [
          {required: true, message: "联系电话不能为空", trigger: "blur"}
        ],
        sex: [
          {required: true, message: "性别不能为空", trigger: "blur"}
        ]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      //alert("搜索条件1："+this.queryParams.title+"搜索条件2："+this.queryParams.ststus);
      getList(this.queryParams).then(response => {
        this.list = response.data.list
        // this.total = response.total
        this.total = response.data.total
        this.listLoading = false
      })
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.fetchData()
    },

    /** 重置按钮操作 */
    resetQuery() {
      this.$refs.queryForm.resetFields();
      this.handleQuery()
    },

    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          const data = JSON.parse(JSON.stringify(this.form))
          saveUser(data).then(response => {
            //this.msgSuccess("操作成功");
            this.$message('操作成功');
            this.open = false;
            this.fetchData();
          })
        }
      })
    },

    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      //this.$refs.form.resetFields();
      this.open = true
      this.showPassword = true
      this.title = "新增"
    },

    /** 修改 */
    handleUpdate(row) {
      let params = {id: row.id};
      getUserInfo(params).then(response => {
        this.title = "修改"
        this.showPassword = false
        this.open = true
        let data = response.data
        this.form = JSON.parse(JSON.stringify(row))
      })
    },

    /** 删除 */
    handleDelete(row){
      this.$confirm("确认删除？", "温馨提醒", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "success"
      }).then(function() {
        //调用后台删除接口
        let data = {id: row.id}
        delUser(data)
      }).then(() => {
        this.fetchData()
        this.$message('操作成功')
      })
    },

    /** 取消按钮 */
    cancel() {
      this.open = false
      //this.reset()
    },

    handleCurrentChange(currentPage) {
      this.queryParams.pageNum = currentPage
      // 在此刷新数据
      this.fetchData()
    },
    handleSizeChange(pageSize) {
      this.queryParams.pageSize = pageSize
      // 在此刷新数据
      this.fetchData()
    },
    formatSex( row, column) {
        if(row.sex == 1) return '男';
        if(row.sex == 2) return '女';
        return '未知';
      },

    formatCreateTime( row, column) {
      return formatTime(row.createTime);
    },
    reset() {
      this.form = {}
      //this.resetForm("form")
      this.$resetForm
    }

  }
}
</script>
