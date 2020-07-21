import { ObjectId } from "mongodb";
const user = require('../models/model');
const campaign = require('../models/model');
const kyc = require('../models/model');


export class usercontainer {
    async getUserById(id) {
    try {     
      const cursor = await user.aggregate([
        {
          $match: {
            _id: id,
          },
        },
        {
          $lookup: {
            from: "kyc",
            localField: "publicKey",
            foreignField: "publicKey",
            as: "kycList",
          },
        },
      ]);

      let result = [];
      await cursor.forEach((item) => {
        let user = item;
        user.kyc = item.kycList.length > 0 ? "Pending" : null;
        if (item.kycList.length > 0 && item.kycList[0].approved) {
          user.kyc = "Approved";
        }
        delete user["kycList"]
        result.push(user);
      });
      return {
        code: 200,
        message: "",
        data: result.length > 0 ? result[0] : null,
      };
    } catch (e) {
      return {
        code: 400,
        message: "failed",
        data: null,
      };
    }
  }

  async getUserByAlias(alias) {
    try {     
      const cursor = await user.aggregate([
        {
          $match: {
            alias: alias,
          },
        },
        {
          $lookup: {
            from: "kyc",
            localField: "publicKey",
            foreignField: "publicKey",
            as: "kycList",
          },
        },
      ]);

      let result = [];
      await cursor.forEach((item) => {
        let user = item;
        user.kyc = item.kycList.length > 0 ? "Pending" : null;
        if (item.kycList.length > 0 && item.kycList[0].approved) {
          user.kyc = "Approved";
        }
        delete user["kycList"]
        result.push(user);
      });
      return {
        code: 200,
        message: "",
        data: result.length > 0 ? result[0] : null,
      };
    } catch (e) {
      return {
        code: 400,
        message: "failed",
        data: null,
      };
    }
  }
  async getUserByEmail(email) {
    try {
      const cursor = await user.aggregate([
        {
          $match: {
            email: email,
          },
        },
        {
          $lookup: {
            from: "kyc",
            localField: "publicKey",
            foreignField: "publicKey",
            as: "kycList",
          },
        },
      ]);

      let result = [];
      await cursor.forEach((item) => {
        let user = item;
        user.kyc = item.kycList.length > 0 ? "Pending" : null;
        if (item.kycList.length > 0 && item.kycList[0].approved) {
          user.kyc = "Approved";
        }
        delete user["kycList"]
        result.push(user);
      });
      return {
        code: 200,
        message: "",
        data: result.length > 0 ? result[0] : null,
      };
    } catch (e) {
      return {
        code: 400,
        message: "failed",
        data: null,
      };
    }
  }

  async getUserByPublicKey(publicKey) {
    try {
      const cursor = await user.aggregate([
        {
          $match: {
            publicKey: publicKey,
          },
        },
        {
          $lookup: {
            from: "kyc",
            localField: "publicKey",
            foreignField: "publicKey",
            as: "kycList",
          },
        },
      ]);

      let result = [];
      await cursor.forEach((item) => {
        let user = item;
        user.kyc = item.kycList.length > 0 ? "Pending" : null;
        if (item.kycList.length > 0 && item.kycList[0].approved) {
          user.kyc = "Approved";
        }
        delete user["kycList"]
        result.push(user);
      });
      return {
        code: 200,
        message: "",
        data: result.length > 0 ? result[0] : null,
      };
    } catch (e) {
      return {
        code: 400,
        message: "failed",
        data: null,
      };
    }
  }

 async addUser(User) {
    const schema = User;
    try {    
      // schema.verified = false;
      // schema.type = "2";
      // schema.createdAt = new Date().toISOString();
      schema._id = new ObjectId().toHexString();
      const dbResponse = await user.insertOne(schema);

      return {
        code: 200,
        message: "success",
        data: dbResponse ? schema : null,
      };
      // }
    } catch (e) {
      return {
        code: 400,
        message: e.errmsg,
        data: null,
      };
    }
  }

 async addKYC(KYC) {
    const schema= KYC;
    try {      
      schema.approved = false;
      schema.createdAt = new Date().toISOString();
      schema._id = new ObjectId().toHexString();
      const dbResponse = await kyc.insertOne(schema);

      return {
        code: 200,
        message: "success",
        data: dbResponse ? schema : null,
      };
      // }
    } catch (e) {
      return {
        code: 400,
        message: e.errmsg,
        data: null,
      };
    }
  }

