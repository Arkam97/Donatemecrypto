/* eslint-disable react/prop-types */
import React from "react";
import { enc } from "crypto-js";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import Button from "components/CustomButtons/Button.js";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Chip from "@material-ui/core/Chip";
import Divider from "@material-ui/core/Divider";
import { withRouter } from "react-router-dom";

// const useStyles = makeStyles(styles);
const useStyles = makeStyles(theme => ({
  root: {
    width: "100%"
  },
  heading: {
    fontSize: theme.typography.pxToRem(15)
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  },
  icon: {
    verticalAlign: "bottom",
    height: 20,
    width: 20
  },
  details: {
    alignItems: "center"
  },
  column: {
    flexBasis: "33.33%"
  },
  helper: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    padding: theme.spacing(1, 2)
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline"
    }
  }
}));

function encrypt(myString) {
  // PROCESS
  const encryptedWord = enc.Utf8.parse(myString); // encryptedWord Array object
  const encrypted = enc.Base64.stringify(encryptedWord); // string: 'NzUzMjI1NDE='
  return encrypted;
}

function TransactionsExpansions(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1c-content"
          id="panel1c-header"
        >
          <div className={classes.column}>
            <Typography className={classes.heading}>
              {props.transaction.created_at}
            </Typography>
          </div>
          <div className={classes.column}>
            <Typography className={classes.secondaryHeading}>
              {props.transaction.amount} {props.transaction.asset_code}
            </Typography>
          </div>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.details}>
          <div className={classes.column}>
            <Typography variant="caption">From Public Key</Typography>
            <Chip
              label={props.transaction.from}
              onClick={() => {
                props.history.push("/profile/" + props.transaction.from);
              }}
            />
          </div>
        </ExpansionPanelDetails>
        <ExpansionPanelDetails>
          <div className={classes.column}>
            <Typography variant="caption">To Public Key</Typography>
            <Chip
              label={props.transaction.to}
              onClick={() => {
                props.history.push("/profile/" + props.transaction.to);
              }}
            />
          </div>
        </ExpansionPanelDetails>
        <ExpansionPanelActions>
          <a
            href={
              "https://www.stellar.org/laboratory/#explorer?resource=operations&endpoint=for_transaction&values=" +
              encrypt(
                JSON.stringify({
                  transaction: props.transaction.transaction_hash
                })
              ) +
              "&network=test"
            }
            // eslint-disable-next-line react/jsx-no-target-blank
            target="_blank"
          >
            {" "}
            <Button size="small" color="primary">
              View Transaction in Blockchain
            </Button>
          </a>
        </ExpansionPanelActions>
        <Divider />
      </ExpansionPanel>
    </div>
  );
}

export default withRouter(TransactionsExpansions);
