<template>
    <div class="land">
        <div class="form-wrap">
            <div class="metu-tab">
                <ul>
                    <li @click="toggleHigh(item.type)" :class="{'current':current_menu === item.type}" v-for="item in metuTab" :key="item.type">{{item.label}}</li>
                </ul>
            </div>
            <loginFrom  :currentType="current_menu"  @menu="currentMenu"/>
        </div>
    </div>
</template>
<script>
import loginFrom from '@c/loginForm'
export default {
    name:'Login',
    data(){
        return{
           metuTab:[{type:'login',label:"登录"},{type:'register',label:"注册"}],
           current_menu :'login' 
        }
    },
    components:{loginFrom},
    methods:{
        toggleHigh(type){
            this.current_menu = type;
        },
        currentMenu(value){
            this.current_menu = value;
        }
    }
}
</script>
<style lang="scss" scoped>
.land{
    height: 100vh;
    background-color: $main-color;
    .form-wrap{
        width: 300px;
        padding-top: 100px;
        margin: 0 auto;
        .metu-tab{
            margin-bottom: 20px;
            text-align: center;
            li{
                display: inline-block;
                padding: 10px 24px;
                margin: 0 10px;
                color: #fff;
                font-size: 14px;
                border-radius: 5px;
                cursor: pointer;
                &.current{
                    background-color: rgba(0,0,0,0.1);
                }
            }
        }
    }
}
</style>