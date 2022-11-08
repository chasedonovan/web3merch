import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<unknown>
) {
  try {
    let cart = req.body.cart;

    cart.shipping_price = 30;

    try {
      if (cart.address.country == "UNITED STATES") {
        cart.shipping_price = 15;
      }
    } catch (e) {
      console.log("api/cart/shipping", e);
    }

    res.status(200).json(cart);
  } catch (e) {
    res.status(500).json({ error: e });
  }
}
