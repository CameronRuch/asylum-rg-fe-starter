import React from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import CitizenshipMapAll from './Graphs/CitizenshipMapAll';
import CitizenshipMapSingleOffice from './Graphs/CitizenshipMapSingleOffice';
import TimeSeriesAll from './Graphs/TimeSeriesAll';
import OfficeHeatMap from './Graphs/OfficeHeatMap';
import TimeSeriesSingleOffice from './Graphs/TimeSeriesSingleOffice';
import YearLimitsSelect from './YearLimitsSelect';
import ViewSelect from './ViewSelect';
import axios from 'axios';
import { resetVisualizationQuery } from '../../../state/actionCreators';
// import test_data from '../../../data/test_data.json';
import { colors } from '../../../styles/data_vis_colors';
import ScrollToTopOnMount from '../../../utils/scrollToTopOnMount';
// import ColumnGroup from 'antd/lib/table/ColumnGroup';

const { background_color } = colors;
const URL = 'https://hrf-asylum-be-b.herokuapp.com/cases';

function GraphWrapper(props) {
  const { set_view, dispatch } = props;
  let { office, view } = useParams();
  let summary = '';
  if (!view) {
    set_view('time-series');
    view = 'time-series';
  }
  let map_to_render;
  if (!office) {
    switch (view) {
      case 'time-series':
        map_to_render = <TimeSeriesAll />;
        summary = 'fiscalSummary';
        break;
      case 'office-heat-map':
        map_to_render = <OfficeHeatMap />;
        summary = 'fiscalSummary';
        break;
      case 'citizenship':
        map_to_render = <CitizenshipMapAll />;
        summary = 'citizenshipSummary';
        break;
      default:
        break;
    }
  } else {
    switch (view) {
      case 'time-series':
        map_to_render = <TimeSeriesSingleOffice office={office} />;
        summary = 'fiscalSummary';
        break;
      case 'citizenship':
        map_to_render = <CitizenshipMapSingleOffice office={office} />;
        summary = 'citizenshipSummary';
        break;
      default:
        break;
    }
  }

  function axiosDataToArray(responseData) {
    if (summary === 'fiscalSummary') {
      if (Array.isArray(responseData)) {
        // The response data is already an array, so just return it
        return responseData;
      } else if (responseData && typeof responseData === 'object') {
        // The response data is an object, so convert it to an array
        return Object.values(responseData);
      } else {
        // Invalid response data, return an empty array
        return responseData;
      }
    }
  }

  function updateStateWithNewData(years, view, office, stateSettingCallback) {
    if (summary === 'fiscalSummary') {
      if (office === 'all' || !office) {
        axios
          .get(`${URL}/fiscalSummary`, {
            // mock URL, can be simply replaced by `${Real_Production_URL}/summary` in prod!
            params: {
              from: years[0],
              to: years[1],
            },
          })
          .then(result => {
            console.log(result.data);
            const myArray = axiosDataToArray(result.data.yearResults);
            stateSettingCallback(view, office, myArray); // <-- `test_data` here can be simply replaced by `result.data` in prod!
          })
          .catch(err => {
            console.error(err);
          });
      } else {
        axios
          .get(`${URL}/fiscalSummary`, {
            // mock URL, can be simply replaced by `${Real_Production_URL}/summary` in prod!
            params: {
              from: years[0],
              to: years[1],
              office: office,
            },
          })
          .then(result => {
            console.log(result.data);
            const myArray = axiosDataToArray(result.data.yearResults);
            stateSettingCallback(view, office, myArray); // <-- `test_data` here can be simply replaced by `result.data` in prod!
          })
          .catch(err => {
            console.error(err);
          });
      }
    } else {
      axios
        .get(`${URL}/citizenshipSummary`)
        .then(result => {
          stateSettingCallback(view, office, result.data);
        })
        .catch(err => {
          console.error(err);
        });
    }
  }
  const clearQuery = (view, office) => {
    dispatch(resetVisualizationQuery(view, office));
  };
  return (
    <div
      className="map-wrapper-container"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        minHeight: '50px',
        backgroundColor: background_color,
      }}
    >
      <ScrollToTopOnMount />
      {map_to_render}
      <div
        className="user-input-sidebar-container"
        style={{
          width: '300px',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <ViewSelect set_view={set_view} />
        <YearLimitsSelect
          view={view}
          office={office}
          clearQuery={clearQuery}
          updateStateWithNewData={updateStateWithNewData}
          summary={summary}
        />
      </div>
    </div>
  );
}

export default connect()(GraphWrapper);
