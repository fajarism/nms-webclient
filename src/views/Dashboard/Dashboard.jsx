import React, { Component } from "react";
import ChartistGraph from "react-chartist";
import { Grid, Row, Col } from "react-bootstrap";

import { Card } from "components/Card/Card.jsx";
import { StatsCard } from "components/StatsCard/StatsCard.jsx";
import { Tasks } from "components/Tasks/Tasks.jsx";
import NotificationSystems from "react-notification-system";
import {
  style
} from "variables/Variables.jsx";

import {withRouter} from "react-router-dom"

import {getDashboardInfo} from "utilities/Api"

class Dashboard extends Component {
  constructor(props) {
    super(props)

    this.getDashboardInfo = this.getDashboardInfo.bind(this)
    this.showNotification = this.showNotification.bind(this)

    this.state ={
      dashboardinfo : {
        numuser : 0,
        numgroup : 0,
        numhw : 0,
        numhwon : 0,
        numhwoff : 0
      }
    }
  }

  componentDidMount() {
    this.setState({
      notification : this.refs.notificationSystems2
    }, () => {
      this.getDashboardInfo()
      let interval = window.setInterval(this.getDashboardInfo, localStorage.getItem("refreshtime") * 1000 || 10000)
      this.setState({
          interval : interval
      })
    })
  }

  componentWillUnmount() {
    window.clearInterval(this.state.interval)
  }

  getDashboardInfo() {
    let successCallback = function(data) {
            
      let res = data.data.data
      if((data.data.code === 0)) {
          this.showNotification({message : "Dashboard info has been updated"})
          // console.log(res)
          this.setState({
            dashboardinfo : res
          })
      }

      else this.showNotification({"message" : res.message})
  }.bind(this)
  
  let errorCallback = function(error) {
      this.setState({
          isloading : false
      })
      if(error === null || error === undefined) return
      if(error.hasOwnProperty("data")) this.showNotification({"message":error.data.message, "level":"error"})
  }.bind(this)

  getDashboardInfo(successCallback, errorCallback)
  
  }

  showNotification(param) {
    let notificationParameter = param || {}
    this.state.notification.addNotification({
         title: <span data-notify="icon" className={notificationParameter.icon || "pe-7s-speaker"} />,
         message: (
             <div>
             {notificationParameter.message || "Operation Successful"}
             </div>
         ),
         level: notificationParameter.level || "success",
         position: notificationParameter.position || "tr",
         autoDismiss: notificationParameter.autoDismiss || 5
     })
 }

  render() {
    return (
      <div className="content">
        <NotificationSystems ref={"notificationSystems2"} style={style}/>
        <Grid fluid>
            <Row>
              <div className="mb-sm-8">
                  <Col md={12} lg={10}>
                      <Card 
                          title="Devices"
                          category="Devices that are linked to this application"
                          content={
                            <div>
                              <Col md={4} lg={4}>
                                <div className="cursor-pointer" onClick={() => {this.props.history.push("/device")}}>
                                  <StatsCard
                                    bigIcon={<i className="pe-7s-server text-info" />}
                                    statsText="Devices"
                                    statsValue={parseInt(this.state.dashboardinfo.numhwon) + parseInt(this.state.dashboardinfo.numhwoff)}
                                    statsIcon={<i className="fa fa-refresh" />}
                                    statsIconText="Total devices"
                                  />

                                </div>
                              </Col>
                            <div>
                              <Col md={4} lg={4}>

                                <div className="cursor-pointer" onClick={() => {this.props.history.push("/device")}}>
                                <StatsCard
                                  bigIcon={<i className="pe-7s-plug text-danger" />}
                                  statsText="Device Off"
                                  statsValue={this.state.dashboardinfo.numhwoff}
                                  statsIcon={<i className="fa fa-refresh text-danger" />}
                                  statsIconText="Please check the devices"
                                />

                                </div>
                              </Col>
                            </div>

                            <div>
                              <Col md={4} lg={4}>
                                <div className="cursor-pointer" onClick={() => {this.props.history.push("/device")}}>
                                  <StatsCard
                                    bigIcon={<i className="pe-7s-bell text-success" />}
                                    statsText="Device On"
                                    statsValue={this.state.dashboardinfo.numhwon}
                                    statsIcon={<i className="fa fa-refresh" />}
                                    statsIconText="Devices are working properly"
                                  />

                                 </div>
                              </Col>
                              </div>
                            </div>
                          }>
                      <div className="clearfix" />
                      </Card>
                  </Col>
              </div>
            </Row>

            <Row>
              <div className="mb-sm-8">
                  <Col md={6} lg={4}>

                      <div className="cursor-pointer" onClick={() => {this.props.history.push("/users")}}>
                      <Card 
                          title="Users"
                          category="Users registered in this application"
                          content={
                            <StatsCard
                              bigIcon={<i className="pe-7s-users text-info" />}
                              statsText="Users"
                              statsValue={this.state.dashboardinfo.numuser}
                              statsIcon={<i className="fa fa-refresh" />}
                              statsIconText="Updated now"
                            />
                          }>
                      <div className="clearfix" />
                      </Card>
                      </div>
                  </Col>

                  <Col md={6} lg={6}>

                      <div className="cursor-pointer" onClick={() => {this.props.history.push("/groups")}}>
                      <Card 
                          title="Device Groups"
                          category="Group that are available for devices to be added"
                          content={
                            <StatsCard
                              bigIcon={<i className="pe-7s-network text-info" />}
                              statsText="Device Groups"
                              statsValue={this.state.dashboardinfo.numgroup}
                              statsIcon={<i className="fa fa-refresh" />}
                              statsIconText="Updated now"
                            />
                          }>
                      <div className="clearfix" />
                      </Card>
                      </div>
                  </Col>
              </div>
            </Row>
        </Grid>
      </div>
    );
  }
}

export default withRouter(Dashboard);
