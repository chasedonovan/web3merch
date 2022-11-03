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
    try {
      const externalResponseData = await externalResponse.json();
      if (externalResponseData) {
        //success
        if (
          externalResponseData.gate_access &&
          externalResponseData.gate_access === true
        ) {
          return res.status(200).json({ allow_access: true });
        }
      }
    } catch (e) {
      console.error("TokenGate response", e);
    }

    return res.status(200).json({ allow_access: false });
  } catch (e) {
    console.log("TokenGate", e);
    return res.status(500).json({ allow_access: false });
  }
}
