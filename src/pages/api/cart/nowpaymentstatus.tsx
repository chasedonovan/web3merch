import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<unknown>
) {
  try {
    const cart = req.body.cart_uuid;
    const resp = await fetch(
      `${process.env.NOWPAYMENT_API_URL}/v1/payment/${cart.payment_id}`,
      {
        headers: {
          "x-api-key": `${process.env.NOWPAYMENT_API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "GET",
      }
    );
    const respData = await resp.json();
    console.log("Payment status", respData);
    return respData;
  } catch (e) {
    throw e;
  }
}

// Example Return value
// {
//   "payment_id": 5524759814,
//   "payment_status": "finished",
//   "pay_address": "TNDFkiSmBQorNFacb3735q8MnT29sn8BLn",
//   "price_amount": 5,
//   "price_currency": "usd",
//   "pay_amount": 165.652609,
//   "actually_paid": 180,
//   "pay_currency": "trx",
//   "order_id": "RGDBP-21314",
//   "order_description": "Apple Macbook Pro 2019 x 1",
//   "purchase_id": "4944856743",
//   "created_at": "2020-12-16T14:30:43.306Z",
//   "updated_at": "2020-12-16T14:40:46.523Z",
//   "outcome_amount": 178.9005,
//   "outcome_currency": "trx"
// }
