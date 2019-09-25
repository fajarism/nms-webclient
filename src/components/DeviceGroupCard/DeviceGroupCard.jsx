import React from "react";
import {withRouter} from "react-router-dom"
import {Grid, Row, Col, Image} from "react-bootstrap"
import Collapsible from "react-collapsible"
import Card from "components/Card/Card"
import femaleAvatar from "../../assets/img/faces/face-6.jpg"
import DeviceCard from "components/DeviceCard/DeviceCard"
import PropTypes from "prop-types"
import {getDevicesByGroup, deleteDevice} from "utilities/Api"
import swal from "sweetalert"
import NotificationSystems from "react-notification-system";
import "assets/sass/main.css"
import {style} from "variables/Variables"

class DeviceGroupCard extends React.Component {
    constructor(props) {
        super(props)

        this.getAllData = this.getAllData.bind(this)
        this.onDeviceDeleteButtonClicked = this.onDeviceDeleteButtonClicked.bind(this)
        this.deleteDevice = this.deleteDevice.bind(this)

        this.state = {
            name : "Lorem Ipsum Dolor Sit Amet",
            devices : []
        }
    }

    componentDidMount() {
        this.setState({
            notification : this.refs.notificationSystems
        }, () => {
            this.getAllData()

            let interval = window.setInterval(this.getAllData, localStorage.getItem("refreshtime") * 1000 || 10000)
            this.setState({
                interval : interval
            })
        })
    }

    componentWillUnmount() {
        window.clearInterval(this.state.interval)
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

    getAllData() {
        let successCallback = function(data) {
            let res = data.data.data
            if((data.data.code === 0)) {
                this.setState({
                    devices : res
                })
            }

            else this.showNotification({"message" : res.message})

        }.bind(this)
        
        let errorCallback = function(error) {
            this.setState({devices : []})
            if(error === null || error === undefined) return
            if(error.hasOwnProperty("data")) this.showNotification({"message":error.data.message, "level":"error"})
        }.bind(this)

        getDevicesByGroup(this.props.group.groupId, successCallback, errorCallback)
    }

    deleteDevice(device) {
        let successCallback = function(data) {
            let res = data.data.data
            if((data.data.code === 0)) {
                this.showNotification({message : "Device " + device.hardwareName + " has been deleted succesfully"})
                this.getAllData()
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
            text : "Are you sure you want to delete device " + device.hardwareName + " with IP address " + device.hardwareAddr,
            icon : "warning",
            buttons : ["Cancel", "Delete"],
            dangerMode : true,
          })
            .then((positiveButton) => {
              if(positiveButton) {
                this.deleteDevice(device)
            }})
    }

    render() {
        let isAllDeviceOn = true
        let numHardwareOn = 0 
        let numHardwareOff = 0
        this.state.devices.forEach((device) => {
            isAllDeviceOn = isAllDeviceOn && device.status
            device.status ? numHardwareOn++ : numHardwareOff++
        })

        let collapsibleTriggerElement = 
            <div>
                <p className="inline-block">{this.props.group.groupName}</p>
                <div className="inline-block collapsible-device-number">{ this.state.devices.length + ""}</div>
                {/* <p>{" | " + numHardwareOn + " ON | " + numHardwareOff + " OFF"}</p> */}
            </div>
        let dangerCollapsibleTriggerElement = 
            <div>
                <p className="mb-0 inline-block">{this.props.group.groupName}</p>
                <div className="inline-block collapsible-device-number">{ numHardwareOff + (this.state.devices.length === 1 ? " device" : " devices") + " need checking"}</div>
            </div>
        return(
            <Col className="user-status-card" sm={12} md={12} lg={12}>
                <NotificationSystems ref={"notificationSystems"} style={style}/>
                {/* <Card>
                    <Row>
                    <Col className="user-status-avatar">
                        <Image src={femaleAvatar} circle style={{"width":"40px", "height":"40px"}}/>
                    </Col>
                    <Col xs={8} sm={8} md={6}>
                        <Row>
                            <p className="user-status-name">{this.state.name}</p>
                        </Row>
                        <Row>
                            <p className="user-status-number">1234567</p>
                        </Row>
                    </Col>
                    <Col className="user-status-action-group" sm={12} md={4}>
                        <i title="Delete User" className="user-status-action pe-7s-trash text-danger"/>
                        <i title="Edit User"className="user-status-action pe-7s-config text-success"/>
                        <i title="Info" className="user-status-action pe-7s-info text-info"/>
                    </Col>
                    </Row>
                </Card> */}
                
                <Collapsible triggerClassName={isAllDeviceOn ? "" : "has-danger" }
                    triggerOpenedClassName={isAllDeviceOn ? "" : "has-danger"}
                    trigger={isAllDeviceOn ? collapsibleTriggerElement : dangerCollapsibleTriggerElement}>
                    {(this.state.devices.length > 0) ? this.state.devices.map((item, index) => {
                        return(<DeviceCard key={index} device={item} onDeleteClicked={this.onDeviceDeleteButtonClicked}/>)
                    }): <p>No hardware found in this group</p>}
                    
                </Collapsible>
            </Col>
        )
    }
}

DeviceGroupCard.propTypes = {
    group : PropTypes.object.isRequired
}

export default withRouter(DeviceGroupCard)