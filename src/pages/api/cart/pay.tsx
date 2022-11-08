// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import Error from "next/error";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<unknown>
) {
  try {
    const cart_uuid = req.body.cart_uuid;
    const paymentMethod = req.body.paymentMethod;

    console.log("Payment init", cart_uuid, paymentMethod);

    //check that the payment currency is okay
    const validPaymentMethods = ["ADA", "ETH", "BTC", "SOL", "USDC"];

    let paymentCurrencyValid = false;
    validPaymentMethods.forEach((p) => {
      if (p == paymentMethod) {
        paymentCurrencyValid = true;
      }
    });

    if (!paymentCurrencyValid) {
      console.info("Invalid paymentMethod: ", paymentMethod);
      return "Invalid payment method selected. Please try again.";
    } else {
      console.info("Valid paymentMethod: ", paymentMethod);
    }

    const cartResponse = await getCart(cart_uuid);
    console.log("Payment, fetch cart", cartResponse);

    const paymentData = {
      price_amount: cartResponse.total_price,
      price_currency: "usd",
      pay_currency: paymentMethod,
      ipn_callback_url:
        "https://merch.unisrcoll.io/api/cart/nowpaymentcallback",
      order_id: cartResponse.uuid,
      order_description: "GoatTribe merch",
    };

    const paymentDataJson = JSON.stringify(paymentData);

    console.log("Payment data", paymentData, paymentDataJson);

    const externalResponse = await fetch(
      `${process.env.NOWPAYMENT_API_URL}/v1/payment?currency_from=USD&currency_to=${paymentMethod}`,
      {
        headers: {
          "x-api-key": `${process.env.NOWPAYMENT_API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: paymentDataJson,
      }
    );

    const externalResponseData = await externalResponse.json();

    const paymentSaved = await savePayment(externalResponseData);

    if (!paymentSaved) {
      console.error("Payment could not be saved", externalResponseData);
      return res
        .status(500)
        .json({ status: "false", detail: "Payment could not be saved" });
    }

    console.log("Pay", externalResponseData);
    res.status(200).json(externalResponseData);
  } catch (e) {
    console.log("Pay error", e);
    res.status(500).json({ error: e });
  }
}

async function savePayment(paymentInfo: any) {
  try {
    const savePayment = await fetch(
      `${process.env.API_URL}/merch/cart/payment`,
      {
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(paymentInfo),
      }
    );
    console.log("Save payment", savePayment);
    return true;
  } catch (e) {
    throw e;
  }
}

//Example response
// {
//   "payment_id": "5745459419",
//   "payment_status": "waiting",
//   "pay_address": "3EZ2uTdVDAMFXTfc6uLDDKR6o8qKBZXVkj",
//   "price_amount": 3999.5,
//   "price_currency": "usd",
//   "pay_amount": 0.17070286,
//   "pay_currency": "btc",
//   "order_id": "RGDBP-21314",
//   "order_description": "Apple Macbook Pro 2019 x 1",
//   "ipn_callback_url": "https://nowpayments.io",
//   "created_at": "2020-12-22T15:00:22.742Z",
//   "updated_at": "2020-12-22T15:00:22.742Z",
//   "purchase_id": "5837122679",
//   "amount_received": null,
//   "payin_extra_id": null,
//   "smart_contract": "",
//   "network": "btc",
//   "network_precision": 8,
//   "time_limit": null,
//   "burning_percent": null,
//   "expiration_estimate_date": "2020-12-23T15:00:22.742Z"
// }

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
