import React from 'react';
import connectToStores from 'flummox/connect';

class DaysList extends React.Component {

  renderWeekdays = ::this.renderWeekdays

  renderWeekdays() {
    var i, results, weekDay;
    results = [];

    for (weekDay = i = 0; i <= 6; weekDay = ++i) {
      var day = this.props.timeNow.clone().isoWeek(this.props.isoWeek).weekday(i);
      var Child = React.Children.only(this.props.children);

      results.push(
        <li className={this.props.dayStyle} key={i}>
          {React.cloneElement(Child, {
            moment: day,
            entries: this.props.entries[day.format('YYYY-MM-DD')] || [],
            settings: this.props.settings,
            flux: this.context.flux
          })}
        </li>
      );
    }
    return results;
  }
  render() {
    return <ul data-isoweek={this.props.settings.isoWeek} className={this.props.containerStyle} style={this.props.style}>{this.renderWeekdays()}</ul>;
  }
}

DaysList.contextTypes = { flux: React.PropTypes.object.isRequired };

export default connectToStores(DaysList, {
  settings: store => ({
    settings: store.getStateAsObject()
  }),
  entries: store => ({
    entries: store.getEntriesGroupedByIds()
  })
});


