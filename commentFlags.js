// importing dependencies
const fs = require("fs/promises"); // to call function asynchronously.

async function commentFlags() {
  try {
    // getting current date.
    const currentDate = new Date()
      .toISOString()
      .replace(/:/g, "-")
      .slice(0, -14);

    // File path for the initial data
    const filePath = `jsons/${currentDate}/id_Sorted_List_Comments${currentDate}.json`;

    // Read the initial data file
    const list = JSON.parse(await fs.readFile(filePath, "utf-8"));

    // moving through the post indexes
    for (let i = 0; i < list.length; i++) {
      // moving through comments
      for (let j = 0; j <= list[i].Comments.length; j++) {
        if (
          list[i].Comments[j] &&
          list[i].Comments[j].Comment &&
          list[i].Comments[j].Comment.length < 250
        ) {
          list[i].Comments.splice(j, 1);
          j--;
        }
      }
      await fs.writeFile(
        `jsons/${currentDate}//List_Filtered_Comments${currentDate}.json`,
        JSON.stringify(list, null, "\t")
      );
    }
    console.log("----> Flags filtering Complete. <----");
  } catch (error) {
    console.log(error);
  }
}

// Call the function to initiate the filtering process
/* commentFlags(); */

// exporting the module
module.exports = { commentFlags };
