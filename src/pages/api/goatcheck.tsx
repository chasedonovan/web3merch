import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    const stakeAddress = req.body.stakeAddress;
    const externalResponse = await fetch(
      `${process.env.API_URL}/token_gate/${stakeAddress}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "GET",
      }
    );
    let externalResponseData = await externalResponse.json();
    console.log(externalResponseData);
    if (externalResponseData) {
      //success
      if (externalResponseData.gate_access == true) {
        res.status(200).json(true);
      }
    }
    res.status(200).json(false);
  } catch (e) {
    console.log("TokenGate", e);
    res.status(500).send(false);
  }
}
