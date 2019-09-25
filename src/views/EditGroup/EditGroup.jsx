import React from "react";
import {withRouter} from "react-router-dom"
import {Grid, Row, Col} from "react-bootstrap"
import Card from "components/Card/Card"
import NotificationSystems from "react-notification-system";
// import Button from "components/CustomButton/CustomButton"
import Button from "react-bootstrap-button-loader"
import isIp from "is-ip"

import {style} from "variables/Variables"
import { updateGroup } from "../../utilities/Api";

class EditGroup extends React.Component {
    constructor(props) {
        super(props)

        this.onInputChange = this.onInputChange.bind(this)
        this.editGroup = this.editGroup.bind(this)
        this.showNotification = this.showNotification.bind(this)
        this.state = {
            notification : null,
            name : "",
            groupid : -99,
            isloading: false
        }
    }

    componentDidMount() {
        this.setState({
            notification : this.refs.notificationSystems2,
            name : this.props.location.state.group.groupName,
            groupid : this.props.location.state.group.groupId
        })
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

    onInputChange(event) {
        this.setState({
            [event.target.name] : event.target.value
        })
    }

    editGroup() {
        this.setState({
            isloading : true
        })
        let successCallback = function(data) {
            
            let res = data.data.data
            if((data.data.code === 0)) {
                this.showNotification({message : "Group edited successfully"})
                this.props.history.push({
                    pathname : "/groups",
                    state : {
                        from : this.props.location.pathname
                    }
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

        let requestBody =  {
            groupName : this.state.name
        }

        updateGroup(requestBody, + this.state.groupid, successCallback, errorCallback)
        
    }

    render() {

        return(
            <div className="content">
                <NotificationSystems ref={"notificationSystems2"} style={style}/>
                <Grid fluid>
                    <Row>
                        <div className="mb-sm-8">
                            <Col md={8} lg={6}>
                                <Card 
                                    title="Edit Group"
                                    category="Change group's name">
                                    <Button bsStyle="warning" 
                                        pullLeft fill type="button"
                                        onClick={() => {this.props.history.goBack()}}>
                                        Back
                                    </Button>


                                <div className="clearfix" />
                                </Card>
                            </Col>
                        </div>
                        
                    </Row>

                    <Row>
                        <Col md={8} lg={6}>
                            <Card>
                                <Row>
                                    <Col xs={12} sm={12} md={12} >
                                        <h6>Device Name</h6>
                                        <input name="name" 
                                            type="text" 
                                            className="form-control"
                                            onChange={this.onInputChange}
                                            value={this.state.name}/>
                                    </Col>
                                </Row>
                                
                                <br/>
                             
                                <Button bsStyle="info"
                                    type="button"
                                    loading={this.state.isloading}
                                    onClick={this.editGroup}
                                    disabled={this.state.name.length < 4}>
                                    
                                    {this.state.isloading ? " " : "Edit Device"}
                                </Button>

                                <div className="clearfix" />
                            </Card>
                        </Col>
                    </Row>
                </Grid>
            </div>
        )
    }
}

export default withRouter(EditGroup)