/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
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

const campaignstyles = makeStyles({
  media: {
    height: 140
  }
});

function CampaignItem(props) {
  const classes = campaignstyles();

  useEffect(() => {
    async function fetchcampaignimage() {}
    fetchcampaignimage();
  }, []);
  return (
    <div>
      <Card className={classes.main} style={{ "max-height": "300px" }}>
        <CardActionArea>
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
        </CardActionArea>
        {props.campaign_list && (
          <Button color="info" size="small" round>
            View Campaign
          </Button>
        )}

        <Divider />
      </Card>
      <br />
    </div>
  );
}

export default withRouter(CampaignItem);
