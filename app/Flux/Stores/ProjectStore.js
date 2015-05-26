import { Store } from 'flummox';

export default class ProjectStore extends Store {
  constructor(flux) {
    super();

    this.state = [
      {id: 1, name: "Accenture"},
      {id: 2, name: "ILPT"}
    ];
  }

}
