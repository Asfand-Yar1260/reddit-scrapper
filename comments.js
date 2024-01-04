const puppeteer = require("puppeteer");
const fs = require("fs/promises");

async function comments() {
  try {
    // Get the current date for file naming
    const currentDate = new Date()
      .toISOString()
      .replace(/:/g, "-")
      .slice(0, -14);

    // File path for the initial data
    const filePath = `jsons/${currentDate}/id_Sorted_List_${currentDate}.json`;

    // Read the initial data file
    const list = JSON.parse(await fs.readFile(filePath, "utf-8"));

    // Launch Puppeteer browser
    const browser = await puppeteer.launch({
      headless: "new",
      defaultViewport: false,
      channel: "chrome",
    });

    // Array to store promises for parallel processing
    const promises = list.map(async (post, i) => {
      const url = post.Post.Link;
      const page = await browser.newPage();

      try {
        // Navigate to the post URL
        await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });

        // Scrape comments from the page
        const grabComments = await page.evaluate(() => {
          const comments = document.querySelectorAll(
            ".thing.noncollapsed.comment"
          );
          return Array.from(comments).map((comment) => {
            const dateElement = comment.querySelector(
              "div.entry.unvoted > p.tagline > time"
            );
            const dateTime = dateElement ? dateElement.dateTime : "N/A";

            const authorElement = comment.querySelector(
              "div.entry.unvoted > p.tagline > a.author.may-blank"
            );
            const author = authorElement ? authorElement.textContent : "N/A";

            const pointsElement = comment.querySelector(
              "div.entry.unvoted > p.tagline > span.score.unvoted"
            );
            const points = pointsElement
              ? pointsElement.textContent.trim()
              : "N/A";

            const bodyElement = comment.querySelector(
              "div.entry.unvoted > form.usertext > div.usertext-body > div.md >p"
            );
            const commentBody = bodyElement ? bodyElement.textContent : "N/A";

            return {
              Date: dateTime,
              Author: author,
              Points: points,
              Comment: commentBody,
            };
          });
        });

        // Add the Comments key-value pair to the post
        post.Comments = grabComments;
        console.log(`Scrapping for Post-index# ${i} Complete.`);
      } catch (error) {
        console.error(`Timeout error for Post-index# ${i}: ${error.message}`);
      } finally {
        // Close the page after processing
        await page.close();
      }
    });

    // Wait for all promises to complete
    await Promise.all(promises);

    // File path for the new data with comments
    const newFilePath = `jsons/${currentDate}/id_Sorted_List_Comments${currentDate}.json`;

    // Read existing data from the file or initialize an empty array
    const existingData = await fs
      .readFile(newFilePath, "utf-8")
      .catch(() => "[]");

    // Filter posts that have comments
    const newData = list.filter((post) => post.Comments);

    // Combine existing data with new data
    const combinedData = JSON.stringify(
      JSON.parse(existingData).concat(newData),
      null,
      "\t"
    );

    // Write the updated data to the new file
    await fs.writeFile(newFilePath, combinedData);
    console.log(`Data updated in ${newFilePath}`);

    // Close the browser
    await browser.close();

    console.log("Comments 'Scrapping' Complete.");
  } catch (error) {
    console.log("Error during 'Scrapping' Comments.");
    console.log(error);
  }
}

// Call the function to initiate the comment scraping process
comments();

// exporting the module
/* module.exports = { comments }; */
