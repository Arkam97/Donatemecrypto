import axios from "axios";
import {
  dappBackend,
  StellarUrl,
  StellarNetwork,
  HUMANIssuerPublicKey,
  HUMANDistributorPublicKey
} from "variables/constants";
import { AES, enc } from "crypto-js";
import sha256 from "sha256";
import StellarSdk from "stellar-sdk";
const Keypair = StellarSdk.Keypair;
const Asset = StellarSdk.Asset;
StellarSdk.Network.useTestNetwork();
const jwt = require("jsonwebtoken");

export function hashEmail(email) {
  return sha256(email);
}
export function decryptSecret(secret, signer) {
  try {
    const decrypted = AES.decrypt(secret, signer);
    const plaintext = decrypted.toString(enc.Utf8);
    return plaintext;
  } catch (error) {
    return null;
  }
}
export function encyrptSecret(secret, signer) {
  try {
    const ciphertext = AES.encrypt(secret, signer);
    return ciphertext.toString();
  } catch (error) {
    return null;
  }
}
export async function signin(key, password) {
  try {
    let pash = hashEmail(password);
    //console.log(pash)
    let postBody = {
      key: key.toLowerCase(),
      password: pash
    };
    const res = await axios.post(dappBackend + "/login", postBody, {
      headers: {
        // 'Authorization': "bearer " + token,
        "Content-Type": "application/json"
      }
    });

    if (res != null) {
      if (res.status === 200) {
        // store.dispatch({
        //   type: "ADD_USER",
        //   text: "validating credentials"
        // });
        // localStorage.setItem("keypair", JSON.stringify(keypair))
        localStorage.setItem("token", res.data.data.token);
        return res.status;
      } else {
        return res.status;
      }
    } else {
      return null;
    }
  } catch (err) {
    return null;
  }
}

export async function signup(
  alias,
  email,
  password,
  keypair
) {
  try {
    let publicKey = keypair.publicKey();

    let pash = "";
    let encryptedSecret = "";


    if (password != "" ) {
      pash = hashEmail(password);
      encryptedSecret = encyrptSecret(keypair.secret(), pash);
    }

    let postBody = {
      alias: alias.toLowerCase(),
      email: email != "" ? email.toLowerCase() : "",
      publicKey: publicKey,
      encryptedSecret: encryptedSecret
    };

    await fundAccount(publicKey);
    // await AddHumanSigner(keypair);

    const res = await axios.post('http://localhost:5000/api/register', postBody, {
      headers: {
        // 'Authorization': "bearer " + token,
        "Content-Type": "application/json"
      }
    });

    if (res !== null) {
      if (res.status === 200) {
        ////console.log("Success:" + res.data.data.token)
        localStorage.setItem("token", res.data.data.token);

        return res.status;
      } else {
        // ////console.log("already: " + res.status)
        return res.status;
      }
    } else {
      return null;
    }
  } catch (err) {
    // ////console.log(err)
    return null;
  }
}
export async function fundAccount(publicKey) {
  try {
    if (StellarNetwork === "TestNet") {
      const STELLAT_FRIEND_BOT_URL = `https://friendbot.stellar.org/?addr=`;
      const stellarResponse = await axios.get(
        `${STELLAT_FRIEND_BOT_URL}${publicKey}`
      );

      if (stellarResponse !== null && stellarResponse.status !== 200) {
        return null;
      }
      return true;
    }
  } catch (err) {
    return null;
  }
}
// export async function AddHumanSigner(keypair) {
//   try {
//     var server = new StellarSdk.Server(StellarUrl);
//     const sourceAccount = await server.loadAccount(keypair.publicKey());
//     if (sourceAccount === null) {
//       return null;
//     }
//     const humanAccount = await server.loadAccount(HUMANDistributorPublicKey);
//     if (humanAccount === null) {
//       return null;
//     }
//     let transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
//       fee: StellarSdk.BASE_FEE,
//       networkPassphrase: StellarSdk.Networks.TESTNET
//     })
//       .addOperation(
//         StellarSdk.Operation.changeTrust({
//           // Because Stellar allows transaction in many currencies, you must
//           // specify the asset type. The special "native" asset represents Lumens.
//           asset: new Asset("LIFE", HUMANIssuerPublicKey),
//           // limit: "",
//           source: keypair.publicKey()
//         })
//       )
//       .addOperation(
//         StellarSdk.Operation.setOptions({
//           signer: {
//             ed25519PublicKey: HUMANDistributorPublicKey,
//             weight: 1
//           }
//         })
//       )
//       .addOperation(
//         StellarSdk.Operation.setOptions({
//           lowThreshold: 2,
//           medThreshold: 2,
//           highThreshold: 2
//         })
//       )
//       // .addMemo(StellarSdk.Memo.text(user.name))
//       .build();
//     // Sign the transaction to prove you are actually the person sending it.
//     transaction.sign(keypair);
//     // And finally, send it off to Stellar!
//     const transactionResponse = await server.submitTransaction(transaction);
//     if (transactionResponse === null) {
//       return null;
//     }
//     return 200;
//   } catch (e) {
//     //console.log(e)
//     return null;
//   }
// }
export async function addKyc(kycModel) {
  try {
    let token;
    if (localStorage.getItem("token") != null) {
      token = localStorage.getItem("token");
    }
    let postBody = kycModel;
    const res = await axios.post(dappBackend + "/kyc", postBody, {
      headers: {
        Authorization: "bearer " + token,
        "Content-Type": "application/json"
      }
    });

    if (res == null) {
      return null;
    }
    return res.status;
  } catch (err) {
    return null;
  }
}
export async function GetAccount(publicKey) {
  try {
    let token;
    if (localStorage.getItem("token") != null) {
      token = localStorage.getItem("token");
    }
    const res = await axios.get(dappBackend + "/users/" + publicKey, {
      headers: {
        Authorization: "bearer " + token,
        "Content-Type": "application/json"
      }
    });

    if (res != null) {
      if (res.status === 200) {
        return res.data.data;
      } else {
        return res.data.data;
      }
    } else {
      return null;
    }
  } catch (err) {
    return null;
  }
}

