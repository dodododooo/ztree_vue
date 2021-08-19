<template>
  <div class="Search">
    <div @click.stop.prevent class="flex start relative">
      <DatePicker :value="year" @on-change="y => year = y" type="year" placeholder="年份" style="width: 80px"></DatePicker>
      <Select
        v-model="quarter"
        slot="prepend"
        style="width: 80px"
        placeholder="季节"
      >
        <Option value="春季">春季</Option>
        <Option value="夏季">夏季</Option>
        <Option value="秋季">秋季</Option>
        <Option value="冬季">冬季</Option>
      </Select>
      <Select
        v-model="type"
        slot="prepend"
        style="width: 100px"
      >
        <Option value="0">款号</Option>
        <Option value="1">策划名</Option>
        <Option value="2">颜色</Option>
      </Select>
      <Input v-model="searchValue" @on-focus="focus" @on-search="searchByButton" placeholder="请输入搜索内容" search enter-button style="width: 300px" />
      <Card v-if="showSearchList" dis-hover style="height: 400px; position: absolute; top: 40px; left: 0; right: 0; box-shadow: 3px 3px 10px #ccc; z-index: 9999999;">
        <Spin v-if="searchLoading" size="large" fix></Spin>
        <p
          v-else-if="searchList.length == 0"
          class="py-10 color-gray text-center"
        >
          没有结果
        </p>
        <template v-else>
          <ul>
            <li class="mb-1 color-gray flex">
              <p style="width: 40px" class="pl-1">#</p>
              <p style="width: 200px">款号</p>
              <p style="width: 200px">策划名称</p>
            </li>
            <li
              v-for="(item, index) in searchList"
              :key="index"
              @click="itemClick(item.styleno)"
              class="flex list-item py-1"
            >
              <p style="width: 40px" class="pl-1 color-gray">
                {{ index + 1 }}
              </p>
              <p
                style="width: 200px"
                class="ellipsis pr-1"
                :title="item.styleno"
              >
                {{ item.styleno }}
              </p>
              <p
                style="width: 200px"
                class="ellipsis"
                :title="item.alias_name"
              >
                {{ item.alias_name || '暂无' }}
              </p>
            </li>
          </ul>
          <div
            class="px-3"
            style="position: absolute; bottom: 10px; left: 0"
          >
            <Page
              @on-change="pageChange"
              :current.sync="page"
              :total="searchTotal"
              size="small"
              show-total
            />
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Search',
  components: {},
  data () {
    return {
      searchValue: '',
      type: '0', //0：通过款号搜索；1：通过策划名搜索；2：通过颜色搜索
      year: '',
      quarter: '',
      searchList: [],
      page: 1,
      searchTotal: 0,
      showSearchList: false,
      searchLoading: false,
    };
  },
  mounted() {
    let {year = '', type = '0', quarter = '',  code = ''} = this.$route.query;
    this.year = year;
    this.type = `${type}`;
    this.quarter = quarter;
    this.searchValue = code;
    window.addEventListener('click', this.blur);
  },
  beforeDestroy() {
    window.removeEventListener('click', this.blur);
  },
  methods: {
    itemClick(code) {
      let {year, type, quarter} = this;
      this.blur();
      this.$emit('itemClick', {code, year, type, quarter});
    },
    focus() {
      this.showSearchList = true;
    },
    blur() {
      this.showSearchList = false;
    },
    pageChange() {
      this.search();
    },
    searchByButton() {
      this.page = 1;
      this.searchTotal = 0;
      this.searchList = [];
      this.search();
    },
    search() {
      let { type, searchValue, page = 1, year, quarter } = this;
      if (!searchValue) {
        this.$Message.error('请输入搜索内容');
        this.searchLoading = false;
        this.searchList = [];
        return;
      }
      this.searchLoading = true;
      let params = { type, searchValue, page, limit: 10 };
      if (year) params.year = year;
      if (quarter) params.quarter = quarter;
      this.$http
        .post('/api/collocation/productCodeBySearch', params)
        .then(({ status, data }) => {
          this.searchLoading = false;
          if (status == 'success') {
            this.searchList = data.data || [];
            this.searchTotal = data.total;
          } else {
            this.searchList = [];
          }
        })
        .catch((e) => {
          this.searchLoading = false;
          this.searchList = [];
          console.log(e);
        });
    },
  },
}
</script>
<style scoped>
.list-item {
  line-height: 1;
  cursor: pointer;
}
.list-item:hover {
  background-color: aliceblue;
}
</style>