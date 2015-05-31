import React from 'react';
import styles from './Popup.scss';
import Textarea from 'react-textarea-autosize';

class Popup extends React.Component {
  render() {
    return <div>
      <div key={`backdrop-${this.props.id}`} onClick={this.props.deselect} className={styles.Backdrop} />
      <div key={`popup-${this.props.id}`} className={[styles.Popup, this.props.popupSide].join(' ')} style={{
        left: this.props.popupSide === 'right' ? (((this.props.rect.right) - 65) + 5) : (this.props.rect.right - this.props.rect.width - 320),
        top: (this.props.height + (Math.round((this.props.duration / this.props.minDuration) * this.props.entryBaseHeight)) / 2)
      }}>
        <div className="form-control">Project Name</div>
        <div className="form-control">
          <Textarea
            useCacheForDOMMeasurements
            name='description'
            style={{maxHeight: window.innerHeight / 2}}
            placeholder='Add Description...'
            value={this.props.description}
            onChange={this.props.handleChange} />
        </div>
        <div className="form-control">
          <input name='duration' type="text" value={this.props.duration} onChange={this.props.handleChange} />
        </div>
        <div className="form-control">
          <input name='duration' type="range" step="15" min="15" max="480" value={this.props.duration} onChange={this.props.handleChange} />
        </div>
      </div>
    </div>;
  }
}

export default Popup;
