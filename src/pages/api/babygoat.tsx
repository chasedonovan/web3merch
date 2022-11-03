import type { NextApiRequest, NextApiResponse } from "next";
import Error from "next/error";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    const externalResponse = await fetch(
      `${process.env.API_URL}/check_whitelist/baby_goats/${req.body.stakeAddy}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
          "Content-Type": "application/json",

        },
        method: "GET",
      }
    );
    let externalResponseData = await externalResponse.json();
    res.status(200).json(externalResponseData);
    // res.status(200).json({
    //   "drop_name": "Goat Tribe - Baby Goats",
    //   "whitelisted": true,
    //   "whitelisted_amount": 1
    //   });
    // res.status(200).json({
    //   "invalid": "Bad Wallet Address or Stake Key"
    //   });
  } catch (e) {
    res.status(500).send({ error: e });
    // res.status(500).json({
    //   "drop_name": "Goat Tribe - Baby Goats",
    //   "whitelisted": true,
    //   "whitelisted_amount": 1
    //   });
  }
}
