/* eslint-disable react/prop-types */

import React, { useEffect, useState, useLayoutEffect } from "react";
import { useSnackbar } from "notistack";


import classNames from "classnames";
import { makeStyles } from "@material-ui/core/styles";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import { getcampaignbyid } from "utility/Usercontrol";
import LinearProgress from "@material-ui/core/LinearProgress";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import InputAdornment from "@material-ui/core/InputAdornment";
import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import NavPills from "components/NavPills/NavPills.js";
import Parallax from "components/Parallax/Parallax.js";
import CampaignItem from "./CampaignItem";

import CustomInput from "components/CustomInput/CustomInput.js";
import { getUserSession } from "utility/Usercontrol";
import { Line } from "rc-progress";
import { MakeFundTransaction } from "utility/Usercontrol";
import styles from "assets/jss/material-kit-react/views/profilePage.js";
import Badge from "components/Badge/Badge.js";

const jwt = require("jsonwebtoken");
const useStyles = makeStyles(styles);



export default function Fundcampaign(props) {


  const { id } = props.match.params;
  const [colected, setcolected] = useState(0);
  const [fundamount, setfundamount] = useState("");
  const [secretkey, setsecretkey] = useState("");
 
  // eslint-disable-next-line no-unused-vars
  const [user, setUser] = useState(getUserSession());

  const classes = useStyles();
  const { ...rest } = props;
  const [loading, setLoading] = useState(false);
  const [Transactionloading, setTransactionLoading] = useState(false);
  const [campaign, setcampaign] = useState(null);
  const [fundamountError, setfundamountError] = useState(false);
  const [secretkeyError, setsecretkeyError] = useState(false);
  const [endDate, setEndDate] = useState(new Date().getTime());
  const [dontshow, setdontshow] = useState(true);

  const [timer, setTimer] = useState("Evaluating Remaining Time");
  const { enqueueSnackbar } = useSnackbar();

  const county = () => {
    var today = new Date().getTime();
    var gap = endDate - today;
    var bal_days = Math.floor(gap / (1000 * 60 * 60 * 24));
    var bal_hours = Math.floor(
      (gap % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    var bal_minutes = Math.floor((gap % (1000 * 60 * 60)) / (1000 * 60));
    setTimer(
      "Ends in " + bal_days + "d " + bal_hours + "h " + bal_minutes + "m "
    );
    if (gap < 0) {
      setTimer("Ended");
    }
  };

  
  useEffect(() => {
    async function fetch() {
      setLoading(true);
      setTimer("Evaluating Remaining Time");
      const init = await getcampaignbyid(id);
      if (init !== null) 
      {
        setcampaign(init);
        setEndDate(new Date(init.targetdate).getTime()); 
        setcolected(init.collect);     
      }

      if(user)
      {
            if(init.userid == user.publicKey)
            {
            setdontshow(false);
            }
      }

      setLoading(false);
      setTimer("Evaluating Remaining Time");
    }

    fetch();
  }, [id]);

  useLayoutEffect(() => {
    const Sid = setInterval(county, 1000);
    return () => clearInterval(Sid);
  }, [county]);

  const Fundcampaign = async event => {
    

    setfundamountError(fundamount === "" ? true : false);
    setsecretkeyError(secretkey === "" ? true : false);

    if ( fundamount !== "" && secretkey !== "") 
      {
      setTransactionLoading(true);

      const response = await MakeFundTransaction(fundamount ,secretkey, user.publicKey , campaign.userid , campaign._id, campaign.collect, campaign.amount);
      switch (response) {
        case 200:
          enqueueSnackbar("Amount Funded Successfully", { variant: "success" });
          props.history.push('/'); 
          break;
        case 202:
          enqueueSnackbar("Account balance not enough", { variant: "warning" });
          break;
        case 203:
          enqueueSnackbar("The balance goal amount less than requested", { variant: "warning" });
          break;
        case null:
          enqueueSnackbar("Transaction Failed", { variant: "error" });
      }
    
 
      setTransactionLoading(false);
  
    event.persist();
    }
    
  };

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
          <div className={classes.container}>
            <GridContainer>
              <GridItem xs={12} sm={12} md={12} lg={12}>
                <Card style={{ "min-height": "500px" }}>
                  <CardHeader color="info" className={classes.cardHeader}>
                    <h4>{campaign ? campaign.campaignname : "campaign"}</h4>
                  </CardHeader>
                  <CardBody>
                    {campaign && (
                      <GridContainer>
                        <GridItem xs={12} sm={4} md={4} lg={3}>
                          <CampaignItem
                            campaign_name={campaign.campaignname}
                            campaign_image={campaign.image}
                            campaign_story={campaign.story}
                            camapign_likes={campaign.likecount} 
                                                     
                            />
                        </GridItem>
                        <GridItem xs={12} sm={8} md={8} lg={9}>
                          <Card className={classes.root}>
                            <CardContent>
                              <GridContainer>
                                <GridItem xs={12} sm={12} md={12} lg={12}>
                                  <Typography
                                    align="center"
                                    variant="overline"
                                    component="h2"
                                  >
                                    <Badge color={"success"}>{timer}</Badge>
                                  </Typography>
                                </GridItem>
                                <GridItem xs={12} sm={12} md={12} lg={12}>
                                  <Typography
                                    align="center"
                                    variant="overline"
                                    component="h2"
                                  >
                                    {"$" +
                                      colected +
                                      " out of $" +
                                      campaign.amount +
                                      " collected!"}
                                    <Line
                                      percent={(colected / campaign.amount) * 100}
                                      strokeWidth="1.5"
                                      strokeColor="green"
                                    />
                                  </Typography>
                                </GridItem>
          
                                <GridItem xs={12} sm={12} md={12} lg={12}>
                                  <Typography
                                    variant="body1"
                                    color="textSecondary"
                                    component="p"
                                  >
                                    {campaign.story}
                                  </Typography>
                                </GridItem>
                                </GridContainer>
                                {user && timer != "Ended" && dontshow && campaign.amount != colected &&(<>
                                <form
                                className={classes.form}
                                onSubmit={Fundcampaign}
                                style={
                                  loading
                                    ? {
                                        filter: "blur(1px)",
                                        "-webkit-filter": "blur(1px)"
                                      }
                                    : null
                                }
                                >
                                  

                                    <GridItem xs={12} sm={12} md={6} lg={6}>
                                      <CustomInput
                                        error={fundamountError}
                                        labelText="amount *"
                                        id="amount"
                                        formControlProps={{
                                          fullWidth: true
                                        }}
                                        inputProps={{
                                          type: "text",
                                          endAdornment: (
                                            <InputAdornment position="end">
                                              <AttachMoneyIcon
                                                className={classes.inputIconsColor}
                                              />
                                            </InputAdornment>
                                          ),
                                          required: true,
                                          onChange: function(e) {
                                            setfundamount(e.target.value);

                                            setfundamountError(
                                              e.target.value === "" ? true : false
                                            );
                                          }
                                        }}
                                      />
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={6} lg={6}>
                                      <CustomInput
                                          error={secretkeyError}
                                          labelText="Secret Key *"
                                          id="secret"
                                          formControlProps={{
                                              fullWidth: true
                                          }}
                                          inputProps={{
                                              type: "password", endAdornment: (
                                                  <InputAdornment position="end">
                                                      <VpnKeyIcon className={classes.inputIconsColor} />
                                                  </InputAdornment>
                                              ), 
                                              required: true, 
                                              // value: password,
                                              onChange: function (e) {
                                                setsecretkeyError(e.target.value == "" ? true : false);
                                                setsecretkey(e.target.value)
                                              }
                                          }}
                                      />
                                    </GridItem>
                                    {Transactionloading && <LinearProgress />}
                                    <Button
                                      size="small"
                                      color="primary"
                                      type={"submit"}
                                      onClick={Fundcampaign}
                                      disabled={Transactionloading}
                                    >
                                      Fund campaign
                                    </Button> 
                                    </form>
                                    </>)}
                            </CardContent>
                            <Divider />
                          </Card>
                        </GridItem>
                      </GridContainer>
                    )}
                    {loading && <LinearProgress />}
                    {!loading && !campaign && (
                      <GridItem
                        xs={11}
                        sm={11}
                        md={11}
                        lg={11}
                        style={{ "text-align": "center" }}
                      >
                        <Typography variant="h4" noWrap>
                          campaign Not Found
                        </Typography>
                      </GridItem>
                    )}
                  </CardBody>
                </Card>
              </GridItem>
            </GridContainer>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
