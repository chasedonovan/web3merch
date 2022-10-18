import type { NextApiRequest, NextApiResponse } from "next";
import Error from "next/error";

type ProtocolParameters = {
  min_fee_a: string;
  min_fee_b: string;
  max_tx_size: string;
  key_deposit: string;
  pool_deposit: string;
  max_val_size: string;
  coins_per_utxo_word: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    const externalResponse = await fetch(
      `${process.env.API_URL}/protocol_params/current`,
      {
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "GET",
      }
    );
    const externalResponseData = await externalResponse.json();
    res.status(200).send(externalResponseData as ProtocolParameters);
  } catch (e) {
    console.log(e);
    res.status(500);
  }
}
