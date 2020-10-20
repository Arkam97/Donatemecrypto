import React, { useState, useEffect } from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
// @material-ui/icons
import People from "@material-ui/icons/People";
import EditIcon from '@material-ui/icons/Edit';
import Button from "components/CustomButtons/Button.js";

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';
import CustomInput from "components/CustomInput/CustomInput.js";
import CircularProgress from '@material-ui/core/CircularProgress';
import { edituserdetails } from "utility/Usercontrol";
import {  getUserSession } from "utility/Usercontrol.js";
import { useSnackbar } from "notistack";


// const useStyles = makeStyles(styles);
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  icon: {
    verticalAlign: 'bottom',
    height: 20,
    width: 20,
  },
  details: {
    alignItems: 'center',
  },
  column: {
    flexBasis: '33.33%',
  },
  helper: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    padding: theme.spacing(1, 2),
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}));


export default function DetailsExpansions(props) {
  const classes = useStyles();
  const [enlarge, setenlarge] = useState(false)
  const [data, setdata] = useState(props.data);
  const [detail, setdetail] = useState(props.detail);
  // const [userid, setuserid] = useState(props.userid);
  const [edituserloading, setedituserLoading] = useState(false);
  const [dataerror, setdataError]=useState(false);
  const [user, setUser] = useState(null);
  const { enqueueSnackbar } = useSnackbar(); 
  
   useEffect(() => {
    const user = getUserSession();
    setUser(user);
  }, []);

  const edituser = async event => {

    setdataError(data === ""? true : false);
    
    if (data !== "") 
      {
        const userid = user.publicKey;
        console.log(userid);
        setedituserLoading(true);
      console.log("data :"+ data+ " userid :"+ userid + " detail :" + detail); 
      const response = await edituserdetails(data,userid,detail);
      switch (response) {
        case 200:
          enqueueSnackbar("Successfully Updated", { variant: "success" });
          props.history.push('/'); 
          break;
        case 500:
          enqueueSnackbar("update failed", { variant: "error" });
          break;
        case null:
          enqueueSnackbar("update failed", { variant: "error" });
      }
      setedituserLoading(false);
     
  
    event.persist();
    }
    
  };
  return (

    <div className={classes.root}>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<EditIcon />}
          aria-controls="panel1c-content"
          id="panel1c-header"
        >
          <div className={classes.column}>
            <Typography className={classes.heading}>{detail}</Typography>
          </div>
          <div className={classes.column}>
            <Typography className={classes.secondaryHeading}>{props.data.substring(0, 30)}</Typography>
          </div>
        </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.details}>
            <form
              className={classes.form}
              onSubmit={edituser}
              style={
                edituserloading
                  ? {
                      filter: "blur(1px)",
                      "-webkit-filter": "blur(1px)"
                    }
                  : null
              }
              > 
              <div className={classes.column}>
                <CustomInput
                  error={dataerror}
                  labelText={detail}
                  id={detail}
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    type: "text",
                    value: data, 
                    onChange: function(e) {
                      setdata(e.target.value);

                      setdataError(
                        e.target.value === "" ? true : false
                      );
                    }
                  }}

                />
              </div>
              {edituserloading && <CircularProgress />}
              <Button size="small" color="info"  type={"submit"} onClick={edituser}  disabled={edituserloading}>
                Save
              </Button> 
            </form> 
          </ExpansionPanelDetails>
            
        <Divider />
      </ExpansionPanel>
    </div>

  );
}
