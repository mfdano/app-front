import React, { useState, useEffect, useCallback }from 'react';
import 'antd/dist/antd.css';
import './index.css';
import Api from './Api';
import { Button, Card, Row, Col, Form, Input, Select, InputNumber, Typography, notification } from 'antd';
import { UserAddOutlined, UserOutlined } from '@ant-design/icons';
import { messages, labels } from './copy';
const { Title } = Typography;

function App() {
  const [form] = Form.useForm();
  const [isSending, setIsSending] = useState(false);
  const [userName, setUserName] = useState('');
  const [userAge, setUserAge] = useState(0);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [countryId, setCountryId] = useState(null);
  const [stateId, setStateId] = useState(null);
  const [cityId, setCityId] = useState(null);
  const [isFetchingCountries, setIsFetchingCountries] = useState(true);
  const [isFetchingCities, setIsFetchingCities] = useState(false);
  const [isFetchingStates, setIsFetchingStates] = useState(false);

  const fetchCountries = useCallback(async () => {
    try {
      setIsFetchingCountries(true);
      const _countries = await Api.getCountries();
      setCountries(_countries);
    } catch(e) {
      notification['error']({
        message: messages.errorFetchingTitle,
        description: messages.errorFetchingDescription,
      });
    } finally {
      setIsFetchingCountries(false);
    }
  }, []);

  const fetchStates = useCallback(async () => {
    try {
      setIsFetchingStates(true);
      const _states = await Api.getStates(countryId);
      setStates(_states);
    } catch(e) {
      notification['error']({
        message:  messages.errorFetchingTitle,
        description: messages.errorFetchingDescription,
      });
    } finally {
      setIsFetchingStates(false);
    }
  }, [countryId]);

  const fetchCities = useCallback(async () => {
    try {
      setIsFetchingCities(true);
      const _cities = await Api.getCities(stateId);
      setCities(_cities);
    } catch(e) {
      notification['error']({
        message:  messages.errorFetchingTitle,
        description: messages.errorFetchingDescription,
      });
    } finally {
      setIsFetchingCities(false);
    }
  }, [stateId]);

  const sendUser = useCallback(async () => {
    try {
      await Api.postUser(userName, userAge, cityId);
      notification['success']({
        message: messages.successSendUserTitle,
        description: messages.successSendUserDescription,
      });
    } catch(e) {
      notification['error']({
        message: messages.errorSendUserTitle,
        description: messages.errorSendUserDescription,
      });
    } finally {
      setIsSending(false);
    }
  }, [isSending]);


  useEffect(() => {
    fetchCountries();
    //return () => isComponentMounted = false;
  }, [fetchCountries]);

  useEffect(() => {
    if(countryId !== null) fetchStates();
    //return () => isComponentMounted = false;
  }, [fetchStates, countryId]);

  useEffect(() => {
    if(stateId !== null) fetchCities();
    //return () => isComponentMounted = false;
  }, [fetchCities, stateId]);

  useEffect(() => {
    if(isSending) sendUser();
    //return () => isComponentMounted = false;
  }, [sendUser, isSending]);

  const onFinish = async (values) => {
    setUserName(values.name.trim());
    setUserAge(values.age);
    setIsSending(true);
  };

  const onFinishFailed = (errorInfo) => {
    notification['warning']({
      message: messages.formValidationErrorTitle,
      description: messages.formValidationErrorDescription,
    });
  };

  const onSelectCountry = async (value) => {
    form.resetFields(['states', 'cities']);

    setStates([]);
    setCities([]);
    setCountryId(value);
    setStateId(null);
    setCityId(null);
  };

  const onSelectState = async (value) => {
    form.resetFields(['cities']);
    
    setCities([]);
    setStateId(value);
    setCityId(null);
  };

  const onSelectCity = async (value) => {
    setCityId(value);
  };

  const checkName = (_, value) => {
    const name = typeof value === 'undefined' ? '' : value;
    const isValid = /^[A-Za-záéíóúÁÉÍÓÚ\.\s]+$/.test(name.trim());
    if (isValid) {
      return Promise.resolve();
    }
    return Promise.reject(new Error(messages.errorOnName));
  };

  return (
    <>
    <Row justify="center" align="top">
      <Col xs={{ span: 22 }} sm={{ span: 20 }} md={{ span: 20 }} lg={{ span: 20 }} xl={{ span: 6 }}>
        <Card>
          <Row justify="center">
            <Col>
              <UserAddOutlined style={{ fontSize: '172px', color: '#008dff' }} />
            </Col>
          </Row>
          <Row justify="center">
            <Col>
              <Title>{ labels.formTitle }</Title>
            </Col>
          </Row>
          <Form
            name="add_user"
            form={ form }
            labelCol={{ span: 0 }}
            wrapperCol={{ span: 24 }}
            initialValues={{ remember: false }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            size="large"
          >

            <Form.Item
              name="name"
              rules={[
                {
                  validator: checkName
                },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder={ labels.inputNamePhldr } disabled={ isSending } id='input-name' />
            </Form.Item>

            <Form.Item name="age"
              rules={[
                { type: 'number', min: 18, max: 99, required: true, message: messages.errorOnAge }
              ]}>
              <InputNumber placeholder={ labels.inputAgePhldr } disabled={ isSending } id='input-age' />
            </Form.Item>

            <Form.Item
              name="countries"
              rules={[
                {
                  required: true,
                  message: messages.errorOnCountry,
                },
              ]}
            >
              <Select
                id='countries-select'
                placeholder={ labels.selectCountryPhldr }
                disabled={ isFetchingCountries || isSending || countries.length === 0 }
                loading={ isFetchingCountries }
                onChange={ onSelectCountry }>
                {countries.map(c => (
                  <Select.Option key={c.id} value={c.id} id={c.id}>{c.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="states"
              rules={[
                {
                  required: true,
                  message: messages.errorOnState,
                },
              ]}
            >
              <Select
                id='states-select'
                placeholder={ labels.selectStatePhldr }
                allowClear
                disabled={ countryId === null || isSending }
                loading={ isFetchingStates }
                onChange={ onSelectState }>
                {states.map(s => (
                  <Select.Option key={s.id} value={s.id}>{s.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="cities"
              rules={[
                {
                  required: true,
                  message: messages.errorOnCity,
                },
              ]}
            >
              <Select
                id='cities-select'
                placeholder={ labels.selectCityPhldr }
                allowClear
                disabled={ stateId === null || isSending }
                loading={ isFetchingCities }
                onChange={ onSelectCity }>
                {cities.map(city => (
                  <Select.Option key={city.id} value={city.id}>{city.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item wrapperCol={{ span: 24 }} >
              <Button
                id='send-btn'
                type="primary"
                size="large"
                htmlType="submit"
                style={{ width: '100%'}}
                disabled={ countries.length === 0 || isFetchingCities || isFetchingCountries || isFetchingStates }
                loading={ isSending }>
                Enviar
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
    </>
  );
}

export default App;