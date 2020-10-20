/*eslint-disable*/
import React, { useState,useEffect } from "react";
// react components for routing our app without refresh
import { withRouter } from "react-router-dom";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

// @material-ui/icons
import { Home } from "@material-ui/icons";
import AddIcon from '@material-ui/icons/Add';

// core components
import CustomDropdown from "components/CustomDropdown/CustomDropdown.js";
import Button from "components/CustomButtons/Button.js";
import {getUserSession } from "../../utility/Usercontrol";

import styles from "assets/jss/material-kit-react/components/headerLinksStyle.js";

const useStyles = makeStyles(styles);

function HeaderLinks(props) {
  const classes = useStyles();
  const [user, setUser] = useState(null);


  useEffect(() => {
    const user = getUserSession();
    setUser(user)
  }, []);
  return (
    <List className={classes.list}>
      <ListItem className={classes.listItem}>
        <Button
          className={classes.navLink}
          onClick={e => e.preventDefault()}
          color="transparent" onClick={() => {
            props.history.push("/")
          }}
        ><Home className={classes.icons} />
          Home</Button>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Button
          onClick={() => {
            props.history.push("/Campaignlist")
          }} className={classes.navLink}
          color="transparent"
        >Campaigns</Button>
      </ListItem>
      {user && user.approve == 1?
        <ListItem className={classes.listItem}>
          <Button
            className={classes.navLink}
            onClick={e => e.preventDefault()}
            color="transparent" onClick={() => {
              props.history.push("/Createcampaign")
            }}
          ><AddIcon className={classes.icons} />
          Create Campaign</Button>
        </ListItem>
        : null}
      {user && user.type == "admin" ?
          <ListItem className={classes.listItem}>
          <Button
            className={classes.navLink}
            onClick={e => e.preventDefault()}
            color="transparent"
            round onClick={() => {
              props.history.push("/Adminpanel")
            }}
          >
            Admin Panel
                  </Button>
        </ListItem>    
      : null}
      {user ? 
         <ListItem className={classes.listItem}>
          <CustomDropdown
            right
            caret={true}
            buttonText={
              user.username
            }
            buttonProps={{
              className:
                classes.navLink + " " + classes.imageDropdownButton,
              color: "transparent"
            }}
            hoverColor={{
              color: "primary"
            }}
            dropdownList={[
              <h6
                onClick={() => {
                  props.history.push("/profile/" + user.publicKey)
                }} className={classes.navLink}
              >Profile
                  </h6>
              ,
              <span
                onClick={() => {
                  localStorage.removeItem("token")
                  props.history.push("/main")
                }} className={classes.navLink}
              >Logout
                    </span>
            ]}
          />
        </ListItem> : 
        <ListItem className={classes.listItem}>
          <Button
            className={classes.registerNavLink}
            onClick={e => e.preventDefault()}
            color="info"
            round onClick={() => {
              props.history.push("/main")
            }}
          >
            Sign In
                  </Button>
        </ListItem>
      }
    </List >
  );
}

export default withRouter(HeaderLinks);