import React from "react";
import {withRouter} from "react-router-dom"
import {Grid, Row, Col} from "react-bootstrap"
import Card from "components/Card/Card"
import NotificationSystems from "react-notification-system";

import {style} from "variables/Variables"
import UserStatusCard from "components/UserStatusCard/UserStatusCard"
import Button from "components/CustomButton/CustomButton"
import {getAllUsers, deleteUser} from "utilities/Api"
import swal from "sweetalert"
import {FlowerSpinner} from "react-epic-spinners"
 
class ManageUsers extends React.Component {
    constructor(props) {
        super(props)

        this.onRefreshTimeChanged = this.onRefreshTimeChanged.bind(this)
        this.changeUserSettings = this.changeUserSettings.bind(this)
        this.showNotification = this.showNotification.bind(this)
        this.getAllUsers = this.getAllUsers.bind(this)
        this.removeUser = this.removeUser.bind(this)
        this.onUserDeleteButtonClicked = this.onUserDeleteButtonClicked.bind(this)
        
        this.state = {
            notification : null,
            users : [],
            isfetching : true
        }
    }

    componentDidMount() {
        this.setState({
            notification : this.refs.notificationSystems
        }, () => {
            this.getAllUsers()
            if(this.props.location.state !== undefined) {
                if(this.props.location.state.from.indexOf("/users/add") > -1) {
                    this.showNotification({message : "User has been created"})
                }

                if(this.props.location.state.from.indexOf("/users/edit") > -1) {
                    this.showNotification({message : "User has been updated"})
                }
            }
        })

       
    }

    getAllUsers() {
        let successCallback = function(data) {
            let res = data.data.data
            if((data.data.code === 0)) {
                this.showNotification({message : "Get users successful"})
                this.setState({
                    users : res,
                    isfetching : false
                })
            }

            else this.showNotification({"message" : res.message})

        }.bind(this)
        
        let errorCallback = function(error) {
            if(error === null || error === undefined) return
            if(error.hasOwnProperty("data")) this.showNotification({"message":error.data.message, "level":"error"})
        }.bind(this)

        getAllUsers(successCallback, errorCallback)
    }


    removeUser(user) {
        let successCallback = function(data) {
            let res = data.data.data
            if((data.data.code === 0)) {
                this.showNotification({message : "User " + user.fullname + " has been deleted succesfully"})
                this.getAllUsers()
            }

            else this.showNotification({"message" : res.message})

        }.bind(this)
        
        let errorCallback = function(error) {
            if(error === null || error === undefined) return
            if(error.hasOwnProperty("data")) this.showNotification({"message":error.data.message, "level":"error"})
        }.bind(this)

        deleteUser(user.nik, successCallback, errorCallback)
    }


    onUserDeleteButtonClicked(user){
        swal({
            title : "Delete User?",
            text : "Are you sure you want to delete user " + user.fullname + " with NIK " + user.nik,
            icon : "warning",
            buttons : ["Cancel", "Delete"],
            dangerMode : true,
          })
            .then((positiveButton) => {
              if(positiveButton) {
                this.removeUser(user)
            }})
    }

    onRefreshTimeChanged(event) {
        console.log(event.target.value)
        this.changeUserSettings(event.target.value)

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

    changeUserSettings(refreshTime) {

    // Do API Here

        this.state.notification.addNotification({
            title: <span data-notify="icon" className="pe-7s-speaker" />,
            message: (
                <div>
                Refresh time has been changed to {refreshTime} seconds
                </div>
            ),
            level: "success",
            position: "tr",
            autoDismiss: 5
        })
    }

    render() {

        return(
            <div className="content">
                <NotificationSystems ref={"notificationSystems"} style={style}/>
                <Grid fluid>
                    <Row>
                        <Col md={6} lg={6}>
                            <Card 
                                title="Manage Users"
                                category="You can add new user, delete, or modify it">
                               <Button bsStyle="info" 
                                    pullLeft fill type="button"
                                    onClick={() => {this.props.history.push("/users/add")}}>
                                    Add New User
                                </Button>

                                <Button bsStyle="success" 
                                    pullLeft fill type="button"
                                    style={{"marginLeft" : "10px"}}
                                    onClick={() => {this.props.history.push("/users/search")}}>
                                    Search User
                                </Button>

                                <div className="clearfix" />
                            </Card>
                        </Col>
                        
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
                        {this.state.users.map(function(item, index){
                            return(<UserStatusCard key={index} user={item} onDeleteButton={this.onUserDeleteButtonClicked}/>)
                        }.bind(this))}
                    </Row>
                </Grid>
            </div>
        )
    }
}

export default withRouter(ManageUsers)