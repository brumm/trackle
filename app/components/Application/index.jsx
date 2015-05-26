import React from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd/modules/backends/HTML5';
import FluxComponent from 'flummox/component'

import Titlebar from './../Titlebar';
import Calendar from './../Calendar';

class Popover extends React.Component {
  render() {
    if (this.props.entry) {
      return <div className="popoverlayer" onClick={this.props.flux.getActions('entries').deselectEntry} style={{
        position: 'fixed',
        top: 0, bottom: 0,
        left: 0, right: 0,
        display: 'flex',
        zIndex: 10
      }}>
        <div style={{
          margin: 'auto',
          backgroundColor: 'white',
          padding: 10
        }}>{this.props.entry.id}</div>
      </div>;
    } else {
      return null;
    };
  }
}

@DragDropContext(HTML5Backend)
export default class Application extends React.Component {
  render() {
    return <div className='application' style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Titlebar/>
      <Calendar/>
    </div>;
  }
}
