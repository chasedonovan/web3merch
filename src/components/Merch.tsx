import React, { PropsWithChildren } from "react";
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
