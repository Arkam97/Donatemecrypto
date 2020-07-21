const express = require('express');
import { logger } from "../service/logger";
import { Userroutes } from "./Userroutes";
const router = new express.Router();
import registerSchema from "../models/model";
import { createResponse } from "../service/response-generator";
var HttpStatus = require('http-status-codes');

router.get('/', (req, res) => res.send('Hello World!'))

router.post('/register', async (req, res) => {
    try {
        // await registerSchema.validateAsync(JSON.parse(req.body));
    
        let post = await Userroutes.register(req);
        logger.info("success!");
        return createResponse(post.code, post);
      } catch (error) {
        logger.error(error);
        return createResponse(HttpStatus.BAD_REQUEST, {
          code: 400,
          message: error.message,
          data: null,
        });
      } 
      finally {
        logger.info("connection closed");
      }
});


//  addInitiative = async (
 
// ) => {
//   context.callbackWaitsForEmptyEventLoop = false;

//   try {
//     const auth = await authMiddleware(event, ["1", "2", "3", "4", "5"]);
//     if (auth.data == null) {
//       return createResponse(auth.code, auth);
//     }
//     await addInitiativeSchema.validateAsync(JSON.parse(event.body));

//     let post = await UserService.addInitiative(event);

//     logger.info("success!");
//     return createResponse(post.code, post);
//   } catch (error) {
//     logger.error(error);
//     return createResponse(HTTPStatusCodes.BAD_REQUEST, {
//       code: 400,
//       message: error.details[0].message,
//       data: null,
//     });
//   } finally {
//     logger.info("connection closed");
//   }
// };

module.exports = router;