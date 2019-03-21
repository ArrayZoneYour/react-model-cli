const indexTemplate = `import { Model } from 'react-model'
{{#models}}
import {{name}} from './{{name}}'
{{/models}}

export const {
  actions,
  useStore,
  getInitialState,
  getState,
  subscribe,
  unsubscribe
} = Model({
  {{#models}}
  {{#if @last}}
    {{name}}
  {{^}}
    {{name}},
  {{/if}}
  {{/models}}
})`

const modelTemplate = `type State = {
}

type ActionParams = {
  update: undefined
}

const model: ModelType<State, ActionParams> = {
  state: {
  },
  actions: {
    update: (state, actions) => {
      return state
    }
  }
}

export default model
`
module.exports = { indexTemplate, modelTemplate }
