import React from "react";
import {withRouter} from "react-router-dom"
import {Grid, Row, Col} from "react-bootstrap"
import Card from "components/Card/Card"
import NotificationSystems from "react-notification-system";

import {style} from "variables/Variables"
import UserStatusCard from "components/UserStatusCard/UserStatusCard"
import Button from "components/CustomButton/CustomButton"
import {getAllUsers, deleteUser, getUsersBySearch} from "utilities/Api"
import swal from "sweetalert"
import {FlowerSpinner} from "react-epic-spinners"
import ReactPaginate from "react-paginate"
 
class UserSearch extends React.Component {
    constructor(props) {
        super(props)

        this.showNotification = this.showNotification.bind(this)
        this.getAllUsers = this.getAllUsers.bind(this)
        this.removeUser = this.removeUser.bind(this)
        this.onUserDeleteButtonClicked = this.onUserDeleteButtonClicked.bind(this)
        this.onInputChange = this.onInputChange.bind(this)
        this.onInputEnter = this.onInputEnter.bind(this)
        this.searchUser = this.searchUser.bind(this)
        this.onPageSelected = this.onPageSelected.bind(this)
        
        this.state = {
            notification : null,
            users : [],
            isfetching : false,
            input : "",
            offset : 0,
            total : 0
        }
    }

    componentDidMount() {
        this.setState({
            notification : this.refs.notificationSystems
        }, () => {
            // this.getAllUsers()
        })       
    }

    searchUser(offset) {
        this.setState({
            isfetching : true
        })

        let successCallback = function(data) {
            let res = data.data.data
            this.showNotification({message : "Result for :  " + this.state.input})
                this.setState({
                    users : res.rows,
                    isfetching : false,
                    total : res.count
                })

        }.bind(this)
        
        let errorCallback = function(error) {
            this.setState({
                isfetching : false
            })
            if(error === null || error === undefined) return
            if(error.hasOwnProperty("data")) this.showNotification({"message":error.data.message, "level":"error"})
        }.bind(this)

        let data = "?query=" + this.state.input + "&page=" + offset + "&count=20"
        getUsersBySearch(data, successCallback, errorCallback)
    }

    onInputChange(event) {
        this.setState({
            [event.target.name] : event.target.value
        })
    }

    onInputEnter(event) {
        if(event.keyCode === 13) this.searchUser(0)
    }

    onPageSelected(data) {
        this.searchUser(Math.ceil(data.selected))
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

            else {
                this.showNotification({"message" : res.message})
                this.setState({
                    isfetching : false
                })
            }

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
                this.searchUser(0)
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
        let pageCount = Math.ceil(this.state.total / 20)
        console.log(pageCount)
        return(
            <div className="content">
                <NotificationSystems ref={"notificationSystems"} style={style}/>
                <Grid fluid>
                    <Row>
                        <Col md={6} lg={6}>
                            <Card 
                                title="Search Users"
                                category="You can search user by name or nik">

                               <Button bsStyle="warning" 
                                    pullLeft fill type="button"
                                    onClick={() => {this.props.history.goBack()}}>
                                    Back
                                </Button>

                                <div className="search-container">
                                    <span>
                                        <h6>Input search here with minimum 4 characters</h6>
                                        <input type="text" className="form-control search" name="input"
                                            placeholder="Name or NIK" onChange={this.onInputChange}
                                            onKeyDown={this.onInputEnter}/>
                                        <button disabled={this.state.input.length < 4} 
                                            className="btn btn-info search"
                                            onClick={() => this.searchUser(0)}>
                                            <i className="pe-7s-search"/>
                                        </button>
                                    </span>
                                </div>
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

                    <Row>
                        <div className="content content-paginate"
                            hidden={this.state.users.length < 1}>
                            <ReactPaginate
                                pageCount={pageCount}
                                pageRangeDisplayed={3}
                                onPageChange={this.onPageSelected}/>
                        </div>
                    </Row>
                </Grid>
            </div>
        )
    }
}

export default withRouter(UserSearch)