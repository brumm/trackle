import React from 'react';
import { DropTarget } from 'react-dnd';
import Types from './DragTypes';
import alphanumeric from 'alphanumeric-id';

import styles from './Entries.scss';
import Entry from './Entry';

function intersectRect(r1, r2) {
  return !(r2.left > r1.right ||
           r2.right < r1.left ||
           r2.top > r1.bottom ||
           r2.bottom < r1.top);
}

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
  constructor(props) {
    super(props);

    this.currentTempId = null;

    this.renderEntry        = this.renderEntry.bind(this);
    this.handleDoubleClick  = this.handleDoubleClick.bind(this);
    this.handleMouseDown    = this.handleMouseDown.bind(this);
    this.handleMouseMove    = this.handleMouseMove.bind(this);
    this.handleMouseUp      = this.handleMouseUp.bind(this);
  }

  calculateStartTime(offsetY) {
    var decimalTime = (offsetY / (this.props.settings.entryBaseHeight * 4)).toFixed(1)
    var mmt = this.props.moment.clone().set({hour: 0, minute: 0, second: 0}).add(decimalTime, 'hours');
    var minutes = mmt.get('minutes');

    var baseHeight = this.props.settings.entryBaseHeight;
    var minDuration = this.props.settings.minDuration;
    var quarter;

    if (minutes >= (minDuration * 0) && minutes <= (minDuration * 1)) { quarter = 0 }
    if (minutes >= (minDuration * 1) && minutes <= (minDuration * 2)) { quarter = 1 }
    if (minutes >= (minDuration * 2) && minutes <= (minDuration * 3)) { quarter = 2 }
    if (minutes >= (minDuration * 3) && minutes <= (minDuration * 4)) { quarter = 3 }

    return mmt.minutes(minDuration * quarter);
  }

  // componentDidUpdate() {
  //   var refKeys = Object.keys(this.refs);
  //   for (var i = 0; i < refKeys.length - 1; i++) {
  //     var r1 = React.findDOMNode(this.refs[refKeys[i]]);
  //     var r2 = React.findDOMNode(this.refs[refKeys[i + 1]]);
  //     if (intersectRect(r1.getBoundingClientRect(), r2.getBoundingClientRect())) {
  //       console.log(r1, r2);
  //     }
  //   };
  // }

  handleDoubleClick(e) {
    e.stopPropagation();
    if (e.target != React.findDOMNode(this)) { return; }
    e.preventDefault();

    var startTime = this.calculateStartTime(e.nativeEvent.offsetY);
    this.props.flux.getActions('entries').createEntry({
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

    // a continuous drag is in process (currentTempId exists) and it snaps to minDuration
    if (this.currentTempId !== null && this.deltaY > 0) {
      var distanceMultiplier = Math.round(this.deltaY / this.props.settings.entryBaseHeight) || 1; // may never be zero
      this.props.flux.getActions('entries').updateEntry(this.currentTempId, {
        duration: this.props.settings.minDuration * distanceMultiplier
      });
    } else {
      // delta is larger than half of entryBaseHeight and not negative
      if (Math.abs(this.deltaY) > this.props.settings.entryBaseHeight / 2 && this.deltaY > 0) {
        var startTime = this.calculateStartTime(e.offsetY - this.deltaY);
        this.currentTempId = alphanumeric(10);

        this.props.flux.getActions('entries').createEntry({
          id: this.currentTempId,
          startedAt: startTime.format(),
          duration: this.props.settings.minDuration,
          description: null
        });
      };
    }
  }

  handleMouseUp(e) {
    this.currentTempId = this.deltaY = this.initialY = null;
    document.documentElement.removeEventListener('mousemove', this.handleMouseMove, false);
    document.documentElement.removeEventListener('mouseup', this.handleMouseUp, false);
  }

  renderEntry(entry, index) {
    return <Entry outletId={this.props.outletId} flux={this.props.flux} ref={`child-${index}`} key={index} {...entry} />;
  }

  render() {
    const { canDrop, isOver, connectDropTarget } = this.props;
    const isActive = canDrop && isOver;
    return connectDropTarget(
      <ul className={styles.List} onDoubleClick={this.handleDoubleClick} onMouseDown={this.handleMouseDown}>
        {(this.props.entries[this.props.moment.format('YYYY-MM-DD')] || []).map(this.renderEntry)}
      </ul>
    );
  }
}
