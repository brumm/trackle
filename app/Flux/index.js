import { Flux } from 'flummox';

import SettingsActions from './Actions/SettingsActions';
import SettingsStore from './Stores/SettingsStore';

import ProjectActions from './Actions/ProjectActions';
import ProjectStore from './Stores/ProjectStore';

import EntryActions from './Actions/EntryActions';
import EntryStore from './Stores/EntryStore';

export default class TrackleFlux extends Flux {
  constructor() {
    super();

    this.createActions('settings', SettingsActions);
    this.createStore('settings', SettingsStore, this);

    this.createActions('projects', ProjectActions);
    this.createStore('projects', ProjectStore, this);

    this.createActions('entries', EntryActions);
    this.createStore('entries', EntryStore, this);
  }
}
