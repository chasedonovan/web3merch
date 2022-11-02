// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import Error from "next/error";
import NowPaymentsApi from "@nowpaymentsio/nowpayments-api-js";

const npApi = new NowPaymentsApi({ apiKey: `${process.env.NOW_PAYMENTS}` }); // your api key

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<unknown>
) {
  try {
      const payment = await npApi.createPayment({
        price_amount: req.body.cart.totalPrice,
        price_currency: "USD",
        pay_currency: "ADA",
      });
      
      res.status(200).json(payment);
    } catch (e) {
    res.status(500).send({ error: e });
  }
}
