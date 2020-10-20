import React, { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import InputFiles from 'react-input-files';
import PermIdentityIcon from "@material-ui/icons/PermIdentity";
import FaceIcon from "@material-ui/icons/Face";
import PhoneIcon from "@material-ui/icons/Phone";
import HomeIcon from "@material-ui/icons/Home";
import LocationCityIcon from "@material-ui/icons/LocationCity";
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import Parallax from "components/Parallax/Parallax.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import LinearProgress from "@material-ui/core/LinearProgress";
import { useSnackbar } from "notistack";
import styles from "assets/jss/material-kit-react/views/componentsSections/loginStyle.js";
import { createKyc } from "utility/Usercontrol";
import ImageUploader from "react-images-upload";
import image from "assets/img/poor.jpg";
import image2 from "assets/img/bg2.jpg";
import InputLabel from "@material-ui/core/InputLabel";
import Footer from "components/Footer/Footer.js";
import classNames from "classnames";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";


const kycstyles = makeStyles(styles);

function Kycapprove(props) {
  const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
  setTimeout(function() {
    setCardAnimation("");
  }, 700);

  const classes = kycstyles();
  const { ...rest } = props;

  const [nid, setnid] = useState("");
  const [birthdate, setbirthdate] = useState(new Date());
  const [front, setfront] = useState([]);
  const [back, setback] = useState([]);
  const [facefront, setFacefront] = useState([]);
  const [offletter, setoffletter] = useState([]);
  const [fname, setfname] = useState("");
  const [telno, settelno] = useState("");
  const [addressone, setaddressone] = useState("");
  const [addresstwo, setaddresstwo] = useState("");

  const [loading, setLoading] = useState(false);

  const [nidError, setnidError] = useState(false);
  const [birthdateError, setbirthdateError] = useState(false);
  const [frontError, setfrontError] = useState(false);
  const [backError, setbackError] = useState(false);
  const [facefrontError, setFacefrontError] = useState(false);
  const [offletterError, setoffletterError] = useState(false);
  const [fnameError, setfnameError] = useState(false);
  const [telnoError, settelnoError] = useState(false);
  const [addressoneError, setaddressoneError] = useState(false);
  const [addresstwoError, setaddresstwoError] = useState(false);


  const { enqueueSnackbar } = useSnackbar();
  

  const frontimage = picture => {
    if (picture.length > 0) {
      setfront(picture);
      setfrontError(false); 
    } else {
      setfront(null);
      setfrontError(true);
    }
  };

  const backimage = picture => {
    if (picture.length > 0) {
        setback(picture);
        setbackError(false);
    } else {
      setback(null);
      setbackError(true);
    }
  };

  const facefrontimage = picture => {
    if (picture.length > 0) {
        setFacefront(picture);
        setFacefrontError(false);
    } else {
      setFacefront(null);
      setFacefrontError(true);
    }
  };

  const offletterimage = picture => {
    if (picture.length > 0) {
        setoffletter(picture);
        setoffletterError(false);
    } else {
      setoffletter(null);
      setoffletterError(true);
    }
  };
  const Kycaccess = async event => {
    event.preventDefault();

    //required check
    setnidError(nid === "" ? true : false);
    setbirthdateError(birthdate > new Date() || birthdate === new Date() ? true : false);
    setfrontError(front.length === 0 ? true : false);
    setbackError(back.length === 0 ? true : false);
    setFacefrontError(facefront.length === 0 ? true : false);
    setoffletterError(offletter.length === 0 ? true : false);
    setfnameError(fname === "" ? true : false);
    settelnoError(telno === "" ? true : false);
    setaddressoneError(addressone === "" ? true : false);
    setaddresstwoError(addressone === "" ? true : false);

    if (
      nid !== "" &&
      front.length !== 0 &&
      back.length !== 0 &&
      facefront.length !== 0 &&
      offletter.length !== 0 &&
      fname !== "" &&
      telno !== "" &&
      addressone !== "" &&
      addresstwo !== ""
    ) {
      setLoading(true);

      const response = await createKyc(
        nid,
        birthdate,
        front[0],
        back[0],
        facefront[0],
        offletter[0],
        fname,
        telno,
        addressone,
        addresstwo,
      );
      switch (response) {
        case 200:
          enqueueSnackbar("Submitted for Approval", { variant: "success" });
          props.history.push('/');
          break;
        case 201:
          enqueueSnackbar("Kyc is Already Approved", { variant: "warning" });
          break;
        case 202:
          enqueueSnackbar("Kyc is Pending Approval", { variant: "warning" });
          break;
        case 203:
          enqueueSnackbar("Kyc Submission Failed", { variant: "error" });
          break;
        case null:
          enqueueSnackbar("Kyc Submission Failed", { variant: "error" });
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
          background : "url("+image2+")",
          backgroundSize: "fixed",
          backgroundPosition: "top center"
        }}
      >
        <div className={classNames(classes.main, classes.mainRaised)}>
          <div>
            <div className={classes.container}>
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={10}>
                  <Card>
                    <form
                      className={classes.form}
                        style={
                          loading
                          ? {
                          filter: "blur(1px)",
                          "-webkit-filter": "blur(1px)"
                        }
                      : null
                  }
                  onSubmit={Kycaccess}
                >
                  <CardHeader color="info" className={classes.cardHeader}>
                    <h3>Know Your Customer</h3>
                  </CardHeader>
                  <CardBody>
                        <GridContainer>
                          <GridItem xs={12} sm={12} md={6} lg={6}>
                            <CustomInput
                              error={nidError}
                              labelText=" National Identity Number*"
                              id="nid"
                              formControlProps={{
                                fullWidth: true
                              }}
                              inputProps={{
                                type: "text",
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <PermIdentityIcon
                                      className={classes.inputIconsColor}
                                    />
                                  </InputAdornment>
                                ),
                                required: true,
                                onChange: function(e) {
                                  setnid(e.target.value);
                                  setnidError(e.target.value == "" ? true : false);
                                }
                              }}
                            />
                          </GridItem>
                             <GridItem xs={12} sm={12} md={6} lg={6}>
                              <CustomInput
                              error={fnameError}
                              labelText="Full Name *"
                              id="fname"
                              formControlProps={{
                                fullWidth: true
                              }}
                              inputProps={{
                                type: "text",
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <FaceIcon className={classes.inputIconsColor} />
                                  </InputAdornment>
                                ),
                                required: true,
                                onChange: function(e) {
                                  setfname(e.target.value);
                                  setfnameError(e.target.value == "" ? true : false);
                                }
                              }}
                            />
                          </GridItem>
                          <GridItem xs={12} sm={12} md={6} lg={6}>
                            <CustomInput
                              error={telnoError}
                              labelText="Phone Number *"
                              id="telno"
                              formControlProps={{
                                fullWidth: true
                              }}
                              inputProps={{
                                type: "text",
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <PhoneIcon className={classes.inputIconsColor} />
                                  </InputAdornment>
                                ),
                                required: true,
                                onChange: function(e) {
                                  settelno(e.target.value);
                                  settelnoError(
                                    e.target.value == "" ? true : false
                                  );
                                }
                              }}
                            />
                          </GridItem>
                          <GridItem xs={12} sm={12} md={6} lg={6}>
                          <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <KeyboardDatePicker
                                style={birthdateError ? { "box-shadow": "0 6px 10px 0 red, 0 6px 20px 0 red" } : null}
                                margin="normal"
                                id="date-picker-dialog"
                                label="Date of Birth *"
                                format="MM/dd/yyyy"
                                value={birthdate}
                                onChange={date => {
                                  setbirthdate(date);
                                  setbirthdateError(
                                    date > new Date() || date === new Date() ? true : false);
                                }}
                                KeyboardButtonProps={{
                                  "aria-label": "change date"
                                }}
                              />
                            </MuiPickersUtilsProvider>
                          </GridItem>
                          <GridItem xs={12} sm={12} md={3} lg={3}>
                            <InputLabel>NIC Card Front*</InputLabel>
                            <ImageUploader
                              style={frontError ? { "box-shadow": "0 6px 10px 0 red, 0 6px 20px 0 red" } : null}
                              label={
                                front.length === 0 
                                  ?  "Not Selected"
                                  : "Selected"
                              }     
                              withIcon={true}
                              onChange={frontimage}
                              imgExtension={[".jpg", ".gif", ".png", ".gif"]}
                              maxFileSize={5242880}
                              withPreview={true}
                              singleImage={true}
                              buttonText="Select Image *"                         
                            />
                        </GridItem>
                      <GridItem xs={12} sm={12} md={3} lg={3}>
                        <InputLabel>NIC Card Back*</InputLabel>
                        <ImageUploader
                              style={backError ? { "box-shadow": "0 6px 10px 0 red, 0 6px 20px 0 red" } : null}
                              label={
                                back.length === 0 
                                  ?  "Not Selected"
                                  : "Selected"
                              }     
                              withIcon={true}
                              onChange={backimage}
                              imgExtension={[".jpg", ".gif", ".png", ".gif"]}
                              maxFileSize={5242880}
                              withPreview={true}
                              singleImage={true}
                              buttonText="Select Image *"                         
                            />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={4} lg={3}>
                        <InputLabel>clear photo of you*</InputLabel>
                        <ImageUploader
                             style={facefrontError ? { "box-shadow": "0 6px 10px 0 red, 0 6px 20px 0 red" } : null}
                             label={
                              facefront.length === 0 
                                 ?  "Not Selected"
                                 : "Selected"
                             }       
                              withIcon={true}
                              onChange={facefrontimage}
                              imgExtension={[".jpg", ".gif", ".png", ".gif"]}
                              maxFileSize={5242880}
                              withPreview={true}
                              singleImage={true}
                              buttonText="Select Image *"                         
                            />                       
                      </GridItem>
                      <GridItem xs={12} sm={12} md={4} lg={3}>
                        <InputLabel>Proof From VilageOfficer*</InputLabel>
                        <ImageUploader
                              style={offletterError ? { "box-shadow": "0 6px 10px 0 red, 0 6px 20px 0 red" } : null}
                              label={
                                offletter.length === 0 
                                  ?  "Not Selected"
                                  : "Selected"
                              }     
                              withIcon={true}
                              onChange={offletterimage}
                              imgExtension={[".jpg", ".gif", ".png", ".gif"]}
                              maxFileSize={5242880}
                              withPreview={true}
                              singleImage={true}
                              buttonText="Select Image *"                         
                            />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={12} lg={12}>
                        <CustomInput
                          error={addressoneError}
                          labelText="Home Address *"
                          id="addressone"
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            type: "text",
                            endAdornment: (
                              <InputAdornment position="end">
                                <HomeIcon className={classes.inputIconsColor} />
                              </InputAdornment>
                            ),
                            required: true,
                            onChange: function(e) {
                              setaddressone(e.target.value);
                              setaddressoneError(
                                e.target.value == "" ? true : false
                              );
                            }
                          }}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={12} lg={12}>
                        <CustomInput
                          error={addresstwoError}
                          labelText="Working place address"
                          id="addresstwo"
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            type: "text",
                            endAdornment: (
                              <InputAdornment position="end">
                                <LocationCityIcon
                                  className={classes.inputIconsColor}
                                />
                              </InputAdornment>
                            ),
                            required: true,
                            onChange: function(e) {
                              setaddresstwo(e.target.value);
                              setaddresstwoError(
                                e.target.value == "" ? true : false
                              );
                            }
                          }}
                        />
                      </GridItem>
                    </GridContainer>
                    {loading && <LinearProgress />}
                  </CardBody>

                  <CardFooter className={classes.cardFooter}>
                    <Button
                      color="info"
                      size="lg"
                      type={"submit"}
                      disabled={loading}
                      onClick={Kycaccess}
                    >
                      Proceed{" "}
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

export default Kycapprove;
