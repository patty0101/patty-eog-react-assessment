import { gql } from '@apollo/client';

export const GET_METRIC_QUERY = gql`
    {
        getMetrics
    }
`;

export const GET_LAST_KNOW_DATA_BY_METRIC_QUERY = gql`
       query Metric($metricName: String!) {
        getLastKnownMeasurement(metricName: $metricName) {
            metric
            at
            value
            unit
    }

       }
`;
export const GET_SPECIFIC_DATA_QUERY = gql`
       query Specificdata($input: MeasurementQuery!) {
           getMeasurements(input: $input) {
               at
               value
               unit
           }
       }
`;
export const GET_MULTIPLE_DATA_QUERY = gql`
       query Data($input: [MeasurementQuery!]) {
        getMultipleMeasurements(input: $input) {
            metric
            measurements {
                at
                value
                unit
            }
        }
       }
`;
