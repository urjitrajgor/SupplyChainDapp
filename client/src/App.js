import React, { Component } from 'react';
import './App.css';
import AssetsTrackerInstance from './contracts/AssetsTracker.json';
import getWeb3 from './utils/getWeb3.js';
import $ from 'jquery';

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      web3: null,
      accounts: null,
      assets: []  
    }
    this.newAssets = this.newAssets.bind(this);
    this.transferAssets = this.transferAssets.bind(this);
    this.trackAsset = this.trackAsset.bind(this);
  }  
  
  componentDidMount = async () => {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedAddress = AssetsTrackerInstance.networks[networkId].address;      
      const ContractInstance = new web3.eth.Contract(AssetsTrackerInstance.abi, deployedAddress);
      this.setState({ web3, accounts, contract: ContractInstance });
    } catch (error) {
      console.log(error);
    }
  }

  newAssets = async (event) => {
    event.preventDefault();
    const {accounts, contract} = this.state;        
    contract.methods.createAsset($("#assetName").val(), $("#assetDescription").val(), 
    $("#assetUuid").val()).send({from: accounts[0]}); 
  }

  transferAssets = async (event) => {
    event.preventDefault();
    const {accounts, contract} = this.state;
    contract.methods.transferAssets( $("#Uuid").val(), $("#address").val()).send({from: accounts[0]});
  }

  trackAsset = async(event) => {
    event.preventDefault();
    const {accounts, contract} = this.state;
    contract.methods.getAssetDetails( $("#trackUuid").val()).call({from: accounts[0]})
    .then((result) => {
        this.setState({assets: result}, function() {
        console.log(this.state.assets[0]);
      });
    });   
  }

  render() {
    return (
      <div className="App">         
        <div className="jumbotron">
          <h2>Supplychain Tracking System</h2>
          </div>
          <div className= "col-sm-12 text-center" style={{ textAlign: 'center' }}>
            <label ><b>Create Asset:</b></label>
            <input type="text" id="assetName" placeholder=" Asset Name" required />
            <input type="text" id="assetDescription" placeholder="Description" required />
            <input type="number" id="assetUuid" placeholder="UUID" required />
            <button className = "btn-primary" onClick={this.newAssets} id="createAsset">Create Asset</button>
          </div>
                                                                                                                                                            
          <div className= "col-sm-12 text-center" style={{ textAlign: 'center' }}>
            <label><b>Transfer Asset:</b></label>
            <input type="text" id="address" placeholder="To address" required />
            <input type="number" id="Uuid" placeholder="UUID" required />
            <button className="btn-primary" onClick={this.transferAssets} id="transferAsset">Transfer Asset</button>
          </div>

          <div className= "col-sm-12 text-center" style={{ textAlign: 'center' }}>
            <label><b>Track Asset Details:</b></label>
            <input type="number" id="trackUuid" placeholder="UUID" required />
            <button className="btn-primary" onClick={this.trackAsset} id="trackAsset">Track Asset Details</button>
          </div>

          <div id="response text-center" style={{ textalign:'center'}}>
            {console.log(this.state.assets)}
            <p><b>Name:</b><span id="name">{this.state.assets[0] === null? '': this.state.assets[0]}</span></p>
            <p><b>Description:</b><span id="description">{this.state.assets[1] === null? '': this.state.assets[1]}</span></p>
            <p><b>Manufacturer:</b><span id="manufacturer">{this.state.assets[2] === null? '': this.state.assets[2]}</span></p>
            <p><b>Current Location:</b><span id="location">{this.state.assets[3] === null? '': this.state.assets[3]}</span></p>
          </div>
      </div>
    );
  }
}
export default App;