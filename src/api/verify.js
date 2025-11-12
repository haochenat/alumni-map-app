import { get } from '../utils/request';

export const getVerifyQuestionList = async () => {
    let allList = await get('/data/verify-question.json');

    let newList = allList.slice();

    if (newList.length < 2) {
        throw new Error("数组中至少需要两个元素");
    }

    let index1 = Math.floor(Math.random() * newList.length);
    let index2 = index1;

    // 确保第二个索引与第一个索引不同
    while (index2 === index1) {
        index2 = Math.floor(Math.random() * newList.length);
    }

    return [newList.splice(index1, 1)[0], newList.splice(index2 - 1, 1)[0]]; // 注意：这里需要调整索引以匹配新的数组长度


    // function getRandomTwoElements(arr) {
    //     if (arr.length < 2) {
    //         throw new Error("数组中至少需要两个元素");
    //     }

    //     let index1 = Math.floor(Math.random() * arr.length);
    //     let index2 = index1;

    //     // 确保第二个索引与第一个索引不同
    //     while (index2 === index1) {
    //         index2 = Math.floor(Math.random() * arr.length);
    //     }

    //     return [arr.splice(index1, 1)[0], arr.splice(index2 - 1, 1)[0]]; // 注意：这里需要调整索引以匹配新的数组长度
    // }

    // const myArray = [1, 2, 3, 4, 5];
    // const [element1, element2] = getRandomTwoElements(myArray.slice()); // 使用slice()复制数组以避免修改原数组
    // console.log(element1, element2);
}