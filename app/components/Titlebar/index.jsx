import React from 'react';
import connectToStores from 'flummox/connect';
import moment from 'moment';
import autobind from 'autobind-decorator'

import styles from './Titlebar.scss';

class Titlebar extends React.Component {

  @autobind
  onDecrementIsoWeek() {
    this.context.flux.getActions('settings').decrementIsoWeek();
  }

  @autobind
  onResetIsoWeek()     {
    this.context.flux.getActions('settings').resetIsoWeek();
  }

  @autobind
  onIncrementIsoWeek() {
    this.context.flux.getActions('settings').incrementIsoWeek();
  }

  render() {
    return <div className={styles.Container}>
      <div className={styles.Left}>
        <div className="window-controls">
          <div className="close control"></div>
          <div className="minimize control"></div>
          <div className="fullscreen control"></div>
        </div>

        <div className={styles.Date}>
          <span className={styles.Month}>{moment().isoWeek(this.props.settings.isoWeek).format('MMMM')}</span>
          <span className={styles.Year}>{moment().isoWeek(this.props.settings.isoWeek).format('YYYY')}</span>
        </div>
        <span style={{marginLeft: 10}}>CW {moment().isoWeek(this.props.settings.isoWeek).isoWeek()}</span>
      </div>

      <div className={styles.Center}></div>

      <div className={styles.Right}>
        <div className={styles.WeekControl}>
          <button className={[styles.Control, 'icon-angle-left'].join(' ')} onClick={this.onDecrementIsoWeek}></button>
          <button className={styles.Control} onClick={this.onResetIsoWeek}>Today</button>
          <button className={[styles.Control, 'icon-angle-right'].join(' ')} onClick={this.onIncrementIsoWeek}></button>
        </div>
      </div>
    </div>;
  }
}

Titlebar.contextTypes = { flux: React.PropTypes.object.isRequired };

export default connectToStores(Titlebar, {settings: store => ({settings: store.getStateAsObject()}) });
