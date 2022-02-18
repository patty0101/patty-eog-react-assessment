import React, { useEffect, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { useSelector, useDispatch } from 'react-redux';
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Legend, Tooltip,
} from 'recharts';
import moment from 'moment';
import { GET_SPECIFIC_DATA_QUERY } from '../graphql/queries';

const getTicks = (start, end) => {
  const startMinutes = moment(start).minutes();
  const startSeconds = moment(start).seconds();
  const newStart = start - startSeconds * 1000;
  const ticks = [];
  const remainder = startMinutes % 10;
  if (remainder === 0) {
    ticks[0] = newStart - startSeconds * 1000;
  } else if (remainder < 5) {
    ticks[0] = newStart + (5 - remainder) * 1000 * 60;
  } else {
    ticks[0] = newStart + (10 - remainder) * 1000 * 60;
  }
  // eslint-disable-next-line no-plusplus
  while (end > ticks[ticks.length - 1]) {
    ticks.push(ticks[ticks.length - 1] + 5 * 1000 * 60);
  }
  return ticks;
};
const color = {
  waterTemp: '#000080', flareTemp: '#0000ff', injValveOpen: '#008080', casingPressure: '#f9967f', tubingPressure: '#ffa500', oilTemp: '#f9877f',
};
const Chart = () => {
  const addedMetric = useSelector(state => state.addedMetric);
  const multipleData = useSelector(state => state.multipleData);
  const multipleLastData = useSelector(state => state.multipleLastData);
  const dispatch = useDispatch();
  const input = useMemo(() => ({
    metricName: addedMetric,
    before: moment().valueOf(),
    after: moment().subtract(30, 'minutes').valueOf(),
  }), [addedMetric]);
  const { loading, error, data } = useQuery(GET_SPECIFIC_DATA_QUERY, {
    variables: { input },
  });
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
      width={800}
      height={400}
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
        ticks={getTicks(firstData.measurements[0].at, firstData.measurements[len - 1].at)}
        tickFormatter={(unixTime) => moment(unixTime).format('hh:mm')}
      />
      {
        multipleData.map((item) => (
          <YAxis
            dataKey="value"
            yAxisId={item.measurements[0].unit}
            type="number"
            key={item.metric}
            unit={item.measurements[0].unit}
          />
        ))
      }
      <Tooltip />
      <Legend />
      {
         multipleData.map(item => (
           <Line
             type="linear"
             dot={false}
             yAxisId={item.measurements[0].unit}
             key={item.metric}
             dataKey="value"
             data={item.measurements}
             stroke={color[item.metric]}
             name={item.metric}
           />
         ))
      }
    </LineChart>
  );
};

export default Chart;
