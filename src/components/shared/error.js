import React from 'react';
import Reflux from 'reflux';

import actions from '../../actions/actions';

const ErrorDialog = React.createClass({
  mixins: [
    Reflux.listenTo(actions.errorDialog, 'emit')
  ],

  getInitialState: function() {
    return {
      error: null
    };
  },

  componentDidUpdate: function() {
    if (this.timedDismiss) window.clearTimeout(this.timedDismiss);
    this.timedDismiss = window.setTimeout(function() {
      this.dismiss();
    }.bind(this), 3000);
  },

  dismiss: function() {
    this.setState({
      error: null
    });
  },

  emit: function(error) {
    this.setState({
      error: error
    });
  },

  render: function() {
    var klass = 'pin-bottomleft z1000 offcanvas-bottom animate pad1 col12';
    klass += (this.state.error) ? ' active' : '';

    return (
      <div className={klass}>
        <div className='fill-orange round col3 quiet dialog'>
          <button onClick={this.dismiss} className='icon fr close button quiet'></button>
          <div className='pad1'>
            <strong className='icon alert'>{this.state.error}</strong>
          </div>
        </div>
      </div>
    );
  }
});

export default ErrorDialog;
