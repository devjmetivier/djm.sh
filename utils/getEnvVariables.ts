export const getEnvVariables = () => {
  const type = process.env.type;
  const project_id = process.env.project_id;
  const private_key_id = process.env.private_key_id;
  const private_key = new Buffer(process.env.private_key, "base64").toString();
  const client_email = process.env.client_email;
  const client_id = process.env.client_id;
  const auth_uri = process.env.auth_uri;
  const token_uri = process.env.token_uri;
  const auth_provider_x509_cert_url = process.env.auth_provider_x509_cert_url;
  const client_x509_cert_url = process.env.client_x509_cert_url;

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