  async getKYCByPublicKey(publicKey) {
    try {
      const cursor = await kyc.aggregate([
        {
          $match: {
            publicKey: publicKey,
          },
        },
      ]);

      let result = [];
      await cursor.forEach((item) => {
        result.push(item);
      });
      return {
        code: 200,
        message: "",
        data: result.length > 0 ? result[0] : null,
      };
    } catch (e) {
      return {
        code: 400,
        message: "failed",
        data: null,
      };
    }
  }

  async editUser(email , User) {
    const schema = User;
    try {
      schema.updatedAt = new Date().toISOString();

      const dbResponse = await user.updateOne(
        { email: email },
        {
          $set: schema,
        }
      );
      return {
        code: 200,
        message: "success",
        data: dbResponse ? schema : null,
      };
    } catch (e) {
      console.log(e);
      return {
        code: 400,
        message: e.errmsg,
        data: null,
      };
    }
  }

  async deleteUser(email) {
    try {
      return {
        code: 200,
        message: "success",
        data: (await user.findOneAndDelete({ email: email }))
          ? { email: email }
          : null,
      };
    } catch (e) {
      console.log(e);
      return {
        code: 400,
        message: e.errmsg,
        data: null,
      };
    }
  }

  async listUsers() {
    try {
      const cursor = await user.aggregate([
        {
          $match: {
            verified: true,
          },
        },
      ]);
      // .limit(20);
      let result = [];
      await cursor.forEach((item) => {
        result.push({
          _id: item._id,
          alias: item.alias,
          email: item.email,
          publicKey: item.publicKey,
        });
      });

      // console.log(result);
      return {
        code: 200,
        message: "",
        data: result,
      };
    } catch (e) {
      return {
        code: 400,
        message: "failed",
        data: null,
      };
    }
  }
  async addInitiative(Campaign) {
    const schema = Campaign;
    try {
      schema.createdAt = new Date().toISOString();
      schema._id = new ObjectId().toHexString();
      const dbResponse = await campaign.insertOne(schema);
      return {
        code: 200,
        message: "success",
        data: dbResponse ? schema : null,
      };
      // }
    } catch (e) {
      console.log(e);
      return {
        code: 400,
        message: e.errmsg,
        data: null,
      };
    }
  }

  async editInitiative(id,Campaign) {
    const schema = Campaign;
    try {
      schema.updatedAt = new Date().toISOString();

      const dbResponse = await campaign.updateOne(
        { _id: id },
        {
          $set: schema,
        }
      );
      return {
        code: 200,
        message: "success",
        data: dbResponse ? schema : null,
      };
    } catch (e) {
      console.log(e);
      return {
        code: 400,
        message: e.errmsg,
        data: null,
      };
    }
  }

  async deleteInitiative(id) {
    try {
      return {
        code: 200,
        message: "success",
        data: (await campaign.findOneAndDelete({ _id: id })) ? { _id: id } : null,
      };
    } catch (e) {
      console.log(e);
      return {
        code: 400,
        message: e.errmsg,
        data: null,
      };
    }
  }

  async listInitiatives() {
    try {
      const cursor = await campaign.find({});
      let result = [];
      await cursor.forEach((item) => {
        result.push(item);
      });

      return {
        code: 200,
        message: "",
        data: result,
      };
    } catch (e) {
      return {
        code: 400,
        message: "failed",
        data: null,
      };
    }
  }
  
  async getInitiative(id) {
    try {
      const cursor = await campaign.aggregate([
        {
          $match: {
            _id: id,
          },
        },
      ]);

      let result = [];
      await cursor.forEach((item) => {
        result.push(item);
      });
      return {
        code: 200,
        message: "",
        data: result.length > 0 ? result[0] : null,
      };
    } catch (e) {
      return {
        code: 400,
        message: "failed",
        data: null,
      };
    }
  }

  async getInitiativeByOwner(publicKey) {
    try {     
      const cursor = await campaign.aggregate([
        {
          $match: {
            creator: publicKey,
          },
        },
      ]);

      let result = [];
      await cursor.forEach((item) => {
        result.push(item);
      });
      return {
        code: 200,
        message: "",
        data: result.length > 0 ? result[result.length - 1] : null,
      };
    } catch (e) {
      return {
        code: 400,
        message: "failed",
        data: null,
      };
    }
  }
}
