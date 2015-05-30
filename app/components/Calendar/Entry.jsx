import React from 'react';
import moment from 'moment';
import { DragSource } from 'react-dnd';
import Types from './DragTypes';
import connectToStores from 'flummox/connect';
import Textarea from 'react-textarea-autosize';
import autobind from 'autobind-decorator'

import { Plug } from "react-outlet";
import styles from './Entry.scss';

const entrySource = {
  beginDrag(props) {
    return { id: props.id };
  },

  endDrag(props, monitor, component) {
    if (!monitor.didDrop()) {
      return;
    }

    // When dropped on a compatible target, do something
    const item = monitor.getItem();
    const dropResult = monitor.getDropResult();
    let timeOffset = props.settings.minDuration * Math.abs(Math.round(dropResult.offsetY / props.settings.entryBaseHeight));
    let startedAt = moment(dropResult.date, 'YYYY-MM-DD').minutes(moment(props.startedAt).hours() * 60 + moment(props.startedAt).minutes())
    let method = dropResult.offsetY > 0 ? 'add' : 'subtract';
    startedAt[method](timeOffset, 'minutes');

    props.flux.getActions('entries').updateEntry(props.id, {
      startedAt: startedAt.format()
    });
  }
};

@DragSource(Types.ENTRY, entrySource, (connect, monitor) => ({
  // Call this function inside render()
  // to let React DnD handle the drag events:
  connectDragSource: connect.dragSource(),
  // You can ask the monitor about the current drag state:
  isDragging: monitor.isDragging()
}))

class Entry extends React.Component {
  state = {
    selected: false,
    duration: null,
    description: null
  }

  componentDidMount() {
    // TODO: This needs to be refreshed on window resize
    // and also be put into state
    this.rect = React.findDOMNode(this).getBoundingClientRect();
    this.popupSide = (window.innerWidth - this.rect.right) > 250 ? 'right' : 'left';
  }

  @autobind
  offsetFromTop(start) {
      var mmt = moment(start);
      var mmtMidnight = mmt.clone().startOf('day');
      var diffMinutes = mmt.diff(mmtMidnight, 'minutes');
      diffMinutes -= (moment('00:00', "HH:mm").hours() * 60);
      return this.props.settings.entryBaseHeight * (diffMinutes / this.props.settings.minDuration);
  }

  @autobind
  getHeight() {
    return Math.round(this.offsetFromTop(this.props.startedAt));
  }

  @autobind
  style() {
    return {
      height: Math.round((this.get('duration') / this.props.settings.minDuration) * this.props.settings.entryBaseHeight),
      transform: `translateY(${this.getHeight()}px)`
    };
  }

  @autobind
  handleDoubleClick() {
    this.setState({ selected: true });
  }
  @autobind
  deselect(e) {
    var newProps = ['duration', 'description'].reduce((memo, prop) => {
      var value = this.state[prop] || this.props[prop];
      memo[prop] = value;
      return memo;
    }, {});

    this.setState({
      selected: false,
      duration: null,
      description: null
    });

    this.props.flux.getActions('entries').updateEntry(this.props.id, newProps);
  }
  @autobind
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  @autobind
  get(prop) {
    return this.state[prop] === null ? this.props[prop] : this.state[prop];
  }

  @autobind
  renderPopup(startedAt) {
    return <Plug outletId={this.props.outletId}>
      {this.state.selected && [
        <div key={`backdrop-${this.props.id}`} onClick={this.deselect} className={styles.Backdrop} />,
        <div key={`popup-${this.props.id}`} className={[styles.Popup, this.popupSide].join(' ')} style={{
          left: this.popupSide === 'right' ? (((this.rect.right) - 65) + 5) : (this.rect.right - this.rect.width - 320),
          top: (this.getHeight() + (Math.round((this.get('duration') / this.props.settings.minDuration) * this.props.settings.entryBaseHeight)) / 2)
        }}>
          <div className="form-control">Project Name</div>
          <div className="form-control">
            <Textarea
              useCacheForDOMMeasurements
              name='description'
              style={{maxHeight: window.innerHeight / 2}}
              placeholder='Add Description...'
              value={this.get('description')}
              onChange={this.onChange} />
          </div>
            <div className="form-control">
            {`${startedAt.format('DD MMM YYYY')}`}
            {`${startedAt.format('LT')} - ${startedAt.clone().add(this.get('duration'), 'minutes').format('LT')}`}
          </div>
          <div className="form-control">
            <input name='duration' type="range" step="15" min="15" max="480" value={this.get('duration')} onChange={this.onChange} />
          </div>
        </div>]}
    </Plug>;
  }

  @autobind
  handleMouseDown(e) {
    e.stopPropagation();
    e.preventDefault();

    this.initialY = e.clientY;
    document.documentElement.addEventListener('mousemove', this.handleMouseMove, false);
    document.documentElement.addEventListener('mouseup', this.handleMouseUp, false);
  }
  @autobind
  handleMouseMove(e) {
    this.deltaY = e.clientY - this.initialY;
    var distanceMultiplier = Math.round(this.deltaY / this.props.settings.entryBaseHeight); // should never be zero
    var duration = this.props.duration + (this.props.settings.minDuration * distanceMultiplier);
    if (duration >= this.props.settings.minDuration) {
      this.setState({
        duration: duration
      });
    }
  }
  @autobind
  handleMouseUp() {
    if (this.state.duration !== null) {
      this.props.flux.getActions('entries').updateEntry(this.props.id, {
        duration: this.state.duration,
      });

      this.setState({
        duration: null
      });
    }
    document.documentElement.removeEventListener('mousemove', this.handleMouseMove, false);
    document.documentElement.removeEventListener('mouseup', this.handleMouseUp, false);
    this.deltaY = this.initialY = null;
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
              {`${startedAt.format('LT')} - ${startedAt.clone().add(this.get('duration'), 'minutes').format('LT')}`}
            </div>,
            <div style={{lineHeight: '12px'}} key={2}>{this.props.description}</div>]}
            {this.renderPopup(startedAt)}
        </div>
        <div onMouseDown={this.handleMouseDown} className="resize-handle" style={{
          position: 'absolute',
          bottom: 0, height: this.props.settings.entryBaseHeight / 3,
          left: 0, right: 0,
          cursor: 'ns-resize'
        }} />
      </li>
    );
  }
}

export default connectToStores(Entry, { settings: store => ({settings: store.getStateAsObject()}) });
