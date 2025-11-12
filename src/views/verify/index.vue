<script setup>
import { ref, onMounted, watch, reactive } from 'vue'
import { showSuccessToast, showFailToast } from 'vant'
import { getVerifyQuestionList } from '@/api/verify'
import { setLocalStorage } from '@/utils/local'
import { useVerifyPassStore } from '@/store/verify'

defineProps({
    msg: String,
})

const showPopup = ref(true)
const verifyQuestionList = ref([])
const answers = ref([{ value: '' }, { value: '' }])
const verifyPassStore = useVerifyPassStore()

onMounted(() => {
    getVerifyQuestion()
})

const getVerifyQuestion = () => {
    getVerifyQuestionList().then(res => {
        verifyQuestionList.value = res;
    })
}

const onSubmit = () => {
    if (verifyQuestionList.value[0].answer == answers.value[0].value && verifyQuestionList.value[1].answer == answers.value[1].value) {
        showSuccessToast('回答正确')
        showPopup.value = false

        setLocalStorage('pass-verify', true)
        verifyPassStore.setIsPass(true)
    } else {
        showFailToast('回答错误')
    }
}

const onFailed = (err) => {
    console.log('err', err)
}
</script>
<template>
    <div class="verify-main">

        <van-dialog v-model:show="showPopup"  :showConfirmButton="false"
            width="90%" :style="{ padding: '0 20px' }">

            <div class="" style="text-align: center; margin: 5px;">
                <img style="width: 6rem;" src="../../assets/img/logo.png" />
            </div>

            <div class="title" style="font-weight: bold; margin-bottom: 5px;">为保护全班同学的隐私安全，本网页会进行2个基本问题的提问，请作答后访问。</div>
            <van-form @submit="onSubmit" @failed="onFailed" validate-trigger="onSubmit" label-width="100%">
                <van-cell-group inset>
                    <template v-for="(item, index) in verifyQuestionList">
                        <van-field :key="item.id" v-model="answers[index].value" v-if="item.type == 1"
                            :label="item.question" name="pattern" placeholder="请输入"
                            :rules="[{ required: true, message: '请输入正确答案' }]" />

                        <van-field :key="item.id" v-if="item.type == 2" name="radio" :label="item.question"
                            :rules="[{ required: true, message: '请选择正确答案' }]">
                            <template #input>
                                <van-radio-group v-model="answers[index].value" direction="horizontal">
                                    <van-radio v-for="(value, key) in item.options" :name="key"
                                        :style="{ paddingTop: '5px' }">{{ key + ': ' + value
                                        }}</van-radio>
                                </van-radio-group>
                            </template>
                        </van-field>
                    </template>

                </van-cell-group>
                <div style="margin: 16px;">
                    <van-button round block type="primary" native-type="submit">
                        提交
                    </van-button>
                </div>
            </van-form>
        </van-dialog>
    </div>
</template>

<style scoped lang="scss">
.verify-main {
    height: 100vh;

}

.search-main {
    position: absolute;
    z-index: 1;
    width: 100%;
}

.search-input {

    // position: absolute;
    // z-index: 1;
    // width: 100%;
}
</style>

<style lang="scss">
.marker {
    display: block;
    width: 40px;
    height: 40px;

    img {
        width: 100%;
        height: 100%;
    }

    .avatar {
        border-radius: 50%;
    }

    .frame {
        position: absolute;
        left: -5%;
        bottom: -2%;
        width: 120%;
        height: 120%;
    }
}

.amap-marker-label {
    background: transparent;
    border-color: transparent;

    .alumni-info {
        font-size: 14px;
        font-weight: 400;

        color: #ffaa00;
        position: relative;
        z-index: 0;
        line-height: 16px;

        &::after {
            content: attr(data-content);
            -webkit-text-stroke: 1.5px #fff;
            position: absolute;
            left: 0;
            top: 0;
            z-index: -1;
            width: 100%;
        }
    }

    .active {
        text-align: center;
    }

}


.play_drop {
    width: 50px;
    height: 50px;
    -webkit-animation: shake 1s infinite;
    will-change: transform;
    animation: shake 1s infinite;
}

@keyframes shake {

    0%,
    100% {
        transform: translateX(0) rotate(0deg);
    }

    25% {
        transform: translateX(-5px) rotate(-5deg);
    }

    50% {
        transform: translateX(5px) rotate(5deg);
    }

    75% {
        transform: translateX(-5px) rotate(-5deg);
    }
}
</style>
