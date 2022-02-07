import React from 'react';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector, useDispatch } from 'react-redux';
import { useQuery } from '@apollo/client';
import { GET_METRIC_QUERY } from '../graphql/queries';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
const getStyles = (item, metrics, theme) => ({
  fontWeight:
        metrics && metrics.indexOf(item) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
});
const Inputarea = ({ cssStyle }) => {
  const metrics = useSelector(state => state.metrics);
  const dispatch = useDispatch();
  const theme = useTheme();
  const { loading, error, data } = useQuery(GET_METRIC_QUERY);
  const handleChange = (e) => {
    const { target: { value } } = e;
    const selectedItems = typeof value === 'string' ? value.split(',') : value;
    dispatch({ type: 'UPDATE_METRIC', payload: selectedItems });
  };
  const handleDelete = value => {
    dispatch({ type: 'DELETE_METRIC', payload: value });
    dispatch({ type: 'DELETE_DATA', payload: value });
  };
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  return (
    <div className={cssStyle}>
      <FormControl sx={{ width: 300 }}>
        <InputLabel id="demo-multiple-chip-label">Select..</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="select-multiple-chip"
          multiple
          value={metrics}
          onChange={handleChange}
          input={<OutlinedInput id="demo-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip
                  key={value}
                  label={value}
                  onDelete={() => handleDelete(value)}
                  deleteIcon={<DeleteIcon onMouseDown={(event) => event.stopPropagation()} />}
                />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {data.getMetrics.map((item) => (
            <MenuItem
              key={item}
              value={item}
              style={getStyles(item, metrics, theme)}
            >
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default Inputarea;
