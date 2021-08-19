<template>
  <div class="home relative">
    <Spin v-if="showSpin" size="large" fix></Spin>
    <div class="flex space-between">
      <div class="flex align-center">
        <Button size="small" ghost type="primary" @click="$router.go(-1)">
            <Icon type="ios-arrow-back" />
            返回
        </Button>
        <h2 class="title ml-2">产品基本信息</h2>
      </div>
      <div @click.stop.prevent class="flex start relative">
        <Select
          v-model="type"
          slot="prepend"
          style="width: 100px"
        >
          <Option value="0">款号</Option>
          <Option value="1">策划名</Option>
          <Option value="2">颜色</Option>
        </Select>
        <Input v-model="year" placeholder="年份" style="width: 80px" />
        <Input v-model="quarter" placeholder="年份" style="width: 80px" />
        <Input v-model="searchValue" @on-focus="focus" @on-search="searchByButton" placeholder="请输入搜索内容" search enter-button style="width: 300px" />
        <Card v-if="showSearchList" dis-hover style="height: 400px; position: absolute; top: 35px; left: 0; right: 0; box-shadow: 3px 3px 10px #ccc">
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
                <p style="width: 164px">款号</p>
                <p style="width: 164px">策划名称</p>
              </li>
              <li
                v-for="(item, index) in searchList"
                :key="index"
                @click="getProductInfo(item.styleno)"
                class="flex list-item py-1"
              >
                <p style="width: 40px" class="pl-1 color-gray">
                  {{ index + 1 }}
                </p>
                <p
                  style="width: 164px"
                  class="ellipsis pr-1"
                  :title="item.styleno"
                >
                  {{ item.styleno }}
                </p>
                <p
                  style="width: 164px"
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
    <p v-if="!detail.styleno" class="py-10 color-gray text-center">没有内容</p>
    <template v-else>
      <div class="pa-3 flex flex-wrap">
        <p class="width-50 mb-1">款号： {{ detail.styleno || '暂无'}}</p>
        <p class="width-50 mb-1">策划名称： {{ detail.alias_name || '暂无'}}</p>
        <p class="width-50 mb-1">面料名称： {{ detail.material_name || '暂无'}}</p>
        <p class="width-50 mb-1">洗水说明： {{ detail.wash_instruction || '暂无'}}</p>
        <p class="width-50 mb-1">是否含配件： {{ detail.include_parts || '暂无'}}</p>
        <p class="width-50 mb-1">设计卖点： {{ detail.design_point || '暂无'}}</p>
        <p class="width-50 mb-1">销售卖点： {{ detail.sell_point || '暂无'}}</p>
        <p class="width-50 mb-1">可销数量： {{ detail.cansale_qty || '暂无'}}</p>
        <p class="width-50 mb-1">在途数量： {{ detail.onway_qty || '暂无'}}</p>
        <p class="width-50 mb-1">年份： {{ detail.year || '暂无'}}</p>
        <p class="width-50 mb-1">季节： {{ detail.quarter || '暂无'}}</p>
        <p class="width-50 mb-1">颜色： {{ detail.color || '暂无'}}</p>
        <p class="width-50 mb-1">一级菜单： {{ detail.oneLevelType || '暂无'}}</p>
        <p class="width-50 mb-1">二级菜单： {{ detail.secondLevelType || '暂无'}}</p>
        <p class="width-50 mb-1">三级菜单： {{ detail.threeLevel || '暂无'}}</p>
        <p class="width-100 mb-1">可售明细： {{ detail.cansale_str || '暂无'}}</p>
        <p class="width-100 mb-1">在途明细： {{ detail.onway_str || '暂无'}}</p>
        <div class="flex mb-1">
          <p class="width-100 mr-2">产品图片:</p>
          <img
            :src="detail.productImg"
            style="
              width: 100px;
              height: 100px;
              object-fit: cover;
              display: block;
            "
          />
        </div>
      </div>
      <Divider />
      <div>
        <h2 class="title my-2">产品搭配信息</h2>
        <p
          v-if="!detail.collocationData || !detail.collocationData.length"
          class="py-10 color-gray text-center"
        >
          没有内容
        </p>
        <div v-else class="flex flex-wrap">
          <div
            v-for="(v, i) in detail.collocationData"
            :key="i"
            @click="getCollocationInfo(v)"
            style="
              width: 240px;
              height: 270px;
              flex-grow: 0;
              flex-shrink: 0;
              cursur: pointer;
            "
            class="relative border-radius collocation-item"
          >
            <div
              style="
                background-color: #333;
                position: absolute;
                top: 4px;
                right: 4px;
                bottom: 4px;
                left: 4px;
              "
            >
              <img
                :src="v.img_url"
                style="
                  width: 232px;
                  height: 232px;
                  object-fit: cover;
                  display: block;
                "
              />
              <p
                style="
                  height: 30px;
                  line-height: 30px;
                  text-align: center;
                  color: #333;
                "
                class="bg-gray"
              >
                {{ v.mix_code }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </template>
    <Modal v-model="showCollocation" width="60">
      <div slot="header">{{ collocationInfo.mix_code }}</div>
      <div class="pa-3 flex flex-wrap">
        <p class="width-50 mb-1">搭配编号： {{ collocationInfo.mix_code }}</p>
        <p class="width-50 mb-1">搭配卖点： {{ collocationInfo.mix_point }}</p>
        <p class="width-50 mb-1">搭配风格： {{ collocationInfo.style }}</p>
        <p class="width-50 mb-1">适合体形： {{ collocationInfo.suit_figure }}</p>
        <p class="width-50 mb-1">销售卖点： {{ collocationInfo.mix_point1 }}</p>
        <p v-if="collocationInfo.productSkc" class="width-50 mb-1">
          搭配款号： {{ collocationInfo.productSkc.styleno }}
        </p>
        <p v-if="collocationInfo.productSkc" class="width-50 mb-1">
          搭配策划名称： {{ collocationInfo.productSkc.alias_name }}
        </p>
        <p v-if="collocationInfo.productSkc" class="width-50 mb-1">
          可销数量： {{ collocationInfo.productSkc.cansale_qty }}
        </p>
        <p v-if="collocationInfo.collocation_img" class="width-100 my-1">搭配图片:</p>
        <div v-if="collocationInfo.collocation_img" class="flex flex-wrap">
          <img
            v-for="(v, i) in collocationInfo.collocation_img"
            :key="i"
            :src="v.img_url"
            style="
              width: 100px;
              height: 100px;
              object-fit: cover;
              display: block;
            "
          />
        </div>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
export default {
  name: 'Home',
  components: {},
  data() {
    return {
      code: '',
      searchValue: '',
      type: '0', //0：通过款号搜索；1：通过策划名搜索；2：通过颜色搜索
      year: '',
      quarter: '',
      searchList: [],
      page: 1,
      searchTotal: 0,
      detail: {},
      collocationInfo: {},
      showCollocation: false,
      showSearchList: false,
      searchLoading: false,
      showSpin: false,
    };
  },
  watch: {
    $route: {
      handler: function (to) {
        let { code = '', type = '0' } = to.query;
        this.code = code;
        this.type = type;
        this.getProductInfo(code);
      },
      immediate: true,
    },
  },
  mounted() {
    window.addEventListener('click', this.blur);
  },
  beforeDestroy() {
    window.removeEventListener('click', this.blur);
  },
  methods: {
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
        .then(({ status, data, total = 0 }) => {
          this.searchLoading = false;
          if (status == 'success') {
            this.searchList = data.data || [];
            this.searchTotal = total;
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
    getProductInfo(code) {
      if (!code) return;
      this.blur();
      this.showSpin = true;
      this.$http.get(`/api/collocation/productInfoByCode/${code}`).then(({status, data}) => {
        this.showSpin = false;
        if (status == 'success') {
          this.detail = data;
        } else {
          this.detail = {};
        }
      }).catch((e) => {
        this.showSpin = false;
        this.searchList = [];
        console.log(e);
      });
    },
    getCollocationInfo(item) {
      this.showSpin = true;
      this.$http
        .get(
          `/api/collocation/collocationInfo?collocationCode=${item.mix_code}`
        )
        .then(({status, data, message}) => {
          this.showSpin = false;
          if (status == 'success') {
            this.collocationInfo = data;
            this.showCollocation = true;
          } else {
            this.$Message.error(message || '请求失败');
          }
        })
        .catch((e) => {
          this.showSpin = false;
          console.log(e);
        });
    },
  },
};
</script>

<style scoped>
.list-item {
  line-height: 1;
  cursor: pointer;
}
.list-item:hover {
  background-color: aliceblue;
}
.collocation-item {
  cursor: pointer;
  overflow: hidden;
}
.collocation-item:hover img {
  transition: 100ms ease;
  transform: scale(0.8);
}
</style>
