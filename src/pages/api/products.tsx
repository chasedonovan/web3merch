import type { NextApiRequest, NextApiResponse } from "next";
import Error from "next/error";
import { merchItems } from "../../data/merchItems.js";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    const externalResponse = await fetch(
      `${process.env.API_URL}/merch/products`,
      {
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
          "Content-Type": "application/json",
          "cache-control": "max-age=10, s-maxage=30, stale-while-revalidate=59",
        },
        method: "GET",
      }
    );
    let externalResponseData = await externalResponse.json();
    if (externalResponseData) {
      //fix images as json string
      externalResponseData.forEach((elem: { images: string }) => {
        elem.images = JSON.parse(elem.images);
      });
    }
    res.status(200).json(externalResponseData);
    // res.status(200).json(merchItems);
  } catch (e) {
    // res.status(200).send(merchItems);
    res.status(500).send({ error: e });
  }
}
