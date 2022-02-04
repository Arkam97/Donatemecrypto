const express = require('express');
const router = new express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/usermodel');
const Kyc = require('../models/kycmodel');
const Campaign = require('../models/campaignmodel');
const { v4: uuidv4 } = require('uuid');
var  multer = require('multer');

DIR = './public/';

router.post('/signin', async (req, res) => {
  try {
    const exuser = await User.findOne({username: req.body.username }).exec();
    if (!exuser) 
    {
      return res.status(202).json({
        username: 'Could not find username.'
      });
    }

    if(exuser.hashpwd !== req.body.hashpwd)
    {
      return res.status(203).json({
        hashpwd: 'Password is incorrect.'
      });
    }
    else 
    {
      let tokenBody = exuser;
      tokenBody.exp = Math.floor(new Date().getTime() / 1000.0) + 12000;
      let token = jwt.sign( {tokenBody}, 'ijk3dp4n');
      
    }
      
  } catch (err) {
    return res.status(500).json({ err });
  }
});



router.post('/signup', async (req, res) => {

  try {

    const exemail = await User.find({ useremail: req.body.useremail }).exec();
    if (exemail.length > 0) {
      return res.status(202).json({ error: 'Email already exists.' });
    }

    const exname = await User.find({ username: req.body.username }).exec();
    if (exname.length > 0) {
      return res.status(203).json({ error: 'Username already exists.' });
    }

      const newUser = new User({
        username: req.body.username,
        useremail: req.body.useremail,
        hashpwd: req.body.hashpwd,
        publicKey: req.body.publicKey,
        balance : req.body.balance,
        approve : req.body.approve,
        campapprove : req.body.campapprove,
        count : req.body.count,
        type : req.body.type
      });

      return newUser
        .save()
        .then((result) => {
          if (result != null) {
          let tokenBody = result;
          tokenBody.exp = Math.floor(new Date().getTime() / 1000.0) + 12000;
          let token = jwt.sign({tokenBody}, 'ijk3dp4n');
          res.status(200).json(token);
          }
        })
        .catch((err) => {
          res.status(500).json({ error: err });
        });
  } catch (err) {
    return res.status(500).json({ err });
  }
});


router.get('/users/:publickey', async (req,res) =>{
  try{

    const publicKey = req.params.publicKey      
    const exuser = await User.findOne({publicKey: publicKey}).exec();

    if (!exuser) 
    {
      return res.status(202).json({
        publicKey: 'Could not find Account .'
      });
    }
    else
    {
      return res.status(200).json( {exuser});
    }

  }
  catch(err){
    return res.status(500).json({err});
  }
});


router.post('/likecampaign', async (req,res) =>{
  try{

    const _id = req.body._id;
    const likecount = req.body.likecount;   
    
    Campaign.findOneAndUpdate({ _id: _id},{$set:{likecount : likecount}}, {new: true, useFindAndModify: false}, (err, doc) => {
          if (err) {
              console.log("Something wrong when updating data!");
              }
              else{
                res.status(200).json(doc);
              }
        
    }).catch((err) => {
      res.status(500).json({ error: err });
    });
  }
  catch(err){
    return res.status(500).json({err});
  }
});

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, DIR);
  },
  filename: (req, file, cb) => {
      const fileName = file.originalname.toLowerCase().split(' ').join('-');
      cb(null, uuidv4() + '-' + fileName)
  }
});


router.post('/dislikecampaign', async (req,res) =>{
  try{

    const _id = req.body._id;
    const likecount = req.body.likecount;   
    
    Campaign.findOneAndUpdate({ _id: _id},{$set:{likecount : likecount}}, {new: true, useFindAndModify: false}, (err, doc) => {
          if (err) {
              console.log("Something wrong when updating data!");
              }
              else{
                res.status(200).json(doc);
              }
        
    }).catch((err) => {
      res.status(500).json({ error: err });
    });
  }
  catch(err){
    return res.status(500).json({err});
  }
});

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, DIR);
  },
  filename: (req, file, cb) => {
      const fileName = file.originalname.toLowerCase().split(' ').join('-');
      cb(null, uuidv4() + '-' + fileName)
  }
});
var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
      if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
          cb(null, true);
      } else {
          cb(null, false);
          return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
      }
  }
});


router.post('/createkyc',upload.array('image',4), async (req,res) =>{
  try {
    const reqFiles = [];
    const url = req.protocol + '://' + req.get('host');
    console.log(req.body);

    for (var i = 0; i < req.files.length; i++) {
      reqFiles.push(url + '/public/' + req.files[i].filename)
   }
  
    const newKyc = new Kyc({
      nid: req.body.nid,
      birthdate: req.body.birthdate,
      imagecolection: reqFiles,      
      fname: req.body.fname,
      telno: req.body.telno,
      addressone: req.body.addressone,
      addresstwo: req.body.addresstwo,
      userid : req.body.userid,
      Kycapprove : req.body.Kycapprove,
    });

    return newKyc.save().then((result) => {
      if(result != null)
      {
        res.status(200).json(result)
      }
    }).catch((err) => {
      res.status(500).json({ error: err });
    });

  } catch (err) {
    return res.status(500).json({err});
  }
});

