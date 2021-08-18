<template>
  <div class="home">
    <div class="flex space-between">
      <h2 class="title">产品基本信息</h2>
      <div class="flex start">
        <Select
          v-model="type"
          @on-change="searchTypeChange"
          slot="prepend"
          style="width: 100px"
          class="mr-1"
        >
          <Option value="0">款号</Option>
          <Option value="1">策划名</Option>
          <Option value="2">颜色</Option>
        </Select>
        <AutoComplete
          v-model="searchValue"
          style="width: 400px"
        >
          <div v-if="type == 2" style="height: 400px; position: relative">
            <Spin v-if="searchLoading" size="large" fix></Spin>
            <p
              v-else-if="searchList.length == 0"
              class="py-10 color-gray text-center"
            >
              没有结果
            </p>
            <template v-else>
              <ul class="pa-2">
                <li class="mb-1 color-gray flex">
                  <p style="width: 40px" class="pl-1">#</p>
                  <p style="width: 164px">款号</p>
                  <p style="width: 164px">策划名称</p>
                </li>
                <router-link
                  tag="li"
                  v-for="(item, index) in searchList"
                  :key="index"
                  :to="{
                    name: 'Home',
                    query: { type: '0', searchValue: item.styleno },
                  }"
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
                    {{ item.alias_name }}
                  </p>
                </router-link>
              </ul>
              <div
                class="px-3"
                style="position: absolute; bottom: 10px; left: 0"
              >
                <Page
                  @on-change="searchPageChange"
                  :current.sync="searchPage"
                  :total="searchTotal"
                  size="small"
                  show-total
                />
              </div>
            </template>
          </div>
        </AutoComplete>
        <Button @click="search" :loading="searchLoading" class="mx-1" type="primary">搜索</Button>
      </div>
    </div>
    <p v-if="!detail.styleno" class="py-10 color-gray text-center">没有内容</p>
    <template v-else>
      <div class="pa-3 flex flex-wrap">
        <p class="width-50 mb-1">款号： {{ detail.styleno }}</p>
        <p class="width-50 mb-1">策划名称： {{ detail.alias_name }}</p>
        <p class="width-50 mb-1">一级分类： {{ detail.oneLevelType }}</p>
        <p class="width-50 mb-1">二级分类： {{ detail.secondLevelType }}</p>
        <p class="width-50 mb-1">
          二级分类id： {{ detail.second_category_id }}
        </p>
        <p class="width-50 mb-1">面料名称： {{ detail.material_name }}</p>
        <p class="width-50 mb-1">洗水说明： {{ detail.wash_instruction }}</p>
        <p class="width-50 mb-1">是否含配件： {{ detail.include_parts }}</p>
        <p class="width-50 mb-1">设计卖点： {{ detail.design_point }}</p>
        <p class="width-50 mb-1">销售卖点： {{ detail.sell_point }}</p>
        <p class="width-50 mb-1">可销数量： {{ detail.cansale_qty }}</p>
        <p class="width-50 mb-1">在途数量： {{ detail.onway_qty }}</p>
        <p class="width-100 mb-1">可售明细： {{ detail.cansale_str }}</p>
        <p class="width-100 mb-1">在途明细： {{ detail.onway_str }}</p>
        <p class="width-100 my-1">产品图片:</p>
        <div class="flex flex-wrap">
          <img
            v-for="(v, i) in detail.product_skc"
            :key="i"
            :src="v.skc"
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
          v-if="!skc_collocation_image.length"
          class="py-10 color-gray text-center"
        >
          没有内容
        </p>
        <div v-else class="flex flex-wrap">
          <div
            v-for="(v, i) in skc_collocation_image"
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
      searchValue: '',
      type: '0', //0：通过款号搜索；1：通过策划名搜索；2：通过颜色搜索
      searchList: [],
      searchLoading: false,
      searchPage: 1,
      searchTotal: 0,
      detail: {
        // styleno: 'W120A11002', //款号
        // alias_name: '这是策划名称',
        // second_category_id: '2',
        // material_name: '丝绸', //面料名称
        // wash_instruction: '洗水说明',
        // include_parts: '0', //是否含配件
        // design_point: '设计卖点',
        // sell_point: '销售卖点',
        // cansale_qty: '100', //可销数量
        // onway_qty: '50', //在途数量
        // cansale_str: '可售明细', //此结果可能比较长，尽量在一行显示
        // onway_str: '在途明细', //此结果可能比较长，尽量在一行显示
        // secondLevelType: '风衣1', //二级分类
        // oneLevelType: '风衣', //一级分类
        // product_skc: [
        //   {
        //     skc: 'http://localhost/r/images/gallery/image1.jpg', //产品图片地址
        //     styleno: 'W120A11002',
        //     color: '黑色',
        //     skc_collocation_image: [
        //       {
        //         mix_code: 'dp001', //搭配编号
        //         img_url: '图片地址',
        //         img_name: 'img_name',
        //         main_img: '1',
        //         pivot: {
        //           skc: '123',
        //           mix_code: 'dp001',
        //         },
        //       },
        //     ],
        //   },
        // ],
      },
      skc_collocation_image: [
        // {
        //   mix_code: 'dp001', //搭配编号
        //   img_url: 'http://localhost/r/images/gallery/image1.jpg',
        //   img_name: 'img_name',
        //   main_img: '1',
        //   pivot: {
        //     skc: '123',
        //     mix_code: 'dp001',
        //   },
        // },
      ],
      collocationInfo: {
        // mix_code: 'dp001', //搭配编号
        // mix_point: '搭配卖点',
        // style: '搭配风格',
        // suit_figure: '适合体型',
        // mix_point1: '销售卖点',
        // productSkc: [
        //   {
        //     styleno: 'W120A11002', //款号
        //     alias_name: '这是策划名称',
        //     cansale_qty: '100', //可销数量
        //   },
        // ],
        // collocation_img: [
        //   {
        //     mix_code: 'dp001',
        //     img_url: '图片地址',
        //     img_name: 'img_name',
        //     main_img: '1',
        //   },
        // ],
      },
      showCollocation: false,
    };
  },
  watch: {
    $route: {
      handler: function (to) {
        let { searchValue = '', type = '0' } = to.query;
        this.searchValue = searchValue;
        this.type = type;
        if (searchValue) this.search();
      },
      immediate: true,
    },
  },
  methods: {
    searchPageChange() {
      this.search();
    },
    searchTypeChange() {
      this.searchPage = 1;
      this.searchList = [];
      this.searchValue = '';
    },
    search() {
      let { type, searchValue, searchPage = 1 } = this;
      if (!searchValue) {
        this.$Message.error('请输入搜索内容');
        this.searchLoading = false;
        this.searchList = [];
        return;
      }
      this.searchLoading = true;
      let params = { type, searchValue };
      if (type == 2) params.searchPage = searchPage;
      this.$http
        .post('/api/collocation/infoBySearch', params)
        .then(({ status, data, total = 0 }) => {
          this.searchLoading = false;
          if (status == 'success') {
            if (type == 2) {
              this.searchList = data.data || [];
              this.searchTotal = total;
            } else {
              this.detail = data;
              this.skc_collocation_image = [];
              data.product_skc.forEach((v) => {
                v.skc_collocation_image.forEach((m) => {
                  this.skc_collocation_image.push(m);
                });
              });
            }
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
    getCollocationInfo(item) {
      this.$Spin.show();
      this.$http
        .get(
          `/api/collocation/collocationInfo?collocationCode=${item.mix_code}`
        )
        .then(({status, data, message}) => {
          this.$Spin.hide();
          if (status == 'success') {
            this.collocationInfo = data;
            this.showCollocation = true;
          } else {
            this.$Message.error(message || '请求失败');
          }
        })
        .catch((e) => {
          this.$Spin.hide();
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
