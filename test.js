const doSth = (input) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(input);
      resolve(input);
    }, 0);
  });
};

const testArray = [1, 2, 3, 4, 5];

const foo = async () => {
  testArray.forEach(async (item) => {
    console.log("foo");
    await doSth(item);
  });
};

const bar = async () => {
  setTimeout(() => {
    console.log("ben tren");
    foo();
  },0);
  for (const item of testArray) {
    console.log("bar");
    await doSth(item);
  }
  setTimeout(async () => {
    console.log("ben duoi");
    await foo();
  });
  await new Promise((resolve) => {
    console.log("new promise bottom");
    resolve();
  });
};

// foo();
// console.log('---');
bar();

// Output:
//bar
//ben tren
//foo
//foo
//foo
//foo
//foo
//1

//2
//3
//4
//5
//bar
//2
//bar
//3
//bar
//4
//bar
//5
//ben duoi
//new promise bottom
//foo
//foo
//foo
//foo
//foo
//1
//2
//3
//4
//5