router.post('/createcampaign',upload.single("image"), async (req,res) =>{
  try {
  
    const url = req.protocol + '://' + req.get('host');

    const newCamapign = new Campaign({
      userid: req.body.userid,
      image: url + '/public/' + req.file.filename,  
      campaignname: req.body.campaignname,
      amount: req.body.amount,
      story: req.body.story,
      targetdate: req.body.targetdate,
      Campapprove : req.body.Campapprove,
      collect : req.body.collect,
      likecount : req.body.likecount,

    });

    return newCamapign.save().then((result) => {
      if(result != null)
      {
        res.status(200).json(result)
      }
    }).catch((err) => {
      res.status(500).json({ error: err });
    });

  } catch (err) {
    return res.status(500).json({err});
  }
});

// router.post('/approvecampaign', async (req,res) =>{
//   try {
//     // const approvecampaign = await Campaign.find({ _id: req.body.campaignId }).exec();

//     Campaign.findOneAndUpdate({ _id: req.body.campaignId },{$set:{Campapprove:true}}, {new: true}, (err, doc) => {
//       if (err) {
//           console.log("Something wrong when updating data!");
//       }
  
//       console.log(doc);
//       return res.status(200);
//   });
   
//   } catch (err) {
//     return res.status(500).json({err});
//   }
// });

router.post('/approvecampaign', async (req,res) =>{
  try {
   
    const _id = req.body.id;
    const userid = req.body.userid;

    Campaign.findOneAndUpdate({ _id: _id},{$set:{Campapprove: 1}}, {new: true, useFindAndModify: false}, (err, doc) => {
      if (err) {
          console.log("Something wrong when updating data!");
      }
     }).then((doc) =>{
       if(doc != null){
        User.findOneAndUpdate({ publicKey : userid},{$set:{count: 1 , campapprove: 1 }}, {new: true, useFindAndModify: false}, (err, user) => {
            if (err) {
                  console.log("Something wrong when updating data!");
            }
            res.status(200).json(user);
            });  
       }
     }).catch((err) => {
      res.status(500).json({ error: err });
    });

  } catch (err) {
    return res.status(500).json({err});
  }
});


router.post('/rejectcampaign', async (req,res) =>{
  try {
   
    const _id = req.body.id;
    const userid = req.body.userid;
    Campaign.findOneAndUpdate({ userid: _id},{$set:{Campapprove: 2}}, {new: true, useFindAndModify: false}, (err, doc) => {
      if (err) {
          console.log("Something wrong when updating data!");
      }
     }).then((doc) =>{
       if(doc != null){
        User.findOneAndUpdate({ publicKey : userid},{$set:{campapprove: 2  }}, {new: true, useFindAndModify: false}, (err, user) => {
            if (err) {
                  console.log("Something wrong when updating data!");
            }
            res.status(200).json(user);
            });  
       }
     }).catch((err) => {
      res.status(500).json({ error: err });
    });

  } catch (err) {
    return res.status(500).json({err});
  }
});

router.get('/deletecampaign/:id', async (req,res) =>{
  try {
    const id = req.params.id
    Campaign.deleteOne({_id : id}, function(err, result) {
      if (err) {
        res.send(err);
      } else {
        res.status(200).json(result);
      }
    });

  } catch (err) {
    return res.status(500).json({err});
  }
    
});

router.post('/approvekyc', async (req,res) =>{
  try {
   
    const _id = req.body.id;
    const userid = req.body.userid;
    Kyc.findOneAndUpdate({ _id: _id},{$set:{Kycapprove: 1}}, {new: true, useFindAndModify: false}, (err, doc) => {
      if (err) {
          console.log("Something wrong when updating data!");
      }
     }).then((doc) =>{
       if(doc != null){
        User.findOneAndUpdate({ publicKey : userid},{$set:{approve: 1}}, {new: true, useFindAndModify: false}, (err, user) => {
            if (err) {
                  console.log("Something wrong when updating data!");
            }
            res.status(200).json(user);
            });  
       }
     }).catch((err) => {
      res.status(500).json({ error: err });
    });

  } catch (err) {
    return res.status(500).json({err});
  }
});


router.post('/rejectkyc', async (req,res) =>{
  try {
   
    const _id = req.body.id;
    const userid = req.body.userid;
    Kyc.findOneAndUpdate({ _id: _id},{$set:{Kycapprove: 2}}, {new: true, useFindAndModify: false}, (err, doc) => {
      if (err) {
          console.log("Something wrong when updating data!");
      }
     }).then((doc) =>{
       if(doc != null){
        User.findOneAndUpdate({ publicKey : userid},{$set:{approve: 2}}, {new: true, useFindAndModify: false}, (err, user) => {
            if (err) {
                  console.log("Something wrong when updating data!");
            }
            res.status(200).json(user);
            });  
       }
     }).catch((err) => {
      res.status(500).json({ error: err });
    });

  } catch (err) {
    return res.status(500).json({err});
  }
});


