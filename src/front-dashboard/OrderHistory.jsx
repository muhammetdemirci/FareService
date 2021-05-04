import React, { Component } from 'react';
import { Link } from "react-router-dom";
export class OrderHistory extends Component {
    render() {
        return (
            <>
                <div className="breadcrumb-dash">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                        <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
                                        <li className="breadcrumb-item active" aria-current="page">Order History</li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>



                <div className="dashborad-box pad-y">
                    <div className="container">
                        <div className="row justify-content-center">   
                            <div className="col-md-3">
                                <Link to="/food-delivery" className="bash-card">
                                    <img src="assets/img/food.svg" className="img-fluid" alt=""/>
                                    <div className="dash-card-ds">
                                        <div className="title">Food Delivery</div>
                                        <div className="des">Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam.</div>
                                    </div>
                                </Link>
                            </div>
                           
                         
                            <div className="col-md-3">
                                <a href="#" className="bash-card">
                                    <img src="assets/img/groceries.svg" className="img-fluid" alt=""/>
                                    <div className="dash-card-ds">
                                        <div className="title">Groceries</div>
                                        <div className="des">Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam.</div>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

            </>
        )
    }
}
