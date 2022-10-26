// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import Error from "next/error";

// type Data = {
//   name: string;
//   success: boolean;
// };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<unknown>
) {
  try {
    const cart_uuid = req.body.cart_uuid;
    const address = req.body.address;
    const stakeKey = req.body.stake_key;
    const externalResponse = await fetch(
      `${process.env.API_URL}/merch/cart/address/${cart_uuid}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          stake_key: stakeKey,
          address,
        }),
      }
    );
    const externalResponseData = await externalResponse.json();
    console.log("update address", externalResponseData);
    res.status(200).json(externalResponseData);
  } catch (e) {
    res.status(500).send({ error: e });
  }
}