router.get('/getall_unapproved_campaigns', async (req,res) =>{
  try {

    Campaign.find({Campapprove : 0}, function(err, result) {
      if (err) {
        res.send(err);
      } else {
        res.status(200).json(result);
      }
    });

  } catch (err) {
    return res.status(500).json({err});
  }
    
});

router.get('/getall_approved_campaigns', async (req,res) =>{
  try {

    Campaign.find({Campapprove : 1}, function(err, result) {
      if (err) {
        res.send(err);
      } else {
        res.status(200).json(result);
      }
    });

  } catch (err) {
    return res.status(500).json({err});
  }
    
});

router.get('/getall_ended_campaigns', async (req,res) =>{
  try {
    let today = new Date();
    Campaign.find({targetdate : { $lte : today },Campapprove : 1}, function(err, result) {
      if (err) {
        res.send(err);
      } else {
        res.status(200).json(result);
      }
    });

  } catch (err) {
    return res.status(500).json({err});
  }
    
});


router.get('/getall_unapproved_Kycs', async (req,res) =>{
  try {

    Kyc.find({Kycapprove : 0}, function(err, result) {
      if (err) {
        res.send(err);
      } else {
        // console.log(result);
        res.status(200).json(result);
      }
    });

  } catch (err) {
    return res.status(500).json({err});
  }
    
});

router.post('/setbalance', async(req,res) =>{
  try{

    const balance = req.body.balance;
    const publicKey = req.body.publicKey;
    const hasharray = req.body.hasharray;
    
    // User.update({ publicKey : publicKey}, {$push: {array: 'i' } }); 

    User.findOneAndUpdate({ publicKey : publicKey},{$push: {hasharray: hasharray},$set : {balance : balance}},{ upsert : true, useFindAndModify: false}, (err, user) => {
      if (err) {
            console.log("Something wrong when updating data!");
      }
      // res.status(200).json(user);
      }).then((result) => {
        if (result != null) {
        let tokenBody = result;
        tokenBody.exp = Math.floor(new Date().getTime() / 1000.0) + 12000;
        let token = jwt.sign({tokenBody}, 'ijk3dp4n');
        res.status(200).json(token);
        }
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  }
  catch(err){
    return res.status(500).json({err});
  }
});

router.post('/edituser', async (req,res) =>{
  try
  {
    const userid = req.body.userid; 
    const data = req.body.data;    
    const detail = req.body.detail;
    // const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    

    // const usernameExists = await User.findOne({username: userid});
    

    if(detail == "Username")
    {
      User.findOneAndUpdate({publicKey: userid},{$set:{username : data}},{new: true, useFindAndModify: false}, (err, user) => {
        if (err) {
              console.log("Something wrong when updating data!");
        }
        // res.status(200).json(user);
      
        })
        .then((result) => {
          if (result != null) {
          let tokenBody = result;
          tokenBody.exp = Math.floor(new Date().getTime() / 1000.0) + 12000;
          let token = jwt.sign({tokenBody}, 'ijk3dp4n');
          res.status(200).json(token);
          }
        })
        .catch((err) => {
          res.status(500).json({ error: err });
        });
    }
    
    if(detail == "Useremail")
    {
      User.findOneAndUpdate({publicKey: userid},{$set:{useremail: data}},{new: true, useFindAndModify: false}, (err, user) => {
        if (err) {
              console.log("Something wrong when updating data!");
        }
        // res.status(200).json(user);
      
        })
        .then((result) => {
          if (result != null) {
          let tokenBody = result;
          tokenBody.exp = Math.floor(new Date().getTime() / 1000.0) + 12000;
          let token = jwt.sign({tokenBody}, 'ijk3dp4n');
          res.status(200).json(token);
          }
        })
        .catch((err) => {
          res.status(500).json({ error: err });
        });
    }

  }
  catch(err)
  {
    res.status(500).json({err});
  }
});

router.post('/setcolectedamount', async (req,res) =>{
  try{

    const _id = req.body._id;
    const setcollect = req.body.collect;

    // const getcampaign = await Campaign.findOne({_id: _id}).exec();
    // console.log(getcampaign);
    // const setcolect = getcampaign.collect + collect;

    Campaign.findOneAndUpdate({ _id : _id},{$set:{collect : setcollect}}, {new: true, useFindAndModify: false}, (err, campaign) => {
      if (err) {
            console.log("Something wrong when updating data!");
      }
      res.status(200).json(campaign);
    
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  }
  catch(err){
    return res.status(500).json({err});
  }
});


router.get('/campaign/:id', async (req,res) =>{
  try {
    const id = req.params.id
    const excampaign = await Campaign.findOne({_id: id}).exec();

    if (!excampaign) 
    {
      return res.status(202).json({
        _id : 'Could not find Campaign .'
      });
    }
    else
    {
      return res.status(200).json(excampaign);
    }
    

  } catch (err) {
    return res.status(500).json({err});
  }
    
});


module.exports = router;