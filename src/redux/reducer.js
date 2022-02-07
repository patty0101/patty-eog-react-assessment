const reducer = (state = {
  metrics: [], addedMetric: '', multipleData: [], multipleLastData: {},
}, action) => {
  switch (action.type) {
    case 'UPDATE_METRIC':
      return {
        ...state,
        addedMetric: action.payload[action.payload.length - 1],
        metrics: [...action.payload],
      };
    case 'UPDATE_DATA':
      return {
        ...state,
        multipleData: [...state.multipleData, action.payload],
      };
    case 'UPDATE_LAST_DATA':

      return {
        ...state,
        multipleLastData: { ...state.multipleLastData, ...action.payload },
      };
    case 'UPDATE_WITH_LAST_DATA':
      return {
        ...state,
        multipleData: action.payload,
      };
    case 'DELETE_METRIC':
      return {
        ...state,
        metrics: state.metrics.filter(metric => metric !== action.payload),
      };
    case 'DELETE_DATA':
      return {
        ...state,
        multipleData: state.multipleData.filter(item => item.metric !== action.payload),
      };
    default:
      return state;
  }
};
export default reducer;
