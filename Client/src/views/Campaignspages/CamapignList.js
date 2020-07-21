import React, { useEffect, useState } from "react";
import { withRouter, Link } from "react-router-dom";

import CardBody from "components/Card/CardBody.js";
import Typography from "@material-ui/core/Typography";
import styles from "assets/jss/material-kit-react/views/profilePage.js";
import { getallcampaigns } from "utility/Campaigncontrol";
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import Header from "components/Header/Header.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import LinearProgress from "@material-ui/core/LinearProgress";
import CampaignItem from "./CampaignItem";
import HeaderLinks from "components/Header/HeaderLinks.js";
import GridItem from "components/Grid/GridItem.js";
import CardHeader from "components/Card/CardHeader.js";
import Parallax from "components/Parallax/Parallax.js";
import Footer from "components/Footer/Footer.js";

const stylescamapign = makeStyles(styles);

function CampaignList(props) {
  const classes = stylescamapign();
  const { ...rest } = props;
  const [loading, setLoading] = useState(false);

  const [campaigns, setcampaigns] = useState([]);
  useEffect(() => {
    async function fetchallcampaigns() {
      setLoading(true);
      const intoit = await getallcampaigns();
      if (intoit !== null) {
        setcampaigns(intoit);
      }

      setLoading(false);
    }
    fetchallcampaigns();
  }, []);
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
        image={require("assets/img/bg2.jpg")}
        small
        filter
      />
      <div className={classNames(classes.mainRaised, classes.main)}>
        <div>
          <div className={classes.container}>
            <GridContainer>
              <GridItem xs={12} sm={12} md={12} lg={12}>
                <Card style={{ "min-height": "500px" }}>
                  <CardHeader color="info" className={classes.cardHeader}>
                    <h4>Campaigns</h4>
                  </CardHeader>
                  <CardBody>
                    <GridContainer justify="center">
                      {campaigns.length > 0 &&
                        campaigns.map((item, index) => (
                          <GridItem key={index} xs={12} sm={6} md={4} lg={4}>
                            <Link to={"/campaign/" + item._id}>
                              <CampaignItem
                                campaign_name={item.campaignname}
                                campaign_image={item.image}
                                campaign_list={true}
                                campaign_story={item.Story}
                                campaign_endDate={item.Dateend}
                              />
                            </Link>
                          </GridItem>
                        ))}

                      {campaigns.length === 0 && !loading && (
                        <GridItem
                          style={{ "text-align": "center" }}
                          xs={11}
                          sm={11}
                          md={11}
                          lg={11}
                        >
                          <Typography variant="h4" noWrap>
                            No campaigns Available
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
  );
}

export default withRouter(CampaignList);
