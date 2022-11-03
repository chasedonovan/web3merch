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

    const cartResp = await getCart(paymentInfoJson.order_id);

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

    //save
    await savePayment(paymentInfoJson);

    if (paymentInfoJson.payment_status == "finished") {
      //send order confirmation email
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
