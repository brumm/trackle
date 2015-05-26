import React from 'react';
import moment from 'moment';
import connectToStores from 'flummox/connect';

class DaysList extends React.Component {

  renderWeekdays() {
    var i, results, weekDay;
    results = [];

    for (weekDay = i = 0; i <= 6; weekDay = ++i) {
      var day = moment().isoWeek(this.props.settings.isoWeek).weekday(i);
      var Child = React.Children.only(this.props.children);

      results.push(<li className={this.props.dayStyle} key={i}>{React.cloneElement(Child, {moment: day})}</li>);
    }
    return results;
  }
  render() {
    return <ul className={this.props.containerStyle} style={this.props.style}>{this.renderWeekdays()}</ul>;
  }
}

export default DaysList;
