const puppeteer = require("puppeteer");
const fs = require("fs/promises");

//main functuin
//making a list of posts
let postList = [];

async function posts() {
  try {
    // launching a browser
    const browser = await puppeteer.launch({
      headless: "new",
      defaultViewport: false,
      /* userDataDir: "./settings", */
    });
    // opening a new page
    const page = await browser.newPage();
    // navigating to desired url
    await page.goto("https://old.reddit.com/r/AskReddit/", { timeout: 0 });
    let grabPosts;
    // ToDo:: make loop to be able to click the next button. (Here)
    // make the loop stop by checking against flag, ( if i == 3) then stop the loop
    for (let i = 0; i < 4; i++) {
      // getting list of posts
      grabPosts = await page.evaluate((postList) => {
        // navigating to body of posts
        const posts = document.querySelectorAll(".thing");
        // making a dictionary
        posts.forEach((postTag) => {
          const dateTime = postTag.querySelector("time").dateTime;
          const postTitle = postTag.querySelector("a").textContent;
          const postURL = postTag.querySelector("a").href;
          const upVotes = postTag.querySelector(".score.unvoted").textContent;
          const postComments = postTag.querySelector("li").textContent;
          let engagement;
          if (parseInt(upVotes)) {
            engagement = parseInt(upVotes) + parseInt(postComments);
          } else {
            engagement = parseInt(postComments);
          }
          // adding to dictionary
          postList.push({
            id: 0,
            Post: {
              Date: dateTime,
              Title: postTitle,
              URL: postURL,
              UpVotes: upVotes,
              Comments: postComments,
              Engagement: engagement,
            },
          });
        });
        return postList;
      }, postList);

      // click next
      /* await page.click("#siteTable > div.nav-buttons > span > span"); */
    }
    // ---> loop needs to end here.

    //writing to a JSON file
    await fs.writeFile(
      "jsons/List.json",
      JSON.stringify(grabPosts, null, "\t")
    );
    //terminating the browser
    await browser.close();
    console.log("----> Posts scrapped 'Successfully'.");
  } catch (error) {
    console.error("Error during posts():", error);
  }
}
/* posts(); */
module.exports = { posts };
