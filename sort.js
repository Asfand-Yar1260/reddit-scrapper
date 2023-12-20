/* const list = require("./List");
const fs = require("fs/promises");

function sort() {
  let sortedList = list.sort((a, b) => {
    if (a.Post.Engagement > b.Post.Engagement) {
      return -1;
    }
  });

  fs.writeFile("SortedList.json", JSON.stringify(sortedList, null, "\t"));
}
sort();
module.exports = { sort };
 */
const fs = require("fs/promises");

async function sort() {
  try {
    const list = require("./List.json");

    let sortedList = list.sort((a, b) => {
      if (a.Post.Engagement > b.Post.Engagement) {
        return -1;
      }
    });

    await fs.writeFile(
      "List_Sorted.json",
      JSON.stringify(sortedList, null, "\t")
    );
    console.log("----> Sorting completed 'Successfully'.");
  } catch (error) {
    console.error("Error during sort():", error);
  }
}

/* sort(); */
module.exports = { sort };
