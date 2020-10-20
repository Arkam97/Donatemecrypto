import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { SnackbarProvider } from "notistack";

import "assets/scss/material-kit-react.scss?v=1.9.0";
import LandingPage from "views/LandingPage/LandingPage";
import Createcampaign from "views/Createcampaign/Createcampaign";
import CampaignList from "views/Campaignspages/CamapignList";
import Adminpage from "views/AdminPanel/Adminpage";
import Userprofile from "views/Userprofile/Userprofilepage";
import Mainpage from "views/Userpages/mainpage";
import Kycapprove from "views/Userpages/Kycapprove";
import Campaignviewpage from "views/Campaignspages/Campaignviewpage";

var hist = createBrowserHistory();

ReactDOM.render(
  <SnackbarProvider maxSnack={3}>
    <Router history={hist}>
      <Switch>
        <Route path="/home" component={LandingPage} />
        <Route path="/main" component={Mainpage} />
        <Route path="/Createcampaign" component={Createcampaign} />
        <Route path="/Campaignlist" component={CampaignList} />
        <Route path="/Adminpanel" component={Adminpage} />
        <Route path="/profile/:id" component={Userprofile} />
        <Route path="/Kycapprove" component={Kycapprove}/>
        <Route path="/campaign/:id" component={Campaignviewpage} />
        <Redirect from="/" to="/home" />
      </Switch>
    </Router>
  </SnackbarProvider>,
  document.getElementById("root")
);
