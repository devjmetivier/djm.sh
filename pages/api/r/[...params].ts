import { NextApiHandler } from "next";
import fetch from "isomorphic-unfetch";
import * as admin from "firebase-admin";
import { isIp, uid, getEnvVariables } from "../../../utils";

const serviceAccount: any = getEnvVariables();

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://djm-sh-12d0e.firebaseio.com",
  });
}

const db = admin.firestore();

const redirect: NextApiHandler = async (req, res) => {
  const {
    query: { params },
  } = req;
  let ref, docExists: boolean;

  if (params.length < 2)
    return res.send(
      "Redirect couldn't be completed. Not enough params supplied."
    );

  if (!isIp(params[1])) return res.send("Not a proper IP address");

  let batch = db.batch();
  const redirectRef = db.collection("redirects").doc(params[0]);
  const requestsRef = db
    .collection("redirects")
    .doc(params[0])
    .collection("requests")
    .doc(uid());

  await redirectRef.get().then((doc) => {
    docExists = doc.exists;
    ref = doc.data();
  });

  if (!docExists)
    return res.send(`Redirect does not exist for ID: ${params[0]}`);

  const ipify = await fetch(`https://ipapi.co/${params[1]}/json/`).then((x) =>
    x.json()
  );

  batch.update(redirectRef, { used: true });
  batch.set(requestsRef, { ...ipify, timestamp: Date.now() });

  await batch.commit();

  res.writeHead(308, { Location: ref.url, "Cache-Control": "max-age=60" });
  res.end();
  return;
};

export default redirect;
