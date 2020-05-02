import { NextApiHandler } from "next";
import fetch from "isomorphic-unfetch";
import * as admin from "firebase-admin";

import { isIp, uid, getEnvVariables } from "../../../utils";

export interface IPIFY {
  asn: string;
  city: string;
  continent_code: string;
  country: string;
  country_area: string;
  country_calling_code: string;
  country_capital: string;
  country_code: string;
  country_code_iso3: string;
  country_name: string;
  country_population: number;
  country_tld: string;
  currency: string;
  currency_name: string;
  in_eu: boolean;
  ip: string;
  languages: string;
  latitude: number;
  longitude: number;
  org: string;
  postal: string;
  region: string;
  region_code: string;
  timezone: string;
  utc_offset: string;
}

const serviceAccount: any = getEnvVariables();

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://djm-sh-12d0e.firebaseio.com",
  });
}

const db = admin.firestore();

const redirectWithParams: NextApiHandler = async (req, res) => {
  const {
    query: { params },
  } = req;

  if (params.length < 2)
    return res.send(
      "Redirect couldn't be completed. Not enough params supplied."
    );

  let rid = params[0];
  let ip = params[1];
  let err = params[2];

  console.log("rid: ", rid);
  console.log("ip: ", ip);
  console.log("err: ", err);

  let ref, docExists: boolean;

  if (!isIp(ip) && ip !== "undefined")
    return res.send("Not a proper IP address");

  const redirect = async (error?: any) => {
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

    let userData: IPIFY | any;

    if (error) {
      userData = {
        message: "There was an problem grabbing the user's IP address.",
        error,
      };
    } else {
      userData = await fetch(`https://ipapi.co/${params[1]}/json/`)
        .then((x) => x.json())
        .catch((err) => {
          res.send(`Error with ipify call: ${err}`);
        });
    }

    let batch = db.batch();
    batch.update(redirectRef, { used: true });
    batch.set(requestsRef, { ...userData, timestamp: Date.now() });
    await batch.commit();

    return;
  };

  await redirect(err);

  res.writeHead(308, { Location: ref.url, "Cache-Control": "max-age=60" });
  res.end();
  return;
};

export default redirectWithParams;
