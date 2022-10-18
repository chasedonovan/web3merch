import React, { PropsWithChildren } from "react";
import Collections from "./Collections";
import Layout from "./Layout";
import PoolInfo from "./PoolInfo";
import Rewards from "./Rewards";
import { Wallet } from "./Wallet";
import Head from "next/head";

export const Merch = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Head>
        <title>Merch at Uniscroll</title>
        <meta name="description" content="Merch at Uniscroll" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {children}
    </>
  );
};

export default Merch;
