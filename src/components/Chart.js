import React, { useEffect, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { useSelector, useDispatch } from 'react-redux';
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Legend, Tooltip,
} from 'recharts';
import moment from 'moment';
import { GET_SPECIFIC_DATA_QUERY } from '../graphql/queries';

const Chart = () => {
  const addedMetric = useSelector(state => state.addedMetric);
  const multipleData = useSelector(state => state.multipleData);
  const multipleLastData = useSelector(state => state.multipleLastData);
  const dispatch = useDispatch();
  const before = useMemo(() => moment().valueOf(), []);
  const after = useMemo(() => moment().subtract(30, 'minutes').valueOf(), []);
  const { loading, error, data } = useQuery(GET_SPECIFIC_DATA_QUERY, {
    variables: { input: { metricName: addedMetric, before, after } },
  });
  const color = ['#000080', '#0000ff', '#008080', '#0000ff', '#ffa500'];
  useEffect(() => {
    if (!loading) {
      dispatch({ type: 'UPDATE_DATA', payload: { metric: addedMetric, measurements: data.getMeasurements } });
    }
  }, [loading]);
  useEffect(() => {
    const updatedData = multipleData.map(item => {
      const newData = multipleLastData[item.metric];
      const {
        value, at, unit,
      } = newData;
      return { metric: item.metric, measurements: [...item.measurements, { at, value, unit }] };
    });
    dispatch({ type: 'UPDATE_WITH_LAST_DATA', payload: updatedData });
  }, [multipleLastData]);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (multipleData.length < 1) return <p>lenght is 0</p>;
  const firstData = multipleData[0];
  const len = firstData.measurements.length;
  return (
    <LineChart
      width={730}
      height={250}
      data={multipleData}
      margin={{
        top: 5, right: 30, left: 20, bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        dataKey="at"
        domain={[firstData.measurements[0].at, firstData.measurements[len - 1].at]}
        scale="time"
        type="number"
        tickCount={6}
        minTickGap={60}
        tickFormatter={(unixTime) => moment(unixTime).format('HH:mm')}
      />
      {
        multipleData.map((item) => (
          <YAxis
            dataKey="value"
            yAxisId={item.metric}
            type="number"
            key={item.metric}
            unit={item.measurements[0].unit}
          />
        ))
      }
      <Tooltip />
      <Legend />
      {
         multipleData.map((item, i) => (
           <Line
             type="linear"
             dot={false}
             yAxisId={item.metric}
             key={item.metric}
             dataKey="value"
             data={item.measurements}
             stroke={color[i]}
           />
         ))
      }
    </LineChart>
  );
};

export default Chart;
