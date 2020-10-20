import React, { useState } from "react";
import { useHistory } from "react-router-dom";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";

import People from "@material-ui/icons/People";
import Typography from "@material-ui/core/Typography";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import Footer from "components/Footer/Footer.js";
import image from "assets/img/poor.jpg";

import { signin } from "utility/Usercontrol";
import LinearProgress from "@material-ui/core/LinearProgress";
import { useSnackbar } from "notistack";

import styles from "assets/jss/material-kit-react/views/loginPage.js";

const stylessignin = makeStyles(styles);

function Signin(props) {
  const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
  let history = useHistory();
  const { ...rest } = props;
  setTimeout(function() {
    setCardAnimation("");
  }, 700);

  // const [previousRoute, setPreviousRoute] = useState(props.previousRoute);
  const [username, setusername] = useState("");
  const [pwd, setpwd] = useState("");

  const [loading, setLoading] = useState(false);
  //hover and show
  const [hoverpwd, setHoverpwd] = useState(false);
  const [showpwd, setShowpwd] = useState(false);

  //Errors
  const [usernameError, setusernameError] = useState(false);
  const [pwdError, setpwdError] = useState(false);

  const classes = stylessignin();

  const { enqueueSnackbar } = useSnackbar();

  const Signin = async event => {
    event.preventDefault();
    var ch = /^(([^<>()[\]\\.,;:\s@\\"]+(\.[^<>()[\]\\.,;:\s@\\"]+)*)|(\\".+\\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    setusernameError(username !== "" || ch.test(username) ? false : true);
    setpwdError(pwd === "" ? true : false);

    if (username !== "" && pwd !== "") {
      setLoading(true);

      const response = await signin(username, pwd);
      switch (response) {
        case 200:
          enqueueSnackbar("Signed In Successfully", { variant: "success" });
          props.history.push(props.prevroute); break;
          break;
        case 202:
          enqueueSnackbar("User Account Not Found", { variant: "warning" });
          break;
        case 203:
          enqueueSnackbar("Password Is Incorrect", { variant: "error" });
          break;
        case null:
          enqueueSnackbar("Signin Failed", { variant: "error" });
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
                  onSubmit={Signin}
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
                    <h3>Sign In</h3>  
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
                    {loading && <LinearProgress />}
                  </CardBody>
                  <CardFooter className={classes.cardFooter}>
                    <Button
                      color="info"
                      round
                      regular
                      type={"submit"}
                      onClick={Signin}
                      disabled={loading}
                    >
                      Signin
                    </Button>
                  </CardFooter>

                  <Typography
                    gutterBottom
                    variant="body2"
                    color="textSecondary"
                    align={"center"}
                  >
                    Not a member?{" "}
                    <Button
                      simple
                      color="info"
                      onClick={e => {
                        e.preventDefault();
                        setusernameError(false);
                        setpwdError(false);
                        props.setaction('Signup')
                      }}
                    >
                      Sign Up
                    </Button>
                  </Typography>
                </form>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
  );
}

export default Signin;
