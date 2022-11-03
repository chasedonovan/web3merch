// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import Crypto from "crypto";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<unknown>
) {
  try {
    const paymentInfo = req.body;

    if (paymentInfo == undefined) {
      res.status(500).send(false);
    }
    const paymentInfoJson = req.body.json();

    const nowpaymentsSig = String(req.headers["x-nowpayments-sig"] ?? "");
    console.log("x-nowpayments-sig", nowpaymentsSig);

    if (nowpaymentsSig == undefined) {
      res.status(500).send(false);
    }

    //verify
    const valid = await check_ipn_request_is_valid(
      nowpaymentsSig,
      paymentInfoJson
    );
    if (!valid) {
      res.status(500).send(false);
    }

    const currentCart = await getCartPaymentStatus(paymentInfoJson.order_id);

    if (currentCart && currentCart.cart_uuid) {
      //save
      const updatedCart = await savePayment(paymentInfoJson);

      //check if the status changed to "finished"
      if (
        currentCart.payment_status != "finished" &&
        updatedCart.payment_status == "finished"
      ) {
        //TODO: send order confirmation email
      }
    }

    res.status(200).send(true);
  } catch (e) {
    res.status(500).send({ error: e });
  }
}

async function check_ipn_request_is_valid(
  nowpaymentsSig: string,
  paymentInfoJson: any
) {
  const hmac = Crypto.createHmac(
    "sha512",
    String(process.env.NOWPAYMENT_IPN_KEY)
  );
  hmac.update(
    JSON.stringify(paymentInfoJson, Object.keys(paymentInfoJson).sort())
  );
  const signature = hmac.digest("hex");

  //TODO: remove log
  console.log("check_ipn_request_is_valid", nowpaymentsSig, signature);
  if (nowpaymentsSig == signature) return true;

  return false;
}

async function savePayment(paymentInfo: any) {
  try {
    const cartResp = await fetch(`${process.env.API_URL}/merch/cart/payment`, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(paymentInfo),
    });
    const cartData = await cartResp.json();
    console.log("Save cart payment", cartData);
    return cartData;
  } catch (e) {
    throw e;
  }
}

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

async function getCartPaymentStatus(cart_uuid: string) {
  try {
    const cartResp = await fetch(
      `${process.env.API_URL}/merch/cart/payment/${cart_uuid}`,
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
