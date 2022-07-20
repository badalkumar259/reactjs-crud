import React, {Fragment} from 'react'
import './index.css'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      color: "",
      nameErrorMessage: "",
      colorErrorMessage: "",
      formRecordId: "null",
      isFormUpdate: false,
      items: []
    };
  }

  /** Handling the input change event Start */
  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    if(name == 'userName')
    {
      if(value == '')
      {
        var nameErrMsg = "Name can not be blank...";
        this.setState({
          userName: "",
          nameErrorMessage : nameErrMsg
        });
      }
      else
      {
        if(this.state.items.length > 0)
        {
          for(var i=0;i<this.state.items.length;i++) {
            
            if(this.state.formRecordId == i)
            {
              this.setState({
                userName: value,
                nameErrorMessage : ""
              });
              return;
            }
            else
            {
              if(this.state.items[i].userName == value)
              {
                var nameErrMsg = "Name has already been taken, enter another name...";
                this.setState({
                  userName: value,
                  nameErrorMessage : nameErrMsg
                });
                return;
              }
              else
              {
                this.setState({
                  userName: value,
                  nameErrorMessage : ""
                });
                return;
              }
            }
          }
        }
        else
        {
          this.setState({
            userName: value,
            nameErrorMessage : ""
          });
        }
      }   
    }
    else if(name == 'color' && value == '')
    {
      var colorErrMsg = "Select color...";
      this.setState({
        color: "",
        colorErrorMessage : colorErrMsg
      }); 
    }
    else
    {
      this.setState({
        nameErrorMessage : "",
        colorErrorMessage : "",
        [name]: value
      });
    }
  }
  /** Handling the input change event End */

  /** Handling the form submit event Start */
  handleSubmit = (event) => {
    event.preventDefault();
    if(this.state.userName == '')
    {
      var nameErrMsg = "Name can not be blank...";
      this.setState({
        nameErrorMessage : nameErrMsg
      }); 
    }
    else if(this.state.color == '')
    {
      var colorErrMsg = "Select color...";
      this.setState({
        colorErrorMessage : colorErrMsg
      }); 
    }
    else 
    {
      var subItem = [];
      subItem['userName'] = this.state.userName;
      subItem['color'] = this.state.color;
      var items = this.state.items;
      var err = 0;
      if(items.length > 0)
      {
        for(var i=0;i<items.length;i++) {
          if(items[i].userName == this.state.userName)
          {
            if(this.state.formRecordId == i)
            {
              this.setState({
                nameErrorMessage : ""
              });
              err = 0;
            }
            else
            {
              var nameErrMsg = "Name has already been taken, enter another name...";
              this.setState({
                nameErrorMessage : nameErrMsg
              });
              err = 1;
              return false;
            }            
          }
          else
          {
            err = 0;
            this.setState({
              nameErrorMessage : ""
            });
          }
        }
      }
    }
    if(err == 0)
    {
      if(this.state.formRecordId == 'null')
      {
        items.push(subItem);
        this.setState({
          items: items,
          userName: "",
          color: "",
          nameErrorMessage : ""
        });
      }
      else
      {   
        items[this.state.formRecordId]  = subItem;
        this.setState({
          items: items,
          userName: "",
          color: "",
          formRecordId: "null",
          isFormUpdate: false,
          nameErrorMessage : ""
        });
      }
    }   
  }
  /** Handling the form submit event End */

  /** Handle data update Start */
  handleItemChange(i, event) {
    var items = this.state.items;   
    this.setState({
      userName: items[i]['userName'],
      color: items[i]['color'],
      isFormUpdate: true,
      formRecordId: i
    });
  } 
  /** Handle data update End */

  /** Handle data delete Start */
  handleItemDeleted(i) {
    if(window.confirm('Delete the item?')){
      var items = this.state.items;
      items.splice(i, 1);
      this.setState({
        items: items
      });
    }
  }
  /** Handle data delete End */

  /** table data managing Start */
  renderRows() {
    var context = this;
    return  this.state.items.map(function(o, i) {
      return (
        <tr key={"item-" + i}>
          <td>{o['userName']}</td>
          <td>{o['color']}</td>
          <td><button onClick={context.handleItemChange.bind(context, i)}>Edit</button> | <button onClick={context.handleItemDeleted.bind(context, i)}>Delete</button></td>          
        </tr>
      );
    });
  }
  /** table data managing End */

  /** Counter balls management Start */
  colorCounter(colorName){
    return this.state.items.reduce(function (n, data) {
        return n + (data.color == colorName);
    }, 0);
  }
  /** Counter balls management End */

  render() {
    const isFormUpdateTrue = this.state.isFormUpdate;
    let buttonName;
    if (isFormUpdateTrue) {
      buttonName = 'Update';
    } else {
      buttonName = 'Save';
    }
    return (
      <Fragment>
        <div className='dataForm'>
          <form onSubmit={this.handleSubmit}>
            <label>
              Name:
              <input
                name="userName"
                type="text"
                onChange={this.handleInputChange}
                value={this.state.userName} />
            </label>
            <span className="err">{this.state.nameErrorMessage}</span>
            <br />
            <label>
              Color:
              <select name="color" value={this.state.color} onChange={this.handleInputChange}>
                <option value="">Select color</option>
                <option value="red">Red</option>
                <option value="green">Green</option>
                <option value="blue">Blue</option>
              </select>          
            </label>
            <span className="err">{this.state.colorErrorMessage}</span>
            <br />
            <input type="submit" value={buttonName} name={buttonName} /> &nbsp;  
            <input type="reset" value="Clear"  />
          </form>
        </div>
        <div className="dataTable">
          <table border='1'>
            <thead>
              <tr>
                <th>Name</th>
                <th>Color</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {this.renderRows()}
            </tbody>
          </table>
        </div>
        <div className='counters'>
          <div className='redCounter'>Red : {this.colorCounter('red')}</div>
          <div className='greenCounter'>Green : {this.colorCounter('green')}</div>
          <div className='blueCounter'>Blue : {this.colorCounter('blue')}</div>
        </div>
    </Fragment>
    );
  }
}
export default App;