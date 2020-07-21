import {Usercontainer} from "../container/usercontainer";
import uuid from "uuid";
import Fuse from "fuse.js";
import { AES, enc } from "crypto-js";
import * as jwt from "jsonwebtoken";


function decyrptSecret(secret, signer) 
{
  try {
    const decrypted = AES.decrypt(secret, signer);
    const plaintext = decrypted.toString(enc.Utf8);
    return plaintext;
  } catch (error) {
    return null;
  }
}

function tokenViewer(event)
{
  if (typeof event.headers.Authorization === "undefined") {
    return null;
  }
  const split = event.headers.Authorization.split(" ");
  if (split.length !== 2) {
    return null;
  }
  const token = split[1].trim();
  const tokenPayload = jwt.verify(token, "ijk3dp4n");
  if (tokenPayload) {
    return tokenPayload;
  }
};

export class Userroutes{
  async login(event) {
    try {
      const requestBody = JSON.parse(event.body);

      let user = await Usercontainer.getUserByEmail(requestBody.key);
      if (user.data == null) {
        user = await Usercontainer.getUserByAlias(requestBody.key);
        if (user.data == null) {
          return {
            code: 201,
            message: "account not found",
            data: null,
          };
        }
      }

      const secret = decyrptSecret(
        user.data.encryptedSecret,
        requestBody.password
      );
      if (user.data.publicKey == Keypair.fromSecret(secret).publicKey()) {
        let tokenBody = user.data;
        tokenBody.exp = Math.floor(new Date().getTime() / 1000.0) + 12000;
        var token = jwt.sign(tokenBody, process.env.jwt_secret);
        return {
          code: 200,
          message: "success",
          data: { token: token },
        };
      } else {
        return {
          code: 202,
          message: "password is incorrect",
          data: null,
        };
      }
    } catch (err) {
      return {
        code: 202,
        message: "password is incorrect",
        data: null,
      };
    }
  }

  
  async register(req) {
    try {
      const requestBody = JSON.parse(req.body);
      if (requestBody.authType == 0) {
        let existingEmailUser = await Usercontainer.getUserByEmail(
          requestBody.email
        );
        if (existingEmailUser.data != null) {
          return {
            code: 201,
            message: "email already used",
            data: null,
          };
        }
      }

      let existingAliasUser = await Usercontainer.getUserByAlias(
        requestBody.alias
      );
      if (existingAliasUser.data != null) {
        return {
          code: 202,
          message: "alias already used",
          data: null,
        };
      }

      let user = await Usercontainer.addUser(requestBody);
      if (user.data != null) {
        let tokenBody = user.data;
        tokenBody.exp = Math.floor(new Date().getTime() / 1000.0) + 12000;
        var token = jwt.sign(tokenBody, process.env.jwt_secret);
        return {
          code: 200,
          message: "success",
          data: { token: token },
        };
      }
    } catch (err) {
      return {
        code: 400,
        message: "registration failed",
        data: null,
      };
    }
  }

  async getAccount(event) {
    try {
      let existingUser = await Usercontainer.getUserByPublicKey(
        event.pathParameters.id
      );
      if (existingUser.data == null) {
        return {
          code: 201,
          message: "account not found",
          data: null,
        };
      }
      const tokenPayload = tokenViewer(event);
      if (tokenPayload["publicKey"] != existingUser.data.publicKey) {
        return {
          code: 200,
          message: "success",
          data: {
            publicKey: existingUser.data.publicKey,
            email: existingUser.data.email,
            alias: existingUser.data.alias,
            verified: true,
          },
        };
      }

      return {
        code: 200,
        message: "success",
        data: existingUser.data,
      };
    } catch (err) {
      return {
        code: 400,
        message: "retrieving account failed",
        data: null,
      };
    }
  }
  async searchAccounts(event) {
    try {
      let existingUser = await Usercontainer.listUsers();
      if (existingUser.data == null) {
        return {
          code: 201,
          message: "accounts not found",
          data: null,
        };
      }

      let response = [];
      if (event.queryStringParameters && event.queryStringParameters.key) {
        const options = {
          useExtendedSearch: true,
          includeScore: false,
          keys: ["alias", "publicKey"],
        };

        // Create a new instance of Fuse
        const fuse = new Fuse(existingUser.data, options);
        // Now search for 'Man'
        const result = fuse.search(event.queryStringParameters.key);

        result.forEach((res) => {
          response.push(res.item);
        });
      } else {
        response = existingUser.data;
      }

      return {
        code: 200,
        message: "success",
        data: response,
      };
    } catch (err) {
      console.log(err);
      return {
        code: 400,
        message: "retrieving accounts failed",
        data: null,
      };
    }
  }

