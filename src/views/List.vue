<template>
  <div class="List">
    <div class="flex space-between">
      <h2 class="title">{{name}}</h2>
      <p></p>
      <!-- <Input search enter-button placeholder="输入款号" style="width: 300px" /> -->
    </div>
    <div class="pa-2">
      <Table :data="list" :columns="columns" :loading="loading">
        <template slot-scope="{ row }" slot="productImg">
            <img :src="row.productImg" style="width: 60px; height: 60px">
        </template>
        <template slot-scope="{ row }" slot="action">
            <Button type="primary" size="small" style="margin-right: 5px" :to="{name: 'Home', query: {code: row.styleno}}">查看</Button>
            <!-- <Button type="error" size="small" @click="remove(index)">Delete</Button> -->
        </template>
      </Table>
      <div class="flex space-between py-2">
        <p></p>
        <Page
          :total="total"
          :current.sync="current_page"
          :page-size-opts="[10,20,30,40,50,100,200,500]"
          :page-size="limit"
          show-sizer
          show-total
          @on-change="getList"
          @on-page-size-change="pageSizeChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'List',
  components: {},
  data() {
    return {
      loading: false,
      list: [],
      id: '',
      name: '',
      limit: 10,
      current_page: 1,
      total: 0,
      columns: [
        {
          type: 'index',
          title: '#',
          width: 60,
        },
        {
          key: 'styleno',
          title: '款号',
          width: 200,
        },
        {
          key: 'alias_name',
          title: '策划名',
          width: 200,
        },
        {
          key: 'year',
          title: '年份',
          width: 100,
        },
        {
          key: 'quarter',
          title: '季节',
          width: 100,
        },
        {
          key: 'productImg',
          title: '产品图片',
          slot: 'productImg',
        },
        {
          title: '操作',
          slot: 'action',
        },
      ]
    };
  },
  watch: {
    $route: {
      handler: function (to) {
        let {id, name} = to.query;
        if (id) {
          this.id = id;
          this.name = name;
          this.getList();
        }
      },
      immediate: true,
    },
  },
  methods: {
    pageSizeChange(size) {
      this.current_page = 1;
      this.limit = size;
      this.getList();
    },
    getList() {
      let {current_page, limit, id} = this;
      this.loading = true;
      this.$http
        .get(`/api/collocation/productByType/${id}?id=${id}&page=${current_page}&limit=${limit}`)
        .then(({ status, data, total, current_page }) => {
          this.loading = false;
          if (status == 'success') {
            this.list = data.data || [];
            this.total = total;
            this.current_page = current_page;
          }
        }).catch(e => {
          this.loading = false;
          console.log(e)
        })
    },
  },
};
</script>
<style scoped>
</style>