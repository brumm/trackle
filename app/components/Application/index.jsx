import React from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd/modules/backends/HTML5';

import styles from './Application.scss';
import Titlebar from './../Titlebar';
import Calendar from './../Calendar';

@DragDropContext(HTML5Backend)
export default class Application extends React.Component {
  render() {
    return <div className={styles.Application}>
      <Titlebar/>
      <Calendar/>
    </div>;
  }
}
