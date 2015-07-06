import React from 'react';
import moment from 'moment';
import connectToStores from 'flummox/connect';

import styles from './Grid.scss';

class Grid extends React.Component {
  dayDuration() { return 24; }

  style() {
    return { height: this.props.settings.entryBaseHeight * (60 / this.props.settings.minDuration) }
  }

  createRows() {
    var startTime = moment("00:00", "HH:mm");
    var duration = this.dayDuration();
    var results = [];

    for (var index = 0; index < duration; index++) {
      var formattedTime = startTime.clone().add(index, 'hour').format('LT');
      results.push(<div
        data-time={formattedTime}
        key={index}
        className={styles.Row}
        style={this.style()}>
          <div className={styles.Timestamp}>{formattedTime}</div>
        </div>);
    };
    return results;
  }

  render() {
    return <div className={styles.Grid}>
      {this.props.children}
      <div className="grid-rows">{this.createRows()}</div>
    </div>;
  }
}

export default connectToStores(Grid, { settings: store => ({settings: store.getStateAsObject()}) });
