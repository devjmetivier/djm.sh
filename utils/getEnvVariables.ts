export const getEnvVariables = () => {
  const type = process.env.type;
  const project_id = process.env.project_id;
  const private_key_id = process.env.private_key_id;
  const client_email = process.env.client_email;
  const client_id = process.env.client_id;
  const auth_uri = process.env.auth_uri;
  const token_uri = process.env.token_uri;
  const auth_provider_x509_cert_url = process.env.auth_provider_x509_cert_url;
  const client_x509_cert_url = process.env.client_x509_cert_url;
  /**
   * The private key from Firebase comes in a similar format to an RSA key. It's
   * really difficult to store in an environment variable. So what we do is encode
   * the key to base64, and then decode it when we access the variable with Buffer
   * in Nodejs.
   */
  const private_key = Buffer.from(process.env.private_key, "base64").toString();

  return {
    type,
    project_id,
    private_key_id,
    private_key,
    client_email,
    client_id,
    auth_uri,
    token_uri,
    auth_provider_x509_cert_url,
    client_x509_cert_url,
  };
};
