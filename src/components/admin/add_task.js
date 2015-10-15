'use strict';

var React = require('react');
var xhr = require('xhr');

var config = require('../../config');

var AddForm = React.createClass({
  getInitialState: function() {
    return {
      //taskid: this field will fill when the upload was successful
      //loading: to show the load gif when a task in on upload progress
      //startupload:when a task start to upload at server
      confirm: {
        taskid: null,
        loading: false,
        startupload: false,
        successful_upload:false
      },
      selected: false
    };
  },
  triggerFileInput: function() {
    this.refs.fileInput.getDOMNode().click();
  },
  uploadData: function(e) {
    e.preventDefault();
    var self = this;
    // TODO sanitize/validation
    var formData = new window.FormData();
    var name = this.refs.taskname.getDOMNode().value.trim();
    var source = this.refs.tasksource.getDOMNode().value.trim();
    var description = this.refs.taskdescription.getDOMNode().value.trim();
    var password = this.refs.password.getDOMNode().value.trim();
    var file = this.refs.fileInput.getDOMNode();
    file = file.files[0];
    var preserve = this.refs.random.getDOMNode().checked;
    formData.append('name', name);
    formData.append('source', source);
    formData.append('description', description);
    formData.append('password', password);
    formData.append('file', file);
    formData.append('preserve', preserve);
    formData.append('newtask', true);

    //start upload 
    this.setState({
      loading: true
    });
    //send the request
    xhr({
      uri: config.taskServer + 'csv',
      body: formData,
      method: 'POST'
    }, function(err, res) {
      if (err || res.statusCode === 400) {
        self.setState({
          startupload: true,
          loading: false,
          successful_upload:false
        });
        self.cleanup();
      } else {
        var resut = JSON.parse(res.body);
        if(resut.taskid!== undefined){
            self.setState({
              startupload: true,
              taskid: resut.taskid,
              loading: true,
              successful_upload:true
        });
        }else{
          self.setState({
              startupload: true,
              taskid: resut.taskid,
              loading: true,
              successful_upload:false
          });
        }
        // self.setState({
        //   startupload: true,
        //   taskid: resut.taskid,
        //   loading: true,
        //   successful_upload:true
        // });
        self.cleanup();
      }
    });
  },

  cleanup: function() {
    var self = this;
    if (this.state.taskid !== null && typeof this.state.taskid !== "undefined") {
      window.location.href = '#/task/' + this.state.taskid;
      window.location.reload();
    }else {
      setTimeout(function() {
        self.setState({
          startupload: false,
          loading:false
        });
      }, 2000);
    }
  },

  triggerRandom: function() {
    this.refs.random.getDOMNode().checked ? this.setState({
      selected: false
    }) : this.setState({
      selected: true
    });
  },
  render: function() {
    var loading = (this.state.loading) ? 'dark loading' : 'dark';
    var form = (<form className={loading} onSubmit={this.uploadData}>
              <fieldset className='pad2x'>
                <label>Task name</label>
                <input className='col12 block clean' ref='taskname' type='text' name='name' placeholder='Task name' />
              </fieldset>
              <fieldset className='pad2x'>
                <label>source</label>
                <input className='col12 block clean' ref='tasksource' type='text' name='source' placeholder='Task Source' />
              </fieldset>
              <fieldset className='pad2x'>
                <label>Description</label>
                <textarea className='col12 block clean resize' ref='taskdescription' type='text' name='description' placeholder='Task description' ></textarea>
              </fieldset>
              <fieldset className='pad2x'>
                <label>Password</label>
                <input className='col12 block clean' ref='password' type='password' name='uploadPassword' placeholder='Password' />
              </fieldset>
              <fieldset className='pad2x'>
                <input type='file' className='hidden' ref='fileInput' name='uploadfile' accept=".csv"/>
                <a onClick={this.triggerFileInput} className='button pad2x quiet'>Choose CSV</a>
              </fieldset>
              <div className='pad2 checkbox-pill'>
                <input type='checkbox' id='random' ref='random' checked={this.state.selected}/>
                <a onClick={this.triggerRandom} for='random' className='button icon check quiet'>Do not load randomize the data</a>
              </div>
              <div className='pad2x pad1y  round-bottom col12 clearfix'>
                <input className='col6 margin3 button' type='submit' value='Create Task' />
              </div>
            </form>);
    return (
          <div>
          <div>{(this.state.startupload) ? ((this.state.successful_upload)?(<h2 className='dark'>Successful upload</h2>):(<h2 className='dark'>Something went wrong, try again</h2>)): form}
            </div>
          </div>
    );
  }
});
module.exports = AddForm;