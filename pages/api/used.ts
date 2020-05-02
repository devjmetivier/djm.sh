import { NextApiHandler } from "next";
import * as admin from "firebase-admin";

import { getEnvVariables } from "../../utils";

const serviceAccount: any = getEnvVariables();

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://djm-sh-12d0e.firebaseio.com",
  });
}

const db = admin.firestore();

const used: NextApiHandler = async (req, res) => {
  const { rid } = req.query as { [key: string]: string };

  if (!rid) {
    res.writeHead(404, { Location: "/404/doesnt-exist" });
    res.end();
  }

  const usedRef = db.collection("redirects").doc(rid);

  const usedResponse = await usedRef.get().then((redirect) => {
    if (!redirect.exists) {
      res.writeHead(404, { Location: "/404/doesnt-exist" });
      res.end();
    }

    const data = redirect.data();

    if (!data.used) return "no";

    return "yes";
  });

  res.send({ used: usedResponse });
  return;
};

export default used;
