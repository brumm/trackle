import { Store } from 'flummox';
import moment from 'moment';

export default class SettingsStore extends Store {
  constructor(flux) {
    super();
    const actionIds = flux.getActionIds('settings');

    this.register(actionIds.decrementIsoWeek, this.handleDecrementIsoWeek);
    this.register(actionIds.resetIsoWeek, this.handleResetIsoWeek);
    this.register(actionIds.incrementIsoWeek, this.handleIncrementIsoWeek);

    this.state = {
      isoWeek: moment().isoWeek(), // moment().isoWeek()
      locale: 'de', // navigator.language
      entryBaseHeight: 22, // px
      defaultWorkPeriod: ["09:00", "19:00"], // should be actual amount
      minDuration: 15 // minutes, should be project-specific?
    };

    moment.locale(this.state.locale);
  }

  handleDecrementIsoWeek() {
    this.setState({ isoWeek: this.state.isoWeek - 1 });
  }
  handleResetIsoWeek() {
    this.setState({ isoWeek: moment().isoWeek() });
  }
  handleIncrementIsoWeek() {
    this.setState({ isoWeek: this.state.isoWeek + 1 });
  }
}
