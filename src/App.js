import React from 'react';
import './App.css';
import axios from 'axios';
import * as JsSearch from 'js-search';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: 'SELECT',
                  valueSearch: '',
                  data:[],
                };
  }

  handleChange = (event) => {
    this.setState({value: event.target.value});
  }

  handleSearchChange = (event) =>{
    this.setState({valueSearch: event.target.value});
  }

  componentDidUpdate(prevProps, prevState){
      if(this.state.value !== 'SELECT' && this.state.value !== prevState.value){
          axios({method:'GET',url:'https://vast-shore-74260.herokuapp.com/banks?city='+this.state.value})
            .then((response)=>{return response}).then((response)=>{
                this.setState({data : response.data , fullData : response.data })
                return response.data;
            }).then((resp) => {
                if(this.state.valueSearch !== ''){
                this.handleSearch(resp);
              }
        })
      }
      else if(this.state.value !== prevState.value){
        axios({method:'GET',url:'https://vast-shore-74260.herokuapp.com/banks?city='+this.state.value})
          .then((response)=>{return response}).then((response)=>{
              this.setState({data : response.data , fullData : response.data  })
              return response.data;
          }).then((resp) => {
              if(this.state.valueSearch !== ''){
              this.handleSearch(resp);
            }
        })
      }
    else if(this.state.value === 'SELECT' && this.state.valueSearch !== ''){
      return 0;
    }
    else if(this.state.valueSearch !== '' && this.state.valueSearch !== prevState.valueSearch){
      this.handleSearch();
    }

  }


  handleSearch = () =>{
    var search = new JsSearch.Search('ifsc');
    search.addIndex('ifsc');
    search.addIndex('bank_id');
    search.addIndex('branch');
    search.addIndex('address');
    search.addIndex('city');
    search.addIndex('district')
    search.addIndex('state')
    search.addIndex('bank_name');
    search.addDocuments(this.state.fullData);
    var ser = search.search(this.state.valueSearch);
    this.setState({data : ser})
  }

  render() {
    return (
      <div className="App">
        <h1>Bank Branches</h1>
        <select className="selectOption" value={this.state.value} onChange={this.handleChange}>
            <option value='SELECT'>--select city--</option>
            <option value="MUMBAI">MUMBAI</option>
            <option value="DELHI">DELHI</option>
            <option value="BENGALURU">BENGALURU</option>
            <option value="CHENNAI">CHENNAI</option>
            <option value="KOLKATA">KOLKATA</option>
        </select>
        <input type="text" placeholder="searchbar" className="searchBar" value={this.state.valueSearch} onChange={this.handleSearchChange}></input>
        <table className="table">
          <thead>
            <tr>
              <th>S.No.</th>
              <th>IFSC</th>
              <th>BANK ID</th> 
              <th>BANK NAME</th>
              <th>BRANCH</th>
              <th>ADDRESS</th>
              <th>CITY</th>
              <th>DISTRICT</th>
              <th>STATE</th>
            </tr>
          </thead>
          <tbody>
        {this.state.data.map((item, key) => {
            return (
                <tr key = {key+1} >
                    <td>{key}</td>
                    <td>{item.ifsc}</td>
                    <td>{item.bank_id}</td>
                    <td>{item.bank_name}</td>
                    <td>{item.branch}</td>
                    <td>{item.address}</td>
                    <td>{item.city}</td>
                    <td>{item.district}</td>
                    <td>{item.state}</td>
                </tr>
            )
          })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default App;
