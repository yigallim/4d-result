import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { Element } from "domhandler";

interface PrizeDetails {
  firstPrize: string;
  secondPrize: string;
  thirdPrize: string;
  special: string[];
  consolation: string[];
}

interface ProviderResults {
  damacai?: PrizeDetails;
  magnum?: PrizeDetails;
  toto?: PrizeDetails;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get("date");
  const baseUrl = "https://4d4d.co";
  const pageUrl = date ? `${baseUrl}/result/${date}.html` : baseUrl;

  try {
    const response = await fetch(pageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch the page: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const results: ProviderResults = {};

    const extractPrizeNumbersAfterLabel = ($box: cheerio.Cheerio<Element>, label: string) => {
      const prizes: string[] = [];

      const $table = $box
        .find("table.resultTable2")
        .filter((_i, el) => $(el).find("td.resultprizelable").first().text().includes(label));

      $table.find("td.resultbottom").each((_i, el) => {
        const num = $(el).text().trim();
        prizes.push(num);
      });

      return prizes;
    };

    const getPrizeValues = ($box: cheerio.Cheerio<Element>): PrizeDetails => ({
      firstPrize: $box.find("td:contains('1st Prize')").next().text().trim(),
      secondPrize: $box.find("td:contains('2nd Prize')").next().text().trim(),
      thirdPrize: $box.find("td:contains('3rd Prize')").next().text().trim(),
      special: extractPrizeNumbersAfterLabel($box, "Special"),
      consolation: extractPrizeNumbersAfterLabel($box, "Consolation"),
    });

    $("div.outerbox").each((_i, el) => {
      const $box = $(el);
      const alt = $box.find("img").attr("alt")?.toLowerCase();

      if (alt?.includes("damacai 4d")) {
        results.damacai = getPrizeValues($box);
      } else if (alt?.includes("magnum 4d")) {
        results.magnum = getPrizeValues($box);
      } else if (alt?.includes("toto 4d")) {
        results.toto = getPrizeValues($box);
      }
    });

    // if (results.damacai) {
    //   results.damacai.firstPrize = Math.floor(1000 + Math.random() * 9000).toString();
    // }

    return NextResponse.json<ProviderResults>(results);
  } catch (error) {
    console.error("Error scraping 4D results:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
