import * as React from "react";
import { Row, Loading } from "@zeit-ui/react";
import { useRouter } from "next/router";

import { IPIFY } from "./api/r/[...params]";

export default function RedirectID() {
  const { push, query } = useRouter();
  const [ip, setIP] = React.useState<string | "undefined">();
  const [error, setError] = React.useState<any | undefined>("");

  React.useEffect(() => {
    const getIp = () =>
      fetch("https://api.ipify.org?format=json")
        .then(async (x) => {
          const res: IPIFY = await x.json();
          setIP(res.ip);
        })
        .catch((err) => {
          setError(err);
          setIP("undefined");
        });

    if (query.rid && ip)
      push(`/api/r/${query.rid}/${ip}${error && `/${error}`}`);

    !ip && getIp();
  });

  return (
    <Row style={{ height: "100vh" }}>
      <Loading size="large" />
    </Row>
  );
}
