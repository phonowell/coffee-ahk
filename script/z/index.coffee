@mask = (id, data = {}, callback) ->

  if app.refs.mask.isVisible
    $.mask false
    $.delay 500, => @mask id, data, callback
    return

  theme = if ['address', 'batch-buy'].includes id
    'default'
  else 'custom'

  $.mask
    data: data
    id: id
    isVisible: true
    theme: theme
  , callback or -> $.mask false