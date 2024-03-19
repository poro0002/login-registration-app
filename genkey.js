// you can generate a random key 
// this is just to make a code to store in the env jwt key that you will access in the app.js server file

let arr = new Array(30);

const key = [...arr].map((n)=> {
   return (Math.random() * 36 | 0).toString(36);
}).join("")

console.log(key)
