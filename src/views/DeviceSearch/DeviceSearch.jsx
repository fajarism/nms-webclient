import React from "react";
import {withRouter} from "react-router-dom"
import {Grid, Row, Col} from "react-bootstrap"
import Card from "components/Card/Card"
import NotificationSystems from "react-notification-system";

import {style} from "variables/Variables"
import UserStatusCard from "components/UserStatusCard/UserStatusCard"
import DeviceCard from "components/DeviceCard/DeviceCard"
import Button from "components/CustomButton/CustomButton"
import {deleteDevice, getDevicesBySearch} from "utilities/Api"
import swal from "sweetalert"
import {FlowerSpinner} from "react-epic-spinners"
import ReactPaginate from "react-paginate"
 
class DeviceSearch extends React.Component {
    constructor(props) {
        super(props)

        this.showNotification = this.showNotification.bind(this)
        this.removeDevice = this.removeDevice.bind(this)
        this.onDeviceDeleteButtonClicked = this.onDeviceDeleteButtonClicked.bind(this)
        this.onInputChange = this.onInputChange.bind(this)
        this.onInputEnter = this.onInputEnter.bind(this)
        this.searchDevice = this.searchDevice.bind(this)
        this.onPageSelected = this.onPageSelected.bind(this)
        
        this.state = {
            notification : null,
            devices : [],
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

    searchDevice(offset) {
        this.setState({
            isfetching : true
        })

        let successCallback = function(data) {
            let res = data.data.data
            this.showNotification({message : "Result for :  " + this.state.input})
                this.setState({
                    devices : res.rows,
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
        getDevicesBySearch(data, successCallback, errorCallback)
    }

    onInputChange(event) {
        this.setState({
            [event.target.name] : event.target.value
        })
    }

    onInputEnter(event) {
        if(event.keyCode === 13) this.searchDevice(0)
    }

    onPageSelected(data) {
        this.searchDevice(Math.ceil(data.selected))
    }

    removeDevice(device) {
        let successCallback = function(data) {
            let res = data.data.data
            if((data.data.code === 0)) {
                this.showNotification({message : "Device " + device.hardwareName + " has been deleted succesfully"})
                this.searchDevice(0)
            }

            else this.showNotification({"message" : res.message})

        }.bind(this)
        
        let errorCallback = function(error) {
            if(error === null || error === undefined) return
            if(error.hasOwnProperty("data")) this.showNotification({"message":error.data.message, "level":"error"})
        }.bind(this)

        deleteDevice(device.hardwareId, successCallback, errorCallback)
    }


    onDeviceDeleteButtonClicked(device){
        swal({
            title : "Delete Device?",
            text : "Are you sure you want to delete device " + device.hardwareName + " with id " + device.hardwareId,
            icon : "warning",
            buttons : ["Cancel", "Delete"],
            dangerMode : true,
          })
            .then((positiveButton) => {
              if(positiveButton) {
                this.removeDevice(device)
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
        console.log(this.state.devices)
        return(
            <div className="content">
                <NotificationSystems ref={"notificationSystems"} style={style}/>
                <Grid fluid>
                    <Row>
                        <Col md={6} lg={6}>
                            <Card 
                                title="Search devices"
                                category="You can search device by address or name">

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
                                            onClick={() => this.searchDevice(0)}>
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
                        {this.state.devices.map(function(item, index){
                            return(<DeviceCard key={index} device={item} onDeleteClicked={this.onDeviceDeleteButtonClicked}/>)
                        }.bind(this))}
                    </Row>

                    <Row>
                        <div className="content content-paginate"
                            hidden={this.state.devices.length < 1}>
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

export default withRouter(DeviceSearch)