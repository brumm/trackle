import { Store } from 'flummox';
import alphanumeric from 'alphanumeric-id';
import objectAssign from 'object-assign';
import randomColor from 'randomcolor';

export default class ProjectStore extends Store {
  constructor(flux) {
    super();

    this.primaryIndex = {};
    this.state = {
      projects: []
    };

    const actionIds = flux.getActionIds('projects');
    this.register(actionIds.createProject, this.handleCreateProject);
    this.register(actionIds.updateProject, this.handleUpdateProject);

    this.handleCreateProject({name: "Microsoft"});
    this.handleCreateProject({name: "Apple"});
    this.handleCreateProject({name: "20%"});
    this.handleCreateProject({name: "Google"});
    this.handleCreateProject({name: "Tesla"});
  }

  handleCreateProject(project) {
    project.color = project.color || randomColor();
    project.id = project.id || alphanumeric(10);
    var projects = this.state.projects;
    var length = projects.push(project);

    this.primaryIndex[project.id] = length - 1;

    this.setState({
      projects: projects
    });
  }

  handleUpdateProject({id, project}) {
    var projects = this.state.projects;
    objectAssign(projects[this.primaryIndex[id]], project);

    this.setState({
      projects: projects
    });
  }

  getProject = ::this.getProject
  getProject(id) {
    return this.state.projects[this.primaryIndex[id]] || {};
  }

}
