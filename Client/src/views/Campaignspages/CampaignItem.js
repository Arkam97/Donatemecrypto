/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import CardActionArea from "@material-ui/core/CardActionArea";
import Divider from "@material-ui/core/Divider";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import Card from "@material-ui/core/Card";
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import ShareIcon from '@material-ui/icons/Share';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import {FacebookShareButton, FacebookIcon ,TwitterShareButton,TwitterIcon,WhatsappShareButton,WhatsappIcon  } from "react-share";
import axios from 'axios';
import { MDBIcon, MDBContainer, MDBBtn } from 'mdbreact';

const campaignstyles = makeStyles({
  media: {
    height: 140
  }
});

function CampaignItem(props) {
  const classes = campaignstyles();
  const [like, setlike] = useState(0);
  const [likeaction,setlikeaction] = useState(null);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    async function fetchcampaignimage() {}
    fetchcampaignimage();
    setlike(props.camapign_likes);
  }, []);

  async function handellike(id)
  {
    try
    {
      if(likeaction == null)
      {
        let newCount = like + 1;
        const response = await axios.post('http://localhost:5000/api/likecampaign',{
          _id : id,
          likecount : newCount
        }, {
          headers: {
            "Content-Type": "application/json"
          }
        }); 
        if(response.status == 200){
          setlike(newCount);
          setlikeaction('liked');
        }
      }
      else{
        let newCount = like - 1;
        const response = await axios.post('http://localhost:5000/api/dislikecampaign',{
          _id : id,
          likecount : newCount
        }, {
          headers: {
            "Content-Type": "application/json"
          }
        }); 
        if(response.status == 200){
          setlikeaction(null);
          setlike(newCount);
          
        }
      }
      
      
    }
    catch(err)
    {
      console.log(err);
    }
  }


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
  };

  return (
    <div>
      <Card className={classes.main} style={{ "max-height": "300px" }}>
          <CardMedia
            className={classes.media}
            image={props.campaign_image}
            title={props.campaign_name}
          />
          <CardContent container wrap="nowrap">
            <Tooltip title={props.campaign_name}>
              <Typography noWrap gutterBottom variant="h5" component="h2">
                {props.campaign_name}
              </Typography>
            </Tooltip>
            <Typography
              noWrap
              variant="body2"
              color="textSecondary"
              component="p"
              item
              xs
              spacing={2}
            >
              {props.campaign_story}
            </Typography>
          </CardContent>
          <CardActions disableSpacing>
                <IconButton aria-label="Like" onClick={() => {handellike(props.campaign_id)}}>
                    <ThumbUpAltIcon/>
                </IconButton>
                  <span >{like}</span>
                  <div>
                      <IconButton aria-label="share" onClick={handleClickOpen}>
                        <ShareIcon />
                      </IconButton>
                      <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
                          <DialogTitle id="simple-dialog-title">Share this campaign</DialogTitle>
                          <List>
                            <ListItem>
                              <FacebookShareButton 
                                url={"http://localhost:3000//campaign/"+ props.campaign_id}
                                quote={"Donatemecrypto - We rise by lifting others"}
                                hashtag={"#Donation "+"#"+props.campaign_name}
                                className={classes.socialMediaButton}>
                               <Button
                                    size="small"
                                    variant="contained"
                                    style={{
                                      backgroundColor: "#4169e1",
                                  }}
                                    className={classes.button}
                                    startIcon={<FacebookIcon />}
                                  >
                                    Facebook
                                </Button>
                              </FacebookShareButton>
                              </ListItem>
                              <ListItem>
                                <TwitterShareButton
                                    url={"http://localhost:3000//campaign/"+ props.campaign_id}
                                    title={"Donatemecrypto - We rise by lifting others"}
                                    hashtag={"#Donation "+"#"+props.campaign_name}
                                    className={classes.socialMediaButton}
                                  >
                                    <Button
                                     size="small"
                                     variant="contained"
                                     style={{
                                       backgroundColor: "#1e90ff",
                                   }}
                                     className={classes.button}
                                    startIcon={<TwitterIcon/>}
                                  >
                                    Twitter
                                </Button> 
                                </TwitterShareButton>
                              </ListItem>
                              <ListItem>
                                  <WhatsappShareButton
                                      url={"http://localhost:3000//campaign/"+ props.campaign_id}
                                      title={"Donatemecrypto - We rise by lifting others"}
                                      separator=":: "
                                      className={classes.socialMediaButton}
                                  >
                                    <Button
                                    size="small"
                                    variant="contained"
                                    style={{
                                      backgroundColor: "#32cd32",
                                  }}
                                    className={classes.button}
                                    startIcon={<WhatsappIcon/>}
                                    >
                                      whatsapp
                                    </Button>
                                  </WhatsappShareButton>
                              </ListItem>                              
                          </List>
                      </Dialog>
                  </div>
                <Button color="info" size="small" round
                 onClick={() => {
                  props.history.push("/campaign/"+ props.campaign_id)
                }}
                >
                  View Campaign
                </Button>
          </CardActions> 
        <Divider />
      </Card>
      <br />
    </div>
  );
}

export default withRouter(CampaignItem);
