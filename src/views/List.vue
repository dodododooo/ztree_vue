<template>
  <div class="List">
    <div class="flex space-between">
      <h2 class="title"></h2>
      <Input search enter-button placeholder="输入款号" style="width: 300px" />
    </div>
    <div class="pa-2">
      <p
        v-if="filterList.length == 0"
        class="py-8 color-gray text-center"
      >
        没有结果
      </p>
      <Button
        v-for="(item, index) in filterList"
        :key="index"
        :to="{name: 'Home', query: {searchValue: item.styleno, type: '0'}}"
        type="primary"
        ghost
        class="mt-2 mr-1"
        >
        {{ item.styleno }}
      </Button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'List',
  components: {},
  data() {
    return {
      list: [],
      filterValue: '',
      filterList: [],
    };
  },
  watch: {
    filterValue () {
      this.filter();
    },
    $route: {
      handler: function (to) {
        if (to.query.id) {
          this.getList(to.query.id);
        }
      },
      immediate: true,
    },
  },
  created() {},
  mounted() {
    this.filter();
  },
  methods: {
    filter () {
      if (this.filterTimer) {
        clearTimeout(this.filterTimer);
        this.filterTimer = null;
      }
      this.filterTimer = setTimeout(() => {
        let { list = [], filterValue = '' } = this;
        this.filterList = filterValue ? list.filter(v => v.styleno.indexOf(filterValue) > -1) : list;
      }, 500);
    },
    getList(id) {
      this.$http
        .get(`/api/collocation/productByType/${id}`)
        .then(({ status, data }) => {
          if (status == 'success') {
            this.list = data || [];
            this.filter();
          }
        }).catch(e => {
          console.log(e)
        })
    },
  },
};
</script>
<style scoped>
</style>