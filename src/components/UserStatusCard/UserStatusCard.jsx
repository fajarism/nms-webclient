import React from "react";
import {withRouter} from "react-router-dom"
import {Grid, Row, Col, Image} from "react-bootstrap"
import Card from "components/Card/Card"
import defaultAvatar from "../../assets/img/faces/face-0.jpg"
import PropTypes from "prop-types"
import {storage} from "variables/Variables"
import { throws } from "assert";

class UserStatusCard extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            name : "Lorem Ipsum Dolor Sit Amet"
        }
    }


    render() {
        let imageSrc = (this.props.user.profpic === null) ? defaultAvatar : this.props.user.profpic
        return(
            <Col className="user-status-card" sm={6} md={6} lg={6}>
                <Card>
                    <Row>
                    <Col className="user-status-avatar">
                        <Image src={imageSrc} circle style={{"width":"40px", "height":"40px"}}/>
                    </Col>
                    <Col xs={8} sm={8} md={6}>
                        <Row>
                            <p className="user-status-name">{this.props.user.fullname}</p>
                        </Row>
                        <Row>
                            <p className="user-status-number">NIK : {this.props.user.nik}</p>    
                        </Row>
                        <Row>
                            <div className="user-status-tag">
                                <p className={(this.props.user.level != 99) ? "user-status-tag-admin invisible" : "user-status-tag-admin"}>admin</p>
                                <p className={(this.props.user.nik != localStorage.getItem(storage.nik)) ? "user-status-tag-you invisible" : "user-status-tag-you"}>You</p>
                            </div>
                        </Row>
                    </Col>
                    <Col className="user-status-action-group" sm={12} md={4}>
                        <i style={{"display" : (this.props.user.nik === localStorage.getItem(storage.nik)) ? "none" : ""}}
                            title="Delete User" className="user-status-action pe-7s-trash text-danger"
                            onClick={() => this.props.onDeleteButton(this.props.user)}/>
                        <i title="Edit User"className="user-status-action pe-7s-config text-success"
                            onClick={() => {this.props.history.push({
                                pathname : "/users/edit/" + this.props.user.id,
                                state : {
                                    from : this.props.location.pathname,
                                    user : this.props.user
                                }
                            })}}/>
                        {/* <i title="Info" className="user-status-action pe-7s-info text-info"/> */}
                    </Col>
                    </Row>
                </Card>
            </Col>
        )
    }
}

UserStatusCard.propTypes = {
    user : PropTypes.object.isRequired
}

export default withRouter(UserStatusCard)