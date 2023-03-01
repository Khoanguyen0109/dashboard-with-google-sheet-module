import React, { useState, useEffect } from 'react';
import { Row, Col, Table, Progress, Pagination, Tag, Typography } from 'antd';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import FeatherIcon from 'feather-icons-react';
import moment from 'moment';
import Heading from '../../../components/heading/heading';
import { Cards } from '../../../components/cards/frame/cards-frame';
import { ProjectPagination, ProjectListTitle, ProjectListAssignees, ProjectList } from '../style';
import { Dropdown } from '../../../components/dropdown/dropdown';
import { Button } from '../../../components/buttons/buttons';

const { Text } = Typography;

function HumanList(props) {
  const { data, mapRole, onDelete, mapLevel, onSelected } = props;
  const [state, setState] = useState({
    list: data,
    current: 0,
    pageSize: 0,
  });
  const { list } = state;

  useEffect(() => {
    if (data) {
      setState({
        list: data,
      });
    }
  }, [data]);

  const onShowSizeChange = (current, pageSize) => {
    setState({ ...state, current, pageSize });
  };

  const onHandleChange = (current, pageSize) => {
    // You can create pagination in here
    setState({ ...state, current, pageSize });
  };

  const dataSource = [];

  if (list.length)
    list.map((value) => {
      const { id, name, status, createdDate, gender, email, role, level, address, image, phoneNumber, permissions } =
        value;
      return dataSource.push({
        key: id,
        name: (
          <ProjectListTitle>
            <Heading as="h4">
              <Link to={`/admin/project/projectDetails/${id}`}>{name}</Link>
            </Heading>
          </ProjectListTitle>
        ),
        createdDate: <span className="date-finished">{moment(new Date(createdDate)).format('DD/MM/YYYY')}</span>,

        email: <span className="date-finished">{email}</span>,
        phoneNumber: <span className="date-finished">{phoneNumber}</span>,
        gender: <span className="">{gender}</span>,

        level: <span className="">{mapLevel(level)}</span>,
        address: (
          <Text ellipsis={{ tooltip: address }} style={{ width: '200px' }}>
            {address}
          </Text>
        ),
        role: <span className="">{mapRole(role)}</span>,
        permissions: (
          <Text ellipsis={{ tooltip: permissions }} style={{ width: 200 }}>
            {permissions}
          </Text>
        ),
        // assigned: (
        //   <ProjectListAssignees>
        //     <ul>
        //       <li>
        //         <img src={require(`../../../static/img/users/1.png`)} alt="" />
        //       </li>
        //       <li>
        //         <img src={require(`../../../static/img/users/2.png`)} alt="" />
        //       </li>
        //       <li>
        //         <img src={require(`../../../static/img/users/3.png`)} alt="" />
        //       </li>
        //       <li>
        //         <img src={require(`../../../static/img/users/4.png`)} alt="" />
        //       </li>
        //       <li>
        //         <img src={require(`../../../static/img/users/5.png`)} alt="" />
        //       </li>
        //       <li>
        //         <img src={require(`../../../static/img/users/6.png`)} alt="" />
        //       </li>
        //       <li>
        //         <img src={require(`../../../static/img/users/7.png`)} alt="" />
        //       </li>
        //     </ul>
        //   </ProjectListAssignees>
        // ),
        status: <Tag className={status}>{status}</Tag>,

        action: (
          <Dropdown
            className="wide-dropdwon"
            content={
              <div>
                <Button onClick={() => onSelected(id)}>Edit</Button>
                <Button onClick={() => onDelete(id)}>Delete</Button>
              </div>
            }
          >
            <Link to="#">
              <FeatherIcon icon="more-horizontal" size={18} />
            </Link>
          </Dropdown>
        ),
      });
    });

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'project',
    },
    {
      title: 'Created Date',
      dataIndex: 'createdDate',
      key: 'createdDate',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: 'image',
      dataIndex: 'image',
      key: 'image',
    },

    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },

    {
      title: 'Permissions',
      dataIndex: 'permissions',
      key: 'permissions',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: '',
      dataIndex: 'action',
      key: 'action',
    },
  ];

  return (
    <Row gutter={25}>
      <Col xs={24}>
        <Cards headless>
          <ProjectList>
            <div className="table-responsive">
              <Table pagination={false} dataSource={dataSource} columns={columns} />
            </div>
          </ProjectList>
        </Cards>
      </Col>
      <Col xs={24} className="pb-30">
        <ProjectPagination>
          {list.length ? (
            <Pagination
              onChange={onHandleChange}
              showSizeChanger
              onShowSizeChange={onShowSizeChange}
              pageSize={10}
              defaultCurrent={1}
              total={40}
            />
          ) : null}
        </ProjectPagination>
      </Col>
    </Row>
  );
}

export default HumanList;
