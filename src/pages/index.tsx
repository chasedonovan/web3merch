import type { GetServerSideProps, NextPage } from "next";
import { useEffect, useState } from "react";
import GoatTribe from "./Goattribe";

type Props = { host: string | null };

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => ({ props: { host: context.req.headers.host || null } });

const Home: NextPage<Props> = () => {
  return (
    <>
      <GoatTribe></GoatTribe>
    </>
  );
};

export default Home;
