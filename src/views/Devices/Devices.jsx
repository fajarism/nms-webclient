import React from "react";
import {withRouter} from "react-router-dom"
import {Grid, Row, Col} from "react-bootstrap"
import Card from "components/Card/Card"
import NotificationSystems from "react-notification-system";

import {style} from "variables/Variables"
import DeviceGroupCard from "components/DeviceGroupCard/DeviceGroupCard"
import Button from "components/CustomButton/CustomButton"
import {Animated} from "react-animated-css"

import {getGroup} from "utilities/Api"
import swal from "sweetalert"
import {FlowerSpinner} from "react-epic-spinners"

class Devices extends React.Component {
    constructor(props) {
        super(props)

        this.getAllData = this.getAllData.bind(this)
        this.state = {
            notification : null,
            groups : [],
            notification : null,
            isfetching : true
        }
    }

    componentDidMount() {
        this.setState({
            notification : this.refs.notificationSystems
        }, () => {
            this.getAllData()
            let interval = window.setInterval(this.getAllData, localStorage.getItem("refreshtime") * 1000 || 10000)
            this.setState({
                interval : interval
            })
            if(this.props.location.state === undefined) return
            if(this.props.location.state.from.indexOf("/edit") > -1) this.showNotification({
                message: "Device edited successfully"
            })
        })

    }

    componentWillUnmount() {
        window.clearInterval(this.state.interval)
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
    
    getAllData() {
        let successCallback = function(data) {
            let res = data.data.data
            if((data.data.code === 0)) {
                this.setState({
                    groups : res,
                    isfetching : false
                })
            }

            else this.showNotification({"message" : res.message})

        }.bind(this)
        
        let errorCallback = function(error) {
            if(error === null || error === undefined) return
            if(error.hasOwnProperty("data")) this.showNotification({"message":error.data.message, "level":"error"})
        }.bind(this)

        getGroup(null, successCallback, errorCallback)
    }

    render() {
        return(
            <div className="content">
                <NotificationSystems ref={"notificationSystems"} style={style}/>
                <Grid fluid>
                    <Row>
                        <div className="mb-sm-8">

                        <Col md={6} lg={6}>
                            <Card 
                                title="Manage Devices"
                                category="You can add new device, delete, or modify it">
                            <Button bsStyle="info" 
                                fill type="button"
                                onClick={() => {this.props.history.push("/add-device")}}
                                disabled={this.state.issubmitdisabled}>
                                Add New Device
                            </Button>

                            <Button bsStyle="success" 
                                fill type="button"
                                className="ml-8"
                                onClick={() => {this.props.history.push("/groups")}}
                                disabled={this.state.issubmitdisabled}>
                                Manage Group
                            </Button>

                            <Button bsStyle="warning" 
                                fill type="button"
                                className="ml-8"
                                onClick={() => {this.props.history.push("/device/search")}}>
                                Search
                            </Button>

                                <div className="clearfix" />
                            </Card>
                        </Col>
                        </div>
                    </Row>

                    <Row>
                        <div className="content">
                            <div className="fetching-container">
                                <FlowerSpinner 
                                    color="#433f9d"
                                    size={50}
                                    className={this.state.isfetching ? "" : "hidden"}/>
                            </div>
                        </div>
                    </Row>

                    <div hidden={this.state.isfetching}>
                        <Row>
                            {this.state.groups.map(function(item, index){
                                return(<DeviceGroupCard key={index} group={item}/>)
                            })}
                            
                        </Row>
                    </div>
                </Grid>
                    
            </div>
        )
    }
}

export default withRouter(Devices)