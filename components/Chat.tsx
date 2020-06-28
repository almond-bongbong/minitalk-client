import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  TextInput,
  TextInputSubmitEditingEventData,
  View
} from 'react-native';
import gql from 'graphql-tag';
import { useMutation, useQuery, useSubscription } from 'react-apollo-hooks';
import withSuspense from '../hoc/withSuspense';
import { Message } from '../types';

const GET_MESSAGES = gql`
  query messages {
    messages {
      id
      text
    }
  }
`;

const SEND_MESSAGE = gql`
  mutation sendMessage($text: String!) {
    sendMessage(text: $text) {
      id
      text
    }
  }
`;

const NEW_MESSAGE = gql`
  subscription newMessage {
    newMessage {
      id
      text
    }
  }
`;

function Chat() {
  const [message, setMessage] = useState('');
  const { data, error } = useQuery(GET_MESSAGES, { suspend: true });
  const [messages, setMessages] = useState(data?.messages || []);
  const newMessageResult = useSubscription(NEW_MESSAGE);
  const newMessage = newMessageResult?.data?.newMessage;
  const [mutationSendMessage] = useMutation(
    SEND_MESSAGE,
    {
      variables: { text: message },
      refetchQueries: [{ query: GET_MESSAGES }],
    },
  );

  useEffect(() => {
    if (newMessage) {
      setMessages((prev: Message[]) => prev.concat(newMessage));
    }
  }, [newMessage]);

  const handleMessage = (text: string) => {
    setMessage(text);
  };

  const onSubmit = async (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>): Promise<void> => {
    try {
      await mutationSendMessage();
      setMessage('');
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <ScrollView
        contentContainerStyle={{
          paddingVertical: 50,
          flex: 1,
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
      >
        {messages.map((m: Message) => (
          <View key={m.id} style={{ marginBottom: 10 }}>
            <Text>{m.text}</Text>
          </View>
        ))}

        <TextInput
          placeholder="Type a message"
          style={{
            marginTop: 50,
            width: '90%',
            borderRadius: 10,
            paddingVertical: 15,
            paddingHorizontal: 10,
            backgroundColor: '#f2f2f2'
          }}
          value={message}
          onChangeText={handleMessage}
          returnKeyType="send"
          onSubmitEditing={onSubmit}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default withSuspense(Chat);