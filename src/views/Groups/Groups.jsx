import React from "react";
import {withRouter} from "react-router-dom"
import {Grid, Row, Col} from "react-bootstrap"
import Card from "components/Card/Card"
import NotificationSystems from "react-notification-system";

import {style} from "variables/Variables"
import DeviceGroupCard from "components/DeviceGroupCard/DeviceGroupCard"
// import Button from "components/CustomButton/CustomButton"
import Button from "react-bootstrap-button-loader"
import {Animated} from "react-animated-css"

import {getGroup, deleteGroup, addGroup, deleteDeviceInGroup} from "utilities/Api"
import swal from "sweetalert"
import {FlowerSpinner} from "react-epic-spinners"
import ManageGroupCard from "../../components/ManageGroupCard/ManageGroupCard";

class Groups extends React.Component {
    constructor(props) {
        super(props)

        this.getAllData = this.getAllData.bind(this)
        this.onGroupDeleteButtonClicked = this.onGroupDeleteButtonClicked.bind(this)
        this.removeGroup = this.removeGroup.bind(this)
        this.onInputChange = this.onInputChange.bind(this)
        this.addGroup = this.addGroup.bind(this)
        this.removeDeviceInGroup = this.removeDeviceInGroup.bind(this)

        this.state = {
            notification : null,
            groups : [],
            notification : null,
            isfetching : true,
            isloading : false,
            name : ""
        }
    }

    componentDidMount() {
        this.setState({
            notification : this.refs.notificationSystems
        }, () => {
            this.getAllData()
            // let interval = window.setInterval(this.getAllData, localStorage.getItem("refreshtime") * 1000 || 10000)
            // this.setState({
            //     interval : interval
            // })
            if(this.props.location.state === undefined) return
            if(this.props.location.state.from.indexOf("/groups/edit") > -1) this.showNotification({
                message: "Group has been edited"
            })
        })

    }

    componentWillUnmount() {
        // window.clearInterval(this.state.interval)
    }

    onInputChange(event) {
        // let isAddressValid = isIp.v4(this.state.address)
            // || (!isAddressValid)
        this.setState({
            [event.target.name] : event.target.value
            // addressvalidation : isAddressValid
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

    onGroupDeleteButtonClicked(group){
        let swalParagraphContent = document.createElement("p")
        swalParagraphContent.innerHTML= "Are you sure you want to delete device group " + group.groupName +"? " +
            "<strong>All devices in this group will be deleted and this operation cannot be undone</strong>"

        swal({
            title : "Delete Group?",
            content : swalParagraphContent,
            icon : "warning",
            buttons : ["Cancel", "Delete"],
            dangerMode : true,
          })
            .then((positiveButton) => {
              if(positiveButton) {
                this.removeDeviceInGroup(group)
            }})
    }

    removeDeviceInGroup(group) {
        let successCallback = function(data) {
            let res = data.data.data
            if((data.data.code === 0)) {
                this.removeGroup(group)
            }

            else this.showNotification({"message" : res.message})

        }.bind(this)
        
        let errorCallback = function(error) {
            if(error === null || error === undefined) return
            if(error.hasOwnProperty("data")) this.showNotification({"message":error.data.message, "level":"error"})
        }.bind(this)

        deleteDeviceInGroup(group.groupId, successCallback, errorCallback)
    }

    removeGroup(group) {
        let successCallback = function(data) {
            let res = data.data.data
            if((data.data.code === 0)) {
                this.showNotification({message : "Group " + group.groupName + " has been deleted"})
                this.getAllData()
            }

            else this.showNotification({"message" : res.message})

        }.bind(this)
        
        let errorCallback = function(error) {
            if(error === null || error === undefined) return
            if(error.hasOwnProperty("data")) this.showNotification({"message":error.data.message, "level":"error"})
        }.bind(this)

        deleteGroup(group.groupId, successCallback, errorCallback)
    }

    addGroup() {
        this.setState({
            isloading : true
        })
        
        let successCallback = function(data) {
            this.setState({
                isloading : false,
                name : ""
            })

            let res = data.data.data
            if((data.data.code === 0)) {
                this.showNotification({message : "Group has been added"})
                this.getAllData()
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

        let requestBody = {
            groupName : this.state.name
        }

        addGroup(requestBody, successCallback, errorCallback)
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
                                title="Manage Groups"
                                category="You can add new group for device, delete, or modify it">
                            {/* <Button bsStyle="info" 
                                fill type="button"
                                onClick={() => {this.props.history.push("/add-groups")}}
                                disabled={this.state.issubmitdisabled}>
                                Add New Group
                            </Button>
                                <div className="clearfix" /> */}
                            </Card>
                        </Col>
                        </div>
                    </Row>

                    <Row>
                        <div className="mb-sm-8">

                        <Col md={6} lg={6}>
                            <Card 
                                title="Add New Group"
                                category="by filling the form below">
                                <div className="mb-8">
                                <Row>
                                        <Col xs={12} sm={12} md={12} >
                                            <h6>Group Name</h6>
                                            <input name="name" 
                                                type="text" 
                                                className="form-control"
                                                onChange={this.onInputChange}
                                                value={this.state.name}/>
                                        </Col>
                                </Row>

                                </div>
                                <Button bsStyle="info" 
                                    fill type="button"
                                    onClick={this.addGroup}
                                    disabled={this.state.name.length < 4}
                                    loading={this.state.isloading}>
                                    {this.state.isloading ? "" : "Add New Group"}
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
                                return(<ManageGroupCard key={index} group={item} 
                                    onDeleteClicked={this.onGroupDeleteButtonClicked}/>)
                            }.bind(this))}
                            
                        </Row>
                    </div>
                </Grid>
                    
            </div>
        )
    }
}

export default withRouter(Groups)