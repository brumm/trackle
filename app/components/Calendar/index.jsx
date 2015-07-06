import React from 'react';
import moment from 'moment';
import connectToStores from 'flummox/connect';

import styles from './Calendar.scss';

import { Plug } from "react-outlet";

import Grid from './Grid';
import DaysList from './DaysList';
import DateHeader from './DateHeader';
import Entries from './Entries';
import CurrentTimeIndicator from './CurrentTimeIndicator';

import { Outlet } from "react-outlet";
let entryPopupOutlet = Outlet.new_outlet_id();

class Calendar extends React.Component {

  direction = ''
  state = {
    timeNow: moment()
  }

  updateTime = ::this.updateTime
  updateTime() {
    this.setState({ timeNow: moment() });
    this.timeoutId = setTimeout(this.updateTime, (60 - (new Date()).getSeconds()) * 1000 + 5);
  }

  componentDidMount() {
    var scrollTop = this.props.settings.entryBaseHeight * (((moment(this.props.settings.defaultWorkPeriod.start, 'HH:mm').hours() * 60) - (this.props.settings.minDuration * 2)) / this.props.settings.minDuration);
    this.refs.scrollContainer.getDOMNode().scrollTop = scrollTop;
    // and, scroll currentTimeIndicator into view, if it isnt
    React.findDOMNode(this.refs.currentTimeIndicator).scrollIntoViewIfNeeded(true); // center

    this.updateTime();
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutId);
  }

  componentWillReceiveProps(newProps) {
    this.direction = this.props.settings.isoWeek > newProps.settings.isoWeek ? 'backward' : 'forward';
  }

  render() {
    return <div className={styles.Container}>
      <DaysList
        timeNow={this.state.timeNow}
        key={this.props.settings.isoWeek}
        isoWeek={this.props.settings.isoWeek}
        containerStyle={styles.DayListContainerDateHeader}
        dayStyle={styles.DayListDayDateHeader}>

        <DateHeader />
      </DaysList>

      <div ref='scrollContainer' className={styles.ScrollContainer}>
        <Grid>
          <Outlet outletId={entryPopupOutlet} />

          <DaysList
            timeNow={this.state.timeNow}
            key={this.props.settings.isoWeek}
            isoWeek={this.props.settings.isoWeek}
            containerStyle={styles.DayListContainerEntries}
            dayStyle={styles.DayListDayEntries}>

            <Entries outletId={entryPopupOutlet} />
          </DaysList>

          {this.state.timeNow.isoWeek() === this.props.settings.isoWeek &&
            <CurrentTimeIndicator ref='currentTimeIndicator'
              timeNow={this.state.timeNow}
              entryBaseHeight={this.props.settings.entryBaseHeight}
              minDuration={this.props.settings.minDuration} />}
        </Grid>
      </div>
    </div>
  }
}

export default connectToStores(Calendar, {settings: store => ({settings: store.getStateAsObject()}) });
