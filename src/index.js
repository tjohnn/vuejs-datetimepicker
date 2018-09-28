import plugin from './datetime_picker.vue'

export default {
  install: function (Vue, options) {
    Vue.component(plugin.name, plugin)
  }
}