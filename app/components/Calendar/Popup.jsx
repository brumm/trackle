import React from 'react';
import styles from './Popup.scss';
import Textarea from 'react-textarea-autosize';
import connectToStores from 'flummox/connect';

class Popup extends React.Component {
  render() {
    return <div>
      <div key='backdrop' onClick={this.props.deselect} className={styles.Backdrop} />

      <div key='popup' className={[styles.Popup, this.props.popupSide].join(' ')} style={{
        left: this.props.popupSide === 'right' ? (((this.props.rect.right) - 65) + 5) : (this.props.rect.right - this.props.rect.width - 320),
        top: (this.props.height + (Math.round((this.props.duration / this.props.minDuration) * this.props.entryBaseHeight)) / 2)
      }}>
        <div className={styles.FormControl}>
          <select value={this.props.projectId || null} name='projectId' onChange={this.props.handleChange}>
            <option value={null}>Project...</option>
            {this.props.projects.map((project) => (<option key={project.id} value={project.id}>{project.name}</option>))}
          </select>
        </div>
        <div className={styles.FormControl}>
          <Textarea
            useCacheForDOMMeasurements
            name='description'
            style={{
              maxHeight: window.innerHeight / 2,
              height: 24
            }}
            placeholder='Add Description...'
            value={this.props.description}
            onChange={this.props.handleChange} />
        </div>
        <div className={styles.FormControl}>
          <input name='duration' data-type='number' type="text" value={this.props.duration} onChange={this.props.handleChange} />
        </div>
        <div className={styles.FormControl}>
          <input name='duration' data-type='number' type="range" step="15" min="15" max="480" value={this.props.duration} onChange={this.props.handleChange} />
        </div>
        <div className={styles.FormControl}>
          <button onClick={this.props.handleDelete} className={styles.DeleteButton}>Delete</button>
        </div>
      </div>
    </div>;
  }
}

export default connectToStores(Popup, {projects: store => ({projects: store.getStateAsObject().projects}) });
