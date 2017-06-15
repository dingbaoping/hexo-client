import _ from 'underscore';
import React from 'react'
import { Button, Tabs, Form, Input } from 'element-react';
import execute from '../utilities/socket.es6';

const rules = {
  prefix: [
    { required: true, message: '请设置博客路径', trigger: 'blur' }
  ],
  url: [
    { required: true, message: '请设置博客地址', trigger: 'blur' }
  ]
};

class InstallView extends React.Component {
  constructor(props) {
    super( props );

    this.state = {
      url: '',
      prefix: '',
      pending: false
    };
  }

  redirect2index(code) {
    this.setState({
      pending: false
    });

    if (code === 200) {
      this.props.router.replace({
        pathname: '/'
      });
    }
  }

  handleChangeDir(prefix) {
    execute({
      $type: 'window.dialog',
      title: '设置博客路径',
      properties: ['openDirectory']
    })
    .then(({result: prefix}) => {
      this.setState({ prefix });
    });
  }

  handleSetBlogURL(url) {
    this.setState({ url });
  }

  handleSaveSetting(form, event) {
    event.preventDefault();

    const isNewForm = form === 'form-new';

    if (isNewForm) {
      this.setState({
        pending: true
      });
    }

    this.refs[form].validate((valid) => {
      if (valid === false) return;

      let setting = _.omit(this.state, 'pending');

      execute({
        $type: 'setting.set',
        setting
      }).then(({code}) => {
        if ( isNewForm ) {
          return execute({
            $type: 'blog.copy'
          });
        }

        this.redirect2index(code);
      }).then(({code}) => {
        this.redirect2index(code);
      });
    });
  }

  handleSwitchTab(tab) {
    if (tab.props.name === '2') {
      this.state.url = '';
    }
  }

  render() {
    return (
      <div className="flex-col-1 flex-items-center install-container">
        <div className="flex-center">
          <Tabs onTabClick={ this.handleSwitchTab.bind(this) }>
            <Tabs.Pane label="已有博客" name="1">
              <Form ref="form-exists" model={ this.state } labelPosition="right" labelWidth="92" rules={ rules }>
                <Form.Item prop="prefix" label="博客路径：">
                  <Input placeholder="请设置博客路径" size="small" value={ this.state.prefix } readOnly append={ <Button onClick={ this.handleChangeDir.bind(this) }>选择</Button> } />
                </Form.Item>

                <Form.Item prop="url" label="博客地址：">
                  <Input placeholder="请设置博客地址" size="small" value={ this.state.url } onChange={ this.handleSetBlogURL.bind(this) } />
                </Form.Item>

                <Form.Item labelWidth="0">
                  <Button type="primary" size="small" nativeType="submit" onClick={ this.handleSaveSetting.bind(this, 'form-exists') }>开始写作</Button>
                </Form.Item>
              </Form>
            </Tabs.Pane>

            <Tabs.Pane label="新建博客" name="2">
              <Form ref="form-new" model={ this.state } labelPosition="right" labelWidth="92" rules={ rules }>
                <Form.Item prop="prefix" label="博客路径：">
                  <Input placeholder="请设置博客路径" size="small" value={ this.state.prefix } readOnly append={ <Button onClick={ this.handleChangeDir.bind(this) }>选择</Button> } />
                </Form.Item>

                <Form.Item labelWidth="0">
                  <Button type="primary" size="small" nativeType="submit" onClick={ this.handleSaveSetting.bind(this, 'form-new') } loading={ this.state.pending }>开始写作</Button>
                </Form.Item>
              </Form>
            </Tabs.Pane>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default InstallView;