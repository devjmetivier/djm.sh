export default function DoesntExist() {
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
      <h3>404</h3>
      <p>The short URL you tried to use doesn't exist</p>
    </main>
  );
}
