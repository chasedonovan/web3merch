// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import Error from "next/error";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<unknown>
) {
  try {
    const cart = req.body.cart;

    const cartResponse = await getCart(cart.uuid);

    const externalResponse = await fetch(
      `${process.env.NOWPAYMENT_API_URL}/v1/payment?currency_from=USD&currency_to=ADA`,
      {
        headers: {
          "x-api-key": `${process.env.NOWPAYMENT_API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(`
          "price_amount": ${cartResponse.total_price},
          "price_currency": "usd",
          "pay_currency": "ada",
          "ipn_callback_url": "https://nowpayments.io",
          "order_id": ${cartResponse.uuid},
          "order_description": "GoatTribe merch"`),
      }
    );
    const externalResponseData = await externalResponse.json();
    console.log("Pay", externalResponseData);
    res.status(200).json(externalResponseData);
  } catch (e) {
    res.status(500).send({ error: e });
  }
}

async function getCart(cart_uuid: string) {
  try {
    const cartResp = await fetch(
      `${process.env.API_URL}/merch/cart/${cart_uuid}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "GET",
      }
    );
    const cartData = await cartResp.json();
    console.log("Get cart", cartData);
    return cartData;
  } catch (e) {
    throw e;
  }
}