export async function SearchOrGetAccounts(Key) {
  try {
    let token;
    if (localStorage.getItem("token") != null) {
      token = localStorage.getItem("token");
    }

    const query = Key == "" ? "?key=" + Key : "";
    const res = await axios.get(dappBackend + "/users" + query, {
      headers: {
        Authorization: "bearer " + token,
        "Content-Type": "application/json"
      }
    });

    if (res != null) {
      if (res.status === 200) {
        return res.data.data;
      } else {
        return res.data.data;
      }
    } else {
      return null;
    }
  } catch (err) {
    return null;
  }
}

export async function getWalletBalance(publicKey) {
  try {
    let assets = [];

    var server = new StellarSdk.Server(StellarUrl);
    // the JS SDK uses promises for most actions, such as retrieving an account
    const account = await server.loadAccount(publicKey);
    if (account === null) {
      return null;
    }
    account.balances.forEach(function(balance) {
      // @ts-ignore
      // //////console.log('Asset_code:', balance.asset_code, ', Balance:', balance.balance);
      let bal = parseFloat(balance.balance);
      let lim = parseFloat(balance.limit);

      // @ts-ignore
      assets.push({
        assetCode: balance.asset_code,
        balance: bal.toFixed(0),
        limit: lim.toFixed(0)
      });
    });
    // assets.pop();
    //////console.log(assets)
    return assets;
  } catch (err) {
    return null;
  }
}
export function getUserSession() {
  if (localStorage.getItem("token") !== null) {
    // jwt.decode(localStorage.getItem("token"))
    const decodedToken = jwt.decode(localStorage.getItem("token"));
    if (decodedToken === null) {
      return null;
    } else {
      // //////console.log(decodedToken)
      return decodedToken;
    }
  }
}
// export async function TransferFund(
//   DestinationPublicKey,
//   Amount,
//   keypair,
//   sender,
//   assetName
// ) {
//   try {
//     var server = new StellarSdk.Server(StellarUrl);

//     const sourceAccount = await server.loadAccount(keypair.publicKey());
//     if (sourceAccount === null) {
//       return null;
//     }
//     let transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
//       fee: StellarSdk.BASE_FEE,
//       networkPassphrase: StellarSdk.Networks.TESTNET
//     })
//       .addOperation(
//         StellarSdk.Operation.payment({
//           destination: HUMANDistributorPublicKey,
//           asset: StellarSdk.Asset.native(),
//           amount: Amount
//         })
//       )
//       .addOperation(
//         StellarSdk.Operation.payment({
//           destination: keypair.publicKey(),
//           asset: new Asset(assetName, HUMANIssuerPublicKey),
//           amount: Amount,
//           source: HUMANDistributorPublicKey
//         })
//       )
//       .addOperation(
//         StellarSdk.Operation.payment({
//           destination: DestinationPublicKey,
//           asset: new Asset(assetName, HUMANIssuerPublicKey),
//           amount: Amount
//         })
//       )
//       .addMemo(StellarSdk.Memo.text(sender))
//       .build();
//     // Sign the transaction to prove you are actually the person sending it.
//     transaction.sign(keypair);

//     //console.log(transaction.toEnvelope().toXDR('base64'))
//     let token;
//     if (localStorage.getItem("token") != null) {
//       token = localStorage.getItem("token");
//     }

//     const res = await axios.post(
//       dappBackend + "/transactions/fund",
//       { xdr: transaction.toEnvelope().toXDR("base64") },
//       {
//         headers: {
//           Authorization: "bearer " + token,
//           "Content-Type": "application/json"
//         }
//       }
//     );

//     //console.log(res)
//     return res.status;
//   } catch (e) {
//     //console.log(e)
//     return null;
//   }
// }

