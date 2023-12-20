const puppeteer = require("puppeteer");
const fs = require("fs/promises");

//main functuin
//making a list of posts
let postList = [];
async function scrap() {
  // launching a browser
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
    userDataDir: "./settings",
  });
  // opening a new page
  const page = await browser.newPage();
  // navigating to desired url
  await page.goto("https://old.reddit.com/r/AskReddit/", { timeout: 0 });

  // getting list of posts
  const grabPosts = await page.evaluate((postList) => {
    // navigating to body of posts
    const posts = document.querySelectorAll(".entry.unvoted");
    posts.forEach((postTag) => {
      const postTitle = postTag.querySelector("a").textContent;
      const postURL = postTag.querySelector("a").href;
      const postEngagement = postTag.querySelector("li").textContent;
      postList.push({
        Title: postTitle,
        URL: postURL,
        Engagement: postEngagement,
      });
    });
    return postList;
  }, postList);
  //writing to a JSON file
  fs.writeFile("List.json", JSON.stringify(grabPosts, null, "\t"));
  //terminating the browser
  await browser.close();
}

module.exports = { scrap };
