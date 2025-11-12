import _ from 'loadsh'

export function debounce(func, wait) {
    return _.debounce(func, wait)
}

export function fuzzyMatch(pattern, text) {
    // 使用正则表达式进行模糊匹配
    const regex = new RegExp(pattern.split('').map(char => char === '*' ? '.*' : char).join(''), 'i');
    return regex.test(text);
}