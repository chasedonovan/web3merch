import type { NextApiRequest, NextApiResponse } from "next";
import Error from "next/error";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<unknown>
) {
  try {
    const stakeAddress = req.body.stakeAddress;

    //create new auth token
    const externalResponse = await fetch(
      `${process.env.API_URL}/user/auth/${stakeAddress}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
      }
    );

    //set nonce cookie

    const externalResponseData = await externalResponse.json();
    res.status(200).json(externalResponseData);
  } catch (e) {
    res.status(500).send({ error: e });
  }
}
