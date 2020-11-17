<template>
    <el-row>
        <el-col :span="12">
            <span class="menu-bth" @click="switchAside">
                <svg-icon icon="menuBtn" className="icon-menu-btn"></svg-icon>
            </span>
        </el-col>
        <el-col :span="12">
            <span class="logout" @click="logout">
                <svg-icon icon="logout" className="icon-logout"></svg-icon>
            </span>
            <div class="face-info">
                <img src="../../../assets/face.png" :alt="username">
                <span class="name">{{username}}</span>
            </div>
        </el-col>
    </el-row>
</template>
<script>
import { computed } from "@vue/composition-api"
export default {
    name:"LayoutAsite",
    components:{},
    props:{},
    setup(props,{root}){
        const switchAside = (()=>{root.$store.commit('app/SET_COLLAPSE');});
        console.log(root.$store)
        const username = computed(()=>root.$store.state.app.username);
        const logout = (()=>{
            root.$confirm('确认退出管理后台','提示',{
                confirmButtonText:"确认",
                cancelButtonText:'取消',
                type:'warning'
            }).then(()=>{
                root.$store.dispatch('app/logoutAction').then(response=>{
                    root.$message({
                        message:response.message,
                        type:'success'
                    })
                    root.$router.push({
                        name:"Login"
                    })
                })
            })
        })
        return  { switchAside,username, logout}
    }
}
</script>
<style lang="scss" scoped>
.menu-bth{
    display: inline-block;
    padding-top: 20px;
    cursor: pointer;
}
.logout{
    float:right;
    border-left: 1px solid #ededed;
    width: 75px;
    text-align: center;
    line-height: 75px;
    font-size: 25px;
    margin-right: 25px;
    cursor:pointer;
}
.face-info{
    float:right;
    padding: 18px 30px 0 0;
    img{
        display: inline-block;
        vertical-align: middle;
        border-radius: 100px;
        margin-right: 18px;
    }
}
</style>