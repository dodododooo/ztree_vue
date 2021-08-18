<template>
  <div class="layout">
    <Layout class="height-100">
      <Sider width="200">
        <menus></menus>
      </Sider>
      <Layout>
        <Content class="pa-2 bg-gray">
          <div class="pa-2 border-radius bg-white width-100 height-100">
            <router-view></router-view>
          </div>
        </Content>
        <!-- <Footer>Footer</Footer> -->
      </Layout>
    </Layout>
  </div>
</template>

<script>
import menus from './components/Menus.vue'
export default {
  name: 'App',
  components: {menus},
}
</script>

<style>
.layout {
  height: 100%;
}
</style>
