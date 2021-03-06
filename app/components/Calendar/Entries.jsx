import React from 'react';
import { DropTarget } from 'react-dnd';
import Types from './DragTypes';
import alphanumeric from 'alphanumeric-id';
import moment from 'moment';

import styles from './Entries.scss';
import Entry from './Entry';

const entriesTarget = {
  drop(props, monitor) {
    return {
      date: props.moment.format('YYYY-MM-DD'),
      offsetY: monitor.getDifferenceFromInitialOffset().y
    };
  }
};

@DropTarget(Types.ENTRY, entriesTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))

export default class Entries extends React.Component {
  renderEntry        = ::this.renderEntry
  handleDoubleClick  = ::this.handleDoubleClick
  handleMouseDown    = ::this.handleMouseDown
  handleMouseMove    = ::this.handleMouseMove
  handleMouseUp      = ::this.handleMouseUp

  state = {
    startedAt: null,
    duration: null
  }

  componentDidMount() {
    const rect = React.findDOMNode(this).getBoundingClientRect();
    this.setState({
      rect: rect,
      popupSide: (window.innerWidth - rect.right) > 250 ? 'right' : 'left'
    });
  }


  // TODO shallowEqual for entries
  // shouldComponentUpdate(newProps, newState) {
  //   return (this.state.duration !== newState.duration) || (this.props.entries.length !== newProps.entries.length);
  // }

  calculateStartTimeFromPixelOffset(offsetY) {
    var decimalTime = (offsetY / (this.props.settings.entryBaseHeight * 4)).toFixed(1)
    var mmt = this.props.moment.clone().set({hour: 0, minute: 0, second: 0}).add(decimalTime, 'hours');
    var minutes = mmt.get('minutes');

    var baseHeight = this.props.settings.entryBaseHeight;
    var minDuration = this.props.settings.minDuration;
    var quarter = 0;

    if (minutes >= (minDuration * 1) && minutes <= (minDuration * 2)) { quarter = 1 }
    if (minutes >= (minDuration * 2) && minutes <= (minDuration * 3)) { quarter = 2 }
    if (minutes >= (minDuration * 3) && minutes <= (minDuration * 4)) { quarter = 3 }

    return mmt.minutes(minDuration * quarter);
  }

  handleDoubleClick(e) {
    e.stopPropagation();
    if (e.target != React.findDOMNode(this)) { return; }
    e.preventDefault();

    var startTime = this.calculateStartTimeFromPixelOffset(e.nativeEvent.offsetY);
    this.props.flux.getActions('entries').createEntry({
      selected: true,
      startedAt: startTime.format(),
      duration: 60,
      description: null
    });
  }

  handleMouseDown(e) {
    e.stopPropagation();
    if (e.target != React.findDOMNode(this)) { return; }
    e.preventDefault();

    this.initialY = e.clientY;
    document.documentElement.addEventListener('mousemove', this.handleMouseMove, false);
    document.documentElement.addEventListener('mouseup', this.handleMouseUp, false);
  }

  handleMouseMove(e) {
    this.deltaY = e.clientY - this.initialY;

    if (this.deltaY > 0) {
      if (this.state.duration !== null) {
        var distanceMultiplier = Math.round(this.deltaY / this.props.settings.entryBaseHeight) || 1; // should never be zero
        this.setState({
          duration: this.props.settings.minDuration * distanceMultiplier
        });
      } else if (Math.abs(this.deltaY) > this.props.settings.entryBaseHeight / 2 && this.deltaY > 0) {
        // delta is larger than half of entryBaseHeight and not negative
        var startTime = this.calculateStartTimeFromPixelOffset(e.offsetY - this.deltaY);

        this.setState({
          startedAt: startTime.format(),
          duration: this.props.settings.minDuration
        });
      }
    };
  }

  handleMouseUp(e) {
    document.documentElement.removeEventListener('mousemove', this.handleMouseMove, false);
    document.documentElement.removeEventListener('mouseup', this.handleMouseUp, false);

    if (this.state.duration !== null) {
      this.props.flux.getActions('entries').createEntry({
        selected: true,
        startedAt: this.state.startedAt,
        duration: this.state.duration,
        description: null
      });

      this.setState({
        startedAt: null,
        duration: null
      });
    };
    this.deltaY = this.initialY = null;
  }

  renderEntry(entry, index) {
    return <Entry
      key={index}
      ref={`child-${index}`}
      {...entry}
      rect={this.state.rect}
      popupSide={this.state.popupSide}
      outletId={this.props.outletId}
      flux={this.props.flux} />;
  }

  render() {
    const { canDrop, isOver, connectDropTarget } = this.props;
    const isActive = canDrop && isOver;

    let entries = this.state.duration !== null ?
      this.props.entries.concat({
      startedAt: this.state.startedAt,
      duration: this.state.duration
    }) : this.props.entries;

    return connectDropTarget(
      <ul className={styles.List} onDoubleClick={this.handleDoubleClick} onMouseDown={this.handleMouseDown}>
        {entries.map(this.renderEntry)}
      </ul>
    );
  }
}
