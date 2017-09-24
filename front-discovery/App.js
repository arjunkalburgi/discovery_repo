import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ChatBot from 'react-native-chatbot';



var steps = [
                { id: 'start',
                  message: 'What would you like to learn about?',
                  trigger: 'search',
                },{ id: 'search', 
                  user: true, 
                  trigger: 'send' //next_steps()
                },{ id: 'send', 
                  message: get_message(), 
                  trigger: suggestions()
                }
            ];

function get_message() {
  return "hiiiiii"
}

function suggestions() {
  return 'start'
}


export default class App extends React.Component {


  render() {
    return (<View style={styles.container}>
                <ChatBot steps={steps} />
            </View> );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
