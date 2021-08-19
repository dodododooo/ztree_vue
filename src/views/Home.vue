<template>
  <div class="home relative">
    <Spin v-if="showSpin" size="large" fix></Spin>
    <div class="flex space-between">
      <h2 class="title ml-2">产品基本信息</h2>
      <Search @itemClick="itemClick"></Search>
    </div>
    <p v-if="!detail.styleno" class="py-10 color-gray text-center">没有内容</p>
    <template v-else>
      <div class="flex pa-3">
        <div class="flex flex-wrap mr-4">
          <p class="width-50 mb-1">款号： {{ detail.styleno || '暂无'}}</p>
          <p class="width-50 mb-1">策划名称： {{ detail.alias_name || '暂无'}}</p>
          <p class="width-50 mb-1">面料名称： {{ detail.material_name || '暂无'}}</p>
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
          <p class="width-100 mb-1 mt-2">可售明细： {{ detail.cansale_str || '暂无'}}</p>
          <p class="width-100 mb-1">在途明细： {{ detail.onway_str || '暂无'}}</p>
          <p class="width-100 mb-1">洗水说明： {{ detail.wash_instruction || '暂无'}}</p>
        </div>
        <img
          :src="detail.productImg"
          class="mr-5"
          style="
            width: 200px;
            height: 200px;
            object-fit: cover;
            display: block;
          "
        />
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
    <Modal v-model="showCollocation" width="70" :styles="{top: '20px'}">
      <div slot="header">{{ collocationInfo.mix_code }}</div>
      <div class="px-2 flex align-start">
        <div class="flex flex-wrap flex-item pt-1 mr-2">
          <p class="width-50 mb-1">搭配编号： {{ collocationInfo.mix_code || '暂无'}}</p>
          <p class="width-50 mb-1">搭配卖点： {{ collocationInfo.mix_point || '暂无'}}</p>
          <p class="width-50 mb-1">搭配风格： {{ collocationInfo.style || '暂无'}}</p>
          <p class="width-50 mb-1">适合体形： {{ collocationInfo.suit_figure || '暂无'}}</p>
          <p class="width-50 mb-1">销售卖点： {{ collocationInfo.mix_point1 || '暂无'}}</p>
        </div>
        <Table
          v-if="collocationInfo.productSkc"
          :data="collocationInfo.productSkc"
          :columns="columns"
          width="400px"
          max-height="500px"
          size="small"
          border
          style="flex-shrink: 0"
        ></Table>
      </div>
      <p v-if="collocationInfo.collocation_img" class="width-100 my-1">搭配图片:</p>
      <div v-if="collocationInfo.collocation_img" class="flex flex-wrap">
        <img
          v-for="(v, i) in collocationInfo.collocation_img"
          :key="i"
          :src="v.img_url"
          class="mr-1 mb-1"
          style="
            width: 100px;
            height: 100px;
            object-fit: cover;
            display: block;
          "
        />
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
import Search from '../components/Search.vue';
export default {
  name: 'Home',
  components: {Search},
  data() {
    return {
      code: '',
      detail: {},
      columns: [
        {key: 'styleno', title: '款号', width: 240},
        {key: 'alias_name', title: '策划名称', width: 200},
        {key: 'cansale_qty', title: '可销数量', width: 90},
      ],
      collocationInfo: {},
      showCollocation: false,
      showSpin: false,
    };
  },
  watch: {
    $route: {
      handler: function (to) {
        let { code = '' } = to.query;
        this.code = code;
        this.getProductInfo(code);
      },
      immediate: true,
    },
  },
  methods: {
    itemClick({code}) {
      this.getProductInfo(code);
    },
    getProductInfo(code) {
      if (!code) return;
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
.collocation-item {
  cursor: pointer;
  overflow: hidden;
}
.collocation-item:hover img {
  transition: 100ms ease;
  transform: scale(0.8);
}
</style>
