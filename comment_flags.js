const fs = require("fs/promises");

async function comment_flags() {
  try {
    var li = require("./jsons/List_Comments.json");
    // moving through the post indexes

    for (let i = 0; i < li.length; i++) {
      // moving through comments
      for (let j = 0; j <= li[i].Comments.length; j++) {
        if (
          li[i].Comments[j] &&
          li[i].Comments[j].Comment &&
          li[i].Comments[j].Comment.length < 250
        ) {
          li[i].Comments.splice(j, 1);
          j--;
        }
      }
      await fs.writeFile(
        "jsons/List_Filtered_Comments.json",
        JSON.stringify(li, null, "\t")
      );
    }
    console.log("----> Flags checked 'Successfully'.");
  } catch (error) {
    console.error("Error during comment_flags():", error);
  }
}

/* comment_flags(); */
module.exports = { comment_flags };
