
import type { GetServerSideProps, NextPage } from "next";
import { useEffect, useState } from "react";

type Props = { host: string | null };

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => ({ props: { host: context.req.headers.host || null } });

const Home: NextPage<Props> = ({ host }) => {
  const [applicationHost, setApplicationHost] = useState("default");
  useEffect(() => setApplicationHost(host ? host : "app.uniscroll.io"), []);

  return (
      <>

      </>
  );
};

export default Home;
