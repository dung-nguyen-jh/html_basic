function findMostRepeatedIntegers(arr) {

    const counts = {};
    let maxCount = 0;
    let mostRepeatedIntegers = [];

    arr.forEach(num => {
        counts[num] = (counts[num] || 0) + 1;
        let count = counts[num];
        if (count > maxCount) {
            maxCount = count;
            mostRepeatedIntegers = [num];
        }
        else if (count === maxCount) {
            mostRepeatedIntegers.push(num);
        }
    });

    return mostRepeatedIntegers;
}

// const arr = [1, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 5,1,1,1,1,3,3];
const arr = [1,1,1,0,0,0,4,4,4,4]
console.log(findMostRepeatedIntegers(arr)); 