  async addInitiative(event) {
    try {
      const tokenPayload = tokenViewer(event);
      if (!tokenPayload.verified) {
        return {
          code: 202,
          message: "kyc approval pending",
          data: null,
        };
      }

      const existingInitiative = await Usercontainer.getInitiativeByOwner(
        tokenPayload.publicKey
      );
      if (existingInitiative.data != null) {
        return {
          code: 203,
          message: "You can only create one initiative at a time",
          data: null,
        };
      }

      const requestBody = JSON.parse(event.body);
      // Create unique bucket name
      var bucketName = "corona-client-imagesdev-dev";
      // Create name for uploaded object key
      var keyName = uuid.v4();

      // Create a promise on S3 service object
      var s3Bucket = new AWS.S3({ params: { Bucket: bucketName } });

      let buf = Buffer.from(
        requestBody.cover.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );
      var data = {
        Bucket: bucketName,
        Key: keyName,
        Body: buf,
        ContentEncoding: "base64",
        ContentType: "image/jpeg",
        ACL: "public-read",
      };
      s3Bucket.putObject(data, function (err, data) {
        if (err) {
          console.log(err);
          console.log("Error uploading data: ", data);
        } else {
          requestBody.cover =
            "https://corona-client-imagesdev-dev.s3.us-east-1.amazonaws.com/" +
            keyName;
          console.log(data);
          console.log("succesfully uploaded the image!");
        }
      });

      let initiative = await Usercontainer.addInitiative(requestBody);
      if (initiative.data == null) {
        return {
          code: 201,
          message: "Initiative Creation Failed",
          data: null,
        };
      }
      return {
        code: 200,
        message: "Success",
        data: initiative.data,
      };
    } catch (err) {
      return {
        code: 400,
        message: "Initiative Creation Failed",
        data: null,
      };
    }
  }

  async editInitiative(event) {
    try {
      const requestBody = JSON.parse(event.body);

      let existinginitiative = await Usercontainer.getInitiative(
        event.pathParameters.id
      );
      if (existinginitiative.data == null) {
        return {
          code: 201,
          message: "initiative not found",
          data: null,
        };
      }
      const tokenPayload = tokenViewer(event);
      if (tokenPayload["publicKey"] != existinginitiative.data.creator) {
        return {
          code: 202,
          message: "you are not the owner",
          data: null,
        };
      }
      let initiative = await Usercontainer.editInitiative(
        event.pathParameters.id,
        requestBody
      );
      if (initiative.data == null) {
        return {
          code: 203,
          message: "Initiative Modification Failed",
          data: null,
        };
      }
      return {
        code: 200,
        message: "Success",
        data: initiative.data,
      };
    } catch (err) {
      return {
        code: 400,
        message: "Initiative Modification Failed",
        data: null,
      };
    }
  }

  async deleteInitiative(event) {
    try {
      let existinginitiative = await Usercontainer.getInitiative(
        event.pathParameters.id
      );
      if (existinginitiative.data == null) {
        return {
          code: 201,
          message: "initiative not found",
          data: null,
        };
      }
      const tokenPayload = tokenViewer(event);
      if (tokenPayload["publicKey"] != existinginitiative.data.creator) {
        return {
          code: 202,
          message: "you are not the owner",
          data: null,
        };
      }
      let initiative = await Usercontainer.deleteInitiative(
        event.pathParameters.id
      );
      if (initiative.data == null) {
        return {
          code: 201,
          message: "Initiative Deletion Failed",
          data: null,
        };
      }
      return {
        code: 200,
        message: "Success",
        data: initiative.data,
      };
    } catch (err) {
      return {
        code: 400,
        message: "Initiative Deletion Failed",
        data: null,
      };
    }
  }

