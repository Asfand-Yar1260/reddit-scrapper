const { posts } = require("./posts");
const { sort } = require("./sort");
/* const { assign } = require("./assign");
const { comments } = require("./comments"); */

function main() {
  posts()
    .then(() => sort())
    /*     .then(() => assign())
    .then(() => comments()) */
    .catch((error) => console.error("Error:", error))
    .finally(() => {
      console.log("----> All tasks completed!");
    });
}

main();
