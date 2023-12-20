const fs = require("fs/promises");

async function assign() {
  try {
    const sortedList = require("./jsons/List_Sorted.json");

    let IdList = sortedList;
    for (let i = 0; i < sortedList.length; i++) {
      IdList[i].id = Math.random() * (30 - 1) + 1;
    }

    await fs.writeFile(
      "jsons/List_Sorted_ID.json",
      JSON.stringify(IdList, null, "\t")
    );
    console.log("----> Assignment completed 'Successfully'.");
  } catch (error) {
    console.error("Error during assign():", error);
  }
}
/* assign(); */
module.exports = { assign };