  async getInitiative(event) {
    try {
      let initiative = await Usercontainer.getInitiative(
        event.pathParameters.id
      );
      if (initiative.data == null) {
        return {
          code: 201,
          message: "initiative not found",
          data: null,
        };
      }

      return {
        code: 200,
        message: "Success",
        data: initiative.data,
      };
    } catch (err) {
      return {
        code: 400,
        message: "get initiative failed",
        data: null,
      };
    }
  }
  async listInitiatives() {
    try {
      let initiative = await Usercontainer.listInitiatives();
      if (initiative.data == null) {
        return {
          code: 201,
          message: "initiatives not found",
          data: null,
        };
      }

      return {
        code: 200,
        message: "Success",
        data: initiative.data,
      };
    } catch (err) {
      return {
        code: 400,
        message: "list initiative failed",
        data: null,
      };
    }
  }

  async searchInitiatives(event) {
    try {
      let initiative = await Usercontainer.listInitiatives();
      if (initiative.data == null) {
        return {
          code: 201,
          message: "initiatives not found",
          data: null,
        };
      }

      let response = [];
      if (event.queryStringParameters && event.queryStringParameters.key) {
        const options = {
          // includeScore: true,
          useExtendedSearch: true,
          keys: ["name", "description", "creator"],
        };

        // Create a new instance of Fuse
        const fuse = new Fuse(initiative.data, options);

        // Now search for 'Man'
        const result = fuse.search(event.queryStringParameters.key);
        result.forEach((res) => {
          response.push(res.item);
        });
      } else {
        response = initiative.data;
      }

      return {
        code: 200,
        message: "success",
        data: response,
      };
    } catch (err) {
      return {
        code: 400,
        message: "search failed",
        data: null,
      };
    }
  }

  async fundTransaction(event) {
    try {
      var server = new StellarSdk.Server(process.env.StellarUrl);
      const requestBody = JSON.parse(event.body);
      const parsedTx = new Transaction(requestBody.xdr);
      let publicKey = parsedTx.source;

      let user = await Usercontainer.getUserByPublicKey(publicKey);
      if (user.data == null) {
        return {
          code: 201,
          message: "account not found",
          data: null,
        };
      }

      const operation = parsedTx.operations[2];
      const tokenPayload = tokenViewer(event);
      if (operation.destination == tokenPayload.publicKey) {
        return {
          code: 202,
          message: "You cannot fund yourself",
          data: null,
        };
      }

      let humanKeypair = Keypair.fromSecret(process.env.HumanDistributorSecret);
      parsedTx.sign(humanKeypair);
     

      const stellarResponse = await server.submitTransaction(parsedTx);
      if (stellarResponse == null) {
        return {
          code: 203,
          message: "insufficient fund in account",
          data: null,
        };
      }
      // console.log(stellarResponse);

      return {
        code: 200,
        message: "success",
        data: null,
      };
    } catch (err) {
      console.log(err);
      return {
        code: 400,
        message: "Funding Failed",
        data: null,
      };
    }
  }

  async addKYC(event) {
    try {
      const tokenPayload = tokenViewer(event);
      console.log(tokenPayload);
      const existingKYC = await Usercontainer.getKYCByPublicKey(
        tokenPayload.publicKey
      );

      if (existingKYC.data != null) {
        if (existingKYC.data.approved) {
          return {
            code: 201,
            message: "Kyc already approved",
            data: null,
          };
        }
        return {
          code: 202,
          message: "Kyc is pending approval",
          data: null,
        };
      }

      const requestBody = JSON.parse(event.body);
      requestBody.publicKey = tokenPayload.publicKey;

      let kyc = await Usercontainer.addKYC(requestBody);
      if (kyc.data == null) {
        return {
          code: 203,
          message: "Kyc Creation Failed",
          data: null,
        };
      }
      return {
        code: 200,
        message: "Success",
        data: kyc.data,
      };
    } catch (err) {
      console.log(err);
      return {
        code: 400,
        message: "Kyc Creation Failed",
        data: null,
      };
    }
  }
} 

