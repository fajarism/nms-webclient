import React from "react";
import {withRouter} from "react-router-dom"
import {Grid, Row, Col} from "react-bootstrap"
import Card from "components/Card/Card"
import NotificationSystems from "react-notification-system";
// import Button from "components/CustomButton/CustomButton"
import Button from "react-bootstrap-button-loader"
import isIp from "is-ip"
import defaultAvatar from "assets/img/default-avatar.png"

import {style, storage} from "variables/Variables"
import {updateUser,  uploadProfPic, IMAGE_DIR_URL} from "utilities/Api"

class EditUser extends React.Component {
    constructor(props) {
        super(props)

        this.onInputChange = this.onInputChange.bind(this)
        this.updateUser = this.updateUser.bind(this)
        this.onSelectChanged = this.onSelectChanged.bind(this)
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
            level : 1,
            issubmitdisabled : true,
            groups : [],
            addressvalidation : true,
            garduinduk : -99,
            isloading  :false
        }
    }

    componentDidMount() {
        let user = this.props.location.state.user
        this.setState({
            notification : this.refs.notificationSystems2,
            name : user.fullname,
            nik : (user.nik).toString(),
            level : user.level,
            image : user.profpic
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

    isSubmitDisabled() {
       return !(this.state.name.length > 3 &&
            this.state.nik.length >= 6 &&
            this.state.password === this.state.confirmpassword)
            
    }

    onSelectChanged(event) {
        this.setState({
            level : event.target.value
        })

        console.log(event.target.value)
    }

    updateUser(request) {
        this.setState({
            isloading : true
        })

        let successCallback = function(data) {
            this.setState({
                isloading : false
            })
            let res = data.data.data
            if((data.data.code === 0)) {
                if(request) {
                    setTimeout(() => {window.location.reload()}, 100)
                }
                else this.props.history.push({
                    pathname : "/users",
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

        let requestBody = request ||  {
            fullname : this.state.name,
            nik : this.state.nik,
            level : this.state.level,
            password : this.state.password === "" ? null : this.state.password,
            id : this.props.location.state.user.id
        }

        updateUser(requestBody, 
            this.props.location.state.user.id + "/" + this.props.location.state.user.nik,
            successCallback, errorCallback)
        
    }

    onImageChange() {
        let imageInput = document.getElementById("file-picker-trigger")
        if(imageInput.files === undefined) return

        let fileName = this.state.nik
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
                this.updateUser({
                    profpic : IMAGE_DIR_URL + "/profpic/" +  fileName,
                    nopushback : false
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
                <NotificationSystems ref={"notificationSystems2"} style={style}/>
                <Grid fluid>
                    <Row>
                        <div className="mb-sm-8">
                            <Col md={8} lg={6}>
                                <Card 
                                    title="Edit User"
                                    category="Modify user's information">
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
                                <Row>
                                    <Col xs={12} sm={12} md={12} >

                                    <h6>Permission</h6>
                                    <select className="form-control add-device" onChange={this.onSelectChanged} value={this.state.level}>
                                        <option value={1}>Regular User</option>
                                        <option value={99}>Administrator</option>
                                    </select>
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

export default withRouter(EditUser)