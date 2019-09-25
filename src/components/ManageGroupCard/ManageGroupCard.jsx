import React from "react";
import {withRouter} from "react-router-dom"
import {Grid, Row, Col, Image} from "react-bootstrap"
import Card from "components/Card/Card"
import PropTypes from "prop-types"

class ManageGroupCard extends React.Component {
    constructor(props) {
        super(props)

        this.onGroupEditClicked = this.onGroupEditClicked.bind(this)
        this.state = {
            name : "Device ABC"
        }
    }


    onGroupEditClicked() {
        this.props.history.push({
            pathname : "/groups/edit/" + this.props.group.groupId,
            state :{
                from : this.props.location.pathname,
                group : this.props.group
            }
        })
    }

    render() {

        return(
            <div id="cursor-pointer" className={"cursor-pointer"}>
                <Col className="user-status-card" sm={6} md={6} lg={6}>
                    <Card>
                        <Row>
                        <Col className="user-status-avatar">
                            <i className="device-icon pe-7s-network"/>
                        </Col>
                        <Col xs={8} sm={8} md={6}>
                            <Row>
                                <p className="user-status-name">{this.props.group.groupName}</p>
                            </Row>
                            <Row>
                                <p className="user-status-number">{"Group Id " + this.props.group.groupId}</p>
                            </Row>
                        </Col>
                        <Col className="user-status-action-group" sm={12} md={4}>
                            <i id="user-status-action" title="Delete Device" className="user-status-action pe-7s-trash text-danger" 
                                onClick={() => this.props.onDeleteClicked(this.props.group)}/>
                            <i id="user-status-action" title="Edit Device"className="user-status-action pe-7s-config text-success"
                                onClick={this.onGroupEditClicked}/>
                            {/* <i title="Info" className="user-status-action pe-7s-info text-info"/> */}
                        </Col>
                        </Row>
                    </Card>
                </Col>
            </div>
            
        )
    }
}

ManageGroupCard.propTypes = {
    device  : PropTypes.object.isRequired,
    onDeleteClicked : PropTypes.func.isRequired
}

export default withRouter(ManageGroupCard)