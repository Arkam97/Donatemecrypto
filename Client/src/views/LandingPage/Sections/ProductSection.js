import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// @material-ui/icons
import Stellar from "assets/img/stellar.png";
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import VerifiedUser from "@material-ui/icons/VerifiedUser";
import Fingerprint from "@material-ui/icons/Fingerprint";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import InfoArea from "components/InfoArea/InfoArea.js";
import Divider from '@material-ui/core/Divider';
import styles from "assets/jss/material-kit-react/views/landingPageSections/productStyle.js";
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
const useStyles = makeStyles(styles);

export default function ProductSection() {
  const classes = useStyles();
  return (
    <div className={classes.section}>
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={8}>
          <h2 className={classes.title}>Donatemecrypto</h2>
          <Divider />
          <h4 className={classes.description}>
          Donatemecrypto is a donation based crowdfunding application built on Stellar Blockchain. This provide online KYC (Know your customer)
          process for proper fundraiser verification, And effective admin panel to handel user acction.  
          </h4>
          <img src={Stellar} width="100px"/>
        </GridItem>
      </GridContainer>
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={4}>
            <InfoArea
              title="Stellar Account"
              description="Donatemecrypto will provide stelllar account with key pairs for users when sign-in to the appication. 
              User will have 10000 lumens account balance at first,user can donate campaigns using lumens. And user can get transaction hash 
              on profile page."
              icon={AccountBoxIcon}
              iconColor="info"
              vertical
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <InfoArea
              title="KYC Approved User"
              description="A registered user can only fund campaigns. To create a camapign user need to submit KYC form which is in the profile page.
              after the KYC approval user could create a campaign using Create campaign link on top menu bar. user status which is in the profile page 
              provide status update."
              icon={VerifiedUser}
              iconColor="success"
              vertical
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <InfoArea
              title="Admin"
              description="The user actions will be controlled by admin. Check the details provide by user and approved or reject the form according to the 
              validity of the information. once user submit the KYC or create campaign forms the admin will make a decission on the information and approve 
              or reject the form."
              icon={PlaylistAddCheckIcon}
              iconColor="primary"
              vertical
            />
          </GridItem>
        </GridContainer>
      </div>
    </div>
  );
}
