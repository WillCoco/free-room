import { Button, Form, Input } from 'antd';
import { Client } from 'communication';
import { nanoid } from 'nanoid';
import React from 'react';

const roomId = 'bTWkAMaGWLyjH59hsrz5t45Cf5KGVKBCMY1';

export default () => {
  const person = React.useRef(
    new Client({
      publicKey: roomId,
      options: {
        seed:
          localStorage.getItem('bugout_seed') ||
          'BogW3xZaNSkNkurm8DXaj8Q1M83ea7VNEiGvkbnEsbLQcNQzNeYo',
        announce: [
          'wss://hub.bugout.link',
          'wss://tracker.openwebtorrent.com',
          'wss://tracker.btorrent.xyz',
          'wss://qot.abiir.top:443/announce',
          'wss://tracker.btorrent.xyz',
          'wss://peertube.cpy.re:443/tracker/socket',
        ],
      },
    }),
  );

  const [form] = Form.useForm();
  const [msgList, setMsgList] = React.useState<any[]>([]);
  const [memberList, setMemberList] = React.useState<any[]>([]);
  const [memberCount, setMemberCount] = React.useState<number>(0);

  console.log(person);
  React.useEffect(() => {
    const { bugout } = person.current;
    if (!bugout) return;
    localStorage.setItem('bugout_seed', bugout.seed);
    bugout.on('wireseen', setMemberCount);
    bugout.on('wireleft', setMemberCount);

    bugout.on('message', (address: string, value: any) => {
      setMsgList((m) => [
        ...m,
        {
          id: nanoid(),
          address,
          value: value || '',
        },
      ]);
    });

    bugout.on('seen', (address: string, value: any) => {
      console.log('seen', address);
      setMemberList((ms) => [...ms, address]);
    });
  }, []);

  const sendMsg = () => {
    const { bugout } = person.current;
    if (!bugout) return;
    const value = form.getFieldValue('msg');
    bugout.send(value);
    form.resetFields();
  };

  return (
    <div>
      {<div>在线人数：{memberCount}</div>}
      {msgList.map((msg, i) => {
        return (
          <div key={msg?.id || i}>
            <div>{msg?.value}</div>
            <div>from {msg?.address}</div>
          </div>
        );
      })}
      <Form form={form}>
        <Form.Item name="msg">
          <Input style={{ width: 'calc(100% - 200px)' }} />
        </Form.Item>
        <Button type="primary" onClick={sendMsg}>
          发送
        </Button>
      </Form>
    </div>
  );
};
