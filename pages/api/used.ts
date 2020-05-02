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
  const usedDoc = await usedRef.get();

  if (!usedDoc.exists) return res.status(404).send("nada");

  const data = usedDoc.data();
  if (!data.used) return res.status(200).send({ used: "no" });

  return res.status(200).send({ used: "yes" });
};

export default used;
