// importing dependencies
import puppeteer from "puppeteer"; // to scrap from web.
import fs from "fs/promises"; // to call function asynchronously.
import path from "path"; // to create folders.

export async function posts() {
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
          const upVotes = scoreElement ? scoreElement.title.trim() : "N/A";

          const commentsElement = post.querySelector("a.comments");
          const comments = commentsElement
            ? commentsElement.textContent.trim()
            : "N/A";

          let engagement;
          if (
            (upVotes == "•" || upVotes == "N/A" || upVotes == "") &&
            (comments == "•" || comments == "N/A" || comments == "")
          ) {
            engagement = 0;
          } else if (upVotes == "•" || upVotes == "N/A" || upVotes == "") {
            engagement = parseInt(comments);
          } else if (comments == "•" || comments == "N/A" || comments == "") {
            engagement = parseInt(upVotes);
          } else {
            engagement = parseInt(upVotes) + parseInt(comments);
          }
          // adding to dictionary
          postList.push({
            Post: {
              Date: dateTime,
              Title: postTitle,
              Link: postURL,
              Score: upVotes,
              Comments: comments,
              Engagement: engagement,
            },
          });
        });
        return postList;
      });
      // getting current date.
      const currentDate = new Date()
        .toISOString()
        .replace(/:/g, "-")
        .slice(0, -14);

      //checking if folder exists
      const folderPath = path.join("jsons", currentDate);
      // Create the folder using promises
      fs.mkdir(folderPath)
        .then(() => {
          console.log(`Folder "${currentDate}" created at "${folderPath}"`);
        })
        .catch((error) => {
          console.log(`Folder already exists!`);
        });
      //checking if file exists
      const filePath = `jsons/${currentDate}/List_${currentDate}.json`;
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
    console.log("Post 'Scrapping' Complete.");
  } catch (error) {
    console.log("Error during 'Scrapping' Posts.");
    console.error(error);
  }
}

/* posts(); */
