import type { NextApiRequest, NextApiResponse } from "next";
import emailjs from "emailjs-com";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<unknown>
) {
  try {
    const cart_uuid = req.body.cart_uuid;
    console.log(req.body);
    const cart = await getCart(cart_uuid);
    console.log(cart);
    await sendOrderConfirmationEmail(cart);
    res.status(200).json(true);
  } catch (e) {
    res.status(500).json(e);
  }
}

async function sendOrderConfirmationEmail(cart: any) {
  try {
    const items = cart.cartItems.map((item: any) => {
      return `
            <img src="https://merch.uniscroll.io/${item.image}" alt="${
        item.name
      }" />
            <p>${item.name} ${item.size} ${item.price} ${item.quantity} ${
        item.price * item.quantity
      }</p>
            `;
    });

    emailjs
      .send(
        `${process.env.EMAIL_KEY}`,
        `${process.env.EMAIL_TEMPLATE}`,
        {
          to_name: cart.address.first_name + " " + cart.address.last_name,
          to_email: cart.address.email,
          address: cart.address.street_address,
          postal: cart.address.postal_code,
          country: cart.address.country,
          //items: items,
          subtotal: `${cart.subtotal_price}`,
          shipping: `${cart.shipping_price}`,
          total: `${cart.total_price}`,
          date_time: new Date().toLocaleString(),
        },
        `${process.env.EMAIL_PUBLIC_KEY}`
      )
      .then(
        (result: any) => {
          console.log("Email result", result);
        },
        (error: any) => {
          console.log("Error result", error);
        }
      );
    return;
  } catch (error: any) {
    console.log("Failed sending email", error);
    throw error;
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
