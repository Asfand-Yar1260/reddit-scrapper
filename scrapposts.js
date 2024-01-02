// importing dependencies
const puppeteer = require("puppeteer");
const fs = require("fs/promises");

async function scrapPosts() {
  try {
    // lauching a browser window
    const browser = await puppeteer.launch({
      headless: "new",
      defaultViewport: false,
    });

    // opening a page
    const page = await browser.newPage();

    // navigating to desired URl
    const url = "https://old.reddit.com/r/AskReddit/";
    await page.goto(url, { waitUntil: "networkidle0" });

    // scrapping Posts(DateTime, Title, URL, no of votes, no of comments)
    let grabPosts = [];

    // loop to itrate through pages to get 100 posts
    for (let i = 1; i <= 4; i++) {
      console.log("Page# ", i);
      grabPosts = await page.evaluate(() => {
        //selecting the root container
        const posts = document.querySelectorAll(".thing.link.self");
        let postList = [];

        // itrating through all the post of the page and scrapping info
        posts.forEach((post) => {
          // checking if elements exist or not
          const dateElement = post.querySelector("time.live-timestamp");
          const dateTime = dateElement ? dateElement.dateTime : "N/A";

          const anchorElement = post.querySelector(".title.may-blank");
          const postTitle = anchorElement ? anchorElement.textContent : "N/A";
          const postURL = anchorElement ? anchorElement.href : "N/A";

          const scoreElement = post.querySelector("div.score.unvoted");
          const Upvotes = scoreElement
            ? scoreElement.textContent.trim()
            : "N/A";

          const commentsElement = post.querySelector("a.comments");
          const comments = commentsElement
            ? commentsElement.textContent.trim()
            : "N/A";

          // adding to dictionary
          postList.push({
            Post: {
              Date: dateTime,
              Title: postTitle,
              Link: postURL,
              Score: Upvotes,
              Comments: comments,
            },
          });
        });
        return postList;
      });
      const currentDate = new Date()
        .toISOString()
        .replace(/:/g, "-")
        .slice(0, -14);
      const filePath = `jsons/List_${currentDate}.json`;

      let existingData = [];

      try {
        const fileContent = await fs.readFile(filePath, "utf-8");
        existingData = JSON.parse(fileContent);
        console.log("File exists!");
      } catch (error) {
        // File doesn't exist or is empty
        console.log("File doesn't exist....\nCreating new File!");
      }

      // Check if each new post is already in the existing data
      const newData = grabPosts.filter((newPost) => {
        // Check if there is an identical post in the existing data
        const exists = existingData.some((existingPost) => {
          return (
            existingPost.Post.Date === newPost.Post.Date &&
            existingPost.Post.Title === newPost.Post.Title &&
            existingPost.Post.Link === newPost.Post.Link
          );
        });

        // Only include the new post if it doesn't already exist
        return !exists;
      });

      // Combine existing data with new, unique data
      const combinedData = existingData.concat(newData);

      // Writing to a JSON file
      await fs.writeFile(filePath, JSON.stringify(combinedData, null, "\t"));
      console.log(`Data written to ${filePath}`);

      try {
        // ... existing code ...

        // Add this after each relevant block of code
        console.log("Successfully completed page #", i);
      } catch (error) {
        console.error("Error during page #", i, error);
      }

      // Clicking the next button on the page
      if (i < 4) {
        await page.waitForSelector(
          "#siteTable > div.nav-buttons > span > span.next-button > a"
        );
        await Promise.all([
          page.click(
            "#siteTable > div.nav-buttons > span > span.next-button > a"
          ),
          page.waitForNavigation({ waitUntil: "networkidle0" }),
        ]);
        await page.waitForSelector(".thing.link.self");
      }
    }

    //closing the page and browser after scrapping
    await page.close();
    await browser.close();
  } catch (error) {
    console.log("Error during 'Grabbing' Posts.");
    console.error(error);
  }
}
scrapPosts();
/* module.exports = { scrapPosts }; */
