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
import {getGroup, addDevice, uploadDevice, IMAGE_DIR_URL} from "utilities/Api"
import {FlowerSpinner} from "react-epic-spinners"

class AddDevice extends React.Component {
    constructor(props) {
        super(props)

        this.onInputChange = this.onInputChange.bind(this)
        this.addDevice = this.addDevice.bind(this)
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
            isloading : false,
            isfetching : true,
            image : null
        }
    }

    componentDidMount() {
        this.setState({
            notification : this.refs.notificationSystems2
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
                    isfetching : false
                })
            }

            if(res.length > 0) {
                this.setState({
                    garduinduk : res[0].groupId
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
        this.setState({
            [event.target.name] : event.target.value,
        }, () => {
            // console.log(isUrl(this.state.address))
            // let isAddressValid = isUrl(this.state.address)
            let isSubmitDisabled = this.state.name.length < 3 || 
                this.state.address.length < 7
                // (!isAddressValid)
            this.setState({
                issubmitdisabled : isSubmitDisabled,
                // addressvalidation : isAddressValid
            })
        })
    }

    onSelectChanged(event) {
        this.setState({
            garduinduk : event.target.value
        })

        console.log(event.target.value)
    }

    addDevice(request) {
        this.setState({
            isloading : true
        })

        let imageInput = document.getElementById("file-picker-trigger")

        let successCallback = function(data) {
            this.setState({
                isloading : false
            })
            let res = data.data.data
            if((data.data.code === 0)) {
                this.showNotification({message : "Device added successfully"})
                if(imageInput.files[0]) this.upload(res.hardwareId)
            }
            else{
                this.showNotification({"message" : res.message})
            } 
        }.bind(this)
        
        let errorCallback = function(error) {
            if(error === null || error === undefined) return
            this.setState({isloading : false})
            if(error.hasOwnProperty("data")) this.showNotification({"message":error.data.message, "level":"error"})
        }.bind(this)


        let requestBody = request || {
            hardwareAddr : this.state.address,
            hardwareName : this.state.name,
            groupId : this.state.garduinduk,
            picture : (imageInput.files[0] === undefined) ? null : IMAGE_DIR_URL + "/device/" + this.state.garduinduk +"-"
        }

        addDevice(requestBody, successCallback, errorCallback)
        
    }

    onInputChange(event) {
        this.setState({
            [event.target.name] : event.target.value
        })
    }

    onImageChange() {
        let imageInput = document.getElementById("file-picker-trigger")
        if(imageInput.files === undefined) return

        let file = imageInput.files[0]
        var reader = new FileReader()
        reader.onload = function() {
            this.setState({
                image : reader.result
            })
        }.bind(this)

        reader.readAsDataURL(file)
    }

    upload(fileName) {
        this.setState({
            isloading : true
        })
        
        let successCallback = function(data) {
            let res = data.data.data
            let initialGroup = this.state.groups[1]
            if((data.data.code === 0)) {
                this.setState({
                    isloading : false,
                    address : "192.168.1.10",
                    name : "",
                    isloading : false,
                    garduinduk : initialGroup.groupId,
                    image : null
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

        let formData = new FormData()
        formData.append("image", document.getElementById("file-picker-trigger").files[0]);
        formData.append("fileName", this.state.garduinduk +"-"+ fileName);

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
                                    title="Add Device"
                                    category="Register new device into system with their name and IP address">
                                
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

                    <Row>
                        <Col md={8} lg={6}>
                            <Card hidden={this.state.isfetching}>
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
                                <br/>

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
                                            className={true ? "form-control" : "form-control has-error"}
                                            value={this.state.address}
                                            onChange={this.onInputChange}
                                            id="input-address"/>
                                    </Col>
                                </Row>

                                <br/>
                                <Row>
                                    <Col xs={12} sm={12} md={12} >

                                    <h6>Gardu Induk</h6>
                                    <select className="form-control add-device" onChange={this.onSelectChanged}>
                                            {this.state.groups.map((group, index) => {
                                                return(<option value={group.groupId}>{group.groupName}</option>)
                                            })}
                                        </select>
                                    </Col>
                                </Row>
                                
                                <br/>
                             
                                <Button bsStyle="info" type="button"
                                    onClick={() => this.addDevice(null)}
                                    loading={this.state.isloading}>
                                    {this.state.isloading ? " " : "Add Device"}
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

export default withRouter(AddDevice)