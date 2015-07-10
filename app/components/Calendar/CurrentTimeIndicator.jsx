import React from 'react';
import styles from './CurrentTimeIndicator.scss';
import connectToStores from 'flummox/connect';

class CurrentTimeIndicator extends React.Component {
  style = ::this.style
  style() {
    return {
      transform: `translateY(${Math.round(this.props.getTopOffset(this.props.timeNow))}px)`
    };
  }

  render() {
    return <div className={styles.IndicatorLine} data-time={this.props.timeNow.format('LT')} style={this.style()}></div>;
  }
}

export default connectToStores(CurrentTimeIndicator, { settings: store => ({ getTopOffset: store.getTopOffset })  })
