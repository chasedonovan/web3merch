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
    const transaction_id = req.body.transaction_id;
    const cart_uuid = req.body.cart_uuid;
    const externalResponse = await fetch(
      `${process.env.API_URL}/merch/cart/checkout`,
      {
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          transaction_id: transaction_id,
          cart_uuid: cart_uuid,
        }),
      }
    );
    const externalResponseData = await externalResponse.json();
    console.log("checkout", externalResponseData);
    res.status(200).json(externalResponseData);
  } catch (e) {
    res.status(500).send({ error: e });
  }
}
