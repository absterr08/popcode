import Immutable from 'immutable';
import {readFileSync} from 'fs';
import path from 'path';

const newProject = Immutable.fromJS({
  sources: {
    html: readFileSync(path.join(
      __dirname,
      '..',
      '..',
      'templates',
      'new.html'
    ), 'utf8'),
    css: '',
    javascript: '',
  },
  enabledLibraries: new Immutable.Set(),
});

function projectToImmutable(project) {
  return Immutable.fromJS(project).set(
    'enabledLibraries',
    new Immutable.Set(project.enabledLibraries)
  );
}

function addProject(state, project) {
  return state.set(project.projectKey, projectToImmutable(project));
}

function projects(stateIn, action) {
  let state;

  if (stateIn === undefined) {
    state = new Immutable.Map();
  } else {
    state = stateIn;
  }

  switch (action.type) {
    case 'PROJECT_LOADED_FROM_STORAGE':
      return addProject(state, action.payload.project);

    case 'CURRENT_PROJECT_LOADED_FROM_STORAGE':
      return addProject(state, action.payload.project);

    case 'PROJECT_SOURCE_EDITED':
      return state.setIn(
        [action.payload.projectKey, 'sources', action.payload.language],
        action.payload.newValue
      );

    case 'PROJECT_CREATED':
      return state.set(
        action.payload.projectKey,
        newProject.set('projectKey', action.payload.projectKey)
      );

    case 'PROJECT_LIBRARY_TOGGLED':
      return state.updateIn(
        [action.payload.projectKey, 'enabledLibraries'],
        (enabledLibraries) => {
          const libraryKey = action.payload.libraryKey;
          if (enabledLibraries.has(libraryKey)) {
            return enabledLibraries.delete(libraryKey);
          }
          return enabledLibraries.add(libraryKey);
        }
      );

    default:
      return state;
  }
}

projects.projectToImmutable = projectToImmutable;

export default projects;
