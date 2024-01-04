//importing dependencies
const fs = require("fs/promises");
const uuid = require("uuid"); // to generate unique ids

async function id() {
  try {
    //checking if the file exists
    const currentDate = new Date()
      .toISOString()
      .replace(/:/g, "-")
      .slice(0, -14);
    const filePath = `jsons/${currentDate}/Sorted_List_${currentDate}.json`;

    //reading the file
    let sortedList = [];
    const fileContent = await fs.readFile(filePath, "utf-8");
    sortedList = JSON.parse(fileContent);

    //assigning a unique id key-value pair to each post
    for (let i = 0; i <= 99; i++) {
      sortedList[i].id = uuid.v4();
    }

    //creating new file for sorted data
    const newFilePath = `jsons/${currentDate}/Id_Sorted_List_${currentDate}.json`;
    await fs.writeFile(newFilePath, JSON.stringify(sortedList, null, "\t"));
    console.log("Ids Assigned.");
  } catch (error) {
    console.error(error);
  }
}

// Call the function to initiate the id assigning process
id();

// exporting the module
/* module.exports = { id }; */
