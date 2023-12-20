const puppeteer = require("puppeteer");
const fs = require("fs/promises");

async function comments() {
  try {
    const list = require("./List_Sorted_ID.json");
    for (let i = 0; i < list.length; i++) {
      const url = list[i].Post.URL;
      // launching a browser
      const browser = await puppeteer.launch({
        headless: "new",
        defaultViewport: false,
        /* userDataDir: "./settings", */
      });

      // opening a new page
      const page = await browser.newPage();

      // navigating to the desired url
      await page.goto(url, { timeout: 0 });

      // getting list of comments
      const grabComments = await page.evaluate((i) => {
        const posts = document.querySelectorAll(".thing.noncollapsed.comment");
        const commentlist = [];
        posts.forEach((postTag) => {
          try {
            const dateTime = postTag.querySelector("time").dateTime;
            const userName =
              postTag.querySelector(".author.may-blank").textContent;
            const comment = postTag.querySelector(".md").textContent;
            const points = postTag.querySelector(".score.unvoted").textContent;

            commentlist.push({
              Date: dateTime,
              User: userName,
              Comment: comment,
              Points: points,
            });
          } catch (error) {
            console.error(
              "Error at :[",
              i,
              "]index.\n Error is of :",
              error,
              "\n -----> Couldn't scrap."
            );
          }
        });
        return commentlist;
      }, i);
      // Add "Comments" key to the current list item
      list[i].Comments = grabComments;

      // Write the updated list to a JSON file
      await fs.writeFile(
        "List_Comments.json",
        JSON.stringify(list, null, "\t")
      );
      await browser.close();
    }
    console.log("*Comment scrapping Complete.*");
  } catch (error) {
    console.error("Error during comments():", error);
  }
}
/* comments(); */
module.exports = { comments };
