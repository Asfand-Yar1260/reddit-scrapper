const { posts } = require("./posts");
const { sort } = require("./sort");
const { id } = require("./id");
const { comments } = require("./comments");
const { commentFlags } = require("./commentFlags");

function main() {
  posts()
    .then(() => sort())
    .then(() => id())
    .then(() => comments())
    .then(() => commentFlags())
    .catch((error) => console.error(error))
    .finally(() => {
      console.log("----> All tasks completed! <----");
    });
}
//initiate the call to subsequent functions
main();
