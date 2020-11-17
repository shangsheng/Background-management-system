<template>
    <div>
        <h1 class="logo"><img src="../../../assets/logo.png" alt="" :class="{'mini-logo':collapse}"></h1>
        <el-menu
      :default-active="defaultActive"
      class="el-menu-vertical-demo"
      :collapse="collapse"
      router 
      unique-opened
      background-color="#344a5f"
      text-color="#fff"
      active-text-color="#fff">
      <template v-for="(item,index) in router">
          <el-submenu v-if="!item.hidden" :key="item.id" :index="index+''">
            <template slot="title">
            <svg-icon :hidden="!collapse" :icon="item.meta.icon" :className="item.meta && item.meta.iconClass"></svg-icon>
            <span>{{item.meta?item.meta.title:""}}</span>
            </template>
            <template v-if="item.children && item.children.length>0">
                <el-menu-item v-for="sub in item.children" :key="sub.id" :index="sub.path">
                    {{sub.meta?sub.meta.title:""}}
                </el-menu-item>
            </template>
            
        </el-submenu>
      </template>
      
    </el-menu>
    </div>
</template>
<script>
import { reactive,computed} from "@vue/composition-api";
export default {
    name:"Aside",
    components:{},
    props:{},
    setup(props,{root}){
        const router = reactive(root.$router.options.routes);
        /**
         * 监听路由变化
         */
        const defaultActive = computed(()=>{
            const route = root.$route;
            return route.path;
        })
        /**
         * 菜单
         */
        const collapse = computed(()=>root.$store.state.app.collapse);
        //监听
        //watch(xxx,()=>{})
        //生命周期
        //onBeforeMount(()=>{})
        //onMounted(()=>{})
        //onBeforeUpdate(()=>{})
        //onUpate(()=>{})
        //onBeforeUnmount(()=>{})
        //onUnmount(()=>{})
        //onErrorCaptured(()=>{})
        //onRenderTracked(()=>{})
        //onRenderTriggered(()=>{})

        return {router,defaultActive,collapse}
    }
}
</script>
<style lang="scss" scoped>
    .logo{
        img{
            margin: auto;
            height: 113px;
            @include webkit(transition,all .3s ease 0s);
        }
        .mini-logo{height:50px}
    }
</style>