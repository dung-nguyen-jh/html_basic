
const removeDuplicatedElementsUsingFilter = (arr) => {
    return arr.filter((element, index) => arr.indexOf(element) === index);
}

const removeDuplicatedElementsUsingSetConvert = (arr) => {
    return [...new Set(arr)];
}

const removeDuplicatedElementsUsingIteration = (arr) => {
    const result = [];
    arr.forEach((element) => {
        if (!result.includes(element)) {
            result.push(element);
        }
    });
    return result;
}

const removeDuplicateUsingRememberObject = (arr) => {
    const remember = {}
    const result = []
    arr.forEach((element)=>{
        if(!remember[element]){
            result.push(element)
            remember[element]=true
        }      
    })
    return result
}



// const arr = [1, 2,2, 3,3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const arr = [5,5,5,1,2,2,3,3,5,5,8,8,3,3,9,9,1,1];
console.log(removeDuplicateUsingRememberObject(arr)); // [1, 2, 3, 4, 5, 6, 7, 8, 9]