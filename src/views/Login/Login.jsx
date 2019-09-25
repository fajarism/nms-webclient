import React from "react";
import {withRouter} from "react-router-dom"
import {Grid, Row, Col} from "react-bootstrap"
import Card from "components/Card/Card"
import NotificationSystems from "react-notification-system";
import Button from "components/CustomButton/CustomButton"

import bg from "assets/img/abstract_bg.jpg"
import "assets/css/custom.css"

import {style, storage} from "variables/Variables"
import {login} from "utilities/Api"
import swal from "sweetalert"

class Login extends React.Component {
    constructor(props) {
        super(props)

        this.onInputChange = this.onInputChange.bind(this)
        this.doLogin = this.doLogin.bind(this)
        this.showNotification = this.showNotification.bind(this)
        this.onPasswordEnter = this.onPasswordEnter.bind(this)
        this.state = {
            notification : null,
            nik : "",
            password :"",
            issubmitdisabled : true
        }
    }

    componentDidMount() {
        this.setState({
            notification : this.refs.notificationSystems2
        }, () => {
            if(this.props.location) {
                if(this.props.location.state) {
                    if(this.props.location.state.status === "401") {
                        this.showNotification({
                            message : this.props.location.state.message,
                            level : "error"
                        })
                        return
                    }

                    if(this.props.location.state.from) {
                        this.showNotification({message: "Logout Successful"})
                }
              }
            }
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
        let isSubmitDisabled = this.state.nik.length < 3 || this.state.password.length < 7
        this.setState({
            [event.target.name] : event.target.value,
            issubmitdisabled : isSubmitDisabled
        })
    }

    onPasswordEnter(event) {
        if(event.keyCode === 13) {
            this.doLogin()
        }
    }

    doLogin() {
        swal({
            title : "Logging in",
            closeOnClickOutside: false,
            button : false,
            text : "Please wait ..."
        })

        let successCallback = function(data) {
            swal.close()

            let res = data.data.data
            if((data.data.code)) {
                this.showNotification({"message" : "Login Successful"})
                localStorage.setItem(storage.session, res.session)
                localStorage.setItem(storage.profpic, res.profpic)
                localStorage.setItem(storage.level, res.level)
                localStorage.setItem(storage.fullname, res.fullname)
                localStorage.setItem(storage.id, res.id)
                localStorage.setItem(storage.nik, res.nik)
                localStorage.setItem(storage.created_at, res.createdAt)
                localStorage.setItem(storage.updated_at, res.updatedAt)
                
                let setting = JSON.parse(res.setting)
                localStorage.setItem("refreshtime", setting === null ? 10 : setting.refreshtime)
                
                this.props.history.push({
                    pathname : "/dashboard",
                    state : {
                        from : this.props.location.pathname
                    }
                })    
            }

            else this.showNotification({"message" : res.message})

        }.bind(this)
        
        let errorCallback = function(error) {
            swal.close()
            if(error === null || error === undefined) return
            if(error.hasOwnProperty("data")) this.showNotification({"message":error.data.message, "level":"error"})
        }.bind(this)

        let reqBody = {
            nik : this.state.nik,
            password : this.state.password
        }

        login(reqBody, successCallback, errorCallback)        
    }

    render() {

        return(
            <div className="">
                <NotificationSystems ref={"notificationSystems2"} style={style}/>
                <Grid fluid>
                    <Col className={"hidden-xs hidden-sm"} md={1} lg={3}>
                    
                    </Col>

                    <Col xs={12} md={10} lg={6} className="login-container">
                        <Card hidecontent={true}>
                            
                            <Row>
                                <div id="login-brand-bg"
                                    style={{"backgroundImage": "url("+bg+")"}}>
                                    <div id="login-brand-fg">

                                    </div>
                                </div>
                                <Col xs={2} sm={4} md={4}>
                                    <Row>
                                        
                                    </Row>
                                </Col>

                                <Col xs={10} sm={10} md={8} className="login-form-container">
                                
                                        <p className="login-brand-text">NMS-TELEPROTEKSI</p>
                                        <p className="login-brand-desc">
                                            A web application for monitoring your protection devices 
                                        </p>

                                        <p className="login-welcome-message">
                                            Welcome back, please log in to your account !
                                        </p>

                                        <Row>
                                            <Col xs={12} sm={12} md={12} >
                                                <h6>NIK</h6>
                                                <input name="nik" 
                                                    type="text" 
                                                    className="form-control"
                                                    onChange={this.onInputChange}/>
                                            </Col>
                                        </Row>
                                        <br/>
                                        <Row>
                                            <Col xs={12} sm={12} md={12} >
                                                <h6>Password</h6>
                                                
                                                <input name="password" 
                                                    type="password" 
                                                    className="form-control"
                                                    value={this.state.address}
                                                    onChange={this.onInputChange}
                                                    onKeyDown={this.onPasswordEnter}/>
                                            </Col>
                                        </Row>

                                        <Button bsStyle="info" className="btn-fill pull-right login-button"
                                            pullRight fill type="button"
                                            onClick={this.doLogin}
                                            disabled={this.state.issubmitdisabled}>
                                            LOGIN
                                        </Button>
                                    
                                </Col>
                            </Row>
                        </Card>
                    </Col>

                    <Col className={"hidden-xs hidden-sm"} xs={1} md={3}>
                    
                    </Col>
                </Grid>
            </div>
        )
    }
}

export default withRouter(Login)