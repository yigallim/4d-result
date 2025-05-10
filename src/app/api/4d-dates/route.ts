import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

interface ResultDate {
  date: string;
  href: string;
}

export async function GET() {
  try {
    const response = await fetch("https://4d4d.co/");
    if (!response.ok) {
      throw new Error(`Failed to fetch the page: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const dates: ResultDate[] = [];

    $("a.dropdown-item").each((_i, el) => {
      const href = $(el).attr("href")?.trim();
      const dateText = $(el).text().trim();

      if (href && dateText) {
        dates.push({ date: dateText, href });
      }
    });

    return NextResponse.json(dates);
  } catch (error) {
    console.error("Error fetching result dates:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
