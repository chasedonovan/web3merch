import type { NextApiRequest, NextApiResponse } from "next";
import Error from "next/error";
import { merchItems } from "../../data/merchItems.js";
// import { Products } from "hooks/useGlobalContext";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<unknown>
) {
  try {
    const externalResponse = await fetch(
      `${process.env.API_URL}/products`,
      {
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "GET",
      }
    );
    let externalResponseData = await externalResponse.json();

    res.status(200).json(merchItems);
  } catch (e) {
    res.status(500).send({ error: e });
  }
}
