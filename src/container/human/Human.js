import React, { lazy, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Row, Col, Spin, Select } from 'antd';
import FeatherIcon from 'feather-icons-react';
import propTypes from 'prop-types';
import CreateHuman from './overview/CreateHuman';
import { ProjectHeader, ProjectSorting } from './style';
import { Button } from '../../components/buttons/buttons';
import { Main } from '../styled';
import { PageHeader } from '../../components/page-headers/page-headers';
import { get, remove } from '../../config/axios';

const List = lazy(() => import('./overview/List'));

function Human({ match }) {
  const dispatch = useDispatch();
  const { path } = match;
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  // const humanSelected= useSelector(state)
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [levels, setLevels] = useState([]);

  const [selected, setSelected] = useState(null);
  const showModal = () => {
    setOpen(true);
  };
  const onSelected = (id) => {
    setSelected(id);
  };

  const onCancel = () => {
    setSelected(null);
    setOpen(false);
  };

  const getDataSelect = async () => {
    const [resRoles, resLevels] = await Promise.all([get('/roles'), get('/levels')]);
    setRoles(resRoles.data);
    setLevels(resLevels.data);
  };
  const getList = async () => {
    try {
      setLoading(true);
      const res = await get('users');
      await getDataSelect();
      setData(res.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getList();
  }, []);

  useEffect(() => {
    if (selected) {
      showModal();
    }
  }, [selected]);

  const mapRole = (id) => {
    return roles.find((role) => role.id.toString() === id.toString())?.roleName;
  };

  const mapLevel = (id) => {
    return levels.find((level) => level.id.toString() === id.toString())?.levelName;
  };

  const onAdd = (add) => {
    setData([...data, add]);
  };
  const onUpdate = (update) => {
    const index = data.findIndex((item) => item.id === update.id);
    const newArray = [...data];
    newArray[index] = update;
    setData(newArray);
  };

  const onDelete = async (id) => {
    try {
      const res = await remove(`/users/${id}`);
      setData(data.filter((item) => item.id !== id));
    } catch (error) {}
  };
  return (
    <>
      <ProjectHeader>
        <PageHeader
          ghost
          title="User"
          buttons={[
            <Button onClick={showModal} key="1" type="primary" size="default">
              <FeatherIcon icon="plus" size={16} /> Create User
            </Button>,
          ]}
        />
      </ProjectHeader>
      <Main>
        <Row gutter={25}>
          <Col xs={24}>
            <div>
              {loading ? (
                <div className="spin">
                  <Spin />
                </div>
              ) : (
                <List data={data} onSelected={onSelected} mapRole={mapRole} mapLevel={mapLevel} onDelete={onDelete} />
              )}
            </div>
          </Col>
        </Row>
        <CreateHuman
          roles={roles}
          levels={levels}
          onCancel={onCancel}
          selected={selected}
          visible={open}
          mapRoles={mapRole}
          mapLevel={mapLevel}
          setLevels={setLevels}
          setRoles={setRoles}
          setSelected={setSelected}
          onAdd={onAdd}
          onUpdate={onUpdate}
        />
      </Main>
    </>
  );
}

Human.propTypes = {
  match: propTypes.object,
};

export default Human;
