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
import Typography from "@material-ui/core/Typography";
import DetailsOutlinedIcon from "@material-ui/icons/DetailsOutlined";
import SupervisedUserCircleIcon from "@material-ui/icons/SupervisedUserCircle";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import FileCopyIcon from '@material-ui/icons/FileCopy';
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
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { useSnackbar } from 'notistack';
import styles from "assets/jss/material-kit-react/views/profilePage.js";
import {  getUserSession } from "utility/Usercontrol.js";
const useStyles = makeStyles(styles);

function Userprofilepage(props) {

  const classes = useStyles();
  const { ...rest } = props;
  const { enqueueSnackbar } = useSnackbar();
  const [horizontal, setHorizontal] = useState({
    tabsGrid: { xs: 3, sm: 3, md: 3 },
    contentGrid: { xs: 12, sm: 9, md: 9 }
  });

  
  const [editable, setEditable] = useState(false);
  const [user, setUser] = useState(null);
  useEffect(() => {
    if (window.innerWidth >= 768) {
      setHorizontal({
        tabsGrid: { xs: 3, sm: 3, md: 3 },
        contentGrid: { xs: 12, sm: 9, md: 9 }
      })
    }
  }, []);
  
  useEffect(() => {
    const user = getUserSession();
    setUser(user);
    setEditable(true)
  }, []);
 
  // useLayoutEffect(() => {
  //   async function fetchData() {
  //     const account = await GetAccount(id)
  //     if (account != null) {
  //       if (id == currentUser.publicKey)
  //       {
  //         setEditable(true);
  //         setUser(currentUser)
  //       }else
  //       {
  //         setUser(account)
  //       }
          
  //       //console.log(account)
        
  //     }
  //   }
  //   fetchData()
  // }, [id]);

   const copyMessage = (val) => {
    const selBox = document.createElement("textarea");
    selBox.style.position = "fixed";
    selBox.style.left = "0";
    selBox.style.top = "0";
    selBox.style.opacity = "0";
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand("copy");
    document.body.removeChild(selBox);
  }

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
      <div
        className={classes.pageHeader}
        style={{
          backgroundColor: "white"
        }}
      >
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
                              detail="Username"
                              // userid={user && user.publicKey ? user.publicKey : ""}
                              data={user && user.username ? user.username : ""}
                              disabled={!editable}
                            />
                            <DetailsExpansions
                              detail="Useremail"
                              // userid={user && user.publicKey ? user.publicKey : ""}
                              data={user && user.useremail ? user.useremail : ""}                              
                              disabled={!editable}
                            />
                          </CardBody>
                        </Card>
                      )
                    },
                    {
                      tabButton: "User Status",
                      tabIcon: SupervisedUserCircleIcon,
                      tabContent: (
                        <Card>
                          <CardHeader
                            color="info"
                            className={classes.cardHeader}
                          >
                            <h4>KYC & Campaign Status</h4>
                          </CardHeader>
                          <CardBody>
                            {user && user.approve == 1 && <p>KYC Status: You are approved, you can create a campaign</p>}
                            {user && user.approve == 2 && (
                               <>
                                <p>KYC Status: You are not approved, the detail you given was wrong, try again?</p>
                    
                              <Button
                                simple
                                color="info"
                                onClick={e => {
                                  props.history.push('/Kycapprove')
                                }}
                              >
                                Do KYC
                              </Button>
                            </>
                            )}
                            {user && user.approve == 0 && (
                              <>
                                <p>
                                  Do you want to create a campaign?
                                </p>
                                <Button
                                  simple
                                  color="info"
                                  onClick={e => {
                                    props.history.push('/Kycapprove')
                                  }}
                                >
                                  Do KYC
                                </Button>
                              </>
                            )}
                             <Divider />
                             {user && user.campapprove == 1 && <p>Campaign Status: You're Campaign is approved, See the campaigns page </p>}
                             {user && user.campapprove == 2 && (
                               <>
                               <p>
                                do you want to create a campaign again?
                               </p>
                               <Button
                                 simple
                                 color="info"
                                 onClick={e => {
                                   props.history.push('/Createcampaign')
                                 }}
                               >
                                 Create campaign
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
                            {user && user.publicKey && (
                                <List component="nav" className={classes.root} aria-label="keypair">
                                <ListItem>
                                <ListItemText primary={"Public Key"} />
                                </ListItem>
                                <ListItem button onClick={() => {
                                  copyMessage(user.publicKey.replace(/\'/g, "") );
                                  enqueueSnackbar("Public key Copied", { variant: "info" })
                                }}>
                                  <ListItemText primary={user.publicKey.replace(/\'/g, "") } />
                                  <FileCopyIcon />
                                </ListItem> 
                                </List>
                            )}
                          </CardBody>
                        </Card>
                      )
                    },
                    {
                      tabButton: "Balance",
                      tabIcon: ReceiptIcon,
                      tabContent:(
                        <Card>
                          <CardHeader
                            color="info"
                            className={classes.cardHeader}
                          >
                            <h4>Balance</h4>
                          </CardHeader>
                          <CardBody>
                          {user && user.balance && (<ListItem>
                          <ListItemText primary={user.balance + " Lumens"} />
                          </ListItem>)}
                          </CardBody>
                        </Card>
                      )
                    },
                    {
                      tabButton: "Trasnsactions",
                      tabIcon: ReceiptIcon,
                      tabContent:(
                        <Card>
                          <CardHeader
                            color="info"
                            className={classes.cardHeader}
                          >
                            <h4>Trasnsactions</h4>
                          </CardHeader>
                          <CardBody>
                          {user && user.hasharray.length == 0  &&(<ListItem>
                          <ListItemText primary={"No Transaction Hash available"} />
                          </ListItem>)}  
                         
                          {user && user.hasharray.length == 1 &&
                          (<List component="nav" className={classes.root} aria-label="keypair">
                          <ListItem>
                          <ListItemText primary={"Last Transaction Hash"} />
                          </ListItem>
                          <ListItem button onClick={() => {
                            copyMessage(user.hasharray[user.hasharray.length - 1].replace(/\'/g, "") );
                            enqueueSnackbar("Hash Value Copied", { variant: "info" })
                          }}>
                            <ListItemText primary={user.hasharray[user.hasharray.length - 1].replace(/\'/g, "") } />
                            <FileCopyIcon />
                          </ListItem> 
                          </List>
                          )}
                          
                          
                          {user && user.hasharray.length == 3 &&
                          (<List component="nav" className={classes.root} aria-label="keypair">
                          <ListItem>
                          <ListItemText primary={"Last Two Transaction Hash"} />
                          </ListItem>
                          <ListItem button onClick={() => {
                            copyMessage(user.hasharray[user.hasharray.length - 1].replace(/\'/g, "") );
                            enqueueSnackbar("Hash Value Copied", { variant: "info" })
                          }}>
                            <ListItemText primary={user.hasharray[user.hasharray.length - 1].replace(/\'/g, "") } />
                            <FileCopyIcon />
                          </ListItem>
                          <ListItem button onClick={() => {
                            copyMessage(user.hasharray[user.hasharray.length - 3].replace(/\'/g, "") );
                            enqueueSnackbar("Hash Value Copied", { variant: "info" })
                          }}>
                            <ListItemText primary={user.hasharray[user.hasharray.length - 3].replace(/\'/g, "") } />
                            <FileCopyIcon />
                          </ListItem>
                          </List>
                          )}
                         
                          {user && user.hasharray.length >= 5 &&
                          (<List component="nav" className={classes.root} aria-label="keypair">
                          <ListItem>
                          <ListItemText primary={"Last Three Transaction Hash"} />
                          </ListItem>
                          <ListItem button onClick={() => {
                            copyMessage(user.hasharray[user.hasharray.length - 1].replace(/\'/g, "") );
                            enqueueSnackbar("Hash Value Copied", { variant: "info" })
                          }}>
                            <ListItemText primary={user.hasharray[user.hasharray.length - 1].replace(/\'/g, "") } />
                            <FileCopyIcon />
                          </ListItem> 
                          <ListItem button onClick={() => {
                            copyMessage(user.hasharray[user.hasharray.length - 3].replace(/\'/g, "") );
                            enqueueSnackbar("Hash Value Copied", { variant: "info" })
                          }}>
                            <ListItemText primary={user.hasharray[user.hasharray.length - 3].replace(/\'/g, "") } />
                            <FileCopyIcon />
                          </ListItem> 
                          <ListItem button onClick={() => {
                            copyMessage(user.hasharray[user.hasharray.length - 5].replace(/\'/g, "") );
                            enqueueSnackbar("Hash Value Copied", { variant: "info" })
                          }}>
                            <ListItemText primary={user.hasharray[user.hasharray.length - 5].replace(/\'/g, "") } />
                            <FileCopyIcon />
                          </ListItem> 
                          </List>
                          )}
                          
      
                          </CardBody>
                        </Card>
                      )
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
    </div>
  );
}

export default Userprofilepage;

