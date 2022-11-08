// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import Crypto from "crypto";
import emailjs from "emailjs-com";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<unknown>
) {
  try {
    const paymentInfo = req.body;
    console.log("api/nowpaymentcallback", paymentInfo);

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

    const currentCart = await getCart(paymentInfoJson.order_id);

    if (currentCart && currentCart.cart_uuid) {
      //save
      const updatedCart = await savePayment(paymentInfoJson);

      //check if the status changed to "finished"
      if (
        currentCart.payment_status != "finished" &&
        updatedCart.payment_status == "finished"
      ) {
        await sendOrderConfirmationEmail(currentCart);
      }
    }

    res.status(200).json(true);
  } catch (e) {
    res.status(500).json({ error: e });
  }
}

async function sendOrderConfirmationEmail(cart: any) {
  // try {
  //   const items = cart.cartItems.map((item: any) => {
  //     return `
  //         <img src="https://merch.uniscroll.io/${item.image}" alt="${
  //       item.name
  //     }" />
  //         <p>${item.name} ${item.variant.size} ${item.price} ${item.quantity} ${
  //       item.price * item.quantity
  //     }</p>
  //         `;
  //   });
  //   emailjs
  //     .send(
  //       `${process.env.EMAIL_KEY}`,
  //       `${process.env.EMAIL_TEMPLATE}`,
  //       {
  //         to_name: cart.address.first_name + " " + cart.address.last_name,
  //         to_email: cart.address.email,
  //         address: cart.address.street_address,
  //         postal: cart.address.postal_code,
  //         country: cart.address.country,
  //         items: items,
  //         subtotal: `${cart.subtotal_price}`,
  //         shipping: `${cart.shipping_price}`,
  //         total: `${cart.total_price}`,
  //         date_time: new Date().toLocaleString(),
  //       },
  //       `${process.env.EMAIL_PUBLIC_KEY}`
  //     )
  //     .then(
  //       (result: any) => {
  //         console.log(result.text);
  //       },
  //       (error: any) => {
  //         console.log(error.text);
  //       }
  //     );
  // } catch (error: any) {
  //   console.log(error);
  //   throw error;
  // }
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
