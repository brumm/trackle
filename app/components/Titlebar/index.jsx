import React from 'react';
import connectToStores from 'flummox/connect';
import moment from 'moment';

import styles from './Titlebar.scss';

class Titlebar extends React.Component {

  onDecrementIsoWeek = ::this.onDecrementIsoWeek
  onDecrementIsoWeek() {
    this.context.flux.getActions('settings').decrementIsoWeek();
  }

  onResetIsoWeek = ::this.onResetIsoWeek
  onResetIsoWeek()     {
    this.context.flux.getActions('settings').resetIsoWeek();
  }

  onIncrementIsoWeek = ::this.onIncrementIsoWeek
  onIncrementIsoWeek() {
    this.context.flux.getActions('settings').incrementIsoWeek();
  }

  render() {
    return <div className={styles.Container}>
      <div className={styles.Left}>
        <div className={styles.WindowControls}>
          <div className={styles.Control}></div>
          <div className={styles.Control}></div>
          <div className={styles.Control}></div>
        </div>

        <div className={styles.Date}>
          <span className={styles.Month}>{moment().isoWeek(this.props.settings.isoWeek).format('MMMM')}</span>
          <span className={styles.Year}>{moment().isoWeek(this.props.settings.isoWeek).format('YYYY')}</span>
        </div>
        <span className={styles.CalendarWeek}>CW {moment().isoWeek(this.props.settings.isoWeek).isoWeek()}</span>
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

export default connectToStores(Titlebar, {settings: store => ({settings: store.getStateAsObject()}) })
