import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useQuery } from '@apollo/client';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { GET_LAST_KNOW_DATA_BY_METRIC_QUERY } from '../graphql/queries';

const Cardcontainer = ({ metricName }) => {
  const dispatch = useDispatch();
  const multipleLastData = useSelector(state => state.multipleLastData);
  const { loading, error, data } = useQuery(GET_LAST_KNOW_DATA_BY_METRIC_QUERY, {
    variables: { metricName },
    pollInterval: 1300,
  });
  useEffect(() => {
    if (!loading) {
      const measurement = data.getLastKnownMeasurement;
      dispatch({ type: 'UPDATE_LAST_DATA', payload: { [metricName]: measurement } });
    }
  }, [loading, data]);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!Object.keys(multipleLastData).includes(metricName)) return <p>no...</p>;
  const { metric, value } = multipleLastData[metricName];
  return (
    <Card sx={{ width: 200, height: 200 }} variant="outlined">
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {metric}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};
export default Cardcontainer;
