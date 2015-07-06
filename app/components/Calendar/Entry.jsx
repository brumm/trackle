import React from 'react';
import moment from 'moment';
import { DragSource } from 'react-dnd';
import Types from './DragTypes';
import connectToStores from 'flummox/connect';
import Popup from "./Popup";
import classNames from 'classnames';

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
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))

class Entry extends React.Component {

  static contextTypes = {
    flux: React.PropTypes.object.isRequired
  }

  state = {
    duration: null,
    projectId: null,
    description: null
  }

  componentDidMount() {
  }

  offsetFromTop = ::this.offsetFromTop
  offsetFromTop(start) {
      var mmt = moment(start);
      var mmtMidnight = mmt.clone().startOf('day');
      var diffMinutes = mmt.diff(mmtMidnight, 'minutes');
      diffMinutes -= (moment('00:00', "HH:mm").hours() * 60);
      return this.props.settings.entryBaseHeight * (diffMinutes / this.props.settings.minDuration);
  }

  getHeight = ::this.getHeight
  getHeight() {
    return Math.round(this.offsetFromTop(this.props.startedAt));
  }

  style = ::this.style
  style() {
    return {
      height: Math.round((this.get('duration') / this.props.settings.minDuration) * this.props.settings.entryBaseHeight),
      transform: `translateY(${this.getHeight()}px)`
    };
  }

  handleDoubleClick = ::this.handleDoubleClick
  handleDoubleClick() {
    this.props.flux.getActions('entries').updateEntry(this.props.id, {
      selected: true
    });
  }

  deselect = ::this.deselect
  deselect(e) {
    var newProps = ['duration', 'description', 'projectId'].reduce((memo, prop) => {
      var value = this.state[prop] || this.props[prop];
      memo[prop] = value;
      return memo;
    }, {
      selected: false
    });

    this.setState({
      duration: null,
      projectId: null,
      description: null
    });

    this.props.flux.getActions('entries').updateEntry(this.props.id, newProps);
  }

  onChange = ::this.onChange
  onChange(e) {
    const value = e.target.dataset.type === 'number' ? parseInt(e.target.value, 10) : e.target.value;
    this.setState({ [e.target.name]: value });
  }

  get = ::this.get
  get(prop) {
    return this.state[prop] === null ? this.props[prop] : this.state[prop];
  }

  renderPopup = ::this.renderPopup
  renderPopup() {
    return (
      <Plug outletId={this.props.outletId}>
        <Popup
          projectId={this.get('projectId')}
          height={this.getHeight()}
          duration={this.get('duration')}
          minDuration={this.props.settings.minDuration}
          entryBaseHeight={this.props.settings.entryBaseHeight}
          description={this.get('description')}
          handleChange={this.onChange}
          deselect={this.deselect}
          rect={this.props.rect}
          popupSide={this.props.popupSide} />
    </Plug>);
  }

  handleMouseDown = ::this.handleMouseDown
  handleMouseDown(e) {
    e.stopPropagation();
    e.preventDefault();

    this.initialY = e.clientY;
    document.documentElement.addEventListener('mousemove', this.handleMouseMove, false);
    document.documentElement.addEventListener('mouseup', this.handleMouseUp, false);
  }

  handleMouseMove = ::this.handleMouseMove
  handleMouseMove(e) {
    this.deltaY = e.clientY - this.initialY;
    var distanceMultiplier = Math.round(this.deltaY / this.props.settings.entryBaseHeight);
    var duration = this.props.duration + (this.props.settings.minDuration * distanceMultiplier);
    if (duration >= this.props.settings.minDuration) {
      this.setState({
        duration: duration
      });
    }
  }

  handleMouseUp = ::this.handleMouseUp
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

  getProject() {
    return this.context.flux.getStore('projects').getProject(this.get('projectId'));
  }

  className() { return classNames(
    styles.Body,
    {'is-new': !this.get('projectId')}
  )}

  render() {
    const { isDragging, connectDragSource } = this.props;
    var startedAt = moment(this.props.startedAt)

    return connectDragSource(
      <li className={styles.Container} style={this.style()} onDoubleClick={this.handleDoubleClick}>
        <div className={this.className()} style={{
          backgroundColor: this.getProject().color,
          opacity: isDragging ? 0.5 : null
        }}>
          {!isDragging && [
            <div key={2} style={{fontWeight: '400', marginBottom: 10}}>
              {`${startedAt.format('LT')} - ${startedAt.clone().add(this.get('duration'), 'minutes').format('LT')}`}
            </div>,
            <div key={3} dangerouslySetInnerHTML={{__html: this.get('description')}} />]}

            {this.props.selected && this.renderPopup()}
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
