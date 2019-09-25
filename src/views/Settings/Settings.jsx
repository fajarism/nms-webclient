import React from "react";
import {withRouter} from "react-router-dom"
import {Grid, Row, Col} from "react-bootstrap"
import Card from "components/Card/Card"
import NotificationSystems from "react-notification-system";
import Button from "react-bootstrap-button-loader"

import {style, storage} from "variables/Variables"
import defaultAvatar from "assets/img/default-avatar.png"

import {updateUser, uploadProfPic, IMAGE_DIR_URL} from "utilities/Api"

class Settings extends React.Component {
    constructor(props) {
        super(props)

        this.onRefreshTimeChanged = this.onRefreshTimeChanged.bind(this)
        this.changeUserSettings = this.changeUserSettings.bind(this)
        this.updateUser = this.updateUser.bind(this)
        this.showNotification = this.showNotification.bind(this)
        this.isSubmitDisabled = this.isSubmitDisabled.bind(this)
        this.onInputChange = this.onInputChange.bind(this)
        this.upload = this.upload.bind(this)
        this.onImageChange = this.onImageChange.bind(this)
        this.state = {
            notification : null,
            name : "",
            nik : "",
            password : "", 
            confirmpassword : "",
            issubmitdisabled : true,
            groups : [],
            addressvalidation : true,
            garduinduk : -99,
            isloading  :false,
            refreshtime : 5,
            filename : "",
            image : ""
        }
    }

    componentDidMount() {
        let profPic = localStorage.getItem(storage.profpic)
        
        this.setState({
            notification : this.refs.notificationSystems,
            name : localStorage.getItem(storage.fullname),
            nik : localStorage.getItem(storage.nik),
            refreshtime : localStorage.getItem("refreshtime"),
            image : profPic === "null" || profPic === undefined ? "" : profPic
        })
    }

    onRefreshTimeChanged(event) {
        this.setState({refreshtime : event.target.value})
        this.changeUserSettings(event.target.value)

    }

    changeUserSettings(refreshTime) {
        this.setState({
            isloading : true
        })

        let successCallback = function(data) {
            
            let res = data.data.data
            if((data.data.code === 0)) {
                localStorage.setItem("refreshtime", refreshTime)
                this.setState({
                    isloading : false
                })
            
                this.showNotification({message : "Refresh time has been updated"})
                
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
            setting : JSON.stringify({refreshtime : refreshTime })
        }

        updateUser(requestBody, 
            localStorage.getItem(storage.id) + "/" + localStorage.getItem(storage.nik),
            successCallback, errorCallback)
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

    isSubmitDisabled() {
        return !(this.state.name.length > 3 &&
             this.state.nik.length >= 6 &&
             this.state.password === this.state.confirmpassword)    
    }

    updateUser(request) {
        this.setState({
            isloading : true
        })

        let successCallback = function(data) {
            localStorage.setItem(storage.fullname, this.state.name)
            localStorage.setItem(storage.nik, this.state.nik)

            this.setState({
                isloading : false,
                password : "",
                confirmpassword : ""
            })
            let res = data.data.data
            if((data.data.code === 0)) {
                this.showNotification({message : "User profile has been updated"})
                window.location.reload()
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

        let requestBody = request ||  {
            fullname : this.state.name,
            nik : this.state.nik,
            password : this.state.password === "" ? null : this.state.password,
            id : localStorage.getItem(storage.id)
        }

        updateUser(requestBody, 
            localStorage.getItem(storage.id) + "/" + localStorage.getItem(storage.nik),
            successCallback, errorCallback)
    }

    onInputChange(event) {
        this.setState({
            [event.target.name] : event.target.value
        })
    }

    onImageChange() {
        let imageInput = document.getElementById("file-picker-trigger")
        if(imageInput.files === undefined) return

        let fileName = localStorage.getItem(storage.nik)
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
                localStorage.setItem(storage.profpic, IMAGE_DIR_URL + "/profpic/" + fileName)
                this.updateUser({
                    profpic : IMAGE_DIR_URL + "/profpic/" +  fileName
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

        uploadProfPic(formData,
            successCallback, errorCallback)
        
    }

    render() {
        
        return(
            <div className="content">
                <NotificationSystems ref={"notificationSystems"} style={style}/>
                <Grid fluid>
                    <Row>

                        <div className="mb-sm-8">
                        <Col md={8} lg={6}>
                            <Card 
                                title="Settings"
                                category="This settings only applied to your account">
                               
                            </Card>
                        </Col>
                        </div>
                    </Row>

                    <Row>
                        <Col md={8} lg={6}>
                            <Card>
                                <Row>
                                    <Col xs={7} sm={7} md={9} >
                                        <h6>Refresh Time</h6>
                                        <p className="category">
                                            Indicates when will be the next refresh time to get device status in seconds
                                        </p>
                                    </Col>
                                    <Col xs={5} sm={3} md={3} lg={3}>
                                        <select className="form-control" onChange={this.onRefreshTimeChanged} value={this.state.refreshtime}>
                                            {/* <option value={1}>1s</option> */}
                                            <option value={5}>5s</option>
                                            <option value={10}>10s</option>
                                            <option value={30}>30s</option>
                                            <option value={60}>60s</option>
                                        </select>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={8} lg={6}>
                            <Card>
                                <h4 className="title">User Profile</h4>
                                <p className="category">Change your user information</p>
                                <br/>
                                <Row>
                                    <Col xs={12} sm={12} md={12} >
                                        <img className="upload-profile-picture" 
                                            src={this.state.image === "" ? defaultAvatar : this.state.image} 
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
                                        <h6>User fullname</h6>
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
                                        <h6>NIK</h6>
                                        
                                        <input name="nik" 
                                            type="text" 
                                            // className={this.state.nik? "form-control" : "form-control has-error"}
                                            className="form-control"
                                            value={this.state.nik}
                                            onChange={this.onInputChange}/>
                                    </Col>
                                </Row>

                                <br/>

                                <Row>
                                    <Col xs={12} sm={12} md={12} >
                                        <h6>Password</h6>
                                        
                                        <input name="password" 
                                            type="text" 
                                            // className={this.state.nik? "form-control" : "form-control has-error"}
                                            className="form-control"
                                            value={this.state.password}
                                            onChange={this.onInputChange}
                                            type="password"/>
                                    </Col>
                                </Row>

                                <br/>

                                <Row>
                                    <Col xs={12} sm={12} md={12} >
                                        <h6>Confirm Password</h6>
                                        
                                        <input name="confirmpassword" 
                                            type="password" 
                                            // className={this.state.nik? "form-control" : "form-control has-error"}
                                            className="form-control"
                                            value={this.state.confirmpassword}
                                            onChange={this.onInputChange}/>
                                    </Col>
                                </Row>

                                <br/>
                             
                                <Button bsStyle="info" 
                                    type="button"
                                    loading={this.state.isloading}
                                    onClick={() => this.updateUser(null)}
                                    disabled={this.isSubmitDisabled()}>
                                    
                                    {this.state.isloading ? " " : "Edit User"}
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

export default withRouter(Settings)