import React from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd/modules/backends/HTML5';
import FluxComponent from 'flummox/component'

import Titlebar from './../Titlebar';
import Calendar from './../Calendar';


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
