/* eslint-disable no-unused-vars */
import React, { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";


import styles from "assets/jss/material-kit-react/views/loginPage.js";

const useStyles = makeStyles(styles);

function Blockchainkey(props) {
  const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
  setTimeout(function() {
    setCardAnimation("");
  }, 700);

  const [move, setmove] = useState(false);

  const classes = useStyles();

  const { ...rest } = props;

  return (
    <div className={classes.container}>
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={5}>
          <Card className={classes[cardAnimaton]}>
            <form className={classes.form}>
              <CardHeader color="info" className={classes.cardHeader}>
                <h3>Stellar Blockchain Account Keypair</h3>
              </CardHeader>
              <p className={classes.divider}>
                Here are your Blockchain keys keep the private key safe 
              </p>
              <CardBody>
                <List
                  component="nav"
                  className={classes.root}
                  aria-label="keypair"
                >
                  <ListItem>
                    <ListItemIcon>
                      <AccountBoxIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Public Key"} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={props.publicKey} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <VpnKeyIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Private Key"} />
                  </ListItem>
                  <ListItem >
                    <ListItemText primary={props.privatekey} />
                  </ListItem>
                </List>
              </CardBody>

              <CardFooter className={classes.cardFooter}>
                <Button
                  color="info"
                  regular
                  onClick={() => {
                    var txtfilesaver = require("file-saver");
                    var blobfile = new Blob(
                      [
                        "PublicKey: " + props.publicKey + " \nprivatekey: " + props.privatekey
                      ],
                      { type: "text/plain;charset=utf-8" }
                    );
                    txtfilesaver.saveAs( blobfile, "donatemecrypto_keypair.txt");

                    setmove(true);
                  }}
                >
                  Export
                </Button>
                <Button
                  color="info"
                  regular
                  disabled={!move}
                  onClick={() => {
                    props.history.push(props.prevroute);
                  }}
                >
                  Proceed
                </Button>
              </CardFooter>
            </form>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}

export default Blockchainkey;
