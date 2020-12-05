const fs = require('fs');
const puppeteer = require('puppeteer');
const { createPost, findPostsByUrl } = require("./models/post");

const GIFEncoder = require('gifencoder');
const PNG = require('png-js');

function decode(png) {
  return new Promise(r => {png.decode(pixels => r(pixels))});
}

async function gifAddFrame(page, encoder) {
  const pngBuffer = await page.screenshot({ clip: { width: 1024, height: 768, x: 0, y: 0 } });
  const png = new PNG(pngBuffer);
  await decode(png).then(pixels => encoder.addFrame(pixels));
}

async function darkScrape() {
  try {
    // launches tor browser
    const browser = await puppeteer.launch({
      args: [
        "--proxy-server=socks5://127.0.0.1:9050",
        " --no-sandbox",
        // "--disable-setuid-sandbox",
      ],
      headless:true,
      slowMo: 0
    });

    const page = await browser.newPage();
    page.setViewport({width: 1024, height: 768});


    var encoder = new GIFEncoder(1024, 768);
    encoder.createWriteStream()
    .pipe(fs.createWriteStream('test.gif'));

encoder.start();
  encoder.setRepeat(0);
  encoder.setDelay(500);
  encoder.setQuality(10); 

    console.log('Starting...')

    // navigates to the paste site
    await page.goto("http://nzxj65x32vh2fkhk.onion/all");
    await page.waitForSelector(".btn-success", { visible: true });

    
    // counting total number of pages for navigation
    const totalPages = await page.$$eval(
      ".pagination li",
      (pages) => pages.length - 2
    );


    // function that goes through the tickets and navigates to the url of each of them
    async function clickTickets(currentPage) {

    console.log(`Visits page No.${currentPage}`)
    
      try {

        await gifAddFrame(page, encoder)    
        await page.goto(
          `http://nzxj65x32vh2fkhk.onion/all?page=${currentPage}`
        );

        await page.waitForSelector(".btn-success", { visible: true });
        await gifAddFrame(page, encoder)
        // these selectors navigates to each ticket's data page
        let links = await page.$$(".btn-success");

        links = await Promise.all(
          links.map((link) => link.getProperty("href"))
        );

        // getting the buttons' url value
        links = await Promise.all(links.map((link) => link.jsonValue()));

        const newLinks = [];

        // goes through that links and filters out those that are already in the database
        links = await Promise.all(
          links.map((link) => {
            findPostsByUrl(link.split("onion/")[1]).then((result) => {
              if (!result) newLinks.push(link);
            });
          })
        );

        await timeOut(3000);

          if (newLinks.length === 0 ) console.log("No new tickets at this page!")

        // a loop that goes through all the new links and inserts their content to the database
        for (let link of newLinks) {

          console.log(`Gets ticket's data from ${link}`)
        
          await page.goto(link);

          await page.waitForSelector(".col-sm-12", { visible: true });
          await gifAddFrame(page, encoder)


          // one of these selector contains the ticket's data
          const container = await page.$$eval(".col-sm-12", (content) => {
            // deriving the actual selector that contains the ticket's data
            let element = content.find((e) => e.querySelector("h4"));

            // derives data according to the database's post schema from the page's content
            return {
              title: element
                .querySelector("h4")
                .textContent.replaceAll(/[\t\n]+/g, ""),
              content: Array.from(element.querySelectorAll("li")).map(
                (e) => e.textContent
              ),
              author: element
                .querySelector(".col-sm-6")
                .textContent.replaceAll(/[\t\n]+/g, "")
                .split(" ")[2],
              date: element
                .querySelector(".col-sm-6")
                .textContent.replaceAll(/[\t\n]+/g, "")
                .split("at ")[1],
            };
          });
          container["url"] = link.split("onion/")[1];
          // creates this post in the database
          createPost(container);
        }
        // recursion through web pages

    //   let x = await page.$$eval(
    //   ".pagination li",
    //   (pages) => pages.map(page => page.className)
    // );

    // console.log(x)
      
        if (currentPage < totalPages) return clickTickets(currentPage + 1);
      } catch (error) {
        console.log(error);
      }
    }

    await clickTickets(1);

    console.log('Done!')
    
    encoder.finish();
    await browser.close();
  } catch (error) {
    console.log(error);
  }
}

// when this function is called the program awaits the time inserted as an argument before executing the next command
function timeOut(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

darkScrape()