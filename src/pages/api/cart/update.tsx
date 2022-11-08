import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<unknown>
) {
  try {
    let cart = req.body.cart;

    //check that the payment currency is okay
    const validPaymentMethods = ["ADA", "ETH", "BTC", "SOL", "USDC"];

    let paymentCurrencyValid = false;
    validPaymentMethods.forEach((p) => {
      if (p == cart.paymentMethod) {
        paymentCurrencyValid = true;
      }
    });

    if (!paymentCurrencyValid) {
      console.info("Invalid paymentMethod: ", cart.paymentMethod, cart);
      return "Invalid payment method selected. Please try again.";
    } else {
      console.info("Valid paymentMethod: ", cart.paymentMethod, cart);
    }

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

    const minPayment = await minimumPayment(cart.paymentMethod);

    if (minPayment.min_amount <= externalResponseData.total_price) {
      const estPayment = await estimatedPayment(
        externalResponseData,
        cart.paymentMethod
      );
      externalResponseData.estimated_total = Number(
        estPayment.estimated_amount
      ).toFixed(6);
      externalResponseData.estimated_currency = cart.paymentMethod;
    } else {
      console.log(
        `The total order value is less than than the minumim amount ($${minPayment.min_amount})`
      );
      return res.status(200).json({
        success: "false",
        detail: `The total order value is less than than the minumim amount ($${minPayment.min_amount})`,
      });
    }

    console.log("Update cart", externalResponseData);
    res.status(200).json(externalResponseData);
  } catch (e) {
    res.status(500).json({ error: e });
  }
}

async function minimumPayment(paymentCurrency: string) {
  try {
    const minimumPaymentResponse = await fetch(
      `${process.env.NOWPAYMENT_API_URL}/v1/min-amount?currency_from=usd&currency_to=${paymentCurrency}&fiat_equivalent=usd`,
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

async function estimatedPayment(
  externalResponseData: any,
  paymentCurrency: string
) {
  try {
    console.log(
      "estimatedPayment",
      externalResponseData.total_price,
      externalResponseData.pay_currency
    );
    const estPaymentResponse = await fetch(
      `${process.env.NOWPAYMENT_API_URL}/v1/estimate?amount=${externalResponseData.total_price}&currency_from=usd&currency_to=${paymentCurrency}`,
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
