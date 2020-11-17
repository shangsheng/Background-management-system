<template>
    <div class="from">
        <el-form ref="form" :model="form" :rules="form_rules">
            <el-form-item label="用户名">
                <el-input v-model="form.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="form.password" type="password"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" v-show="currentType === 'register'">
                <el-input v-model="form.passwords" type="password"></el-input>
            </el-form-item>
            <el-form-item label="验证码" class="codes">
                 <codeButtom :codesText="code_text" :getCodeFn="getCodeFn" :codeDisabled="code_disabled" :codeLoading="code_loading"/>
                <el-input v-model="form.code"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="danger" :disabled="submit_disabled" @click="submitForm('form')">{{currentType === 'login'?'登录':'注册'}}</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import codeButtom from './Verification';
import sha1 from 'js-sha1';
import { reactive , ref , set } from "@vue/composition-api";
import { validate_email, validate_password } from "@/utils/validate";
import { GetCode,Register, Login } from "@/api/login";
import { mapStat } from "vuex";
export default {
    name:"Login",
    props: {
        'currentType':{
            type:String,
            default:'login',
        },
    },
    components:{codeButtom},
    methods: {
      onSubmit() {
        console.log('submit!');
      },
    },
    setup(props,{root,refs}){
        console.log(props)
        const form = reactive({
                name: "",
                password: "",
                passwords: "",
                code: ""
        })
        let code_text = ref("获取验证码");
        let code_loading = ref(false);
        let code_disabled = ref(false);
        let timer = ref(null);
        let submit_disabled =  ref(true);
        /**
         * 自定义检验规则
         */
        //检验邮箱
        const validate_name_rules = (rule,value,callback)=>{
            let regEmail = validate_email(value);
            if(value === ""){
                callback(new Error("请输入邮箱"));
            }else if(!regEmail){
                callback(new Error("邮箱格式不正确"));
            }else{
                callback();
            }
        };
        //检验密码
        const validate_password_rules = (rule,value,callback)=>{
            let regPassword = validate_password(value);
            let passwords_value = form.passwords;
            if(value === ""){
                callback(new Error("请输入密码"));
            }else if(!regPassword){
                callback(new Error("请输入>=6并且<=20位的密码，包含数字、字母"));
            }else if(passwords_value && passwords_value !== value){
                callback(new Error("两次密码不一致，请重新输入"));
            }else{
                callback();
            }
        }
        //检验确认密码
        const validate_passwords_rules = (rule,value,callback)=>{
            let password_value = form.password;
            if(props.currentType === "login"){
                callback();
                return false;
            }
            if(value == ""){
                callback(new Error("请输入确认密码"));
            }else if(password_value !== value){
                callback(new Error("两次密码不一致，请重新输入"));
            }else{
                callback();
            }
        };
        //检验验证码
        const validate_code_rules = (rule,value,callback)=>{
            if(value === ""){
                callback(new Error("请输入验证码"));
            }else if(value.length !== 6){
                callback(new Error("请输入长度为6位数的验证码"));
            }else{
                callback();
            }
        };
        //检验规则
        const form_rules = reactive({
            name:[
                {validator:validate_name_rules,trigger:'blur'}
            ],
            password:[
                {validator:validate_password_rules,trigger:'blur'}
            ],
            passwords:[
                {validator:validate_passwords_rules,trigger:'blur'}
            ],
            code:[
                {validator:validate_code_rules,trigger:'blur'}
            ]
        });
        //倒计时
        const countDown = ((number)=>{
            let second = number;
            //禁用按钮
            code_disabled.value = true;
            //按钮文本
            code_text.value = `倒计进${second}秒`;
            timer = setInterval(()=>{
                second--;
                code_text.value = `倒计进${second}秒`;
                if(second<0){
                    code_text = `倒计进${second}秒`;
                    //启用按钮
                    code_disabled.value = false;
                    clearInterval(timer);
                }
            },1000);
        });
        //获取验证码方法
        const getCodeFn = (()=>{
            if(form.name === ""){
                root.$message.error("邮箱不能为空！！");
                return false;
            }
            if(!validate_email(form.name)){
                root.$message({
                    message:"邮箱格式有误，请重新输入！！",
                    type:"error"
                });
                return false;
            }
            let requestData={
                username: form.name,
                module:props.currentType
            }
            code_text.value = "发送中";
            code_loading.value = true;
            console.log(requestData)
            GetCode(requestData).then(response=>{
                console.log(response)//这里打印拦截器返回的信息，response是自定义参数
                root.$message({
                    message:response.message,
                    type:"success"
                })
                //激活按钮
                submit_disabled.value = false;
                //清除加载
                code_loading.value = false;
                //执行倒计时
                countDown(60);
            }).catch(error=>{
                code_text.value = "重新获取";
                code_loading.value = false;
            })
        })
        //提交表单
        const submitForm = (formName=>{
            refs[formName].validate((valid)=>{
                //表单验证通过
                if(valid){
                    //三元运算
                    props.currentType === 'login' ? login():register()
                }else{
                    console.log('error submit!!');
                    return false;
                }
            })
        });
        //登录
        const login = (()=>{
            const requestData={
                username:form.name,
                password:sha1(form.password),
                code:form.code
            }
            console.log(requestData)
           root.$store.dispatch('app/loginAction',requestData).then(response=>{
               console.log(response)
                root.$message({
                    message:response.message,
                    type:'success'
                })
                //页面跳转
                root.$router.push({name:'Home'})
            }).catch(error=>{
                //重置数据
                console.log(error)
                reset();
            });
             /*Login(requestData).then(response=>{
                root.$message({
                    message:response.message,
                    type:'success'
                })
                //页面跳转
                root.$router.push({name:'Home'})
            }).catch(error=>{
                //重置数据
                reset();
            });*/
        });
        //注册
        const register = (()=>{
            const requestData={
                username:form.name,
                password:sha1(form.password),
                code:form.code
            }
            Register(requestData).then(response=>{
                root.$message({
                    message:response.message,
                    type:'success'
                })
                //重置数据
                reset();
            }).catch(error=>{
                //重置数据
                reset();
            })
        });
        //重置
        const reset = (()=>{
            //重置表单
            refs['form'].resetFields();
            //修改模块
            props.currentType = "login";
            //判断定时器是否存在，存在则清除
            if(timer) {clearInterval(timer)};
            //还原获取验证码按钮状态
            code_disabled.value = false;
            code_text.value = "获取验证码";
        })
        return {form,code_text,code_loading,code_disabled,submit_disabled,getCodeFn,
        submitForm,login,register,form_rules};
    },
  watch:{
      "currentType":{
           handler(newName, oldName) {
               console.log(newName)
                this.$emit("menu",newName)
           }
      }
  }
}
</script>
<style lang="scss" >
 .from{
    .el-form-item__label {
       display: block;
        color: #fff;
        font-size: 14px;
        float:initial;
        text-align: left;
    }
    .codes .el-input{
        width: 150px;
    }
    .el-button{
        width: 100%;
    }
 }
   
</style>