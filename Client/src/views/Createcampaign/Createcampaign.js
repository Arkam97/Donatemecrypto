/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
// import Icon from "@material-ui/core/Icon";
import LinearProgress from "@material-ui/core/LinearProgress";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import { withRouter } from "react-router-dom";
import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
import styles from "assets/jss/material-kit-react/views/componentsSections/loginStyle.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import Parallax from "components/Parallax/Parallax.js";
import classNames from "classnames";
import ImageUploader from "react-images-upload";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";
import { addcampaign } from "utility/Usercontrol";
import {  getUserSession } from "utility/Usercontrol.js";
import { useSnackbar } from "notistack";
import Button from "@material-ui/core/Button";

const createcampaignstyle = makeStyles(styles);

function Createcampaign(props) {
  const classes = createcampaignstyle();
  const { ...rest } = props;
  const [user, setUser] = useState(getUserSession());
  const [image, setimage] = useState([]);
  const [campaignname, setcampaignname] = useState("");
  const [targetdate, settargetdate] = useState(new Date());
  const [amount, setamount] = useState(null);
  const [Story, setStory] = useState("");

  const [loading, setLoading] = useState(false);

  const [imageError, setimageError] = useState(false);
  const [campaignnameError, setcampaignnameError] = useState(false);
  const [amountError, setamountError] = useState(false);
  const [targetdateerror, settargetdateerror] = useState(false);
  const [StoryError, setStoryError] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const campaignimage = picture => {
    if (picture.length > 0) {
      setimage(picture);
      setimageError(false)
    } else {
      setimage(null);
      setimageError(true)
    }
  };

  const Createcampaign = async event => {
    event.preventDefault();

    setimageError(image.length == 0 ? true : false);
    setcampaignnameError(campaignname === "" ? true : false);
    setamountError(amount === null ? true : false);
    setStoryError(Story === "" ? true : false);
    settargetdateerror(targetdate < new Date() || targetdate == new Date() ? true : false);

    if (
      image.length !== 0 && 
      campaignname !== "" && 
      amount !== null && 
      Story !== "" 
      ) 
      {
      setLoading(true);

      const response = await addcampaign(
        image[0],
        campaignname,
        amount,
        Story,
        targetdate
      );
      if (response !== null) {
        switch (response.status) {
          case 200:
            enqueueSnackbar("Campaign Created Successfully and submitted for approval", {
              variant: "success"
            });
            props.history.push('/');
            break;
          case 203:
            enqueueSnackbar("You can only create one Campaign at a time", {
              variant: "warning"
            });
            break;
          case null:
            enqueueSnackbar("Campaign Creation Failed", { variant: "error" });
        }
      }

      setLoading(false);
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
      <div
        className={classes.pageHeader}
        style={{
          backgroundColor: "white"
        }}
      >
        <div className={classNames(classes.main, classes.mainRaised)}>
          <div>
            <div className={classes.container}>
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={12} lg={12}>
                  <Card>
                    <form
                      className={classes.form}
                      onSubmit={Createcampaign}
                      style={
                        loading
                          ? {
                              filter: "blur(1px)",
                              "-webkit-filter": "blur(1px)"
                            }
                          : null
                      }
                    >
                      <CardHeader color="info" className={classes.cardHeader}>
                        <h4>Create Campaign</h4>
                      </CardHeader>
                      <CardBody>
                        <GridContainer>
                          <GridItem xs={12} sm={12} md={4} lg={3}>
                          <ImageUploader
                              style={imageError ? { "box-shadow": "0 6px 10px 0 red, 0 6px 20px 0 red" } : null}
                              label={
                                image.length === 0 
                                  ?  "Not Selected"
                                  : "Selected"
                              }                              
                              singleImage={true}
                              withIcon={true}
                              onChange={campaignimage}
                              imgExtension={[".jpg", ".gif", ".png", ".gif"]}
                              maxFileSize={5242880}
                              withPreview={true}
                              singleImage={true}
                              buttonText="Select Image *"  
                                                     
                            />
                          </GridItem>
                          <GridItem xs={12} sm={12} md={8} lg={9}>
                            <GridContainer>
                              <GridItem xs={12} sm={12} md={8} lg={8}>
                                <CustomInput
                                  error={campaignnameError}
                                  labelText="campaign name *"
                                  id="campaignname"
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    type: "text",
                                    required: true,
                                    onChange: function(e) {
                                      setcampaignname(e.target.value);
                                      setcampaignnameError(
                                        e.target.value === "" ? true : false
                                      );
                                    }
                                  }}
                                />
                              </GridItem>

                              <GridItem xs={12} sm={12} md={6} lg={6}>
                                <CustomInput
                                  error={amountError}
                                  labelText="amount *"
                                  id="amount"
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    type: "number",
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        <AttachMoneyIcon
                                          className={classes.inputIconsColor}
                                        />
                                      </InputAdornment>
                                    ),
                                    required: true, 
                                    onChange: function(e) {
                                      setamount(e.target.value);

                                      setamountError(
                                        e.target.value === null ||  e.target.value < 0 ? true : false
                                      );
                                    }
                                  }}
                                />
                              </GridItem>

                              <GridItem xs={12} sm={12} md={4} lg={4}>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                  <KeyboardDatePicker
                                    style={targetdateerror ? { "box-shadow": "0 6px 10px 0 red, 0 6px 20px 0 red" } : null}
                                    margin="normal"
                                    label="End Date *"
                                    id="date-picker-dialog"
                                    format="MM/dd/yyyy"
                                    value={targetdate}
                                    onChange={date => {
                                      settargetdate(date);
                                      settargetdateerror(date < new Date() || date == new Date() ? true : false)
                                    }}
                                    KeyboardButtonProps={{
                                      "aria-label": "change date"
                                    }}
                                  />
                                </MuiPickersUtilsProvider>
                              </GridItem>
                              <GridItem xs={12} sm={12} md={12} lg={12}>
                                <CustomInput
                                  error={StoryError}
                                  labelText="Story *"
                                  id="Story"
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    type: "text",
                                    multiline: true,
                                    rows: "2",
                                    required: true,
                                    onChange: function(e) {
                                      setStory(e.target.value);

                                      setStoryError(
                                        e.target.value === "" ? true : false
                                      );
                                    }
                                  }}
                                />
                              </GridItem>
                            </GridContainer>
                          </GridItem>
                        </GridContainer>
                        {loading && <LinearProgress />}
                      </CardBody>
                      <CardFooter className={classes.cardFooter}>
                        <Button
                          color="info"
                          type={"submit"}
                          onClick={Createcampaign}
                          disabled={loading}
                        >
                          Create Campaign
                        </Button>
                      </CardFooter>
                    </form>
                  </Card>
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

export default withRouter(Createcampaign);
