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
        },
        method: "GET",
      }
    );
    let externalResponseData = await externalResponse.json();
    if (externalResponseData) {
      externalResponseData.forEach((elem: { images: string }) => {
        elem.images = JSON.parse(elem.images);
      });
      // let variants = new Array<Variant>();
      // externalResponseData.forEach((elem: { variants: [] }) => {
      //   elem.variants.forEach((v) => {
      //     const vVariant = v as Variant;
      //     variants.push(vVariant);
      //   });
      // });
      // externalResponseData.vaiants = variants;
    }
    res.status(200).json(externalResponseData);
  } catch (e) {
    res.status(500).send({ error: e });
  }
}
