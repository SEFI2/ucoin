

import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {
  MenuItem,
  DropdownButton,
  Panel, PageHeader, ListGroup, ListGroupItem, Button,
} from 'react-bootstrap';


import s from './Home.css';
import StatWidget from '../../components/Widget';
import Donut from '../../components/Donut';

import {
  Tooltip,
  XAxis, YAxis, Area,
  CartesianGrid, AreaChart, Bar, BarChart,
  ResponsiveContainer } from '../../vendor/recharts';

const title = 'Sb Admin React';


const data = [
      { name: 'Page A', uv: 4000, pv: 2400, amt: 2400, value: 600 },
      { name: 'Page B', uv: 3000, pv: 1398, amt: 2210, value: 300 },
      { name: 'Page C', uv: 2000, pv: 9800, amt: 2290, value: 500 },
      { name: 'Page D', uv: 2780, pv: 3908, amt: 2000, value: 400 },
      { name: 'Page E', uv: 1890, pv: 4800, amt: 2181, value: 200 },
      { name: 'Page F', uv: 2390, pv: 3800, amt: 2500, value: 700 },
      { name: 'Page G', uv: 3490, pv: 4300, amt: 2100, value: 100 },
];

function Home(props, context) {
  context.setTitle(title);
  return (
    <div>
      <div className="row">
        <div className="col-lg-12">
          <PageHeader>Dashboard</PageHeader>
        </div>
      </div>

      <div className="row">
               <div className="col-lg-3 col-md-6">
          <StatWidget
            style="panel-green"
            icon="fa fa-tasks fa-5x"
            count="12"
            headerText="Smart Transactions"
            footerText="View Details"
            linkTo="/smartcontracts"
          />
        </div>
        <div className="col-lg-3 col-md-6">
          <StatWidget
            style="panel-yellow"
            icon="fa fa-business-time fa-5x"
            count="124"
            headerText="Smart Contracts"
            footerText="View Details"
            linkTo="/"
          />
        </div>
        <div className="col-lg-3 col-md-6">
          <StatWidget
            style="panel-red"
            icon="fa fa-id-badge fa-5x"
            headerText="My Profile"
            footerText="View Details"
            linkTo="/"
          />
        </div>
    	<div className="col-lg-3 col-md-6">
          <StatWidget
            style="panel-primary"
            icon="fa fa-ethereum fa-5x"
            headerText="Etherscan"
            footerText="View My Transactions"
            linkTo="/"
          />
        </div>
	  </div>

      <div className="row">
        <div className="col-lg-8">
         <Panel
            header={<span>
              <i className="fa fa-clock-o fa-fw" /> Responsive Timeline
            </span>}
          >
            <div>
              <ul className="timeline">
                <li>
                  <div className="timeline-badge"><i className="fa fa-check" />
                  </div>
                  <div className="timeline-panel">
                    <div className="timeline-heading">
                      <h4 className="timeline-title">UCoin History</h4>
                      <p>
                        <small className="text-muted">
                          <i className="fa fa-clock-o" /> 1 hour ago
                        </small>
                      </p>
                    </div>
                    <div className="timeline-body">
                      <p>
		  				UCoin is an ERC20 token on the Ethereum network that lets UNIST students to use it as a complementary currency to the Korean Won. It can be earned, spent, received or sent like any other currency but with more features that make your life easier. What exactly distinguishes it from national currency aside is that token can be programmed in a way that meet your own requirements which is widely known these days as Smart contracts. 
                      </p>
                    </div>
                  </div>
                </li>
                <li className="timeline-inverted">
                  <div className="timeline-badge warning"><i className="fa fa-credit-card" />
                  </div>
                  <div className="timeline-panel">
                    <div className="timeline-heading">
                      <h4 className="timeline-title">What can I do with UCoin?</h4>
                    </div>
                    <div className="timeline-body">
                      <p>
		 The purpose of the new crypto token is to create an alternative marketplace for issuing and exchanging digital assets in a decentralized manner. You can:

Send and receive UCoin
Issue new tokens to digitalize assets, and use Ethereum as underlying exchange/transfer network for the tokens
Send, receive, burn/mint and freeze/unfreeze tokens
Propose to create trading pairs between two different tokens
Send orders to buy or sell tokens through trading pairs created on the chain
		  </p>
                      
                    </div>
                  </div>
                </li>
                <li>
                  <div className="timeline-badge danger"><i className="fa fa-bomb" />
                  </div>
                  <div className="timeline-panel">
                    <div className="timeline-heading">
                      <h4 className="timeline-title">Smart contracts</h4>
                    </div>
                    <div className="timeline-body">
                      <p>
		  				GroupEval smart contracts
		  				</p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </Panel>

        </div>

        <div className="col-lg-4">

          <Panel
            header={<span>
              <i className="fa fa-bell fa-fw" /> Notifications Panel
            </span>}
          >
            <ListGroup>
              <ListGroupItem href="" onClick={(e) => { e.preventDefault(); }}>
                <i className="fa fa-comment fa-fw" /> New Comment
                <span className="pull-right text-muted small"><em>4 minutes ago</em></span>
              </ListGroupItem>
              <ListGroupItem href="" onClick={(e) => { e.preventDefault(); }}>
                <i className="fa fa-twitter fa-fw" /> 3 New Followers
                <span className="pull-right text-muted small"><em>12 minutes ago</em></span>
              </ListGroupItem>
              <ListGroupItem href="" onClick={(e) => { e.preventDefault(); }}>
                <i className="fa fa-envelope fa-fw" /> Message Sent
                <span className="pull-right text-muted small"><em>27 minutes ago</em></span>
              </ListGroupItem>
              <ListGroupItem href="" onClick={(e) => { e.preventDefault(); }}>
                <i className="fa fa-tasks fa-fw" /> New Task
                <span className="pull-right text-muted small"><em>43 minutes ago</em></span>
              </ListGroupItem>
              <ListGroupItem href="" onClick={(e) => { e.preventDefault(); }}>
                <i className="fa fa-upload fa-fw" /> Server Rebooted
                <span className="pull-right text-muted small"><em>11:32 AM</em></span>
              </ListGroupItem>
              <ListGroupItem href="" onClick={(e) => { e.preventDefault(); }}>
                <i className="fa fa-bolt fa-fw" /> Server Crashed!
                <span className="pull-right text-muted small"><em>11:13 AM</em></span>
              </ListGroupItem>
              <ListGroupItem href="" onClick={(e) => { e.preventDefault(); }}>
                <i className="fa fa-warning fa-fw" /> Server Not Responding
                <span className="pull-right text-muted small"><em>10:57 AM</em></span>
              </ListGroupItem>
              <ListGroupItem href="" onClick={(e) => { e.preventDefault(); }}>
                <i className="fa fa-shopping-cart fa-fw" /> New Order Placed
                <span className="pull-right text-muted small"><em>9:49 AM</em></span>
              </ListGroupItem>
              <ListGroupItem href="" onClick={(e) => { e.preventDefault(); }}>
                <i className="fa fa-money fa-fw" /> Payment Received
                <span className="pull-right text-muted small"><em>Yesterday</em></span>
              </ListGroupItem>
            </ListGroup>
            <Button block>View All Alerts</Button>
          </Panel>
	
        </div>

      </div>
    </div>
  );
}

Home.propTypes = {
  // news: PropTypes.arrayOf(PropTypes.shape({
  //   title: PropTypes.string.isRequired,
  //   link: PropTypes.string.isRequired,
  //   contentSnippet: PropTypes.string,
  // })).isRequired,
};
Home.contextTypes = { setTitle: PropTypes.func.isRequired };

export default withStyles(s)(Home);
