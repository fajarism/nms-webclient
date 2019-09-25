import React from "react";
import {withRouter} from "react-router-dom"
import {Grid, Row, Col, Image} from "react-bootstrap"
import Card from "components/Card/Card"
import PropTypes from "prop-types"
import defaultAvatar from "assets/img/default-database-circle.png"

class DeviceStatusCard extends React.Component {
    constructor(props) {
        super(props)

        this.onDeviceEditClicked = this.onDeviceEditClicked.bind(this)
        this.state = {
            name : "Device ABC"
        }
    }


    onDeviceEditClicked() {
        this.props.history.push({
            pathname : "/device/edit/" + this.props.device.hardwareId,
            state :{
                from : this.props.location.pathname,
                device : this.props.device
            }
        })
    }

    render() {
        console.log(this.props.device)
        let imageSrc = (this.props.device.hardwarePic === null) ? defaultAvatar : this.props.device.hardwarePic

        return(
            <div id="cursor-pointer" className={this.props.device.status ? "cursor-pointer" : "cursor-pointer disabled" } onClick={(event) => {
                
                if(event.target.id.indexOf("user-status-action") < 0 && this.props.device.status) {
                    window.open("http://" + this.props.device.hardwareAddr, "_blank")
                }
            }}>
                <Col className="user-status-card" sm={6} md={6} lg={6}>
                    <Card>
                        <Row>
                        <Col className="user-status-avatar">
                        <Image src={imageSrc} circle style={{"width":"40px", "height":"40px"}}/>
                        </Col>
                        <Col xs={8} sm={8} md={6}>
                            <Row>
                                <p className="user-status-name">{this.props.device.hardwareName}</p>
                            </Row>
                            <Row>
                                <p className="user-status-number">{this.props.device.hardwareAddr}</p>
                            </Row>
                        </Col>
                        <Col className="user-status-action-group" sm={12} md={4}>
                            <i id="user-status-action" title="Delete Device" className="user-status-action pe-7s-trash text-danger" 
                                onClick={() => this.props.onDeleteClicked(this.props.device)}/>
                            <i id="user-status-action" title="Edit Device"className="user-status-action pe-7s-config text-success"
                                onClick={this.onDeviceEditClicked}/>
                            {/* <i title="Info" className="user-status-action pe-7s-info text-info"/> */}
                        </Col>
                        </Row>
                    </Card>
                </Col>
            </div>
            
        )
    }
}

DeviceStatusCard.propTypes = {
    device  : PropTypes.object.isRequired,
    onDeleteClicked : PropTypes.func.isRequired
}

export default withRouter(DeviceStatusCard)