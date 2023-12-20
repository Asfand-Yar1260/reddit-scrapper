const fs = require("fs/promises");

async function sort() {
  try {
    const list = require("./jsons/List.json");

    let sortedList = list.sort((a, b) => {
      if (a.Post.Engagement > b.Post.Engagement) {
        return -1;
      }
    });

    await fs.writeFile(
      "jsons/List_Sorted.json",
      JSON.stringify(sortedList, null, "\t")
    );
    console.log("----> Sorting completed 'Successfully'.");
  } catch (error) {
    console.error("Error during sort():", error);
  }
}

/* sort(); */
module.exports = { sort };
