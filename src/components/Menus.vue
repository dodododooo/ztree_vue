<template>
  <div class="Menus height-100" style="overflow-y: auto">
    <div id="z-tree-menu" class="ztree width-100 height-100"></div>
  </div>
</template>

<script>
let zTreeObj;
let $ = window.$;
export default {
  name: 'Menus',
  components: {},
  data() {
    return {
      currentNode: '',
    };
  },
  created() {
    this.getMenus();
  },
  methods: {
    getMenus() {
      let vm = this;
      this.$http
        .get('/api/collocation/goodsClassify')
        .then(({ status, data }) => {
          if (status == 'success') {
            let menus = data.map(v => {
              let {id, name, type_tree = []} = v;
              return {
                id,
                name,
                children: type_tree.map(v2 => {
                  v2.children = [];
                  return v2;
                }),
              }
            });
            let setting = {
              view: {
                showIcon: false,
                showLine: true,
              },
              data: {
                keep: {
                  leaf: true,
                }
              },
              callback: {
                onClick: function (e, tid, tnode) {
                  if (tnode.isParent) {
                    zTreeObj.expandNode(tnode);
                    if (tnode.level == 1 && tnode.children.length == 0) {
                      vm.getList(tnode);
                    }
                  } else if (vm.currentNode != tnode.styleno) {
                    vm.currentNode = tnode.styleno;
                    vm.$router.push({name: 'Home', query: {type: '0', searchValue: tnode.styleno}})
                  }
                }
              }
            };
            zTreeObj = $.fn.zTree.init($("#z-tree-menu"), setting, menus);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getList(tnode) {
      this.$http
        .get(`/api/collocation/productByType/${tnode.id}`)
        .then(({ status, data }) => {
          if (status == 'success') {
            let nodes = data || [];
            nodes.forEach(v => {
              v.name = v.styleno;
            });
            zTreeObj.addNode(tnode, nodes);
          }
        }).catch(e => {
          console.log(e)
        })
    },
  },
};
</script>
<style>
.ztree li a {
  padding: 1px 3px 0 0;
  margin: 0;
  cursor: pointer;
  height: 24px;
  color: #ddd;
  background-color: transparent;
  text-decoration: none;
  vertical-align: top;
  display: inline-block;
}
#z-tree-menu * {
  font-family: -apple-system, '微软雅黑';
  font-size: 16px;
}
#z-tree-menu li a.curSelectedNode {
    padding: 1px 3px 0 0;
    height: 24px;
    border: none;
    color: #fff;
    background: transparent;
    opacity: 1;
    font-weight: 700;
}
#z-tree-menu li a:hover {
    text-decoration: none;
}
</style>