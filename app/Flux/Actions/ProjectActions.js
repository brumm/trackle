import { Actions } from 'flummox';

export default class ProjectActions extends Actions {
  createProject(project) { return project }

  updateProject(id, project) { return {id, project} }
}
