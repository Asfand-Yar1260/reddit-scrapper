const { posts } = require("./posts");
const { sort } = require("./sort");
const { id } = require("./id");
const { comments } = require("./comments");
const { comment_flags } = require("./comment_flags");

function main() {
  posts()
    .then(() => sort())
    .then(() => id())
    .then(() => comments())
    .then(() => comment_flags())
    .catch((error) => console.error("Error:", error))
    .finally(() => {
      console.log("----> All tasks completed!");
    });
}

main();
