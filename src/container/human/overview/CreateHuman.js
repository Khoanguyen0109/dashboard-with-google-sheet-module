import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, Select, Col, Row, DatePicker, Spin, Divider, Space } from 'antd';
import propTypes from 'prop-types';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from '../../../components/buttons/buttons';
import { Modal } from '../../../components/modals/antd-modals';
import { CheckboxGroup } from '../../../components/checkbox/checkbox';
import { BasicFormWrapper } from '../../styled';
import { get, post, patch } from '../../../config/axios';
import { PERMISSIONS, USER_STATUS } from '../../../contants';

const { Option } = Select;
const dateFormat = 'MM/DD/YYYY';

function CreateHuman({
  selected,
  setSelected,
  levels,
  onAdd,
  onUpdate,
  setLevels,
  roles,
  setRoles,
  visible,
  onCancel,
}) {
  const [form] = Form.useForm();
  const isEdit = selected && visible;
  const inputRef = useRef(null);
  const roleRef = useRef(null);
  const [roleAddOn, setRoleAddOn] = useState('');
  const [levelAddOn, setLevelAddOn] = useState('');
  const [creating, setCreating] = useState(false)
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
      res.data.permissions = res.data.permissions.split(',');
      console.log('res.data', res.data);
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

  const handleOk = async () => {
    setCreating(true)
    if (!isEdit) {
      const res = await post('users', {
        ...form.getFieldsValue(),
      });
      onAdd(res.data);
    } else {
      const res = await patch('users', {
        ...form.getFieldsValue(),
      });
      onUpdate(res.data);
    }
    form.resetFields();
    setSelected(null);
    setCreating(false)
    onCancel();
  };

  const handleCancel = () => {
    form.setFieldValue({});
    setSelected(null);
    onCancel();
  };
  const handleChange = (value) => {
    console.log('value', value);
    form.setFieldValue('permissions', value.join(','));
  };

  return (
    <Modal
      type={state.modalType}
      title="Create Project"
      visible={state.visible}
      footer={[
        <div key="1" className="project-modal-footer">
          <Button size="default" loading={creating} type="primary" key="submit" onClick={handleOk}>
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
              <Form.Item
                name="phoneNumber"
                label=""
                rules={[
                  {
                    required: true,
                    message: 'Please input phone number!',
                  },
                ]}
              >
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
              <Form.Item name="password" label="Password" hasFeedback>
                <Input />
              </Form.Item>
              <Form.Item
                name="confirmPassword"
                label="New Password"
                initialValue={form.getFieldValue('password')}
                rules={[
                  !isEdit && {
                    required: true,
                    message: 'Please select gender!',
                  },
                  { min: 5, message: 'Password must be minimum 8 characters.' },
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
              <Form.Item name="permissions" label="">
                <Select
                  mode="multiple"
                  placeholder="Permissions"
                  allowClear
                  defaultValue={form.getFieldValue('permissions')}
                  style={{ width: '100%' }}
                  onChange={handleChange}
                  options={PERMISSIONS.map((item) => ({
                    label: item.label,
                    value: item.value,
                  }))}
                ></Select>{' '}
              </Form.Item>
              <Form.Item name="status" label="">
                <Select
                  placeholder="Status"
                  allowClear
                  style={{ width: '100%' }}
                  onChange={handleChange}
                  options={Object.keys(USER_STATUS).map((key) => ({
                    label: key,
                    value: USER_STATUS[key],
                  }))}
                ></Select>{' '}
              </Form.Item>
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
