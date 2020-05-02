import * as React from "react";
import { Text, Spinner, Row } from "@zeit-ui/react";
import { useRouter } from "next/router";

type YesNo = "yes" | "no";
interface UsedResponse {
  used: YesNo;
}

export default function Used() {
  const [used, setUsed] = React.useState<YesNo>();
  const {
    push,
    query: { rid },
  } = useRouter();

  React.useEffect(() => {
    rid &&
      fetch(`/api/used?rid=${rid}`)
        .then(async (x) => {
          const data: UsedResponse = await x.json();
          setUsed(data.used);
        })
        .catch(() => push("/404/doesnt-exist"));
  }, [rid]);

  return (
    <main
      style={{
        display: "flex",
        flexFlow: "column nowrap",
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
        height: "100vh",
      }}
    >
      <Row>
        <h3 style={{ marginRight: 4 }}>Used:</h3>
        {used ? (
          used === "yes" ? (
            <Text style={{ width: 40 }} h3 type="success">
              Yes
            </Text>
          ) : (
            <Text style={{ width: 40 }} h3 type="error">
              No
            </Text>
          )
        ) : (
          <div style={{ width: 40 }}>
            <Spinner size="large" />
          </div>
        )}
      </Row>
    </main>
  );
}
