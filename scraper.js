import playwright from "playwright";

async function scrapePage(page, id) {
  const response = await page.goto(`https://www.airbnb.co.uk/rooms/${id}`);

  if (response.status() === 200) {
    const propertyName = await page.locator("span._1xxgv6l h1").textContent();
    const propertyType = (
      await page.locator("div.toieuka h1").textContent()
    ).split(" in ")[0];
    const accommodationData = await page
      .locator("div.o1kjrihn ol.lgx66tx li")
      .allTextContents();

    //Reduce function takes data in the format '4 guests · '
    //extracts only the number and word as separate strings and
    //then assigns them as property and value in the acc object for more reliable access
    const mappedAccommodationData = accommodationData.reduce((acc, value) => {
      const regexGroups = Array.from(value.matchAll(/(\d+) ([a-zA-Z]+)/gi))[0];
      acc[regexGroups[2]] = regexGroups[1];
      return acc;
    }, {});

    await page.locator("div.b9672i7 button.l1ovpqvx").click();

    //Waiting for modal to open before continuing to ensure necessary
    //elements are rendered before trying to locate them
    const modal = page.getByTestId("modal-container");
    await modal.waitFor();

    const amenities = [];
    const amenityLists = await page.getByRole("list");
    const listCount = await page.getByRole("list").count();
    const amenityHeadings = await page
      .getByTestId("modal-container")
      .locator("h3")
      .allTextContents();

    //Loops through the amenity lists to extract nested values,
    //keeps associated values together and pushes object with category heading to amenities array
    for (let i = 0; i < listCount; i++) {
      let amenityItems = [];

      if (amenityHeadings[i] === "Not included") {
        amenityItems = await amenityLists
          .nth(i)
          .locator("div.twad414 del")
          .allTextContents();
      } else {
        amenityItems = await amenityLists
          .nth(i)
          .locator("div.twad414")
          .allTextContents();
      }

      amenities.push({ category: amenityHeadings[i], amenityItems });
    }

    return {
      propertyName,
      propertyType,
      bathroomCount: mappedAccommodationData["bathroom"],
      bedroomCount: mappedAccommodationData["bedroom"],
      amenities,
    };
  } else {
    throw new Error(`Property ${id}: Response code ${response.status()}`);
  }
}

async function scrapeApplication(idList) {
  const outputArray = [];

  const browser = await playwright.chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  for (let i = 0; i < idList.length; i++) {
    try {
      //Extracted scraping logic to function for separation of logic and ease of reading
      outputArray.push(await scrapePage(page, idList[i]));
    } catch (err) {
      console.log(err);
    }
  }

  await browser.close();

  return outputArray;
}

const idList = ["33571268", "20669368", "50633275"];

scrapeApplication(idList)
  .then((data) => {
    console.dir(data, { depth: null });
  })
  .catch((e) => {
    console.error(e);
  });

