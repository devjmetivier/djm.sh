import { Row, Spacer, Card, Code, User, Link } from "@zeit-ui/react";

const code = `https://djm.sh/9nGKZV

https://djm.sh/example`;

export default function Index() {
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
      <Row justify="center">
        <h1>djm.sh</h1>
      </Row>
      <Card style={{ maxWidth: 540 }}>
        <h4>About</h4>
        <p>
          This site functions as a URL shortener service. Short URL's can be
          either generated or custom:
        </p>
        <p>
          <Code block>{code}</Code>
        </p>
        <p>
          Some information is collected when a URL is used. Requests are cached
          frequently to prevent misuse and protect data quotas.
        </p>
      </Card>
      <Spacer y={1} />
      <Row style={{ maxWidth: 540, width: "100%" }} justify="space-between">
        <User
          src="https://www.gravatar.com/avatar/0ba730c920839c918114571f6672e5a5"
          name="Devin Metivier"
        >
          <User.Link href="https://twitter.com/devjmetivier">
            @devjmetivier
          </User.Link>
        </User>

        <Link href="/this" pure block>
          Github
        </Link>
      </Row>
    </main>
  );
}
