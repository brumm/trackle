import React from 'react';
import moment from 'moment';
import { DragSource } from 'react-dnd';
import Types from './DragTypes';
import connectToStores from 'flummox/connect';

import styles from './Entry.scss';

const cardSource = {
  beginDrag(props) {
    // Return the data describing the dragged item
    const item = { id: props.id };
    return item;
  },

  endDrag(props, monitor, component) {
    if (!monitor.didDrop()) {
      return;
    }

    // When dropped on a compatible target, do something
    const item = monitor.getItem();
    const dropResult = monitor.getDropResult();
    console.log(item, dropResult);

    props.flux.getActions('entries').updateEntry(props.id, {
      startedAt: moment(dropResult.date, 'YYYY-MM-DD').minutes(moment(props.startedAt).hours() * 60 + moment(props.startedAt).minutes()).format()
    });
  }
};

@DragSource(Types.ENTRY, cardSource, (connect, monitor) => ({
  // Call this function inside render()
  // to let React DnD handle the drag events:
  connectDragSource: connect.dragSource(),
  // You can ask the monitor about the current drag state:
  isDragging: monitor.isDragging()
}))

class Entry extends React.Component {
  constructor(props) {
    super(props);

    this.handleDoubleClick = this.handleDoubleClick.bind(this);
  }

  offsetFromTop(start) {
      var mmt = moment(start);
      var mmtMidnight = mmt.clone().startOf('day');
      var diffMinutes = mmt.diff(mmtMidnight, 'minutes');
      diffMinutes -= (moment('00:00', "HH:mm").hours() * 60);
      return this.props.settings.entryBaseHeight * (diffMinutes / this.props.settings.minDuration);
  }

  style() {
    return {
      height: Math.round((this.props.duration / this.props.settings.minDuration) * this.props.settings.entryBaseHeight),
      transform: `translateY(${Math.round(this.offsetFromTop(this.props.startedAt))}px)`
    };
  }

  handleDoubleClick() {
    this.props.flux.getActions('entries').selectEntry(this.props.id);
  }

  render() {
    const { isDragging, connectDragSource } = this.props;
    var startedAt = moment(this.props.startedAt)

    return connectDragSource(
      <li className={styles.Container} style={this.style()} onDoubleClick={this.handleDoubleClick}>
        <div className={styles.Body} style={{
          backgroundColor: isDragging ? 'rgba(0, 0, 0, 0.1)' : null
        }}>
          {!isDragging && [
            <div key={1} style={{fontWeight: '400', marginBottom: 10}}>
              {`${startedAt.format('LT')} - ${startedAt.add(this.props.duration, 'minutes').format('LT')}`}
            </div>,
            <div style={{lineHeight: '12px'}} key={2}>{this.props.description}</div>
          ]}
        </div>
      </li>
    );
  }
}

export default connectToStores(Entry, { settings: store => ({settings: store.getStateAsObject()}) });
