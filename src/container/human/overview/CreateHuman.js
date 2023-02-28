import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, Select, Col, Row, DatePicker, Spin, Divider, Space } from 'antd';
import propTypes from 'prop-types';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from '../../../components/buttons/buttons';
import { Modal } from '../../../components/modals/antd-modals';
import { CheckboxGroup } from '../../../components/checkbox/checkbox';
import { BasicFormWrapper } from '../../styled';
import { get, post } from '../../../config/axios';

const { Option } = Select;
const dateFormat = 'MM/DD/YYYY';

function CreateHuman({ selected, levels, setLevels, roles, setRoles, visible, onCancel }) {
  const [form] = Form.useForm();
  const isEdit = selected && visible;
  const inputRef = useRef(null);
  const roleRef = useRef(null);
  const [roleAddOn, setRoleAddOn] = useState('');

  const [levelAddOn, setLevelAddOn] = useState('');

  const onChangeRoleAddOn = (e) => {
    setRoleAddOn(e.target.value);
  };
  const onChangeLevelAddOn = (e) => {
    setLevelAddOn(e.target.value);
  };

  const addLevel = async () => {
    try {
      const res = await post('levels', { levelName: levelAddOn });
      setLevels([...levels, res.data]);
      setLevelAddOn('');
    } catch (error) {}
  };
  const addRole = async () => {
    try {
      const res = await post('roles', { roleName: roleAddOn });
      setLevels([...levels, res.data]);
      setRoleAddOn('');
    } catch (error) {}
  };
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    visible,
    modalType: 'primary',
    checked: [],
  });
  const getDetail = async () => {
    try {
      setLoading(true);
      const res = await get(`/users/${selected}`);
      console.log('res :>> ', res);
      form.setFieldsValue(res.data);
      setLoading(false);
    } catch (error) {}
  };

  useEffect(() => {
    let unmounted = false;
    if (!unmounted) {
      setState({
        visible,
      });
    }
    return () => {
      unmounted = true;
    };
  }, [visible]);
  useEffect(() => {
    if (isEdit) {
      getDetail();
    }
  }, [selected, visible]);

  const handleOk = () => {
    onCancel();
  };

  const handleCancel = () => {
    onCancel();
  };

  const addItem = (e) => {
    e.preventDefault();
    // setItems([...items, name || `New item ${index++}`]);
    // setName('');
    // setTimeout(() => {
    //   inputRef.current?.focus();
    // }, 0);
  };

  return (
    <Modal
      type={state.modalType}
      title="Create Project"
      visible={state.visible}
      footer={[
        <div key="1" className="project-modal-footer">
          <Button size="default" type="primary" key="submit" onClick={handleOk}>
            Add New Project
          </Button>
          <Button size="default" type="white" key="back" outlined onClick={handleCancel}>
            Cancel
          </Button>
        </div>,
      ]}
      onCancel={handleCancel}
    >
      <div className="project-modal">
        {loading ? (
          <div className="spin">
            <Spin />
          </div>
        ) : (
          <BasicFormWrapper>
            <Form form={form} name="createProject" onFinish={handleOk}>
              <Form.Item
                name="name"
                label=""
                rules={[
                  {
                    required: true,
                    message: 'Please input name!',
                  },
                ]}
              >
                <Input placeholder="Name" />
              </Form.Item>
              <Form.Item
                name="gender"
                label=""
                rules={[
                  {
                    required: true,
                    message: 'Please select gender!',
                  },
                ]}
              >
                <Select placeholder="Gender" allowClear style={{ width: '100%' }}>
                  <Option value="Male">Male</Option>
                  <Option value="Female">Female One</Option>
                  <Option value="Other">Other Two</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="level"
                label=""
                rules={[
                  {
                    required: true,
                    message: 'Please select level!',
                  },
                ]}
              >
                <Select
                  placeholder="Level"
                  allowClear
                  style={{ width: '100%' }}
                  options={levels.map((item) => ({
                    label: item.levelName,
                    value: item.id,
                  }))}
                  dropdownRender={(menu) => (
                    <>
                      {menu}
                      <Divider style={{ margin: '8px 0' }} />
                      <Space style={{ padding: '0 8px 4px' }}>
                        <Input
                          placeholder="Please enter item"
                          ref={inputRef}
                          value={levelAddOn}
                          onChange={onChangeLevelAddOn}
                        />
                        <Button icon={<PlusOutlined />} onClick={addLevel}>
                          Add item
                        </Button>
                      </Space>
                    </>
                  )}
                ></Select>
              </Form.Item>
              <Form.Item
                name="role"
                label=""
                rules={[
                  {
                    required: true,
                    message: 'Please select role!',
                  },
                ]}
              >
                <Select placeholder="Role" allowClear style={{ width: '100%' }}>
                  {roles.map((role) => (
                    <Option value={role?.id}> {role?.roleName}</Option>
                  ))}
                  <Divider style={{ margin: '8px 0' }} />
                  <Space style={{ padding: '0 8px 4px' }}>
                    <Input
                      placeholder="Please enter item"
                      ref={roleRef}
                      value={roleAddOn}
                      onChange={onChangeRoleAddOn}
                    />
                    <Button type="text" icon={<PlusOutlined />} onClick={addRole}>
                      Add item
                    </Button>
                  </Space>
                </Select>
              </Form.Item>
              <Form.Item name="phoneNumber" label="">
                <Input placeholder="Phone number" />
              </Form.Item>
              <Form.Item
                name="email"
                label=""
                rules={[
                  {
                    type: 'email',
                    message: 'The input is not valid E-mail!',
                  },
                  {
                    required: true,
                    message: 'Please input your E-mail!',
                  },
                ]}
              >
                <Input placeholder="Email" />
              </Form.Item>
              <Form.Item
                name="address"
                label=""
                rules={[
                  {
                    required: true,
                    message: 'Please input address!',
                  },
                ]}
              >
                <Input placeholder="Address" />
              </Form.Item>
              <Form.Item
                name="password"
                label="Password"
                rules={[
                  {
                    required: true,
                    message: 'Please input your password!',
                  },
                ]}
                hasFeedback
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="confirmPassword"
                label="New Password"
                initialValue={form.getFieldValue('password')}
                rules={[
                  {
                    required: true,
                    message: 'Please confirm your password!',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('The two passwords that you entered do not match!'));
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item name="name" label="">
                <Input placeholder="Name" />
              </Form.Item>
              <Form.Item name="name" label="">
                <Input placeholder="Name" />
              </Form.Item>
              <Form.Item name="name" label="">
                <Input placeholder="Name" />
              </Form.Item>
              {/* <Form.Item name="category" initialValue="" label="">
                <Select style={{ width: '100%' }}>
                  <Option value="">Project Category</Option>
                  <Option value="one">Project One</Option>
                  <Option value="two">Project Two</Option>
                </Select>
              </Form.Item>
              <Form.Item name="description" label="">
                <Input.TextArea rows={4} placeholder="Project Description" />
              </Form.Item>
              <Form.Item name="pricacy" initialValue={['team']} label="Project Privacy">
                <CheckboxGroup options={options} />
              </Form.Item>
              <Form.Item name="members" label="Project Members">
                <Input placeholder="Search Members" />
              </Form.Item>
              <div className="projects-members mb-30">
                <img style={{ width: '35px' }} src={require(`../../../static/img/users/1.png`)} alt="" />
                <img style={{ width: '35px' }} src={require(`../../../static/img/users/2.png`)} alt="" />
                <img style={{ width: '35px' }} src={require(`../../../static/img/users/3.png`)} alt="" />
                <img style={{ width: '35px' }} src={require(`../../../static/img/users/4.png`)} alt="" />
                <img style={{ width: '35px' }} src={require(`../../../static/img/users/5.png`)} alt="" />
              </div>
              <Row gutter={15}>
                <Col md={12}>
                  <Form.Item name="start" label="Start Date">
                    <DatePicker placeholder="mm/dd/yyyy" format={dateFormat} />
                  </Form.Item>
                </Col>
                <Col md={12}>
                  <Form.Item name="end" label="End Date">
                    <DatePicker placeholder="mm/dd/yyyy" format={dateFormat} />
                  </Form.Item>
                </Col>
              </Row> */}
            </Form>
          </BasicFormWrapper>
        )}
      </div>
    </Modal>
  );
}

CreateHuman.propTypes = {
  visible: propTypes.bool.isRequired,
  onCancel: propTypes.func.isRequired,
};

export default CreateHuman;
