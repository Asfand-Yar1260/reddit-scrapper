import { posts } from "./posts.js";
import { sort } from "./sort.js";
import { id } from "./id.js";
import { comments } from "./comments.js";
import { commentFlags } from "./commentFlags.js";

export function main() {
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

main();
