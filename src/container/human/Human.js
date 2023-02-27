import React, { lazy, useState, Suspense } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Spin, Select } from 'antd';
import { Switch, NavLink, Route, Link } from 'react-router-dom';
import FeatherIcon from 'feather-icons-react';
import propTypes from 'prop-types';
import CreateProject from './overview/CreateProject';
import { ProjectHeader, ProjectSorting } from './style';
import { AutoComplete } from '../../components/autoComplete/autoComplete';
import { Button } from '../../components/buttons/buttons';
import { filterProjectByStatus, sortingProjectByCategory } from '../../redux/project/actionCreator';
import { Main } from '../styled';
import { PageHeader } from '../../components/page-headers/page-headers';

const Grid = lazy(() => import('./overview/Grid'));
const List = lazy(() => import('./overview/List'));

function Human({ match }) {
  const dispatch = useDispatch();
  const { path } = match;
  const [state, setState] = useState({
    visible: false,
    categoryActive: 'all',
  });

  const { notData, visible } = state;

  const showModal = () => {
    setState({
      ...state,
      visible: true,
    });
  };

  const onCancel = () => {
    setState({
      ...state,
      visible: false,
    });
  };

  return (
    <>
      <ProjectHeader>
        <PageHeader
          ghost
          title="Projects"
          subTitle={<>12 Running Projects</>}
          buttons={[
            <Button onClick={showModal} key="1" type="primary" size="default">
              <FeatherIcon icon="plus" size={16} /> Create Projects
            </Button>,
          ]}
        />
      </ProjectHeader>
      <Main>
        <Row gutter={25}>
          <Col xs={24}>
            <div>
              <Switch>
                <Suspense
                  fallback={
                    <div className="spin">
                      <Spin />
                    </div>
                  }
                >
                  <Route path={path} component={Grid} exact />
                  <Route path={`${path}/grid`} component={Grid} />
                  <Route path={`${path}/list`} component={List} />
                </Suspense>
              </Switch>
            </div>
          </Col>
        </Row>
        <CreateProject onCancel={onCancel} visible={visible} />
      </Main>
    </>
  );
}

Human.propTypes = {
  match: propTypes.object,
};

export default Human;
