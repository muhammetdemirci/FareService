import React, { Component } from 'react';
import { Link } from "react-router-dom";
export class Dashboard extends Component {
    render() {
        return (
            <>
                <div className="breadcrumb-dash">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <nav aria-label="breadcrumb">
                                    <ol class="breadcrumb">
                                        <li class="breadcrumb-item"><Link to="/order-history">Home</Link></li>
                                        {/* <li class="breadcrumb-item"><Link to="/order-history">Library</Link></li> */}
                                        <li class="breadcrumb-item active" aria-current="page">Dashboard</li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>



                <div className="dashborad-box pad-y">
                    <div className="container">
                        <div className="row">   
                            <div className="col-md-3">
                                <Link to="/order-history" className="bash-card">
                                    <img src="assets/img/order.svg" className="img-fluid" alt=""/>
                                    <div className="dash-card-ds">
                                        <div className="title">Orders History</div>
                                        <div className="des">Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam.</div>
                                    </div>
                                </Link>
                            </div>
                            <div className="col-md-3">
                                <Link to="/services-history" className="bash-card">
                                    <img src="assets/img/service.svg" className="img-fluid" alt=""/>
                                    <div className="dash-card-ds">
                                        <div className="title">Services History</div>
                                        <div className="des">Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam.</div>
                                    </div>
                                </Link>
                            </div>
                            <div className="col-md-3">
                                <Link to="/" className="bash-card">
                                    <img src="assets/img/account.svg" className="img-fluid" alt=""/>
                                    <div className="dash-card-ds">
                                        <div className="title">My Accounts</div>
                                        <div className="des">Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam.</div>
                                    </div>
                                </Link>
                            </div>
                            <div className="col-md-3">
                                <Link to="/" className="bash-card">
                                    <img src="assets/img/payment.svg" className="img-fluid" alt=""/>
                                    <div className="dash-card-ds">
                                        <div className="title">Payment Settings</div>
                                        <div className="des">Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam.</div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

            </>
        )
    }
}
