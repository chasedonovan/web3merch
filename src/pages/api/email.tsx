import emailjs from "emailjs-com";
import type { NextApiRequest, NextApiResponse } from "next";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {

  try {

    const items = req.body.items.map((item: any) => {
      return `
      <img src="https://merch.uniscroll.io/${item.image}" alt="${item.name}" />
      <p>${item.name} ${item.variant.size} ${item.price} ${item.quantity} ${item.price * item.quantity}</p>
      `;
    });

    emailjs
      .send(
        `service_ra0p0dz`,
        `template_5j3q9s6`,
        {
          // emailjs.send( `${process.env.EMAIL_KEY}`, `${process.env.EMAIL_TEMPLATE}`, {
          to_name: req.body.to_name,
          to_email: req.body.to_email,
          address: req.body.address,
          postal: req.body.postalCode,
          country: req.body.country,
          items: items,
          subtotal: `${req.body.cart.subTotalPrice / 1000000}`,
          shipping: `${req.body.cart.shippingPrice / 1000000}`,
          total: `${req.body.cart.totalPrice / 1000000}`,
          date_time: new Date().toLocaleString(),
          reply_to: req.body.orderAddress.email,
          // }, `${process.env.EMAIL_PUBLIC_KEY}`)
        },
        `nHKdN2eeVxPRtvKoF`
      )
      .then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );
  } catch (error: any) {
    console.log(error);
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
  console.log("email sent", req.body);
  return res.status(200).json({ error: "" });
}
