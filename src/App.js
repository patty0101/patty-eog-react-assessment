import React from 'react';
import { useSelector } from 'react-redux';
import Inputarea from './components/Inputarea';
import Card from './components/Card';
import Chart from './components/Chart';

const App = () => {
  const metrics = useSelector(state => state.metrics);
  return (
    <>
      <Inputarea />
      {metrics.length ? metrics.map(metric => <Card key={metric} metricName={metric} />) : null}
      {metrics.length ? <Chart metrics={metrics} /> : null }
    </>
  );
};
export default App;
