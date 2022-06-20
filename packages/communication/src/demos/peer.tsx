import { Button, Form, Input } from 'antd';
import Peer from 'peerjs';
import React from 'react';

const roomId = 'bTWkAMaGWLyjH59hsrz5t45Cf5KGVKBCMY1';

export default () => {
  const peer = React.useRef();
  const conn = React.useRef(null);
  const localVideoRef = React.useRef(null);
  const remoteVideoRef = React.useRef(null);

  const [form] = Form.useForm();
  const [localStream, setLocalStream] = React.useState<any>();
  const [msgList, setMsgList] = React.useState<any[]>([]);
  const [memberList, setMemberList] = React.useState<any[]>([]);
  const [memberCount, setMemberCount] = React.useState<number>(0);

  React.useEffect(() => {
    // if (!conn.current) return;
    peer.current = new Peer(window.location.hash.substring(1) || '123');
    peer.current.on('open', function (id) {
      console.log('My peer ID is: ' + id);
      peer.current.on('data', function (data) {
        console.log('Received', data);
      });
    });
    peer.current.on('connection', function (conn) {
      console.log(conn, 'connection');
    });

    peer.current.on('call', function (call) {
      // Answer the call, providing our mediaStream
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
        call.answer(stream); // Answer the call with an A/V stream.
        call.on('stream', (remoteStream) => {
          console.log(remoteStream, 'call接受stream');

          if ('srcObject' in remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = stream;
          } else {
            // 在支持srcObject的浏览器上，不再支持使用这种方式
            remoteVideoRef.current.src = URL.createObjectURL(stream);
          }
          remoteVideoRef.current.play();
          // Show stream in some <video> element.
        });
      });
    });
  }, []);

  const sendMsg = () => {
    const { bugout } = peer.current;
    if (!bugout) return;
    const value = form.getFieldValue('msg');
    bugout.send(value);
    form.resetFields();
  };

  const call = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        console.log(stream, 'stream');
        console.log(localVideoRef.current, 'stream');
        if ('srcObject' in localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        } else {
          // 在支持srcObject的浏览器上，不再支持使用这种方式
          localVideoRef.current.src = URL.createObjectURL(stream);
        }
        localVideoRef.current.play();
        const call = peer.current.call('222', stream);
        call.on('stream', (remoteStream) => {
          // Show stream in some <video> element.
          console.log(remoteStream, '接受stream');
          if ('srcObject' in remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = stream;
          } else {
            // 在支持srcObject的浏览器上，不再支持使用这种方式
            remoteVideoRef.current.src = URL.createObjectURL(stream);
          }
          remoteVideoRef.current.play();
        });
      })
      .catch(console.warn);
  };

  return (
    <div>
      <video ref={localVideoRef}></video>
      <video ref={remoteVideoRef}></video>
      <Form form={form}>
        <Form.Item name="msg">
          <Input style={{ width: 'calc(100% - 200px)' }} />
        </Form.Item>
        <Button type="primary" onClick={call}>
          发送
        </Button>
      </Form>
    </div>
  );
};
