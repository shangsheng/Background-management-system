<template>
    <div class="verifcation">
        <el-button type="success" @click="getCode" :disabled="codeDisabled" :loading="codeLoading">{{codesText}}</el-button>
    </div>
</template>
<script>
export default {
    data(){
        return{}
    },
    props:{
        'codesText':{
            type:String,
            default:'',
        },
        "getCodeFn":{
            type:Function,
            default:''
        },
        "codeDisabled":{
            type:Boolean,
            default:''
        },
        "codeLoading":{
            type:Boolean,
            default:''
        }
    },
    methods:{
        getCode(){
            if (this.getCodeFn) {
                this.getCodeFn();
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.verifcation{
    position: absolute;
    top: 0px;
    right: 0;
}
</style>