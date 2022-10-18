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
    const cart = req.body.cart;
    const externalResponse = await fetch(`${process.env.API_URL}/cart/add`, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(cart),
    });

    // res.status(200).send(externalResponse);
    res.status(200).send(cart);

  } catch (e) {
    res.status(500).send({ error: e });
  }
}
