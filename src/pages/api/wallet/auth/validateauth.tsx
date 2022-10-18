import type { NextApiRequest, NextApiResponse } from "next";
import Error from "next/error";
//import CardanoSignedData from "./CardanoSignedData";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<unknown>
) {
  //Validate the signature and getAuthorization from backend.
  //get auth by nonce and stakeaddress
  //set auth cookie

  try {
    //1. get the token from api and
    const stakeAddress = req.body.stakeAddress;
    const signedPayload = req.body.signedPayload;
    // const externalResponse = await fetch(
    //   `${process.env.API_URL}/user/auth/${stakeAddress}`,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${process.env.API_KEY}`,
    //       "Content-Type": "application/json",
    //     },
    //     method: "POST",
    //     body: JSON.stringify({
    //       stakeAddress: req.body.stakeAddress,
    //     }),
    //   }
    // );

    //2. validate the signature and nonce
    const messagePayload = "Login to uniscroll.io";
    // const csd = new CardanoSignedData(signedPayload);
    // const isValid = csd.verify(stakeAddress, messagePayload);
    const isValid = true;

    //3. if ok, set in auth token in cookie

    //const externalResponseData = await externalResponse.json();
    res.status(200).json({ valid: isValid });
  } catch (e) {
    res.status(500).send({ error: e });
  }
}
