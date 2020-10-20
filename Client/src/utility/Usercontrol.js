import axios from "axios";
import sha256 from "sha256";
import StellarSdk from "stellar-sdk";

const jwt = require("jsonwebtoken");
var FormData = require("form-data");
var util = require('util');

export function hashvalue(value) {
  return sha256(value);
}

export async function signin(username, pwd) {
  try {
    let hashpwd = hashvalue(pwd);
    let postBody = {
      username: username,
      hashpwd: hashpwd
    };
    console.log(postBody);
    const res = await axios.post('http://localhost:5000/api/signin', postBody, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (res != null) {
      if (res.status === 200)
      {
        const  token  = res.data;
        console.log(token);
        localStorage.setItem("token",token);
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


export async function friendbotaccount(pubkey)
{
  try {

    let Accountassets = [];  
    const server = new StellarSdk.Server("https://horizon-testnet.stellar.org");

      const response = await axios.get(
      `https://friendbot.stellar.org?addr=${encodeURIComponent(
        pubkey,
        )}`,
      );
  
      if(response.status === 200)
      {
        const account = await server.loadAccount(pubkey);
        
        account.balances.forEach(function (balance) {
          let bal = parseFloat(balance.balance)
          Accountassets.push({'balance': bal.toFixed(0)})
        });

        return Accountassets[0].balance;
      }
    
    } catch (err) {
      return null;
  }
}

export async function getaccountbalance(publicKey)
{
  try{
        let Accountassets = [];    
        const server = new StellarSdk.Server("https://horizon-testnet.stellar.org");
        
        const account = await server.loadAccount(publicKey);
        
        if (account === null) {
          console.log("Account not found");
          return null;
        }

        account.balances.forEach(function (balance) {
          let bal = parseFloat(balance.balance)
          Accountassets.push({'balance': bal.toFixed(0)})
        });

        return Accountassets[0].balance;

  }catch(err)
  {
    return null;
  }
}



export async function signup( username, useremail,pwd,publickey) {
  try {

    let hashpwd = hashvalue(pwd);

    const bal = await friendbotaccount(publickey);

    let postBody = {
      username: username,
      useremail: useremail,
      hashpwd:hashpwd,
      publicKey: publickey,
      balance: bal,
      approve : 0,
      campapprove : 0,
      count: 0,
      type : "user"
    };  

    const res = await axios.post('http://localhost:5000/api/signup',postBody, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (res !== null) {
      if (res.status === 200) {
        const  token   = res.data;
        console.log(token);
        localStorage.setItem("token",token);
        return res.status;
      }
      else {
        return res.status;
      }
    } else {
      return null;
    }
    
  } catch (err) {
    return null;
  }
}

export function getUserSession() {
  if (localStorage.getItem("token") !== null) {
    const decodedToken = jwt.decode(localStorage.getItem("token"));
    if (decodedToken === null) {
      return null;
    } else {
       return decodedToken.tokenBody;      
    }
  }
}

export async function GetAccount(publicKey) {
  try {
    let token;
    if (localStorage.getItem("token") != null) {
      token = localStorage.getItem("token");
    }
    const res = await axios.get( ` http://localhost:5000/api/users/${publicKey} `, {
      headers: {
        'Authorization': "bearer " + token,
        "Content-Type": "application/json"
      }
    });

    if (res != null) {
      if (res.status === 200) {
        // console.log(res);
        return res;
      } else {
        return res;
      }
    } else {
      return null;
    }
  } catch (err) {
    return null;
  }
}

export async function createKyc(nid,birthdate,front,back,facefront,offletter,fname,telno,addressone,addresstwo) {
  try {
    let user = getUserSession();
    let userid = user.publicKey;

    let Kycapprove = 0;

    let token;
    if (localStorage.getItem("token") != null) {
      token = localStorage.getItem("token");
    }
    const formData = new FormData();
    formData.append("nid",nid); 
    formData.append("birthdate",birthdate); 
    formData.append("image",front); 
    formData.append("image",back); 
    formData.append("image",facefront); 
    formData.append("image",offletter); 
    formData.append("fname",fname); 
    formData.append("telno",telno); 
    formData.append("addressone",addressone); 
    formData.append("addresstwo",addresstwo);
    formData.append("userid",userid);
    formData.append("Kycapprove",Kycapprove);

    console.log("for "+formData)

    const res = await axios.post( 'http://localhost:5000/api/createkyc',formData,
    {
      headers: {
        'Authorization': "bearer " + token,
        "Content-Type": "multipart/form-data",
      }
    });

    if (res == null) {
      return null
    }
    return res.status;
  } catch (err) {
    return null;
  }
}

export async function addcampaign( image,campaignname, amount, story,targetdate,) {
  try {
    let user = getUserSession();
    let token;
    if (localStorage.getItem("token") != null) {
      token = localStorage.getItem("token");
    }
    const userid = user.publicKey;
    const Campapprove = 0;
    const collect = 0;
    const likecount= 0;

    const form = new FormData();
    form.append("userid",userid); 
    form.append("image",image); 
    form.append("campaignname",campaignname); 
    form.append("amount",amount); 
    form.append("story",story); 
    form.append("targetdate",targetdate);
    form.append("Campapprove",Campapprove);
    form.append("collect",collect);
    form.append("likecount",likecount);

    const res = await axios.post('http://localhost:5000/api/createcampaign', form, 
    {
      headers: {
        Authorization: "bearer " + token,
        "Content-Type": "multipart/form-data",
      }
    });

    if (res != null) {
      if (res.status == 200) {
        return res;
      } else {
        return res;
      }
    } else {
      return null;
    }
  } catch (err) {
    //console.log(err);
    return null;
  }
}

export async function getallunapprovedcampaigns() {
  try {
    const response = await axios.get('http://localhost:5000/api/getall_unapproved_campaigns', {
      headers: {
        "Content-Type": "application/json"
      }
    });
    console.log(response);

    if (response != null) {
      switch (response.status) {
        case 200:
          return response.data;
        case 201:
          return null;
      }
    } else {
      return null;
    }
  } catch (err) {
    return null;
  }
}

export async function getallapprovedcampaigns() {
  try {
    const response = await axios.get('http://localhost:5000/api/getall_approved_campaigns', {
      headers: {
        "Content-Type": "application/json"
      }
    });
    console.log(response);

    if (response != null) {
      switch (response.status) {
        case 200:
          return response.data;
        case 201:
          return null;
      }
    } else {
      return null;
    }
  } catch (err) {
    return null;
  }
}

export async function getallunapprovedKycs() {
  try {
    const response = await axios.get('http://localhost:5000/api/getall_unapproved_Kycs', {
      headers: {
        "Content-Type": "application/json"
      }
    });
    // console.log(response);

    if (response != null) {
      switch (response.status) {
        case 200:
          return response.data;
        case 201:
          return null;
      }
    } else {
      return null;
    }
  } catch (err) {
    return null;
  }
}

export async function getallendcampaigns() {
  try {
    const response = await axios.get('http://localhost:5000/api/getall_ended_campaigns', {
      headers: {
        "Content-Type": "application/json"
      }
    });
    // console.log(response);

    if (response != null) {
      switch (response.status) {
        case 200:
          return response.data;
        case 201:
          return null;
      }
    } else {
      return null;
    }
  } catch (err) {
    return null;
  }
}


export async function getcampaignbyid(id) {
  try {
    const response = await axios.get(`http://localhost:5000/api/campaign/${id}`, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    console.log(response);

    if (response != null) {
      switch (response.status) {
        case 200:
          return response.data;
          
        case 201:
          return null;
      }
    } else {
      return null;
    }
  } catch (err) {
    return null;
  }
}

export async function edituserdetails(data,userid,detail)
{
  console.log("print" + data);
    try
  {
    let postBody = {
      data : data,
      userid: userid,
      detail: detail,
      
    };  
    const response = await axios.post('http://localhost:5000/api/edituser',postBody, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    if(response.status == 200)
    {
      const  token   = response.data;
      localStorage.setItem("token",token);
      return response.status;
    }
    else {
      return null;
    }
  }
  catch(err)
  {
    return null
  }
}


export async function MakeFundTransaction(amount,sendersecretkey, senderpublickey , reciverpublickey, campaignid, collected, target) {

  try {
    const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

    var sourceKeys = StellarSdk.Keypair.fromSecret(sendersecretkey);

        if(sourceKeys === null)
        {
          return null;
        }

    const Account_A  = await server.loadAccount(senderpublickey);

        if (Account_A === null) {
            console.log("sourceAccount not found");
            return null;
        }
    
        const accballance = await getaccountbalance(senderpublickey); 
        const accballfloat = parseFloat(accballance)

        const floatamount = parseFloat(amount);
        console.log("here floatamount :"+floatamount);

        if(floatamount > accballfloat)
        {
          console.log("not enough money ur request to "+floatamount+" but u have "+accballfloat);
          return 202;
        }
        
    const Account_B = await server.loadAccount(reciverpublickey);
    
        if (Account_B === null) {
          console.log("reciverAccount not found")
          return null
        }   

    const total = floatamount + parseFloat(collected);
    const floattarget = parseFloat(target);         
    
        if(total > floattarget)
            {
              console.log("the amount u have entered is grater than total");
              return 203;
            } 
        let transaction = new StellarSdk.TransactionBuilder(Account_A, {
            fee: StellarSdk.BASE_FEE,
            networkPassphrase: StellarSdk.Networks.TESTNET
          })
          .addOperation(StellarSdk.Operation.payment({
            destination: reciverpublickey,
            asset: StellarSdk.Asset.native(),
            amount: amount,
          }))
          .setTimeout()
          .build();
          
          transaction.sign(sourceKeys);
          
          const transactionResponse = await server.submitTransaction(transaction).then(function (accountResult) {
            return util.inspect(accountResult.hash,false,null);
          })
          .catch(function (err) {
            console.error(err);
          });

          const accbal = await getaccountbalance(senderpublickey);

          let token;
          if (localStorage.getItem("token") != null) 
          {
            token = localStorage.getItem("token");
          }
          const responseone = await axios.post('http://localhost:5000/api/setbalance',{
            balance : accbal,
            publicKey : senderpublickey,
            hasharray: transactionResponse,
          }, {
            headers: {
              'Authorization': "bearer " + token,
              "Content-Type": "application/json"
            }
          });
          
          const setcollect = floatamount + parseFloat(collected); 

          const responsetwo = await axios.post('http://localhost:5000/api/setcolectedamount',{           
           _id : campaignid,  
          collect :  setcollect,

          }, {
            headers: {
              'Authorization': "bearer " + token,
              "Content-Type": "application/json"
            }
          });

          console.log("success");

          if (transactionResponse != null && responseone != null && responsetwo != null && 
                responseone.status == 200 && responsetwo.status == 200 ) 
          {
            const  token   = responseone.data;
            localStorage.setItem("token",token);
            return responseone.status;
          }
          // else
          // {
          //   return null;
          // }

  } catch (error) {
    return null

  }
}