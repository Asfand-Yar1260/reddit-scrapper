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
    .catch((error) => console.error("Error:", error))
    .finally(() => {
      console.log("----> All tasks completed!");
    });
}

/* main(); */

// exporting the module
module.exports = { main };
