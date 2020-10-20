import React, { useState } from "react";
import StellarSdk from "stellar-sdk";


// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";

import Email from "@material-ui/icons/Email";
import People from "@material-ui/icons/People";
// core components
import CustomInput from "components/CustomInput/CustomInput.js";
import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
import image from "assets/img/poor.jpg";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import { signup } from "utility/Usercontrol";
import CardHeader from "components/Card/CardHeader.js";
import GridItem from "components/Grid/GridItem.js";
import CardFooter from "components/Card/CardFooter.js";
import GridContainer from "components/Grid/GridContainer.js";
import CardBody from "components/Card/CardBody.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import styles from "assets/jss/material-kit-react/views/loginPage.js";
import Typography from "@material-ui/core/Typography";
import { useSnackbar } from "notistack";
import LinearProgress from "@material-ui/core/LinearProgress";

let pair = StellarSdk.Keypair.random();
// const pair = StellarSdk.Keypair;
const stylesignup = makeStyles(styles);

function Signup(props) {
  const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
  const { ...rest } = props;
  setTimeout(function() {
    setCardAnimation("");
  }, 700);

  const [username, setusername] = useState("");
  const [useremail, setuseremail] = useState("");
  const [pwd, setpwd] = useState("");
  const [confirmpwd, setConfirmpwd] = useState("");


  const [loading, setLoading] = useState(false);
  //hover and show
  const [hoverpwd, setHoverpwd] = useState(false);
  const [showpwd, setShowpwd] = useState(false);

  //Errors
  const [usernameError, setusernameError] = useState(false);
  const [useremailError, setuseremailError] = useState(false);
  const [pwdError, setpwdError] = useState(false);
  const [confirmpwdError, setConfirmpwdError] = useState(false);

  const classes = stylesignup();

  // const { ...rest } = props;
  const { enqueueSnackbar } = useSnackbar();

  const Signupaccess = async event => {
    event.preventDefault();
    var ch = /^(([^<>()[\]\\.,;:\s@\\"]+(\.[^<>()[\]\\.,;:\s@\\"]+)*)|(\\".+\\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    //required check
    setusernameError(username === "" ? true : false);
    setuseremailError(useremail === "" || !ch.test(useremail) ? true : false);
    setpwdError(pwd === "" ? true : false);
    setConfirmpwdError(confirmpwd === "" || pwd !== confirmpwd ? true : false);

    // }
    if (
      username !== "" &&
      useremail !== "" &&
      pwd !== "" &&
      confirmpwd !== "" &&
      pwd === confirmpwd 
    ) {
      setLoading(true);
      
      props.setpublicKey(pair.publicKey());
      props.setprivatekey(pair.secret());

       let publickey =  pair.publicKey()
      const response = await signup(
        username,
        useremail,
        pwd,
        publickey
      );
      switch (response) {
        case 200:
          enqueueSnackbar("Signed up Successfully", { variant: "success" });
          props.setaction('Blockchainkey')
          break;
        case 202:
          enqueueSnackbar("user email Already Exists", { variant: "warning" });
          setuseremailError(true);
          break;
        case 203:
          enqueueSnackbar("username Already Exists", {
            variant: "warning"
          });
          setusernameError(true);
          break;
        case null:
          enqueueSnackbar("Signed up Failed", { variant: "error" });
      }
      setLoading(false);
    }
  };

  return (
        <div className={classes.container}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={5}>
              <Card className={classes[cardAnimaton]}>
                <form
                  className={classes.form}
                  onSubmit={Signupaccess}
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
                    <h3>Sign Up</h3>
                  </CardHeader>
                  <CardBody>
                    <CustomInput
                      error={usernameError}
                      labelText="Username *"
                      id="Username"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "text",
                        endAdornment: (
                          <InputAdornment position="end">
                            <People className={classes.inputIconsColor} />
                          </InputAdornment>
                        ),
                        onChange: function(e) {
                          setusername(e.target.value);

                          setusernameError(
                            e.target.value === "" ? true : false
                          );
                        },
                        value: username
                      }}
                    />
                    <CustomInput
                      error={useremailError}
                      labelText="Useremail *"
                      id="Useremail"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "email",
                        endAdornment: (
                          <InputAdornment position="end">
                            <Email className={classes.inputIconsColor} />
                          </InputAdornment>
                        ),
                        required: true,
                        onChange: function(e) {
                          setuseremail(e.target.value);
                          var ch = /^(([^<>()[\]\\.,;:\s@\\"]+(\.[^<>()[\]\\.,;:\s@\\"]+)*)|(\\".+\\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                          setuseremailError(
                            e.target.value === "" || !ch.test(e.target.value)
                              ? true
                              : false
                          );
                        },
                        value: useremail
                      }}
                    />
                    <CustomInput
                      error={pwdError}
                      labelText="password *"
                      id="password"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: !showpwd ? "password" : "text",
                        endAdornment: (
                          <InputAdornment position="end">
                            {hoverpwd && (
                              <Icon
                                onMouseEnter={() => {
                                  setHoverpwd(true);
                                }}
                                onMouseLeave={() => {
                                  setHoverpwd(false);
                                }}
                                className={classes.inputIconsColor}
                                onClick={() => {
                                  setShowpwd(!showpwd);
                                }}
                              >
                                {showpwd ? "visibilityoff" : "visibility"}
                              </Icon>
                            )}

                            {!hoverpwd && (
                              <Icon
                                className={classes.inputIconsColor}
                                onMouseEnter={() => {
                                  setHoverpwd(true);
                                }}
                                onMouseLeave={() => {
                                  setHoverpwd(false);
                                }}
                              >
                                lock
                              </Icon>
                            )}
                          </InputAdornment>
                        ),
                        autoComplete: "off",
                        onChange: function(e) {
                          setpwd(e.target.value);

                          setpwdError(e.target.value === "" ? true : false);
                        },
                        value: pwd
                      }}
                    />
                    <CustomInput
                      error={confirmpwdError}
                      labelText="Confirm password *"
                      id="confirmpassword"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "password",
                        endAdornment: (
                          <InputAdornment position="end">
                            <Icon className={classes.inputIconsColor}>
                              lock
                            </Icon>
                          </InputAdornment>
                        ),
                        autoComplete: "off",
                        onChange: function(e) {
                          setConfirmpwd(e.target.value);

                          setConfirmpwdError(
                            e.target.value === "" || pwd !== e.target.value
                              ? true
                              : false
                          );
                        },
                        value: confirmpwd
                      }}
                    />
                    {loading && <LinearProgress />}
                  </CardBody>
                  <CardFooter className={classes.cardFooter}>
                    <Button
                      color="info"
                      round
                      // size="lg"
                      regular
                      type={"submit"}
                      onClick={Signupaccess}
                      disabled={loading}
                    >
                      Sign up{" "}
                    </Button>
                  </CardFooter>
                  <Typography
                    gutterBottom
                    variant="body2"
                    color="textSecondary"
                    align={"center"}
                  >
                    If you already a member?
                    <Button
                      simple
                      color="info"
                      onClick={(e) => {
                        e.preventDefault()
                        props.setaction('Signin')
                      }}
                    >
                      sign in
                    </Button>
                  </Typography>
                </form>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
  );
}

export default Signup;
