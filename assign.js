/* const sortedList = require("./SortedList.json");
const fs = require("fs/promises");

async function assign() {
  let IdList = sortedList;
  for (var i = 0; i < sortedList.length; i++) {
    IdList[i].id = Math.random() * (30 - 1) + 1;
  }
  fs.writeFile("IdList.json", JSON.stringify(IdList, null, "\t"));
}
module.exports = { assign };
 */

const fs = require("fs/promises");

async function assign() {
  try {
    const sortedList = require("./List_Sorted.json");

    let IdList = sortedList;
    for (let i = 0; i < sortedList.length; i++) {
      IdList[i].id = Math.random() * (30 - 1) + 1;
    }

    await fs.writeFile(
      "List_Sorted_ID.json",
      JSON.stringify(IdList, null, "\t")
    );
    console.log("----> Assignment completed 'Successfully'.");
  } catch (error) {
    console.error("Error during assign():", error);
  }
}
/* assign() */
module.exports = { assign };
