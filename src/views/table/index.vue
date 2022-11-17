<template>
  <div class="app-container">

    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="80px"
    >

      <el-form-item label="标题：" prop="name">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入标题"
          style="width: 250px"
          clearable
          size="mini"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态:" prop="status">
        <el-select
          v-model="queryParams.status"
          style="width: 250px"
          size="mini"
          clearable
          collapse-tags
          placeholder="请选择状态"
        >
          <el-option
            v-for="item in statusOption"
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
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="标题">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="作者" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="浏览量" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.pageviews }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="发布时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.display_time }}</span>
        </template>
      </el-table-column>

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
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :current-page="queryParams.pageNum"
        :page-size="queryParams.pageSize"
        :page-sizes="[20, 40, 60, 80, 100]"
        :total="queryParams.total"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </div>

    <!-- 添加对话框 -->
    <el-dialog :title="title" :visible.sync="open" :close-on-click-modal="false" width="820px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="16">
            <el-form-item label="标题：" prop="title">
              <el-input v-model="form.title" placeholder="请输入标题" style="width: 400px"/>
            </el-form-item>
            <el-form-item label="作者：" prop="author">
              <el-input v-model="form.author" placeholder="请输入作者" style="width: 400px"/>
            </el-form-item>
            <el-form-item label="浏览量：" prop="pageviews">
              <el-input v-model="form.pageviews" placeholder="请输入浏览量" style="width: 400px"/>
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
import { getList } from '@/api/table';
export default {
  name: '',
  components: {

  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
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
        pageSize: 30,
        title: undefined,
        ststus: undefined
      },
      // 是否显示弹出层
      open: false,
      // 弹出框标题
      title: "",
      // 表单参数
      form: {},
      // 状态
      statusOption: [
        {id: "draft", name: "draft"},
        {id: "published", name: "published"},
        {id: "deleted", name: "deleted"},
      ],
      list: null,
      listLoading: true,
      // 总条数
      total: 0,
      rules: {
        title: [
          {required: true, message: "标题不能为空", trigger: "blur"}
        ],
        author: [
          {required: true, message: "作者不能为空", trigger: "blur"}
        ],
        pageviews: [
          {required: true, message: "浏览量不能为空", trigger: "blur"}
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
      this.queryParams.title
      this.queryParams.ststus
      //alert("搜索条件1："+this.queryParams.title+"搜索条件2："+this.queryParams.ststus);
      getList(this.queryParams).then(response => {
        this.list = response.data.items
        // this.total = response.total
        this.total = 100
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
      this.dateRange = []
      // this.resetForm("queryForm")
      this.handleQuery()
    },

    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.form = {
        title: ''
      }
      this.title = "新增"
    },

    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          const data = JSON.parse(JSON.stringify(this.form))
          // 调用后台保存方法
          alert("调用后台接口保存,标题："+data.title+",作者："+data.author)
          // addMirror(data).then(response => {
          //   this.msgSuccess("新增成功");
          //   this.open = false;
          //   this.getList();
          // });
        }
      })
    },

    /** 修改 */
    handleUpdate(row) {
      this.open = true
      this.title = "修改"
      const data = JSON.parse(JSON.stringify(row))
      this.form = data
    },

    /** 删除 */
    handleDelete(row){
      this.$confirm("确认删除标题：" + row.title + "的数据？", "温馨提醒", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "success"
      }).then(function() {
        //调用后台删除接口
      }).then(() => {
        this.fetchData()
        this.msgSuccess("删除成功")
      })
    },

    /** 取消按钮 */
    cancel() {
      this.open = false
      this.reset()
    },

    /** 表单重置 */
    reset() {
      this.form = {}
      // this.resetForm("form")
    },

    handlePageChange(currentPage) {
      this.queryParams.pageNum = currentPage
      // 在此刷新数据
    },
    handleSizeChange(pageSize) {
      this.queryParams.pageSize = pageSize
      // 在此刷新数据
    }

  }
}
</script>
