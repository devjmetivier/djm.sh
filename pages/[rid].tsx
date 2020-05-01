import * as React from "react";
import { useRouter } from "next/router";
import { Row, Loading } from "@zeit-ui/react";

export default function RedirectID() {
  const { push, query } = useRouter();
  const [ip, setIP] = React.useState();

  React.useEffect(() => {
    const getIp = async () => {
      const ip = await fetch("https://api.ipify.org?format=json")
        .then((x) => x.json())
        .then((x) => x.ip);

      setIP(ip);
    };

    if (query.rid && ip) push(`/api/r/${query.rid}/${ip}`);

    !ip && getIp();
  });

  return (
    <Row style={{ height: "100vh" }}>
      <Loading size="large" />
    </Row>
  );
}
