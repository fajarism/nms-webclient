import React from "react";
import {withRouter} from "react-router-dom"
import {Grid, Row, Col} from "react-bootstrap"
import Card from "components/Card/Card"
import NotificationSystems from "react-notification-system";
// import Button from "components/CustomButton/CustomButton"
import Button from "react-bootstrap-button-loader"
import isIp from "is-ip"
import defaultAvatar from "assets/img/default-database-circle.png"

import {style, storage} from "variables/Variables"
import {getGroup, updateDevice, uploadDevice, IMAGE_DIR_URL} from "utilities/Api"

class EditDevice extends React.Component {
    constructor(props) {
        super(props)

        this.onInputChange = this.onInputChange.bind(this)
        this.editDevice = this.editDevice.bind(this)
        this.onSelectChanged = this.onSelectChanged.bind(this)
        this.getDeviceGroup = this.getDeviceGroup.bind(this)
        this.showNotification = this.showNotification.bind(this)
        this.upload = this.upload.bind(this)
        this.onImageChange = this.onImageChange.bind(this)
        this.state = {
            notification : null,
            name : "",
            address :"192.168.1.10",
            issubmitdisabled : true,
            groups : [],
            addressvalidation : true,
            garduinduk : -99,
            isloading: false
        }
    }

    componentDidMount() {
        this.setState({
            notification : this.refs.notificationSystems2,
            name : this.props.location.state.device.hardwareName,
            address : this.props.location.state.device.hardwareAddr,
            garduinduk : this.props.location.state.device.groupId,
            initialgarduinduk : this.props.location.state.device.groupId,
            hardwareId : this.props.location.state.device.hardwareId,
            image : this.props.location.state.device.hardwarePic
        })

        this.getDeviceGroup()
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

    getDeviceGroup() {
        let successCallback = function(data) {

            let res = data.data.data
            if((data.data.code === 0)) {
                this.showNotification({"message" : "Get Group Device Successful"})  
                this.setState({
                    groups : res,
                    garduinduk : this.props.location.state.device.groupId
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

    onInputChange(event) {
        // let isAddressValid = isIp.v4(this.state.address)
        let isSubmitDisabled = this.state.name.length < 3 || this.state.address.length < 7 
            // || (!isAddressValid)
        this.setState({
            [event.target.name] : event.target.value,
            issubmitdisabled : isSubmitDisabled,
            // addressvalidation : isAddressValid
        })
    }

    onSelectChanged(event) {
        this.setState({
            garduinduk : event.target.value
        })

        console.log(event.target.value)
    }

    editDevice(request) {
        this.setState({
            isloading : true
        })
        let successCallback = function(data) {
            
            let res = data.data.data
            if((data.data.code === 0)) {
                this.showNotification({message : "Device edited successfully"})
                if(request) {
                    setTimeout(() => {window.location.reload()}, 100)
                }
                
                else this.props.history.push({
                    pathname : "/device",
                    state : {
                        from : this.props.location.pathname
                    }
                })

                this.getDeviceGroup()
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

        let requestBody =  request || {
            hardwareAddr : this.state.address,
            hardwareName : this.state.name,
            groupId :  this.state.garduinduk,
            initialGroupId : this.state.initialgarduinduk,
            hardwareId : this.state.hardwareId
        }

        updateDevice(requestBody, successCallback, errorCallback)
        
    }

    onImageChange() {
        let imageInput = document.getElementById("file-picker-trigger")
        if(imageInput.files === undefined) return

        let fileName = this.state.garduinduk + "-" + this.state.hardwareId
        this.upload(fileName)
    }

    upload(fileName) {
        this.setState({
            isloading : true
        })
        
        let successCallback = function(data) {
            
            this.setState({
                isloading : false,
                password : "",
                confirmpassword : ""
            })
            let res = data.data.data
            if((data.data.code === 0)) {
                this.editDevice({
                    hardwarePic : IMAGE_DIR_URL + "/device/" +  fileName,
                    nopushback : false,
                    groupId :  this.state.garduinduk,
                    initialGroupId : this.state.initialgarduinduk,
                    hardwareId : this.state.hardwareId
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

        let formData = new FormData()
        formData.append("image", document.getElementById("file-picker-trigger").files[0]);
        formData.append("fileName", fileName);

        uploadDevice(formData,
            successCallback, errorCallback)
        
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
                                    title="Edit Device"
                                    category="Change device's name, IP address, and group">
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
                                        <img className="upload-profile-picture" 
                                            src={this.state.image === null ? defaultAvatar : this.state.image} 
                                            width="150" height="150" title="Change Profile Picture"
                                            onClick={() => {document.getElementById("file-picker-trigger").click()}}/>
                                        <input type="file" accept="image/*" style={{"display" : "none"}} id="file-picker-trigger"
                                            onChange={this.onImageChange}/>
                                            <Button bsStyle="info" 
                                                type="button"
                                                loading={this.state.isloading}
                                                onClick={() => {document.getElementById("file-picker-trigger").click()}}
                                                style={{"margin" : "10px auto", "display": "block"}}>
                                                
                                                {this.state.isloading ? " " : "Change Picture"}
                                            </Button>

                                            <div className="clearfix" />
                                    </Col>
                                </Row>
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
                                <Row>
                                    <Col xs={12} sm={12} md={12} >
                                        <h6>IP Address</h6>
                                        <p className="category">
                                            Address of the device in the network. (Example : 192.168.1.10)
                                        </p>
                                        <input name="address" 
                                            type="text" 
                                            // className={isIp.v4(this.state.address) ? "form-control" : "form-control has-error"}
                                            className="form-control"
                                            value={this.state.address}
                                            onChange={this.onInputChange}
                                            id="input-address"/>
                                    </Col>
                                </Row>

                                <br/>
                                <Row>
                                    <Col xs={12} sm={12} md={12} >

                                    <h6>Gardu Induk</h6>
                                    <select className="form-control add-device" onChange={this.onSelectChanged} value={this.state.garduinduk}>
                                            {this.state.groups.map((group, index) => {
                                                return(<option value={group.groupId}>{group.groupName}</option>)
                                            })}
                                        </select>
                                    </Col>
                                </Row>
                                
                                <br/>
                             
                                <Button bsStyle="info"
                                    type="button"
                                    loading={this.state.isloading}
                                    onClick={() => this.editDevice(null)}
                                    disabled={this.state.issubmitdisabled}>
                                    
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

export default withRouter(EditDevice)