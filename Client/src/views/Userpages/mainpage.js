import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import Footer from "components/Footer/Footer.js";
import styles from "assets/jss/material-kit-react/views/loginPage.js";
import image from "assets/img/poor.jpg";
import image2 from "assets/img/bg2.jpg";

import Signin from "views/Userpages/Signin";
import Signup from "views/Userpages/Signup";
import Kycapprove from "views/Userpages/Kycapprove";
import Blockchainkey from "views/Userpages/Blockchainkey";

const useStyles = makeStyles(styles);

function Mainpage
(props) {
  const [action, setaction] = useState('Signin');
  const [prevroute, setprevroute] = useState('/');
  const [privatekey, setprivatekey] = useState("");
  const [publicKey, setpublicKey] = useState("");
  const classes = useStyles();

  const { ...rest } = props;

  useEffect(() => {

    if (props.location.search && props.location.search != "") {
      const from = props.location.search.split("=");
      const route = atob(from[1]);
      setprevroute(route);
    }

  }, []);
  return (
    <div>
      <Header
        fixed
        color="white"
        brand="Donatemecrypto"
        rightLinks={<HeaderLinks />}
        {...rest}
      />
      <div
        className={classes.pageHeader}
        style={{
          backgroundImage: "url(" + image2 + ")",
          backgroundSize: "fixed",
          backgroundPosition: "top center"
        }}
      >
        {action === 'Signin' && (
          <Signin prevroute={prevroute} setaction={setaction} history={props.history} />
        )}
        {
          action === 'Signup' && (
            <Signup prevroute={prevroute} setaction={setaction} history={props.history}
              setprivatekey={setprivatekey} setpublicKey={setpublicKey} />
          )
        } 
        {
          action === 'Blockchainkey' && (
            <Blockchainkey prevroute={prevroute} setaction={setaction}
              history={props.history} privatekey={privatekey} publicKey={publicKey} />
          ) 
        }
        <Footer whiteFont />
      </div >
    </div >
  );
}

export default Mainpage
