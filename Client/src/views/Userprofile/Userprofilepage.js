/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState, useLayoutEffect } from "react";
// import { useParams } from 'react-router-dom';
import { withRouter } from "react-router-dom";

// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Button from "components/CustomButtons/Button.js";

// @material-ui/icons

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import DetailsOutlinedIcon from "@material-ui/icons/DetailsOutlined";
import SupervisedUserCircleIcon from "@material-ui/icons/SupervisedUserCircle";
import AccountBoxIcon from "@material-ui/icons/AccountBox";

// core components
import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import NavPills from "components/NavPills/NavPills.js";
import Parallax from "components/Parallax/Parallax.js";
import DetailsExpansions from "./Components/DetailsExpansions";
import ReceiptIcon from "@material-ui/icons/Receipt";
import Transactions from "./Components/Transactions";
import Balance from "./Components/Balance";

import styles from "assets/jss/material-kit-react/views/profilePage.js";
import withAuthorization from "components/Authentication/Index.js";
import { GetAccount, getUserSession } from "utility/Usercontrol.js";
const useStyles = makeStyles(styles);

function Userprofilepage(props) {
  // const { id } = useParams();

  const classes = useStyles();
  const { ...rest } = props;
  const [horizontal, setHorizontal] = useState({
    tabsGrid: { xs: 3, sm: 3, md: 3 },
    contentGrid: { xs: 12, sm: 9, md: 9 }
  });

  const [currentUser, setCurrentUser] = useState(getUserSession());
  const [editable, setEditable] = useState(false);
  const [user, setUser] = useState(null);
  const { id } = props.match.params;
  useEffect(() => {
    if (window.innerWidth >= 768) {
      setHorizontal({
        tabsGrid: { xs: 3, sm: 3, md: 3 },
        contentGrid: { xs: 12, sm: 9, md: 9 }
      });
    }
  }, [id]);

  useLayoutEffect(() => {
    async function fetchData() {
      const account = await GetAccount(id);
      if (account != null) {
        if (id == currentUser.publicKey) setEditable(true);
        //console.log(account)
        setUser(account);
      }
    }
    fetchData();
  }, [id]);
  return (
    <div>
      <Header
        color="white"
        brand="Donatemecrypto"
        rightLinks={<HeaderLinks />}
        fixed
        changeColorOnScroll={{
          height: 200,
          color: "white"
        }}
        {...rest}
      />
      <Parallax
        style={{ height: "200px" }}
        small
        filter
        image={require("assets/img/bg2.jpg")}
      />
      <div className={classNames(classes.main, classes.mainRaised)}>
        <div>
          <div className={classes.container} style={{ "min-height": "500px" }}>
            <GridContainer>
              <GridItem xs={12} sm={12} md={12} lg={12}>
                <NavPills
                  color="info"
                  horizontal={horizontal}
                  tabs={[
                    {
                      tabButton: "User Details",
                      tabIcon: DetailsOutlinedIcon,
                      tabContent: (
                        <Card>
                          <CardHeader
                            color="info"
                            className={classes.cardHeader}
                          >
                            <h4>Basic Details</h4>
                          </CardHeader>
                          <CardBody>
                            <DetailsExpansions
                              name="Username"
                              value={user && user.Username ? user.Username : ""}
                              disabled={!editable}
                            />
                            <DetailsExpansions
                              name="Useremail"
                              value={
                                user && user.Useremail ? user.Useremail : ""
                              }
                              disabled={!editable}
                            />
                          </CardBody>
                        </Card>
                      )
                    },
                    {
                      tabButton: "KYC Details",
                      tabIcon: SupervisedUserCircleIcon,
                      tabContent: (
                        <Card>
                          <CardHeader
                            color="info"
                            className={classes.cardHeader}
                          >
                            <h4>KYC Details</h4>
                          </CardHeader>
                          <CardBody>
                            {user && user.kyc && <p>KYC Status: {user.kyc}</p>}
                            {editable && user && !user.kyc && (
                              <>
                                <p>
                                  Want to create an initiative or receive funds?
                                </p>
                                <Button
                                  simple
                                  color="info"
                                  onClick={e => {
                                    props.history.push("/kyc");
                                  }}
                                >
                                  Do KYC
                                </Button>
                              </>
                            )}
                            {!editable && user && !user.kyc && (
                              <>
                                <p>
                                  Want to create an initiative or receive funds?
                                </p>
                                <Button
                                  simple
                                  color="info"
                                  onClick={e => {
                                    props.history.push("/kyc");
                                  }}
                                >
                                  Do KYC
                                </Button>
                              </>
                            )}
                          </CardBody>
                        </Card>
                      )
                    },
                    {
                      tabButton: "Account Details",
                      tabIcon: AccountBoxIcon,
                      tabContent: (
                        <Card>
                          <CardHeader
                            color="info"
                            className={classes.cardHeader}
                          >
                            <h4>Account Details</h4>
                          </CardHeader>
                          <CardBody>
                            <DetailsExpansions
                              name="Public Key"
                              value={
                                user && user.publicKey ? user.publicKey : ""
                              }
                              disabled={!editable}
                            />
                          </CardBody>
                        </Card>
                      )
                    },
                    {
                      tabButton: "Balance",
                      tabIcon: ReceiptIcon,
                      tabContent: <Balance publicKey={id} user={user} />
                    },
                    {
                      tabButton: "Trasnsactions",
                      tabIcon: ReceiptIcon,
                      tabContent: <Transactions publicKey={id} user={user} />
                    }
                  ]}
                />
              </GridItem>
            </GridContainer>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

const authCondition = authUser => !!authUser;

export default withAuthorization(authCondition)(withRouter(Userprofilepage));
// export default Userprofilepage;
// export default withRouter(withAuthorization(Userprofilepage));
