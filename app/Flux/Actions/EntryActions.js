import { Actions } from 'flummox';

export default class EntryActions extends Actions {
  createEntry(entry) {
    return entry;
  }

  updateEntry(id, entry) {
    return {id, entry};
  }

  removeEntry(id) {
    return id;
  }
}
