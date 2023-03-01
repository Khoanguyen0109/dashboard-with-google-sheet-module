import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, Select, Col, Row, DatePicker, Spin, Divider, Space, Upload, message } from 'antd';
import propTypes from 'prop-types';
import { PlusOutlined } from '@ant-design/icons';
import FeatherIcon from 'feather-icons-react';
import { Button } from '../../../components/buttons/buttons';
import { Modal } from '../../../components/modals/antd-modals';
import { BasicFormWrapper } from '../../styled';
import { get, post, patch } from '../../../config/axios';
import { ACCESS_TOKEN, PERMISSIONS, USER_STATUS } from '../../../contants';
import Heading from '../../../components/heading/heading';
import { getItem } from '../../../utility/localStorageControl';

const { Dragger } = Upload;

const { Option } = Select;
const beforeUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};
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
  const [creating, setCreating] = useState(false);
  const [image, setImage] = useState(null);
  console.log('image :>> ', image);
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
      setRoles([...levels, res.data]);
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
      setImage({
        uid: res.data.imageId,
        name: res.data.imageName,
        thumbUrl: `https://drive.google.com/uc?export=view&id=${res.data.imageId}`,
      });
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
    try {
      setCreating(true);
      if (!isEdit) {
        const res = await post('users', {
          ...form.getFieldsValue(),
          ...image,
        });
        onAdd(res.data);
      } else {
        const res = await patch(`users/${selected}`, {
          ...form.getFieldsValue(),
          ...image,
          permissions: form.getFieldValue('permissions').toString(),
        });
        onUpdate(res.data);
      }
      form.resetFields();
      setSelected(null);
      setImage([]);
      onCancel();
    } catch (error) {
    } finally {
      setCreating(false);
    }
  };
  console.log('image', image);
  const handleCancel = () => {
    form.resetFields();
    setSelected(null);
    setImage([]);
    onCancel();
  };
  const handleChange = (value) => {
    console.log('value', value);
    form.setFieldValue('permissions', value.join(','));
  };
  console.log('form :>> ', form.getFieldsValue());
  const fileUploadProps = {
    name: 'files',
    multiple: false,
    action: `${process.env.REACT_APP_API_ENDPOINT}/upload`,
    headers: {
      Authorization: `Bearer ${getItem(ACCESS_TOKEN)}`,
    },
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        // setState({ ...state, file: info.file, list: info.fileList });
      }
      if (status === 'done') {
        setImage({
          imageId: info.file.response.id,
          imageName: info.file.name,
          thumbUrl: `https://drive.google.com/uc?export=view&id=${info.file.response.id}`,
        });
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    fileList: image ? [image] : [],
    beforeUpload,
    maxCount: 1,
    listType: 'picture',
    showUploadList: {
      showRemoveIcon: true,
      removeIcon: <FeatherIcon icon="trash-2" onClick={(e) => console.log(e, 'custom removeIcon event')} />,
    },
  };

  return (
    <Modal
      on
      type={state.modalType}
      title="Create Project"
      visible={state.visible}
      footer={[
        <div key="1" className="project-modal-footer">
          <Button size="default" loading={creating} type="primary" key="submit" onClick={handleOk}>
            {isEdit ? 'Save' : 'Create'}
          </Button>
          <Button size="default" type="white" key="back" outlined onClick={handleCancel}>
            Cancel
          </Button>
        </div>,
      ]}
      maskClosable={false}
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
              <Dragger {...fileUploadProps}>
                <p className="ant-upload-drag-icon">
                  <FeatherIcon icon="upload" size={50} />
                </p>
                <Heading as="h4" className="ant-upload-text">
                  Drag and drop an image
                </Heading>
                <p className="ant-upload-hint">
                  or <span>Browse</span> to choose a file
                </p>
              </Dragger>
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
                  defaultValue={isEdit ? form.getFieldValue('status') : USER_STATUS.ACTIVE}
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
