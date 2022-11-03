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
    const externalResponse = await fetch(
      `${process.env.API_URL}/merch/cart/update`,
      {
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(cart),
      }
    );
    const externalResponseData = await externalResponse.json();
    console.log("update cart", externalResponseData);

    const minPayment = await minimumPayment();

    if (minPayment.min_amount > cart.subTotalPrice) {
      const estPayment = await estimatedPayment(cart);
      externalResponseData.estimatedTotal = estPayment.estimated_amount;
    }

    res.status(200).json(externalResponseData);
  } catch (e) {
    res.status(500).send({ error: e });
  }
}

async function minimumPayment() {
  try {
    const minimumPaymentResponse = await fetch(
      `${process.env.NOWPAYMENT_API_URL}/v1/min-amount?currency_from=usd&currency_to=ada`,
      {
        headers: {
          "x-api-key": `${process.env.NOWPAYMENT_API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "GET",
      }
    );
    const minimumPaymentData = await minimumPaymentResponse.json();
    console.log("Minimum payment", minimumPaymentData);
    return minimumPaymentData;
  } catch (e) {
    throw e;
  }
}

async function estimatedPayment(externalResponseData: any) {
  try {
    const estPaymentResponse = await fetch(
      `${process.env.NOWPAYMENT_API_URL}/v1/min-amount?estimate?amount=${externalResponseData.totalPrice}&currency_from=usd&currency_to=ada`,
      {
        headers: {
          "x-api-key": `${process.env.NOWPAYMENT_API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "GET",
      }
    );
    const estPaymentData = await estPaymentResponse.json();
    console.log("Estimated payment", estPaymentData);
    return estPaymentData;
  } catch (e) {
    throw e;
  }
}
