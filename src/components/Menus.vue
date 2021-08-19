<template>
  <div class="Menus height-100" style="overflow-y: auto">
    <Menu theme="dark" accordion>
      <Submenu v-for="(item1, index1) in menus" :key="index1" :name="`${index1}`">
        <template slot="title">{{item1.name}}</template>
        <template v-if="item1.type_tree">
          <Submenu v-for="(item2, index2) in item1.type_tree" :key="index2" :name="`${index1}-${index2}`">
            <template slot="title">{{item2.name}}</template>
            <template v-if="item2.type_tree">
              <MenuItem
                v-for="(item3, index3) in item2.type_tree"
                :key="index3"
                :name="`${index1}-${index2}-${index3}`"
                :to="{name: 'List', query: {id: item3.id, name: item3.name}}"
              >
                {{item3.name}}
              </MenuItem>
            </template>
          </Submenu>
        </template>
      </Submenu>
    </Menu>
  </div>
</template>

<script>
export default {
  name: 'Menus',
  components: {},
  data() {
    return {
      menus: [],
    };
  },
  created() {
    this.getMenus();
  },
  methods: {
    getMenus() {
      this.$http
        .get('/api/collocation/goodsClassify')
        .then(({ status, data }) => {
          if (status == 'success') {
            this.menus = data || [];
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
};
</script>
<style>

</style>