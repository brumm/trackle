import { Store } from 'flummox';
import alphanumeric from 'alphanumeric-id';
import objectAssign from 'object-assign';

export default class EntryStore extends Store {
  constructor(flux) {
    super();

    const actionIds = flux.getActionIds('entries');
    this.register(actionIds.createEntry, this.handleCreateEntry);
    this.register(actionIds.updateEntry, this.handleUpdateEntry);
    this.register(actionIds.removeEntry, this.handleRemoveEntry);

    this.primaryIndex = {};

    window.foo = this;

    this.state = {
      entries: []
    };
  }

  getEntriesGroupedByIds() {
    return this.state.entries.reduce((memo, entry) => {
      var dateString = entry.startedAt.substring(0, 10);
      if (memo[dateString] != null) {
        memo[dateString].push(entry);
      } else {
        memo[dateString] = [entry];
      };
      return memo;
    }, {});
  }

  handleCreateEntry(entry) {
    entry.id = entry.id || alphanumeric(10);
    let {entries} = this.state;
    let length = entries.push(entry);

    this.primaryIndex[entry.id] = length - 1;

    this.setState({ entries });
  }

  handleUpdateEntry({id, entry}) {
    let {entries} = this.state;
    objectAssign(entries[this.primaryIndex[id]], entry);

    this.setState({ entries });
  }

  handleRemoveEntry(id) {
    let {entries} = this.state;
    delete entries[this.primaryIndex[id]];
    delete this.primaryIndex[id];

    this.setState({ entries });
  }
}
