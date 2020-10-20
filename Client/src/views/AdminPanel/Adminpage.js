/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState,useEffect } from "react";
import axios from 'axios';
import FormData from 'form-data';
// var FormData = require("form-data");
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
// import Icon from "@material-ui/core/Icon";
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';

import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
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
import { getallendcampaigns } from "utility/Usercontrol";
import { getallunapprovedKycs } from "utility/Usercontrol";
import { getallunapprovedcampaigns } from "utility/Usercontrol";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";




import Button from "@material-ui/core/Button";
import { useSnackbar } from "notistack";


// const stylescamapign = makeStyles(styles);
const stylescamapign = makeStyles({
  media: {
    height: 130,
    width : 150
  },
  card: {
    padding: 30,
    "min-height": "500px"
  }
});


function Adminpanel(props) {
  const classes = stylescamapign();
  const { ...rest } = props;
  const [loading, setLoading] = useState(false);
  const [endcampagins, setendcampaigns] = useState(false);
  const [campaigns, setcampaigns] = useState([]);
  const [kycs, setkycs] = useState([]);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    async function fetchall() {
      setLoading(true);
      const camp = await getallunapprovedcampaigns();
      if (camp !== null) {
        setcampaigns(camp);
        console.log(campaigns);
      }

      const kycapp = await getallunapprovedKycs();
      if (kycapp !== null) {
        setkycs(kycapp);
      }  

      const endcamp = await getallendcampaigns();
      if(endcamp !== null){
        setendcampaigns(endcamp);
      }

      setLoading(false);
    }
    fetchall();
  }, []);

 

  useEffect(() => {
    async function fetchcampaignimage() {}
    fetchcampaignimage();
  }, []);

      async function ApproveCampaign(id,userid,index){
        try{
          let postbody =
          {
              id : id,
              userid : userid
          } 
          const response = await axios.post('http://localhost:5000/api/approvecampaign',postbody, {
            headers: {
              "Content-Type": "application/json"
            }
          });

          if(response.status == 200){
            enqueueSnackbar("Campaign Approved Successfully", { variant: "success" });
            const del =  campaigns.filter((_, i) => i !== index);
            setcampaigns(del);
            console.log("success")
          }
        }catch(err)
        {
          console.log(err)
        }
    }


    async function RejectCampaign(id,userid,index){
      try{
        let postbody =
          {
              id : id,
              userid : userid
          } 
        const response = await axios.post('http://localhost:5000/api/rejectcampain',postbody, {
          headers: {
            "Content-Type": "application/json"
          }
        });

        if(response.status == 200){
          enqueueSnackbar("Campaign Rejected Successfully", { variant: "success" });
          const del =  campaigns.filter((_, i) => i !== index);
          setcampaigns(del);
          console.log("success")
        }
      }catch(err)
      {
        console.log(err)
      }
  }

    
  async function Deletecampaign(id,index){
    try{
      
      const response = await axios.get(`http://localhost:5000/api/deletecampaign/${id}`, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      if(response.status == 200){
        enqueueSnackbar("Campaign Deleted Successfully", { variant: "success" });
        const del =  endcampagins.filter((_, i) => i !== index);
        setendcampaigns(del);
        console.log("success")
      }
    }catch(err)
    {
      console.log(err)
    }
}

    async function Approvekyc(id,userid,index){
        try{
          let postbody =
          {
              id : id,
              userid : userid
          } 
          const response = await axios.post('http://localhost:5000/api/approvekyc', postbody,{
            headers: {
              "Content-Type": "application/json"
            }
          });

          if(response.status == 200){
            enqueueSnackbar("KYC Approved Successfully", { variant: "success" });
            const del =  kycs.filter((_, i) => i !== index);
            setkycs(del);
            console.log("success")
          }
        }catch(err)
        {
          console.log(err)
        }
    }

    async function Rejectkyc(id,userid,index){
      try{
        let postbody =
          {
              id : id,
              userid : userid
          } 
        const response = await axios.post('http://localhost:5000/api/rejectkyc',postbody, {
          headers: {
            "Content-Type": "application/json"
          }
        });

        if(response.status == 200){
          enqueueSnackbar("KYC Rejected Successfully", { variant: "success" });
          const del =  kycs.filter((_, i) => i !== index);
          setkycs(del);
          console.log("success")
        }
      }catch(err)
      {
        console.log(err)
      }
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
            <div className={classes.container}>
              <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={12} lg={12}>
                <Card className={classes.card}>
                  <CardHeader color="info" className={classes.cardHeader}>
                    <h4>Campaign Approvals</h4>
                  </CardHeader>
                  <CardBody>
                    <GridContainer justify="center">
                    {campaigns.length > 0 && (
                                       
                    <Table className={classes.table} size="small" aria-label="a dense table">
                                   <TableHead>
                                        <TableRow>
                                            <TableCell align="center">Campaign Name</TableCell>
                                            <TableCell  align="center">Image</TableCell>
                                            <TableCell align="center">Story</TableCell>
                                            <TableCell  align="center">End Date</TableCell>
                                            <TableCell align="center">Amount</TableCell>
                                            <TableCell align="center">Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {campaigns.map((item, index) => (
                                          <TableRow key={index}>
                                            <TableCell>{item.campaignname}</TableCell>
                                            <TableCell>
                                                <CardMedia
                                                        className={classes.media}
                                                        image={item.image}
                                                        title={item.campaignname}
                                                      />
                                                </TableCell>
                                              <TableCell>
                                                  <Typography                
                                                    variant="body2"
                                                    color="textSecondary"
                                                    component="p"
                                                    item
                                                    xs
                                                    spacing={2}
                                                  >
                                                    {item.story}
                                                  </Typography>
      
                                              </TableCell>
                                            <TableCell>{item.targetdate}</TableCell>
                                            <TableCell>{item.amount}</TableCell>
                                            <TableCell><Button color="primary" round onClick={() => { ApproveCampaign(item._id,item.userid,index);}} >Approve
                                            </Button>&nbsp;<Button color="primary" round onClick={() => { RejectCampaign(item._id,item.userid,index);}} >reject</Button></TableCell>
                                          </TableRow>
                                    ))}
                                    </TableBody>
                    </Table>)}

                      {campaigns.length === 0 && !loading && (
                        <GridItem
                          style={{ "text-align": "center" }}
                          xs={11}
                          sm={11}
                          md={11}
                          lg={11}
                        >
                          <Typography variant="h4" noWrap>
                            No pending approvals
                          </Typography>
                        </GridItem>
                      )}
                    </GridContainer>
                    {loading && <LinearProgress />}
                  </CardBody>
                </Card>
                <Card className={classes.card}>
                  <CardHeader color="info" className={classes.cardHeader}>
                    <h4>KYC Approvals</h4>
                  </CardHeader>
                  <CardBody>
                    <GridContainer justify="center">
                    {kycs.length > 0 && (
                                        
                                          
                    <Table className={classes.table} size="small" aria-label="a dense table">
                                   <TableHead>
                                        <TableRow>
                                            <TableCell align="center">Full Name</TableCell>
                                            <TableCell align="center">NIC Front</TableCell>
                                            <TableCell align="center">NIc Back</TableCell>
                                            <TableCell align="center">Address proofe</TableCell>
                                            <TableCell  align="center">Tel NO</TableCell>
                                            <TableCell align="center">Address</TableCell>
                                            <TableCell align="center">Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {kycs.map((item, index) => (
                                          <TableRow key={index}>
                                            <TableCell>{item.fname}</TableCell>
                                            <TableCell>
                                                <CardMedia
                                                        className={classes.media}
                                                        image={item.imagecolection[0]}
                                                      />
                                            </TableCell>
                                            <TableCell>
                                                <CardMedia
                                                        className={classes.media}
                                                        image={item.imagecolection[1]}
                                                      />
                                            </TableCell>
                                            <TableCell>
                                                <CardMedia
                                                        className={classes.media}
                                                        image={item.imagecolection[3]}
                                                      />
                                            </TableCell>
                                            <TableCell>{item.telno}</TableCell>
                                            <TableCell>{item.addressone}</TableCell>
                                            <TableCell><Button color="primary" round  onClick={() => { Approvekyc(item._id,item.userid,index);}}>Approve</Button>
                                            &nbsp;<Button color="primary" round onClick={() => { Rejectkyc(item._id,item.userid,index);}} >reject</Button></TableCell>
                                          </TableRow>
                                      ))}
                                    </TableBody>
                                </Table> )}

                      {kycs.length === 0 && !loading && (
                        <GridItem
                          style={{ "text-align": "center" }}
                          xs={11}
                          sm={11}
                          md={11}
                          lg={11}
                        >
                          <Typography variant="h4" noWrap>
                          No pending approvals
                          </Typography>
                        </GridItem>
                      )}
                    </GridContainer>
                    {loading && <LinearProgress />}
                  </CardBody>
                </Card>
                <Card className={classes.card}>
                  <CardHeader color="info" className={classes.cardHeader}>
                    <h4>Campaigns Completed</h4>
                  </CardHeader>
                  <CardBody>
                    <GridContainer justify="center">
                    {endcampagins.length > 0 && (
                                       
                    <Table className={classes.table} size="small" aria-label="a dense table">
                                   <TableHead>
                                        <TableRow>
                                            <TableCell align="center">Campaign Name</TableCell>
                                            <TableCell  align="center">Image</TableCell>
                                            <TableCell align="center">Story</TableCell>
                                            <TableCell  align="center">End Date</TableCell>
                                            <TableCell align="center">Amount</TableCell>
                                            <TableCell align="center">Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {endcampagins.map((item, index) => (
                                          <TableRow key={index}>
                                            <TableCell>{item.campaignname}</TableCell>
                                            <TableCell>
                                                <CardMedia
                                                        className={classes.media}
                                                        image={item.image}
                                                        title={item.campaignname}
                                                      />
                                                </TableCell>
                                              <TableCell>
                                                  <Typography                
                                                    variant="body2"
                                                    color="textSecondary"
                                                    component="p"
                                                    item
                                                    xs
                                                    spacing={2}
                                                  >
                                                    {item.story}
                                                  </Typography>
      
                                              </TableCell>
                                            <TableCell>{item.targetdate}</TableCell>
                                            <TableCell>{item.amount}</TableCell>
                                            <TableCell><Button color="primary" round onClick={() => { Deletecampaign(item._id,index);}} >Delete
                                            </Button></TableCell>
                                          </TableRow>
                                    ))}
                                    </TableBody>
                    </Table>)}

                      {endcampagins.length === 0 && !loading && (
                        <GridItem
                          style={{ "text-align": "center" }}
                          xs={11}
                          sm={11}
                          md={11}
                          lg={11}
                        >
                          <Typography variant="h4" noWrap>
                          No Pending Delete Campaigns
                          </Typography>
                        </GridItem>
                      )}
                    </GridContainer>
                    {loading && <LinearProgress />}
                  </CardBody>
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

export default withRouter(Adminpanel);
