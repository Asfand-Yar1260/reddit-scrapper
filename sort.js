//importing dependencies
import fs from "fs/promises"; // to call function asynchronously.

export async function sort() {
  try {
    //checking if the file exists
    const currentDate = new Date()
      .toISOString()
      .replace(/:/g, "-")
      .slice(0, -14);
    const filePath = `jsons/${currentDate}/List_${currentDate}.json`;

    //reading the file
    let unsortedData = [];
    const fileContent = await fs.readFile(filePath, "utf-8");
    unsortedData = JSON.parse(fileContent);

    //sorting data
    let sortedData = unsortedData.sort((a, b) => {
      if (parseInt(a.Post.Engagement) > parseInt(b.Post.Engagement)) {
        return -1;
      }
    });

    //creating new file for sorted data
    const newFilePath = `jsons/${currentDate}/Sorted_List_${currentDate}.json`;
    await fs.writeFile(newFilePath, JSON.stringify(sortedData, null, "\t"));
    console.log("Sorting Complete.");
  } catch (error) {
    console.log("Error during sort.");
    console.error(error);
  }
}

/* sort(); */
