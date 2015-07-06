import React from 'react';
import styles from './CurrentTimeIndicator.scss';

export default class CurrentTimeIndicator extends React.Component {
  offsetFromTop = ::this.offsetFromTop
  style = ::this.style

  offsetFromTop() {
    var mmt = this.props.timeNow;
    var mmtMidnight = mmt.clone().startOf('day');
    var diffMinutes = mmt.diff(mmtMidnight, 'minutes');
    return this.props.entryBaseHeight * (diffMinutes / this.props.minDuration);
  }

  style() {
    return { transform: `translateY(${Math.round(this.offsetFromTop()) + 5}px)` };
  }

  render() {
    return <div className={styles.IndicatorLine} data-time={this.props.timeNow.format('LT')} style={this.style()}></div>;
  }
}
