import emailjs from "emailjs-com";
import type { NextApiRequest, NextApiResponse } from "next";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  // NOTE: Uncomment the below lines to make the code work

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


// const itemList = cart.cartItems.map((item) => {
//   const product = products.find((product) => product.name === item.name);
//   return `<br/> <img style="height:100px; width:100px;" src='https://merch.uniscroll.io${product?.image}'  alt='${item.name}' width="56" height="56" /> <br/> ${item.name} - ${item.quantity} x $${item.price} = ${item.quantity * item.price} <br/>`
// });

// emailjs
// .send(
//   `service_ra0p0dz`,
//   `template_5j3q9s6`,
//   {
//     // emailjs.send( `${process.env.EMAIL_KEY}`, `${process.env.EMAIL_TEMPLATE}`, {
//       to_email: orderAddress.email,
//       to_name: orderAddress.firstName + " " + orderAddress.lastName,
//       address: orderAddress.streetAddress,
//       postal: orderAddress.postalCode,
//       country: orderAddress.country,
//       items: `<div>${itemList}</div>`,
//       subtotal: `${cart.subTotalPrice / 1000000}`,
//       shipping: `${cart.shippingPrice / 1000000}`,
//       total: `${cart.totalPrice / 1000000}`,
//       date_time: new Date().toLocaleString(),
//     // }, `${process.env.EMAIL_PUBLIC_KEY}`)
//   },
//   `nHKdN2eeVxPRtvKoF`
// )
// .then(
//   (result) => {
//     console.log(result.text);
//   },
//   (error) => {
//     console.log(error.text);
//   }
// );