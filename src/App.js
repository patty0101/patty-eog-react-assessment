import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import Inputarea from './components/Inputarea';
import Card from './components/Card';
import Chart from './components/Chart';

const App = () => {
  const metrics = useSelector(state => state.metrics);
  const useStyles = makeStyles({
    container: {
      display: 'flex',
      flexBasis: '100%',
      flexDirection: 'column',
    },
    inputContainer: {
      display: 'flex',
      width: '30vw',
      marginLeft: '70vw',
    },
    cardContainer: {
      display: 'flex',
      justifyContent: 'stretch',
    },
  });
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Inputarea cssStyle={classes.inputContainer} />
      <div className={classes.cardContainer}>
        {metrics.length ? metrics.map(metric => <Card key={metric} metricName={metric} />) : null}
      </div>
      <div className={classes.chartContainer}>
        {metrics.length ? <Chart metrics={metrics} /> : null }
      </div>
    </div>
  );
};
export default App;
