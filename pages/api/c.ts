import { NextApiHandler } from "next";
import * as admin from "firebase-admin";
import { uid, getEnvVariables } from "../../utils";

const serviceAccount: any = getEnvVariables();
const idLimit = process.env.idLimit;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://djm-sh-12d0e.firebaseio.com",
  });
}

const db = admin.firestore();

const createRedirect: NextApiHandler = async (req, res) => {
  const { url, custom } = req.query as { [key: string]: string };

  if (!url) return res.send("Improper params supplied");

  let data: string;

  async function create() {
    const rid = custom ? custom : uid(parseInt(idLimit));
    const redirectRef = db.collection("redirects").doc(rid);

    await redirectRef.get().then(async (doc) => {
      if (custom && doc.exists)
        return res.send(
          `A custom redirect has already been created here: ${
            doc.data().rurl
          } => ${url}`
        );

      if (doc.exists) return create();

      let rurl = custom ? `https://djm.sh/${custom}` : `https://djm.sh/${rid}`;
      data = rurl;

      await redirectRef.set({ url, rid, rurl, used: false });
    });

    return;
  }

  await create();

  res.send(data);
};

export default createRedirect;
