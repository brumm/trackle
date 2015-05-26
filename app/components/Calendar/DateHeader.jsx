import React from 'react';
import styles from './DateHeader.scss';
import classNames from 'classnames';

export default class DateHeader extends React.Component {
  constructor(props) {
    super(props);
  }

  className() { return classNames(
    styles.Date,
    {'is-today': this.props.moment.isSame(new Date(), 'day')}
  )}

  render () {
    return <div className={this.className()}>
      <span>
        {this.props.moment.format("dd")}
      </span>
      <span className={styles.dayNumber}>
        {this.props.moment.format("D")}
      </span>
    </div>
  }
}
