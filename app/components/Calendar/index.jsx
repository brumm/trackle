import React from 'react';
import FluxComponent from 'flummox/component'
import moment from 'moment';
import connectToStores from 'flummox/connect';

import styles from './Calendar.scss';

import { Plug } from "react-outlet";

import Grid from './Grid';
import DaysList from './DaysList';
import DateHeader from './DateHeader';
import Entries from './Entries';

var CSSTransitionGroup = React.addons.CSSTransitionGroup;

import { Outlet } from "react-outlet";
let outletId = Outlet.new_outlet_id();

class CurrentTimeIndicator extends React.Component {
  constructor(props) {
    super(props);

    this.offsetFromTop = this.offsetFromTop.bind(this);
    this.style = this.style.bind(this);
  }

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
    return <div className="indicator-line" data-time={this.props.timeNow.format('LT')} style={this.style()}></div>;
  }
}

class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.direction = '';
    this.updateTime = this.updateTime.bind(this);

    this.state = {
      timeNow: moment()
    }
  }

  updateTime() {
    this.setState({ timeNow: moment() });
    this.timeoutId = setTimeout(this.updateTime, (60 - (new Date()).getSeconds()) * 1000 + 5);
  }

  componentDidMount() {
    // scroll 9:30 into view
    var scrollTop = this.props.settings.entryBaseHeight * (((10 * 60) - (this.props.settings.minDuration * 2)) / this.props.settings.minDuration);
    this.refs.scrollContainer.getDOMNode().scrollTop = scrollTop;
    // and, scroll currentTimeIndicator into view, if it isnt
    React.findDOMNode(this.refs.currentTimeIndicator).scrollIntoViewIfNeeded(true); //center

    this.updateTime();
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutId);
  }

  componentWillReceiveProps(newProps) {
    this.direction = this.props.settings.isoWeek > newProps.settings.isoWeek ? 'backward' : 'forward';
    this.previousIsoWeek = newProps.settings.isoWeek;
  }

  render() {
    return <div className={styles.Container}>
      <CSSTransitionGroup transitionName={this.direction}>
        <DaysList settings={this.props.settings} key={this.props.settings.isoWeek} containerStyle={styles.DayListContainerDateHeader} dayStyle={styles.DayListDayDateHeader}>
          <DateHeader />
        </DaysList>
      </CSSTransitionGroup>

      <div ref='scrollContainer' style={{flexGrow: 1, overflowY: 'auto', overflowX: 'hidden', paddingLeft: 65, marginTop: 45}}>
        <Grid>
          <Outlet outletId={outletId} />
          <CSSTransitionGroup transitionName={this.direction}>
            <DaysList settings={this.props.settings} key={this.props.settings.isoWeek} containerStyle={styles.DayListContainerEntries} dayStyle={styles.DayListDayEntries}>
              <FluxComponent connectToStores={{
                settings: store => ({
                  settings: store.getStateAsObject()
                }),
                entries: store => ({
                  entries: store.getEntriesGroupedByIds()
                })
              }}>
                <Entries outletId={outletId} />
              </FluxComponent>
            </DaysList>
          </CSSTransitionGroup>
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
