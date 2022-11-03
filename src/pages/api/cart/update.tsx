import type { NextApiRequest, NextApiResponse } from "next";

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
    let externalResponseData = await externalResponse.json();
    console.log("update cart", externalResponseData);

    const minPayment = await minimumPayment();

    if (minPayment.min_amount <= externalResponseData.total_price) {
      const estPayment = await estimatedPayment(externalResponseData);
      externalResponseData.estimated_total = Number(
        estPayment.estimated_amount
      ).toFixed(2);
    } else {
      console.log(
        `The total order value is less than than the minumim amount (${minPayment.min_amount})`
      );
      return res.status(200).json({
        success: "false",
        detail: `The total order value is less than than the minumim amount (${minPayment.min_amount})`,
      });
    }

    console.log("Update cart", externalResponseData);
    res.status(200).json(externalResponseData);
  } catch (e) {
    res.status(500).json({ error: e });
  }
}

async function minimumPayment() {
  try {
    const minimumPaymentResponse = await fetch(
      `${process.env.NOWPAYMENT_API_URL}/v1/min-amount?currency_from=usd&currency_to=ada&fiat_equivalent=usd`,
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
    console.log(externalResponseData);
    const estPaymentResponse = await fetch(
      `${process.env.NOWPAYMENT_API_URL}/v1/estimate?amount=${externalResponseData.total_price}&currency_from=usd&currency_to=ada`,
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
